"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { createGoalAction, updateGoalAction } from "@/actions/goals";
import { GOAL_CATEGORIES, type GoalState, type GoalWithSteps } from "@/lib/goalConstants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";

export function GoalForm({
  goal,
  onCancel,
}: {
  goal?: GoalWithSteps;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const isEditing = Boolean(goal);

  const [state, formAction, isPending] = useActionState<GoalState, FormData>(
    isEditing ? updateGoalAction : createGoalAction,
    {}
  );

  const [title, setTitle] = useState(goal?.title ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [category, setCategory] = useState(goal?.category ?? "");
  const [targetDate, setTargetDate] = useState(goal?.target_date ?? "");

  // Preserve input after a failed save: re-seed from returned state when present.
  const initialTitle = goal?.title ?? "";
  const initialDescription = goal?.description ?? "";
  const initialCategory = goal?.category ?? "";
  const initialTargetDate = goal?.target_date ?? "";

  const isDirty =
    title !== initialTitle ||
    description !== initialDescription ||
    category !== initialCategory ||
    targetDate !== initialTargetDate;

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;

    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);

    const clickCapture = (e: MouseEvent) => {
      if (!isDirty) return;
      const link = (e.target as HTMLElement)?.closest("a");
      if (link && link.getAttribute("href")) {
        if (!window.confirm("You have unsaved changes. Leave anyway?")) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    document.addEventListener("click", clickCapture, true);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", clickCapture, true);
    };
  }, [isDirty]);

  const handleCancel = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Leave anyway?")) {
      return;
    }
    if (onCancel) {
      onCancel();
    } else {
      router.push("/app/goals");
    }
  };

  const heading = isEditing ? "Edit Goal" : "New Goal";
  const saveLabel = isEditing ? "Save Changes" : "Create Goal";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-havii-ink">{heading}</h1>
        <button
          type="button"
          onClick={handleCancel}
          className="text-sm font-medium text-havii-muted hover:text-havii-ink"
        >
          Cancel
        </button>
      </div>

      <p className="text-sm text-havii-muted">
        Goals are private to you. Take them one small step at a time — there&apos;s no
        pressure to finish by a certain date.
      </p>

      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <form action={formAction} className="flex flex-1 flex-col space-y-5">
        {goal && <input type="hidden" name="goalId" value={goal.id} />}
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="targetDate" value={targetDate} />

        <Input
          name="title_display"
          label="Goal title"
          placeholder="e.g. Feel calmer before exams"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          aria-required="true"
        />

        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-havii-ink">
            Category <span className="text-havii-muted">(required)</span>
          </span>
          <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="Goal category"
          >
            {GOAL_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={category === c.value}
                onClick={() => setCategory(c.value)}
                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition ${
                  category === c.value
                    ? "border-havii-teal bg-havii-teal/5 text-havii-teal-dark"
                    : "border-havii-mist bg-white text-havii-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          name="description_display"
          label="Description (optional)"
          placeholder="What does success look like for you?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />

        <Input
          name="targetDate_display"
          label="Target date (optional)"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          hint="A date can help — but missing it is okay."
        />

        {/* Sticky action bar — reachable when keyboard is open */}
        <div className="sticky bottom-20 mt-auto flex gap-3 border-t border-havii-mist bg-havii-cream pt-4">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            loading={isPending}
            disabled={isPending || !title.trim() || !category}
          >
            {isPending ? "Saving…" : saveLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
