import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { DecisionLab } from "@/components/course/DecisionLab";
import { getModule } from "@/data/course";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  return { title: mod ? `Decision Lab: Module ${mod.number}` : "Decision Lab" };
}

export default async function DecisionLabPage({
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
  const submitted = progress.decisionLabs.some((d: any) => d.module_id === moduleId);

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
          <span className="text-rise-navy">Decision Lab</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mod.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                Module {mod.number} · RISE Decision Lab
              </p>
              <h1 className="mt-1 text-2xl font-bold text-rise-navy">{mod.decisionLab.title}</h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-rise-muted">{mod.decisionLab.subtitle}</p>
        </div>

        <div className="rounded-2xl border border-rise-border bg-white p-6">
          <DecisionLab
            moduleId={moduleId}
            lab={mod.decisionLab}
            alreadySubmitted={submitted}
          />
        </div>
      </div>
    </AppShell>
  );
}
