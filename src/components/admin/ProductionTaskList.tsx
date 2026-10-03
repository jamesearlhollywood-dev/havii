"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import {
  saveProductionTaskAction,
  updateTaskStatusAction,
  deleteProductionTaskAction,
  type TaskActionState,
} from "@/actions/production";
import {
  PRODUCTION_TASK_STATUSES,
  PRODUCTION_TASK_LABELS,
  SUGGESTED_TASKS,
  TASK_DONE_STATUSES,
} from "@/lib/podcast-types";
import type { ProductionTask } from "@/lib/podcast-types";

const initial: TaskActionState = {};

const statusOptions = PRODUCTION_TASK_STATUSES.map((s) => ({
  value: s,
  label: PRODUCTION_TASK_LABELS[s],
}));

function statusBadge(status: string): string {
  const colors: Record<string, string> = {
    not_started: "bg-studio-surface text-studio-muted",
    in_progress: "bg-amber-500/10 text-amber-400",
    waiting: "bg-sky-500/10 text-sky-400",
    completed: "bg-emerald-500/10 text-emerald-400",
    cancelled: "bg-studio-line/40 text-studio-muted/70",
    blocked: "bg-red-500/10 text-red-400",
  };
  return colors[status] ?? "bg-studio-surface text-studio-muted";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ProductionTaskList({
  episodeId,
  tasks,
}: {
  episodeId: string;
  tasks: ProductionTask[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [state, action, pending] = useActionState(saveProductionTaskAction, initial);

  const total = tasks.length;
  const done = tasks.filter((t) => TASK_DONE_STATUSES.includes(t.status)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const overdue = tasks.filter(
    (t) =>
      t.due_date &&
      new Date(t.due_date) < new Date(new Date().toDateString()) &&
      !TASK_DONE_STATUSES.includes(t.status)
  );

  return (
    <div>
      {/* Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-studio-line">
            <div
              className="h-full rounded-full bg-studio-gold transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm font-medium text-studio-ink">{pct}%</span>
          <span className="text-xs text-studio-muted">
            {done}/{total} complete
          </span>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "Add Task"}
        </Button>
      </div>

      {overdue.length > 0 && (
        <p className="mt-3 text-xs font-medium text-red-400">
          {overdue.length} overdue {overdue.length === 1 ? "task" : "tasks"}
        </p>
      )}

      {/* Add-task form */}
      {showForm && (
        <form action={action} className="mt-4 space-y-3 rounded-2xl border border-studio-line bg-studio-surface p-4">
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          <input type="hidden" name="episode_id" value={episodeId} />
          <Input
            name="task_name"
            label="Task Name"
            required
            placeholder="Edit Audio"
          />
          {/* Suggested tasks */}
          <div>
            <p className="mb-2 text-xs font-medium text-studio-muted">Suggested:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TASKS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    const el = document.querySelector<HTMLInputElement>(
                      'input[name="task_name"]'
                    );
                    if (el) el.value = t;
                  }}
                  className="rounded-lg border border-studio-line px-2 py-1 text-xs text-studio-muted transition hover:border-studio-gold/50 hover:text-studio-gold"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input name="assigned_to" label="Assigned To" placeholder="Editor name" />
            <Input name="due_date" label="Due Date" type="date" />
            <div className="space-y-1.5">
              <label htmlFor="task_status" className="block text-sm font-medium text-studio-ink">
                Status
              </label>
              <select
                id="task_status"
                name="status"
                defaultValue="not_started"
                className="w-full rounded-xl border border-studio-line bg-studio-charcoal px-3.5 py-2.5 text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Textarea
            name="notes"
            label="Notes"
            placeholder="Context, links, blockers…"
            className="min-h-[70px]"
          />
          <div className="flex justify-end">
            <Button type="submit" loading={pending} size="sm">
              Save Task
            </Button>
          </div>
        </form>
      )}

      {/* Task list */}
      {total === 0 ? (
        <p className="mt-4 py-6 text-center text-sm text-studio-muted">
          No production tasks yet. Add tasks to track the episode workflow.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} episodeId={episodeId} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskRow({ task, episodeId }: { task: ProductionTask; episodeId: string }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(updateTaskStatusAction, initial);

  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date(new Date().toDateString()) &&
    !TASK_DONE_STATUSES.includes(task.status);

  return (
    <li className="rounded-xl border border-studio-line bg-studio-charcoal p-3">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className={`text-sm font-medium ${
                task.status === "completed"
                  ? "text-studio-muted line-through"
                  : "text-studio-ink"
              }`}
            >
              {task.task_name}
            </p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadge(
                task.status
              )}`}
            >
              {PRODUCTION_TASK_LABELS[task.status]}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-studio-muted">
            {task.assigned_to && <span>Assigned: {task.assigned_to}</span>}
            <span className={isOverdue ? "text-red-400" : ""}>
              Due: {formatDate(task.due_date)}
              {isOverdue ? " (overdue)" : ""}
            </span>
          </div>
          {task.notes && (
            <p className="mt-1 text-xs text-studio-muted/80">{task.notes}</p>
          )}
        </div>

        {/* Quick status change */}
        <form action={action} className="shrink-0">
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="episode_id" value={episodeId} />
          <select
            name="status"
            defaultValue={task.status}
            aria-label="Task status"
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            disabled={pending}
            className="rounded-lg border border-studio-line bg-studio-surface px-2 py-1 text-xs text-studio-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-studio-gold"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </form>
      </div>

      {editing && (
        <EditTaskForm task={task} episodeId={episodeId} onDone={() => setEditing(false)} />
      )}
    </li>
  );
}

function EditTaskForm({
  task,
  episodeId,
  onDone,
}: {
  task: ProductionTask;
  episodeId: string;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(saveProductionTaskAction, initial);
  return (
    <form action={action} className="mt-3 space-y-3 border-t border-studio-line pt-3">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? (
        <Alert tone="success">{state.success}</Alert>
      ) : null}
      <input type="hidden" name="id" value={task.id} />
      <input type="hidden" name="episode_id" value={episodeId} />
      <Input name="task_name" label="Task Name" required defaultValue={task.task_name} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Input name="assigned_to" label="Assigned To" defaultValue={task.assigned_to ?? ""} />
        <Input name="due_date" label="Due Date" type="date" defaultValue={task.due_date?.slice(0, 10) ?? ""} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-studio-ink">Status</label>
          <select
            name="status"
            defaultValue={task.status}
            className="w-full rounded-xl border border-studio-line bg-studio-surface px-3.5 py-2.5 text-studio-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Textarea name="notes" label="Notes" defaultValue={task.notes ?? ""} className="min-h-[70px]" />
      <div className="flex justify-between">
        <button
          type="submit"
          name="action_delete"
          formAction={undefined}
          onClick={(e) => {
            e.preventDefault();
            if (confirm("Delete this task?")) {
              const fd = new FormData();
              fd.set("id", task.id);
              fd.set("episode_id", episodeId);
              deleteProductionTaskAction(fd).then(onDone);
            }
          }}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Delete
        </button>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Close
          </Button>
          <Button type="submit" loading={pending} size="sm">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
