import Link from "next/link";
import { SignUpForm } from "@/components/auth/AuthForm";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-havii-teal text-sm font-bold text-white">
          H
        </span>
        <span className="font-semibold text-havii-ink">HAVII</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardTitle>Create your account</CardTitle>
        <CardDescription className="mb-6">
          Join a calm space to connect, grow, and find support.
        </CardDescription>
        <SignUpForm />
      </Card>
    </div>
  );
}
