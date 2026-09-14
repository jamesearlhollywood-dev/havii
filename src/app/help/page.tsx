import Link from "next/link";
import { MarketingHeader } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

export const metadata = { title: "Get Help" };

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-havii-cream">
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-havii-ink">
          Get Help / Support
        </h1>
        <p className="mt-2 text-havii-muted">
          HAVII cares about your wellbeing. This page is here for safety and
          support resources — not clinical diagnosis or emergency dispatch.
        </p>

        <Alert tone="warning" className="mt-6">
          <strong>HAVII is not an emergency service</strong> and is not monitored
          24/7. If you or someone else is in immediate danger, call your local
          emergency number (911 in the U.S.) right away.
        </Alert>

        <div className="mt-6 grid gap-4">
          <Card>
            <CardTitle>If you are in crisis in the U.S.</CardTitle>
            <CardDescription className="mt-2 space-y-2">
              <p>
                Call or text <strong>988</strong> — Suicide & Crisis Lifeline
                (24/7).
              </p>
              <p>
                Or chat via{" "}
                <a
                  className="font-medium text-havii-teal underline"
                  href="https://988lifeline.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  988lifeline.org
                </a>
                .
              </p>
              <p>
                For LGBTQ+ youth:{" "}
                <a
                  className="font-medium text-havii-teal underline"
                  href="https://www.thetrevorproject.org/"
                  target="_blank"
                  rel="noreferrer"
                >
                  The Trevor Project
                </a>
                .
              </p>
            </CardDescription>
          </Card>

          <Card>
            <CardTitle>Talk to a trusted adult</CardTitle>
            <CardDescription>
              Reach out to a parent, caregiver, mentor, teacher, counselor, or
              another adult you trust. You do not have to go through hard moments
              alone.
            </CardDescription>
          </Card>

          <Card>
            <CardTitle>HAVII Support Hub</CardTitle>
            <CardDescription>
              In-app support requests and companion tools are{" "}
              <strong>Coming Next</strong>. For now, use the crisis resources
              above if you need immediate help.
            </CardDescription>
          </Card>
        </div>

        <p className="mt-8 text-sm text-havii-muted">
          HAVII does not provide medical, psychiatric, or legal advice. Together
          For You, Inc. built HAVII as a wellness and mentorship space — not a
          hospital or crisis hotline.
        </p>
        <p className="mt-4">
          <Link href="/" className="text-havii-teal hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
