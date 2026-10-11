import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { modules, TOTAL_LESSONS } from "@/data/course";
import { displayName } from "@/lib/utils";
import { canAccessOrgManagerRoutes } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Organization Dashboard" };

export default async function OrgManagerPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/org-manager");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");
  if (!canAccessOrgManagerRoutes(profile.role)) redirect("/forbidden");

  const supabase = await createClient();

  // Get organization
  let orgId = profile.organization_id;
  let orgName = "Your Organization";

  if (profile.role === "admin" && !orgId) {
    // Admin sees all
  }

  // Get organization info
  if (orgId) {
    const { data: org } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .maybeSingle();
    if (org) orgName = org.name;
  }

  // Get cohorts for this organization
  let cohortQuery = supabase.from("cohorts").select("*, organizations(name)");
  if (orgId) {
    cohortQuery = cohortQuery.eq("organization_id", orgId);
  }
  const { data: cohorts } = await cohortQuery.order("created_at", { ascending: false });

  // Get enrollments
  const cohortIds = (cohorts ?? []).map((c: any) => c.id);
  let students: any[] = [];

  if (cohortIds.length > 0) {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("*, profiles(*)")
      .in("cohort_id", cohortIds)
      .eq("status", "enrolled");

    students = (enrollments ?? []).map((e: any) => e.profiles).filter(Boolean);
    const studentIds = students.map((s: any) => s.id);

    if (studentIds.length > 0) {
      const { data: lessonProgress } = await supabase.from("lesson_progress").select("*").in("profile_id", studentIds);
      const { data: moduleProgress } = await supabase.from("module_progress").select("*").in("profile_id", studentIds);
      const { data: certificates } = await supabase.from("certificates").select("*").in("profile_id", studentIds).eq("status", "issued");

      students = students.map((s: any) => {
        const sLessons = (lessonProgress ?? []).filter((l: any) => l.profile_id === s.id && l.status === "completed");
        const sModules = (moduleProgress ?? []).filter((m: any) => m.profile_id === s.id && m.module_completed);
        const sCerts = (certificates ?? []).filter((c: any) => c.profile_id === s.id);
        return {
          ...s,
          lessonsCompleted: sLessons.length,
          modulesCompleted: sModules.length,
          hasCertificate: sCerts.length > 0,
        };
      });
    }
  }

  const completedCount = students.filter((s: any) => s.hasCertificate).length;
  const completionRate = students.length > 0 ? Math.round((completedCount / students.length) * 100) : 0;

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-rise-navy">Organization Dashboard</h1>
        <p className="mb-6 text-rise-muted">{orgName}</p>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><p className="text-sm text-rise-muted">Total Learners</p><p className="mt-1 text-2xl font-bold text-rise-navy">{students.length}</p></Card>
          <Card><p className="text-sm text-rise-muted">Cohorts</p><p className="mt-1 text-2xl font-bold text-rise-navy">{cohorts?.length ?? 0}</p></Card>
          <Card><p className="text-sm text-rise-muted">Completions</p><p className="mt-1 text-2xl font-bold text-rise-success">{completedCount}</p></Card>
          <Card><p className="text-sm text-rise-muted">Completion Rate</p><p className="mt-1 text-2xl font-bold text-rise-navy">{completionRate}%</p></Card>
        </div>

        {/* Cohorts */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Cohorts</h2>
        <div className="mb-6 space-y-3">
          {(cohorts ?? []).map((c: any) => (
            <Card key={c.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-rise-navy">{c.name}</h3>
                  <p className="text-sm text-rise-muted">
                    {c.term || "—"} {c.site && `· ${c.site}`}
                  </p>
                </div>
              </div>
            </Card>
          ))}
          {(!cohorts || cohorts.length === 0) && (
            <Card><CardDescription>No cohorts yet.</CardDescription></Card>
          )}
        </div>

        {/* Student progress */}
        {students.length > 0 && (
          <div>
            <h2 className="mb-3 text-xl font-bold text-rise-navy">Learner Progress</h2>
            <div className="overflow-x-auto rounded-2xl border border-rise-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-rise-navy text-white">
                    <th className="px-4 py-3 text-left font-medium">Learner</th>
                    <th className="px-4 py-3 text-center font-medium">Lessons</th>
                    <th className="px-4 py-3 text-center font-medium">Modules</th>
                    <th className="px-4 py-3 text-center font-medium">Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s: any) => (
                    <tr key={s.id} className="border-t border-rise-border">
                      <td className="px-4 py-3 font-medium text-rise-navy">{displayName(s)}</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.lessonsCompleted}/{TOTAL_LESSONS}</td>
                      <td className="px-4 py-3 text-center text-rise-navy">{s.modulesCompleted}/6</td>
                      <td className="px-4 py-3 text-center">{s.hasCertificate ? "✓" : "—"}</td>
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
