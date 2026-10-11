import Link from "next/link";
import { MarketingHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Help & Support" };

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-rise-sky">
      <MarketingHeader />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-rise-navy">Help & Support</h1>
        <p className="mt-2 text-rise-muted">
          RISE USA is here to support your financial literacy journey.
        </p>

        <div className="mt-8 space-y-4">
          <Card>
            <h2 className="text-lg font-bold text-rise-navy">Need Help with the Platform?</h2>
            <p className="mt-2 text-sm text-rise-muted">
              If you have an account, visit the <Link href="/support" className="font-medium text-rise-blue-dark hover:underline">Support page</Link> to submit a request.
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-rise-navy">Crisis Resources</h2>
            <p className="mt-2 text-sm text-rise-muted">
              RISE USA is a financial literacy program and is not a crisis service.
              If you or someone you know needs immediate help:
            </p>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-rise-border bg-rise-sky/30 p-3">
                <p className="text-sm font-medium text-rise-navy">988 Suicide & Crisis Lifeline</p>
                <p className="text-sm text-rise-muted">Call or text 988 · Available 24/7</p>
              </div>
              <div className="rounded-xl border border-rise-border bg-rise-sky/30 p-3">
                <p className="text-sm font-medium text-rise-navy">Crisis Text Line</p>
                <p className="text-sm text-rise-muted">Text HOME to 741741</p>
              </div>
              <div className="rounded-xl border border-rise-border bg-rise-sky/30 p-3">
                <p className="text-sm font-medium text-rise-navy">Emergency</p>
                <p className="text-sm text-rise-muted">Call 911</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-rise-navy">Financial Protection</h2>
            <p className="mt-2 text-sm text-rise-muted">
              If you believe you've been targeted by a financial scam or identity theft:
            </p>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-rise-border bg-rise-sky/30 p-3">
                <p className="text-sm font-medium text-rise-navy">IdentityTheft.gov</p>
                <p className="text-sm text-rise-muted">Report identity theft and get a recovery plan</p>
              </div>
              <div className="rounded-xl border border-rise-border bg-rise-sky/30 p-3">
                <p className="text-sm font-medium text-rise-navy">FTC Complaint Assistant</p>
                <p className="text-sm text-rise-muted">Report fraud at reportfraud.ftc.gov</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
