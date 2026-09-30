import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { SessionList } from "@/components/mentorship/SessionList";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type { Profile, MentorSession } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sessions" };

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ match?: string }>;
}) {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/sessions");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const params = await searchParams;
  const supabase = await createClient();

  let matchId: string | null = params.match ?? null;

  // If no match specified in URL, find the user's active match
  if (!matchId) {
    if (profile.role === "youth") {
      const { data: youthProfile } = await supabase
        .from("youth_profiles")
        .select("id")
        .eq("profile_id", profile.id)
        .maybeSingle();
      if (youthProfile) {
        const { data: match } = await supabase
          .from("mentor_matches")
          .select("id")
          .eq("youth_profile_id", youthProfile.id)
          .in("status", ["active", "paused"])
          .maybeSingle();
        matchId = match?.id ?? null;
      }
    } else if (profile.role === "mentor") {
      const { data: mentorProfile } = await supabase
        .from("mentor_profiles")
        .select("id")
        .eq("profile_id", profile.id)
        .maybeSingle();
      if (mentorProfile) {
        // Get all active matches for this mentor
        const { data: matches } = await supabase
          .from("mentor_matches")
          .select("id, youth_profile_id")
          .eq("mentor_profile_id", mentorProfile.id)
          .in("status", ["active", "paused"]);
        if (matches && matches.length === 1) {
          matchId = matches[0].id;
        }
        // If multiple matches, show a selection screen
        if (matches && matches.length > 1) {
          return (
            <AppShell profile={profile as Profile}>
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-semibold text-havii-ink">Sessions</h1>
                  <p className="mt-1 text-sm text-havii-muted">Select a mentee to view sessions.</p>
                </div>
                <div className="space-y-3">
                  {matches.map((m) => (
                    <Card key={m.id}>
                      <a href={`/dashboard/sessions?match=${m.id}`} className="block">
                        <CardTitle className="text-base">Match {m.id.slice(0, 8)}…</CardTitle>
                        <CardDescription className="mt-1">Click to view sessions</CardDescription>
                      </a>
                    </Card>
                  ))}
                </div>
              </div>
            </AppShell>
          );
        }
      }
    }
  }

  if (!matchId) {
    return (
      <AppShell profile={profile as Profile}>
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-havii-ink">Sessions</h1>
          </div>
          <Card>
            <CardTitle className="text-base">No active match</CardTitle>
            <CardDescription className="mt-2">
              You need an active mentor match to schedule sessions.
            </CardDescription>
          </Card>
        </div>
      </AppShell>
    );
  }

  // Get sessions for this match
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("mentor_match_id", matchId)
    .order("starts_at", { ascending: false });

  return (
    <AppShell profile={profile as Profile}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-havii-ink">Sessions</h1>
          <p className="mt-1 text-sm text-havii-muted">
            Schedule and manage meetings. Times shown in your local timezone.
          </p>
        </div>
        <SessionList sessions={(sessions as MentorSession[]) ?? []} matchId={matchId} />
      </div>
    </AppShell>
  );
}
