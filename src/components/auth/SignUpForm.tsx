"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signUpAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4" autoComplete="on">
      {state.error ? (
        <Alert tone="error">{state.error}</Alert>
      ) : null}
      {state.success ? (
        <Alert tone="success">{state.success}</Alert>
      ) : null}

      <Input
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
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

      <Button type="submit" size="lg" loading={isPending} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-havii-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-havii-teal underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
