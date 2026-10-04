// Task reminder scheduling — kept separate from task storage.
//
// The career_tasks table stores only task data + reminder *metadata*
// (reminder_enabled, reminder_date, reminder_time). This module reads that
// metadata and dispatches notifications through the provider-agnostic
// notification layer (in-app always; email/push no-op until connected).
//
// Duplicate reminders are avoided by checking the notifications table for an
// existing reminder tied to the task (related_id = task id) — no reminder
// tracking column lives in the task table, keeping scheduling decoupled from
// storage.
//
// processDueTaskReminders() is ready to be called by a scheduled Base44 backend
// job, exactly like runAllDueAlerts() for job alerts.

import type { SupabaseClient } from "@supabase/supabase-js";
import { dispatchNotification } from "./notifications";
import type { NotificationType, TaskType } from "./types";

interface TaskReminderRow {
  id: string;
  user_id: string;
  title: string;
  task_type: TaskType;
  reminder_date: string;
  reminder_time: string | null;
  due_date: string | null;
  related_job_application_id: string | null;
}

/** Map a task type to the notification channel type it surfaces as. */
function taskTypeToNotificationType(taskType: TaskType): NotificationType {
  switch (taskType) {
    case "Interview":
      return "interview_upcoming";
    case "Offer":
    case "Negotiation":
      return "offer_reminder";
    case "Follow-Up":
      return "follow_up";
    default:
      return "task_reminder";
  }
}

/**
 * Load tasks whose reminder is due and not yet sent, and dispatch a
 * notification for each. Returns how many reminders were dispatched.
 */
export async function processDueTaskReminders(
  supabase: SupabaseClient
): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);

  // Active tasks with a due reminder (reminder_date <= today)
  const { data: tasks, error } = await supabase
    .from("career_tasks")
    .select("id, user_id, title, task_type, reminder_date, reminder_time, due_date, related_job_application_id")
    .eq("reminder_enabled", true)
    .eq("status", "To Do")
    .lte("reminder_date", today);
  if (error || !tasks) return 0;

  let dispatched = 0;
  for (const task of tasks as TaskReminderRow[]) {
    // Skip if a reminder notification already exists for this task
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", task.user_id)
      .eq("related_id", task.id)
      .in("type", [
        "follow_up",
        "interview_upcoming",
        "offer_reminder",
        "task_reminder",
      ]);
    if ((count ?? 0) > 0) continue;

    const type = taskTypeToNotificationType(task.task_type);
    const when = task.due_date
      ? new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "soon";

    const link = task.related_job_application_id
      ? `/app/jobs/${task.related_job_application_id}`
      : "/app/tasks";

    const { inAppId } = await dispatchNotification(supabase, {
      userId: task.user_id,
      type,
      title: `Reminder: ${task.title}`,
      body: `Due ${when}.`,
      link,
      relatedId: task.id,
    });
    if (inAppId) dispatched++;
  }
  return dispatched;
}
