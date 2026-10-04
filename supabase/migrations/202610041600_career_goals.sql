-- Career Goals — JobGoal entity for job-search goal tracking & progress.
-- RLS ON — authenticated users can only access their own goal records.

CREATE TABLE IF NOT EXISTS public.career_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type text NOT NULL CHECK (
    goal_type IN (
      'Applications', 'Networking Contacts', 'Follow-Ups',
      'Interviews', 'Resume Tailoring', 'Job Searches'
    )
  ),
  target_value integer NOT NULL CHECK (target_value > 0),
  period text NOT NULL CHECK (period IN ('Weekly', 'Monthly', 'Custom')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS career_goals_user_id_idx ON public.career_goals(user_id);
CREATE INDEX IF NOT EXISTS career_goals_status_idx ON public.career_goals(status);
CREATE INDEX IF NOT EXISTS career_goals_period_idx ON public.career_goals(period, start_date, end_date);

CREATE TRIGGER career_goals_set_updated_at
  BEFORE UPDATE ON public.career_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY career_goals_select_own
  ON public.career_goals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY career_goals_insert_own
  ON public.career_goals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY career_goals_update_own
  ON public.career_goals FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY career_goals_delete_own
  ON public.career_goals FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE public.career_goals IS 'User-set job-search goals with progress tracked against actual Career AI records.';
