"use server";

// Notifications — server actions for the in-app header notification area.
// Only reads real stored rows from the `notifications` table (no fabrication).

import { createClient } from "@/lib/supabase/server";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/career/notifications";
import type { AppNotification } from "@/lib/career/types";

export async function getNotificationsAction(): Promise<{
  error?: string;
  notifications: AppNotification[];
  unreadCount: number;
}> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", notifications: [], unreadCount: 0 };
  }
  if (!userId) return { error: "Not authenticated.", notifications: [], unreadCount: 0 };

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return { error: "Could not load notifications.", notifications: [], unreadCount: 0 };

  const notifications: AppNotification[] = (data ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    link: n.link,
    related_id: n.related_id,
    read_at: n.read_at,
    created_at: n.created_at,
  }));
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  return { notifications, unreadCount };
}

export async function markNotificationReadAction(
  notificationId: string
): Promise<{ error?: string }> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }
  if (!userId) return { error: "Not authenticated." };
  await markNotificationRead(supabase, userId, notificationId);
  return {};
}

export async function markAllNotificationsReadAction(): Promise<{ error?: string }> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }
  if (!userId) return { error: "Not authenticated." };
  await markAllNotificationsRead(supabase, userId);
  return {};
}
