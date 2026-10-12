import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { canAccessAdminRoutes } from "@/lib/roles";
import { RubricManager } from "@/components/review/RubricManager";
import { getRubrics, getActivityReviewConfigs } from "@/actions/reviews";
import { DEMO_ADMIN_PROFILE } from "@/data/demo-data";
import type { Profile, Rubric } from "@/lib/types";
import { fetchNotificationData } from "@/lib/notification-helpers";
import { ActivityReviewConfigManager } from "@/components/review/ActivityReviewConfigManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Rubric Management" };

export default async function AdminRubricsPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/admin/rubrics");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    if (!canAccessAdminRoutes(userProfile.role)) redirect("/forbidden");
    profile = userProfile;
  } else {
    profile = DEMO_ADMIN_PROFILE;
  }

  const rubrics = await getRubrics();
  const configs = await getActivityReviewConfigs();

  const { notifications, unreadCount } = await fetchNotificationData();

  return (
    <AppShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">Rubrics & Review Settings</h1>

        {/* Activity review configuration */}
        <div className="mb-8">
          <ActivityReviewConfigManager configs={configs} rubrics={rubrics} />
        </div>

        {/* Rubric management */}
        <RubricManager rubrics={rubrics} />
      </div>
    </AppShell>
  );
}
