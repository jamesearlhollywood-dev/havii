import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { canAccessInstructorRoutes } from "@/lib/roles";
import { ReviewSubmissionDetail } from "@/components/review/ReviewSubmissionDetail";
import { getSubmission, getSubmissionVersions, getRubric } from "@/actions/reviews";
import { DEMO_INSTRUCTOR_PROFILE } from "@/data/demo-data";
import { DEMO_RUBRICS } from "@/data/review-demo-data";
import type { Profile, Submission, SubmissionVersion, Rubric } from "@/lib/types";
import { fetchNotificationData } from "@/lib/notification-helpers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review Submission" };

export default async function ReviewSubmissionPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let submission: Submission | null;
  let versions: SubmissionVersion[];
  let rubric: Rubric | null;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/instructor/reviews");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessInstructorRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;

    submission = await getSubmission(submissionId);
    versions = await getSubmissionVersions(submissionId);
    rubric = submission?.rubric_result
      ? await getRubric(submission.rubric_result.rubric_id)
      : null;
    // Also check activity review config for rubric
    if (!rubric && submission) {
      const configs = await getActivityConfigsForRubric();
      const config = configs.find((c) => c.activity_id === submission.activity_id);
      if (config?.rubric_id) {
        rubric = await getRubric(config.rubric_id);
      }
    }
  } else {
    profile = DEMO_INSTRUCTOR_PROFILE;
    submission = await getSubmission(submissionId);
    versions = await getSubmissionVersions(submissionId);
    // Find rubric from demo data
    if (submission?.rubric_result) {
      rubric = DEMO_RUBRICS.find((r) => r.id === submission.rubric_result!.rubric_id) ?? null;
    }
    if (!rubric && submission) {
      // Check if the activity has a rubric in the demo configs
      const { DEMO_ACTIVITY_REVIEW_CONFIGS } = await import("@/data/review-demo-data");
      const config = DEMO_ACTIVITY_REVIEW_CONFIGS.find((c) => c.activity_id === submission.activity_id);
      if (config?.rubric_id) {
        rubric = DEMO_RUBRICS.find((r) => r.id === config.rubric_id) ?? null;
      }
    }
  }

  const { notifications, unreadCount } = await fetchNotificationData();

  if (!submission) {
    return (
      <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Card>
            <p className="text-rise-muted">Submission not found.</p>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ReviewSubmissionDetail
          submission={submission}
          versions={versions}
          rubric={rubric}
        />
      </div>
    </AppShell>
  );
}

async function getActivityConfigsForRubric() {
  const { getActivityReviewConfigs } = await import("@/actions/reviews");
  return await getActivityReviewConfigs();
}
