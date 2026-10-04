"use client";

import { useState, useTransition } from "react";
import { createTaskAction, updateTaskAction } from "@/actions/career-tasks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  TASK_TYPES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type CareerTask,
  type CareerTaskInput,
  type TaskType,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/career/types";

export interface JobLookup {
  id: string;
  title: string | null;
  company: string | null;
}

export function TaskModal({
  open,
  onClose,
  task,
  jobs,
  presetJobId,
}: {
  open: boolean;
  onClose: () => void;
  task: CareerTask | null;
  jobs: JobLookup[];
  presetJobId?: string | null;
}) {
  const isEdit = !!task;
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [taskType, setTaskType] = useState<TaskType>(task?.task_type ?? "General");
  const [jobId, setJobId] = useState(task?.related_job_application_id ?? presetJobId ?? "");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");
  const [dueTime, setDueTime] = useState(task?.due_time ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "Medium");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "To Do");
  const [reminderEnabled, setReminderEnabled] = useState(task?.reminder_enabled ?? false);
  const [reminderDate, setReminderDate] = useState(task?.reminder_date ?? "");
  const [reminderTime, setReminderTime] = useState(task?.reminder_time ?? "09:00");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  const jobOptions = [
    { value: "", label: "None" },
    ...jobs.map((j) => ({
      value: j.id,
      label: `${j.title || "Untitled"}${j.company ? ` · ${j.company}` : ""}`,
    })),
  ];

  function handleClose() {
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    setError("");
    const input: CareerTaskInput = {
      title: title.trim(),
      description: description.trim() || null,
      task_type: taskType,
      related_job_application_id: jobId || null,
      due_date: dueDate || null,
      due_time: dueTime || null,
      priority,
      status,
      reminder_enabled: reminderEnabled,
      reminder_date: reminderEnabled ? reminderDate || dueDate || null : null,
      reminder_time: reminderEnabled ? reminderTime || null : null,
    };
    startTransition(async () => {
      const res = isEdit
        ? await updateTaskAction(task!.id, input)
        : await createTaskAction(input);
      if (res.error) setError(res.error);
      else handleClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-career-navy/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
          <h2 className="text-lg font-semibold text-career-navy">
            {isEdit ? "Edit Task" : "Add Task"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-career-slate hover:bg-career-surface"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <Input
            label="Title"
            placeholder="e.g. Send thank-you email after interview"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <Textarea
            label="Description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Task type"
              options={TASK_TYPES.map((t) => ({ value: t, label: t }))}
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as TaskType)}
            />
            <Select
              label="Priority"
              options={TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            />
            <Select
              label="Related job"
              options={jobOptions}
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            />
            <Select
              label="Status"
              options={TASK_STATUSES.map((s) => ({ value: s, label: s }))}
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            />
            <Input
              label="Due date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Input
              label="Due time"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-career-border p-3">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-career-navy">
                Enable reminder
              </span>
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-career-border text-career-blue focus:ring-career-blue"
              />
            </label>
            {reminderEnabled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Reminder date"
                  type="date"
                  value={reminderDate || dueDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
                <Input
                  label="Reminder time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            )}
            <p className="text-xs text-career-slate">
              Reminders appear as in-app notifications when due. Email and push
              activate once a provider is connected.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
