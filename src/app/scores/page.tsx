import { redirect } from "next/navigation";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { modules, PASSING_SCORE } from "@/data/course";
import { KNOWLEDGE_CHECK_CONFIGS, FINAL_ASSESSMENT_CONFIG } from "@/data/assessment-data";
import { DEMO_STUDENT_PROFILE, DEMO_STUDENT_PROGRESS, DEMO_ASSESSMENT_ATTEMPTS } from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Scores" };

export default async function ScoresPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let quizAttempts: any[] = [];
  let finalAttempts: any[] = [];

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/scores");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    profile = userProfile;
    const progress = await getStudentProgress(profile.id);
    quizAttempts = progress.quizAttempts;
    finalAttempts = progress.finalAttempts;
  } else {
    profile = DEMO_STUDENT_PROFILE;
    quizAttempts = DEMO_STUDENT_PROGRESS.quizAttempts;
    finalAttempts = DEMO_STUDENT_PROGRESS.finalAttempts;
  }

  // Build knowledge check summaries
  const kcSummaries = KNOWLEDGE_CHECK_CONFIGS.map((kc) => {
    const mod = modules.find((m) => m.id === kc.moduleId);
    const modAttempts = quizAttempts.filter((a: any) => a.module_id === kc.moduleId);
    const highestScore = modAttempts.length > 0 ? Math.max(...modAttempts.map((a: any) => Number(a.score))) : null;
    const passed = modAttempts.some((a: any) => a.passed);

    return {
      moduleId: kc.moduleId,
      moduleNumber: mod?.number ?? 0,
      moduleTitle: mod?.title.split("—")[0].trim() ?? "",
      icon: mod?.icon ?? "",
      attempts: modAttempts.length,
      highestScore,
      passed,
    };
  });

  // Final assessment summary
  const finalHighest = finalAttempts.length > 0 ? Math.max(...finalAttempts.map((a: any) => Number(a.score))) : null;
  const finalPassed = finalAttempts.some((a: any) => a.passed);

  const totalKCsPassed = kcSummaries.filter((kc) => kc.passed).length;

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">My Scores</h1>

        {/* Summary cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-rise-muted">Knowledge Checks Passed</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{totalKCsPassed}/6</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Total KC Attempts</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">{quizAttempts.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Final Assessment</p>
            <p className="mt-1 text-2xl font-bold text-rise-navy">
              {finalHighest !== null ? `${finalHighest}%` : "Not taken"}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Final Status</p>
            <p className={`mt-1 text-2xl font-bold ${finalPassed ? "text-rise-success" : "text-rise-muted"}`}>
              {finalPassed ? "Passed" : "Pending"}
            </p>
          </Card>
        </div>

        {/* Knowledge Check scores */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Module Knowledge Checks</h2>
        <div className="mb-8 space-y-3">
          {kcSummaries.map((kc) => (
            <Card key={kc.moduleId}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rise-sky text-xl">
                    {kc.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                      Module {kc.moduleNumber}
                    </p>
                    <p className="text-sm font-medium text-rise-navy">{kc.moduleTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-rise-muted">Attempts</p>
                    <p className="text-sm font-bold text-rise-navy">{kc.attempts}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-rise-muted">Highest</p>
                    <p className="text-sm font-bold text-rise-navy">
                      {kc.highestScore !== null ? `${kc.highestScore}%` : "—"}
                    </p>
                  </div>
                  <div>
                    {kc.passed ? (
                      <span className="rounded-full bg-rise-success-light px-3 py-1 text-xs font-semibold text-rise-success">
                        ✓ Passed
                      </span>
                    ) : kc.attempts > 0 ? (
                      <span className="rounded-full bg-rise-warning-light px-3 py-1 text-xs font-semibold text-rise-warning">
                        Retake needed
                      </span>
                    ) : (
                      <span className="rounded-full bg-rise-border px-3 py-1 text-xs font-medium text-rise-muted">
                        Not taken
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Final Assessment */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Final RISE USA Assessment</h2>
        <Card>
          <CardTitle>Course Final Assessment</CardTitle>
          <CardDescription className="mt-2">
            {FINAL_ASSESSMENT_CONFIG.questionIds.length} questions across all six modules · {PASSING_SCORE}% to pass
          </CardDescription>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-rise-muted">Attempts</p>
              <p className="text-lg font-bold text-rise-navy">{finalAttempts.length}</p>
            </div>
            <div>
              <p className="text-xs text-rise-muted">Highest Score</p>
              <p className="text-lg font-bold text-rise-navy">
                {finalHighest !== null ? `${finalHighest}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-rise-muted">Status</p>
              {finalPassed ? (
                <span className="rounded-full bg-rise-success-light px-3 py-1 text-sm font-semibold text-rise-success">
                  ✓ Passed
                </span>
              ) : finalAttempts.length > 0 ? (
                <span className="rounded-full bg-rise-warning-light px-3 py-1 text-sm font-semibold text-rise-warning">
                  Retake needed
                </span>
              ) : (
                <span className="rounded-full bg-rise-border px-3 py-1 text-sm font-medium text-rise-muted">
                  Not taken
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
