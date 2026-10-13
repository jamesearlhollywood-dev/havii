import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { fetchNotificationData } from "@/lib/notification-helpers";
import { getNotificationStats, getNotifications } from "@/actions/notifications";
import { getAnnouncementStats, getAllAnnouncements } from "@/actions/announcements";
import { getMessageStats, getMessageReports, getMessages } from "@/actions/messages";
import { ResolveReportForm } from "@/components/messages/ResolveReportForm";
import {
  DEMO_ADMIN_PROFILE,
  DEMO_ANNOUNCEMENTS,
  DEMO_MESSAGES,
  DEMO_MESSAGE_REPORTS,
  DEMO_NOTIFICATIONS,
} from "@/data/demo-data";
import type { Profile, Announcement, Message, MessageReport } from "@/lib/types";
import { canAccessAdminRoutes } from "@/lib/roles";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Communications Report" };

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminCommunicationsPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/communications");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  const { notifications, unreadCount } = await fetchNotificationData();

  // Gather stats
  const [notifStats, annStats, msgStats] = await Promise.all([
    getNotificationStats(),
    getAnnouncementStats(),
    getMessageStats(),
  ]);

  const allAnnouncements: Announcement[] = supabaseConnected ? await getAllAnnouncements() : DEMO_ANNOUNCEMENTS;
  const allMessages: Message[] = supabaseConnected ? await getMessages() : DEMO_MESSAGES;
  const messageReports: MessageReport[] = supabaseConnected ? await getMessageReports() : DEMO_MESSAGE_REPORTS;

  // Messages requiring follow-up (unread, reported, or from stalled students)
  const needsFollowUp = allMessages.filter(
    (m) => m.reported || (!m.read_at && m.recipient_id !== null && !m.is_cohort_broadcast)
  );

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Communications Report</h1>

        {/* Overview stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-rise-muted">Total Notifications</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{notifStats.total}</p>
            <p className="mt-0.5 text-xs text-rise-muted">
              {notifStats.read} read · {notifStats.unread} unread · {notifStats.readRate}% read rate
            </p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Announcements</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{annStats.total}</p>
            <p className="mt-0.5 text-xs text-rise-muted">
              {annStats.active} active · {annStats.byPriority.urgent} urgent · {annStats.byPriority.important} important
            </p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Messages</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{msgStats.totalMessages}</p>
            <p className="mt-0.5 text-xs text-rise-muted">
              {msgStats.broadcasts} broadcasts · {msgStats.reported} reported
            </p>
          </Card>
          <Card>
            <p className="text-sm text-rise-muted">Reported Messages</p>
            <p className="mt-1 text-3xl font-bold text-rise-navy">{msgStats.openReports}</p>
            <p className="mt-0.5 text-xs text-rise-muted">open reports awaiting review</p>
          </Card>
        </div>

        {/* Reported Messages */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Reported Messages</h2>
        <div className="mb-6 space-y-3">
          {messageReports.length === 0 ? (
            <Card>
              <p className="text-center text-rise-muted py-6">No reported messages.</p>
            </Card>
          ) : (
            messageReports.map((report) => {
              const reportedMessage = allMessages.find((m) => m.id === report.message_id);
              return (
                <Card key={report.id} className={report.status === "open" ? "border-rise-red/30" : ""}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">
                      {report.status === "open" ? "🚨" : report.status === "resolved" ? "✅" : "👁️"}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-rise-navy">
                          {reportedMessage?.subject || "Unknown message"}
                        </p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          report.status === "open" ? "bg-rise-red text-white"
                          : report.status === "resolved" ? "bg-rise-success text-white"
                          : report.status === "dismissed" ? "bg-rise-border text-rise-muted"
                          : "bg-rise-gold text-rise-navy"
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      {reportedMessage && (
                        <p className="mt-1 text-sm text-rise-muted">
                          From <strong>{reportedMessage.sender_name}</strong>: &ldquo;{reportedMessage.body.slice(0, 100)}{reportedMessage.body.length > 100 ? "..." : ""}&rdquo;
                        </p>
                      )}
                      <p className="mt-1 text-sm text-rise-navy">
                        <strong>Reason:</strong> {report.reason}
                      </p>
                      <p className="mt-1 text-xs text-rise-muted">
                        Reported by {report.reported_by_name} · {formatDateTime(report.created_at)}
                        {report.admin_note && ` · Admin note: ${report.admin_note}`}
                      </p>
                      {report.status === "open" && (
                        <div className="mt-3 border-t border-rise-border pt-3">
                          <ResolveReportForm reportId={report.id} />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Messages requiring follow-up */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Messages Requiring Follow-up</h2>
        <div className="mb-6 space-y-3">
          {needsFollowUp.length === 0 ? (
            <Card>
              <p className="text-center text-rise-muted py-6">No messages need follow-up.</p>
            </Card>
          ) : (
            needsFollowUp.slice(0, 10).map((msg) => (
              <Card key={msg.id} className={msg.reported ? "border-rise-red/30" : ""}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-rise-navy">{msg.subject}</p>
                    <p className="mt-0.5 text-xs text-rise-muted">
                      From {msg.sender_name} → {msg.recipient_name || "Broadcast"}
                    </p>
                    <p className="mt-1 text-sm text-rise-muted line-clamp-2">{msg.body}</p>
                    <p className="mt-1 text-xs text-rise-muted">{formatDateTime(msg.sent_at)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {msg.reported && (
                      <span className="rounded-full bg-rise-red/10 px-2 py-0.5 text-[10px] font-bold uppercase text-rise-red">
                        Reported
                      </span>
                    )}
                    {!msg.read_at && !msg.is_cohort_broadcast && (
                      <span className="rounded-full bg-rise-blue-light px-2 py-0.5 text-[10px] font-bold uppercase text-rise-navy">
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Announcement delivery log */}
        <h2 className="mb-3 text-xl font-bold text-rise-navy">Announcement Log</h2>
        <div className="overflow-x-auto rounded-2xl border border-rise-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rise-navy text-white">
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Priority</th>
                <th className="px-4 py-3 text-left font-medium">Audience</th>
                <th className="px-4 py-3 text-left font-medium">Created By</th>
                <th className="px-4 py-3 text-left font-medium">Published</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {allAnnouncements.map((ann) => {
                const isExpired = ann.expiration_date && new Date(ann.expiration_date) < new Date();
                const isScheduled = new Date(ann.publish_date) > new Date();
                return (
                  <tr key={ann.id} className="border-t border-rise-border">
                    <td className="px-4 py-3 font-medium text-rise-navy">{ann.title}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        ann.priority === "urgent" ? "bg-rise-red text-white"
                        : ann.priority === "important" ? "bg-rise-gold text-rise-navy"
                        : "bg-rise-sky text-rise-navy"
                      }`}>
                        {ann.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-rise-muted">
                      {ann.audience_type === "all_users" ? "All Users" : `${ann.audience_type}: ${ann.audience_name || "—"}`}
                    </td>
                    <td className="px-4 py-3 text-rise-muted">{ann.created_by_name}</td>
                    <td className="px-4 py-3 text-rise-muted">{formatDate(ann.publish_date)}</td>
                    <td className="px-4 py-3">
                      {isExpired ? (
                        <span className="rounded-full bg-rise-border px-2 py-0.5 text-xs text-rise-muted">Expired</span>
                      ) : isScheduled ? (
                        <span className="rounded-full bg-rise-blue-light px-2 py-0.5 text-xs text-rise-navy">Scheduled</span>
                      ) : (
                        <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs text-rise-success">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
