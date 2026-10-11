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
    <div className="flex min-h-screen flex-col items-center justify-center bg-rise-sky px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rise-navy text-sm font-bold text-white">
          R
        </span>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-rise-navy">RISE USA</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-rise-red">Build What Lasts</span>
        </div>
      </Link>
      <Card className="w-full max-w-md">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription className="mb-6">Log in to continue to RISE USA.</CardDescription>
        <LoginForm next={params.next || "/dashboard"} />
      </Card>
    </div>
  );
}
