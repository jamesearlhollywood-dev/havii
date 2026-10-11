import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { ContentRenderer } from "@/components/course/ContentRenderer";
import { LessonReflection } from "@/components/course/LessonReflection";
import { LessonActions } from "@/components/course/LessonActions";
import { getModule, getLesson, getNextLesson, modules } from "@/data/course";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const lesson = getLesson(moduleId, lessonId);
  return { title: lesson ? lesson.title : "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const mod = getModule(moduleId);
  if (!mod) redirect("/course");
  const lesson = getLesson(moduleId, lessonId);
  if (!lesson) redirect(`/course/module/${moduleId}`);

  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/course");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  const progress = profile.role === "student" ? await getStudentProgress(profile.id) : null;
  const lp = progress?.lessonProgress.find((p: any) => p.module_id === moduleId && p.lesson_id === lessonId);
  const isComplete = lp?.status === "completed";

  const nextLesson = getNextLesson(moduleId, lessonId);
  const nextLessonHref = nextLesson
    ? `/course/module/${moduleId}/lesson/${nextLesson.id}`
    : `/course/module/${moduleId}`;

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
          <Link href="/course" className="hover:text-rise-navy">Course</Link>
          <span>/</span>
          <Link href={`/course/module/${moduleId}`} className="hover:text-rise-navy">
            Module {mod.number}
          </Link>
          <span>/</span>
          <span className="truncate text-rise-navy">{lesson.title}</span>
        </div>

        {/* Lesson header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rise-red">
              Module {mod.number} · Lesson
            </span>
            {lesson.isEnrichment && (
              <span className="rounded-full bg-rise-gold/15 px-2.5 py-0.5 text-xs font-medium text-rise-warning">
                Enrichment (Optional)
              </span>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-bold text-rise-navy">{lesson.title}</h1>
          <p className="mt-1 text-sm text-rise-muted">{lesson.subtitle} · {lesson.estimatedMinutes} min</p>
        </div>

        {/* Content */}
        <div className="mb-8 rounded-2xl border border-rise-border bg-white p-6 sm:p-8">
          <ContentRenderer blocks={lesson.content} />
        </div>

        {/* Reflection */}
        {profile.role === "student" && (
          <div className="mb-8">
            <LessonReflection
              moduleId={moduleId}
              lessonId={lessonId}
              prompt={mod.reflection.prompt}
              placeholder={mod.reflection.placeholder}
              initialText={lp?.reflection_text ?? null}
            />
          </div>
        )}

        {/* Actions */}
        {profile.role === "student" && (
          <div className="mb-8 rounded-2xl border border-rise-border bg-white p-5">
            <LessonActions
              moduleId={moduleId}
              lessonId={lessonId}
              isComplete={isComplete}
              nextLessonHref={nextLessonHref}
              isLastLesson={!nextLesson}
            />
          </div>
        )}

        {/* Module navigation */}
        <div className="flex items-center justify-between border-t border-rise-border pt-4">
          <Link
            href={`/course/module/${moduleId}`}
            className="text-sm font-medium text-rise-blue-dark hover:underline"
          >
            ← Back to Module
          </Link>
          {nextLesson && (
            <Link
              href={nextLessonHref}
              className="text-sm font-medium text-rise-blue-dark hover:underline"
            >
              {nextLesson.title} →
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  );
}
