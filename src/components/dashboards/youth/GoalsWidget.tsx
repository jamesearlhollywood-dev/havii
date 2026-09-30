"use client";

import { useActionState, useState } from "react";
import { createGoalAction, updateGoalProgressAction, type ActionResult } from "@/actions/youth";
import type { Goal } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function GoalsWidget({ goals }: { goals: Goal[] }) {
  const [showForm, setShowForm] = useState(false);
  const [createState, createAction, createPending] = useActionState(createGoalAction, {} as ActionResult);

  return (
    <div className="space-y-4">
      {createState.error ? (
        <p className="text-sm text-red-600">{createState.error}</p>
      ) : createState.success ? (
        <p className="text-sm font-medium text-havii-teal">{createState.success}</p>
      ) : null}

      {goals.length === 0 && !showForm ? (
        <div className="text-center py-4">
          <p className="text-sm text-havii-muted">No goals yet. Set your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {showForm ? (
        <form action={createAction} className="space-y-3 rounded-xl border border-havii-mist bg-havii-sand/30 p-4">
          <Input name="title" label="Goal title" required placeholder="e.g. Finish my college essay" />
          <Textarea
            name="description"
            label="Description (optional)"
            placeholder="What does success look like?"
            className="min-h-[60px]"
          />
          <Input name="target_date" label="Target date (optional)" type="date" />
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={createPending}>
              Add goal
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(true)}>
          + Add a goal
        </Button>
      )}
    </div>
  );
}

function GoalItem({ goal }: { goal: Goal }) {
  const [progress, setProgress] = useState(goal.progress);
  const [state, action, pending] = useActionState(updateGoalProgressAction, {} as ActionResult);

  const isCompleted = goal.status === "completed" || goal.progress >= 100;

  return (
    <div className={`rounded-xl border p-3 ${isCompleted ? "border-havii-teal/40 bg-havii-teal/5" : "border-havii-mist bg-white"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className={`text-sm font-medium text-havii-ink ${isCompleted ? "line-through opacity-70" : ""}`}>
            {goal.title}
          </p>
          {goal.description ? (
            <p className="mt-0.5 text-xs text-havii-muted">{goal.description}</p>
          ) : null}
          {goal.target_date ? (
            <p className="mt-1 text-xs text-havii-muted">
              Target: {new Date(goal.target_date).toLocaleDateString()}
            </p>
          ) : null}
        </div>
        <span className="text-xs font-semibold text-havii-teal-dark">{progress}%</span>
      </div>

      {state.error ? <p className="mt-1 text-xs text-red-600">{state.error}</p> : null}

      {!isCompleted && (
        <form action={action} className="mt-2">
          <input type="hidden" name="goal_id" value={goal.id} />
          <div className="flex items-center gap-2">
            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              step="10"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer rounded-lg accent-havii-teal"
            />
            <Button type="submit" size="sm" variant="ghost" loading={pending} className="px-2 py-1 text-xs">
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
