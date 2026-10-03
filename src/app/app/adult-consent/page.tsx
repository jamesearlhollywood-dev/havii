import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { AdultConsentForm } from "@/components/caregiver/AdultConsentForm";

export default async function AdultConsentPage() {
  const { level, profile } = await getAccessLevel();

  if (level === "guest") redirect("/auth/login");
  if (level !== "adult_consent") redirect("/app");
  if (!profile) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-havii-cream">
      <main className="mx-auto max-w-sm px-6 py-8">
        <AdultConsentForm preferredName={profile.preferred_name} />
      </main>
    </div>
  );
}
