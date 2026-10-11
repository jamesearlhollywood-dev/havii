import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/AuthForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rise-sky px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rise-navy text-sm font-bold text-white">R</span>
        <span className="font-bold text-rise-navy">RISE USA</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription className="mb-6">
          We&apos;ll email you a secure link if an account exists.
        </CardDescription>
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}
