import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { modules, blueprintSections, TOTAL_LESSONS, getLesson } from "@/data/course";
import { displayName, formatDate } from "@/lib/utils";
import { dashboardPathForRole } from "@/lib/roles";
import { DEMO_STUDENT_PROFILE, DEMO_STUDENT_PROGRESS } from "@/data/demo-data";
import type { Profile, ModuleStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let progress: ReturnType<typeof getStudentProgress> extends Promise<infer T> ? T : never;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/dashboard");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (userProfile.role !== "student") redirect(dashboardPathForRole(userProfile.role));
    profile = userProfile;
    progress = await getStudentProgress(profile.id);
  } else {
    profile = DEMO_STUDENT_PROFILE;
    progress = DEMO_STUDENT_PROGRESS as any;
  }

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

  // Last completed activity
  const completedActivities = progress.lessonProgress
    .filter((l: any) => l.status === "completed")
    .sort((a: any, b: any) => new Date(b.completed_at || b.updated_at).getTime() - new Date(a.completed_at || a.updated_at).getTime());
  const lastCompleted = completedActivities[0];
  const lastCompletedLesson = lastCompleted ? getLesson(lastCompleted.module_id, lastCompleted.lesson_id) : null;

  const completedModules = modules.filter((m) =>
    progress.moduleProgress.some((p: any) => p.module_id === m.id && p.module_completed)
  ).length;

  const blueprintCompleted = progress.blueprintSections.filter((b: any) => b.completed).length;
  const hasCertificate = progress.certificates.length > 0;

  // Module roadmap states
  const moduleStates: ModuleStatus[] = modules.map((m, i) => {
    const mp = progress.moduleProgress.find((p: any) => p.module_id === m.id);
    if (mp?.module_completed) return "completed";
    if (i === 0) {
      return mp && mp.lessons_completed > 0 ? "in_progress" : "available";
    }
    const prevComplete = progress.moduleProgress.some(
      (p: any) => p.module_id === modules[i - 1].id && p.module_completed
    );
    if (!prevComplete) return "locked";
    return mp && mp.lessons_completed > 0 ? "in_progress" : "available";
  });

  // Best quiz scores per module
  const quizScores = modules.map((m) => {
    const attempts = progress.quizAttempts.filter((a: any) => a.module_id === m.id);
    const best = attempts.length > 0 ? Math.max(...attempts.map((a: any) => Number(a.score))) : null;
    return { moduleId: m.id, moduleNumber: m.number, title: m.title, score: best, passed: attempts.some((a: any) => a.passed) };
  });

  const stateConfig: Record<ModuleStatus, { label: string; bg: string; text: string; icon: string }> = {
    locked: { label: "Locked", bg: "bg-rise-border", text: "text-rise-muted", icon: "🔒" },
    available: { label: "Available", bg: "bg-rise-sky", text: "text-rise-navy", icon: "▶" },
    in_progress: { label: "In Progress", bg: "bg-rise-blue-light", text: "text-rise-navy", icon: "📖" },
    completed: { label: "Completed", bg: "bg-rise-success-light", text: "text-rise-success", icon: "✓" },
  };

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

        {/* Continue Your RISE Journey */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-rise-navy">Continue Your RISE Journey</h2>
          <Card className="border-rise-blue-light bg-gradient-to-br from-rise-sky to-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentModule.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                      Current Module · Module {currentModule.number}
                    </p>
                    <h3 className="text-lg font-bold text-rise-navy">
                      {currentModule.title.split("—")[0].trim()}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-rise-muted">
                  <span className="font-medium text-rise-navy">Next lesson:</span> {nextLesson.title}
                </p>
                {lastCompletedLesson && (
                  <p className="text-sm text-rise-muted">
                    <span className="font-medium text-rise-navy">Last completed:</span> {lastCompletedLesson.title}
                    {lastCompleted.completed_at && (
                      <span className="ml-1 text-xs">· {formatDate(lastCompleted.completed_at)}</span>
                    )}
                  </p>
                )}
                <p className="text-sm text-rise-muted">
                  <span className="font-medium text-rise-navy">Estimated time:</span> {currentModule.estimatedTime}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rise-sky">
                  <span className="text-xl font-bold text-rise-navy">{overallProgress}%</span>
                </div>
                <Link
                  href={`/course/module/${currentModule.id}/lesson/${nextLesson.id}`}
                  className="shrink-0 rounded-xl bg-rise-navy px-6 py-3 text-sm font-semibold text-white hover:bg-rise-navy-light"
                >
                  Continue →
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Overall progress bar */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rise-muted">Overall Course Progress</p>
              <p className="text-3xl font-bold text-rise-navy">{overallProgress}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-rise-muted">Modules Completed</p>
              <p className="text-2xl font-bold text-rise-navy">{completedModules}/{modules.length}</p>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-rise-border">
            <div
              className="h-full rounded-full bg-rise-navy transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

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

        {/* Visual module roadmap */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-rise-navy">My RISE Roadmap</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => {
              const state = moduleStates[i];
              const cfg = stateConfig[state];
              const mp = progress.moduleProgress.find((p: any) => p.module_id === m.id);
              const lessonsComplete = mp?.lessons_completed ?? 0;
              const pct = Math.round((lessonsComplete / m.lessons.length) * 100);
              return (
                <Card
                  key={m.id}
                  className={`${state === "locked" ? "opacity-60" : ""} ${state === "in_progress" ? "ring-2 ring-rise-blue" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${cfg.bg}`}>
                      {state === "locked" ? "🔒" : m.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                          Module {m.number}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm font-bold text-rise-navy">
                        {m.title.split("—")[0].trim()}
                      </p>
                      {state !== "locked" && (
                        <>
                          <p className="mt-1 text-xs text-rise-muted">
                            {lessonsComplete}/{m.lessons.length} lessons · {pct}%
                          </p>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-rise-border">
                            <div
                              className={`h-full rounded-full ${state === "completed" ? "bg-rise-success" : "bg-rise-blue"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {state !== "locked" && (
                    <Link
                      href={`/course/module/${m.id}`}
                      className="mt-3 block text-center text-xs font-medium text-rise-blue-dark hover:underline"
                    >
                      {pct > 0 ? "Resume" : "Start"} →
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
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
      </div>
    </AppShell>
  );
}
