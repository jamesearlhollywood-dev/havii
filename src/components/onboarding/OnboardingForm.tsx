"use client";

import { useActionState } from "react";
import { completeOnboardingAction, type OnboardingState } from "@/actions/onboarding";
import type { Profile } from "@/lib/types";
import { displayRoleName } from "@/lib/roles";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";

const initial: OnboardingState = {};

export function OnboardingForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(completeOnboardingAction, initial);

  return (
    <form action={action} className="space-y-6">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <div className="rounded-2xl border border-rise-border bg-rise-sky/50 px-4 py-3 text-sm text-rise-muted">
        Setting up your <strong className="text-rise-navy">{displayRoleName(profile.role)}</strong> profile.
        You can update details later.
      </div>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-rise-navy">About you</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="first_name"
            label="First name"
            defaultValue={profile.first_name ?? ""}
          />
          <Input
            name="last_name"
            label="Last name"
            defaultValue={profile.last_name ?? ""}
          />
        </div>
        <Input
          name="preferred_name"
          label="Preferred name"
          defaultValue={profile.preferred_name ?? profile.first_name ?? ""}
          required
        />
        <Input name="pronouns" label="Pronouns (optional)" placeholder="e.g. they/them" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="city" label="City" defaultValue={profile.city ?? ""} />
          <Input name="state" label="State" defaultValue={profile.state ?? ""} />
        </div>
        <Input name="phone" label="Phone (optional)" type="tel" />
      </section>

      {profile.role === "student" && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-rise-navy">Student details</h2>
          <Input
            name="school_or_program"
            label="School or program (optional)"
            placeholder="e.g. Lincoln High School"
          />
          <Input
            name="graduation_year"
            label="Expected graduation year"
            placeholder="e.g. 2027"
          />
        </section>
      )}

      {(profile.role === "instructor" || profile.role === "org_manager") && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-rise-navy">Professional details</h2>
          <Input
            name="title_role"
            label="Title / Role"
            placeholder="e.g. Financial Education Coordinator"
          />
          <Textarea
            name="background_summary"
            label="Background (optional)"
            placeholder="Tell us about your experience in financial education or youth programs."
          />
        </section>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={pending} size="lg">
          Complete setup
        </Button>
      </div>
    </form>
  );
}
