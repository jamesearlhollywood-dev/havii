import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { canAccessStaffRoutes } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { StaffMatchingClient } from "@/components/mentorship/StaffMatchingClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Staff Matching" };

export default async function StaffMatchesPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login");
  if (!canAccessStaffRoutes(profile.role)) redirect("/forbidden");

  const supabase = await createClient();

  // Get pending mentor requests with youth profile info
  const { data: requests } = await supabase
    .from("mentor_requests")
    .select(`
      id, interests, help_areas, availability_notes, status, created_at,
      youth_profile:youth_profiles!mentor_requests_youth_profile_id_fkey(
        id,
        profile:profiles!youth_profiles_profile_id_fkey(id, first_name, preferred_name, city, state)
      )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // Get approved mentors
  const { data: mentors } = await supabase
    .from("mentor_profiles")
    .select(`
      id, profession, mentoring_interests, support_areas,
      profile:profiles!mentor_profiles_profile_id_fkey(first_name, preferred_name)
    `)
    .eq("application_status", "approved")
    .order("approved_at", { ascending: false });

  // Get all matches with youth and mentor info
  const { data: matches } = await supabase
    .from("mentor_matches")
    .select(`
      id, status, notes, matched_by, status_changed_by, status_changed_at, created_at,
      youth_profile:youth_profiles!mentor_matches_youth_profile_id_fkey(
        profile:profiles!youth_profiles_profile_id_fkey(first_name, preferred_name)
      ),
      mentor_profile:mentor_profiles!mentor_matches_mentor_profile_id_fkey(
        profession,
        profile:profiles!mentor_profiles_profile_id_fkey(first_name, preferred_name)
      )
    `)
    .in("status", ["active", "paused", "proposed"])
    .order("created_at", { ascending: false });

  return (
    <AppShell profile={profile}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-havii-ink">Matching</h1>
          <p className="mt-1 text-sm text-havii-muted">
            Review requests and assign mentors to youth.
          </p>
        </div>
        <StaffMatchingClient
          requests={(requests as any[]) ?? []}
          mentors={(mentors as any[]) ?? []}
          matches={(matches as any[]) ?? []}
        />
      </div>
    </AppShell>
  );
}
