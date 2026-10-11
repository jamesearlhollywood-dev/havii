"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/progress";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { displayRoleName } from "@/lib/roles";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, {});

  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="rounded-xl border border-rise-border bg-rise-sky/30 px-4 py-2.5 text-sm text-rise-muted">
        Role: <strong className="text-rise-navy">{displayRoleName(profile.role)}</strong>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="first_name" label="First name" defaultValue={profile.first_name ?? ""} />
        <Input name="last_name" label="Last name" defaultValue={profile.last_name ?? ""} />
      </div>
      <Input name="preferred_name" label="Preferred name" defaultValue={profile.preferred_name ?? ""} />
      <Input name="pronouns" label="Pronouns" defaultValue={profile.pronouns ?? ""} placeholder="e.g. they/them" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="city" label="City" defaultValue={profile.city ?? ""} />
        <Input name="state" label="State" defaultValue={profile.state ?? ""} />
      </div>
      <Input name="phone" label="Phone" type="tel" defaultValue={profile.phone ?? ""} />

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Save Changes</Button>
      </div>
    </form>
  );
}
