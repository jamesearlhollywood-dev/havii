import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { canAccessStaffRoutes } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { ApplicationReviewCard } from "@/components/mentorship/ApplicationReviewCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type { MentorProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mentor Applications" };

export default async function StaffApplicationsPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login");
  if (!canAccessStaffRoutes(profile.role)) redirect("/forbidden");

  const supabase = await createClient();

  // Get all mentor profiles with submitted/pending/under_review status
  const { data: pendingMentors } = await supabase
    .from("mentor_profiles")
    .select(`
      *,
      profile:profiles!mentor_profiles_profile_id_fkey(first_name, preferred_name, city, state)
    `)
    .in("application_status", ["submitted", "under_review"])
    .order("application_submitted_at", { ascending: false });

  // Get approved mentors
  const { data: approvedMentors } = await supabase
    .from("mentor_profiles")
    .select(`
      *,
      profile:profiles!mentor_profiles_profile_id_fkey(first_name, preferred_name, city, state)
    `)
    .eq("application_status", "approved")
    .order("approved_at", { ascending: false });

  // Get declined mentors
  const { data: declinedMentors } = await supabase
    .from("mentor_profiles")
    .select(`
      *,
      profile:profiles!mentor_profiles_profile_id_fkey(first_name, preferred_name, city, state)
    `)
    .eq("application_status", "declined")
    .order("updated_at", { ascending: false });

  return (
    <AppShell profile={profile}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-havii-ink">Mentor Applications</h1>
          <p className="mt-1 text-sm text-havii-muted">Review and approve mentor applications.</p>
        </div>

        {/* Pending */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-havii-ink">
            Pending Review ({pendingMentors?.length ?? 0})
          </h2>
          {pendingMentors && pendingMentors.length > 0 ? (
            pendingMentors.map((m) => (
              <ApplicationReviewCard key={m.id} mentor={m as MentorProfile & { profile?: { first_name: string | null; preferred_name: string | null; city: string | null; state: string | null } }}} />
            ))
          ) : (
            <Card><CardDescription>No pending applications.</CardDescription></Card>
          )}
        </div>

        {/* Approved */}
        {approvedMentors && approvedMentors.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-havii-ink">
              Approved ({approvedMentors.length})
            </h2>
            {approvedMentors.map((m) => (
              <ApplicationReviewCard key={m.id} mentor={m as MentorProfile & { profile?: { first_name: string | null; preferred_name: string | null; city: string | null; state: string | null } }}} />
            ))}
          </div>
        )}

        {/* Declined */}
        {declinedMentors && declinedMentors.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-havii-ink">
              Declined ({declinedMentors.length})
            </h2>
            {declinedMentors.map((m) => (
              <ApplicationReviewCard key={m.id} mentor={m as MentorProfile & { profile?: { first_name: string | null; preferred_name: string | null; city: string | null; state: string | null } }}} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
