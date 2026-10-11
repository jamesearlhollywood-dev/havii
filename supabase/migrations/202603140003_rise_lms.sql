-- ============================================================================
-- RISE USA LMS — Database Schema
-- ============================================================================
-- Roles: student | instructor | org_manager | admin
-- RLS enabled everywhere. Role never trusted from client alone.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper functions (create if not exists)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'instructor', 'org_manager')
      AND p.account_status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role = 'admin'
      AND p.account_status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- profiles (updated for RISE USA roles)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  preferred_name text,
  date_of_birth date,
  role text NOT NULL CHECK (role IN ('student', 'instructor', 'org_manager', 'admin')),
  pronouns text,
  phone text,
  city text,
  state text,
  profile_photo_url text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  account_status text NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended', 'pending')),
  organization_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add organization_id column if table already exists (from Phase 1)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'organization_id') THEN
    ALTER TABLE public.profiles ADD COLUMN organization_id uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role' AND column_default LIKE '%student%') THEN
    -- Update the CHECK constraint to allow new roles
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'instructor', 'org_manager', 'admin', 'youth', 'mentor', 'caregiver', 'staff', 'administrator', 'community_partner'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_org_idx ON public.profiles(organization_id);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff_or_admin());

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS profiles_delete_staff ON public.profiles;
CREATE POLICY profiles_delete_staff
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'school' CHECK (type IN ('school', 'nonprofit', 'workforce', 'community', 'other')),
  contact_name text,
  contact_email text,
  contact_phone text,
  city text,
  state text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER organizations_set_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organizations_select ON public.organizations;
CREATE POLICY organizations_select
  ON public.organizations FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS organizations_admin_write ON public.organizations;
CREATE POLICY organizations_admin_write
  ON public.organizations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Add FK from profiles to organizations (safe, non-blocking)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_organization_fk' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_organization_fk
      FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- cohorts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  term text,
  site text,
  starts_on date,
  ends_on date,
  instructor_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cohorts_org_idx ON public.cohorts(organization_id);
CREATE INDEX IF NOT EXISTS cohorts_instructor_idx ON public.cohorts(instructor_profile_id);

CREATE TRIGGER cohorts_set_updated_at
  BEFORE UPDATE ON public.cohorts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;

-- Admin: full access. Instructor: see assigned cohorts. Org manager: see org's cohorts.
DROP POLICY IF EXISTS cohorts_select ON public.cohorts;
CREATE POLICY cohorts_select
  ON public.cohorts FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR instructor_profile_id = public.current_profile_id()
    OR organization_id = public.current_org_id()
  );

DROP POLICY IF EXISTS cohorts_admin_write ON public.cohorts;
CREATE POLICY cohorts_admin_write
  ON public.cohorts FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- enrollments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'withdrawn')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, profile_id)
);

CREATE INDEX IF NOT EXISTS enrollments_cohort_idx ON public.enrollments(cohort_id);
CREATE INDEX IF NOT EXISTS enrollments_profile_idx ON public.enrollments(profile_id);

CREATE TRIGGER enrollments_set_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Students see own enrollments. Instructors see enrollments in their cohorts.
-- Org managers see enrollments in their org's cohorts. Admin: full access.
DROP POLICY IF EXISTS enrollments_select ON public.enrollments;
CREATE POLICY enrollments_select
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (
    profile_id = public.current_profile_id()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.cohorts c
      WHERE c.id = enrollments.cohort_id
        AND c.instructor_profile_id = public.current_profile_id()
    )
    OR EXISTS (
      SELECT 1 FROM public.cohorts c
      WHERE c.id = enrollments.cohort_id
        AND c.organization_id = public.current_org_id()
    )
  );

DROP POLICY IF EXISTS enrollments_admin_write ON public.enrollments;
CREATE POLICY enrollments_admin_write
  ON public.enrollments FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- lesson_progress
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  lesson_id text NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  reflection_text text,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, module_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS lesson_progress_profile_idx ON public.lesson_progress(profile_id);

CREATE TRIGGER lesson_progress_set_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lesson_progress_owner ON public.lesson_progress;
CREATE POLICY lesson_progress_owner
  ON public.lesson_progress FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());

-- ---------------------------------------------------------------------------
-- module_progress
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  lessons_completed integer NOT NULL DEFAULT 0,
  knowledge_check_score numeric,
  knowledge_check_passed boolean NOT NULL DEFAULT false,
  knowledge_check_attempts integer NOT NULL DEFAULT 0,
  decision_lab_submitted boolean NOT NULL DEFAULT false,
  blueprint_section_completed boolean NOT NULL DEFAULT false,
  module_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, module_id)
);

CREATE INDEX IF NOT EXISTS module_progress_profile_idx ON public.module_progress(profile_id);

CREATE TRIGGER module_progress_set_updated_at
  BEFORE UPDATE ON public.module_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS module_progress_owner ON public.module_progress;
CREATE POLICY module_progress_owner
  ON public.module_progress FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());

-- ---------------------------------------------------------------------------
-- quiz_attempts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  score numeric NOT NULL,
  passed boolean NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quiz_attempts_profile_idx ON public.quiz_attempts(profile_id);
CREATE INDEX IF NOT EXISTS quiz_attempts_module_idx ON public.quiz_attempts(module_id);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS quiz_attempts_owner ON public.quiz_attempts;
CREATE POLICY quiz_attempts_owner
  ON public.quiz_attempts FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());

-- ---------------------------------------------------------------------------
-- decision_lab_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decision_lab_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  lab_type text NOT NULL,
  responses jsonb NOT NULL DEFAULT '{}',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS decision_lab_profile_idx ON public.decision_lab_submissions(profile_id);
CREATE INDEX IF NOT EXISTS decision_lab_module_idx ON public.decision_lab_submissions(module_id);

ALTER TABLE public.decision_lab_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS decision_lab_owner ON public.decision_lab_submissions;
CREATE POLICY decision_lab_owner
  ON public.decision_lab_submissions FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());

-- ---------------------------------------------------------------------------
-- blueprint_sections
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blueprint_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_number integer NOT NULL,
  section_key text NOT NULL,
  section_title text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  completed boolean NOT NULL DEFAULT false,
  unlocked boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, section_number)
);

CREATE INDEX IF NOT EXISTS blueprint_profile_idx ON public.blueprint_sections(profile_id);

CREATE TRIGGER blueprint_sections_set_updated_at
  BEFORE UPDATE ON public.blueprint_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.blueprint_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS blueprint_owner ON public.blueprint_sections;
CREATE POLICY blueprint_owner
  ON public.blueprint_sections FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());

-- ---------------------------------------------------------------------------
-- certificates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  certificate_id text NOT NULL UNIQUE,
  student_name text NOT NULL,
  course_name text NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'revoked'))
);

CREATE INDEX IF NOT EXISTS certificates_profile_idx ON public.certificates(profile_id);
CREATE INDEX IF NOT EXISTS certificates_cert_id_idx ON public.certificates(certificate_id);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Students see own certificates. Staff can see all. Public verification via service role.
DROP POLICY IF EXISTS certificates_owner ON public.certificates;
CREATE POLICY certificates_owner
  ON public.certificates FOR SELECT
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin());

DROP POLICY IF EXISTS certificates_admin_write ON public.certificates;
CREATE POLICY certificates_admin_write
  ON public.certificates FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- resources
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text,
  resource_type text NOT NULL DEFAULT 'link' CHECK (resource_type IN ('link', 'file', 'video', 'document')),
  module_id text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS resources_select ON public.resources;
CREATE POLICY resources_select
  ON public.resources FOR SELECT
  TO authenticated
  USING (is_published = true OR public.is_staff_or_admin());

DROP POLICY IF EXISTS resources_admin_write ON public.resources;
CREATE POLICY resources_admin_write
  ON public.resources FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ---------------------------------------------------------------------------
-- announcements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  audience text NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'students', 'instructors', 'org_managers')),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS announcements_select ON public.announcements;
CREATE POLICY announcements_select
  ON public.announcements FOR SELECT
  TO authenticated
  USING (is_published = true OR public.is_staff_or_admin());

DROP POLICY IF EXISTS announcements_admin_write ON public.announcements;
CREATE POLICY announcements_admin_write
  ON public.announcements FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ---------------------------------------------------------------------------
-- support_requests
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER support_requests_set_updated_at
  BEFORE UPDATE ON public.support_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS support_requests_owner ON public.support_requests;
CREATE POLICY support_requests_owner
  ON public.support_requests FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());

DROP POLICY IF EXISTS support_requests_staff_update ON public.support_requests;
CREATE POLICY support_requests_staff_update
  ON public.support_requests FOR UPDATE
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ---------------------------------------------------------------------------
-- final_assessment_attempts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.final_assessment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score numeric NOT NULL,
  passed boolean NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS final_assessment_profile_idx ON public.final_assessment_attempts(profile_id);

ALTER TABLE public.final_assessment_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS final_assessment_owner ON public.final_assessment_attempts;
CREATE POLICY final_assessment_owner
  ON public.final_assessment_attempts FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id() OR public.is_staff_or_admin())
  WITH CHECK (profile_id = public.current_profile_id());
