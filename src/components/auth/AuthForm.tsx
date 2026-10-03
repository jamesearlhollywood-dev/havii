"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  forgotPasswordAction,
  loginAction,
  resetPasswordAction,
  signUpAction,
  type AuthActionState,
} from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

const initial: AuthActionState = {};

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, initial);
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="first_name" label="First name" autoComplete="given-name" />
        <Input name="last_name" label="Last name" autoComplete="family-name" />
      </div>
      <Input
        name="email"
        type="email"
        label="Email"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        type="password"
        label="Password"
        required
        minLength={8}
        autoComplete="new-password"
        hint="At least 8 characters"
      />
      <input type="hidden" name="role" value="youth" />
      <Button type="submit" className="w-full" loading={pending}>
        Create account
      </Button>
      <p className="text-center text-sm text-career-slate">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-career-blue hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export function LoginForm({ next = "/app/dashboard" }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <input type="hidden" name="next" value={next} />
      <Input name="email" type="email" label="Email" required autoComplete="email" />
      <Input
        name="password"
        type="password"
        label="Password"
        required
        autoComplete="current-password"
      />
      <div className="flex justify-end">
        <Link href="/auth/forgot-password" className="text-sm text-career-blue hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" loading={pending}>
        Log in
      </Button>
      <p className="text-center text-sm text-career-slate">
        New here?{" "}
        <Link href="/auth/sign-up" className="font-medium text-career-blue hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <Input name="email" type="email" label="Email" required autoComplete="email" />
      <Button type="submit" className="w-full" loading={pending}>
        Send reset link
      </Button>
      <p className="text-center text-sm text-career-slate">
        <Link href="/auth/login" className="text-career-blue hover:underline">
          Back to log in
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, initial);
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <Input
        name="password"
        type="password"
        label="New password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <Input
        name="confirm_password"
        type="password"
        label="Confirm password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <Button type="submit" className="w-full" loading={pending}>
        Update password
      </Button>
    </form>
  );
}
