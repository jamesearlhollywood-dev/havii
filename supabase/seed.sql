-- ===========================================================================
-- Seed: Grace Beyond Podcast Show
-- Run after migrations are applied.
-- ===========================================================================

INSERT INTO public.shows (
  show_name,
  slug,
  short_description,
  full_description,
  host_name,
  category,
  status
) VALUES (
  'Grace Beyond Podcast Show',
  'grace-beyond',
  'Conversations about faith, grace, growth, leadership, resilience, and navigating real life.',
  'Grace Beyond Podcast Show explores the intersection of faith, personal growth, leadership, resilience, relationships, purpose, and everyday life. Hosted by James Hollywood III, the show features thoughtful conversations, personal reflections, interviews, and practical insights designed to encourage listeners to keep moving forward through life''s challenges and opportunities.',
  'James Hollywood III',
  'Faith / Personal Development',
  'active'
)
ON CONFLICT (slug) DO UPDATE SET
  show_name = EXCLUDED.show_name,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  host_name = EXCLUDED.host_name,
  category = EXCLUDED.category,
  status = EXCLUDED.status,
  updated_at = now();
