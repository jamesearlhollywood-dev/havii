import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { KnowledgeCheck } from "@/components/course/KnowledgeCheck";
import { getModule, PASSING_SCORE } from "@/data/course";

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

  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/course");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  const progress = await getStudentProgress(profile.id);
  const attempts = progress.quizAttempts.filter((a: any) => a.module_id === moduleId);
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
            {mod.knowledgeCheck.length} questions · Pass with {PASSING_SCORE}% or higher
          </p>
        </div>

        <KnowledgeCheck
          moduleId={moduleId}
          questions={mod.knowledgeCheck}
          passingScore={PASSING_SCORE}
          previousScore={bestScore}
          previousPassed={passed}
        />
      </div>
    </AppShell>
  );
}
