import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { logoutAction } from "@/actions/auth";
import { getActiveInvitationAction, getYouthConsentStatusAction } from "@/actions/caregiver";
import { getCaregiverLinkForYouth } from "@/lib/caregiver";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { InvitationForm } from "@/components/caregiver/InvitationForm";
import { ConsentStatusCard } from "@/components/caregiver/ConsentStatusCard";

export default async function RestrictedPage() {
  const { level, profile } = await getAccessLevel();

  // Full-access users don't need this page
  if (level === "full") redirect("/app");
  // Guests go to login
  if (level === "guest") redirect("/auth/login");
  // Not onboarded go to onboarding
  if (level === "onboarding") redirect("/onboarding");
  // Caregivers → caregiver dashboard
  if (level === "caregiver") redirect("/caregiver");
  // Adult consent needed → adult consent page
  if (level === "adult_consent") redirect("/app/adult-consent");

  const isIneligible = level === "ineligible";
  const isPendingConsent = level === "restricted";

  // For restricted (pending consent) users, show the consent flow
  let consentStatus: "invitation_needed" | "awaiting_permission" | "approved" | "not_approved" | null = null;
  let activeInvitation: { caregiver_name: string; caregiver_email: string } | null = null;

  if (isPendingConsent && profile) {
    consentStatus = await getYouthConsentStatusAction();
    activeInvitation = await getActiveInvitationAction();

    // If status is "approved" but level is restricted, something is off — redirect to app
    if (consentStatus === "approved") redirect("/app");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-havii-ink">
        {isIneligible ? "Not eligible" : "Consent required"}
      </h1>

      {isIneligible && (
        <Alert tone="warning">
          <p className="font-medium">HAVII is for youth ages 13–24.</p>
          <p className="mt-1">
            Based on your date of birth, you are not eligible to enroll in HAVII at this time.
          </p>
        </Alert>
      )}

      {isPendingConsent && consentStatus && (
        <>
          <ConsentStatusCard
            status={consentStatus}
            caregiverName={activeInvitation?.caregiver_name}
            caregiverEmail={activeInvitation?.caregiver_email}
          />

          {(consentStatus === "invitation_needed" || consentStatus === "not_approved") && (
            <InvitationForm />
          )}

          {consentStatus === "awaiting_permission" && (
            <InvitationForm />
          )}

          {/* Public support always available */}
          <div className="pt-2 border-t border-havii-mist">
            <p className="text-sm text-havii-muted mb-3">
              While you wait, you can browse public support resources.
            </p>
          </div>
        </>
      )}

      <div className="space-y-3">
        <Link href="/help" className="block">
          <Button variant="outline" size="lg" className="w-full">
            View support resources
          </Button>
        </Link>

        <Link href="/app/account" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Account settings
          </Button>
        </Link>

        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="lg" className="w-full">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
