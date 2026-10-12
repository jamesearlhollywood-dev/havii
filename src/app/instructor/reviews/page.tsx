import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { canAccessInstructorRoutes } from "@/lib/roles";
import { ReviewQueue } from "@/components/review/ReviewQueue";
import { InstructorWorkloadCard } from "@/components/review/InstructorWorkloadCard";
import {
  getInstructorReviewQueue,
  getReviewSettings,
  getInstructorWorkload,
} from "@/actions/reviews";
import {
  DEMO_INSTRUCTOR_PROFILE,
  DEMO_COHORTS,
} from "@/data/demo-data";
import type { Profile, ReviewQueueItem, InstructorWorkloadMetrics } from "@/lib/types";
import { fetchNotificationData } from "@/lib/notification-helpers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review Queue" };

export default async function InstructorReviewsPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let queueItems: ReviewQueueItem[];
  let settings: { review_target_days: number; highlight_overdue: boolean };
  let workload: InstructorWorkloadMetrics[];
  let cohorts: { id: string; name: string }[];

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/instructor/reviews");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessInstructorRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;

    queueItems = await getInstructorReviewQueue({}, "oldest_first");
    settings = await getReviewSettings();
    workload = await getInstructorWorkload();
    cohorts = DEMO_COHORTS.map((c) => ({ id: c.id, name: c.name }));
  } else {
    profile = DEMO_INSTRUCTOR_PROFILE;
    queueItems = await getInstructorReviewQueue({}, "oldest_first");
    settings = await getReviewSettings();
    workload = await getInstructorWorkload();
    cohorts = DEMO_COHORTS.map((c) => ({ id: c.id, name: c.name }));
  }

  const overdueCount = queueItems.filter((i) => i.is_overdue).length;
  const { notifications, unreadCount } = await fetchNotificationData();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-rise-navy">Review Queue</h1>
        <p className="mb-6 text-rise-muted">
          Target: Review submissions within {settings.review_target_days} business days.
          {overdueCount > 0 && (
            <span className="ml-2 font-semibold text-rise-red">{overdueCount} overdue</span>
          )}
        </p>

        {/* Workload summary */}
        {workload.length > 0 && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <p className="text-sm text-rise-muted">Awaiting Review</p>
              <p className="mt-1 text-2xl font-bold text-rise-navy">{workload[0].submissions_awaiting_review}</p>
            </Card>
            <Card>
              <p className="text-sm text-rise-muted">Reviews Completed</p>
              <p className="mt-1 text-2xl font-bold text-rise-success">{workload[0].reviews_completed}</p>
            </Card>
            <Card>
              <p className="text-sm text-rise-muted">Avg Turnaround</p>
              <p className="mt-1 text-2xl font-bold text-rise-navy">
                {workload[0].avg_review_turnaround_hours < 24
                  ? `${workload[0].avg_review_turnaround_hours}h`
                  : `${(workload[0].avg_review_turnaround_hours / 24).toFixed(1)}d`}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-rise-muted">Revisions Requested</p>
              <p className="mt-1 text-2xl font-bold text-rise-warning">{workload[0].revisions_requested}</p>
            </Card>
            <Card>
              <p className="text-sm text-rise-muted">Overdue</p>
              <p className={`mt-1 text-2xl font-bold ${workload[0].overdue_reviews > 0 ? "text-rise-red" : "text-rise-success"}`}>
                {workload[0].overdue_reviews}
              </p>
            </Card>
          </div>
        )}

        {/* Review queue */}
        <ReviewQueue items={queueItems} cohorts={cohorts} />
      </div>
    </AppShell>
  );
}
