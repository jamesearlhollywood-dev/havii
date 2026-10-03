"use client";

import { useActionState } from "react";
import Link from "next/link";
import { caregiverSignUpAction } from "@/actions/caregiver";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function CaregiverSignUpForm({
  token,
  caregiverName,
  caregiverEmail,
}: {
  token: string;
  caregiverName: string;
  caregiverEmail: string;
}) {
  const [state, formAction, isPending] = useActionState<{ error?: string; success?: string }, FormData>(
    caregiverSignUpAction,
    {}
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-havii-ink">Create a caregiver account</h2>
        <p className="mt-1 text-sm text-havii-muted">
          Create an account with the email that received the invitation to review and provide consent.
        </p>
      </div>

      {state.error && <Alert tone="error">{state.error}</Alert>}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <Input
          name="preferred_name"
          label="Your name"
          defaultValue={caregiverName}
          required
          autoComplete="off"
        />
        <Input
          name="email"
          label="Email (must match the invitation)"
          type="email"
          defaultValue={caregiverEmail}
          readOnly
          className="bg-havii-sand text-havii-muted"
        />
        <Input
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          required
        />

        <Button type="submit" size="lg" className="w-full" loading={isPending}>
          Create Account & Continue
        </Button>
      </form>

      <p className="text-center text-sm text-havii-muted">
        Already have an account?{" "}
        <Link
          href={`/auth/login?next=${encodeURIComponent(`/consent/review?token=${token}`)}`}
          className="text-havii-teal underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
