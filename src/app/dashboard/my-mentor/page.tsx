import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { HELP_AREA_LABELS } from "@/lib/types";
import type { Profile, MentorProfile, MentorSession } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Mentor" };

export default async function MyMentorPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/my-mentor");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();

  // Get youth profile
  const { data: youthProfile } = await supabase
    .from("youth_profiles")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  // Get active match
  const { data: match } = await supabase
    .from("mentor_matches")
    .select("*")
    .eq("youth_profile_id", youthProfile?.id ?? "")
    .in("status", ["proposed", "active", "paused"])
    .maybeSingle();

  if (!match) {
    // Check for pending request
    const { data: pendingRequest } = await supabase
      .from("mentor_requests")
      .select("status, created_at")
      .eq("youth_profile_id", youthProfile?.id ?? "")
      .eq("status", "pending")
      .maybeSingle();

    return (
      <AppShell profile={profile as Profile}>
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-havii-ink">My Mentor</h1>
          </div>
          {pendingRequest ? (
            <Card className="border-havii-teal/30 bg-gradient-to-br from-white to-havii-teal/5">
              <CardTitle className="text-base">Waiting for a match</CardTitle>
              <CardDescription className="mt-2">
                Your mentor request is being reviewed. Our staff carefully match each youth with the right mentor.
                We&apos;ll let you know as soon as a mentor is assigned.
              </CardDescription>
              <div className="mt-4 flex items-center gap-2 text-sm text-havii-muted">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-havii-teal"></span>
                <span>Request submitted — pending review</span>
              </div>
            </Card>
          ) : (
            <Card>
              <CardTitle className="text-base">No mentor yet</CardTitle>
              <CardDescription className="mt-2">
                Ready to find a mentor? Tell us your interests and we&apos;ll match you with someone who can help.
              </CardDescription>
              <div className="mt-4">
                <Link href="/dashboard/find-a-mentor">
                  <Button size="sm">Find a Mentor</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </AppShell>
    );
  }

  // Get mentor details
  const { data: mentorProfile } = await supabase
    .from("mentor_profiles")
    .select("*")
    .eq("id", match.mentor_profile_id)
    .maybeSingle();

  const { data: mentorBaseProfile } = await supabase
    .from("profiles")
    .select("first_name, last_name, preferred_name, pronouns")
    .eq("id", mentorProfile?.profile_id)
    .maybeSingle();

  // Get upcoming sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("mentor_match_id", match.id)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(5);

  const mentorName = mentorBaseProfile?.preferred_name || mentorBaseProfile?.first_name || "Your mentor";
  const statusLabels: Record<string, string> = {
    proposed: "Proposed",
    active: "Active",
    paused: "Paused",
    ended: "Ended",
    declined: "Declined",
  };

  return (
    <AppShell profile={profile as Profile}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-havii-ink">My Mentor</h1>
          <p className="mt-1 text-sm text-havii-muted">Your mentorship connection.</p>
        </div>

        {/* Mentor card */}
        <Card className="border-havii-teal/30 bg-gradient-to-br from-white to-havii-teal/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{mentorName}</CardTitle>
              {mentorBaseProfile?.pronouns && (
                <p className="text-sm text-havii-muted">{mentorBaseProfile.pronouns}</p>
              )}
            </div>
            <span className="inline-flex rounded-full bg-havii-teal/10 px-3 py-1 text-xs font-medium text-havii-teal-dark">
              {statusLabels[match.status] || match.status}
            </span>
          </div>

          {mentorProfile?.profession && (
            <p className="mt-3 text-sm text-havii-ink">
              <span className="font-medium">Profession:</span> {mentorProfile.profession}
            </p>
          )}
          {mentorProfile?.background_summary && (
            <p className="mt-2 text-sm text-havii-muted">{mentorProfile.background_summary}</p>
          )}
          {mentorProfile?.mentoring_interests && mentorProfile.mentoring_interests.length > 0 && (
            <p className="mt-3 text-sm text-havii-ink">
              <span className="font-medium">Interests:</span>{" "}
              {mentorProfile.mentoring_interests.join(", ")}
            </p>
          )}
          {mentorProfile?.support_areas && mentorProfile.support_areas.length > 0 && (
            <p className="mt-2 text-sm text-havii-ink">
              <span className="font-medium">Can help with:</span>{" "}
              {mentorProfile.support_areas.map((a: string) => HELP_AREA_LABELS[a as keyof typeof HELP_AREA_LABELS] || a).join(", ")}
            </p>
          )}
          {mentorProfile?.availability_notes && (
            <p className="mt-2 text-sm text-havii-ink">
              <span className="font-medium">Availability:</span> {mentorProfile.availability_notes}
            </p>
          )}
        </Card>

        {/* Next session */}
        <Card>
          <CardTitle className="text-base mb-3">Next Meeting</CardTitle>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {(sessions as MentorSession[]).map((s) => (
                <div key={s.id} className="rounded-xl border border-havii-mist bg-havii-sand/30 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-havii-ink">{s.title}</p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      s.status === "confirmed" ? "bg-green-100 text-green-700" :
                      s.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  {s.starts_at && (
                    <p className="mt-1 text-sm text-havii-muted">
                      {new Date(s.starts_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      {" at "}
                      {new Date(s.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {s.timezone ? ` (${s.timezone})` : ""}
                    </p>
                  )}
                  {s.location && <p className="text-sm text-havii-muted">📍 {s.location}</p>}
                  {s.notes && <p className="mt-1 text-sm text-havii-muted">{s.notes}</p>}
                </div>
              ))}
              <Link href="/dashboard/sessions">
                <Button variant="outline" size="sm">View all sessions</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-havii-muted">No sessions scheduled yet.</p>
              <Link href="/dashboard/sessions">
                <Button size="sm" variant="outline">Request a session</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Help with match */}
        {match.status === "active" && (
          <Card className="border-havii-coral/20">
            <CardTitle className="text-base">Need help with your match?</CardTitle>
            <CardDescription className="mt-2">
              If something isn&apos;t working with your mentor match, you can reach out to staff for support.
            </CardDescription>
            <div className="mt-4">
              <Link href="/help">
                <Button size="sm" variant="outline">Request help</Button>
              </Link>
            </div>
          </Card>
        )}

        {match.status === "paused" && (
          <Alert tone="warning">
            Your mentor match is currently paused. Staff are aware and will help resolve this.
          </Alert>
        )}
      </div>
    </AppShell>
  );
}
