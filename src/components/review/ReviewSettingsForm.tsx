"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateReviewSettingsAction } from "@/actions/reviews";
import type { ReviewSettings } from "@/lib/types";

export function ReviewSettingsForm({ settings }: { settings: ReviewSettings }) {
  const [state, setState] = useState<{ error?: string; success?: string }>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateReviewSettingsAction({}, formData);
    setState(result);
    setPending(false);
  }

  return (
    <Card>
      <h3 className="mb-4 text-lg font-bold text-rise-navy">Instructor Review Expectations</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Review Target (business days)"
          name="review_target_days"
          type="number"
          min={1}
          max={30}
          defaultValue={settings.review_target_days}
          hint="Default: 5 business days. Submissions older than this are highlighted as overdue."
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="highlight_overdue"
            defaultChecked={settings.highlight_overdue}
            className="h-4 w-4 rounded border-rise-border"
          />
          <span className="text-sm text-rise-navy">Highlight overdue reviews in the queue</span>
        </label>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.success && <p className="text-sm text-rise-success">{state.success}</p>}
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </Card>
  );
}
