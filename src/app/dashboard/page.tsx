import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { modules, blueprintSections, TOTAL_LESSONS } from "@/data/course";
import { displayName, fullName, formatDate } from "@/lib/utils";
import { dashboardPathForRole } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card>
          <CardTitle>Supabase not configured</CardTitle>
          <CardDescription className="mt-2">
            Configure your environment to use the RISE USA LMS. See README.
          </CardDescription>
        </Card>
      </div>
    );
  }

  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  // Non-students go to their own dashboard
  if (profile.role !== "student") {
    redirect(dashboardPathForRole(profile.role));
  }

  const progress = await getStudentProgress(profile.id);

  // Calculate stats
  const completedLessons = progress.lessonProgress.filter((l: any) => l.status === "completed").length;
  const overallProgress = TOTAL_LESSONS > 0 ? Math.round((completedLessons / TOTAL_LESSONS) * 100) : 0;

  // Find current module (first not-completed module)
  const currentModule = modules.find((m) => {
    const mp = progress.moduleProgress.find((p: any) => p.module_id === m.id);
    return !mp?.module_completed;
  }) ?? modules[modules.length - 1];

  // Find next lesson in current module
  const moduleLessonProgress = progress.lessonProgress.filter((l: any) => l.module_id === currentModule.id);
  const nextLesson = currentModule.lessons.find((l) => {
    const lp = moduleLessonProgress.find((p: any) => p.lesson_id === l.id);
    return !lp || lp.status !== "completed";
  }) ?? currentModule.lessons[0];

  const completedModules = modules.filter((m) =>
    progress.moduleProgress.some((p: any) => p.module_id === m.id && p.module_completed)
  ).length;

  const blueprintCompleted = progress.blueprintSections.filter((b: any) => b.completed).length;
  const hasCertificate = progress.certificates.length > 0;

  // Best quiz scores per module
  const quizScores = modules.map((m) => {
    const attempts = progress.quizAttempts.filter((a: any) => a.module_id === m.id);
    const best = attempts.length > 0 ? Math.max(...attempts.map((a: any) => Number(a.score))) : null;
    return { moduleId: m.id, moduleNumber: m.number, title: m.title, score: best, passed: attempts.some((a: any) => a.passed) };
  });

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rise-navy">
            Welcome back, {displayName(profile)}!
          </h1>
          <p className="mt-1 text-rise-muted">
            You&apos;ve completed {completedLessons} of {TOTAL_LESSONS} lessons across {completedModules} of {modules.length} modules.
          </p>
        </div>

        {/* Overall progress bar */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rise-muted">Course Progress</p>
              <p className="text-3xl font-bold text-rise-navy">{overallProgress}%</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rise-sky">
              <span className="text-xl font-bold text-rise-navy">{overallProgress}%</span>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-rise-border">
            <div
              className="h-full rounded-full bg-rise-navy transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

        {/* Continue learning */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-rise-navy">Continue Learning</h2>
          <Card className="border-rise-blue-light bg-gradient-to-br from-rise-sky to-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentModule.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                      Module {currentModule.number}
                    </p>
                    <h3 className="text-lg font-bold text-rise-navy">
                      {currentModule.title.split("—")[0].trim()}
                    </h3>
                  </div>
                </div>
                <p className="mt-2 text-sm text-rise-muted">
                  Next: <span className="font-medium text-rise-navy">{nextLesson.title}</span>
                </p>
              </div>
              <Link
                href={`/course/module/${currentModule.id}/lesson/${nextLesson.id}`}
                className="shrink-0 rounded-xl bg-rise-navy px-6 py-3 text-sm font-semibold text-white hover:bg-rise-navy-light"
              >
                Continue →
              </Link>
            </div>
          </Card>
        </div>

        {/* Stats grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-rise-muted">Modules Completed</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{completedModules}/{modules.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Decision Labs</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{progress.decisionLabs.length}/{modules.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Blueprint Sections</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{blueprintCompleted}/{blueprintSections.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Certificate</p>
            <p className="mt-1 text-2xl font-bold">
              {hasCertificate ? (
                <span className="text-rise-success">✓ Issued</span>
              ) : (
                <span className="text-rise-muted">In Progress</span>
              )}
            </p>
          </Card>
        </div>

        {/* Knowledge check scores */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-rise-navy">Knowledge Check Scores</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quizScores.map((q) => (
              <Card key={q.moduleId} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                    Module {q.moduleNumber}
                  </p>
                  <p className="text-sm font-medium text-rise-navy">
                    {q.title.split("—")[0].trim()}
                  </p>
                </div>
                <div className="text-right">
                  {q.score !== null ? (
                    <>
                      <p className={`text-2xl font-bold ${q.passed ? "text-rise-success" : "text-rise-warning"}`}>
                        {q.score}%
                      </p>
                      <p className="text-xs text-rise-muted">
                        {q.passed ? "Passed" : "Retake needed"}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-rise-muted">Not taken</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Module progress overview */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-rise-navy">Module Progress</h2>
          <div className="space-y-3">
            {modules.map((m) => {
              const mp = progress.moduleProgress.find((p: any) => p.module_id === m.id);
              const lessonsComplete = mp?.lessons_completed ?? 0;
              const pct = Math.round((lessonsComplete / m.lessons.length) * 100);
              const isComplete = mp?.module_completed ?? false;
              return (
                <Card key={m.id} className="flex items-center gap-4">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                          Module {m.number}
                        </span>
                        <p className="text-sm font-medium text-rise-navy">
                          {m.title.split("—")[0].trim()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {isComplete && (
                          <span className="rounded-full bg-rise-success-light px-2.5 py-1 text-xs font-semibold text-rise-success">
                            ✓ Complete
                          </span>
                        )}
                        <span className="text-sm font-bold text-rise-navy">{pct}%</span>
                      </div>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-rise-border">
                      <div
                        className={`h-full rounded-full ${isComplete ? "bg-rise-success" : "bg-rise-blue"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    href={`/course/module/${m.id}`}
                    className="shrink-0 rounded-lg border border-rise-border px-4 py-2 text-sm font-medium text-rise-navy hover:bg-rise-sky"
                  >
                    {pct > 0 ? "Resume" : "Start"}
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
