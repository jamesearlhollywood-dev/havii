import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Verify email" };

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-4 py-10">
      <Card className="w-full max-w-md text-center">
        <CardTitle>Check your email</CardTitle>
        <CardDescription className="mt-2">
          We sent a verification link. After verifying, you can log in and finish onboarding.
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
