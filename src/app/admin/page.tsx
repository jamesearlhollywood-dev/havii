import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { modules, TOTAL_LESSONS } from "@/data/course";
import { displayName, formatDate } from "@/lib/utils";
import { canAccessAdminRoutes } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/admin");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");
  if (!canAccessAdminRoutes(profile.role)) redirect("/forbidden");

  const supabase = await createClient();

  // Fetch all data
  const { data: allProfiles } = await supabase.from("profiles").select("*");
  const { data: organizations } = await supabase.from("organizations").select("*").order("name");
  const { data: cohorts } = await supabase.from("cohorts").select("*, organizations(name), profiles!cohorts_instructor_profile_id_fkey(first_name, last_name)").order("created_at", { ascending: false });
  const { data: enrollments } = await supabase.from("enrollments").select("*, profiles(*), cohorts(name)").eq("status", "enrolled");
  const { data: moduleProgress } = await supabase.from("module_progress").select("*");
  const { data: quizAttempts } = await supabase.from("quiz_attempts").select("*");
  const { data: certificates } = await supabase.from("certificates").select("*").eq("status", "issued");
  const { data: blueprintSections } = await supabase.from("blueprint_sections").select("*");
  const { data: supportRequests } = await supabase.from("support_requests").select("*").order("created_at", { ascending: false }).limit(5);

  const students = (allProfiles ?? []).filter((p: any) => p.role === "student");
  const instructors = (allProfiles ?? []).filter((p: any) => p.role === "instructor");
  const orgManagers = (allProfiles ?? []).filter((p: any) => p.role === "org_manager");
  const activeStudents = students.filter((s: any) => s.account_status === "active");

  // Metrics
  const totalLearners = students.length;
  const activeLearners = activeStudents.length;
  const completions = certificates?.length ?? 0;
  const completionRate = totalLearners > 0 ? Math.round((completions / totalLearners) * 100) : 0;

  // Average assessment score
  const allScores = (quizAttempts ?? []).map((a: any) => Number(a.score));
  const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length) : 0;

  // Blueprint completion rate
  const studentsWithBlueprint = new Set((blueprintSections ?? []).filter((b: any) => b.completed).map((b: any) => b.profile_id));
  const blueprintCompletionRate = totalLearners > 0 ? Math.round((studentsWithBlueprint.size / totalLearners) * 100) : 0;

  const orgCount = organizations?.length ?? 0;
  const cohortCount = cohorts?.length ?? 0;

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Admin Dashboard</h1>

        {/* Metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-rise-muted">Total Learners</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{totalLearners}</p>
            <p className="mt-0.5 text-xs text-rise-muted">{activeLearners} active</p>
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
            <p className="mt-1 text-3xl font-bold text-rise-navy">{orgCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Cohorts</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{cohortCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Instructors</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{instructors.length}</p>
          </Card>
        </div>

        {/* Organizations */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Organizations</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(organizations ?? []).map((org: any) => (
            <Card key={org.id}>
              <h3 className="font-bold text-rise-navy">{org.name}</h3>
              <p className="mt-0.5 text-xs text-rise-muted capitalize">{org.type}</p>
              {org.city && <p className="mt-1 text-xs text-rise-muted">{org.city}, {org.state}</p>}
            </Card>
          ))}
          {(!organizations || organizations.length === 0) && (
            <Card><CardDescription>No organizations yet.</CardDescription></Card>
          )}
        </div>

        {/* Cohorts */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Cohorts</h2>
        <div className="mb-6 space-y-3">
          {(cohorts ?? []).map((c: any) => {
            const cohortEnrollments = (enrollments ?? []).filter((e: any) => e.cohort_id === c.id);
            const instructorName = c.profiles ? `${c.profiles.first_name || ""} ${c.profiles.last_name || ""}`.trim() : "Unassigned";
            return (
              <Card key={c.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-rise-navy">{c.name}</h3>
                    <p className="text-sm text-rise-muted">
                      {c.organizations?.name || "—"} · Instructor: {instructorName} · {cohortEnrollments.length} students
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
          {(!cohorts || cohorts.length === 0) && (
            <Card><CardDescription>No cohorts yet.</CardDescription></Card>
          )}
        </div>

        {/* Student overview */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">All Students</h2>
        <div className="overflow-x-auto rounded-2xl border border-rise-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rise-navy text-white">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Lessons</th>
                <th className="px-4 py-3 text-center font-medium">Modules</th>
                <th className="px-4 py-3 text-center font-medium">Certificate</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => {
                const sModules = (moduleProgress ?? []).filter((m: any) => m.profile_id === s.id && m.module_completed);
                const sLessons = (moduleProgress ?? []).filter((m: any) => m.profile_id === s.id).reduce((sum: number, m: any) => sum + (m.lessons_completed || 0), 0);
                const sCert = (certificates ?? []).some((c: any) => c.profile_id === s.id);
                return (
                  <tr key={s.id} className="border-t border-rise-border">
                    <td className="px-4 py-3 font-medium text-rise-navy">{displayName(s)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.account_status === "active" ? "bg-rise-success-light text-rise-success" : "bg-rise-warning-light text-rise-warning"}`}>
                        {s.account_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-rise-navy">{sLessons}/{TOTAL_LESSONS}</td>
                    <td className="px-4 py-3 text-center text-rise-navy">{sModules.length}/6</td>
                    <td className="px-4 py-3 text-center">{sCert ? "✓" : "—"}</td>
                    <td className="px-4 py-3 text-rise-muted">{formatDate(s.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recent support requests */}
        <h2 className="mb-3 mt-6 text-xl font-bold text-rise-navy">Recent Support Requests</h2>
        <div className="space-y-2">
          {(supportRequests ?? []).map((sr: any) => (
            <Card key={sr.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-rise-navy">{sr.subject}</p>
                  <p className="mt-0.5 text-xs text-rise-muted">{formatDate(sr.created_at)} · Status: {sr.status}</p>
                </div>
              </div>
            </Card>
          ))}
          {(!supportRequests || supportRequests.length === 0) && (
            <Card><CardDescription>No support requests.</CardDescription></Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
