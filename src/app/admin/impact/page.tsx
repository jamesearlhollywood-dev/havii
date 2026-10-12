import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessAdminRoutes } from "@/lib/roles";
import { DEMO_ADMIN_PROFILE } from "@/data/demo-data";
import type { Profile } from "@/lib/types";
import { MetricCard } from "@/components/analytics/MetricCard";
import { LineChart, VerticalBarChart } from "@/components/analytics/Charts";
import { getProgramImpactData } from "@/actions/analytics";
import { fetchNotificationData } from "@/lib/notification-helpers";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Program Impact Dashboard" };

export default async function AdminImpactPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/impact");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  const impactData = await getProgramImpactData();
  const { notifications, unreadCount } = await fetchNotificationData();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rise-navy">Program Impact Dashboard</h1>
            <p className="mt-1 text-sm text-rise-muted">RISE USA program trends over time</p>
          </div>
          <Link
            href="/admin/analytics"
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            ← Back to Analytics
          </Link>
        </div>

        {/* Summary metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Participating Organizations" value={impactData.participating_organizations} />
          <MetricCard label="Active Cohorts" value={impactData.active_cohorts} />
          <MetricCard
            label="Total Enrollments (Period)"
            value={impactData.enrollments_by_month.reduce((a, b) => a + b.value, 0)}
          />
          <MetricCard
            label="Total Certificates (Period)"
            value={impactData.certificates_by_month.reduce((a, b) => a + b.value, 0)}
            tone="success"
          />
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Enrollments by month */}
          <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-rise-navy">Enrollments by Month</h3>
            <VerticalBarChart data={impactData.enrollments_by_month} color="var(--rise-blue)" />
          </div>

          {/* Completion rate over time */}
          <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-rise-navy">Completion Rate Over Time</h3>
            <LineChart data={impactData.completion_rate_over_time} color="var(--rise-success)" unit="%" />
          </div>

          {/* Assessment performance over time */}
          <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-rise-navy">Assessment Performance Over Time</h3>
            <LineChart data={impactData.assessment_performance_over_time} color="var(--rise-blue-dark)" unit="%" />
          </div>

          {/* Certificates issued over time */}
          <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-rise-navy">Certificates Issued Over Time</h3>
            <VerticalBarChart data={impactData.certificates_by_month} color="var(--rise-gold)" />
          </div>

          {/* Confidence improvement over time */}
          <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-rise-navy">
              Financial-Confidence Improvement Over Time
            </h3>
            <p className="mb-3 text-xs text-rise-muted">
              Self-reported financial confidence improvement (percentage change from pre-course baseline).
            </p>
            <LineChart data={impactData.confidence_improvement_over_time} color="var(--rise-red)" unit="%" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
