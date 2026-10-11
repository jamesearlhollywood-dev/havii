import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { modules, blueprintSections, TOTAL_LESSONS } from "@/data/course";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Progress" };

export default async function ProgressPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/progress");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  if (profile.role !== "student") {
    redirect(profile.role === "instructor" ? "/instructor" : profile.role === "org_manager" ? "/org-manager" : "/admin");
  }

  const progress = await getStudentProgress(profile.id);
  const completedLessons = progress.lessonProgress.filter((l: any) => l.status === "completed").length;
  const overallPct = Math.round((completedLessons / TOTAL_LESSONS) * 100);
  const completedModules = modules.filter((m) =>
    progress.moduleProgress.some((p: any) => p.module_id === m.id && p.module_completed)
  ).length;
  const blueprintCompleted = progress.blueprintSections.filter((b: any) => b.completed).length;
  const decisionLabsCompleted = progress.decisionLabs.length;
  const hasCertificate = progress.certificates.length > 0;
  const finalPassed = progress.finalAttempts.some((a: any) => a.passed);

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">My Progress</h1>

        {/* Overall stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-rise-navy">{overallPct}%</p>
            <p className="mt-1 text-sm text-rise-muted">Overall Course Progress</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-rise-navy">{completedModules}/{modules.length}</p>
            <p className="mt-1 text-sm text-rise-muted">Modules Completed</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-rise-navy">{decisionLabsCompleted}/{modules.length}</p>
            <p className="mt-1 text-sm text-rise-muted">Decision Labs Submitted</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-rise-navy">{blueprintCompleted}/{blueprintSections.length}</p>
            <p className="mt-1 text-sm text-rise-muted">Blueprint Sections</p>
          </Card>
        </div>

        {/* Completion checklist */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-rise-navy">Course Completion Requirements</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "All 6 modules completed", done: completedModules === 6 },
              { label: "All required Decision Labs submitted", done: decisionLabsCompleted === modules.length },
              { label: "All 6 Financial Blueprint sections completed", done: blueprintCompleted === blueprintSections.length },
              { label: "Final assessment passed (70%+)", done: finalPassed },
              { label: "Certificate issued", done: hasCertificate },
            ].map((req) => (
              <div key={req.label} className="flex items-center gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${req.done ? "bg-rise-success text-white" : "bg-rise-border text-rise-muted"}`}>
                  {req.done ? "✓" : "○"}
                </span>
                <span className={`text-sm ${req.done ? "text-rise-navy" : "text-rise-muted"}`}>{req.label}</span>
              </div>
            ))}
          </div>
          {!hasCertificate && (
            <div className="mt-4 flex gap-3">
              {!finalPassed && completedModules === 6 && decisionLabsCompleted === modules.length && blueprintCompleted === blueprintSections.length && (
                <Link href="/course/final-assessment" className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light">
                  Take Final Assessment
                </Link>
              )}
              <Link href="/course" className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
                Continue Course
              </Link>
            </div>
          )}
        </Card>

        {/* Detailed module progress */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Module Details</h2>
        <div className="space-y-3">
          {modules.map((m) => {
            const mp = progress.moduleProgress.find((p: any) => p.module_id === m.id);
            const lessonsComplete = mp?.lessons_completed ?? 0;
            const pct = Math.round((lessonsComplete / m.lessons.length) * 100);
            const isComplete = mp?.module_completed ?? false;
            return (
              <Card key={m.id}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                          Module {m.number}
                        </span>
                        <p className="text-sm font-medium text-rise-navy">{m.title.split("—")[0].trim()}</p>
                      </div>
                      {isComplete && (
                        <span className="rounded-full bg-rise-success-light px-2.5 py-1 text-xs font-semibold text-rise-success">
                          ✓ Complete {mp?.completed_at ? `· ${formatDate(mp.completed_at)}` : ""}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                      <span className="text-rise-muted">Lessons: <span className="font-bold text-rise-navy">{lessonsComplete}/{m.lessons.length}</span></span>
                      <span className="text-rise-muted">Quiz: <span className="font-bold text-rise-navy">{mp?.knowledge_check_score ? `${mp.knowledge_check_score}%` : "—"}</span></span>
                      <span className="text-rise-muted">Decision Lab: <span className="font-bold text-rise-navy">{mp?.decision_lab_submitted ? "✓" : "—"}</span></span>
                      <span className="text-rise-muted">Blueprint: <span className="font-bold text-rise-navy">{mp?.blueprint_section_completed ? "✓" : "—"}</span></span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-rise-border">
                      <div className={`h-full rounded-full ${isComplete ? "bg-rise-success" : "bg-rise-blue"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
