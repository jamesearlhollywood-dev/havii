import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default async function RestrictedPage() {
  const { level, profile } = await getAccessLevel();

  // Full-access users don't need this page
  if (level === "full") redirect("/app");
  // Guests go to login
  if (level === "guest") redirect("/auth/login");
  // Not onboarded go to onboarding
  if (level === "onboarding") redirect("/onboarding");

  const isIneligible = level === "ineligible";
  const isPendingConsent = level === "restricted";

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

      {isPendingConsent && (
        <Alert tone="info">
          <p className="font-medium">Caregiver consent is pending.</p>
          <p className="mt-1">
            Hi{profile?.preferred_name ? `, ${profile.preferred_name}` : ""}! Your account is set up,
            but a parent or legal guardian needs to provide consent before you can use check-ins and
            other program features.
          </p>
          <p className="mt-1 text-xs">
            Caregiver consent verification is not available yet. You can still browse public support
            information and sign out.
          </p>
        </Alert>
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
