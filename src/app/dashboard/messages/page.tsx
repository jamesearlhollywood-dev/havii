import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/messages");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();

  // Check if user has an active match (messaging requires an approved match)
  let hasActiveMatch = false;
  let matchApproved = false;

  if (profile.role === "youth") {
    const { data: youthProfile } = await supabase
      .from("youth_profiles")
      .select("id")
      .eq("profile_id", profile.id)
      .maybeSingle();
    if (youthProfile) {
      const { data: match } = await supabase
        .from("mentor_matches")
        .select("id, status")
        .eq("youth_profile_id", youthProfile.id)
        .maybeSingle();
      hasActiveMatch = !!match;
      matchApproved = match?.status === "active";
    }
  } else if (profile.role === "mentor") {
    const { data: mentorProfile } = await supabase
      .from("mentor_profiles")
      .select("id, application_status")
      .eq("profile_id", profile.id)
      .maybeSingle();
    if (mentorProfile?.application_status === "approved") {
      const { data: matches } = await supabase
        .from("mentor_matches")
        .select("id, status")
        .eq("mentor_profile_id", mentorProfile.id)
        .eq("status", "active");
      hasActiveMatch = (matches?.length ?? 0) > 0;
      matchApproved = hasActiveMatch;
    }
  }

  return (
    <AppShell profile={profile}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-havii-ink">Messages</h1>
          <p className="mt-1 text-sm text-havii-muted">
            Communicate with your mentor or mentee.
          </p>
        </div>

        {/* Messaging is not yet enabled */}
        <Alert tone="warning">
          <strong>Messaging is not yet available.</strong>
        </Alert>

        <Card>
          <CardTitle className="text-base">Why is messaging disabled?</CardTitle>
          <CardDescription className="mt-2 space-y-3">
            <span className="block">
              HAVII takes youth safety seriously. Messaging requires all of the following
              safeguards to be in place before it can be enabled:
            </span>
          </CardDescription>

          <ul className="mt-3 space-y-2 text-sm text-havii-muted">
            <li className="flex items-start gap-2">
              <span className={matchApproved ? "text-green-600" : "text-havii-muted"}>
                {matchApproved ? "✓" : "○"}
              </span>
              <span><strong>Approved match required:</strong> Messages can only be sent between an approved mentor-youth match. {matchApproved ? "You have an active match." : "You do not have an active match yet."}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-havii-muted">○</span>
              <span><strong>Consent verification:</strong> Both participants must consent to messaging. This consent is recorded and can be withdrawn at any time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-havii-muted">○</span>
              <span><strong>Reporting:</strong> Any message can be reported for staff review. Reports are tracked and staff must respond within a defined timeframe.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-havii-muted">○</span>
              <span><strong>Staff review access:</strong> Staff can review messages when a report is filed or during safety reviews. Messages are not monitored in real-time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-havii-muted">○</span>
              <span><strong>Content guidelines:</strong> Clear rules about appropriate communication and automatic flagging of concerning content.</span>
            </li>
          </ul>
        </Card>

        <Card>
          <CardTitle className="text-base">Who can review messages?</CardTitle>
          <CardDescription className="mt-2">
            <span className="block">
              <strong>Staff</strong> can review messages when:
            </span>
          </CardDescription>
          <ul className="mt-2 space-y-1 text-sm text-havii-muted">
            <li>• A message is reported by either participant</li>
            <li>• A safety concern is raised</li>
            <li>• During routine safety reviews (with notice)</li>
          </ul>
          <CardDescription className="mt-3">
            Staff respond to reports during business hours. If you need immediate help,
            visit the <a href="/help" className="underline">Support page</a> or call 988.
          </CardDescription>
        </Card>

        <Card className="border-havii-teal/30">
          <CardTitle className="text-base">What you can do now</CardTitle>
          <CardDescription className="mt-2">
            While messaging is being prepared, you can communicate through scheduled sessions.
            Visit the <a href="/dashboard/sessions" className="underline">Sessions page</a> to request a meeting.
          </CardDescription>
        </Card>
      </div>
    </AppShell>
  );
}
