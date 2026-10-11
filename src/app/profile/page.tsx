import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/profile");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

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
