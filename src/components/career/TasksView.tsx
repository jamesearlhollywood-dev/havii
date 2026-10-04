"use client";

import { useState, useTransition } from "react";
import {
  listTasksAction,
  completeTaskAction,
  deleteTaskAction,
  rescheduleTaskAction,
} from "@/actions/career-tasks";
import { Button } from "@/components/ui/Button";
import { TaskModal, type JobLookup } from "@/components/career/TaskModal";
import type { CareerTask } from "@/lib/career/types";

type Tab = "today" | "upcoming" | "overdue" | "completed";

const tabs: { key: Tab; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "overdue", label: "Overdue" },
  { key: "completed", label: "Completed" },
];

export function TasksView({
  initialTasks,
  jobs,
}: {
  initialTasks: CareerTask[];
  jobs: JobLookup[];
}) {
  const [tasks, setTasks] = useState<CareerTask[]>(initialTasks);
  const [tab, setTab] = useState<Tab>("today");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CareerTask | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const today = new Date().toISOString().slice(0, 10);

  async function refresh() {
    const res = await listTasksAction();
    if (!res.error) setTasks(res.tasks);
  }

  const counts = {
    today: tasks.filter((t) => isActive(t) && t.due_date === today).length,
    upcoming: tasks.filter((t) => isActive(t) && t.due_date && t.due_date > today).length,
    overdue: tasks.filter((t) => isActive(t) && t.due_date && t.due_date < today).length,
    completed: tasks.filter((t) => t.status === "Completed").length,
  };

  const visible = tasks.filter((t) => {
    switch (tab) {
      case "today":
        return isActive(t) && t.due_date === today;
      case "upcoming":
        return isActive(t) && !!t.due_date && t.due_date > today;
      case "overdue":
        return isActive(t) && !!t.due_date && t.due_date < today;
      case "completed":
        return t.status === "Completed";
    }
  });

  function isActive(t: CareerTask): boolean {
    return t.status === "To Do" || t.status === "In Progress";
  }

  function handleComplete(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await completeTaskAction(id);
      if (res.error) setError(res.error);
      else await refresh();
    });
  }

  function handleDelete(id: string) {
    setError(null);
    if (!confirm("Delete this task?")) return;
    startTransition(async () => {
      const res = await deleteTaskAction(id);
      if (res.error) setError(res.error);
      else await refresh();
    });
  }

  function startReschedule(t: CareerTask) {
    setReschedulingId(t.id);
    setRescheduleDate(t.due_date ?? today);
  }

  function handleReschedule(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await rescheduleTaskAction(id, rescheduleDate, null);
      if (res.error) setError(res.error);
      else {
        setReschedulingId(null);
        await refresh();
      }
    });
  }

  function handleEditClose() {
    setEditing(null);
    setModalOpen(false);
    startTransition(async () => {
      await refresh();
    });
  }

  function handleAddClose() {
    setModalOpen(false);
    startTransition(async () => {
      await refresh();
    });
  }

  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-career-navy">Tasks</h1>
          <p className="mt-1 text-sm text-career-slate">
            Track follow-ups, deadlines, and next steps for your career.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Task</Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-career-border bg-white p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "bg-career-blue text-white"
                : "text-career-slate hover:bg-career-surface"
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  tab === t.key
                    ? "bg-white/25 text-white"
                    : t.key === "overdue"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="rounded-xl border border-career-border bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-career-slate">
            {tab === "today"
              ? "No tasks due today. You're all caught up!"
              : tab === "completed"
              ? "No completed tasks yet."
              : `No ${tab} tasks.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              job={task.related_job_application_id ? jobMap.get(task.related_job_application_id) ?? null : null}
              today={today}
              rescheduling={reschedulingId === task.id}
              rescheduleDate={rescheduleDate}
              onRescheduleDate={setRescheduleDate}
              onStartReschedule={() => startReschedule(task)}
              onConfirmReschedule={() => handleReschedule(task.id)}
              onCancelReschedule={() => setReschedulingId(null)}
              onComplete={() => handleComplete(task.id)}
              onEdit={() => {
                setEditing(task);
                setModalOpen(true);
              }}
              onDelete={() => handleDelete(task.id)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {modalOpen && (
        <TaskModal
          open={modalOpen}
          onClose={editing ? handleEditClose : handleAddClose}
          task={editing}
          jobs={jobs}
        />
      )}
    </div>
  );
}

function TaskCard({
  task,
  job,
  today,
  rescheduling,
  rescheduleDate,
  onRescheduleDate,
  onStartReschedule,
  onConfirmReschedule,
  onCancelReschedule,
  onComplete,
  onEdit,
  onDelete,
}: {
  task: CareerTask;
  job: { title: string | null; company: string | null } | null;
  today: string;
  rescheduling: boolean;
  rescheduleDate: string;
  onRescheduleDate: (v: string) => void;
  onStartReschedule: () => void;
  onConfirmReschedule: () => void;
  onCancelReschedule: () => void;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const overdue =
    (task.status === "To Do" || task.status === "In Progress") &&
    !!task.due_date &&
    task.due_date < today;
  const dueToday =
    (task.status === "To Do" || task.status === "In Progress") &&
    task.due_date === today;
  const completed = task.status === "Completed";

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        overdue
          ? "border-red-200"
          : dueToday
          ? "border-amber-200"
          : "border-career-border"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold text-career-navy ${
                completed ? "line-through text-career-slate" : ""
              }`}
            >
              {task.title}
            </h3>
            <TypeBadge type={task.task_type} />
            <PriorityBadge priority={task.priority} />
            {overdue && <Indicator color="red" label="Overdue" />}
            {dueToday && <Indicator color="amber" label="Due today" />}
            {task.priority === "Urgent" && !completed && (
              <Indicator color="red" label="Urgent" />
            )}
            {completed && <Indicator color="emerald" label="Completed" />}
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-career-slate">{task.description}</p>
          )}

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-career-slate">
            {job && (
              <span>
                <span className="font-medium text-career-navy">
                  {job.company || "—"}
                </span>
                {job.title ? ` · ${job.title}` : ""}
              </span>
            )}
            <span>
              Due:{" "}
              <span className="font-medium text-career-navy">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "No date"}
                {task.due_time ? ` ${task.due_time}` : ""}
              </span>
            </span>
            <span>
              Status: <span className="font-medium text-career-navy">{task.status}</span>
            </span>
            {task.reminder_enabled && task.reminder_date && (
              <span className="text-career-blue">🔔 Reminder set</span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {!completed && (
            <Button size="sm" onClick={onComplete}>
              Complete
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={onStartReschedule}>
            Reschedule
          </Button>
          <Button size="sm" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      {rescheduling && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-career-border bg-career-surface/50 p-3">
          <label className="text-sm font-medium text-career-navy">New due date:</label>
          <input
            type="date"
            value={rescheduleDate}
            onChange={(e) => onRescheduleDate(e.target.value)}
            className="rounded-lg border border-career-border px-3 py-1.5 text-sm"
          />
          <Button size="sm" onClick={onConfirmReschedule}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancelReschedule}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-career-blue">
      {type}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-slate-100 text-slate-700",
    High: "bg-amber-100 text-amber-700",
    Urgent: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[priority] ?? colors.Medium}`}>
      {priority}
    </span>
  );
}

function Indicator({ color, label }: { color: "red" | "amber" | "emerald"; label: string }) {
  const colors = {
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current`} />
      {label}
    </span>
  );
}
