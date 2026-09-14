import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Forbidden" };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-havii-cream px-4">
      <Card className="max-w-md text-center">
        <CardTitle>You don&apos;t have access</CardTitle>
        <CardDescription className="mt-2">
          That area is reserved for a different role. If you think this is a
          mistake, contact HAVII staff.
        </CardDescription>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
