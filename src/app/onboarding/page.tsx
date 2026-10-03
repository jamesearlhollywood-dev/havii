import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const { level } = await getAccessLevel();
  if (level === "full") redirect("/app");
  if (level === "restricted") redirect("/app/restricted");

  return <OnboardingFlow />;
}
