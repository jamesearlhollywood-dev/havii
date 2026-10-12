import { Suspense } from "react";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import type { Organization, Cohort, Profile } from "@/lib/types";

export function AnalyticsFiltersSuspense(props: {
  organizations?: Organization[];
  cohorts?: (Cohort & { organization_name: string })[];
  instructors?: Profile[];
  showOrgFilter?: boolean;
  showCohortFilter?: boolean;
  showInstructorFilter?: boolean;
  showGradeFilter?: boolean;
  showDateFilter?: boolean;
  basePath: string;
}) {
  return (
    <Suspense fallback={<div className="h-24 rounded-2xl border border-rise-border bg-white p-4 shadow-sm" />}>
      <AnalyticsFilters {...props} />
    </Suspense>
  );
}
