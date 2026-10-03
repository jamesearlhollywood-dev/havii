"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { withdrawConsentAction } from "@/actions/caregiver";
import type { WithdrawState } from "@/lib/consentConstants";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function CaregiverDashboard({
  youthName,
  consentStatus,
  consentedAt,
}: {
  youthName: string;
  consentStatus: string;
  consentedAt: string | null;
}) {
  const [state, formAction, isPending] = useActionState<WithdrawState, FormData>(
    withdrawConsentAction,
    {}
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const isActive = consentStatus === "caregiver_consented";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-havii-ink">Caregiver Dashboard</h1>
        <p className="mt-1 text-sm text-havii-muted">
          You are linked to {youthName}&apos;s HAVII account.
        </p>
      </div>

      {/* Youth status — basic participation info only */}
      <div className="space-y-3 rounded-2xl border border-havii-mist bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-havii-ink">Youth Status</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-havii-muted">Name</dt>
            <dd className="font-medium text-havii-ink">{youthName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-havii-muted">Participation</dt>
            <dd className="font-medium text-havii-ink">Active in HAVII</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-havii-muted">Consent</dt>
            <dd className="font-medium text-havii-ink">
              {isActive ? "Approved" : "Withdrawn / Not Active"}
            </dd>
          </div>
          {consentedAt && (
            <div className="flex justify-between gap-4">
              <dt className="text-havii-muted">Approved on</dt>
              <dd className="font-medium text-havii-ink">
                {new Date(consentedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Privacy notice */}
      <Alert tone="info">
        <p className="font-medium">Your view is limited</p>
        <p className="mt-1">
          For privacy, you can only see your youth&apos;s basic participation and consent status.
          Journals, check-in notes, goals, and other private reflections are not visible to you.
        </p>
      </Alert>

      {state.success && <Alert tone="success">{state.success}</Alert>}
      {state.error && <Alert tone="error">{state.error}</Alert>}

      {/* Withdraw consent */}
      {isActive && !showConfirm && !state.success && (
        <div className="space-y-2">
          <Button
            variant="outline"
            size="lg"
            className="w-full text-red-600"
            onClick={() => setShowConfirm(true)}
          >
            Withdraw Consent
          </Button>
        </div>
      )}

      {isActive && showConfirm && !state.success && (
        <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-900">
            Are you sure you want to withdraw consent?
          </p>
          <p className="text-sm text-red-800">
            {youthName}&apos;s access to protected program features (check-ins, journal, goals)
            will be immediately restricted. Their stored records will be preserved. You can
            re-approve later if the youth sends a new invitation.
          </p>
          <form action={formAction} className="flex gap-3">
            <input type="hidden" name="confirm" value="true" />
            <Button type="submit" variant="danger" size="md" className="flex-1" loading={isPending}>
              Yes, Withdraw Consent
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="flex-1"
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </form>
        </div>
      )}

      {/* Support resources and sign-out */}
      <div className="space-y-3 pt-2">
        <Link href="/help" className="block">
          <Button variant="outline" size="lg" className="w-full">
            View support resources
          </Button>
        </Link>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="lg" className="w-full">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
