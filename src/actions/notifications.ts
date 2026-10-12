"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import type {
  AppNotification,
  NotificationCategory,
  NotificationPreferences,
  NotificationType,
  RelatedEntityType,
} from "@/lib/types";
import { REQUIRED_CATEGORIES, TOGGLEABLE_CATEGORIES } from "@/lib/types";
import { DEMO_NOTIFICATIONS, DEMO_NOTIFICATION_PREFERENCES } from "@/data/demo-data";

// ---------------------------------------------------------------------------
// Fetch notifications for the current user
// ---------------------------------------------------------------------------
export async function getNotifications(): Promise<AppNotification[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_NOTIFICATIONS;
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []) as AppNotification[];
}

export async function getUnreadCount(): Promise<number> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_NOTIFICATIONS.filter((n) => !n.read_at).length;
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return 0;

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profile.id)
    .is("read_at", null);

  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Mark notifications as read
// ---------------------------------------------------------------------------
export async function markNotificationRead(notificationId: string) {
  if (!hasValidSupabaseConfig()) return;

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return;

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("profile_id", profile.id);
}

export async function markAllNotificationsRead() {
  if (!hasValidSupabaseConfig()) return;

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return;

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("profile_id", profile.id)
    .is("read_at", null);
}

// ---------------------------------------------------------------------------
// Delete a notification
// ---------------------------------------------------------------------------
export async function deleteNotification(notificationId: string) {
  if (!hasValidSupabaseConfig()) return;

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return;

  await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("profile_id", profile.id);
}

// ---------------------------------------------------------------------------
// Notification preferences
// ---------------------------------------------------------------------------
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_NOTIFICATION_PREFERENCES;
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return getDefaultPreferences("");

  const { data } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (data) return data as NotificationPreferences;

  // Create default preferences if none exist
  const defaults = getDefaultPreferences(profile.id);
  await supabase.from("notification_preferences").insert(defaults);
  return defaults;
}

function getDefaultPreferences(profileId: string): NotificationPreferences {
  return {
    profile_id: profileId,
    course_progress: true,
    instructor_messages: true,
    announcements: true,
    assignment_reminders: true,
    certificate_completion: true,
    updated_at: new Date().toISOString(),
  };
}

export async function updateNotificationPreferences(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) return { error: "Not authenticated" };

  const prefs = {
    profile_id: profile.id,
    course_progress: formData.get("course_progress") === "on",
    instructor_messages: formData.get("instructor_messages") === "on",
    announcements: formData.get("announcements") === "on",
    assignment_reminders: formData.get("assignment_reminders") === "on",
    certificate_completion: formData.get("certificate_completion") === "on",
    updated_at: new Date().toISOString(),
  };

  if (!hasValidSupabaseConfig()) {
    return { success: "Notification preferences updated." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notification_preferences")
    .upsert(prefs, { onConflict: "profile_id" });

  if (error) return { error: error.message };
  return { success: "Notification preferences updated." };
}

// ---------------------------------------------------------------------------
// Internal: create a notification (used by other actions)
// ---------------------------------------------------------------------------
export async function createNotification(params: {
  profileId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  description: string;
  relatedType?: RelatedEntityType | null;
  relatedId?: string | null;
  linkUrl?: string | null;
}): Promise<void> {
  if (!hasValidSupabaseConfig()) return;

  const supabase = await createClient();

  // Check user's preferences — skip if category is disabled
  if (!REQUIRED_CATEGORIES.includes(params.category)) {
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("profile_id", params.profileId)
      .maybeSingle();

    if (prefs && prefs[params.category] === false) return;
  }

  await supabase.from("notifications").insert({
    profile_id: params.profileId,
    type: params.type,
    category: params.category,
    title: params.title,
    description: params.description,
    related_type: params.relatedType ?? null,
    related_id: params.relatedId ?? null,
    link_url: params.linkUrl ?? null,
    read_at: null,
  });
}

// ---------------------------------------------------------------------------
// Admin reporting: notification delivery stats
// ---------------------------------------------------------------------------
export async function getNotificationStats() {
  if (!hasValidSupabaseConfig()) {
    const total = DEMO_NOTIFICATIONS.length;
    const unread = DEMO_NOTIFICATIONS.filter((n) => !n.read_at).length;
    const read = total - unread;
    return { total, read, unread, readRate: total > 0 ? Math.round((read / total) * 100) : 0 };
  }

  const supabase = await createClient();

  const { count: total } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true });

  const { count: unread } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .is("read_at", null);

  const t = total ?? 0;
  const u = unread ?? 0;
  return { total: t, read: t - u, unread: u, readRate: t > 0 ? Math.round(((t - u) / t) * 100) : 0 };
}
