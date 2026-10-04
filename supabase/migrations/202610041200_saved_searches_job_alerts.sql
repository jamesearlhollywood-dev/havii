-- Saved Searches & Job Alerts — SavedJobSearch + JobAlertResult + in-app Notifications
-- RLS ON everywhere — authenticated users can only access their own records.

-- ---------------------------------------------------------------------------
-- saved_job_searches (SavedJobSearch entity)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_job_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  keywords text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  remote_only boolean NOT NULL DEFAULT false,
  work_mode text,
  employment_type text,
  minimum_salary integer,
  date_posted text,
  minimum_match_score integer,
  is_active boolean NOT NULL DEFAULT true,
  alert_frequency text NOT NULL DEFAULT 'Off' CHECK (
    alert_frequency IN ('Daily', 'Weekdays', 'Weekly', 'Off')
  ),
  last_checked_at timestamptz,
  last_alert_at timestamptz,
  api_provider text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS saved_job_searches_user_id_idx ON public.saved_job_searches(user_id);
CREATE INDEX IF NOT EXISTS saved_job_searches_active_idx ON public.saved_job_searches(is_active) WHERE is_active = true;

CREATE TRIGGER saved_job_searches_set_updated_at
  BEFORE UPDATE ON public.saved_job_searches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.saved_job_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY saved_job_searches_select_own
  ON public.saved_job_searches FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY saved_job_searches_insert_own
  ON public.saved_job_searches FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY saved_job_searches_update_own
  ON public.saved_job_searches FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY saved_job_searches_delete_own
  ON public.saved_job_searches FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- job_alert_results (JobAlertResult entity — tracks surfaced opportunities)
-- A (saved_search_id, source_job_id, api_provider) tuple is unique so the same
-- source job is never alerted twice for one saved search.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_alert_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_search_id uuid NOT NULL REFERENCES public.saved_job_searches(id) ON DELETE CASCADE,
  source_job_id text NOT NULL,
  api_provider text,
  job_title text,
  company text,
  location text,
  job_url text,
  salary_text text,
  match_score integer,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  alert_sent_at timestamptz,
  status text NOT NULL DEFAULT 'new' CHECK (
    status IN ('new', 'alerted', 'dismissed')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (saved_search_id, source_job_id, api_provider)
);

CREATE INDEX IF NOT EXISTS job_alert_results_user_id_idx ON public.job_alert_results(user_id);
CREATE INDEX IF NOT EXISTS job_alert_results_saved_search_idx ON public.job_alert_results(saved_search_id);
CREATE INDEX IF NOT EXISTS job_alert_results_status_idx ON public.job_alert_results(status);

ALTER TABLE public.job_alert_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY job_alert_results_select_own
  ON public.job_alert_results FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY job_alert_results_insert_own
  ON public.job_alert_results FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY job_alert_results_update_own
  ON public.job_alert_results FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY job_alert_results_delete_own
  ON public.job_alert_results FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- notifications (in-app notification area — real stored events only)
-- type: 'job_alert' | 'new_recommendation' | 'interview_upcoming' | 'follow_up' | 'offer_reminder'
-- Future producers (interview scheduling, follow-up reminders, offer reminders)
-- write rows here; the header notification bell reads them. No fabricated rows.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  related_id text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON public.notifications(user_id) WHERE read_at IS NULL;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_own
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY notifications_insert_own
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY notifications_update_own
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY notifications_delete_own
  ON public.notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE public.saved_job_searches IS 'Saved job search criteria with optional scheduled alerts.';
COMMENT ON TABLE public.job_alert_results IS 'Jobs surfaced by a saved search alert — deduped per (saved_search_id, source_job_id, api_provider).';
COMMENT ON TABLE public.notifications IS 'Real stored notification events for the in-app header bell.';
