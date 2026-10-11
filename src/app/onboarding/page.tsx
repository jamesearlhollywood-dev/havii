import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Welcome to RISE USA" };

export default async function OnboardingPage() {
  const supabaseConnected = hasValidSupabaseConfig();

  if (!supabaseConnected) {
    return <OnboardingWizard supabaseConnected={false} />;
  }

  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/onboarding");
  if (!profile) redirect("/auth/login?next=/onboarding");
  if (profile.onboarding_completed) redirect("/dashboard");

  return <OnboardingWizard supabaseConnected={true} />;
}
