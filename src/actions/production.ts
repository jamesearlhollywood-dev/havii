"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  EpisodeStatus,
  ProductionTaskStatus,
} from "@/lib/podcast-types";

export type TaskActionState = {
  error?: string;
  success?: string;
};

const VALID_TASK_STATUSES: ProductionTaskStatus[] = [
  "not_started",
  "in_progress",
  "waiting",
  "completed",
  "cancelled",
  "blocked",
];

const VALID_EPISODE_STAGES: EpisodeStatus[] = [
  "planned",
  "idea",
  "guest_outreach",
  "scheduling",
  "scheduled",
  "recording",
  "recorded",
  "editing",
  "review",
  "ready_for_review",
  "published",
  "archived",
];

function toNullIfEmpty(value: string): string | null {
  const v = value.trim();
  return v || null;
}

function toDateOrNull(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  return new Date(v).toISOString().slice(0, 10);
}

/** Create or update a production task. */
export async function saveProductionTaskAction(
  _prev: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const id = String(formData.get("id") || "");
  const episodeId = String(formData.get("episode_id") || "").trim();
  const taskName = String(formData.get("task_name") || "").trim();

  if (!episodeId) return { error: "An episode is required." };
  if (!taskName) return { error: "Task name is required." };

  const statusRaw = String(formData.get("status") || "not_started");
  if (!VALID_TASK_STATUSES.includes(statusRaw as ProductionTaskStatus)) {
    return { error: "Invalid task status." };
  }

  try {
    const supabase = await createClient();

    const payload = {
      episode_id: episodeId,
      task_name: taskName,
      assigned_to: toNullIfEmpty(String(formData.get("assigned_to") || "")),
      status: statusRaw as ProductionTaskStatus,
      due_date: toDateOrNull(String(formData.get("due_date") || "")),
      notes: toNullIfEmpty(String(formData.get("notes") || "")),
    };

    if (id) {
      const { error } = await supabase
        .from("production_tasks")
        .update(payload)
        .eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("production_tasks").insert(payload);
      if (error) return { error: error.message };
    }

    revalidatePath("/admin/production");
    revalidatePath(`/admin/episodes/${episodeId}`);
    return { success: "Task saved." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save task.";
    if (message.includes("Missing") || message.includes("invalid")) {
      return { error: "Supabase is not configured." };
    }
    return { error: message };
  }
}

/** Quick status flip for a single task (used by the checklist + board). */
export async function updateTaskStatusAction(
  _prev: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const episodeId = String(formData.get("episode_id") || "");
  if (!id) return { error: "Task id is required." };
  if (!VALID_TASK_STATUSES.includes(status as ProductionTaskStatus)) {
    return { error: "Invalid task status." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("production_tasks")
      .update({ status: status as ProductionTaskStatus })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/production");
    if (episodeId) revalidatePath(`/admin/episodes/${episodeId}`);
    return { success: "Status updated." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update task.";
    if (message.includes("Missing") || message.includes("invalid")) {
      return { error: "Supabase is not configured." };
    }
    return { error: message };
  }
}

export async function deleteProductionTaskAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const episodeId = String(formData.get("episode_id") || "");
  if (!id) return;
  try {
    const supabase = await createClient();
    await supabase.from("production_tasks").delete().eq("id", id);
    revalidatePath("/admin/production");
    if (episodeId) revalidatePath(`/admin/episodes/${episodeId}`);
  } catch {
    // no-op
  }
}

/**
 * Plain form action variant of the stage mover (used directly as a
 * `<form action>` from the production board's stage dropdown).
 */
export async function moveEpisodeStageAction(formData: FormData): Promise<void> {
  await updateEpisodeStageAction({}, formData);
}

/** Move an episode to a different production stage (production board). */
export async function updateEpisodeStageAction(
  _prev: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const id = String(formData.get("id") || "");
  const stage = String(formData.get("episode_status") || "");
  if (!id) return { error: "Episode id is required." };
  if (!VALID_EPISODE_STAGES.includes(stage as EpisodeStatus)) {
    return { error: "Invalid production stage." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("episodes")
      .update({ episode_status: stage as EpisodeStatus })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/production");
    revalidatePath("/admin/episodes");
    revalidatePath(`/admin/episodes/${id}`);
    revalidatePath("/episodes");
    revalidatePath("/");
    return { success: "Stage updated." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update stage.";
    if (message.includes("Missing") || message.includes("invalid")) {
      return { error: "Supabase is not configured." };
    }
    return { error: message };
  }
}
