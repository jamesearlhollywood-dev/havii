"use client";

import { useActionState } from "react";
import Link from "next/link";
import { caregiverApproveAction, caregiverDeclineAction } from "@/actions/caregiver";
import type { CaregiverConsentState } from "@/lib/consentConstants";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CONSENT_SECTIONS, CONSENT_DOCUMENT_VERSION } from "@/lib/consentConstants";

export function CaregiverReviewForm({
  token,
  youthName,
  caregiverEmail,
}: {
  token: string;
  youthName: string;
  caregiverEmail: string;
}) {
  const [approveState, approveAction, approvePending] = useActionState<CaregiverConsentState, FormData>(
    caregiverApproveAction,
    {}
  );
  const [declineState, declineAction, declinePending] = useActionState<CaregiverConsentState, FormData>(
    caregiverDeclineAction,
    {}
  );

  const error = approveState.error || declineState.error;
  const success = approveState.success || declineState.success;
  const isPending = approvePending || declinePending;

  if (success) {
    return (
      <div className="space-y-6">
        <Alert tone="success">{success}</Alert>
        <Link href="/caregiver">
          <Button size="lg" className="w-full">Go to Caregiver Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-havii-ink">Caregiver Consent</h1>
        <p className="mt-1 text-sm text-havii-muted">
          You are reviewing consent for <strong>{youthName}</strong> to participate in HAVII.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs font-medium text-amber-900">
          ⚠ DRAFT consent text — pending program team approval. This is a launch requirement.
        </p>
      </div>

      {/* Consent sections */}
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
          <br />
          Your email: {caregiverEmail}
        </p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {/* Decision forms */}
      <div className="space-y-3">
        <form action={approveAction}>
          <input type="hidden" name="token" value={token} />
          <Button type="submit" size="lg" className="w-full" loading={approvePending} disabled={isPending}>
            Approve — I give my permission
          </Button>
        </form>

        <form action={declineAction}>
          <input type="hidden" name="token" value={token} />
          <Button type="submit" variant="outline" size="lg" className="w-full" loading={declinePending} disabled={isPending}>
            Decline — I do not give permission
          </Button>
        </form>
      </div>
    </div>
  );
}
