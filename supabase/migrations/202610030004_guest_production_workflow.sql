-- ===========================================================================
-- Guest Management & Production Workflow expansion
-- Expands enum-style CHECK constraints to support the full booking-status
-- lifecycle, the production-task lifecycle, and the podcast production
-- workflow stages. Idempotent — safe to re-run. Preserves all legacy values
-- so existing rows keep validating.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- guests.booking_status: full booking lifecycle
-- Prospect → Invited → Interested → Scheduling → Confirmed → Recorded →
-- Published → (Declined | Archived). 'tentative' kept for legacy rows.
-- ---------------------------------------------------------------------------
ALTER TABLE public.guests DROP CONSTRAINT IF EXISTS guests_booking_status_check;
ALTER TABLE public.guests ADD CONSTRAINT guests_booking_status_check CHECK (
  booking_status IN (
    'prospect', 'invited', 'interested', 'scheduling',
    'confirmed', 'recorded', 'published', 'declined', 'archived',
    'tentative'
  )
);

-- ---------------------------------------------------------------------------
-- production_tasks.status: Not Started / In Progress / Waiting / Complete /
-- Cancelled. 'blocked' kept for legacy rows.
-- ---------------------------------------------------------------------------
ALTER TABLE public.production_tasks DROP CONSTRAINT IF EXISTS production_tasks_status_check;
ALTER TABLE public.production_tasks ADD CONSTRAINT production_tasks_status_check CHECK (
  status IN ('not_started', 'in_progress', 'waiting', 'completed', 'cancelled', 'blocked')
);

-- ---------------------------------------------------------------------------
-- episodes.episode_status: production workflow stages
-- Idea → Guest Outreach → Scheduling → Scheduled → Recorded → Editing →
-- Review → Ready to Publish → Published. Legacy 'planned'/'recording' kept.
-- ---------------------------------------------------------------------------
ALTER TABLE public.episodes DROP CONSTRAINT IF EXISTS episodes_episode_status_check;
ALTER TABLE public.episodes ADD CONSTRAINT episodes_episode_status_check CHECK (
  episode_status IN (
    'planned', 'idea', 'guest_outreach', 'scheduling', 'scheduled',
    'recording', 'recorded', 'editing', 'review',
    'ready_for_review', 'published', 'archived'
  )
);

COMMENT ON COLUMN public.guests.booking_status IS 'Booking lifecycle: prospect, invited, interested, scheduling, confirmed, recorded, published, declined, archived (legacy: tentative).';
COMMENT ON COLUMN public.production_tasks.status IS 'Task lifecycle: not_started, in_progress, waiting, completed, cancelled (legacy: blocked).';
COMMENT ON COLUMN public.episodes.episode_status IS 'Production workflow stage of the episode.';
