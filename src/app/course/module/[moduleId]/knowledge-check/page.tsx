import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { AssessmentRunner } from "@/components/assessment/AssessmentRunner";
import { getModule, PASSING_SCORE } from "@/data/course";
import { getKnowledgeCheckForModule, getQuestionsForAssessment } from "@/data/assessment-data";
import { stripQuestion } from "@/lib/assessment-scoring";
import { DEMO_STUDENT_PROFILE, DEMO_STUDENT_PROGRESS } from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  return { title: mod ? `Knowledge Check: Module ${mod.number}` : "Knowledge Check" };
}

export default async function KnowledgeCheckPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) redirect("/course");

  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let attempts: any[] = [];

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/course");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    profile = userProfile;
    const progress = await getStudentProgress(profile.id);
    attempts = progress.quizAttempts.filter((a: any) => a.module_id === moduleId);
  } else {
    profile = DEMO_STUDENT_PROFILE;
    attempts = DEMO_STUDENT_PROGRESS.quizAttempts.filter((a: any) => a.module_id === moduleId);
  }

  const kcConfig = getKnowledgeCheckForModule(moduleId);
  if (!kcConfig) redirect(`/course/module/${moduleId}`);

  const allQuestions = getQuestionsForAssessment(kcConfig.id);
  // Strip answer data before sending to client
  const safeQuestions = allQuestions.map(stripQuestion);

  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a: any) => Number(a.score))) : null;
  const passed = attempts.some((a: any) => a.passed);

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
          <Link href="/course" className="hover:text-rise-navy">Course</Link>
          <span>/</span>
          <Link href={`/course/module/${moduleId}`} className="hover:text-rise-navy">
            Module {mod.number}
          </Link>
          <span>/</span>
          <span className="text-rise-navy">Knowledge Check</span>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
            Module {mod.number} · Knowledge Check
          </p>
          <h1 className="mt-1 text-2xl font-bold text-rise-navy">
            {mod.title.split("—")[0].trim()}
          </h1>
          <p className="mt-1 text-sm text-rise-muted">
            {safeQuestions.length} questions · Pass with {PASSING_SCORE}% or higher
          </p>
        </div>

        <AssessmentRunner
          assessmentId={kcConfig.id}
          questions={safeQuestions}
          passingScore={kcConfig.passingScore}
          feedbackMode={kcConfig.feedbackMode}
          previousScore={bestScore}
          previousPassed={passed}
          maxRetakes={kcConfig.maxRetakes}
          previousAttempts={attempts.length}
        />
      </div>
    </AppShell>
  );
}
