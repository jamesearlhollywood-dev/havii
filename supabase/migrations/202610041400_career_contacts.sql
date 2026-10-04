-- Networking & Contact Management — CareerContact + ContactInteraction entities
-- RLS ON — authenticated users can only access their own contact records.

-- ===========================================================================
-- CareerContact
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.career_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text,
  organization text,
  job_title text,
  email text,
  phone text,
  linkedin_url text,
  relationship_type text NOT NULL DEFAULT 'Professional Contact' CHECK (
    relationship_type IN (
      'Recruiter', 'Hiring Manager', 'Colleague', 'Former Colleague',
      'Mentor', 'Alumni', 'Referral', 'Professional Contact',
      'Employer Contact', 'Other'
    )
  ),
  relationship_strength text NOT NULL DEFAULT 'New' CHECK (
    relationship_strength IN ('New', 'Developing', 'Established', 'Strong')
  ),
  location text,
  notes text,
  source text,
  last_contact_date date,
  next_follow_up_date date,
  related_job_application_id uuid REFERENCES public.job_applications(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS career_contacts_user_id_idx ON public.career_contacts(user_id);
CREATE INDEX IF NOT EXISTS career_contacts_next_follow_up_idx ON public.career_contacts(next_follow_up_date);
CREATE INDEX IF NOT EXISTS career_contacts_organization_idx ON public.career_contacts(organization);

CREATE TRIGGER career_contacts_set_updated_at
  BEFORE UPDATE ON public.career_contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.career_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY career_contacts_select_own
  ON public.career_contacts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY career_contacts_insert_own
  ON public.career_contacts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY career_contacts_update_own
  ON public.career_contacts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY career_contacts_delete_own
  ON public.career_contacts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE public.career_contacts IS 'Professional networking contacts — one per user, optionally linked to a job application.';

-- ===========================================================================
-- ContactInteraction
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.contact_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_contact_id uuid NOT NULL REFERENCES public.career_contacts(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (
    interaction_type IN (
      'Email', 'Phone Call', 'Meeting', 'LinkedIn',
      'Event', 'Interview', 'Referral', 'Other'
    )
  ),
  interaction_date date NOT NULL,
  subject text,
  notes text,
  related_job_application_id uuid REFERENCES public.job_applications(id) ON DELETE SET NULL,
  follow_up_required boolean NOT NULL DEFAULT false,
  follow_up_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_interactions_user_id_idx ON public.contact_interactions(user_id);
CREATE INDEX IF NOT EXISTS contact_interactions_contact_idx ON public.contact_interactions(career_contact_id);
CREATE INDEX IF NOT EXISTS contact_interactions_date_idx ON public.contact_interactions(interaction_date);

ALTER TABLE public.contact_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY contact_interactions_select_own
  ON public.contact_interactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY contact_interactions_insert_own
  ON public.contact_interactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY contact_interactions_update_own
  ON public.contact_interactions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY contact_interactions_delete_own
  ON public.contact_interactions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE public.contact_interactions IS 'Logged interactions with networking contacts — one per user + contact. May trigger an automatic follow-up CareerTask.';
