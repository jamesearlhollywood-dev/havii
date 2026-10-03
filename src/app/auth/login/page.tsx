import Link from "next/link";
import { LoginForm } from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-studio-black px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-studio-gold/40 bg-studio-charcoal font-mono text-sm font-bold text-studio-gold">
          GH3
        </span>
        <span className="font-semibold text-studio-ink">James Hollywood III Studios</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h1 className="text-lg font-semibold text-studio-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-studio-muted">
          Log in to the studio dashboard.
        </p>
        <div className="mt-6">
          <LoginForm next={params.next || "/admin"} />
        </div>
      </div>
    </div>
  );
}
