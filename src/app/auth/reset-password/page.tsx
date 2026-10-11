import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/AuthForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rise-sky px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rise-navy text-sm font-bold text-white">R</span>
        <span className="font-bold text-rise-navy">RISE USA</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription className="mb-6">
          Enter a new password for your RISE USA account.
        </CardDescription>
        <ResetPasswordForm />
      </Card>
    </div>
  );
}
