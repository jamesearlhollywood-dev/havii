"use client";

import { useActionState, useState } from "react";
import { adultConsentAction } from "@/actions/caregiver";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CONSENT_SECTIONS, CONSENT_DOCUMENT_VERSION } from "@/lib/consentConstants";

export function AdultConsentForm({ preferredName }: { preferredName: string }) {
  const [state, formAction, isPending] = useActionState<{ error?: string; success?: string }, FormData>(
    adultConsentAction,
    {}
  );
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-havii-ink">You&apos;re 18 now, {preferredName}!</h1>
        <p className="mt-1 text-sm text-havii-muted">
          Now that you&apos;re 18, you can provide your own consent to participate in HAVII.
          This replaces any previous caregiver consent. Please review and accept to continue
          using HAVII&apos;s program features.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs font-medium text-amber-900">
          ⚠ DRAFT consent text — pending program team approval. This is a launch requirement.
        </p>
      </div>

      <div className="space-y-4">
        {CONSENT_SECTIONS.map((section) => (
          <div key={section.heading} className="rounded-xl border border-havii-mist bg-white p-4">
            <h3 className="text-sm font-semibold text-havii-ink">{section.heading}</h3>
            <p className="mt-1.5 text-sm text-havii-muted leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-havii-mist bg-havii-sand p-3">
        <p className="text-xs text-havii-muted">
          Consent document version: <span className="font-mono">{CONSENT_DOCUMENT_VERSION}</span>
        </p>
      </div>

      {state.error && <Alert tone="error">{state.error}</Alert>}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="consent_given" value={consentGiven ? "true" : "false"} />
        <label className="flex items-start gap-3 rounded-xl border border-havii-mist bg-white p-4 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 rounded border-havii-mist text-havii-teal focus-visible:ring-havii-teal"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
          />
          <span className="text-sm text-havii-ink">
            I understand how HAVII uses my information and I consent to participate. I understand
            that any previous caregiver consent will be ended.
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" loading={isPending} disabled={!consentGiven}>
          Continue to HAVII
        </Button>
      </form>
    </div>
  );
}
