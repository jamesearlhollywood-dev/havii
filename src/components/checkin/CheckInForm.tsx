"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveCheckInAction, type CheckInState } from "@/actions/checkin";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";

const MOODS = [
  { value: "great", label: "Great", emoji: "😄" },
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "low", label: "Low", emoji: "😕" },
  { value: "struggling", label: "Struggling", emoji: "😞" },
];

export type TodayCheckIn = {
  id: string;
  mood: string;
  note: string | null;
  check_in_date: string;
};

export function CheckInForm({
  todayCheckIn,
  preferredName,
}: {
  todayCheckIn: TodayCheckIn | null;
  preferredName: string;
}) {
  const [state, formAction, isPending] = useActionState<CheckInState, FormData>(
    saveCheckInAction,
    {}
  );

  const [mood, setMood] = useState(todayCheckIn?.mood ?? "");
  const [note, setNote] = useState(todayCheckIn?.note ?? "");
  const isEditing = Boolean(todayCheckIn);
  const showConfirmation = Boolean(state.success);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-havii-ink">
          Hi, {preferredName}!
        </h1>
      </div>

      {showConfirmation && (
        <Alert tone="success">{state.success}</Alert>
      )}
      {state.error && (
        <Alert tone="error">{state.error}</Alert>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="mood" value={mood} />
        <input type="hidden" name="note" value={note} />

        <div>
          <p className="mb-3 text-lg font-medium text-havii-ink">
            How are you feeling today?
          </p>
          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Mood">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={mood === m.value}
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition ${
                  mood === m.value
                    ? "border-havii-teal bg-havii-teal/5"
                    : "border-havii-mist bg-white"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-medium text-havii-ink">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Textarea
          name="note_display"
          label="Add a note (optional)"
          placeholder="What's on your mind?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={2000}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isPending}
          disabled={!mood}
        >
          {isEditing ? "Update Check-In" : "Save Check-In"}
        </Button>
      </form>

      <div className="pt-2">
        <Link
          href="/app/history"
          className="block text-center text-sm text-havii-teal underline-offset-2 hover:underline"
        >
          View your check-in history
        </Link>
      </div>
    </div>
  );
}
