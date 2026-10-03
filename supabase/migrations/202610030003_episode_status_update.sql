-- ===========================================================================
-- Episode status expansion: add 'recorded' and 'ready_for_review'
-- Adds production workflow statuses the admin episode form needs.
-- Keeps existing 'recording' value for backward compatibility.
-- Idempotent — safe to re-run.
-- ===========================================================================

ALTER TABLE public.episodes DROP CONSTRAINT IF EXISTS episodes_episode_status_check;
ALTER TABLE public.episodes ADD CONSTRAINT episodes_episode_status_check CHECK (
  episode_status IN (
    'planned', 'recording', 'editing', 'scheduled',
    'recorded', 'ready_for_review', 'published', 'archived'
  )
);
