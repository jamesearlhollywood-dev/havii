-- Caregiver invitation and consent process
-- Extends the existing profiles table and adds three new tables.

-- ---------------------------------------------------------------------------
-- profiles: add role column (distinguish youth from caregiver accounts)
-- ---------------------------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'youth'
  CHECK (role IN ('youth', 'caregiver'));

-- Caregivers do not need a date of birth
ALTER TABLE profiles ALTER COLUMN date_of_birth DROP NOT NULL;

-- Add 'caregiver_declined' to the consent_status check
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_consent_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_consent_status_check
  CHECK (consent_status IN ('pending','self_consented','pending_caregiver','caregiver_consented','caregiver_declined'));

-- ---------------------------------------------------------------------------
-- caregiver_invitations — expiring, single-use invitations from youth to caregiver
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS caregiver_invitations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youth_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_name  TEXT NOT NULL,
  caregiver_email TEXT NOT NULL,
  token_hash      TEXT NOT NULL UNIQUE,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'used', 'expired', 'revoked')),
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS caregiver_invitations_youth_idx ON caregiver_invitations(youth_user_id, status);
CREATE INDEX IF NOT EXISTS caregiver_invitations_token_idx ON caregiver_invitations(token_hash);

CREATE TRIGGER caregiver_invitations_set_updated_at
  BEFORE UPDATE ON caregiver_invitations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- caregiver_links — consent relationships between a caregiver and a youth
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS caregiver_links (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youth_user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invitation_id            UUID REFERENCES caregiver_invitations(id) ON DELETE SET NULL,
  consent_decision         TEXT NOT NULL DEFAULT 'approved'
                           CHECK (consent_decision IN ('approved', 'declined', 'withdrawn')),
  consent_document_version TEXT NOT NULL,
  consented_at             TIMESTAMPTZ,
  declined_at              TIMESTAMPTZ,
  withdrawn_at             TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(youth_user_id, caregiver_user_id)
);

CREATE INDEX IF NOT EXISTS caregiver_links_youth_idx ON caregiver_links(youth_user_id);
CREATE INDEX IF NOT EXISTS caregiver_links_caregiver_idx ON caregiver_links(caregiver_user_id);

CREATE TRIGGER caregiver_links_set_updated_at
  BEFORE UPDATE ON caregiver_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- consent_audit — audit trail for all consent-related actions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consent_audit (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  youth_user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action            TEXT NOT NULL,
  details           JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS consent_audit_youth_idx ON consent_audit(youth_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS consent_audit_actor_idx ON consent_audit(actor_user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE caregiver_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY caregiver_invitations_rls ON caregiver_invitations FOR ALL USING (
  youth_user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
);

ALTER TABLE caregiver_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY caregiver_links_rls ON caregiver_links FOR ALL USING (
  youth_user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
  OR caregiver_user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
);

ALTER TABLE consent_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY consent_audit_rls ON consent_audit FOR ALL USING (
  youth_user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
  OR actor_user_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
);
