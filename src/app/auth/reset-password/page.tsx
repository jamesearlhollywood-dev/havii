import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/AuthForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-4 py-10">
      <Link href="/" className="mb-6 font-semibold text-havii-ink">
        HAVII
      </Link>
      <Card className="w-full max-w-md">
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription className="mb-6">
          Enter a new password for your HAVII account.
        </CardDescription>
        <ResetPasswordForm />
      </Card>
    </div>
  );
}
