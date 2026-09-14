import Link from "next/link";
import { LoginForm } from "@/components/auth/AuthForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-havii-teal text-sm font-bold text-white">
          H
        </span>
        <span className="font-semibold text-havii-ink">HAVII</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription className="mb-6">Log in to continue to HAVII.</CardDescription>
        <LoginForm next={params.next || "/dashboard"} />
      </Card>
    </div>
  );
}
