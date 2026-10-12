import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessInstructorRoutes } from "@/lib/roles";
import {
  DEMO_INSTRUCTOR_PROFILE,
  DEMO_COHORTS,
  DEMO_COHORT_STUDENTS,
  DEMO_ADMIN_SETTINGS,
} from "@/data/demo-data";
import { DEMO_MODULE_PERFORMANCE_DATA } from "@/data/analytics-demo-data";
import type { Profile, AnalyticsFilter } from "@/lib/types";
import { MetricCard } from "@/components/analytics/MetricCard";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { BarChart } from "@/components/analytics/Charts";
import { computeModulePerformance } from "@/lib/analytics-utils";
import { getAnalyticsData } from "@/actions/analytics";
import { fetchNotificationData } from "@/lib/notification-helpers";
import Link from "next/link";
import { modules, TOTAL_LESSONS } from "@/data/course";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instructor Analytics" };

export default async function InstructorAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let instructorId: string;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/instructor/analytics");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessInstructorRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
    instructorId = userProfile.id;
  } else {
    profile = DEMO_INSTRUCTOR_PROFILE;
    instructorId = DEMO_INSTRUCTOR_PROFILE.id;
  }

  const filter: AnalyticsFilter = {
    cohort_id: typeof params.cohort === "string" ? params.cohort : undefined,
    enrollment_status: typeof params.status === "string" ? (params.status as any) : "all",
  };

  const { students, metrics, modulePerformance } = await getAnalyticsData(
    filter,
    "instructor",
    undefined,
    instructorId
  );

  const { notifications, unreadCount } = await fetchNotificationData();
  const cohorts = DEMO_COHORTS.filter((c) => c.instructor_profile_id === instructorId).map((c) => ({ ...c, organization_name: "" }));

  // Students requiring follow-up
  const needsFollowUp = students.filter(
    (s) => s.is_stalled || s.failed_quiz_attempts > 0 || (s.best_quiz_score !== null && s.best_quiz_score < 70)
  );
  const multipleFailures = students.filter((s) => s.failed_quiz_attempts >= 2);
  const inactiveStalled = students.filter((s) => s.is_stalled);

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rise-navy">Instructor Analytics</h1>
            <p className="mt-1 text-sm text-rise-muted">Analytics for your assigned cohorts</p>
          </div>
          <Link
            href="/instructor"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <AnalyticsFilters
            cohorts={cohorts}
            showOrgFilter={false}
            showInstructorFilter={false}
            basePath="/instructor/analytics"
          />
        </div>

        {/* Metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Students" value={students.length} />
          <MetricCard label="Active Students" value={metrics.active_students} tone="navy" />
          <MetricCard label="Completed" value={metrics.completed} tone="success" />
          <MetricCard label="Stalled" value={metrics.stalled_students} tone="warning" />
          <MetricCard label="Avg Progress" value={`${metrics.avg_overall_progress}%`} />
          <MetricCard label="Avg KC Score" value={`${metrics.avg_knowledge_check_score}%`} />
          <MetricCard label="Decision Labs" value={metrics.decision_labs_completed} />
          <MetricCard label="Blueprint Completion" value={`${metrics.blueprint_completion_rate}%`} />
        </div>

        {/* Module completion chart */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Module Completion</h2>
        <div className="mb-6 rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
          <BarChart
            data={modulePerformance.map((m) => ({
              label: `Module ${m.module_number}`,
              value: m.pass_rate,
              unit: "%",
            }))}
            color="var(--rise-blue-dark)"
            max={100}
          />
        </div>

        {/* Assessment results */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Assessment Results</h2>
        <div className="mb-6 overflow-x-auto rounded-2xl border border-rise-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rise-navy text-white">
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-center font-medium">Best KC Score</th>
                <th className="px-4 py-3 text-center font-medium">KC Passed</th>
                <th className="px-4 py-3 text-center font-medium">Failed Attempts</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.profile_id} className="border-t border-rise-border">
                  <td className="px-4 py-3 font-medium text-rise-navy">{s.student_name}</td>
                  <td className="px-4 py-3 text-center text-rise-navy">
                    {s.best_quiz_score !== null ? `${s.best_quiz_score}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.quiz_passed ? "✓" : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.failed_quiz_attempts > 0 ? (
                      <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">
                        {s.failed_quiz_attempts}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.is_stalled ? (
                      <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">Stalled</span>
                    ) : s.has_certificate ? (
                      <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs font-semibold text-rise-success">Complete</span>
                    ) : s.lessons_completed === 0 ? (
                      <span className="rounded-full bg-rise-border px-2 py-0.5 text-xs font-medium text-rise-muted">Not Started</span>
                    ) : (
                      <span className="rounded-full bg-rise-sky px-2 py-0.5 text-xs font-medium text-rise-navy">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Students requiring follow-up */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Students Requiring Follow-Up</h2>
        <div className="mb-6 space-y-3">
          {needsFollowUp.length === 0 ? (
            <div className="rounded-2xl border border-rise-border bg-white p-5 text-sm text-rise-muted">
              No students currently require follow-up.
            </div>
          ) : (
            needsFollowUp.map((s) => (
              <div key={s.profile_id} className="flex items-center justify-between rounded-2xl border border-rise-border bg-white p-4 shadow-sm">
                <div>
                  <p className="font-semibold text-rise-navy">{s.student_name}</p>
                  <p className="text-xs text-rise-muted">{s.cohort_name}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.is_stalled && (
                    <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">
                      Inactive {DEMO_ADMIN_SETTINGS.stalled_threshold_days}+ days
                    </span>
                  )}
                  {s.failed_quiz_attempts >= 2 && (
                    <span className="rounded-full bg-rise-red/10 px-2 py-0.5 text-xs font-semibold text-rise-red">
                      Multiple failed attempts ({s.failed_quiz_attempts})
                    </span>
                  )}
                  {s.best_quiz_score !== null && s.best_quiz_score < 70 && (
                    <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">
                      KC below 70%
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Blueprint completion */}
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Blueprint Completion</h2>
        <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
          <BarChart
            data={students.map((s) => ({
              label: s.student_name.split(" ")[0],
              value: s.blueprint_sections_completed,
            }))}
            color="var(--rise-gold)"
            max={6}
          />
        </div>
      </div>
    </AppShell>
  );
}
