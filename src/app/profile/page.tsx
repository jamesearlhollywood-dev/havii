import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DEMO_STUDENT_PROFILE } from "@/data/demo-data";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabaseConnected = hasValidSupabaseConfig();
  let profile: Profile;

  if (supabaseConnected) {
    const { user, profile: userProfile } = await getCurrentUserAndProfile();
    if (!user) redirect("/auth/login?next=/profile");
    if (!userProfile) redirect("/onboarding");
    if (!userProfile.onboarding_completed) redirect("/onboarding");
    profile = userProfile;
  } else {
    profile = DEMO_STUDENT_PROFILE;
  }

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-rise-navy">My Profile</h1>
        <Card>
          <CardTitle>Account Information</CardTitle>
          <CardDescription className="mb-6">
            Update your personal details. These are visible to your instructor and organization.
          </CardDescription>
          <ProfileForm profile={profile} />
        </Card>
      </div>
    </AppShell>
  );
}
