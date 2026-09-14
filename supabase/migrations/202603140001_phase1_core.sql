-- HAVII Phase 1 core schema
-- Roles: youth | mentor | caregiver | staff | administrator | community_partner
-- RLS ON everywhere. Role never trusted from client alone.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: is_staff_or_admin() — security definer for RLS
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
      AND p.role IN ('staff', 'administrator')
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
-- profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  preferred_name text,
  date_of_birth date,
  role text NOT NULL CHECK (
    role IN (
      'youth',
      'mentor',
      'caregiver',
      'staff',
      'administrator',
      'community_partner'
    )
  ),
  pronouns text,
  phone text,
  city text,
  state text,
  profile_photo_url text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  account_status text NOT NULL DEFAULT 'active' CHECK (
    account_status IN ('active', 'inactive', 'suspended', 'pending')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users manage own profile
CREATE POLICY profiles_select_own
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_staff_or_admin());

CREATE POLICY profiles_update_own
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Insert only via trigger / service / own signup path
CREATE POLICY profiles_insert_own
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Staff/admin select already covered in profiles_select_own via OR
-- No delete for regular users
CREATE POLICY profiles_delete_staff
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_staff_or_admin());

-- ---------------------------------------------------------------------------
-- Role-specific profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.youth_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  interests text[] DEFAULT '{}',
  help_areas text[] DEFAULT '{}',
  mentorship_interested boolean DEFAULT false,
  location_general text,
  school_or_program text,
  goals_summary text,
  availability_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER youth_profiles_set_updated_at
  BEFORE UPDATE ON public.youth_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.youth_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY youth_profiles_select
  ON public.youth_profiles FOR SELECT
  TO authenticated
  USING (
    profile_id = public.current_profile_id()
    OR public.is_staff_or_admin()
  );

CREATE POLICY youth_profiles_insert
  ON public.youth_profiles FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = public.current_profile_id());

CREATE POLICY youth_profiles_update
  ON public.youth_profiles FOR UPDATE
  TO authenticated
  USING (profile_id = public.current_profile_id())
  WITH CHECK (profile_id = public.current_profile_id());

-- mentor_profiles
CREATE TABLE IF NOT EXISTS public.mentor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  profession text,
  background_summary text,
  mentoring_interests text[] DEFAULT '{}',
  support_areas text[] DEFAULT '{}',
  location_general text,
  availability_notes text,
  years_experience integer,
  application_status text NOT NULL DEFAULT 'application_not_started' CHECK (
    application_status IN (
      'application_not_started',
      'pending_application',
      'submitted',
      'under_review',
      'approved',
      'declined',
      'withdrawn'
    )
  ),
  screening_status text NOT NULL DEFAULT 'not_started' CHECK (
    screening_status IN (
      'not_started',
      'in_progress',
      'pending_review',
      'cleared',
      'not_cleared'
    )
  ),
  training_status text NOT NULL DEFAULT 'not_started' CHECK (
    training_status IN (
      'not_started',
      'in_progress',
      'completed',
      'expired'
    )
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER mentor_profiles_set_updated_at
  BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY mentor_profiles_select
  ON public.mentor_profiles FOR SELECT
  TO authenticated
  USING (
    profile_id = public.current_profile_id()
    OR public.is_staff_or_admin()
  );

CREATE POLICY mentor_profiles_insert
  ON public.mentor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = public.current_profile_id());

CREATE POLICY mentor_profiles_update
  ON public.mentor_profiles FOR UPDATE
  TO authenticated
  USING (profile_id = public.current_profile_id())
  WITH CHECK (profile_id = public.current_profile_id());

-- caregiver_profiles — NO auto youth link
CREATE TABLE IF NOT EXISTS public.caregiver_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER caregiver_profiles_set_updated_at
  BEFORE UPDATE ON public.caregiver_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.caregiver_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY caregiver_profiles_select
  ON public.caregiver_profiles FOR SELECT
  TO authenticated
  USING (
    profile_id = public.current_profile_id()
    OR public.is_staff_or_admin()
  );

CREATE POLICY caregiver_profiles_insert
  ON public.caregiver_profiles FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = public.current_profile_id());

CREATE POLICY caregiver_profiles_update
  ON public.caregiver_profiles FOR UPDATE
  TO authenticated
  USING (profile_id = public.current_profile_id())
  WITH CHECK (profile_id = public.current_profile_id());

-- partner_profiles
CREATE TABLE IF NOT EXISTS public.partner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name text,
  title_role text,
  contact_email text,
  reason_for_use text,
  review_status text NOT NULL DEFAULT 'pending_review' CHECK (
    review_status IN (
      'pending_review',
      'approved',
      'declined',
      'needs_more_info'
    )
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER partner_profiles_set_updated_at
  BEFORE UPDATE ON public.partner_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY partner_profiles_select
  ON public.partner_profiles FOR SELECT
  TO authenticated
  USING (
    profile_id = public.current_profile_id()
    OR public.is_staff_or_admin()
  );

CREATE POLICY partner_profiles_insert
  ON public.partner_profiles FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = public.current_profile_id());

CREATE POLICY partner_profiles_update
  ON public.partner_profiles FOR UPDATE
  TO authenticated
  USING (profile_id = public.current_profile_id())
  WITH CHECK (profile_id = public.current_profile_id());

-- ---------------------------------------------------------------------------
-- Auth trigger: create profile on signup (role from raw_user_meta_data)
-- Only public signup roles allowed via trigger; staff/admin must be set by ops.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chosen_role text;
BEGIN
  chosen_role := COALESCE(NEW.raw_user_meta_data->>'role', 'youth');

  IF chosen_role NOT IN ('youth', 'mentor', 'caregiver', 'community_partner') THEN
    chosen_role := 'youth';
  END IF;

  INSERT INTO public.profiles (
    user_id,
    role,
    first_name,
    last_name,
    preferred_name
  ) VALUES (
    NEW.id,
    chosen_role,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'preferred_name'
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Prevent clients from escalating role via UPDATE
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_staff_or_admin() THEN
    RAISE EXCEPTION 'Role changes are not allowed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

COMMENT ON TABLE public.profiles IS 'Core identity for all HAVII users. Role enforced via RLS + server checks.';
COMMENT ON TABLE public.youth_profiles IS 'Youth-specific fields for matching foundation (interests, help areas, location).';
COMMENT ON TABLE public.mentor_profiles IS 'Mentor application/screening/training foundation. Completing onboarding ≠ approved mentor.';
COMMENT ON TABLE public.caregiver_profiles IS 'Caregiver basics. No automatic youth link in Phase 1.';
COMMENT ON TABLE public.partner_profiles IS 'Community partner org info; review_status defaults to pending_review.';
