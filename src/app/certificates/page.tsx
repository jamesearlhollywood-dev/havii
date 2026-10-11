import { redirect } from "next/navigation";
import { getCurrentUserAndProfile, getStudentProgress } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { modules, blueprintSections } from "@/data/course";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Certificates" };

export default async function CertificatesPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/certificates");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  const progress = profile.role === "student" ? await getStudentProgress(profile.id) : null;
  const certificate = progress?.certificates[0];

  const completedModules = modules.filter((m) =>
    progress?.moduleProgress.some((p: any) => p.module_id === m.id && p.module_completed)
  ).length ?? 0;
  const decisionLabsCompleted = progress?.decisionLabs.length ?? 0;
  const blueprintCompleted = progress?.blueprintSections.filter((b: any) => b.completed).length ?? 0;
  const finalPassed = progress?.finalAttempts.some((a: any) => a.passed) ?? false;

  const canTakeFinal = completedModules === 6 && decisionLabsCompleted === modules.length && blueprintCompleted === blueprintSections.length;

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Certificates</h1>

        {certificate ? (
          /* Display certificate */
          <div>
            <div className="rounded-2xl border-2 border-rise-navy bg-white p-8 sm:p-12">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rise-navy text-2xl font-bold text-white">
                  R
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-rise-red">
                  RISE USA
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-rise-muted">
                  Roadmap to Income, Savings, and Equity
                </p>
                <div className="mx-auto my-6 h-px w-32 bg-rise-border" />
                <p className="text-sm text-rise-muted">This certifies that</p>
                <p className="mt-2 text-2xl font-bold text-rise-navy sm:text-3xl">
                  {certificate.student_name}
                </p>
                <p className="mt-3 text-sm text-rise-muted">has successfully completed</p>
                <p className="mt-2 text-lg font-semibold text-rise-navy">
                  {certificate.course_name}
                </p>
                <div className="mx-auto my-6 h-px w-32 bg-rise-border" />
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:px-8">
                  <div className="text-center">
                    <p className="text-xs text-rise-muted">Date Issued</p>
                    <p className="mt-1 text-sm font-medium text-rise-navy">
                      {formatDate(certificate.issued_at)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-rise-muted">Certificate ID</p>
                    <p className="mt-1 font-mono text-sm font-medium text-rise-navy">
                      {certificate.certificate_id}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-xs font-medium uppercase tracking-wider text-rise-blue">
                  Build What Lasts
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
              >
                Print / Export PDF
              </button>
              <a
                href={`/verify-certificate?id=${certificate.certificate_id}`}
                className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
              >
                Verify Certificate
              </a>
            </div>
          </div>
        ) : (
          /* No certificate yet */
          <Card>
            <CardTitle>Certificate Not Yet Earned</CardTitle>
            <CardDescription className="mt-2">
              Complete all requirements to earn your RISE USA Certificate of Completion.
            </CardDescription>

            <div className="mt-6 space-y-3">
              {[
                { label: "All 6 modules completed", done: completedModules === 6, detail: `${completedModules}/6` },
                { label: "All Decision Labs submitted", done: decisionLabsCompleted === modules.length, detail: `${decisionLabsCompleted}/${modules.length}` },
                { label: "All Blueprint sections completed", done: blueprintCompleted === blueprintSections.length, detail: `${blueprintCompleted}/${blueprintSections.length}` },
                { label: "Final assessment passed (70%+)", done: finalPassed, detail: finalPassed ? "Passed" : "Not taken" },
              ].map((req) => (
                <div key={req.label} className="flex items-center gap-3 rounded-xl border border-rise-border p-3">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${req.done ? "bg-rise-success text-white" : "bg-rise-border text-rise-muted"}`}>
                    {req.done ? "✓" : "○"}
                  </span>
                  <span className="flex-1 text-sm text-rise-navy">{req.label}</span>
                  <span className="text-xs font-medium text-rise-muted">{req.detail}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              {canTakeFinal && !finalPassed && (
                <a href="/course/final-assessment" className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light">
                  Take Final Assessment
                </a>
              )}
              <a href="/course" className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky">
                Continue Course
              </a>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
