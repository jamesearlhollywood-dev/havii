import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { course, modules, TOTAL_LESSONS } from "@/data/course";
import { DEMO_STUDENT_PROFILE, DEMO_STUDENT_PROGRESS } from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Course" };

export default async function CoursePage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let progress: any = null;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/course");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    profile = userProfile;
    if (profile.role === "student") {
      progress = await getStudentProgress(profile.id);
    }
  } else {
    profile = DEMO_STUDENT_PROFILE;
    progress = DEMO_STUDENT_PROGRESS;
  }

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Course header */}
        <div className="mb-8 rounded-2xl bg-rise-navy p-8 text-white">
          <p className="text-sm font-medium uppercase tracking-wider text-rise-blue-light">
            {course.brandMessage}
          </p>
          <h1 className="mt-2 text-3xl font-bold">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-white/80">{course.description}</p>
          <p className="mt-3 text-sm font-medium text-rise-blue">
            {course.philosophy}
          </p>
        </div>

        {/* Module list with sequential progression */}
        <div className="space-y-4">
          {modules.map((m) => {
            const mp = progress?.moduleProgress.find((p: any) => p.module_id === m.id);
            const lessonsComplete = mp?.lessons_completed ?? 0;
            const pct = Math.round((lessonsComplete / m.lessons.length) * 100);
            const isComplete = mp?.module_completed ?? false;
            const isLocked = m.number > 1 && !progress?.moduleProgress.some(
              (p: any) => p.module_id === modules[m.number - 2].id && p.module_completed
            );

            return (
              <Card key={m.id} className={isLocked ? "opacity-60" : ""}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  {/* Module icon */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rise-sky text-3xl">
                    {m.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                        Module {m.number}
                      </span>
                      <span className="text-xs text-rise-muted">·</span>
                      <span className="text-xs text-rise-muted">{m.estimatedTime}</span>
                      {isComplete && (
                        <span className="rounded-full bg-rise-success-light px-2.5 py-0.5 text-xs font-semibold text-rise-success">
                          ✓ Complete
                        </span>
                      )}
                      {!isComplete && !isLocked && pct > 0 && (
                        <span className="rounded-full bg-rise-blue-light px-2.5 py-0.5 text-xs font-semibold text-rise-navy">
                          In Progress
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-rise-navy">{m.title}</h2>
                    <p className="mt-1 text-sm text-rise-muted">{m.subtitle}</p>

                    {/* Progress bar */}
                    {progress && !isLocked && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-rise-muted">
                          <span>{lessonsComplete}/{m.lessons.length} lessons</span>
                          <span className="font-bold text-rise-navy">{pct}%</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-rise-border">
                          <div
                            className={`h-full rounded-full ${isComplete ? "bg-rise-success" : "bg-rise-blue"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Objectives preview */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.objectives.slice(0, 4).map((obj, i) => (
                        <span key={i} className="rounded-full bg-rise-sky px-2.5 py-1 text-xs text-rise-muted">
                          {obj.length > 50 ? obj.slice(0, 50) + "…" : obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {isLocked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-rise-border px-4 py-2.5 text-sm text-rise-muted">
                        🔒 Locked
                      </span>
                    ) : (
                      <Link
                        href={`/course/module/${m.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
                      >
                        {pct > 0 ? "Resume" : "Start Module"} →
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Final Assessment — unlocks after Module 6 */}
          {(() => {
            const allModulesComplete = progress?.moduleProgress
              ? modules.every((m) =>
                  progress.moduleProgress.some((p: any) => p.module_id === m.id && p.module_completed)
                )
              : false;
            const finalPassed = progress?.finalAttempts?.some((a: any) => a.passed) ?? false;

            return (
              <Card className={allModulesComplete ? "" : "opacity-60"}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rise-gold/20 text-3xl">
                    🏆
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-rise-gold">
                        Capstone
                      </span>
                      {finalPassed && (
                        <span className="rounded-full bg-rise-success-light px-2.5 py-0.5 text-xs font-semibold text-rise-success">
                          ✓ Passed
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-rise-navy">Final Assessment & Financial Blueprint</h2>
                    <p className="mt-1 text-sm text-rise-muted">
                      Complete all six modules, finish your Financial Blueprint, and pass the final assessment to earn your RISE USA Certificate.
                    </p>
                  </div>
                  <div className="shrink-0">
                    {allModulesComplete ? (
                      <Link
                        href="/course/final-assessment"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
                      >
                        Take Final Assessment →
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-rise-border px-4 py-2.5 text-sm text-rise-muted">
                        🔒 Locked
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })()}
        </div>
      </div>
    </AppShell>
  );
}
