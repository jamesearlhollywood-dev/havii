-- Job Offers — JobOffer entity (Salary Research, Offer Comparison, Negotiation)
-- RLS ON — authenticated users can only access their own offer records.
-- A JobOffer may optionally link to a JobApplication (application integration).

CREATE TABLE IF NOT EXISTS public.job_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_application_id uuid REFERENCES public.job_applications(id) ON DELETE SET NULL,
  company text NOT NULL,
  role_title text,
  base_salary numeric,
  bonus_amount numeric,
  bonus_type text CHECK (bonus_type IN ('Annual', 'Performance', 'Signing', 'Profit Sharing', 'Equity', 'None', 'Other')),
  equity_value numeric,
  signing_bonus numeric,
  retirement_match numeric,
  health_benefit_value numeric,
  paid_time_off_days integer,
  remote_stipend numeric,
  relocation_assistance numeric,
  other_compensation text,
  total_estimated_compensation numeric,
  location text,
  work_mode text CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
  start_date date,
  response_deadline date,
  offer_status text NOT NULL DEFAULT 'Received' CHECK (
    offer_status IN ('Received', 'Negotiating', 'Accepted', 'Declined', 'Expired')
  ),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_offers_user_id_idx ON public.job_offers(user_id);
CREATE INDEX IF NOT EXISTS job_offers_status_idx ON public.job_offers(offer_status);
CREATE INDEX IF NOT EXISTS job_offers_deadline_idx ON public.job_offers(response_deadline);
CREATE INDEX IF NOT EXISTS job_offers_job_application_idx ON public.job_offers(job_application_id);

CREATE TRIGGER job_offers_set_updated_at
  BEFORE UPDATE ON public.job_offers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY job_offers_select_own
  ON public.job_offers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY job_offers_insert_own
  ON public.job_offers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY job_offers_update_own
  ON public.job_offers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY job_offers_delete_own
  ON public.job_offers FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE public.job_offers IS 'Job offers tracked for comparison & negotiation — one per user, optionally linked to a job application.';
