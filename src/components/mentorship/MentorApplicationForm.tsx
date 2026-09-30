"use client";

import { useActionState, useState } from "react";
import { submitMentorApplicationAction, type ActionResult } from "@/actions/mentorship";
import { INTEREST_OPTIONS, HELP_AREAS, HELP_AREA_LABELS, AVAILABILITY_OPTIONS, AVAILABILITY_LABELS } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";
import type { MentorProfile } from "@/lib/types";

const initial: ActionResult = {};

const interestOptions = INTEREST_OPTIONS.map((v) => ({
  value: v,
  label: v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const helpOptions = HELP_AREAS.map((v) => ({ value: v, label: HELP_AREA_LABELS[v] }));
const availabilityOptions = AVAILABILITY_OPTIONS.map((v) => ({ value: v, label: AVAILABILITY_LABELS[v] }));

export function MentorApplicationForm({ mentor }: { mentor: MentorProfile | null }) {
  const [state, action, pending] = useActionState(submitMentorApplicationAction, initial);
  const [mentoringInterests, setMentoringInterests] = useState<string[]>(mentor?.mentoring_interests ?? []);
  const [supportAreas, setSupportAreas] = useState<string[]>(mentor?.support_areas ?? []);
  const [availability, setAvailability] = useState<string[]>([]);

  return (
    <form action={action} className="space-y-5">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Input
        name="profession"
        label="Profession / role"
        placeholder="e.g. Software engineer, counselor, entrepreneur"
        defaultValue={mentor?.profession ?? ""}
        required
      />

      <Textarea
        name="background_summary"
        label="Background summary"
        hint="Tell us about your experience and why you want to mentor"
        defaultValue={mentor?.background_summary ?? ""}
      />

      <div>
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
      </div>

      <div>
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
      </div>

      <div>
        <CheckboxGroup
          legend="Availability"
          name="availability_slots"
          options={availabilityOptions}
          values={availability}
          onChange={setAvailability}
        />
      </div>

      <Textarea
        name="availability_notes"
        label="Availability notes"
        hint="Any specific details about when you can meet"
        defaultValue={mentor?.availability_notes ?? ""}
      />

      <Input
        name="location_general"
        label="General location"
        defaultValue={mentor?.location_general ?? ""}
      />

      <div className="sticky bottom-0 z-30 -mx-4 flex items-center gap-3 border-t border-havii-mist bg-white/95 px-4 py-3 backdrop-blur-md pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Button type="submit" loading={pending} className="flex-1">
          {mentor?.application_status === "submitted" ? "Update Application" : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
