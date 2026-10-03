"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { GuestBookingStatus } from "@/lib/podcast-types";

export type GuestActionState = {
  error?: string;
  success?: string;
};

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

const VALID_BOOKING_STATUSES: GuestBookingStatus[] = [
  "prospect",
  "invited",
  "interested",
  "scheduling",
  "confirmed",
  "recorded",
  "published",
  "declined",
  "archived",
  "tentative",
];

export async function saveGuestAction(
  _prev: GuestActionState,
  formData: FormData
): Promise<GuestActionState> {
  const id = String(formData.get("id") || "");
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const bookingStatusRaw = String(formData.get("booking_status") || "prospect");

  if (!firstName) return { error: "First name is required." };

  if (!VALID_BOOKING_STATUSES.includes(bookingStatusRaw as GuestBookingStatus)) {
    return { error: "Invalid booking status." };
  }
  const bookingStatus = bookingStatusRaw as GuestBookingStatus;

  // Email format validation when provided (email remains optional).
  const email = String(formData.get("email") || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Email format is invalid." };
  }

  try {
    const supabase = await createClient();

    const payload = {
      first_name: firstName,
      last_name: toNullIfEmpty(lastName),
      professional_title: toNullIfEmpty(String(formData.get("professional_title") || "")),
      organization: toNullIfEmpty(String(formData.get("organization") || "")),
      biography: toNullIfEmpty(String(formData.get("biography") || "")),
      headshot: cleanUrl(String(formData.get("headshot") || "")),
      email: toNullIfEmpty(email),
      phone: toNullIfEmpty(String(formData.get("phone") || "")),
      website: cleanUrl(String(formData.get("website") || "")),
      linkedin_url: cleanUrl(String(formData.get("linkedin_url") || "")),
      instagram_url: cleanUrl(String(formData.get("instagram_url") || "")),
      facebook_url: cleanUrl(String(formData.get("facebook_url") || "")),
      booking_status: bookingStatus,
      notes: toNullIfEmpty(String(formData.get("notes") || "")),
    };

    if (id) {
      const { error } = await supabase.from("guests").update(payload).eq("id", id);
      if (error) return { error: error.message };
      revalidatePath("/admin/guests");
      revalidatePath(`/admin/guests/${id}`);
      revalidatePath("/guests");
      revalidatePath(`/guests/${id}`);
      redirect(`/admin/guests/${id}`);
    } else {
      const { data, error } = await supabase
        .from("guests")
        .insert(payload)
        .select("id")
        .single();
      if (error) return { error: error.message };
      revalidatePath("/admin/guests");
      revalidatePath("/guests");
      redirect(`/admin/guests/${data.id}`);
    }
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e; // Next.js redirect
    const message = e instanceof Error ? e.message : "Failed to save guest.";
    if (message.includes("Missing") || message.includes("invalid")) {
      return {
        error:
          "Supabase is not configured. Add credentials to connect the database.",
      };
    }
    return { error: message };
  }
}

export async function deleteGuestAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;
  try {
    const supabase = await createClient();
    await supabase.from("guests").delete().eq("id", id);
    revalidatePath("/admin/guests");
    revalidatePath("/guests");
    redirect("/admin/guests");
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
  }
}

/**
 * Lightweight booking-status update used from the guest profile actions.
 * Accepts a plain formData with `id` + `booking_status`.
 */
export async function updateGuestBookingStatusAction(
  _prev: GuestActionState,
  formData: FormData
): Promise<GuestActionState> {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("booking_status") || "");
  if (!id) return { error: "Guest id is required." };
  if (!VALID_BOOKING_STATUSES.includes(status as GuestBookingStatus)) {
    return { error: "Invalid booking status." };
  }
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("guests")
      .update({ booking_status: status as GuestBookingStatus })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/guests");
    revalidatePath(`/admin/guests/${id}`);
    return { success: "Booking status updated." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update status.";
    if (message.includes("Missing") || message.includes("invalid")) {
      return { error: "Supabase is not configured." };
    }
    return { error: message };
  }
}

/**
 * Append an internal note to a guest (used from the profile page).
 * The new note is prepended to the existing notes text.
 */
export async function addGuestNoteAction(
  _prev: GuestActionState,
  formData: FormData
): Promise<GuestActionState> {
  const id = String(formData.get("id") || "");
  const note = String(formData.get("note") || "").trim();
  if (!id) return { error: "Guest id is required." };
  if (!note) return { error: "Note cannot be empty." };

  try {
    const supabase = await createClient();
    const { data: guest } = await supabase
      .from("guests")
      .select("notes")
      .eq("id", id)
      .maybeSingle();
    const existing = (guest as { notes: string | null } | null)?.notes ?? "";
    const stamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const updated = existing
      ? `[${stamp}] ${note}\n\n${existing}`
      : `[${stamp}] ${note}`;
    const { error } = await supabase
      .from("guests")
      .update({ notes: updated })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath(`/admin/guests/${id}`);
    return { success: "Note added." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add note.";
    if (message.includes("Missing") || message.includes("invalid")) {
      return { error: "Supabase is not configured." };
    }
    return { error: message };
  }
}
