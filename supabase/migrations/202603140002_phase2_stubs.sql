-- HAVII Phase 2+ stub tables
-- Empty structure with RLS enabled. Deny-all for authenticated by default,
-- or owner/staff-only stubs. Do NOT implement Phase 2 features here.

-- ---------------------------------------------------------------------------
-- caregiver_relationships (explicit youth–caregiver links; Phase 2+)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.caregiver_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_profile_id uuid NOT NULL REFERENCES public.caregiver_profiles(id) ON DELETE CASCADE,
  youth_profile_id uuid NOT NULL REFERENCES public.youth_profiles(id) ON DELETE CASCADE,
  relationship_type text,
  consent_status text DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (caregiver_profile_id, youth_profile_id)
);
ALTER TABLE public.caregiver_relationships ENABLE ROW LEVEL SECURITY;
-- Phase 2+: no open policies — staff only stub
CREATE POLICY caregiver_relationships_staff
  ON public.caregiver_relationships FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.caregiver_relationships IS 'Phase 2+: explicit caregiver–youth links with consent. No auto-link.';

-- applications
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_type text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  payload jsonb DEFAULT '{}',
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY applications_owner_staff
  ON public.applications FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id() OR public.is_staff_or_admin());
COMMENT ON TABLE public.applications IS 'Phase 2+: mentor and program applications.';

-- mentor_matches
CREATE TABLE IF NOT EXISTS public.mentor_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youth_profile_id uuid NOT NULL REFERENCES public.youth_profiles(id) ON DELETE CASCADE,
  mentor_profile_id uuid NOT NULL REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'proposed',
  matched_by uuid REFERENCES public.profiles(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mentor_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY mentor_matches_staff
  ON public.mentor_matches FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.mentor_matches IS 'Phase 2+: youth–mentor matching with staff oversight.';

-- goals
CREATE TABLE IF NOT EXISTS public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY goals_owner_staff
  ON public.goals FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id() OR public.is_staff_or_admin());
COMMENT ON TABLE public.goals IS 'Phase 2+: youth/mentor goals.';

-- emotional_checkins
CREATE TABLE IF NOT EXISTS public.emotional_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.emotional_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY emotional_checkins_owner_only
  ON public.emotional_checkins FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());
COMMENT ON TABLE public.emotional_checkins IS 'Phase 2+: private emotional check-ins. Caregivers must NOT see by default.';

-- journal_entries
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text,
  body text,
  is_private boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY journal_entries_owner_only
  ON public.journal_entries FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());
COMMENT ON TABLE public.journal_entries IS 'Phase 2+: private journals. No caregiver exposure by default.';

-- programs
CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY programs_select_auth
  ON public.programs FOR SELECT
  TO authenticated
  USING (status = 'published' OR public.is_staff_or_admin());
CREATE POLICY programs_staff_write
  ON public.programs FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.programs IS 'Phase 2+: programs catalog.';

-- cohorts
CREATE TABLE IF NOT EXISTS public.cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  name text NOT NULL,
  starts_on date,
  ends_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY cohorts_staff
  ON public.cohorts FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.cohorts IS 'Phase 2+: program cohorts.';

-- enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'enrolled',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, profile_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY enrollments_owner_staff
  ON public.enrollments FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id() OR public.is_staff_or_admin());
COMMENT ON TABLE public.enrollments IS 'Phase 2+: cohort enrollments.';

-- sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE SET NULL,
  title text NOT NULL,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_staff
  ON public.sessions FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.sessions IS 'Phase 2+: program/mentorship sessions.';

-- attendance
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'present',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, profile_id)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY attendance_staff
  ON public.attendance FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.attendance IS 'Phase 2+: session attendance.';

-- support_requests
CREATE TABLE IF NOT EXISTS public.support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category text,
  body text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY support_requests_owner_staff
  ON public.support_requests FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id() OR public.is_staff_or_admin());
COMMENT ON TABLE public.support_requests IS 'Phase 2+: support hub requests.';

-- concern_reports
CREATE TABLE IF NOT EXISTS public.concern_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  body text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.concern_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY concern_reports_staff
  ON public.concern_reports FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.concern_reports IS 'Phase 2+: safety concern reports — staff only.';

-- messages
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid,
  sender_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY messages_deny_all_phase1
  ON public.messages FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);
COMMENT ON TABLE public.messages IS 'Phase 2+: messaging. Deny-all stub until designed.';

-- resources
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text,
  audience text[] DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY resources_select_published
  ON public.resources FOR SELECT
  TO authenticated
  USING (published = true OR public.is_staff_or_admin());
CREATE POLICY resources_staff_write
  ON public.resources FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.resources IS 'Phase 2+: curated resources.';

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_owner
  ON public.notifications FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id() OR public.is_staff_or_admin());
COMMENT ON TABLE public.notifications IS 'Phase 2+: in-app notifications.';

-- consent_records
CREATE TABLE IF NOT EXISTS public.consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  granted boolean NOT NULL DEFAULT false,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY consent_records_owner_staff
  ON public.consent_records FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id() OR public.is_staff_or_admin());
COMMENT ON TABLE public.consent_records IS 'Phase 2+: consent tracking.';

-- background_check_records
CREATE TABLE IF NOT EXISTS public.background_check_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_profile_id uuid NOT NULL REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started',
  provider text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.background_check_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY background_check_staff
  ON public.background_check_records FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.background_check_records IS 'Phase 2+: mentor background checks — staff only.';

-- training_records
CREATE TABLE IF NOT EXISTS public.training_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  training_name text NOT NULL,
  status text NOT NULL DEFAULT 'not_started',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY training_records_owner_staff
  ON public.training_records FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id() OR public.is_staff_or_admin());
COMMENT ON TABLE public.training_records IS 'Phase 2+: training completion records.';

-- safety_cases
CREATE TABLE IF NOT EXISTS public.safety_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  status text NOT NULL DEFAULT 'open',
  severity text,
  assigned_to uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.safety_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY safety_cases_staff
  ON public.safety_cases FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
COMMENT ON TABLE public.safety_cases IS 'Phase 2+: safety case management — staff only.';

-- audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_logs_admin
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'administrator'
    )
  );
COMMENT ON TABLE public.audit_logs IS 'Phase 2+: audit trail — administrator read only.';
