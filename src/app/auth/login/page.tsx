import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-havii-ink">Welcome back</h1>
          <p className="text-sm text-havii-muted">Sign in to continue to HAVII.</p>
        </div>
        <LoginForm nextPath={safeNext} />
      </div>
    </div>
  );
}
