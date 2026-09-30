-- HAVII: Onboarding consent + youth dashboard feature columns
-- Adds consent tracking to profiles and enhances stub tables for real use.

-- ---------------------------------------------------------------------------
-- Profiles: consent fields for onboarding
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS consent_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS caregiver_consent_status text NOT NULL DEFAULT 'not_required'
    CHECK (caregiver_consent_status IN ('not_required', 'pending', 'provided', 'declined'));

-- ---------------------------------------------------------------------------
-- emotional_checkins: add mood_level for structured mood tracking
-- (mood text already exists; mood_level gives a 1-5 scale for quick check-ins)
-- ---------------------------------------------------------------------------
ALTER TABLE public.emotional_checkins
  ADD COLUMN IF NOT EXISTS mood_level smallint CHECK (mood_level BETWEEN 1 AND 5);

-- ---------------------------------------------------------------------------
-- goals: add target_date and progress for better goal tracking
-- ---------------------------------------------------------------------------
ALTER TABLE public.goals
  ADD COLUMN IF NOT EXISTS target_date date,
  ADD COLUMN IF NOT EXISTS progress smallint NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100);

-- Ensure goals set_updated_at trigger exists
DROP TRIGGER IF EXISTS goals_set_updated_at ON public.goals;
CREATE TRIGGER goals_set_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Ensure journal_entries set_updated_at trigger exists
DROP TRIGGER IF EXISTS journal_entries_set_updated_at ON public.journal_entries;
CREATE TRIGGER journal_entries_set_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Ensure emotional_checkins has an index for owner queries
CREATE INDEX IF NOT EXISTS emotional_checkins_profile_created_idx
  ON public.emotional_checkins(profile_id, created_at DESC);

-- Ensure goals has an index for owner queries
CREATE INDEX IF NOT EXISTS goals_profile_idx ON public.goals(profile_id);

-- Ensure journal_entries has an index for owner queries
CREATE INDEX IF NOT EXISTS journal_entries_profile_created_idx
  ON public.journal_entries(profile_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- youth_profiles: caregiver contact for minors (consent flow)
-- ---------------------------------------------------------------------------
ALTER TABLE public.youth_profiles
  ADD COLUMN IF NOT EXISTS caregiver_name text,
  ADD COLUMN IF NOT EXISTS caregiver_email text,
  ADD COLUMN IF NOT EXISTS caregiver_relationship text;
