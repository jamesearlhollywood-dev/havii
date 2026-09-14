import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/AuthForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-4 py-10">
      <Link href="/" className="mb-6 font-semibold text-havii-ink">
        HAVII
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
