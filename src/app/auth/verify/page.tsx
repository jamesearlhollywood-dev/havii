import Link from "next/link";

export const metadata = { title: "Verify email" };

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-studio-black px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-studio-line bg-studio-charcoal p-6 text-center">
        <h1 className="text-lg font-semibold text-studio-ink">Check your email</h1>
        <p className="mt-2 text-sm text-studio-muted">
          We sent a verification link. After verifying, you can log in to the
          studio dashboard.
        </p>
        <div className="mt-6">
          <Link
            href="/auth/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-studio-gold px-5 py-2.5 text-sm font-semibold text-studio-black hover:bg-studio-gold-light"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
