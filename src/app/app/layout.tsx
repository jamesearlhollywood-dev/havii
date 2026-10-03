import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { level } = await getAccessLevel();

  // Guests → login
  if (level === "guest") redirect("/auth/login");
  // Not onboarded → onboarding
  if (level === "onboarding") redirect("/onboarding");
  // Caregivers → caregiver dashboard
  if (level === "caregiver") redirect("/caregiver");
  // Users who turned 18 → adult consent step
  if (level === "adult_consent") redirect("/app/adult-consent");

  return (
    <div className="min-h-screen bg-havii-cream">
      <main className="mx-auto max-w-sm px-6 pb-24 pt-8">
        {children}
      </main>
      {level === "full" && <BottomNav />}
    </div>
  );
}
