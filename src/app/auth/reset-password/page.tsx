import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-studio-black px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-studio-gold/40 bg-studio-charcoal font-mono text-sm font-bold text-studio-gold">
          GH3
        </span>
        <span className="font-semibold text-studio-ink">James Hollywood III Studios</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <h1 className="text-lg font-semibold text-studio-ink">Choose a new password</h1>
        <p className="mt-1 mb-6 text-sm text-studio-muted">
          Enter a new password for your studio account.
        </p>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
