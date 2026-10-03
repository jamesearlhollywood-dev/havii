import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/AuthForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-career-bg px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-career-blue text-sm font-bold text-white">
          C
        </span>
        <span className="font-semibold text-career-navy">Career AI</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription className="mb-6">
          Enter a new password for your Career AI account.
        </CardDescription>
        <ResetPasswordForm />
      </Card>
    </div>
  );
}
