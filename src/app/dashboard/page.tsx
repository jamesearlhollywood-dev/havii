import { redirect } from "next/navigation";
import {
  displayName,
  getCurrentUserAndProfile,
  getRoleExtension,
} from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
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
  EmotionalCheckIn,
  Goal,
  JournalEntry,
  MentorProfile,
  PartnerProfile,
  SessionInfo,
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
  const supabase = await createClient();

  let body: React.ReactNode;
  switch (profile.role) {
    case "youth": {
      const youthProfile = (ext as { youth?: YouthProfile | null }).youth ?? null;

      // Today's mood check-in
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      const [{ data: todayCheckIn }, { data: goals }, { data: journalEntries }, { data: sessions }, { data: mentorMatch }] = await Promise.all([
        supabase
          .from("emotional_checkins")
          .select("*")
          .eq("profile_id", profile.id)
          .gte("created_at", startOfDay)
          .lt("created_at", endOfDay)
          .maybeSingle(),
        supabase
          .from("goals")
          .select("*")
          .eq("profile_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("journal_entries")
          .select("*")
          .eq("profile_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("sessions")
          .select("id, cohort_id, title, starts_at, ends_at, location")
          .gte("starts_at", new Date().toISOString())
          .order("starts_at", { ascending: true })
          .limit(5),
        supabase
          .from("mentor_matches")
          .select("id")
          .eq("youth_profile_id", youthProfile?.id ?? "")
          .maybeSingle(),
      ]);

      body = (
        <YouthDashboard
          profile={profile}
          youth={youthProfile}
          todayCheckIn={(todayCheckIn as EmotionalCheckIn | null) ?? null}
          goals={(goals as Goal[]) ?? []}
          journalEntries={(journalEntries as JournalEntry[]) ?? []}
          sessions={(sessions as SessionInfo[]) ?? []}
          hasMatch={Boolean(mentorMatch)}
        />
      );
      break;
    }
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
