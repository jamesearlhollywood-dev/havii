"use client";

import { useActionState, useState } from "react";
import { reportMessage } from "@/actions/messages";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";

export function ReportMessageButton({ messageId }: { messageId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [state, action, pending] = useActionState(reportMessage, {});

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="text-xs font-medium text-rise-red hover:underline"
      >
        Report
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-rise-red/30 bg-rise-red/5 p-4">
      <p className="mb-2 text-sm font-semibold text-rise-navy">Report this message</p>
      <p className="mb-3 text-xs text-rise-muted">
        Use this to flag a message that seems inappropriate. An admin will review it.
      </p>
      <form action={action} className="space-y-3">
        {state.error ? <Alert tone="error">{state.error}</Alert> : null}
        {state.success ? <Alert tone="success">{state.success}</Alert> : null}
        <input type="hidden" name="message_id" value={messageId} />
        <Textarea
          name="reason"
          label="Reason for reporting"
          required
          placeholder="Explain why this message is inappropriate..."
        />
        <div className="flex gap-2">
          <Button type="submit" variant="danger" size="sm" loading={pending}>Submit Report</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
