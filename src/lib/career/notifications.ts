// Notification service layer — provider-agnostic dispatch of in-app events.
//
// Channels:
//   - In-app  : always available — writes a row to the `notifications` table.
//   - Email   : no-op unless an email provider is connected (no fake delivery).
//   - Push    : no-op unless a push provider is connected.
//
// Only real, stored events are surfaced. Producers (job alerts, future
// interview/follow-up/offer reminders) call dispatchNotification(); the header
// bell reads from the notifications table — nothing is fabricated.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { NotificationType } from "./types";

export interface DispatchInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
  relatedId?: string | null;
}

export type NotificationChannel = "in_app" | "email" | "push";

export interface NotificationChannelStatus {
  channel: NotificationChannel;
  available: boolean;
  /** Human-readable reason shown in the UI when a channel is unavailable. */
  note: string;
}

export function getNotificationChannelStatuses(): NotificationChannelStatus[] {
  return [
    {
      channel: "in_app",
      available: true,
      note: "Alerts appear inside Career AI.",
    },
    {
      channel: "email",
      available: isEmailConfigured(),
      note: isEmailConfigured()
        ? "Email delivery is connected."
        : "No email provider connected — alerts show in-app only.",
    },
    {
      channel: "push",
      available: isPushConfigured(),
      note: isPushConfigured()
        ? "Push delivery is connected."
        : "No push provider connected — alerts show in-app only.",
    },
  ];
}

function isEmailConfigured(): boolean {
  return Boolean(process.env.EMAIL_PROVIDER && process.env.EMAIL_FROM);
}

function isPushConfigured(): boolean {
  return Boolean(process.env.PUSH_PROVIDER && process.env.PUSH_API_KEY);
}

/**
 * Dispatch a real notification event.
 * In-app is always written. Email/push are sent only when their provider is
 * connected — never faked.
 */
export async function dispatchNotification(
  supabase: SupabaseClient,
  input: DispatchInput
): Promise<{ inAppId: string | null; emailed: boolean; pushed: boolean }> {
  let inAppId: string | null = null;

  // 1. In-app — always
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      link: input.link ?? null,
      related_id: input.relatedId ?? null,
    })
    .select("id")
    .single();
  if (!error && data) inAppId = data.id;

  // 2. Email — only if connected (no fake delivery)
  let emailed = false;
  if (isEmailConfigured()) {
    emailed = await sendEmail(input).catch(() => false);
  }

  // 3. Push — only if connected
  let pushed = false;
  if (isPushConfigured()) {
    pushed = await sendPush(input).catch(() => false);
  }

  return { inAppId, emailed, pushed };
}

// ---------------------------------------------------------------------------
// Channel adapters — stubs that no-op until a provider is connected.
// When a provider is wired (e.g. Resend, SendGrid, FCM), implement the real
// transport here behind the same isXConfigured() guard.
// ---------------------------------------------------------------------------

async function sendEmail(input: DispatchInput): Promise<boolean> {
  // TODO: integrate email provider (e.g. Resend). Returns false until wired.
  void input;
  return false;
}

async function sendPush(input: DispatchInput): Promise<boolean> {
  // TODO: integrate push provider (e.g. FCM). Returns false until wired.
  void input;
  return false;
}

/** Mark a notification as read. */
export async function markNotificationRead(
  supabase: SupabaseClient,
  userId: string,
  notificationId: string
): Promise<void> {
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId);
}

/** Mark all of a user's unread notifications as read. */
export async function markAllNotificationsRead(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
}
