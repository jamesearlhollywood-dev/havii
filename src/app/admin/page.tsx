import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription } from "@/components/ui/Card";
import { modules, TOTAL_LESSONS } from "@/data/course";
import { displayName, formatDate } from "@/lib/utils";
import { canAccessAdminRoutes } from "@/lib/roles";
import {
  DEMO_ADMIN_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
  DEMO_COHORT_STUDENTS,
  DEMO_ENROLLMENTS,
  DEMO_ADMIN_SETTINGS,
  DEMO_CERTIFICATES,
} from "@/data/demo-data";
import type { Profile } from "@/lib/types";
import { ExportStudentCompletionButton, ExportCertificatesButton, ExportCohortCompletionButton, ExportCompletionDatesButton } from "@/components/admin/CsvExport";
import { fetchNotificationData } from "@/lib/notification-helpers";
import { getActiveAnnouncements } from "@/actions/announcements";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  // Use demo data for the dashboard
  const students = DEMO_COHORT_STUDENTS;
  const organizations = DEMO_ORGANIZATIONS;
  const cohorts = DEMO_COHORTS;
  const enrollments = DEMO_ENROLLMENTS;

  const totalLearners = students.length;
  const completions = students.filter((s) => s.has_certificate).length;
  const completionRate = totalLearners > 0 ? Math.round((completions / totalLearners) * 100) : 0;
  const activeLearners = students.filter((s) => s.lessons_completed > 0 && !s.is_stalled && s.enrollment_status !== "completed" && s.enrollment_status !== "withdrawn").length;
  const stalledLearners = students.filter((s) => s.is_stalled).length;

  const allScores = students.filter((s) => s.best_quiz_score !== null).map((s) => s.best_quiz_score!);
  const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  const blueprintCompletionRate = totalLearners > 0
    ? Math.round((students.filter((s) => s.blueprint_sections_completed === modules.length).length / totalLearners) * 100)
    : 0;

  const { notifications, unreadCount } = await fetchNotificationData();
  const activeAnnouncements = await getActiveAnnouncements();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Admin Dashboard</h1>

        {/* Metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-rise-muted">Total Learners</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{totalLearners}</p>
            <p className="mt-0.5 text-xs text-rise-muted">{activeLearners} active · {stalledLearners} stalled</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Completions</p>
            <p className="mt-1 text-3xl font-bold text-rise-success">{completions}</p>
            <p className="mt-0.5 text-xs text-rise-muted">{completionRate}% completion rate</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Avg Assessment Score</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{avgScore}%</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Blueprint Completion</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{blueprintCompletionRate}%</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Certificates Issued</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{completions}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Organizations</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{organizations.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Cohorts</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{cohorts.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Stalled Threshold</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{DEMO_ADMIN_SETTINGS.stalled_threshold_days} days</p>
          </Card>
        </div>

        {/* Analytics Quick Links */}
        <div className="mb-6 flex flex-wrap gap-3">
          <a href="/admin/analytics" className="rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light">
            📊 Analytics Dashboard
          </a>
          <a href="/admin/outcomes" className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
            📈 Learning Outcomes
          </a>
          <a href="/admin/impact" className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
            🌟 Program Impact
          </a>
          <a href="/admin/reports" className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
            📋 Reports & Exports
          </a>
        </div>

        {/* Active Announcements */}
        {activeAnnouncements.length > 0 && (
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-bold text-rise-navy">Active Announcements</h2>
            {activeAnnouncements.slice(0, 3).map((ann) => (
              <Card
                key={ann.id}
                className={
                  ann.priority === "urgent"
                    ? "border-rise-red/40 bg-rise-red/5"
                    : ann.priority === "important"
                    ? "border-rise-gold/40 bg-rise-warning-light"
                    : ""
                }
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">
                    {ann.priority === "urgent" ? "🚨" : ann.priority === "important" ? "⭐" : "📢"}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-rise-navy">{ann.title}</h3>
                      {ann.priority !== "standard" && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${ann.priority === "urgent" ? "bg-rise-red text-white" : "bg-rise-gold text-rise-navy"}`}>
                          {ann.priority}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-rise-muted line-clamp-2">{ann.body}</p>
                    <p className="mt-1 text-xs text-rise-muted">By {ann.created_by_name} · {formatDate(ann.publish_date)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Export buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <ExportStudentCompletionButton students={students} />
          <ExportCertificatesButton certificates={DEMO_CERTIFICATES} />
          <ExportCompletionDatesButton students={students} />
          <ExportCohortCompletionButton students={students} />
        </div>

        {/* Organizations */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Organizations</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.id}>
              <h3 className="font-bold text-rise-navy">{org.name}</h3>
              <p className="mt-0.5 text-xs text-rise-muted capitalize">{org.type}</p>
              {org.city && <p className="mt-1 text-xs text-rise-muted">{org.city}, {org.state}</p>}
            </Card>
          ))}
        </div>

        {/* Cohorts */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Cohorts</h2>
        <div className="mb-6 space-y-3">
          {cohorts.map((c) => {
            const cohortStudentCount = students.filter((s) => s.cohort_name === c.name).length;
            return (
              <Card key={c.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-rise-navy">{c.name}</h3>
                    <p className="text-sm text-rise-muted">
                      {c.organization_name} · Instructor: {c.instructor_name || "Unassigned"} · {cohortStudentCount} students
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {c.term && <span className="rounded-full bg-rise-sky px-2.5 py-1 text-xs text-rise-navy">{c.term}</span>}
                    {c.starts_on && <span className="text-xs text-rise-muted">Starts: {formatDate(c.starts_on)}</span>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Student overview */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">All Students</h2>
        <div className="overflow-x-auto rounded-2xl border border-rise-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rise-navy text-white">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Cohort</th>
                <th className="px-4 py-3 text-center font-medium">Lessons</th>
                <th className="px-4 py-3 text-center font-medium">Modules</th>
                <th className="px-4 py-3 text-center font-medium">Quiz</th>
                <th className="px-4 py-3 text-center font-medium">Certificate</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Record</th>
                <th className="px-4 py-3 text-center font-medium">Outcomes</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.profile_id} className="border-t border-rise-border">
                  <td className="px-4 py-3 font-medium text-rise-navy">{s.student_name}</td>
                  <td className="px-4 py-3 text-rise-muted">{s.cohort_name}</td>
                  <td className="px-4 py-3 text-center text-rise-navy">{s.lessons_completed}/{TOTAL_LESSONS}</td>
                  <td className="px-4 py-3 text-center text-rise-navy">{s.modules_completed}/6</td>
                  <td className="px-4 py-3 text-center text-rise-navy">
                    {s.best_quiz_score !== null ? `${s.best_quiz_score}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">{s.has_certificate ? "✓" : "—"}</td>
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
                  <td className="px-4 py-3 text-center">
                    <a
                      href={`/admin/records/${s.profile_id}`}
                      className="rounded-lg border border-rise-border bg-white px-2 py-1 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a
                      href={`/outcomes/${s.profile_id}`}
                      className="rounded-lg border border-rise-border bg-white px-2 py-1 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                    >
                      Profile
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
