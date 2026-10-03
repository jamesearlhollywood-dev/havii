"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    loginAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4" autoComplete="on">
      {state.error ? (
        <Alert tone="error">{state.error}</Alert>
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
        autoComplete="current-password"
        required
      />

      {nextPath ? (
        <input type="hidden" name="next" value={nextPath} />
      ) : null}

      <Button type="submit" size="lg" loading={isPending} className="w-full">
        Sign In
      </Button>

      <p className="text-center text-sm text-havii-muted">
        New to HAVII?{" "}
        <Link href="/auth/sign-up" className="text-havii-teal underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
