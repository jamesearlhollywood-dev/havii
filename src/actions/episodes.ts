"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EpisodeStatus } from "@/lib/podcast-types";

export type EpisodeActionState = {
  error?: string;
  success?: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanUrl(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (/^https?:\/\//.test(v)) return v;
  return `https://${v}`;
}

function toNullIfEmpty(value: string): string | null {
  const v = value.trim();
  return v || null;
}

function toIntOrNull(value: string): number | null {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function toIsoOrNull(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  // datetime-local gives "2026-10-03T19:30" — append seconds + tz
  return new Date(v).toISOString();
}

export async function saveEpisodeAction(
  _prev: EpisodeActionState,
  formData: FormData
): Promise<EpisodeActionState> {
  const id = String(formData.get("id") || "");
  const showId = String(formData.get("show_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const shortDescription = String(formData.get("short_description") || "").trim();
  const fullDescription = String(formData.get("full_description") || "").trim();
  const actionType = String(formData.get("action_type") || "save");
  const statusRaw = String(formData.get("episode_status") || "planned");
  const episodeStatus = statusRaw as EpisodeStatus;

  if (!showId) return { error: "A podcast show is required." };
  if (!title) return { error: "Episode title is required." };

  const slug = slugify(slugRaw || title);
  if (!slug) return { error: "Could not generate a valid slug." };

  // Publishing requires minimum content
  if (actionType === "publish") {
    if (!shortDescription && !fullDescription) {
      return { error: "A description is required before publishing." };
    }
  }

  const finalStatus: EpisodeStatus = actionType === "publish" ? "published" : episodeStatus;

  try {
    const supabase = await createClient();

    const payload = {
      show_id: showId,
      episode_number: toIntOrNull(String(formData.get("episode_number") || "")),
      season_number: toIntOrNull(String(formData.get("season_number") || "")),
      title,
      slug,
      short_description: toNullIfEmpty(shortDescription),
      full_description: toNullIfEmpty(fullDescription),
      cover_image: toNullIfEmpty(String(formData.get("cover_image") || "")),
      audio_url: toNullIfEmpty(String(formData.get("audio_url") || "")),
      video_url: cleanUrl(String(formData.get("video_url") || "")),
      transcript: toNullIfEmpty(String(formData.get("transcript") || "")),
      show_notes: toNullIfEmpty(String(formData.get("show_notes") || "")),
      guest_id: toNullIfEmpty(String(formData.get("guest_id") || "")),
      episode_status: finalStatus,
      recording_date: toIsoOrNull(String(formData.get("recording_date") || "")),
      publish_date: toIsoOrNull(String(formData.get("publish_date") || "")),
      duration: toNullIfEmpty(String(formData.get("duration") || "")),
      featured: formData.get("featured") === "on",
    };

    if (id) {
      const { error } = await supabase.from("episodes").update(payload).eq("id", id);
      if (error) {
        if (error.code === "23505") return { error: "An episode with that slug already exists for this show." };
        return { error: error.message };
      }
      revalidatePath("/admin/episodes");
      revalidatePath("/episodes");
      revalidatePath("/shows");
      revalidatePath("/");
      redirect("/admin/episodes");
    } else {
      const { error } = await supabase.from("episodes").insert(payload);
      if (error) {
        if (error.code === "23505") return { error: "An episode with that slug already exists for this show." };
        return { error: error.message };
      }
      revalidatePath("/admin/episodes");
      revalidatePath("/episodes");
      revalidatePath("/shows");
      revalidatePath("/");
      redirect("/admin/episodes");
    }
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e; // Next.js redirect
    const message = e instanceof Error ? e.message : "Failed to save episode.";
    if (message.includes("Missing") || message.includes("invalid")) {
      return {
        error: "Supabase is not configured. Add credentials to connect the database.",
      };
    }
    return { error: message };
  }
}

export async function deleteEpisodeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;
  try {
    const supabase = await createClient();
    await supabase.from("episodes").delete().eq("id", id);
    revalidatePath("/admin/episodes");
    revalidatePath("/episodes");
    revalidatePath("/shows");
    revalidatePath("/");
    redirect("/admin/episodes");
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
  }
}
