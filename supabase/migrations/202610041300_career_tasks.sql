-- Career Tasks, Follow-Ups & Deadlines — CareerTask entity
-- RLS ON — authenticated users can only access their own task records.

CREATE TABLE IF NOT EXISTS public.career_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  task_type text NOT NULL CHECK (
    task_type IN (
      'Application', 'Follow-Up', 'Interview', 'Networking', 'Resume',
      'Cover Letter', 'Offer', 'Negotiation', 'General'
    )
  ),
  related_job_application_id uuid REFERENCES public.job_applications(id) ON DELETE SET NULL,
  due_date date,
  due_time time,
  priority text NOT NULL DEFAULT 'Medium' CHECK (
    priority IN ('Low', 'Medium', 'High', 'Urgent')
  ),
  status text NOT NULL DEFAULT 'To Do' CHECK (
    status IN ('To Do', 'In Progress', 'Completed', 'Cancelled')
  ),
  reminder_enabled boolean NOT NULL DEFAULT false,
  reminder_date date,
  reminder_time time,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS career_tasks_user_id_idx ON public.career_tasks(user_id);
CREATE INDEX IF NOT EXISTS career_tasks_due_date_idx ON public.career_tasks(due_date);
CREATE INDEX IF NOT EXISTS career_tasks_status_idx ON public.career_tasks(status);

CREATE TRIGGER career_tasks_set_updated_at
  BEFORE UPDATE ON public.career_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.career_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY career_tasks_select_own
  ON public.career_tasks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY career_tasks_insert_own
  ON public.career_tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY career_tasks_update_own
  ON public.career_tasks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY career_tasks_delete_own
  ON public.career_tasks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE public.career_tasks IS 'Career tasks, follow-ups, and deadline reminders — one per user, optionally linked to a job application.';
