"use client";

import { useActionState } from "react";
import { updateProfileAction, type AccountState } from "@/actions/account";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export function AccountForm({
  preferredName,
  timezone,
  dateOfBirth,
  timezones,
}: {
  preferredName: string;
  timezone: string;
  dateOfBirth: string;
  timezones: string[];
}) {
  const [state, formAction, isPending] = useActionState<AccountState, FormData>(
    updateProfileAction,
    {}
  );

  const dobFormatted = new Date(dateOfBirth + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-havii-ink">Account</h1>

      {state.success && <Alert tone="success">{state.success}</Alert>}
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <form action={formAction} className="space-y-4">
        <Input
          name="preferred_name"
          label="Preferred name"
          defaultValue={preferredName}
          required
        />

        <div className="space-y-1.5">
          <label htmlFor="timezone" className="block text-sm font-medium text-havii-ink">
            Time zone
          </label>
          <select
            id="timezone"
            name="timezone"
            defaultValue={timezone}
            className="w-full rounded-xl border border-havii-mist bg-white px-3.5 py-2.5 text-havii-ink shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-havii-teal focus-visible:border-havii-teal"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-havii-ink">
            Date of birth
          </label>
          <div className="rounded-xl border border-havii-mist bg-havii-sand/50 px-3.5 py-2.5 text-sm text-havii-muted">
            {dobFormatted}
          </div>
          <p className="text-xs text-havii-muted">
            Date of birth is set during onboarding and cannot be changed here.
            This helps us verify age eligibility.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isPending}>
          Save Changes
        </Button>
      </form>

      <div className="border-t border-havii-mist pt-6">
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="lg" className="w-full">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
