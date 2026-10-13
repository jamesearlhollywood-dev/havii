import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { modules, blueprintSections, TOTAL_LESSONS } from "@/data/course";
import { formatDate } from "@/lib/utils";
import { dashboardPathForRole } from "@/lib/roles";
import { DEMO_STUDENT_PROFILE, DEMO_STUDENT_PROGRESS } from "@/data/demo-data";
import { isSurveyCompleted, isBlueprintReviewed } from "@/actions/capstone";
import type { Profile, StudentProgress } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Progress" };

export default async function ProgressPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let progress: StudentProgress;
  let surveyDone = false;
  let blueprintReviewed = false;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/progress");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (userProfile.role !== "student") redirect(dashboardPathForRole(userProfile.role));
    profile = userProfile;
    progress = await getStudentProgress(profile.id);
    surveyDone = await isSurveyCompleted(profile.id);
    blueprintReviewed = await isBlueprintReviewed(profile.id);
  } else {
    profile = DEMO_STUDENT_PROFILE;
    progress = DEMO_STUDENT_PROGRESS;
  }

  const completedLessons = progress.lessonProgress.filter((l) => l.status === "completed").length;
  const overallPct = Math.round((completedLessons / TOTAL_LESSONS) * 100);
  const completedModules = modules.filter((m) =>
    progress.moduleProgress.some((p) => p.module_id === m.id && p.module_completed)
  ).length;

  // Current module
  const currentModule = modules.find((m) => {
    const mp = progress.moduleProgress.find((p) => p.module_id === m.id);
    return !mp?.module_completed;
  }) ?? modules[modules.length - 1];

  const blueprintCompleted = progress.blueprintSections.filter((b) => b.completed).length;
  const decisionLabsCompleted = progress.decisionLabs.length;
  const hasCertificate = progress.certificates.length > 0;
  const finalPassed = progress.finalAttempts.some((a) => a.passed);
  const finalAttempts = progress.finalAttempts.length;

  // Quiz scores per module
  const quizScores = modules.map((m) => {
    const attempts = progress.quizAttempts.filter((a) => a.module_id === m.id);
    const best = attempts.length > 0 ? Math.max(...attempts.map((a) => Number(a.score))) : null;
    const passed = attempts.some((a) => a.passed);
    const attemptCount = attempts.length;
    return { moduleId: m.id, moduleNumber: m.number, title: m.title, score: best, passed, attemptCount };
  });

  // Certificate eligibility
  const allModulesDone = completedModules === modules.length;
  const allDecisionLabs = decisionLabsCompleted === modules.length;
  const allBlueprint = blueprintCompleted === blueprintSections.length;
  const certificateEligible = allModulesDone && allDecisionLabs && allBlueprint && finalPassed && surveyDone && blueprintReviewed;

  // Capstone journey steps
  const journeySteps = [
    { label: "Module 1", done: modules[0] ? progress.moduleProgress.some((p) => p.module_id === "module-1" && p.module_completed) : false, link: "/course/module/module-1" },
    { label: "Module 2", done: progress.moduleProgress.some((p) => p.module_id === "module-2" && p.module_completed), link: "/course/module/module-2" },
    { label: "Module 3", done: progress.moduleProgress.some((p) => p.module_id === "module-3" && p.module_completed), link: "/course/module/module-3" },
    { label: "Module 4", done: progress.moduleProgress.some((p) => p.module_id === "module-4" && p.module_completed), link: "/course/module/module-4" },
    { label: "Module 5", done: progress.moduleProgress.some((p) => p.module_id === "module-5" && p.module_completed), link: "/course/module/module-5" },
    { label: "Module 6", done: progress.moduleProgress.some((p) => p.module_id === "module-6" && p.module_completed), link: "/course/module/module-6" },
    { label: "Final Assessment", done: finalPassed, link: "/course/final-assessment" },
    { label: "End-of-Course Survey", done: surveyDone, link: "/course/capstone" },
    { label: "Financial Blueprint", done: blueprintReviewed, link: "/course/capstone" },
    { label: "Certificate", done: hasCertificate, link: "/certificates" },
  ];

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">My Progress</h1>

        {/* Your RISE Journey — Capstone Dashboard */}
        <Card className="mb-6 border-rise-blue-light bg-gradient-to-br from-rise-sky to-white">
          <h2 className="text-xl font-bold text-rise-navy">Your RISE Journey</h2>
          <p className="mt-1 text-sm text-rise-muted">
            Track your path from Module 1 to your certificate. Here's what's complete and what remains.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {journeySteps.map((step, idx) => (
              <Link
                key={step.label}
                href={step.link}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                  step.done
                    ? "border-rise-success/30 bg-rise-success-light text-rise-navy"
                    : "border-rise-border bg-white text-rise-muted hover:bg-rise-sky/50"
                }`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                  step.done ? "bg-rise-success text-white" : "bg-rise-border text-rise-muted"
                }`}>
                  {step.done ? "✓" : idx + 1}
                </span>
                <span className="font-medium">{step.label}</span>
              </Link>
            ))}
          </div>
          {allModulesDone && finalPassed && !surveyDone && (
            <div className="mt-4">
              <Link href="/course/capstone" className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light">
                Continue to Capstone →
              </Link>
            </div>
          )}
        </Card>

        {/* Overall stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-rise-navy">{overallPct}%</p>
            <p className="mt-1 text-sm text-rise-muted">Course Completion</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-rise-navy">{completedModules}/{modules.length}</p>
            <p className="mt-1 text-sm text-rise-muted">Modules Completed</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-rise-navy">{decisionLabsCompleted}/{modules.length}</p>
            <p className="mt-1 text-sm text-rise-muted">Decision Labs</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-rise-navy">{blueprintCompleted}/{blueprintSections.length}</p>
            <p className="mt-1 text-sm text-rise-muted">Blueprint Sections</p>
          </Card>
        </div>

        {/* Current module */}
        <Card className="mb-6 border-rise-blue-light bg-gradient-to-br from-rise-sky to-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentModule.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                Current Module · Module {currentModule.number}
              </p>
              <h3 className="text-lg font-bold text-rise-navy">
                {currentModule.title.split("—")[0].trim()}
              </h3>
              <p className="text-sm text-rise-muted">{currentModule.estimatedTime}</p>
            </div>
          </div>
        </Card>

        {/* Completion checklist */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-rise-navy">Course Completion Requirements</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: `All ${modules.length} modules completed`, done: allModulesDone },
              { label: "All required Decision Labs submitted", done: allDecisionLabs },
              { label: `All ${blueprintSections.length} Financial Blueprint sections completed`, done: allBlueprint },
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
          <div className="mt-4 flex flex-wrap gap-3">
            {certificateEligible && !hasCertificate && (
              <span className="rounded-xl bg-rise-success-light px-4 py-2.5 text-sm font-semibold text-rise-success">
                ✓ You are eligible for your certificate!
              </span>
            )}
            {!finalPassed && allModulesDone && allDecisionLabs && allBlueprint && (
              <Link href="/course/final-assessment" className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light">
                Take Final Assessment
              </Link>
            )}
            <Link href="/course" className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
              Continue Course
            </Link>
          </div>
        </Card>

        {/* Knowledge check scores */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Knowledge Check Scores</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quizScores.map((q) => (
            <Card key={q.moduleId}>
              <div className="flex items-center justify-between">
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
                        {q.passed ? "Passed" : "Retake needed"} · {q.attemptCount} {q.attemptCount === 1 ? "attempt" : "attempts"}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-rise-muted">Not taken</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Final assessment status */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-rise-navy">Final Assessment</h2>
          <div className="mt-3 flex items-center gap-3">
            {finalPassed ? (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rise-success text-sm text-white">✓</span>
                <span className="text-sm text-rise-navy">Passed — eligible for certificate</span>
              </>
            ) : finalAttempts > 0 ? (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rise-warning-light text-sm text-rise-warning">!</span>
                <span className="text-sm text-rise-muted">
                  Attempted ({finalAttempts} {finalAttempts === 1 ? "attempt" : "attempts"}) — 70% required to pass
                </span>
              </>
            ) : allModulesDone ? (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rise-border text-sm text-rise-muted">○</span>
                <span className="text-sm text-rise-muted">Ready to take — all modules completed</span>
              </>
            ) : (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rise-border text-sm text-rise-muted">🔒</span>
                <span className="text-sm text-rise-muted">Unlocks after all {modules.length} modules are completed</span>
              </>
            )}
          </div>
        </Card>

        {/* Detailed module progress */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Module Details</h2>
        <div className="space-y-3">
          {modules.map((m) => {
            const mp = progress.moduleProgress.find((p) => p.module_id === m.id);
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
