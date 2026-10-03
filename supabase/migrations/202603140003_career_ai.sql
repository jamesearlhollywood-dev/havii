-- Career AI — career management platform schema
-- Entities: career_profiles, job_applications, resumes, generated_documents, interview_sessions
-- RLS ON everywhere — authenticated users can only CRUD their own records.

-- ---------------------------------------------------------------------------
-- career_profiles (CareerProfile entity — one per user)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  headline text,
  location text,
  target_roles text[] DEFAULT '{}',
  salary_min integer,
  salary_max integer,
  work_preferences text,
  skills text[] DEFAULT '{}',
  summary text,
  years_experience integer,
  linkedin_url text,
  portfolio_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS career_profiles_user_id_idx ON public.career_profiles(user_id);

CREATE TRIGGER career_profiles_set_updated_at
  BEFORE UPDATE ON public.career_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY career_profiles_select_own
  ON public.career_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY career_profiles_insert_own
  ON public.career_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY career_profiles_update_own
  ON public.career_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY career_profiles_delete_own
  ON public.career_profiles FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- job_applications (JobApplication entity)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company text,
  title text,
  location text,
  employment_type text,
  work_mode text,
  salary_text text,
  salary_min integer,
  salary_max integer,
  description text,
  job_url text,
  status text NOT NULL DEFAULT 'Saved' CHECK (
    status IN ('Saved', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn')
  ),
  applied_date date,
  next_action_date date,
  notes text,
  match_score integer,
  source text,
  source_job_id text,
  api_provider text,
  api_payload_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_applications_user_id_idx ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS job_applications_status_idx ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS job_applications_created_at_idx ON public.job_applications(created_at DESC);

CREATE TRIGGER job_applications_set_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY job_applications_select_own
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY job_applications_insert_own
  ON public.job_applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY job_applications_update_own
  ON public.job_applications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY job_applications_delete_own
  ON public.job_applications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- resumes (Resume entity)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  raw_text text,
  target_role text,
  version_label text,
  is_primary boolean DEFAULT false,
  source_file_url text,
  parsed_skills text[] DEFAULT '{}',
  parsed_keywords text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON public.resumes(user_id);

CREATE TRIGGER resumes_set_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY resumes_select_own
  ON public.resumes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY resumes_insert_own
  ON public.resumes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY resumes_update_own
  ON public.resumes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY resumes_delete_own
  ON public.resumes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- generated_documents (GeneratedDocument entity)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text,
  title text,
  content text,
  job_application_id uuid REFERENCES public.job_applications(id) ON DELETE SET NULL,
  resume_id uuid REFERENCES public.resumes(id) ON DELETE SET NULL,
  prompt_context text,
  ai_provider text,
  model_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS generated_documents_user_id_idx ON public.generated_documents(user_id);

CREATE TRIGGER generated_documents_set_updated_at
  BEFORE UPDATE ON public.generated_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY generated_documents_select_own
  ON public.generated_documents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY generated_documents_insert_own
  ON public.generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY generated_documents_update_own
  ON public.generated_documents FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY generated_documents_delete_own
  ON public.generated_documents FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- interview_sessions (InterviewSession entity)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_application_id uuid REFERENCES public.job_applications(id) ON DELETE SET NULL,
  role_title text,
  company text,
  interview_type text,
  scheduled_at timestamptz,
  questions jsonb DEFAULT '[]',
  responses jsonb DEFAULT '[]',
  feedback text,
  score integer,
  ai_provider text,
  model_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS interview_sessions_user_id_idx ON public.interview_sessions(user_id);

CREATE TRIGGER interview_sessions_set_updated_at
  BEFORE UPDATE ON public.interview_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY interview_sessions_select_own
  ON public.interview_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY interview_sessions_insert_own
  ON public.interview_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY interview_sessions_update_own
  ON public.interview_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY interview_sessions_delete_own
  ON public.interview_sessions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Update auth trigger: set onboarding_completed = true for new users
-- (Career AI does not use role-based onboarding)
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
    preferred_name,
    onboarding_completed
  ) VALUES (
    NEW.id,
    chosen_role,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'preferred_name',
    true
  );

  RETURN NEW;
END;
$$;

COMMENT ON TABLE public.career_profiles IS 'Career AI user profile — one per authenticated user.';
COMMENT ON TABLE public.job_applications IS 'Tracked job applications with status workflow and external API source fields.';
COMMENT ON TABLE public.resumes IS 'User resumes with parsed skills/keywords for AI tailoring.';
COMMENT ON TABLE public.generated_documents IS 'AI-generated documents (cover letters, tailored resumes) linked to applications and resumes.';
COMMENT ON TABLE public.interview_sessions IS 'AI interview practice sessions with questions, responses, and feedback.';
