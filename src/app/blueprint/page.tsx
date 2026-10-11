import { redirect } from "next/navigation";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { BlueprintSectionEditor } from "@/components/course/BlueprintSectionEditor";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { modules, blueprintSections } from "@/data/course";

export const dynamic = "force-dynamic";
export const metadata = { title: "Financial Blueprint" };

export default async function BlueprintPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/blueprint");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  const progress = await getStudentProgress(profile.id);

  // Determine which sections are unlocked
  const sectionStatus = blueprintSections.map((bs) => {
    const mod = modules.find((m) => m.id === bs.moduleId)!;
    const mp = progress.moduleProgress.find((p: any) => p.module_id === bs.moduleId);
    // Unlock section if module lessons are at least 50% complete or module is complete
    const lessonsComplete = mp?.lessons_completed ?? 0;
    const unlocked = lessonsComplete >= Math.ceil(mod.lessons.length / 2) || (mp?.module_completed ?? false);
    const bpData = progress.blueprintSections.find((b: any) => b.section_number === bs.number);
    return {
      ...bs,
      unlocked,
      data: bpData?.data ?? null,
      completed: bpData?.completed ?? false,
      mod,
    };
  });

  const completedCount = sectionStatus.filter((s) => s.completed).length;
  const allComplete = completedCount === blueprintSections.length;

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 rounded-2xl bg-rise-navy p-6 text-white">
          <p className="text-sm font-medium uppercase tracking-wider text-rise-blue-light">
            My RISE Financial Blueprint
          </p>
          <h1 className="mt-1 text-2xl font-bold">Build Your Personal Financial Plan</h1>
          <p className="mt-2 text-sm text-white/80">
            Your Financial Blueprint grows with you throughout the course. Each module
            unlocks a new section. Complete all six sections to create your 12-Month
            RISE Financial Blueprint.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>{completedCount}/{blueprintSections.length} sections complete</span>
                <span>{Math.round((completedCount / blueprintSections.length) * 100)}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-rise-blue transition-all" style={{ width: `${(completedCount / blueprintSections.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sectionStatus.map((s) => (
            <Card key={s.number}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rise-sky text-xl">
                  {s.mod.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                    Module {s.number}
                  </p>
                  <p className="text-sm text-rise-muted">{s.mod.title.split("—")[0].trim()}</p>
                </div>
              </div>
              <BlueprintSectionEditor
                sectionNumber={s.number}
                sectionKey={s.key}
                sectionTitle={s.title}
                blueprintUpdate={s.mod.blueprintUpdate}
                initialData={s.data as any}
                initialCompleted={s.completed}
                unlocked={s.unlocked}
              />
            </Card>
          ))}
        </div>

        {/* 12-Month Blueprint Summary */}
        {allComplete && (
          <div className="mt-8 rounded-2xl border-2 border-rise-success/30 bg-rise-success-light p-6">
            <h2 className="text-xl font-bold text-rise-navy">🎉 Your 12-Month RISE Financial Blueprint is Ready!</h2>
            <p className="mt-2 text-sm text-rise-muted">
              All six sections are complete. Review your full blueprint below and print or export as PDF.
            </p>
            <div className="mt-4 flex gap-3 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
              >
                Print / Export PDF
              </button>
            </div>
          </div>
        )}

        {/* Full blueprint summary (printable) */}
        <div className="mt-6 space-y-4">
          {sectionStatus.map((s) => {
            const data = s.data as Record<string, unknown> | null;
            if (!data || Object.keys(data).length === 0) return null;
            return (
              <Card key={`summary-${s.number}`} className="print-page">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">{s.mod.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                      Section {s.number}
                    </p>
                    <h3 className="text-base font-bold text-rise-navy">{s.title}</h3>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {s.mod.blueprintUpdate.fields.map((f) => (
                    <div key={f.id} className="flex justify-between border-b border-rise-border pb-1 text-sm">
                      <span className="text-rise-muted">{f.label}</span>
                      <span className="font-medium text-rise-navy">
                        {String(data[f.id] ?? "—")}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Affirmation */}
        {allComplete && (
          <div className="mt-6 rounded-2xl border border-rise-border bg-rise-sky p-6 text-center">
            <p className="text-lg font-medium text-rise-navy">
              &ldquo;I understand that my financial plan can change. My goal is to make
              informed decisions, review my progress, and build what lasts.&rdquo;
            </p>
            <p className="mt-2 text-sm text-rise-muted">— RISE USA Student Affirmation</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
