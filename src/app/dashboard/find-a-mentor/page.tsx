import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { MentorRequestForm } from "@/components/mentorship/MentorRequestForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { HELP_AREA_LABELS } from "@/lib/types";
import type { YouthProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Find a Mentor" };

export default async function FindAMentorPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/find-a-mentor");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();

  // Get youth profile
  const { data: youthProfile } = await supabase
    .from("youth_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  // Check for existing mentor request
  const { data: existingRequest } = await supabase
    .from("mentor_requests")
    .select("*")
    .eq("youth_profile_id", youthProfile?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Check if already matched
  const { data: activeMatch } = await supabase
    .from("mentor_matches")
    .select("id, status")
    .eq("youth_profile_id", youthProfile?.id ?? "")
    .in("status", ["proposed", "active", "paused"])
    .maybeSingle();

  const content = (() => {
    if (activeMatch) {
      return (
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-havii-ink">Find a Mentor</h1>
            <p className="mt-1 text-sm text-havii-muted">You already have a mentor match.</p>
          </div>
          <Alert tone="success">
            <strong>You&apos;re matched!</strong> Visit{" "}
            <a href="/dashboard/my-mentor" className="underline">My Mentor</a>{" "}
            to see your mentor&apos;s details and next session.
          </Alert>
        </div>
      );
    }

    if (existingRequest && existingRequest.status === "pending") {
      return (
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-havii-ink">Find a Mentor</h1>
            <p className="mt-1 text-sm text-havii-muted">Your request is being reviewed.</p>
          </div>
          <Card>
            <CardTitle>Request pending</CardTitle>
            <CardDescription className="mt-2">
              You submitted a mentor request. Our staff will review it and match you with a suitable mentor.
            </CardDescription>
            {existingRequest.interests && existingRequest.interests.length > 0 && (
              <p className="mt-3 text-sm text-havii-muted">
                <span className="font-medium text-havii-ink">Interests:</span>{" "}
                {existingRequest.interests.join(", ")}
              </p>
            )}
            {existingRequest.help_areas && existingRequest.help_areas.length > 0 && (
              <p className="mt-2 text-sm text-havii-muted">
                <span className="font-medium text-havii-ink">Support areas:</span>{" "}
                {existingRequest.help_areas.map((a: string) => HELP_AREA_LABELS[a as keyof typeof HELP_AREA_LABELS] || a).join(", ")}
              </p>
            )}
          </Card>
          <Card>
            <CardTitle>Update your request</CardTitle>
            <CardDescription className="mt-2">
              You can update your interests and availability below.
            </CardDescription>
          </Card>
          <MentorRequestForm
            existingInterests={existingRequest.interests ?? []}
            existingHelpAreas={existingRequest.help_areas ?? []}
            existingAvailability={existingRequest.availability_notes ?? ""}
          />
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-havii-ink">Find a Mentor</h1>
          <p className="mt-1 text-sm text-havii-muted">
            Tell us about yourself and we&apos;ll match you with a mentor.
          </p>
        </div>
        <MentorRequestForm
          existingInterests={(youthProfile as YouthProfile | null)?.interests ?? []}
          existingHelpAreas={(youthProfile as YouthProfile | null)?.help_areas ?? []}
          existingAvailability={(youthProfile as YouthProfile | null)?.availability_notes ?? ""}
        />
      </div>
    );
  })();

  return <AppShell profile={profile}>{content}</AppShell>;
}
