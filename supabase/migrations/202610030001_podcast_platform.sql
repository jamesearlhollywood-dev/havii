-- ===========================================================================
-- James Hollywood III Studios — Podcast platform schema
-- Entities: shows, episodes, guests, production_tasks, sponsors, contact_messages
-- RLS enabled on every table. Public can read published content; admins write.
-- Reuses helpers from 202603140001_phase1_core.sql (is_staff_or_admin,
-- current_profile_id, set_updated_at). This migration is idempotent.
-- ===========================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure shared helpers exist (no-op if the core migration already ran).
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ===========================================================================
-- guests
-- ===========================================================================
CREATE TABLE IF NOT EXISTS public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  professional_title text,
  organization text,
  biography text,
  headshot text,
  email text,
  phone text,
  website text,
  linkedin_url text,
  instagram_url text,
  facebook_url text,
  booking_status text NOT NULL DEFAULT 'invited' CHECK (
    booking_status IN ('invited', 'confirmed', 'recorded', 'declined', 'tentative')
  ),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guests_booking_status_idx ON public.guests(booking_status);

CREATE TRIGGER guests_set_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Public (anon) may read guests; staff/admin may write.
CREATE POLICY guests_public_read
  ON public.guests FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY guests_admin_write
  ON public.guests FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ===========================================================================
-- shows
-- ===========================================================================
CREATE TABLE IF NOT EXISTS public.shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  full_description text,
  cover_image text,
  host_name text,
  category text,
  status text NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'published', 'archived')
  ),
  spotify_url text,
  apple_podcast_url text,
  youtube_url text,
  rss_feed_url text,
  website_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shows_status_idx ON public.shows(status);
CREATE INDEX IF NOT EXISTS shows_slug_idx ON public.shows(slug);

CREATE TRIGGER shows_set_updated_at
  BEFORE UPDATE ON public.shows
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;

-- Public may read published shows; staff/admin may write.
CREATE POLICY shows_public_read
  ON public.shows FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY shows_admin_write
  ON public.shows FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ===========================================================================
-- episodes
-- ===========================================================================
CREATE TABLE IF NOT EXISTS public.episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id uuid NOT NULL REFERENCES public.shows(id) ON DELETE CASCADE,
  episode_number integer,
  season_number integer,
  title text NOT NULL,
  slug text NOT NULL,
  short_description text,
  full_description text,
  cover_image text,
  audio_url text,
  video_url text,
  transcript text,
  show_notes text,
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  episode_status text NOT NULL DEFAULT 'planned' CHECK (
    episode_status IN ('planned', 'recording', 'editing', 'scheduled', 'published', 'archived')
  ),
  recording_date timestamptz,
  publish_date timestamptz,
  duration text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS episodes_show_id_idx ON public.episodes(show_id);
CREATE INDEX IF NOT EXISTS episodes_guest_id_idx ON public.episodes(guest_id);
CREATE INDEX IF NOT EXISTS episodes_status_idx ON public.episodes(episode_status);
CREATE INDEX IF NOT EXISTS episodes_publish_date_idx ON public.episodes(publish_date DESC);
CREATE UNIQUE INDEX IF NOT EXISTS episodes_show_slug_idx ON public.episodes(show_id, slug);

CREATE TRIGGER episodes_set_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Public may read published episodes; staff/admin may write.
CREATE POLICY episodes_public_read
  ON public.episodes FOR SELECT
  TO anon, authenticated
  USING (episode_status = 'published');

CREATE POLICY episodes_admin_write
  ON public.episodes FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ===========================================================================
-- production_tasks
-- ===========================================================================
CREATE TABLE IF NOT EXISTS public.production_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid REFERENCES public.episodes(id) ON DELETE SET NULL,
  task_name text NOT NULL,
  assigned_to text,
  status text NOT NULL DEFAULT 'not_started' CHECK (
    status IN ('not_started', 'in_progress', 'blocked', 'completed')
  ),
  due_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS production_tasks_episode_id_idx ON public.production_tasks(episode_id);
CREATE INDEX IF NOT EXISTS production_tasks_status_idx ON public.production_tasks(status);
CREATE INDEX IF NOT EXISTS production_tasks_due_date_idx ON public.production_tasks(due_date);

CREATE TRIGGER production_tasks_set_updated_at
  BEFORE UPDATE ON public.production_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.production_tasks ENABLE ROW LEVEL SECURITY;

-- Internal only: staff/admin read + write.
CREATE POLICY production_tasks_staff_read
  ON public.production_tasks FOR SELECT
  TO authenticated
  USING (public.is_staff_or_admin());

CREATE POLICY production_tasks_admin_write
  ON public.production_tasks FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ===========================================================================
-- sponsors
-- ===========================================================================
CREATE TABLE IF NOT EXISTS public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  website text,
  logo text,
  sponsorship_level text NOT NULL DEFAULT 'silver' CHECK (
    sponsorship_level IN ('platinum', 'gold', 'silver', 'bronze', 'in_kind')
  ),
  sponsorship_status text NOT NULL DEFAULT 'prospect' CHECK (
    sponsorship_status IN ('prospect', 'negotiating', 'active', 'expired', 'declined')
  ),
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sponsors_status_idx ON public.sponsors(sponsorship_status);
CREATE INDEX IF NOT EXISTS sponsors_level_idx ON public.sponsors(sponsorship_level);

CREATE TRIGGER sponsors_set_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Internal only: staff/admin read + write.
CREATE POLICY sponsors_staff_read
  ON public.sponsors FOR SELECT
  TO authenticated
  USING (public.is_staff_or_admin());

CREATE POLICY sponsors_admin_write
  ON public.sponsors FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

-- ===========================================================================
-- contact_messages
-- ===========================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  inquiry_type text NOT NULL DEFAULT 'general' CHECK (
    inquiry_type IN ('general', 'booking', 'sponsorship', 'press', 'feedback', 'partnership')
  ),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (
    status IN ('new', 'read', 'archived', 'responded')
  ),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages(created_at DESC);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) may submit a contact message.
CREATE POLICY contact_messages_public_insert
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Internal only: staff/admin read + update + delete.
CREATE POLICY contact_messages_staff_read
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_staff_or_admin());

CREATE POLICY contact_messages_admin_update
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());

CREATE POLICY contact_messages_admin_delete
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.is_staff_or_admin());

-- ===========================================================================
-- Comments
-- ===========================================================================
COMMENT ON TABLE public.shows IS 'Podcast shows in the James Hollywood III Studios network.';
COMMENT ON TABLE public.episodes IS 'Episodes belonging to a show; optional guest link.';
COMMENT ON TABLE public.guests IS 'Guests appearing across shows and episodes.';
COMMENT ON TABLE public.production_tasks IS 'Production workflow tasks tied to an episode (internal).';
COMMENT ON TABLE public.sponsors IS 'Sponsor companies and sponsorship agreements (internal).';
COMMENT ON TABLE public.contact_messages IS 'Inbound public contact-form submissions (internal).';
