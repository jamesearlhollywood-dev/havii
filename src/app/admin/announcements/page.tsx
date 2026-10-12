import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { fetchNotificationData } from "@/lib/notification-helpers";
import { getAllAnnouncements, getInstructorAnnouncements, deleteAnnouncement } from "@/actions/announcements";
import { AnnouncementForm } from "@/components/announcements/AnnouncementForm";
import { DeleteAnnouncementButton } from "@/components/announcements/DeleteAnnouncementButton";
import {
  DEMO_ADMIN_PROFILE,
  DEMO_INSTRUCTOR_PROFILE,
  DEMO_ORGANIZATIONS,
  DEMO_COHORTS,
  DEMO_ANNOUNCEMENTS,
} from "@/data/demo-data";
import type { Profile, Announcement } from "@/lib/types";
import { canAccessAdminRoutes, canAccessInstructorRoutes } from "@/lib/roles";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Announcements" };

const PRIORITY_STYLES: Record<string, { border: string; bg: string; badge: string; icon: string }> = {
  urgent: { border: "border-rise-red/40", bg: "bg-rise-red/5", badge: "bg-rise-red text-white", icon: "🚨" },
  important: { border: "border-rise-gold/40", bg: "bg-rise-warning-light", badge: "bg-rise-gold text-rise-navy", icon: "⭐" },
  standard: { border: "border-rise-border", bg: "", badge: "bg-rise-sky text-rise-navy", icon: "📢" },
};

const AUDIENCE_LABELS: Record<string, string> = {
  all_users: "All Users",
  organization: "Organization",
  cohort: "Cohort",
  course: "Course",
};

export default async function AdminAnnouncementsPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let announcements: Announcement[];

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/announcements");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role) && !canAccessInstructorRoutes(userProfile.role)) {
      redirect("/forbidden");
    }
    profile = userProfile;

    if (userProfile.role === "instructor") {
      announcements = await getInstructorAnnouncements();
    } else {
      announcements = await getAllAnnouncements();
    }
  } else {
    profile = DEMO_ADMIN_PROFILE;
    announcements = DEMO_ANNOUNCEMENTS;
  }

  const { notifications, unreadCount } = await fetchNotificationData();
  const isInstructor = profile.role === "instructor";

  const organizations = DEMO_ORGANIZATIONS.map((o) => ({ id: o.id, name: o.name }));
  // For instructors, only show their assigned cohorts
  const cohorts = isInstructor
    ? DEMO_COHORTS.filter((c) => c.instructor_profile_id === profile.id).map((c) => ({
        id: c.id,
        name: c.name,
        organization_id: c.organization_id,
      }))
    : DEMO_COHORTS.map((c) => ({ id: c.id, name: c.name, organization_id: c.organization_id }));

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Announcements</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Create announcement */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-rise-navy">Create Announcement</h2>
            <Card>
              <CardTitle>New Announcement</CardTitle>
              <CardDescription className="mb-4">
                {isInstructor
                  ? "Create an announcement for cohorts you are assigned to."
                  : "Create announcements for all users, specific organizations, cohorts, or courses."}
              </CardDescription>
              <AnnouncementForm
                organizations={organizations}
                cohorts={cohorts}
                isInstructor={isInstructor}
              />
            </Card>
          </div>

          {/* Existing announcements */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-rise-navy">
              {isInstructor ? "My Announcements" : "All Announcements"} ({announcements.length})
            </h2>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <Card>
                  <p className="text-center text-rise-muted py-8">No announcements yet.</p>
                </Card>
              ) : (
                announcements.map((ann) => {
                  const style = PRIORITY_STYLES[ann.priority] || PRIORITY_STYLES.standard;
                  const isExpired = ann.expiration_date && new Date(ann.expiration_date) < new Date();
                  const isScheduled = new Date(ann.publish_date) > new Date();

                  return (
                    <Card key={ann.id} className={`${style.border} ${style.bg}`}>
                      <div className="flex items-start gap-3">
                        <span className="text-lg shrink-0">{style.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-rise-navy">{ann.title}</h3>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${style.badge}`}>
                              {ann.priority}
                            </span>
                            {isExpired && (
                              <span className="rounded-full bg-rise-border px-2 py-0.5 text-[10px] font-medium text-rise-muted">
                                Expired
                              </span>
                            )}
                            {isScheduled && (
                              <span className="rounded-full bg-rise-blue-light px-2 py-0.5 text-[10px] font-medium text-rise-navy">
                                Scheduled
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-rise-muted line-clamp-3">{ann.body}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-rise-muted flex-wrap">
                            <span className="rounded-full bg-rise-sky px-2 py-0.5 font-medium text-rise-navy">
                              {AUDIENCE_LABELS[ann.audience_type] || ann.audience_type}
                              {ann.audience_name ? `: ${ann.audience_name}` : ""}
                            </span>
                            <span>By {ann.created_by_name}</span>
                            <span>Published {formatDate(ann.publish_date)}</span>
                            {ann.expiration_date && <span>Expires {formatDate(ann.expiration_date)}</span>}
                            {ann.link_url && <span>· Link: {ann.link_url}</span>}
                          </div>
                        </div>
                      </div>
                      {/* Delete button (only for admins or announcement owner) */}
                      {(profile.role === "admin" || ann.created_by === profile.id) && (
                        <div className="mt-3 border-t border-rise-border pt-2">
                          <DeleteAnnouncementButton announcementId={ann.id} />
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
