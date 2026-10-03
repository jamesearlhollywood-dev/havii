-- ===========================================================================
-- Show status expansion: add 'active' and 'paused'
-- Replaces 'published' with 'active' (public-facing visible state).
-- Idempotent — safe to re-run.
-- ===========================================================================

-- Migrate any legacy 'published' rows to 'active' before changing constraint
UPDATE public.shows SET status = 'active' WHERE status = 'published';

-- Replace the CHECK constraint
ALTER TABLE public.shows DROP CONSTRAINT IF EXISTS shows_status_check;
ALTER TABLE public.shows ADD CONSTRAINT shows_status_check CHECK (
  status IN ('draft', 'active', 'paused', 'archived')
);

-- Update RLS: public may read 'active' shows (was 'published')
DROP POLICY IF EXISTS shows_public_read ON public.shows;
CREATE POLICY shows_public_read
  ON public.shows FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- Staff/admin write policy unchanged, but re-create to be safe
DROP POLICY IF EXISTS shows_admin_write ON public.shows;
CREATE POLICY shows_admin_write
  ON public.shows FOR ALL
  TO authenticated
  USING (public.is_staff_or_admin())
  WITH CHECK (public.is_staff_or_admin());
