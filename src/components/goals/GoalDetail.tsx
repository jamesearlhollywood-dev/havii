"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  setGoalStatusAction,
  addStepAction,
  toggleStepAction,
  deleteStepAction,
} from "@/actions/goals";
import type {
  GoalWithSteps,
  GoalState,
  StepState,
} from "@/lib/goalConstants";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { GoalProgress } from "./GoalProgress";
import { GoalForm } from "./GoalForm";
import { categoryLabel, formatDate, statusLabel } from "./goalHelpers";

export function GoalDetail({ goal }: { goal: GoalWithSteps }) {
  const [isEditing, setIsEditing] = useState(false);
  const [stepInput, setStepInput] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [statusState, statusAction, statusPending] = useActionState<GoalState, FormData>(
    setGoalStatusAction,
    {}
  );
  const [addState, addAction, addPending] = useActionState<StepState, FormData>(
    addStepAction,
    {}
  );
  const [, toggleAction, togglePending] = useActionState<StepState, FormData>(
    toggleStepAction,
    {}
  );
  const [deleteState, deleteAction, deletePending] = useActionState<StepState, FormData>(
    deleteStepAction,
    {}
  );

  // Clear the add-step input after a successful add.
  useEffect(() => {
    if (addState.success) setStepInput("");
  }, [addState.success]);

  if (isEditing) {
    return <GoalForm goal={goal} onCancel={() => setIsEditing(false)} />;
  }

  const allStepsComplete =
    goal.stepTotal > 0 && goal.stepCompleted === goal.stepTotal && goal.status === "active";

  const targetPassed =
    goal.target_date && new Date(goal.target_date + "T00:00:00") < new Date(new Date().toDateString());

  const busy = statusPending || addPending || togglePending || deletePending;

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/app/goals"
          className="text-sm font-medium text-havii-muted hover:text-havii-ink"
        >
          ← Goals
        </Link>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-sm font-medium text-havii-teal hover:text-havii-teal-dark"
        >
          Edit
        </button>
      </div>

      {/* Flash messages */}
      {statusState.success && <Alert tone="success">{statusState.success}</Alert>}
      {statusState.error && <Alert tone="error">{statusState.error}</Alert>}
      {addState.error && <Alert tone="error">{addState.error}</Alert>}
      {deleteState.error && <Alert tone="error">{deleteState.error}</Alert>}

      {/* Goal summary card */}
      <article className="rounded-2xl border border-havii-mist bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="rounded-full bg-havii-sand px-2.5 py-0.5 text-xs font-medium text-havii-teal-dark">
              {categoryLabel(goal.category)}
            </span>
            <h1 className="mt-2 text-xl font-bold text-havii-ink">{goal.title}</h1>
          </div>
        </div>

        {goal.description && (
          <p className="mt-3 text-sm leading-relaxed text-havii-ink whitespace-pre-wrap">
            {goal.description}
          </p>
        )}

        {goal.target_date && (
          <p className="mt-3 text-xs text-havii-muted">
            Target date: {formatDate(goal.target_date)}
            {targetPassed && goal.status === "active" && (
              <span className="block mt-0.5 text-havii-muted">
                This date has passed — that&apos;s okay. Keep going at your pace.
              </span>
            )}
          </p>
        )}

        <div className="mt-4">
          <GoalProgress
            stepTotal={goal.stepTotal}
            stepCompleted={goal.stepCompleted}
            status={goal.status}
          />
        </div>
      </article>

      {/* Action steps */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-havii-ink">Action steps</h2>
          <span className="text-xs text-havii-muted">
            {goal.stepTotal === 0
              ? "No steps yet"
              : `${goal.stepCompleted}/${goal.stepTotal} done`}
          </span>
        </div>

        {goal.steps.length === 0 ? (
          <p className="rounded-xl border border-dashed border-havii-mist bg-white p-4 text-sm text-havii-muted">
            Break this goal into small steps. Each step makes the next one easier.
          </p>
        ) : (
          <ul className="space-y-2">
            {goal.steps.map((step) => (
              <li key={step.id}>
                <div className="flex items-center gap-3 rounded-xl border border-havii-mist bg-white p-3 shadow-sm">
                  <form action={toggleAction} className="flex flex-1 items-center gap-3">
                    <input type="hidden" name="stepId" value={step.id} />
                    <input type="hidden" name="goalId" value={goal.id} />
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={step.completed}
                        disabled={busy}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="h-6 w-6 shrink-0 rounded-md border-havii-mist text-havii-teal accent-havii-teal focus-visible:ring-2 focus-visible:ring-havii-teal"
                        aria-label={
                          step.completed ? `Mark step incomplete: ${step.title}` : `Mark step complete: ${step.title}`
                        }
                      />
                      <span
                        className={`text-sm ${
                          step.completed
                            ? "text-havii-muted line-through"
                            : "text-havii-ink"
                        }`}
                      >
                        {step.title}
                      </span>
                    </label>
                  </form>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(step.id)}
                    disabled={busy}
                    aria-label={`Remove step: ${step.title}`}
                    className="shrink-0 rounded-lg p-1.5 text-havii-muted hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 disabled:opacity-50"
                  >
                    <TrashIcon />
                  </button>
                </div>

                {/* Inline delete confirmation */}
                {confirmDeleteId === step.id && (
                  <div className="mt-1.5 rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-900">
                      Remove this step? You can&apos;t undo this.
                    </p>
                    <form action={deleteAction} className="mt-2 flex gap-2">
                      <input type="hidden" name="stepId" value={step.id} />
                      <input type="hidden" name="goalId" value={goal.id} />
                      <Button
                        type="submit"
                        variant="danger"
                        size="sm"
                        loading={deletePending}
                        disabled={deletePending}
                      >
                        Remove
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={deletePending}
                      >
                        Cancel
                      </Button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Add step form — preserve input on failure via value binding */}
        <form action={addAction} className="flex gap-2">
          <input type="hidden" name="goalId" value={goal.id} />
          <input
            type="text"
            name="title"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            placeholder="Add a small step…"
            maxLength={200}
            aria-label="New action step"
            className="flex-1 rounded-xl border border-havii-mist bg-white px-3.5 py-2.5 text-sm text-havii-ink placeholder:text-havii-muted shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-havii-teal focus-visible:border-havii-teal"
          />
          <Button
            type="submit"
            size="md"
            loading={addPending}
            disabled={addPending || !stepInput.trim()}
          >
            Add
          </Button>
        </form>
      </section>

      {/* Offer to mark goal complete when all steps are done (manual, not automatic) */}
      {allStepsComplete && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-900">
            You finished every step. Want to mark this goal complete?
          </p>
          <form action={statusAction} className="mt-3">
            <input type="hidden" name="goalId" value={goal.id} />
            <input type="hidden" name="status" value="completed" />
            <Button type="submit" size="md" loading={statusPending} disabled={statusPending}>
              Mark goal complete
            </Button>
          </form>
        </div>
      )}

      {/* Status actions */}
      <div className="space-y-2 border-t border-havii-mist pt-4">
        {goal.status === "active" && (
          <>
            <form action={statusAction}>
              <input type="hidden" name="goalId" value={goal.id} />
              <input type="hidden" name="status" value="completed" />
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full"
                loading={statusPending}
                disabled={statusPending}
              >
                Mark as complete
              </Button>
            </form>
            <form action={statusAction}>
              <input type="hidden" name="goalId" value={goal.id} />
              <input type="hidden" name="status" value="archived" />
              <Button
                type="submit"
                variant="ghost"
                size="lg"
                className="w-full"
                loading={statusPending}
                disabled={statusPending}
              >
                Archive goal
              </Button>
            </form>
          </>
        )}

        {goal.status === "completed" && (
          <>
            <form action={statusAction}>
              <input type="hidden" name="goalId" value={goal.id} />
              <input type="hidden" name="status" value="active" />
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full"
                loading={statusPending}
                disabled={statusPending}
              >
                Reopen goal
              </Button>
            </form>
            <form action={statusAction}>
              <input type="hidden" name="goalId" value={goal.id} />
              <input type="hidden" name="status" value="archived" />
              <Button
                type="submit"
                variant="ghost"
                size="lg"
                className="w-full"
                loading={statusPending}
                disabled={statusPending}
              >
                Archive goal
              </Button>
            </form>
          </>
        )}

        {goal.status === "archived" && (
          <form action={statusAction}>
            <input type="hidden" name="goalId" value={goal.id} />
            <input type="hidden" name="status" value="active" />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={statusPending}
              disabled={statusPending}
            >
              Restore goal
            </Button>
          </form>
        )}
      </div>

      <p className="text-xs text-havii-muted">
        This goal is private to you. Status: {statusLabel(goal.status)}.
      </p>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
