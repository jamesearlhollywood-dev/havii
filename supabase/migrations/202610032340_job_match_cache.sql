-- Job match analysis cache — stores AI-generated match analyses per user + job
-- so we don't re-call the AI on every page reload. RLS: user only sees own analyses.

CREATE TABLE IF NOT EXISTS public.job_match_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_job_id text NOT NULL,
  api_provider text,
  job_data jsonb NOT NULL DEFAULT '{}',
  match_score integer,
  match_label text,
  matching_skills text[] DEFAULT '{}',
  missing_skills text[] DEFAULT '{}',
  experience_alignment text,
  salary_alignment text,
  location_alignment text,
  work_mode_alignment text,
  strengths text[] DEFAULT '{}',
  gaps text[] DEFAULT '{}',
  recommendation_reason text,
  ai_provider text,
  model_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, source_job_id, api_provider)
);

CREATE INDEX IF NOT EXISTS job_match_analyses_user_id_idx ON public.job_match_analyses(user_id);
CREATE INDEX IF NOT EXISTS job_match_analyses_score_idx ON public.job_match_analyses(match_score DESC);

CREATE TRIGGER job_match_analyses_set_updated_at
  BEFORE UPDATE ON public.job_match_analyses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.job_match_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY job_match_analyses_select_own
  ON public.job_match_analyses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY job_match_analyses_insert_own
  ON public.job_match_analyses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY job_match_analyses_update_own
  ON public.job_match_analyses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY job_match_analyses_delete_own
  ON public.job_match_analyses FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
