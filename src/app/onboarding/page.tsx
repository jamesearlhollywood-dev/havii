import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Onboarding" };

export default async function OnboardingPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardTitle>Supabase not configured</CardTitle>
          <CardDescription className="mt-2">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
            .env.local, then run migrations. See README.
          </CardDescription>
        </Card>
      </div>
    );
  }

  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/onboarding");
  if (!profile) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardTitle>Profile missing</CardTitle>
          <CardDescription className="mt-2">
            Your auth user exists but no profile row was found. Ensure the
            auth.users trigger migration has been applied, then try signing up again.
          </CardDescription>
        </Card>
      </div>
    );
  }
  if (profile.onboarding_completed) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md px-4 pt-6">
      <OnboardingForm profile={profile} />
    </div>
  );
}
