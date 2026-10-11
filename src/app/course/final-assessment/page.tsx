import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { AssessmentRunner } from "@/components/assessment/AssessmentRunner";
import { Alert } from "@/components/ui/Alert";
import { modules, PASSING_SCORE } from "@/data/course";
import { FINAL_ASSESSMENT_CONFIG, getQuestionsForAssessment } from "@/data/assessment-data";
import { stripQuestion } from "@/lib/assessment-scoring";
import { DEMO_STUDENT_PROFILE, DEMO_STUDENT_PROGRESS } from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Final Assessment" };

export default async function FinalAssessmentPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let progress: any = null;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/course/final-assessment");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (userProfile.role !== "student") {
      redirect(userProfile.role === "instructor" ? "/instructor" : userProfile.role === "org_manager" ? "/org-manager" : "/admin");
    }
    profile = userProfile;
    progress = await getStudentProgress(profile.id);
  } else {
    profile = DEMO_STUDENT_PROFILE;
    progress = DEMO_STUDENT_PROGRESS;
  }

  // Check prerequisites
  const completedModules = modules.filter((m) =>
    progress.moduleProgress.some((p: any) => p.module_id === m.id && p.module_completed)
  ).length;
  const decisionLabsCompleted = progress.decisionLabs.length;
  const blueprintCompleted = progress.blueprintSections.filter((b: any) => b.completed).length;
  const canTake = completedModules === 6 && decisionLabsCompleted === modules.length && blueprintCompleted === 6;

  const previousAttempts = progress.finalAttempts || [];
  const bestScore = previousAttempts.length > 0 ? Math.max(...previousAttempts.map((a: any) => Number(a.score))) : null;
  const passed = previousAttempts.some((a: any) => a.passed);

  const allQuestions = getQuestionsForAssessment(FINAL_ASSESSMENT_CONFIG.id);
  const safeQuestions = allQuestions.map(stripQuestion);

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
            {safeQuestions.length} questions from all six modules · Pass with {PASSING_SCORE}% or higher to earn your certificate
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
              <AssessmentRunner
                assessmentId={FINAL_ASSESSMENT_CONFIG.id}
                questions={safeQuestions}
                passingScore={FINAL_ASSESSMENT_CONFIG.passingScore}
                feedbackMode={FINAL_ASSESSMENT_CONFIG.feedbackMode}
                previousScore={bestScore}
                previousPassed={passed}
                maxRetakes={FINAL_ASSESSMENT_CONFIG.maxRetakes}
                previousAttempts={previousAttempts.length}
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
