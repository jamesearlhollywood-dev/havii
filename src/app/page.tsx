import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { Button } from "@/components/ui/Button";

export default async function WelcomePage() {
  const { level } = await getAccessLevel();
  if (level === "full") redirect("/app");
  if (level === "onboarding") redirect("/onboarding");
  if (level === "restricted") redirect("/app/restricted");
  if (level === "ineligible") redirect("/app/restricted");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo placeholder — replace with final HAVII logo asset */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-havii-teal text-white">
          <span className="text-2xl font-bold tracking-tight">H</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-havii-ink">
            HAVII
          </h1>
          <p className="text-lg text-havii-muted">
            A space to reflect, grow, and connect.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/auth/sign-up" className="block">
            <Button size="lg" className="w-full">Create Account</Button>
          </Link>
          <Link href="/auth/login" className="block">
            <Button size="lg" variant="outline" className="w-full">Sign In</Button>
          </Link>
        </div>

        <Link
          href="/help"
          className="inline-block text-sm text-havii-teal underline-offset-2 hover:underline"
        >
          Need help now?
        </Link>

        <p className="pt-6 text-xs text-havii-muted">
          For youth ages 13–24 · From Together For You, Inc.
        </p>
      </div>
    </div>
  );
}
