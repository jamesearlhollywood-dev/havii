-- HAVII: RLS policies for youth group/session visibility
-- Allows enrolled youth to see their cohorts and upcoming sessions
-- Does NOT change existing staff/admin policies (RLS is additive)

-- Youth can SELECT cohorts they're enrolled in
CREATE POLICY cohorts_select_enrolled
  ON public.cohorts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.cohort_id = cohorts.id
        AND e.profile_id = public.current_profile_id()
        AND e.status = 'enrolled'
    )
  );

-- Youth can SELECT sessions for their enrolled cohorts
CREATE POLICY sessions_select_enrolled
  ON public.sessions FOR SELECT
  TO authenticated
  USING (
    cohort_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.cohort_id = sessions.cohort_id
        AND e.profile_id = public.current_profile_id()
        AND e.status = 'enrolled'
    )
  );
