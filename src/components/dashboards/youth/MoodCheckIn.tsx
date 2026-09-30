"use client";

import { useActionState } from "react";
import { saveMoodCheckInAction, type ActionResult } from "@/actions/youth";
import type { EmotionalCheckIn, MOOD_LEVELS } from "@/lib/types";
import { MOOD_LEVELS as MOOD_LEVELS_DATA } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

export function MoodCheckIn({
  todayCheckIn,
}: {
  todayCheckIn: EmotionalCheckIn | null;
}) {
  const [state, action, pending] = useActionState(saveMoodCheckInAction, {} as ActionResult);

  return (
    <form action={action} className="space-y-3">
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : state.success ? (
        <p className="text-sm font-medium text-havii-teal">{state.success}</p>
      ) : null}

      <p className="text-sm text-havii-muted">
        {todayCheckIn
          ? "You checked in today. Update if things have changed."
          : "How are you feeling today?"}
      </p>

      <div className="flex justify-between gap-2">
        {MOOD_LEVELS_DATA.map((m) => (
          <label
            key={m.level}
            className="flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl border bg-white p-2 text-center transition hover:border-havii-teal/40 has-[:checked]:border-havii-teal has-[:checked]:bg-havii-teal/5"
          >
            <input
              type="radio"
              name="mood_level"
              value={m.level}
              defaultChecked={todayCheckIn?.mood_level === m.level}
              className="sr-only"
            />
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-xs font-medium text-havii-ink">{m.label}</span>
          </label>
        ))}
      </div>

      <Textarea
        name="notes"
        label="Notes (optional)"
        placeholder="What's on your mind?"
        defaultValue={todayCheckIn?.notes ?? ""}
        className="min-h-[60px]"
      />

      <Button type="submit" size="sm" loading={pending}>
        {todayCheckIn ? "Update check-in" : "Save check-in"}
      </Button>
    </form>
  );
}
