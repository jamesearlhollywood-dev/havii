import { redirect } from "next/navigation";
import {
  displayName,
  getCurrentUserAndProfile,
  getRoleExtension,
} from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import {
  AdminDashboard,
  CaregiverDashboard,
  MentorDashboard,
  PartnerDashboard,
  StaffDashboard,
  YouthDashboard,
} from "@/components/dashboards/DashboardCards";
import type {
  MentorProfile,
  PartnerProfile,
  YouthProfile,
} from "@/lib/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card>
          <CardTitle>Supabase not configured</CardTitle>
          <CardDescription className="mt-2">
            Configure .env.local to use live dashboards. See README.
          </CardDescription>
        </Card>
      </div>
    );
  }

  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  const ext = await getRoleExtension(profile);

  let body: React.ReactNode;
  switch (profile.role) {
    case "youth":
      body = (
        <YouthDashboard
          profile={profile}
          youth={(ext as { youth?: YouthProfile | null }).youth ?? null}
        />
      );
      break;
    case "mentor":
      body = (
        <MentorDashboard
          profile={profile}
          mentor={(ext as { mentor?: MentorProfile | null }).mentor ?? null}
        />
      );
      break;
    case "caregiver":
      body = <CaregiverDashboard profile={profile} />;
      break;
    case "community_partner":
      body = (
        <PartnerDashboard
          profile={profile}
          partner={(ext as { partner?: PartnerProfile | null }).partner ?? null}
        />
      );
      break;
    case "staff":
      body = <StaffDashboard profile={profile} />;
      break;
    case "administrator":
      body = <AdminDashboard profile={profile} />;
      break;
    default:
      body = (
        <Card>
          <CardTitle>Unknown role</CardTitle>
          <CardDescription>
            Contact support. Display name: {displayName(profile)}
          </CardDescription>
        </Card>
      );
  }

  return <AppShell profile={profile}>{body}</AppShell>;
}
