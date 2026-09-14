import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardDescription, CardTitle, ComingNextBadge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata = { title: "Find a Mentor" };

export default async function FindAMentorPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card>
          <CardTitle>Find a Mentor</CardTitle>
          <CardDescription className="mt-2">
            Matching is Coming Next. Configure Supabase to use the authenticated shell.
          </CardDescription>
        </Card>
      </div>
    );
  }

  const { user, profile } = await getCurrentUserAndProfile();
  if (!user || !profile) redirect("/auth/login?next=/coming-next/find-a-mentor");

  const content = (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Find a Mentor</h1>
        <ComingNextBadge />
      </div>
      <Card>
        <CardTitle>Matching is on the way</CardTitle>
        <CardDescription className="mt-2">
          HAVII will help you find someone in your corner based on interests,
          goals, availability, and staff oversight. No mentors are assigned in
          Phase 1 — this page is an honest placeholder.
        </CardDescription>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );

  return <AppShell profile={profile}>{content}</AppShell>;
}
