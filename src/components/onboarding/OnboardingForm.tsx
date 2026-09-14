"use client";

import { useActionState, useState } from "react";
import {
  completeOnboardingAction,
  type OnboardingState,
} from "@/actions/onboarding";
import type { Profile } from "@/lib/types";
import { HELP_AREAS, HELP_AREA_LABELS, INTEREST_OPTIONS } from "@/lib/types";
import { displayRoleName } from "@/lib/roles";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";

const initial: OnboardingState = {};

const interestOptions = INTEREST_OPTIONS.map((v) => ({
  value: v,
  label: v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const helpOptions = HELP_AREAS.map((v) => ({
  value: v,
  label: HELP_AREA_LABELS[v],
}));

export function OnboardingForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(completeOnboardingAction, initial);
  const [interests, setInterests] = useState<string[]>([]);
  const [helpAreas, setHelpAreas] = useState<string[]>([]);
  const [mentoringInterests, setMentoringInterests] = useState<string[]>([]);
  const [supportAreas, setSupportAreas] = useState<string[]>([]);
  const [mentorshipInterested, setMentorshipInterested] = useState(true);

  return (
    <form action={action} className="space-y-6">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <div className="rounded-2xl border border-havii-mist bg-havii-sand/40 px-4 py-3 text-sm text-havii-muted">
        Setting up your <strong className="text-havii-ink">{displayRoleName(profile.role)}</strong> profile.
        You can update details later.
      </div>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-havii-ink">About you</h2>
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
        {(profile.role === "youth" || profile.role === "mentor") && (
          <Input
            name="date_of_birth"
            label="Date of birth"
            type="date"
            required={profile.role === "youth"}
            defaultValue={profile.date_of_birth ?? ""}
          />
        )}
      </section>

      {profile.role === "youth" ? (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-havii-ink">Youth details</h2>
          <Input
            name="location_general"
            label="General location"
            hint="City/region is enough — keep it comfortable"
            placeholder="e.g. Atlanta area"
          />
          <Input name="school_or_program" label="School or program (optional)" />
          <CheckboxGroup
            legend="Interests"
            name="interests"
            options={interestOptions}
            values={interests}
            onChange={setInterests}
          />
          {interests.map((v) => (
            <input key={v} type="hidden" name="interests" value={v} />
          ))}
          <CheckboxGroup
            legend="Areas where you'd like support"
            name="help_areas"
            options={helpOptions}
            values={helpAreas}
            onChange={setHelpAreas}
          />
          {helpAreas.map((v) => (
            <input key={v} type="hidden" name="help_areas" value={v} />
          ))}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-havii-ink">
              Interested in mentorship?
            </legend>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="mentorship_interested_ui"
                  checked={mentorshipInterested}
                  onChange={() => setMentorshipInterested(true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="mentorship_interested_ui"
                  checked={!mentorshipInterested}
                  onChange={() => setMentorshipInterested(false)}
                />
                Not right now
              </label>
            </div>
            <input
              type="hidden"
              name="mentorship_interested"
              value={mentorshipInterested ? "true" : "false"}
            />
          </fieldset>
        </section>
      ) : null}

      {profile.role === "mentor" ? (
        <section className="space-y-4">
          <Alert tone="info">
            Completing this profile starts your mentor application — it does{" "}
            <strong>not</strong> mean you are an approved mentor yet. Screening and
            training come next.
          </Alert>
          <Input
            name="profession"
            label="Profession / role"
            required
            placeholder="e.g. Software engineer, counselor, entrepreneur"
          />
          <Textarea
            name="background_summary"
            label="Background summary"
            hint="A short note about your experience and why you want to mentor"
          />
          <Input name="location_general" label="General location" />
          <CheckboxGroup
            legend="Mentoring interests"
            name="mentoring_interests"
            options={interestOptions}
            values={mentoringInterests}
            onChange={setMentoringInterests}
          />
          {mentoringInterests.map((v) => (
            <input key={v} type="hidden" name="mentoring_interests" value={v} />
          ))}
          <CheckboxGroup
            legend="Support areas you can offer"
            name="support_areas"
            options={helpOptions}
            values={supportAreas}
            onChange={setSupportAreas}
          />
          {supportAreas.map((v) => (
            <input key={v} type="hidden" name="support_areas" value={v} />
          ))}
        </section>
      ) : null}

      {profile.role === "caregiver" ? (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-havii-ink">Caregiver details</h2>
          <Textarea
            name="relationship_notes"
            label="Notes (optional)"
            hint="Youth connections are set up later with consent — nothing is linked automatically."
          />
        </section>
      ) : null}

      {profile.role === "community_partner" ? (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-havii-ink">Organization</h2>
          <Input name="organization_name" label="Organization name" required />
          <Input name="title_role" label="Your title / role" />
          <Input name="contact_email" type="email" label="Contact email" />
          <Textarea
            name="reason_for_use"
            label="Reason for using HAVII"
            required
            hint="Your account will be pending review after you submit."
          />
        </section>
      ) : null}

      {(profile.role === "staff" || profile.role === "administrator") && (
        <Alert tone="info">
          Staff/admin onboarding is minimal in Phase 1. Confirm your name and continue.
        </Alert>
      )}

      <Button type="submit" className="w-full sm:w-auto" loading={pending}>
        Save and continue
      </Button>
    </form>
  );
}
