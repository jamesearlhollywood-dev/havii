"use client";

import { useActionState } from "react";
import { resolveMessageReport } from "@/actions/messages";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function ResolveReportForm({ reportId }: { reportId: string }) {
  const [state, action, pending] = useActionState(resolveMessageReport, {});

  return (
    <form action={action} className="space-y-3">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <input type="hidden" name="report_id" value={reportId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          name="status"
          label="Resolution"
          options={[
            { value: "resolved", label: "Resolved (appropriate)" },
            { value: "dismissed", label: "Dismissed (no action)" },
            { value: "reviewing", label: "Still reviewing" },
          ]}
        />
        <Input name="admin_note" label="Admin Note (optional)" placeholder="Resolution note..." />
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={pending}>Update Report</Button>
      </div>
    </form>
  );
}
