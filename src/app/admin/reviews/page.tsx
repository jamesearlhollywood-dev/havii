import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessAdminRoutes } from "@/lib/roles";
import { AdminReviewOversight } from "@/components/review/AdminReviewOversight";
import { ReviewSettingsForm } from "@/components/review/ReviewSettingsForm";
import {
  getAdminReviewOversight,
  getReviewSettings,
  getInstructorWorkload,
} from "@/actions/reviews";
import { DEMO_ADMIN_PROFILE, DEMO_INSTRUCTOR_PROFILE } from "@/data/demo-data";
import type { Profile, ReviewQueueItem, Submission, InstructorWorkloadMetrics, ReviewSettings } from "@/lib/types";
import { fetchNotificationData } from "@/lib/notification-helpers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review Oversight" };

export default async function AdminReviewsPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let pending: ReviewQueueItem[];
  let unassigned: Submission[];
  let allSubmissions: Submission[];
  let workload: InstructorWorkloadMetrics[];
  let settings: ReviewSettings;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/reviews");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  const oversight = await getAdminReviewOversight();
  pending = oversight.pending;
  unassigned = oversight.unassigned;
  allSubmissions = oversight.allSubmissions;
  workload = await getInstructorWorkload();
  settings = await getReviewSettings();

  const instructors = [{ id: DEMO_INSTRUCTOR_PROFILE.id, name: "Ms. Garcia" }];

  const { notifications, unreadCount } = await fetchNotificationData();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Review Oversight</h1>

        {/* Review settings */}
        <div className="mb-6 max-w-md">
          <ReviewSettingsForm settings={settings} />
        </div>

        {/* Oversight data */}
        <AdminReviewOversight
          pending={pending}
          unassigned={unassigned}
          allSubmissions={allSubmissions}
          workload={workload}
          instructors={instructors}
        />
      </div>
    </AppShell>
  );
}
