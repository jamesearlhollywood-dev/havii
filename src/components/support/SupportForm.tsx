"use client";

import { useActionState } from "react";
import { submitSupportRequest } from "@/actions/progress";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";

export function SupportForm() {
  const [state, action, pending] = useActionState(submitSupportRequest, {});

  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <Input name="subject" label="Subject" required placeholder="What do you need help with?" />
      <Textarea name="body" label="Message" required placeholder="Describe your issue or question..." />
      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Submit Request</Button>
      </div>
    </form>
  );
}
