import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessAdminRoutes } from "@/lib/roles";
import {
  DEMO_ADMIN_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
} from "@/data/demo-data";
import type { Profile, AnalyticsFilter } from "@/lib/types";
import { MetricCard } from "@/components/analytics/MetricCard";
import { AnalyticsFiltersSuspense as AnalyticsFilters } from "@/components/analytics/AnalyticsFiltersSuspense";
import { BarChart } from "@/components/analytics/Charts";
import { getAnalyticsData } from "@/actions/analytics";
import { fetchNotificationData } from "@/lib/notification-helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics Dashboard" };

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/analytics");
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
    enrollment_status: typeof params.status === "string" ? (params.status as any) : "all",
    date_from: typeof params.from === "string" ? params.from : undefined,
    date_to: typeof params.to === "string" ? params.to : undefined,
  };

  const { students, metrics, modulePerformance } = await getAnalyticsData(filter, "system");

  const { notifications, unreadCount } = await fetchNotificationData();

  const cohorts = DEMO_COHORTS.map((c) => ({ ...c, organization_name: DEMO_ORGANIZATIONS.find((o) => o.id === c.organization_id)?.name ?? "" }));

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rise-navy">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-rise-muted">System-wide program metrics and outcomes</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/outcomes"
              className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
            >
              Learning Outcomes
            </Link>
            <Link
              href="/admin/impact"
              className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
            >
              Program Impact
            </Link>
            <Link
              href="/admin/reports"
              className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
            >
              Reports
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <AnalyticsFilters
            organizations={DEMO_ORGANIZATIONS}
            cohorts={cohorts}
            showInstructorFilter
            showGradeFilter
            basePath="/admin/analytics"
          />
        </div>

        {/* Primary Metrics */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Primary Metrics</h2>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Enrolled Students" value={metrics.total_enrolled} />
          <MetricCard label="Active Students" value={metrics.active_students} tone="navy" />
          <MetricCard label="Students Not Started" value={metrics.not_started} tone="warning" />
          <MetricCard label="Students In Progress" value={metrics.in_progress} />
          <MetricCard label="Students Completed" value={metrics.completed} tone="success" />
          <MetricCard label="Course Completion Rate" value={`${metrics.completion_rate}%`} tone="success" />
          <MetricCard label="Average Overall Progress" value={`${metrics.avg_overall_progress}%`} />
          <MetricCard label="Avg Knowledge Check Score" value={`${metrics.avg_knowledge_check_score}%`} />
          <MetricCard label="Final Assessment Pass Rate" value={`${metrics.final_assessment_pass_rate}%`} />
          <MetricCard label="Avg Final Assessment Score" value={`${metrics.avg_final_assessment_score}%`} />
          <MetricCard label="Decision Labs Completed" value={metrics.decision_labs_completed} />
          <MetricCard label="Blueprint Completion Rate" value={`${metrics.blueprint_completion_rate}%`} />
          <MetricCard label="Certificates Issued" value={metrics.certificates_issued} tone="success" />
          <MetricCard label="Avg Time to Completion" value={metrics.avg_time_to_completion_days > 0 ? `${metrics.avg_time_to_completion_days} days` : "—"} />
          <MetricCard label="Students Currently Stalled" value={metrics.stalled_students} tone="warning" />
        </div>

        {/* Module performance chart */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Module Performance Overview</h2>
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-rise-navy">Avg Knowledge Check Score by Module</h3>
            <BarChart
              data={modulePerformance.map((m) => ({
                label: `Module ${m.module_number}`,
                value: m.avg_knowledge_check_score,
                unit: "%",
              }))}
              color="var(--rise-blue-dark)"
              max={100}
            />
          </div>
          <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-rise-navy">Pass Rate by Module</h3>
            <BarChart
              data={modulePerformance.map((m) => ({
                label: `Module ${m.module_number}`,
                value: m.pass_rate,
                unit: "%",
              }))}
              color="var(--rise-success)"
              max={100}
            />
          </div>
        </div>

        {/* Enrollment status breakdown */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Enrollment Status Breakdown</h2>
        <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
          <BarChart
            data={[
              { label: "Not Started", value: metrics.not_started },
              { label: "In Progress", value: metrics.in_progress },
              { label: "Active", value: metrics.active_students },
              { label: "Completed", value: metrics.completed },
              { label: "Stalled", value: metrics.stalled_students },
            ]}
            color="var(--rise-navy)"
          />
        </div>

        {/* Link to detailed outcomes */}
        <div className="mt-6">
          <Link
            href="/admin/outcomes"
            className="inline-flex items-center gap-2 rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light"
          >
            View Learning Outcomes & Confidence Analysis →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
