"use client";

import { useActionState } from "react";
import { updateNotificationPreferences } from "@/actions/notifications";
import type { NotificationPreferences } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

const CATEGORY_INFO: { key: keyof NotificationPreferences; label: string; description: string; required?: boolean }[] = [
  { key: "course_progress", label: "Course Progress", description: "Module unlocks, lesson completions, and progress milestones." },
  { key: "instructor_messages", label: "Instructor Messages", description: "Messages and feedback from your instructor." },
  { key: "announcements", label: "Announcements", description: "Course, cohort, and organization announcements." },
  { key: "assignment_reminders", label: "Assignment Reminders", description: "Due dates, progress reminders, and inactivity nudges." },
  { key: "certificate_completion", label: "Certificate & Completion", description: "Final assessment, course completion, and certificate issuance." },
];

export function NotificationPreferencesForm({ preferences }: { preferences: NotificationPreferences }) {
  const [state, action, pending] = useActionState(updateNotificationPreferences, {});

  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="space-y-3">
        {CATEGORY_INFO.map((cat) => (
          <label
            key={cat.key}
            className="flex items-start gap-3 rounded-xl border border-rise-border bg-white p-4 cursor-pointer hover:bg-rise-sky/30 transition"
          >
            <input
              type="checkbox"
              name={cat.key}
              defaultChecked={preferences[cat.key] as boolean}
              className="mt-1 h-4 w-4 rounded border-rise-border text-rise-navy focus:ring-rise-blue"
            />
            <div>
              <p className="text-sm font-semibold text-rise-navy">{cat.label}</p>
              <p className="text-xs text-rise-muted">{cat.description}</p>
            </div>
          </label>
        ))}

        <div className="rounded-xl border border-rise-border bg-rise-sky/30 p-4">
          <p className="text-sm font-semibold text-rise-navy">Account & Security</p>
          <p className="text-xs text-rise-muted">
            Always enabled — includes account, security, and administrative notices that cannot be turned off.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Save Preferences</Button>
      </div>
    </form>
  );
}
