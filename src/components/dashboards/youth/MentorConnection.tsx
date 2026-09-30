import type { YouthProfile } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function MentorConnection({
  youth,
  hasMatch,
}: {
  youth: YouthProfile | null;
  hasMatch: boolean;
}) {
  const interested = youth?.mentorship_interested;

  if (hasMatch) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-havii-ink">
          You have a mentor match! Details will appear here soon.
        </p>
        <p className="text-xs text-havii-muted">
          Your mentor has been cleared and trained. Reach out through your next session.
        </p>
      </div>
    );
  }

  if (!interested) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-havii-muted">
          Mentorship is optional — explore when you&apos;re ready.
        </p>
        <Link href="/coming-next/find-a-mentor">
          <Button size="sm" variant="outline">
            Learn about mentorship
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-havii-ink">
        You&apos;re interested in finding a mentor!
      </p>
      <p className="text-xs text-havii-muted">
        Our staff review matches carefully. We&apos;ll let you know when a mentor is available.
      </p>
      <Link href="/coming-next/find-a-mentor">
        <Button size="sm">Find a Mentor</Button>
      </Link>
    </div>
  );
}
