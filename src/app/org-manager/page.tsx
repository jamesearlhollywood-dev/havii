import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription } from "@/components/ui/Card";
import { modules, TOTAL_LESSONS } from "@/data/course";
import { displayName } from "@/lib/utils";
import { canAccessOrgManagerRoutes } from "@/lib/roles";
import {
  DEMO_ORG_MANAGER_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
  DEMO_COHORT_STUDENTS,
} from "@/data/demo-data";
import type { Profile } from "@/lib/types";
import { ExportStudentCompletionButton, ExportCohortCompletionButton, ExportCompletionDatesButton } from "@/components/admin/CsvExport";
import { OrgManagerReviewStatus } from "@/components/review/OrgManagerReviewStatus";
import { getOrgManagerReviewStatus } from "@/actions/reviews";
import { getDemoOrgManagerReviewItems } from "@/data/review-demo-data";
import type { OrgManagerReviewItem } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Organization Dashboard" };

export default async function OrgManagerPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/org-manager");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessOrgManagerRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ORG_MANAGER_PROFILE;
  }

  // Demo data — scoped to the org manager's organization
  const orgId = profile.organization_id;
  const org = DEMO_ORGANIZATIONS.find((o) => o.id === orgId);
  const orgName = org?.name || "Your Organization";
  const orgCohorts = DEMO_COHORTS.filter((c) => c.organization_id === orgId);
  const orgStudents = DEMO_COHORT_STUDENTS.filter((s) =>
    orgCohorts.some((c) => c.name === s.cohort_name)
  );

  const completedCount = orgStudents.filter((s) => s.has_certificate).length;
  const completionRate = orgStudents.length > 0 ? Math.round((completedCount / orgStudents.length) * 100) : 0;

  // Fetch review status items
  const reviewItems: OrgManagerReviewItem[] = supabaseConnected
    ? await getOrgManagerReviewStatus()
    : getDemoOrgManagerReviewItems(orgId || "org-lincoln");

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-rise-navy">Organization Dashboard</h1>
        <p className="mb-6 text-rise-muted">{orgName}</p>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-rise-muted">Total Learners</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{orgStudents.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Cohorts</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{orgCohorts.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Completions</p>
            <p className="mt-1 text-2xl font-bold text-rise-success">{completedCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Completion Rate</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{completionRate}%</p>
          </Card>
        </div>

        {/* Assessment metrics */}
        {orgStudents.length > 0 && (() => {
          const studentsWithScores = orgStudents.filter((s) => s.best_quiz_score !== null);
          const avgScore = studentsWithScores.length > 0
            ? Math.round(studentsWithScores.reduce((sum, s) => sum + (s.best_quiz_score ?? 0), 0) / studentsWithScores.length)
            : 0;
          const passedCount = orgStudents.filter((s) => s.quiz_passed).length;
          return (
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <p className="text-sm text-rise-muted">Avg Assessment Score</p>
                <p className="mt-1 text-2xl font-bold text-rise-navy">{avgScore}%</p>
              </Card>
              <Card>
                <p className="text-sm text-rise-muted">Passed Knowledge Checks</p>
                <p className="mt-1 text-2xl font-bold text-rise-success">{passedCount}</p>
              </Card>
              <Card>
                <p className="text-sm text-rise-muted">Blueprint Sections Avg</p>
                <p className="mt-1 text-2xl font-bold text-rise-navy">
                  {orgStudents.length > 0
                    ? (orgStudents.reduce((sum, s) => sum + s.blueprint_sections_completed, 0) / orgStudents.length).toFixed(1)
                    : 0}/6
                </p>
              </Card>
            </div>
          );
        })()}

        {/* Export buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <ExportStudentCompletionButton students={orgStudents} />
          <ExportCompletionDatesButton students={orgStudents} />
          <ExportCohortCompletionButton students={orgStudents} />
        </div>

        {/* Cohorts */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Cohorts</h2>
        <div className="mb-6 space-y-3">
          {orgCohorts.map((c) => {
            const cohortStudentCount = orgStudents.filter((s) => s.cohort_name === c.name).length;
            return (
              <Card key={c.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-rise-navy">{c.name}</h3>
                    <p className="text-sm text-rise-muted">
                      {c.term || "—"} {c.site && `· ${c.site}`} · {cohortStudentCount} students
                    </p>
                  </div>
                  {c.instructor_name && (
                    <span className="rounded-full bg-rise-sky px-3 py-1 text-xs font-medium text-rise-navy">
                      {c.instructor_name}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
          {orgCohorts.length === 0 && (
            <Card><CardDescription>No cohorts yet.</CardDescription></Card>
          )}
        </div>

        {/* Learner progress */}
        {orgStudents.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold text-rise-navy">Learner Progress</h2>
            <div className="overflow-x-auto rounded-2xl border border-rise-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-rise-navy text-white">
                    <th className="px-4 py-3 text-left font-medium">Learner</th>
                    <th className="px-4 py-3 text-left font-medium">Cohort</th>
                    <th className="px-4 py-3 text-center font-medium">Lessons</th>
                    <th className="px-4 py-3 text-center font-medium">Modules</th>
                    <th className="px-4 py-3 text-center font-medium">Certificate</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-center font-medium">Record</th>
                  </tr>
                </thead>
                <tbody>
                  {orgStudents.map((s) => (
                    <tr key={s.profile_id} className="border-t border-rise-border">
                      <td className="px-4 py-3 font-medium text-rise-navy">{s.student_name}</td>
                      <td className="px-4 py-3 text-rise-muted">{s.cohort_name}</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.lessons_completed}/{TOTAL_LESSONS}</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.modules_completed}/6</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructor Review Status */}
        <OrgManagerReviewStatus items={reviewItems} />
      </div>
    </AppShell>
  );
}
