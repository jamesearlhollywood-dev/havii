"use server";

// Career tasks — server actions for CRUD + follow-up reminder creation.
// Task storage lives in the career_tasks table; reminder *scheduling* is
// handled separately in src/lib/career/task-reminders.ts.

import { createClient } from "@/lib/supabase/server";
import "@/lib/ai/openai-provider"; // side-effect: registers AI provider if key set
import type {
  CareerTask,
  CareerTaskInput,
  TaskType,
  TaskPriority,
  TaskStatus,
} from "@/lib/career/types";
import type { CareerTaskActionState } from "@/actions/types";

interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  task_type: TaskType;
  related_job_application_id: string | null;
  due_date: string | null;
  due_time: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  reminder_enabled: boolean;
  reminder_date: string | null;
  reminder_time: string | null;
  completed_at: string | null;
  created_at: string;
}

function rowToTask(row: TaskRow): CareerTask {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    task_type: row.task_type,
    related_job_application_id: row.related_job_application_id,
    due_date: row.due_date,
    due_time: row.due_time,
    priority: row.priority,
    status: row.status,
    reminder_enabled: row.reminder_enabled,
    reminder_date: row.reminder_date,
    reminder_time: row.reminder_time,
    completed_at: row.completed_at,
    created_date: row.created_at,
  };
}

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// ---------------------------------------------------------------------------
// List all tasks for the signed-in user
// ---------------------------------------------------------------------------

export async function listTasksAction(): Promise<{
  error?: string;
  tasks: CareerTask[];
}> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", tasks: [] };
  }
  if (!userId) return { error: "Not authenticated.", tasks: [] };

  const { data, error } = await supabase
    .from("career_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) return { error: "Could not load tasks.", tasks: [] };
  return { tasks: (data as TaskRow[]).map(rowToTask) };
}

// ---------------------------------------------------------------------------
// Dashboard: today's active tasks + upcoming deadlines
// ---------------------------------------------------------------------------

export async function getDashboardTasksAction(): Promise<{
  today: CareerTask[];
  upcoming: CareerTask[];
}> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { today: [], upcoming: [] };
  }
  if (!userId) return { today: [], upcoming: [] };

  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("career_tasks")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["To Do", "In Progress"])
    .order("due_date", { ascending: true, nullsFirst: false });

  const tasks = (data as TaskRow[] | null)?.map(rowToTask) ?? [];

  const todayTasks = tasks
    .filter((t) => t.due_date === today)
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter((t) => t.due_date && t.due_date > today)
    .slice(0, 5);

  return { today: todayTasks, upcoming: upcomingTasks };
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createTaskAction(
  input: CareerTaskInput
): Promise<CareerTaskActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase.from("career_tasks").insert({
      user_id: user.id,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      task_type: input.task_type,
      related_job_application_id: input.related_job_application_id || null,
      due_date: input.due_date || null,
      due_time: input.due_time || null,
      priority: input.priority,
      status: input.status,
      reminder_enabled: input.reminder_enabled,
      reminder_date: input.reminder_date || null,
      reminder_time: input.reminder_time || null,
    });
    if (error) return { error: "Could not create the task." };
    return { success: "Task created." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not create the task." };
  }
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateTaskAction(
  id: string,
  input: CareerTaskInput
): Promise<CareerTaskActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("career_tasks")
      .update({
        title: input.title.trim(),
        description: input.description?.trim() || null,
        task_type: input.task_type,
        related_job_application_id: input.related_job_application_id || null,
        due_date: input.due_date || null,
        due_time: input.due_time || null,
        priority: input.priority,
        status: input.status,
        reminder_enabled: input.reminder_enabled,
        reminder_date: input.reminder_date || null,
        reminder_time: input.reminder_time || null,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not update the task." };
    return { success: "Task updated." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not update the task." };
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteTaskAction(id: string): Promise<CareerTaskActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("career_tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not delete the task." };
    return { success: "Task deleted." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not delete the task." };
  }
}

// ---------------------------------------------------------------------------
// Mark complete / toggle status
// ---------------------------------------------------------------------------

export async function completeTaskAction(id: string): Promise<CareerTaskActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("career_tasks")
      .update({ status: "Completed", completed_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not complete the task." };
    return { success: "Task completed." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not complete the task." };
  }
}

// ---------------------------------------------------------------------------
// Reschedule
// ---------------------------------------------------------------------------

export async function rescheduleTaskAction(
  id: string,
  dueDate: string,
  dueTime: string | null
): Promise<CareerTaskActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const update: Record<string, unknown> = { due_date: dueDate };
    if (dueTime) update.due_time = dueTime;
    // If a reminder was enabled with no explicit reminder date, keep it in sync
    update.reminder_date = dueDate;

    const { error } = await supabase
      .from("career_tasks")
      .update(update)
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not reschedule the task." };
    return { success: "Task rescheduled." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not reschedule the task." };
  }
}

// ---------------------------------------------------------------------------
// Add Follow-Up Reminder from a JobApplication
// Creates a Follow-Up CareerTask linked to the job, due in N days (or custom date).
// ---------------------------------------------------------------------------

export async function addFollowUpReminderAction(
  jobId: string,
  when: { days?: number; date?: string }
): Promise<CareerTaskActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    // Load the job application for context
    const { data: job } = await supabase
      .from("job_applications")
      .select("id, title, company, user_id")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!job) return { error: "Job not found." };

    let dueDate: string;
    if (when.date) {
      dueDate = when.date;
    } else {
      const days = when.days ?? 5;
      const d = new Date();
      d.setDate(d.getDate() + days);
      dueDate = d.toISOString().slice(0, 10);
    }

    const title = `Follow up with ${job.company || "employer"}${
      job.title ? ` — ${job.title}` : ""
    }`;

    const { error } = await supabase.from("career_tasks").insert({
      user_id: user.id,
      title,
      description: `Follow-up reminder for ${job.company || "this application"}${
        job.title ? ` (${job.title})` : ""
      }.`,
      task_type: "Follow-Up",
      related_job_application_id: jobId,
      due_date: dueDate,
      due_time: "09:00",
      priority: "Medium",
      status: "To Do",
      reminder_enabled: true,
      reminder_date: dueDate,
      reminder_time: "09:00",
    });
    if (error) return { error: "Could not create the follow-up reminder." };
    return { success: `Follow-up reminder set for ${new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.` };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not create the follow-up reminder." };
  }
}

/**
 * Create a task linked to a job application for a supported reminder type
 * (interview prep, interview date, offer response deadline, networking
 * follow-up, resume update). Used by the JobDetail quick actions.
 */
export async function createJobLinkedTaskAction(args: {
  jobId: string;
  taskType: TaskType;
  title: string;
  description?: string;
  dueDate: string;
  priority?: TaskPriority;
}): Promise<CareerTaskActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { data: job } = await supabase
      .from("job_applications")
      .select("id, title, company, user_id")
      .eq("id", args.jobId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!job) return { error: "Job not found." };

    const { error } = await supabase.from("career_tasks").insert({
      user_id: user.id,
      title: args.title,
      description: args.description ?? null,
      task_type: args.taskType,
      related_job_application_id: args.jobId,
      due_date: args.dueDate,
      priority: args.priority ?? "Medium",
      status: "To Do",
      reminder_enabled: true,
      reminder_date: args.dueDate,
      reminder_time: "09:00",
    });
    if (error) return { error: "Could not create the task." };
    return { success: "Task created." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not create the task." };
  }
}
