import Link from "next/link";
import { SignUpForm } from "@/components/auth/AuthForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-career-bg px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-career-blue text-sm font-bold text-white">
          C
        </span>
        <span className="font-semibold text-career-navy">Career AI</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardTitle>Create your account</CardTitle>
        <CardDescription className="mb-6">
          Start organizing your job search and landing your next role.
        </CardDescription>
        <SignUpForm />
      </Card>
    </div>
  );
}
