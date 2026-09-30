import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { HELP_AREA_LABELS } from "@/lib/types";
import type { Profile, MentorSession } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Mentees" };

export default async function MentorMenteesPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/mentor/mentees");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");
  if (profile.role !== "mentor") redirect("/dashboard");

  const supabase = await createClient();

  // Get mentor profile
  const { data: mentorProfile } = await supabase
    .from("mentor_profiles")
    .select("id, application_status")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!mentorProfile || mentorProfile.application_status !== "approved") {
    return (
      <AppShell profile={profile as Profile}>
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-havii-ink">My Mentees</h1>
          </div>
          <Card>
            <CardTitle>Application not approved</CardTitle>
            <CardDescription className="mt-2">
              You can see your mentees after your application is approved by staff.
            </CardDescription>
            <div className="mt-4">
              <Link href="/dashboard/mentor/application">
                <Button size="sm" variant="outline">View application</Button>
              </Link>
            </div>
          </Card>
        </div>
      </AppShell>
    );
  }

  // Get active matches
  const { data: matches } = await supabase
    .from("mentor_matches")
    .select("*")
    .eq("mentor_profile_id", mentorProfile.id)
    .in("status", ["active", "paused"])
    .order("created_at", { ascending: false });

  const matchList = matches ?? [];

  if (matchList.length === 0) {
    return (
      <AppShell profile={profile as Profile}>
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-havii-ink">My Mentees</h1>
          </div>
          <Card>
            <CardTitle>No mentees yet</CardTitle>
            <CardDescription className="mt-2">
              You don&apos;t have any assigned mentees. Staff will match you with youth based on their needs and your expertise.
            </CardDescription>
          </Card>
        </div>
      </AppShell>
    );
  }

  // For each match, get youth profile info (NOT journals, NOT check-ins)
  const mentees = await Promise.all(
    matchList.map(async (match) => {
      const { data: youthProfile } = await supabase
        .from("youth_profiles")
        .select("*")
        .eq("id", match.youth_profile_id)
        .maybeSingle();

      const { data: youthBase } = await supabase
        .from("profiles")
        .select("first_name, last_name, preferred_name, pronouns, city, state")
        .eq("id", youthProfile?.profile_id)
        .maybeSingle();

      // Get upcoming sessions for this match
      const { data: sessions } = await supabase
        .from("sessions")
        .select("*")
        .eq("mentor_match_id", match.id)
        .gte("starts_at", new Date().toISOString())
        .neq("status", "cancelled")
        .order("starts_at", { ascending: true })
        .limit(3);

      return {
        match,
        youthProfile,
        youthBase,
        sessions: (sessions as MentorSession[]) ?? [],
      };
    })
  );

  return (
    <AppShell profile={profile as Profile}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-havii-ink">My Mentees</h1>
          <p className="mt-1 text-sm text-havii-muted">
            {mentees.length} active {mentees.length === 1 ? "mentee" : "mentees"}
          </p>
        </div>

        {/* Privacy reminder */}
        <Alert tone="info">
          <strong>Privacy:</strong> You can see your mentees&apos; interests, goals, and session info.
          Their journals and mood check-ins remain private.
        </Alert>

        {mentees.map(({ match, youthProfile, youthBase, sessions }) => {
          const name = youthBase?.preferred_name || youthBase?.first_name || "Mentee";
          const statusLabels: Record<string, string> = {
            active: "Active",
            paused: "Paused",
            proposed: "Proposed",
          };
          return (
            <Card key={match.id} className={match.status === "paused" ? "border-amber-200" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  {youthBase?.pronouns && <p className="text-sm text-havii-muted">{youthBase.pronouns}</p>}
                  {youthBase?.city && youthBase?.state && (
                    <p className="text-xs text-havii-muted">{youthBase.city}, {youthBase.state}</p>
                  )}
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  match.status === "active" ? "bg-green-100 text-green-700" :
                  match.status === "paused" ? "bg-amber-100 text-amber-700" :
                  "bg-havii-sand text-havii-muted"
                }`}>
                  {statusLabels[match.status] || match.status}
                </span>
              </div>

              {youthProfile?.interests && youthProfile.interests.length > 0 && (
                <p className="mt-3 text-sm text-havii-ink">
                  <span className="font-medium">Interests:</span> {youthProfile.interests.join(", ")}
                </p>
              )}
              {youthProfile?.help_areas && youthProfile.help_areas.length > 0 && (
                <p className="mt-2 text-sm text-havii-ink">
                  <span className="font-medium">Needs help with:</span>{" "}
                  {youthProfile.help_areas.map((a: string) => HELP_AREA_LABELS[a as keyof typeof HELP_AREA_LABELS] || a).join(", ")}
                </p>
              )}
              {youthProfile?.school_or_program && (
                <p className="mt-2 text-sm text-havii-muted">School: {youthProfile.school_or_program}</p>
              )}
              {youthProfile?.availability_notes && (
                <p className="mt-2 text-sm text-havii-muted">Availability: {youthProfile.availability_notes}</p>
              )}

              {/* Sessions */}
              {sessions.length > 0 && (
                <div className="mt-4 border-t border-havii-mist pt-3">
                  <p className="text-xs font-medium text-havii-ink mb-2">Upcoming sessions</p>
                  {sessions.map((s) => (
                    <div key={s.id} className="text-sm text-havii-muted">
                      {new Date(s.starts_at!).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {" at "}
                      {new Date(s.starts_at!).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {s.timezone ? ` (${s.timezone})` : ""} — {s.title}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Link href={`/dashboard/sessions?match=${match.id}`}>
                  <Button size="sm" variant="outline">Schedule session</Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
