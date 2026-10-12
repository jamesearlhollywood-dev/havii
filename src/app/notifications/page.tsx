import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { fetchNotificationData } from "@/lib/notification-helpers";
import { getNotificationPreferences } from "@/actions/notifications";
import { NotificationPreferencesForm } from "@/components/notifications/NotificationPreferencesForm";
import { DEMO_STUDENT_PROFILE, DEMO_NOTIFICATION_PREFERENCES } from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications" };

const NOTIFICATION_ICONS: Record<string, string> = {
  enrollment_confirmed: "✅",
  course_available: "📚",
  module_unlocked: "🔓",
  lab_due: "🔬",
  knowledge_check_available: "📝",
  knowledge_check_passed: "🎉",
  knowledge_check_retry: "🔄",
  instructor_feedback: "💬",
  blueprint_section_completed: "📋",
  final_assessment_unlocked: "🎯",
  course_completed: "🏆",
  certificate_issued: "🎓",
  progress_reminder: "📈",
  inactivity_reminder: "💪",
  announcement: "📢",
  admin_message: "📨",
  instructor_message: "✉️",
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function NotificationsPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/notifications");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    profile = userProfile;
  } else {
    profile = DEMO_STUDENT_PROFILE;
  }

  const { notifications, unreadCount } = await fetchNotificationData();
  const preferences = await getNotificationPreferences();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rise-navy">Notifications</h1>
            <p className="mt-1 text-rise-muted">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <form action="/api/notifications/mark-all-read" method="POST">
              <button
                type="submit"
                className="rounded-xl border border-rise-border bg-white px-4 py-2 text-sm font-medium text-rise-navy hover:bg-rise-sky"
              >
                Mark all as read
              </button>
            </form>
          )}
        </div>

        {/* Notification list */}
        <div className="mb-8 space-y-3">
          {notifications.length === 0 ? (
            <Card>
              <p className="text-center text-rise-muted py-8">No notifications yet. You&apos;ll see updates here as you progress through the course.</p>
            </Card>
          ) : (
            notifications.map((n) => (
              <Card
                key={n.id}
                className={!n.read_at ? "border-rise-blue bg-rise-blue-light/20" : ""}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{NOTIFICATION_ICONS[n.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm ${!n.read_at ? "font-bold" : "font-semibold"} text-rise-navy`}>
                          {n.title}
                        </p>
                        <p className="mt-1 text-sm text-rise-muted">{n.description}</p>
                      </div>
                      {!n.read_at && (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-rise-blue" />
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-rise-muted">
                      <span>{formatDateTime(n.created_at)}</span>
                      {n.link_url && (
                        <>
                          <span>·</span>
                          <Link href={n.link_url} className="font-medium text-rise-blue-dark hover:underline">
                            View →
                          </Link>
                        </>
                      )}
                      {n.read_at && <span>· Read {formatDateTime(n.read_at)}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Notification Preferences */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-rise-navy">Notification Preferences</h2>
          <Card>
            <CardTitle>Manage Your Notifications</CardTitle>
            <CardDescription className="mb-4">
              Control which nonessential notifications you receive. Account, security, and administrative notices always remain enabled.
            </CardDescription>
            <NotificationPreferencesForm preferences={preferences} />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
