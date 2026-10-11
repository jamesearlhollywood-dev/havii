import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { getModule, modules } from "@/data/course";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  return { title: mod ? `Module ${mod.number}: ${mod.title.split("—")[0].trim()}` : "Module" };
}

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) redirect("/course");

  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/course");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  const progress = profile.role === "student" ? await getStudentProgress(profile.id) : null;
  const mp = progress?.moduleProgress.find((p: any) => p.module_id === moduleId);
  const lessonsComplete = mp?.lessons_completed ?? 0;
  const pct = Math.round((lessonsComplete / mod.lessons.length) * 100);

  // Find next lesson
  const moduleLessonProgress = progress?.lessonProgress.filter((l: any) => l.module_id === moduleId) ?? [];
  const nextLesson = mod.lessons.find((l) => {
    const lp = moduleLessonProgress.find((p: any) => p.lesson_id === l.id);
    return !lp || lp.status !== "completed";
  }) ?? mod.lessons[0];

  // Required activities status
  const activities = [
    { label: "Lessons", done: lessonsComplete, total: mod.lessons.length, href: `/course/module/${moduleId}/lesson/${nextLesson.id}` },
    { label: "Knowledge Check", done: mp?.knowledge_check_passed ? 1 : 0, total: 1, href: `/course/module/${moduleId}/knowledge-check` },
    { label: "Decision Lab", done: mp?.decision_lab_submitted ? 1 : 0, total: 1, href: `/course/module/${moduleId}/decision-lab` },
    { label: "Blueprint Section", done: mp?.blueprint_section_completed ? 1 : 0, total: 1, href: `/blueprint` },
  ];

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
          <Link href="/course" className="hover:text-rise-navy">Course</Link>
          <span>/</span>
          <span className="text-rise-navy">Module {mod.number}</span>
        </div>

        {/* Module header */}
        <div className="mb-6 rounded-2xl bg-rise-navy p-8 text-white">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{mod.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-rise-blue-light">
                Module {mod.number} · {mod.estimatedTime}
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{mod.title}</h1>
              <p className="mt-2 text-white/80">{mod.subtitle}</p>
            </div>
          </div>

          {/* Progress */}
          {progress && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Progress: {pct}%</span>
                <span className="text-white/70">{lessonsComplete}/{mod.lessons.length} lessons</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-rise-blue" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Overview & Objectives */}
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardTitle className="text-base">Overview</CardTitle>
            <p className="mt-2 text-sm text-rise-muted">{mod.overview}</p>
          </Card>
          <Card>
            <CardTitle className="text-base">Learning Objectives</CardTitle>
            <ul className="mt-2 space-y-1.5">
              {mod.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-rise-muted">
                  <span className="mt-0.5 text-rise-blue">▸</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Required activities */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-rise-navy">Required Activities</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((a) => (
              <Link key={a.label} href={a.href}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-rise-navy">{a.label}</p>
                    {a.done >= a.total ? (
                      <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs font-semibold text-rise-success">✓</span>
                    ) : (
                      <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">
                        {a.done}/{a.total}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Lessons list */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-rise-navy">Lessons</h2>
          <div className="space-y-2">
            {mod.lessons.map((lesson, i) => {
              const lp = moduleLessonProgress.find((p: any) => p.lesson_id === lesson.id);
              const isComplete = lp?.status === "completed";
              const isInProgress = lp?.status === "in_progress";
              return (
                <Link
                  key={lesson.id}
                  href={`/course/module/${moduleId}/lesson/${lesson.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-rise-border bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isComplete ? "bg-rise-success text-white" : isInProgress ? "bg-rise-blue text-white" : "bg-rise-sky text-rise-muted"
                  }`}>
                    {isComplete ? "✓" : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-rise-navy group-hover:text-rise-blue-dark">{lesson.title}</p>
                      {lesson.isEnrichment && (
                        <span className="rounded-full bg-rise-gold/15 px-2 py-0.5 text-xs font-medium text-rise-warning">
                          Enrichment
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-rise-muted">{lesson.subtitle} · {lesson.estimatedMinutes} min</p>
                  </div>
                  <span className="text-rise-muted group-hover:text-rise-navy">→</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Key terms */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-rise-navy">Key Terms</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {mod.keyTerms.map((kt) => (
              <div key={kt.term} className="rounded-xl border border-rise-border bg-white p-3">
                <p className="text-sm font-semibold text-rise-navy">{kt.term}</p>
                <p className="mt-0.5 text-xs text-rise-muted">{kt.definition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue button */}
        <div className="flex justify-end">
          <Link
            href={`/course/module/${moduleId}/lesson/${nextLesson.id}`}
            className="rounded-xl bg-rise-navy px-8 py-3 text-sm font-semibold text-white hover:bg-rise-navy-light"
          >
            Continue →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
