"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addFollowUpReminderAction,
  createJobLinkedTaskAction,
} from "@/actions/career-tasks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const followUpPresets = [
  { label: "In 3 days", days: 3 },
  { label: "In 5 days", days: 5 },
  { label: "In 7 days", days: 7 },
];

/** Quick task types a user can create from a job application. */
const quickTaskTypes = [
  { type: "Interview", label: "Interview reminder", title: "Interview reminder" },
  { type: "Resume", label: "Update resume", title: "Update resume for this role" },
  { type: "Cover Letter", label: "Write cover letter", title: "Write cover letter" },
  { type: "Offer", label: "Offer deadline", title: "Respond to offer" },
  { type: "Networking", label: "Networking follow-up", title: "Networking follow-up" },
] as const;

export function JobFollowUpReminder({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function run(fn: () => Promise<{ error?: string; success?: string }>) {
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      const res = await fn();
      if (res.error) setError(res.error);
      else if (res.success) {
        setFeedback(res.success);
        router.refresh();
      }
    });
  }

  function handlePreset(days: number) {
    run(() => addFollowUpReminderAction(jobId, { days }));
  }

  function handleCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customDate) {
      setError("Pick a date first.");
      return;
    }
    run(() => addFollowUpReminderAction(jobId, { date: customDate }));
    setCustomDate("");
  }

  function handleQuickTask(
    idx: number
  ) {
    const qt = quickTaskTypes[idx];
    const today = new Date().toISOString().slice(0, 10);
    run(() =>
      createJobLinkedTaskAction({
        jobId,
        taskType: qt.type,
        title: qt.title,
        dueDate: today,
      })
    );
  }

  return (
    <div className="rounded-xl border border-career-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-career-navy">Reminders & Follow-Ups</h2>
        <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)}>
          Add Follow-Up Reminder
        </Button>
      </div>

      {feedback && (
        <p className="mt-3 text-sm text-emerald-700">{feedback} ✓</p>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-career-navy">
              Follow up:
            </p>
            <div className="flex flex-wrap gap-2">
              {followUpPresets.map((p) => (
                <Button
                  key={p.days}
                  size="sm"
                  variant="outline"
                  onClick={() => handlePreset(p.days)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCustom} className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Choose a custom date"
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm">
              Set Reminder
            </Button>
          </form>
        </div>
      )}

      {/* Quick task shortcuts */}
      <div className="mt-4 border-t border-career-border pt-4">
        <p className="mb-2 text-sm font-medium text-career-navy">
          Quick add task:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickTaskTypes.map((qt, idx) => (
            <button
              key={qt.label}
              type="button"
              onClick={() => handleQuickTask(idx)}
              className="rounded-lg border border-career-border px-3 py-1.5 text-xs font-medium text-career-slate hover:bg-career-surface"
            >
              {qt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
