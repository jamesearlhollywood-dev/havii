import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { MentorApplicationForm } from "@/components/mentorship/MentorApplicationForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { MentorProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mentor Application" };

export default async function MentorApplicationPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/dashboard/mentor/application");
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");
  if (profile.role !== "mentor") redirect("/dashboard");

  const supabase = await createClient();
  const { data: mentorProfile } = await supabase
    .from("mentor_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const appStatus = mentorProfile?.application_status ?? "application_not_started";
  const statusLabels: Record<string, string> = {
    application_not_started: "Not started",
    pending_application: "In progress",
    submitted: "Submitted — under review",
    under_review: "Under review",
    approved: "Approved",
    declined: "Declined",
    withdrawn: "Withdrawn",
  };

  return (
    <AppShell profile={profile}>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-havii-ink">Mentor Application</h1>
          <p className="mt-1 text-sm text-havii-muted">
            Submitting an application does not grant access to youth information.
          </p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            appStatus === "approved" ? "bg-green-100 text-green-700" :
            appStatus === "declined" ? "bg-red-100 text-red-700" :
            appStatus === "submitted" || appStatus === "under_review" ? "bg-amber-100 text-amber-700" :
            "bg-havii-sand text-havii-muted"
          }`}>
            {statusLabels[appStatus] || appStatus}
          </span>
        </div>

        {appStatus === "approved" && (
          <Alert tone="success">
            <strong>Your application is approved!</strong> Staff can now match you with youth.
            Visit{" "}
            <Link href="/dashboard/mentor/mentees" className="underline">My Mentees</Link>{" "}
            to see your assignments.
          </Alert>
        )}

        {appStatus === "declined" && (
          <Alert tone="error">
            Your application was declined. Please contact staff for more information.
          </Alert>
        )}

        {(appStatus === "submitted" || appStatus === "under_review") && (
          <Alert tone="info">
            Your application is being reviewed by staff. You can update your details below.
          </Alert>
        )}

        <MentorApplicationForm mentor={mentorProfile as MentorProfile | null} />
      </div>
    </AppShell>
  );
}
