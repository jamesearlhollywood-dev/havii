import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { SupportForm } from "@/components/support/SupportForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Support" };

export default async function SupportPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/support");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-rise-navy">Support</h1>
        <p className="mb-6 text-rise-muted">
          Need help with the RISE USA platform? Submit a support request and our team will get back to you.
        </p>

        <Card className="mb-6">
          <CardTitle>Frequently Asked</CardTitle>
          <div className="mt-3 space-y-3">
            {[
              { q: "How do I retake a knowledge check?", a: "Visit the module's Knowledge Check page and click 'Retake Quiz.' You can retake as many times as needed." },
              { q: "When do I get my certificate?", a: "Your certificate is issued automatically when all six modules, Decision Labs, Blueprint sections, and the final assessment are complete." },
              { q: "Can I edit my Financial Blueprint?", a: "Yes! Your Blueprint sections autosave as you type. You can update them anytime before completing the course." },
              { q: "Is my financial information safe?", a: "RISE USA never asks for SSNs, bank account numbers, or real financial data. All exercises use fictional scenarios or your own estimates." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-rise-border bg-rise-sky/30 p-3">
                <p className="text-sm font-semibold text-rise-navy">{faq.q}</p>
                <p className="mt-1 text-sm text-rise-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Submit a Support Request</CardTitle>
          <CardDescription className="mb-4">
            Tell us what you need help with.
          </CardDescription>
          <SupportForm />
        </Card>
      </div>
    </AppShell>
  );
}
