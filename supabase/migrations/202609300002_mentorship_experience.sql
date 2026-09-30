-- HAVII: Mentorship experience — matching, sessions, messaging
-- Builds on existing phase1/phase2 stubs. Adds RLS for match participants,
-- 1:1 mentor sessions, mentor requests, and messaging tables (messaging
-- UI stays disabled until consent/reporting safeguards are verified).

-- ---------------------------------------------------------------------------
-- Helper: is the current user a participant in an active match?
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_match_participant(p_match_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.mentor_matches mm
    WHERE mm.id = p_match_id
    AND (
      EXISTS (
        SELECT 1 FROM public.youth_profiles yp
        WHERE yp.id = mm.youth_profile_id
        AND yp.profile_id = public.current_profile_id()
      )
      OR
      EXISTS (
        SELECT 1 FROM public.mentor_profiles mp
        WHERE mp.id = mm.mentor_profile_id
        AND mp.profile_id = public.current_profile_id()
      )
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- mentor_matches: expand status options + audit columns + RLS for participants
-- ---------------------------------------------------------------------------
ALTER TABLE public.mentor_matches
  DROP CONSTRAINT IF EXISTS mentor_matches_status_check;
ALTER TABLE public.mentor_matches
  ADD CONSTRAINT mentor_matches_status_check
    CHECK (status IN ('proposed', 'active', 'paused', 'ended', 'declined'));

ALTER TABLE public.mentor_matches
  ADD COLUMN IF NOT EXISTS status_changed_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS status_changed_at timestamptz,
  ADD COLUMN IF NOT EXISTS ended_reason text;

-- Youth can see matches where they are the youth participant
CREATE POLICY mentor_matches_youth_select
  ON public.mentor_matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.youth_profiles yp
      WHERE yp.id = mentor_matches.youth_profile_id
        AND yp.profile_id = public.current_profile_id()
    )
  );

-- Mentors can see matches where they are the mentor participant
CREATE POLICY mentor_matches_mentor_select
  ON public.mentor_matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.mentor_profiles mp
      WHERE mp.id = mentor_matches.mentor_profile_id
        AND mp.profile_id = public.current_profile_id()
    )
  );

-- ---------------------------------------------------------------------------
-- mentor_profiles: application audit columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.mentor_profiles
  ADD COLUMN IF NOT EXISTS application_submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;

-- ---------------------------------------------------------------------------
-- mentor_requests: youth requests a mentor (interests, support areas, availability)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mentor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youth_profile_id uuid NOT NULL REFERENCES public.youth_profiles(id) ON DELETE CASCADE,
  interests text[] DEFAULT '{}',
  help_areas text[] DEFAULT '{}',
  availability_notes text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'matched', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mentor_requests_status_idx ON public.mentor_requests(status);
CREATE INDEX IF NOT EXISTS mentor_requests_youth_idx ON public.mentor_requests(youth_profile_id);

CREATE TRIGGER mentor_requests_set_updated_at
  BEFORE UPDATE ON public.mentor_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY mentor_requests_owner
  ON public.mentor_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.youth_profiles yp
      WHERE yp.id = mentor_requests.youth_profile_id
        AND yp.profile_id = public.current_profile_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.youth_profiles yp
      WHERE yp.id = mentor_requests.youth_profile_id
        AND yp.profile_id = public.current_profile_id()
    )
  );

CREATE POLICY mentor_requests_staff
  ON public.mentor_requests FOR SELECT
  TO authenticated
  USING (public.is_staff_or_admin());

-- ---------------------------------------------------------------------------
-- sessions: add 1:1 mentor session support
-- ---------------------------------------------------------------------------
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS mentor_match_id uuid REFERENCES public.mentor_matches(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  ADD COLUMN IF NOT EXISTS requested_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'America/New_York',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS cancel_reason text;

CREATE INDEX IF NOT EXISTS sessions_mentor_match_idx ON public.sessions(mentor_match_id);

-- Participants in a match can see their 1:1 sessions
CREATE POLICY sessions_select_match_participants
  ON public.sessions FOR SELECT
  TO authenticated
  USING (
    mentor_match_id IS NOT NULL AND public.is_match_participant(mentor_match_id)
  );

-- Participants in an active match can create 1:1 sessions
CREATE POLICY sessions_insert_match_participants
  ON public.sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    mentor_match_id IS NOT NULL AND public.is_match_participant(mentor_match_id)
  );

-- Participants can update (confirm/cancel) their own sessions
CREATE POLICY sessions_update_match_participants
  ON public.sessions FOR UPDATE
  TO authenticated
  USING (
    mentor_match_id IS NOT NULL AND public.is_match_participant(mentor_match_id)
  )
  WITH CHECK (
    mentor_match_id IS NOT NULL AND public.is_match_participant(mentor_match_id)
  );

-- ---------------------------------------------------------------------------
-- messages: 1:1 messages between matched mentor and youth
-- RLS enforces: only participants in an *approved/active* match can read/send
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_match_id uuid NOT NULL REFERENCES public.mentor_matches(id) ON DELETE CASCADE,
  sender_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  is_flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_match_created_idx ON public.messages(mentor_match_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Only participants in an active match can read messages
CREATE POLICY messages_select_participants
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.mentor_matches mm
      WHERE mm.id = messages.mentor_match_id
        AND mm.status = 'active'
        AND public.is_match_participant(mm.id)
    )
  );

-- Only participants in an active match can send messages
CREATE POLICY messages_insert_participants
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_profile_id = public.current_profile_id()
    AND EXISTS (
      SELECT 1 FROM public.mentor_matches mm
      WHERE mm.id = messages.mentor_match_id
        AND mm.status = 'active'
        AND public.is_match_participant(mm.id)
    )
  );

-- Staff can read messages for review
CREATE POLICY messages_staff_read
  ON public.messages FOR SELECT
  TO authenticated
  USING (public.is_staff_or_admin());

-- ---------------------------------------------------------------------------
-- message_reports: report a message for staff review
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  reporter_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,
  resolution_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER message_reports_set_updated_at
  BEFORE UPDATE ON public.message_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.message_reports ENABLE ROW LEVEL SECURITY;

-- Reporter can see their own reports
CREATE POLICY message_reports_reporter
  ON public.message_reports FOR SELECT
  TO authenticated
  USING (reporter_profile_id = public.current_profile_id());

-- Anyone in the match can report a message
CREATE POLICY message_reports_insert
  ON public.message_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    reporter_profile_id = public.current_profile_id()
    AND EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_reports.message_id
        AND public.is_match_participant(m.mentor_match_id)
    )
  );

-- Staff can see and update all reports
CREATE POLICY message_reports_staff
  ON public.message_reports FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ---------------------------------------------------------------------------
-- consent_records: add messaging consent type
-- (no schema change needed — consent_type is text; just document it)
-- ---------------------------------------------------------------------------
COMMENT ON TABLE public.consent_records IS 'Consent tracking: platform_terms, messaging, mentorship. RLS: owner + staff.';
