import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-havii-cream px-6 py-10">
      <div className="mx-auto max-w-sm space-y-6">
        <div>
          <Link href="/" className="text-sm text-havii-teal hover:underline">
            ← Back to HAVII
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-havii-ink">Get Help</h1>

        <div className="space-y-4 rounded-xl border border-havii-mist bg-white p-5">
          <div>
            <h2 className="font-semibold text-havii-ink">If you are in crisis</h2>
            <p className="mt-1 text-sm text-havii-muted">
              If you or someone you know is in immediate danger, call <strong>911</strong>.
            </p>
            <p className="mt-2 text-sm text-havii-muted">
              For mental health support, call or text <strong>988</strong> to reach the
              Suicide &amp; Crisis Lifeline, available 24/7.
            </p>
          </div>

          <div className="border-t border-havii-mist pt-4">
            <h2 className="font-semibold text-havii-ink">About HAVII support</h2>
            <p className="mt-1 text-sm text-havii-muted">
              HAVII is <strong>not</strong> an emergency service and is <strong>not</strong> monitored 24/7.
              The check-ins and notes you enter are for your personal reflection.
            </p>
            <p className="mt-2 text-sm text-havii-muted">
              If you need to talk to someone, please reach out to a trusted adult, counselor,
              or a crisis line in your area.
            </p>
          </div>
        </div>

        <Link href="/app" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
