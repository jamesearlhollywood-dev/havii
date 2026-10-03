import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { level } = await getAccessLevel();

  // Guests → login
  if (level === "guest") redirect("/auth/login");
  // Not onboarded → onboarding
  if (level === "onboarding") redirect("/onboarding");

  // Ineligible or restricted users can only access /app/restricted and /help
  if (level === "ineligible" || level === "restricted") {
    // Allow access to the restricted page itself
    // (page-level checks handle the rest)
  }

  return (
    <div className="min-h-screen bg-havii-cream">
      <main className="mx-auto max-w-sm px-6 pb-24 pt-8">
        {children}
      </main>
      {level === "full" && <BottomNav />}
    </div>
  );
}
