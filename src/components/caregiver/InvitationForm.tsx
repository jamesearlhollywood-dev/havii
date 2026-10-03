"use client";

import { useActionState, useState } from "react";
import { createInvitationAction } from "@/actions/caregiver";
import type { InvitationState } from "@/lib/consentConstants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function InvitationForm({ devLink }: { devLink?: string | null }) {
  const [state, formAction, isPending] = useActionState<InvitationState, FormData>(
    createInvitationAction,
    {}
  );
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverEmail, setCaregiverEmail] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-havii-ink">Invite your caregiver</h2>
        <p className="mt-1 text-sm text-havii-muted">
          Enter your parent or legal guardian&apos;s name and email. We&apos;ll send them a
          secure link to review and provide consent.
        </p>
      </div>

      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && (
        <>
          <Alert tone="success">{state.success}</Alert>
          {devLink && (
            <div className="rounded-xl border border-havii-mist bg-havii-sand p-3">
              <p className="text-xs font-medium text-havii-teal-dark">Development link (email not sent):</p>
              <p className="mt-1 break-all text-xs text-havii-ink">{devLink}</p>
            </div>
          )}
        </>
      )}

      <form action={formAction} className="space-y-4">
        <Input
          name="caregiver_name"
          label="Caregiver's name"
          placeholder="e.g. Mom, Dad, Guardian"
          value={caregiverName}
          onChange={(e) => setCaregiverName(e.target.value)}
          required
          autoComplete="off"
        />
        <Input
          name="caregiver_email"
          label="Caregiver's email"
          type="email"
          placeholder="caregiver@example.com"
          value={caregiverEmail}
          onChange={(e) => setCaregiverEmail(e.target.value)}
          required
          autoComplete="off"
        />

        <Button type="submit" size="lg" className="w-full" loading={isPending}>
          Send Invitation
        </Button>
      </form>
    </div>
  );
}
