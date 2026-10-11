import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { modules, TOTAL_LESSONS } from "@/data/course";
import { formatDate, displayName } from "@/lib/utils";
import { canAccessInstructorRoutes } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instructor Dashboard" };

export default async function InstructorPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/instructor");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");
  if (!canAccessInstructorRoutes(profile.role)) redirect("/forbidden");

  const supabase = await createClient();

  // Get cohorts assigned to this instructor (or all cohorts for admin)
  let cohortQuery = supabase.from("cohorts").select("*, organizations(name)");
  if (profile.role === "instructor") {
    cohortQuery = cohortQuery.eq("instructor_profile_id", profile.id);
  }
  const { data: cohorts } = await cohortQuery.order("created_at", { ascending: false });

  // Get enrollments for these cohorts
  const cohortIds = (cohorts ?? []).map((c: any) => c.id);
  let enrolledStudents: any[] = [];
  let enrollments: any[] = [];

  if (cohortIds.length > 0) {
    const { data: enrollData } = await supabase
      .from("enrollments")
      .select("*, profiles(*), cohorts(*)")
      .in("cohort_id", cohortIds)
      .eq("status", "enrolled");
    enrollments = enrollData ?? [];
    enrolledStudents = enrollments.map((e: any) => e.profiles).filter(Boolean);

    // Get progress for all enrolled students
    const studentIds = enrolledStudents.map((s: any) => s.id);
    if (studentIds.length > 0) {
      const { data: lessonProgress } = await supabase
        .from("lesson_progress")
        .select("*")
        .in("profile_id", studentIds);
      const { data: moduleProgress } = await supabase
        .from("module_progress")
        .select("*")
        .in("profile_id", studentIds);
      const { data: quizAttempts } = await supabase
        .from("quiz_attempts")
        .select("*")
        .in("profile_id", studentIds)
        .order("created_at", { ascending: false });
      const { data: decisionLabs } = await supabase
        .from("decision_lab_submissions")
        .select("*")
        .in("profile_id", studentIds);
      const { data: blueprints } = await supabase
        .from("blueprint_sections")
        .select("*")
        .in("profile_id", studentIds);
      const { data: certificates } = await supabase
        .from("certificates")
        .select("*")
        .in("profile_id", studentIds)
        .eq("status", "issued");

      // Build student summaries
      enrolledStudents = enrolledStudents.map((s: any) => {
        const sLessons = (lessonProgress ?? []).filter((l: any) => l.profile_id === s.id && l.status === "completed");
        const sModules = (moduleProgress ?? []).filter((m: any) => m.profile_id === s.id);
        const sQuizzes = (quizAttempts ?? []).filter((q: any) => q.profile_id === s.id);
        const sDecisionLabs = (decisionLabs ?? []).filter((d: any) => d.profile_id === s.id);
        const sBlueprints = (blueprints ?? []).filter((b: any) => b.profile_id === s.id && b.completed);
        const sCerts = (certificates ?? []).filter((c: any) => c.profile_id === s.id);
        const completedModules = sModules.filter((m: any) => m.module_completed).length;
        const bestQuizScore = sQuizzes.length > 0 ? Math.max(...sQuizzes.map((q: any) => Number(q.score))) : null;
        const enrollment = enrollments.find((e: any) => e.profile_id === s.id);

        return {
          ...s,
          lessonsCompleted: sLessons.length,
          modulesCompleted: completedModules,
          quizScore: bestQuizScore,
          decisionLabsCompleted: sDecisionLabs.length,
          blueprintSections: sBlueprints.length,
          hasCertificate: sCerts.length > 0,
          cohortName: enrollment?.cohorts?.name || "—",
          needsFollowUp: completedModules < modules.length && sLessons.length < TOTAL_LESSONS * 0.5,
        };
      });
    }
  }

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Instructor Dashboard</h1>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><p className="text-sm text-rise-muted">Cohorts</p><p className="mt-1 text-2xl font-bold text-rise-navy">{cohorts?.length ?? 0}</p></Card>
          <Card><p className="text-sm text-rise-muted">Enrolled Students</p><p className="mt-1 text-2xl font-bold text-rise-navy">{enrolledStudents.length}</p></Card>
          <Card><p className="text-sm text-rise-muted">Need Follow-up</p><p className="mt-1 text-2xl font-bold text-rise-warning">{enrolledStudents.filter((s: any) => s.needsFollowUp).length}</p></Card>
          <Card><p className="text-sm text-rise-muted">Certificates Issued</p><p className="mt-1 text-2xl font-bold text-rise-success">{enrolledStudents.filter((s: any) => s.hasCertificate).length}</p></Card>
        </div>

        {/* Cohorts */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">My Cohorts</h2>
        <div className="mb-6 space-y-3">
          {(cohorts ?? []).map((c: any) => {
            const cohortEnrollments = enrollments.filter((e: any) => e.cohort_id === c.id);
            return (
              <Card key={c.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-rise-navy">{c.name}</h3>
                    <p className="text-sm text-rise-muted">
                      {c.organizations?.name || "—"} · {cohortEnrollments.length} students
                      {c.term && ` · ${c.term}`}
                    </p>
                  </div>
                  <span className="rounded-full bg-rise-sky px-3 py-1 text-xs font-medium text-rise-navy">
                    {cohortEnrollments.length} enrolled
                  </span>
                </div>
              </Card>
            );
          })}
          {(!cohorts || cohorts.length === 0) && (
            <Card><CardDescription>No cohorts assigned yet.</CardDescription></Card>
          )}
        </div>

        {/* Student progress table */}
        {enrolledStudents.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold text-rise-navy">Student Progress</h2>
            <div className="overflow-x-auto rounded-2xl border border-rise-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-rise-navy text-white">
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Cohort</th>
                    <th className="px-4 py-3 text-center font-medium">Lessons</th>
                    <th className="px-4 py-3 text-center font-medium">Modules</th>
                    <th className="px-4 py-3 text-center font-medium">Quiz Avg</th>
                    <th className="px-4 py-3 text-center font-medium">Decision Labs</th>
                    <th className="px-4 py-3 text-center font-medium">Blueprint</th>
                    <th className="px-4 py-3 text-center font-medium">Certificate</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map((s: any) => (
                    <tr key={s.id} className="border-t border-rise-border">
                      <td className="px-4 py-3 font-medium text-rise-navy">{displayName(s)}</td>
                      <td className="px-4 py-3 text-rise-muted">{s.cohortName}</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.lessonsCompleted}/{TOTAL_LESSONS}</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.modulesCompleted}/6</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.quizScore ? `${s.quizScore}%` : "—"}</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.decisionLabsCompleted}/6</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.blueprintSections}/6</td>
                      <td className="px-4 py-3 text-center">{s.hasCertificate ? "✓" : "—"}</td>
                      <td className="px-4 py-3 text-center">
                        {s.needsFollowUp ? (
                          <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">Follow-up</span>
                        ) : s.hasCertificate ? (
                          <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs font-semibold text-rise-success">Complete</span>
                        ) : (
                          <span className="rounded-full bg-rise-sky px-2 py-0.5 text-xs font-medium text-rise-navy">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
