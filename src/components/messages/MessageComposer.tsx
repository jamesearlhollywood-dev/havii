"use client";

import { useActionState, useState } from "react";
import { sendMessage } from "@/actions/messages";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import type { Profile, Cohort } from "@/lib/types";

interface Recipient {
  id: string;
  name: string;
  role: string;
}

export function MessageComposer({
  profile,
  recipients,
  cohorts,
}: {
  profile: Profile;
  recipients: Recipient[];
  cohorts: (Cohort & { organization_name?: string })[];
}) {
  const [state, action, pending] = useActionState(sendMessage, {});
  const [isBroadcast, setIsBroadcast] = useState(false);

  const isStudent = profile.role === "student";
  const isInstructorOrAdmin = profile.role === "instructor" || profile.role === "admin";
  const canBroadcast = isInstructorOrAdmin;

  const recipientOptions = recipients.map((r) => ({
    value: r.id,
    label: `${r.name} (${r.role})`,
  }));

  const cohortOptions = cohorts.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      {/* Broadcast toggle for instructors/admins */}
      {canBroadcast && (
        <label className="flex items-center gap-3 rounded-xl border border-rise-border bg-rise-sky/30 px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_broadcast"
            checked={isBroadcast}
            onChange={(e) => setIsBroadcast(e.target.checked)}
            className="h-4 w-4 rounded border-rise-border text-rise-navy focus:ring-rise-blue"
          />
          <span className="text-sm font-medium text-rise-navy">
            Send to entire cohort (broadcast)
          </span>
        </label>
      )}

      {isBroadcast ? (
        <Select
          name="cohort_id"
          label="Select Cohort"
          options={cohortOptions}
          required
        />
      ) : (
        <Select
          name="recipient_id"
          label={isStudent ? "Recipient (Your Instructor)" : "Recipient"}
          options={recipientOptions}
          required={!isBroadcast}
        />
      )}

      <Input name="subject" label="Subject" required placeholder="Message subject" />
      <Textarea name="body" label="Message" required placeholder="Type your message..." />

      {/* Hidden cohort_id for non-broadcast instructor messages */}
      {!isBroadcast && profile.role === "instructor" && (
        <Select name="cohort_id" label="Cohort (optional)" options={[{ value: "", label: "None" }, ...cohortOptions]} />
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Send Message</Button>
      </div>
    </form>
  );
}
