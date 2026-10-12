import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessAdminRoutes } from "@/lib/roles";
import {
  DEMO_ADMIN_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
  DEMO_COHORT_STUDENTS,
} from "@/data/demo-data";
import type { Profile, AnalyticsFilter } from "@/lib/types";
import { ModulePerformanceTable } from "@/components/analytics/ModulePerformanceTable";
import { ConfidenceAnalysisView } from "@/components/analytics/ConfidenceAnalysis";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { Alert } from "@/components/ui/Alert";
import { getAnalyticsData, getConfidenceAnalysis } from "@/actions/analytics";
import { fetchNotificationData } from "@/lib/notification-helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Learning Outcomes" };

export default async function AdminOutcomesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/outcomes");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  const filter: AnalyticsFilter = {
    organization_id: typeof params.org === "string" ? params.org : undefined,
    cohort_id: typeof params.cohort === "string" ? params.cohort : undefined,
  };

  const { modulePerformance } = await getAnalyticsData(filter, "system");
  const confidenceAnalysis = await getConfidenceAnalysis(filter, "system", "System-Wide");

  const { notifications, unreadCount } = await fetchNotificationData();
  const cohorts = DEMO_COHORTS.map((c) => ({ ...c, organization_name: DEMO_ORGANIZATIONS.find((o) => o.id === c.organization_id)?.name ?? "" }));

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rise-navy">Learning Outcomes</h1>
            <p className="mt-1 text-sm text-rise-muted">Module performance, knowledge gain, and confidence analysis</p>
          </div>
          <Link
            href="/admin/analytics"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            ← Back to Analytics
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <AnalyticsFilters
            organizations={DEMO_ORGANIZATIONS}
            cohorts={cohorts}
            showGradeFilter
            basePath="/admin/outcomes"
          />
        </div>

        {/* Learning Outcomes Section */}
        <h2 className="mb-4 text-xl font-bold text-rise-navy">Module Performance Comparison</h2>
        <p className="mb-4 text-sm text-rise-muted">
          Compare student performance across the six RISE USA modules.
        </p>
        <ModulePerformanceTable modules={modulePerformance} />

        {/* Knowledge Gain Report (separate from confidence) */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-rise-navy">Knowledge Gain Report</h2>
          <Alert tone="info">
            This report uses <strong>actual assessment performance</strong> (Knowledge Check scores and Final Assessment results).
            It is separate from the self-reported confidence survey and is not combined into a single score.
          </Alert>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modulePerformance.map((m) => (
              <div key={m.module_id} className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-rise-navy">Module {m.module_number}</h3>
                <p className="mb-3 text-xs text-rise-muted">{m.module_title.split("—")[0]}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-rise-muted">Avg KC Score</span>
                    <span className="font-semibold text-rise-navy">{m.avg_knowledge_check_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rise-muted">Pass Rate</span>
                    <span className="font-semibold text-rise-navy">{m.pass_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rise-muted">Avg Attempts</span>
                    <span className="font-semibold text-rise-navy">{m.avg_attempts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pre/Post Confidence Analysis */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-rise-navy">Pre/Post Confidence Analysis</h2>
          <p className="mb-4 text-sm text-rise-muted">
            Based on the RISE Starting Point Survey (onboarding) and the RISE End-of-Course Confidence Survey.
            Compare at individual, cohort, organization, and system-wide levels.
          </p>
          <ConfidenceAnalysisView analysis={confidenceAnalysis} />
        </div>

        {/* Level comparison links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/outcomes?org=org-lincoln"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            Organization Level
          </Link>
          <Link
            href="/admin/outcomes?cohort=cohort-fall-2025"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            Cohort Level
          </Link>
          <Link
            href="/admin/outcomes"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            System-Wide Level
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
