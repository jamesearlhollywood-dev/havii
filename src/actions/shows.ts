"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ShowStatus } from "@/lib/podcast-types";

export type ShowActionState = {
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

export async function saveShowAction(
  _prev: ShowActionState,
  formData: FormData
): Promise<ShowActionState> {
  const id = String(formData.get("id") || "");
  const showName = String(formData.get("show_name") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const hostName = String(formData.get("host_name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const status = String(formData.get("status") || "draft") as ShowStatus;
  const shortDescription = String(formData.get("short_description") || "").trim();
  const fullDescription = String(formData.get("full_description") || "").trim();
  const coverImage = String(formData.get("cover_image") || "").trim();
  const actionType = String(formData.get("action_type") || "save");

  if (!showName) return { error: "Show name is required." };
  if (!hostName) return { error: "Host name is required." };

  const slug = slugify(slugRaw || showName);
  if (!slug) return { error: "Could not generate a valid slug." };

  // "publish" action forces status to active
  const finalStatus: ShowStatus = actionType === "publish" ? "active" : status;

  try {
    const supabase = await createClient();

    const payload = {
      show_name: showName,
      slug,
      short_description: shortDescription || null,
      full_description: fullDescription || null,
      cover_image: coverImage || null,
      host_name: hostName,
      category: category || null,
      status: finalStatus,
      spotify_url: cleanUrl(String(formData.get("spotify_url") || "")),
      apple_podcast_url: cleanUrl(String(formData.get("apple_podcast_url") || "")),
      youtube_url: cleanUrl(String(formData.get("youtube_url") || "")),
      rss_feed_url: cleanUrl(String(formData.get("rss_feed_url") || "")),
      website_url: cleanUrl(String(formData.get("website_url") || "")),
    };

    if (id) {
      const { error } = await supabase.from("shows").update(payload).eq("id", id);
      if (error) {
        if (error.code === "23505") return { error: "A show with that slug already exists." };
        return { error: error.message };
      }
      revalidatePath("/admin/shows");
      revalidatePath(`/shows/${slug}`);
      revalidatePath("/shows");
      revalidatePath("/admin");
      redirect(`/admin/shows`);
    } else {
      const { error } = await supabase.from("shows").insert(payload);
      if (error) {
        if (error.code === "23505") return { error: "A show with that slug already exists." };
        return { error: error.message };
      }
      revalidatePath("/admin/shows");
      revalidatePath(`/shows/${slug}`);
      revalidatePath("/shows");
      revalidatePath("/admin");
      redirect("/admin/shows");
    }
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e; // Next.js redirect
    const message = e instanceof Error ? e.message : "Failed to save show.";
    if (message.includes("Missing") || message.includes("invalid")) {
      return {
        error:
          "Supabase is not configured. Add credentials to connect the database.",
      };
    }
    return { error: message };
  }
}

export async function deleteShowAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;
  try {
    const supabase = await createClient();
    await supabase.from("shows").delete().eq("id", id);
    revalidatePath("/admin/shows");
    revalidatePath("/shows");
    revalidatePath("/admin");
    redirect("/admin/shows");
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
  }
}
