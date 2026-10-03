import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { getCaregiverLinkForCaregiver, getYouthBasicProfile } from "@/lib/caregiver";
import { CaregiverDashboard } from "@/components/caregiver/CaregiverDashboard";

export default async function CaregiverPage() {
  const { level, profile } = await getAccessLevel();

  if (level === "guest") redirect("/auth/login");
  if (level !== "caregiver") redirect("/app");

  // Get the caregiver link
  const link = await getCaregiverLinkForCaregiver(profile!.user_id);

  if (!link) {
    // No link yet — show waiting message
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">No Active Link</h1>
          <p className="text-sm text-havii-muted">
            You don&apos;t have an active consent link to a youth account yet.
            Please use the invitation link from the youth to review and provide consent.
          </p>
        </div>
      </div>
    );
  }

  // Get the youth's basic profile (no private data)
  const youthProfile = await getYouthBasicProfile(link.youth_user_id);

  if (!youthProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Youth Not Found</h1>
          <p className="text-sm text-havii-muted">
            The linked youth account could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-havii-cream">
      <main className="mx-auto max-w-sm px-6 py-8">
        <CaregiverDashboard
          youthName={youthProfile.preferred_name}
          consentStatus={youthProfile.consent_status}
          consentedAt={link.consented_at}
        />
      </main>
    </div>
  );
}
