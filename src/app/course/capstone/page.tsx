import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { modules, blueprintSections, PASSING_SCORE } from "@/data/course";
import { checkCertificateEligibility } from "@/lib/certificate-utils";
import { EndOfCourseSurvey } from "@/components/capstone/EndOfCourseSurvey";
import { BlueprintCapstone } from "@/components/capstone/BlueprintCapstone";
import { getCapstoneData, isSurveyCompleted, isBlueprintReviewed } from "@/actions/capstone";
import { DEMO_STUDENT_PROFILE, DEMO_STUDENT_PROGRESS } from "@/data/demo-data";
import type { Profile, StudentProgress } from "@/lib/types";
import type { CapstoneData } from "@/data/capstone-types";

export const dynamic = "force-dynamic";
export const metadata = { title: "RISE Capstone" };

export default async function CapstonePage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let progress: StudentProgress;
  let surveyDone = false;
  let blueprintReviewed = false;
  let capstoneData: CapstoneData;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/course/capstone");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (userProfile.role !== "student") {
      redirect(userProfile.role === "instructor" ? "/instructor" : userProfile.role === "org_manager" ? "/org-manager" : "/admin");
    }
    profile = userProfile;
    progress = await getStudentProgress(profile.id);
    surveyDone = await isSurveyCompleted(profile.id);
    blueprintReviewed = await isBlueprintReviewed(profile.id);
    capstoneData = await getCapstoneData(profile.id);
  } else {
    profile = DEMO_STUDENT_PROFILE;
    progress = DEMO_STUDENT_PROGRESS;
    capstoneData = {
      actionPlan: [],
      topPriorities: [],
      moneyRules: [
        "I will read financial agreements before signing.",
        "I will compare total cost, not just monthly payments.",
        "I will know the difference between gross and net pay.",
        "I will maintain an emergency-savings goal.",
        "I will understand debt before borrowing.",
      ],
      finalReflection: "",
      commitmentConfirmed: false,
      endOfCourseSurvey: null,
      surveyCompletedAt: null,
    };
  }

  // Check prerequisites — all modules complete + final assessment passed
  const completedModules = modules.filter((m) =>
    progress.moduleProgress.some((p) => p.module_id === m.id && p.module_completed),
  ).length;
  const finalPassed = progress.finalAttempts.some((a) => a.passed);

  if (completedModules < 6 || !finalPassed) {
    return (
      <AppShell profile={profile}>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
            <Link href="/course" className="hover:text-rise-navy">Course</Link>
            <span>/</span>
            <span className="text-rise-navy">Capstone</span>
          </div>
          <h1 className="text-2xl font-bold text-rise-navy">RISE Capstone</h1>
          <Alert tone="warning" className="mt-4">
            <p>You must complete all six modules and pass the Final Assessment before starting the capstone.</p>
            <div className="mt-2 text-xs">
              <p>Modules completed: {completedModules}/6</p>
              <p>Final Assessment: {finalPassed ? "✓ Passed" : "Not passed yet"}</p>
            </div>
          </Alert>
          <div className="mt-4">
            {!finalPassed && completedModules === 6 ? (
              <Link href="/course/final-assessment" className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light">
                Take Final Assessment →
              </Link>
            ) : (
              <Link href="/course" className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
                Continue Course →
              </Link>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  // Build blueprint section data for the capstone
  const sectionData = blueprintSections.map((bs) => {
    const mod = modules.find((m) => m.id === bs.moduleId)!;
    const bpData = progress.blueprintSections.find((b) => b.section_number === bs.number);
    return {
      number: bs.number,
      title: bs.title,
      moduleIcon: mod.icon,
      moduleTitle: mod.title.split("—")[0].trim(),
      fields: mod.blueprintUpdate.fields.map((f) => ({ id: f.id, label: f.label })),
      data: bpData?.data ?? null,
      completed: bpData?.completed ?? false,
    };
  });

  const allBlueprintComplete = sectionData.every((s) => s.completed);
  const studentName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.preferred_name || "Student";

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
          <Link href="/course" className="hover:text-rise-navy">Course</Link>
          <span>/</span>
          <span className="text-rise-navy">Capstone</span>
        </div>

        <div className="mb-6 rounded-2xl bg-rise-navy p-6 text-white">
          <p className="text-sm font-medium uppercase tracking-wider text-rise-blue-light">
            RISE USA Capstone
          </p>
          <h1 className="mt-1 text-2xl font-bold">Your RISE Journey Continues</h1>
          <p className="mt-2 text-sm text-white/80">
            You&apos;ve completed all six modules and passed the Final Assessment. Now build your
            12-Month Financial Blueprint and complete your RISE journey.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="mb-8 rounded-2xl border border-rise-border bg-white p-5">
          <h2 className="text-sm font-bold text-rise-navy">Capstone Progress</h2>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rise-success text-sm text-white">✓</span>
              <span className="text-sm text-rise-navy">Final Assessment Passed</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${surveyDone ? "bg-rise-success text-white" : "bg-rise-border text-rise-muted"}`}>
                {surveyDone ? "✓" : "○"}
              </span>
              <span className={`text-sm ${surveyDone ? "text-rise-navy" : "text-rise-muted"}`}>End-of-Course Confidence Survey</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${blueprintReviewed ? "bg-rise-success text-white" : "bg-rise-border text-rise-muted"}`}>
                {blueprintReviewed ? "✓" : "○"}
              </span>
              <span className={`text-sm ${blueprintReviewed ? "text-rise-navy" : "text-rise-muted"}`}>12-Month Financial Blueprint Reviewed</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${blueprintReviewed && surveyDone && allBlueprintComplete ? "bg-rise-success text-white" : "bg-rise-border text-rise-muted"}`}>
                {blueprintReviewed && surveyDone && allBlueprintComplete ? "✓" : "○"}
              </span>
              <span className={`text-sm ${blueprintReviewed && surveyDone && allBlueprintComplete ? "text-rise-navy" : "text-rise-muted"}`}>Certificate Eligibility</span>
            </div>
          </div>
        </div>

        {/* Step 1: End-of-Course Survey (if not done) */}
        {!surveyDone && (
          <div className="mb-8">
            <Card className="border-rise-blue-light">
              <h2 className="text-lg font-bold text-rise-navy">Step 1: End-of-Course Confidence Survey</h2>
              <p className="mt-1 text-sm text-rise-muted">
                Reflect on how your confidence has grown throughout the course.
              </p>
              <div className="mt-6">
                <EndOfCourseSurvey onComplete={() => {}} initialResponses={capstoneData?.endOfCourseSurvey} />
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: 12-Month Financial Blueprint */}
        {surveyDone && (
          <div>
            {!allBlueprintComplete && (
              <Alert tone="warning" className="mb-4">
                Some Blueprint sections are not yet complete. Visit the{" "}
                <Link href="/blueprint" className="font-semibold underline">Blueprint page</Link>{" "}
                to finish all six sections before reviewing your capstone.
              </Alert>
            )}
            <BlueprintCapstone
              sections={sectionData}
              initialCapstoneData={capstoneData}
              studentName={studentName}
              onCommitmentConfirmed={() => {
                // The page will re-render on next navigation
                // The commitment triggers certificate check via the progress page
              }}
            />
          </div>
        )}

        {/* Step 3: Course Completion (after survey + blueprint review) */}
        {surveyDone && blueprintReviewed && allBlueprintComplete && (
          <div className="mt-8 rounded-2xl border-2 border-rise-success/30 bg-rise-success-light p-8 text-center">
            <h2 className="text-2xl font-bold text-rise-navy">You Built the Blueprint. Now Build What Lasts.</h2>
            <p className="mt-2 text-sm text-rise-muted">
              All capstone requirements are complete. Check your certificate eligibility.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link href="/certificates" className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light">
                View Certificate →
              </Link>
              <Link href="/blueprint" className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
                View Financial Blueprint →
              </Link>
              <Link href="/progress" className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
                View Course Completion Record →
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
