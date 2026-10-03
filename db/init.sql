-- HAVII foundation schema
-- Users (auth), profiles (onboarding/consent), check_ins (daily mood)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Updated-at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- users — auth accounts (email + password hash)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- ---------------------------------------------------------------------------
-- profiles — onboarding, consent, eligibility
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  preferred_name     TEXT NOT NULL,
  date_of_birth      DATE NOT NULL,
  timezone           TEXT NOT NULL DEFAULT 'UTC',
  -- consent_status: pending → self_consented (18+) | pending_caregiver (13-17) | caregiver_consented
  consent_status     TEXT NOT NULL DEFAULT 'pending'
                       CHECK (consent_status IN ('pending','self_consented','pending_caregiver','caregiver_consented')),
  consented_at       TIMESTAMPTZ,
  -- eligibility_status: pending → eligible | ineligible
  eligibility_status TEXT NOT NULL DEFAULT 'pending'
                       CHECK (eligibility_status IN ('pending','eligible','ineligible')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- check_ins — one per user per calendar day
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS check_ins (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood           TEXT NOT NULL CHECK (mood IN ('great','good','okay','low','struggling')),
  note           TEXT,
  check_in_date  DATE NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, check_in_date)
);

CREATE INDEX IF NOT EXISTS check_ins_user_id_idx ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS check_ins_user_date_idx ON check_ins(user_id, check_in_date DESC);

CREATE TRIGGER check_ins_set_updated_at
  BEFORE UPDATE ON check_ins
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-Level Security (defense in depth — server actions also enforce ownership)
-- ---------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- All access is via server-side connections using the application role.
-- Server actions enforce per-user ownership before any query.
-- RLS policies below add a safety net using a session variable set per transaction.

CREATE POLICY users_rls ON users FOR ALL USING (
  id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
);
CREATE POLICY profiles_rls ON profiles FOR ALL USING (
  user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
);
CREATE POLICY check_ins_rls ON check_ins FOR ALL USING (
  user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
);
