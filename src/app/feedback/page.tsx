import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { StudentFeedbackArea } from "@/components/review/StudentFeedbackArea";
import { getStudentFeedback } from "@/actions/reviews";
import { DEMO_STUDENT_PROFILE } from "@/data/demo-data";
import { getDemoStudentFeedback } from "@/data/review-demo-data";
import type { Profile, StudentFeedbackItem } from "@/lib/types";
import { fetchNotificationData } from "@/lib/notification-helpers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instructor Feedback" };

export default async function StudentFeedbackPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;
  let feedbackItems: StudentFeedbackItem[];

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/feedback");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (userProfile.role !== "student") redirect("/dashboard");
    profile = userProfile;
    feedbackItems = await getStudentFeedback();
  } else {
    profile = DEMO_STUDENT_PROFILE;
    feedbackItems = getDemoStudentFeedback("demo-student");
  }

  const { notifications, unreadCount } = await fetchNotificationData();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Instructor Feedback</h1>

        {feedbackItems.length === 0 ? (
          <Card>
            <p className="text-rise-muted">
              No instructor feedback yet. When you submit activities that require instructor review,
              your instructor&apos;s feedback will appear here.
            </p>
          </Card>
        ) : (
          <StudentFeedbackArea items={feedbackItems} />
        )}
      </div>
    </AppShell>
  );
}
