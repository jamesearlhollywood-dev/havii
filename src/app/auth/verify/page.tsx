import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Verify email" };

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-career-bg px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-career-blue text-sm font-bold text-white">
          C
        </span>
        <span className="font-semibold text-career-navy">Career AI</span>
      </Link>
      <Card className="w-full max-w-md text-center">
        <CardTitle>Check your email</CardTitle>
        <CardDescription className="mt-2">
          We sent a verification link. After verifying, you can log in and set up your career profile.
        </CardDescription>
        <div className="mt-6">
          <Link href="/auth/login">
            <Button className="w-full">Go to log in</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
