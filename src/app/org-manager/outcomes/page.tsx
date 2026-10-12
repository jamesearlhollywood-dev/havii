import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessOrgManagerRoutes } from "@/lib/roles";
import {
  DEMO_ORG_MANAGER_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
  DEMO_COHORT_STUDENTS,
  DEMO_CERTIFICATES,
} from "@/data/demo-data";
import { DEMO_MODULE_PERFORMANCE_DATA, DEMO_COHORT_STARTING_SURVEYS, DEMO_END_OF_COURSE_SURVEYS } from "@/data/analytics-demo-data";
import type { Profile, AnalyticsFilter } from "@/lib/types";
import { MetricCard } from "@/components/analytics/MetricCard";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { BarChart } from "@/components/analytics/Charts";
import { ModulePerformanceTable } from "@/components/analytics/ModulePerformanceTable";
import { ConfidenceAnalysisView } from "@/components/analytics/ConfidenceAnalysis";
import { computeModulePerformance, computeConfidenceAnalysis } from "@/lib/analytics-utils";
import { getAnalyticsData, getConfidenceAnalysis } from "@/actions/analytics";
import { fetchNotificationData } from "@/lib/notification-helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Organization Outcomes" };

export default async function OrgManagerOutcomesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let orgId: string | null;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/org-manager/outcomes");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessOrgManagerRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
    orgId = userProfile.organization_id;
  } else {
    profile = DEMO_ORG_MANAGER_PROFILE;
    orgId = DEMO_ORG_MANAGER_PROFILE.organization_id;
  }

  const filter: AnalyticsFilter = {
    cohort_id: typeof params.cohort === "string" ? params.cohort : undefined,
  };

  const { students, metrics, modulePerformance } = await getAnalyticsData(
    filter,
    "organization",
    orgId ?? undefined
  );

  const org = DEMO_ORGANIZATIONS.find((o) => o.id === orgId);
  const orgName = org?.name || "Your Organization";
  const orgCohorts = DEMO_COHORTS.filter((c) => c.organization_id === orgId).map((c) => ({ ...c, organization_name: orgName }));

  const confidenceAnalysis = await getConfidenceAnalysis(
    filter,
    "organization",
    orgName,
    orgId ?? undefined
  );

  const { notifications, unreadCount } = await fetchNotificationData();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rise-navy">Organization Outcomes Dashboard</h1>
            <p className="mt-1 text-sm text-rise-muted">{orgName} — outcomes and analytics</p>
          </div>
          <Link
            href="/org-manager"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <AnalyticsFilters
            cohorts={orgCohorts}
            showOrgFilter={false}
            showInstructorFilter={false}
            basePath="/org-manager/outcomes"
          />
        </div>

        {/* Summary metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Learners" value={metrics.total_enrolled} />
          <MetricCard label="Current Cohorts" value={orgCohorts.length} />
          <MetricCard label="Completion Rate" value={`${metrics.completion_rate}%`} tone="success" />
          <MetricCard label="Avg Course Progress" value={`${metrics.avg_overall_progress}%`} />
          <MetricCard label="Avg Assessment Performance" value={`${metrics.avg_knowledge_check_score}%`} />
          <MetricCard label="Certificate Count" value={metrics.certificates_issued} tone="success" />
          <MetricCard label="Stalled Learners" value={metrics.stalled_students} tone="warning" />
          <MetricCard
            label="Pre/Post Confidence Change"
            value={confidenceAnalysis.has_post_data ? `${confidenceAnalysis.percentage_change > 0 ? "+" : ""}${confidenceAnalysis.percentage_change}%` : "—"}
            tone={confidenceAnalysis.percentage_change > 0 ? "success" : "default"}
          />
        </div>

        {/* Module performance */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Module Performance</h2>
        <div className="mb-6">
          <ModulePerformanceTable modules={modulePerformance} />
        </div>

        {/* Pre/Post confidence */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Pre/Post Confidence Change</h2>
        <div className="mb-6">
          <ConfidenceAnalysisView analysis={confidenceAnalysis} />
        </div>
      </div>
    </AppShell>
  );
}
