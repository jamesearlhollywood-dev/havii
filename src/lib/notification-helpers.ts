import { getNotifications, getUnreadCount } from "@/actions/notifications";
import type { AppNotification } from "@/lib/types";

/**
 * Fetch notifications and unread count for the current user.
 * Returns demo data when Supabase is not configured.
 * Safe to call from any server component or page.
 */
export async function fetchNotificationData(): Promise<{
  notifications: AppNotification[];
  unreadCount: number;
}> {
  try {
    const [notifications, unreadCount] = await Promise.all([
      getNotifications(),
      getUnreadCount(),
    ]);
    return { notifications, unreadCount };
  } catch {
    return { notifications: [], unreadCount: 0 };
  }
}
