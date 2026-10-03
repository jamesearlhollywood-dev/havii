"use client";

import { Button } from "@/components/ui/Button";

export default function JournalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4 py-10 text-center">
      <p className="text-sm text-havii-muted">
        Something went wrong loading your journal.
      </p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
