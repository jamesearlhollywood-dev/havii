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
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";

const initial: AuthActionState = {};

const roleOptions = [
  { value: "youth", label: "Youth (13–24)" },
  { value: "mentor", label: "Mentor" },
  { value: "caregiver", label: "Caregiver / Family" },
  { value: "community_partner", label: "Community Partner" },
];

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
        name="preferred_name"
        label="Preferred name"
        hint="What should we call you?"
        autoComplete="nickname"
      />
      <Select name="role" label="I am joining as" options={roleOptions} defaultValue="youth" />
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
      <p className="text-xs text-studio-muted">
        Staff and administrator accounts are invitation-only and cannot be selected here.
      </p>
      <Button type="submit" className="w-full" loading={pending}>
        Create account
      </Button>
      <p className="text-center text-sm text-havii-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-studio-gold hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export function LoginForm({ next = "/admin" }: { next?: string }) {
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
        <Link href="/auth/forgot-password" className="text-sm text-studio-gold hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" loading={pending}>
        Log in
      </Button>
      <p className="text-center text-sm text-havii-muted">
        New here?{" "}
        <Link href="/auth/sign-up" className="font-medium text-studio-gold hover:underline">
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
      <p className="text-center text-sm text-studio-muted">
        <Link href="/auth/login" className="text-studio-gold hover:underline">
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
