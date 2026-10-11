import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { KnowledgeCheck } from "@/components/course/KnowledgeCheck";
import { modules, PASSING_SCORE } from "@/data/course";
import type { QuizQuestion } from "@/data/course-types";
import { Alert } from "@/components/ui/Alert";

export const dynamic = "force-dynamic";
export const metadata = { title: "Final Assessment" };

// Build final assessment from a selection of questions across all modules
function buildFinalAssessment(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (const mod of modules) {
    // Take 2 questions from each module (first 2 for consistency)
    questions.push(...mod.knowledgeCheck.slice(0, 2));
  }
  return questions;
}

export default async function FinalAssessmentPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/course/final-assessment");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  if (profile.role !== "student") {
    redirect(profile.role === "instructor" ? "/instructor" : profile.role === "org_manager" ? "/org-manager" : "/admin");
  }

  const progress = await getStudentProgress(profile.id);

  // Check prerequisites
  const completedModules = modules.filter((m) =>
    progress.moduleProgress.some((p: any) => p.module_id === m.id && p.module_completed)
  ).length;
  const decisionLabsCompleted = progress.decisionLabs.length;
  const blueprintCompleted = progress.blueprintSections.filter((b: any) => b.completed).length;
  const canTake = completedModules === 6 && decisionLabsCompleted === modules.length && blueprintCompleted === 6;

  const previousAttempts = progress.finalAttempts;
  const bestScore = previousAttempts.length > 0 ? Math.max(...previousAttempts.map((a: any) => Number(a.score))) : null;
  const passed = previousAttempts.some((a: any) => a.passed);

  const finalQuestions = buildFinalAssessment();

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
          <Link href="/certificates" className="hover:text-rise-navy">Certificates</Link>
          <span>/</span>
          <span className="text-rise-navy">Final Assessment</span>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
            RISE USA Final Assessment
          </p>
          <h1 className="mt-1 text-2xl font-bold text-rise-navy">Course Final Assessment</h1>
          <p className="mt-1 text-sm text-rise-muted">
            {finalQuestions.length} questions from all six modules · Pass with {PASSING_SCORE}% or higher to earn your certificate
          </p>
        </div>

        {!canTake && (
          <Alert tone="warning">
            You must complete all six modules, Decision Labs, and Blueprint sections before taking the final assessment.
            <div className="mt-2 space-y-1 text-xs">
              <p>Modules: {completedModules}/6 · Decision Labs: {decisionLabsCompleted}/6 · Blueprint: {blueprintCompleted}/6</p>
            </div>
          </Alert>
        )}

        {canTake && (
          <>
            {previousAttempts.length > 0 && (
              <Alert tone={passed ? "success" : "warning"}>
                Previous best score: {bestScore}% {passed ? "(Passed — certificate issued!)" : "(Retake needed)"}
              </Alert>
            )}
            <div className="mt-6 rounded-2xl border border-rise-border bg-white p-6">
              <KnowledgeCheck
                moduleId="final-assessment"
                questions={finalQuestions}
                passingScore={PASSING_SCORE}
                previousScore={bestScore}
                previousPassed={passed}
              />
            </div>
          </>
        )}

        {canTake && passed && (
          <div className="mt-6">
            <Link
              href="/certificates"
              className="inline-block rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
            >
              View Your Certificate →
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
