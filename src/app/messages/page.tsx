import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { fetchNotificationData } from "@/lib/notification-helpers";
import { getMessages, markMessageRead } from "@/actions/messages";
import { MessageComposer } from "@/components/messages/MessageComposer";
import { ReportMessageButton } from "@/components/messages/ReportMessageButton";
import {
  DEMO_STUDENT_PROFILE,
  DEMO_INSTRUCTOR_PROFILE,
  DEMO_ADMIN_PROFILE,
  DEMO_ORG_MANAGER_PROFILE,
  DEMO_COHORTS,
  DEMO_COHORT_STUDENTS,
  DEMO_MESSAGES,
} from "@/data/demo-data";
import type { Profile, Message, Cohort } from "@/lib/types";
import { fullName, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages" };

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function MessagesPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let messages: Message[];

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/messages");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    profile = userProfile;
    messages = await getMessages();
  } else {
    profile = DEMO_STUDENT_PROFILE;
    messages = DEMO_MESSAGES;
  }

  const { notifications, unreadCount } = await fetchNotificationData();

  // Build recipient list based on role
  let recipients: { id: string; name: string; role: string }[] = [];
  let cohorts: (Cohort & { organization_name?: string })[] = [];

  if (profile.role === "student") {
    // Students can message their assigned instructor
    recipients = [{ id: "demo-instructor", name: "Ms. Garcia", role: "Instructor" }];
    cohorts = [];
  } else if (profile.role === "instructor") {
    // Instructors can message students in their assigned cohorts
    recipients = DEMO_COHORT_STUDENTS.map((s) => ({
      id: s.profile_id,
      name: s.student_name,
      role: "Student",
    }));
    cohorts = DEMO_COHORTS as any;
  } else if (profile.role === "org_manager") {
    // Org managers can message users in their organization
    recipients = [
      { id: "demo-instructor", name: "Ms. Garcia", role: "Instructor" },
      ...DEMO_COHORT_STUDENTS.map((s) => ({ id: s.profile_id, name: s.student_name, role: "Student" })),
    ];
    cohorts = DEMO_COHORTS as any;
  } else if (profile.role === "admin") {
    // Admins can message anyone
    recipients = [
      { id: "demo-instructor", name: "Ms. Garcia", role: "Instructor" },
      { id: "demo-org-manager", name: "James Wilson", role: "Org Manager" },
      ...DEMO_COHORT_STUDENTS.map((s) => ({ id: s.profile_id, name: s.student_name, role: "Student" })),
    ];
    cohorts = DEMO_COHORTS as any;
  }

  // Sort messages: unread first, then by date
  const sortedMessages = [...messages].sort((a, b) => {
    if (!a.read_at && b.read_at) return -1;
    if (a.read_at && !b.read_at) return 1;
    return new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime();
  });

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Messages</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Message list */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-rise-navy">
              Inbox {messages.length > 0 && `(${messages.length})`}
            </h2>
            <div className="space-y-3">
              {sortedMessages.length === 0 ? (
                <Card>
                  <p className="text-center text-rise-muted py-8">No messages yet.</p>
                </Card>
              ) : (
                sortedMessages.map((msg) => {
                  const isFromMe = msg.sender_id === profile.id;
                  const isUnread = !msg.read_at && !isFromMe;
                  return (
                    <Card
                      key={msg.id}
                      className={isUnread ? "border-rise-blue bg-rise-blue-light/20" : ""}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm ${isUnread ? "font-bold" : "font-semibold"} text-rise-navy`}>
                              {msg.subject}
                            </p>
                            {msg.is_cohort_broadcast && (
                              <span className="rounded-full bg-rise-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase text-rise-warning">
                                Broadcast
                              </span>
                            )}
                            {isUnread && (
                              <span className="h-2 w-2 rounded-full bg-rise-blue" />
                            )}
                          </div>
                          <p className="mt-1 text-xs text-rise-muted">
                            From <span className="font-medium text-rise-navy">{msg.sender_name}</span>
                            {!isFromMe && msg.recipient_name && (
                              <> → To <span className="font-medium text-rise-navy">{msg.recipient_name}</span></>
                            )}
                          </p>
                          <p className="mt-2 text-sm text-rise-muted line-clamp-3">{msg.body}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-rise-muted">
                            <span>{formatDateTime(msg.sent_at)}</span>
                            {msg.read_at && <span>· Read {formatDateTime(msg.read_at)}</span>}
                            {msg.reported && <span className="text-rise-red">· Reported</span>}
                          </div>
                        </div>
                      </div>
                      {!isFromMe && !msg.is_cohort_broadcast && (
                        <div className="mt-2 border-t border-rise-border pt-2">
                          {!msg.read_at && (
                            <form action={async () => { "use server"; await markMessageRead(msg.id); }} className="inline">
                              <button type="submit" className="text-xs font-medium text-rise-blue-dark hover:underline">
                                Mark as read
                              </button>
                            </form>
                          )}
                          {!msg.reported && <span className="ml-3"><ReportMessageButton messageId={msg.id} /></span>}
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Compose message */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-rise-navy">Send a Message</h2>
            <Card>
              <CardTitle>New Message</CardTitle>
              <CardDescription className="mb-4">
                {profile.role === "student" && "Send a message to your assigned instructor."}
                {profile.role === "instructor" && "Message individual students or broadcast to your cohort."}
                {profile.role === "org_manager" && "Communicate with authorized users in your organization."}
                {profile.role === "admin" && "Send messages to any user in the system."}
              </CardDescription>
              <MessageComposer profile={profile} recipients={recipients} cohorts={cohorts} />
            </Card>

            <Card className="mt-4 bg-rise-sky/30">
              <p className="text-xs text-rise-muted">
                <strong className="text-rise-navy">Note:</strong> RISE USA does not support unrestricted student-to-student private messaging. Messages are limited to authorized educational communication within your role and assignments.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
