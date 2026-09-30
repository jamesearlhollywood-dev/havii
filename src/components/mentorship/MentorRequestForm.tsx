"use client";

import { useActionState, useState } from "react";
import { createMentorRequestAction, type ActionResult } from "@/actions/mentorship";
import { INTEREST_OPTIONS, HELP_AREAS, HELP_AREA_LABELS, AVAILABILITY_OPTIONS, AVAILABILITY_LABELS } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";

const initial: ActionResult = {};

const interestOptions = INTEREST_OPTIONS.map((v) => ({
  value: v,
  label: v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const helpOptions = HELP_AREAS.map((v) => ({ value: v, label: HELP_AREA_LABELS[v] }));

const availabilityOptions = AVAILABILITY_OPTIONS.map((v) => ({
  value: v,
  label: AVAILABILITY_LABELS[v],
}));

export function MentorRequestForm({
  existingInterests,
  existingHelpAreas,
  existingAvailability,
}: {
  existingInterests: string[];
  existingHelpAreas: string[];
  existingAvailability: string;
}) {
  const [state, action, pending] = useActionState(createMentorRequestAction, initial);
  const [interests, setInterests] = useState<string[]>(existingInterests);
  const [helpAreas, setHelpAreas] = useState<string[]>(existingHelpAreas);
  const [availability, setAvailability] = useState<string[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);

  const steps = [
    { id: "interests", title: "Your interests", subtitle: "What do you enjoy?" },
    { id: "support", title: "Where you want support", subtitle: "Pick areas where a mentor could help." },
    { id: "availability", title: "When you're free", subtitle: "Help us find a good time to meet." },
    { id: "review", title: "Ready to submit?", subtitle: "Review your request." },
  ];

  const currentStep = steps[stepIdx];
  const isLastStep = stepIdx === steps.length - 1;
  const progress = (stepIdx / (steps.length - 1)) * 100;

  function nextStep() {
    setStepError(null);
    if (stepIdx === 0 && interests.length === 0) {
      setStepError("Pick at least one interest.");
      return;
    }
    if (stepIdx === 1 && helpAreas.length === 0) {
      setStepError("Pick at least one area.");
      return;
    }
    if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setStepError(null);
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form action={action} className="space-y-0">
      {state.error ? <Alert tone="error" className="mb-4">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success" className="mb-4">{state.success}</Alert> : null}

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-havii-muted">
          <span>Step {stepIdx + 1} of {steps.length}</span>
          <span>Mentor request</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-havii-sand">
          <div className="h-full rounded-full bg-havii-teal transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {stepError ? <Alert tone="error" className="mb-4">{stepError}</Alert> : null}

      {stepIdx === 0 && (
        <div className="space-y-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-havii-ink">{currentStep.title}</h2>
            <p className="mt-1 text-sm text-havii-muted">{currentStep.subtitle}</p>
          </div>
          <CheckboxGroup legend="Interests" name="interests" options={interestOptions} values={interests} onChange={setInterests} />
          {interests.map((v) => <input key={v} type="hidden" name="interests" value={v} />)}
        </div>
      )}

      {stepIdx === 1 && (
        <div className="space-y-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-havii-ink">{currentStep.title}</h2>
            <p className="mt-1 text-sm text-havii-muted">{currentStep.subtitle}</p>
          </div>
          <CheckboxGroup legend="Support areas" name="help_areas" options={helpOptions} values={helpAreas} onChange={setHelpAreas} />
          {helpAreas.map((v) => <input key={v} type="hidden" name="help_areas" value={v} />)}
        </div>
      )}

      {stepIdx === 2 && (
        <div className="space-y-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-havii-ink">{currentStep.title}</h2>
            <p className="mt-1 text-sm text-havii-muted">{currentStep.subtitle}</p>
          </div>
          <CheckboxGroup legend="Availability" name="availability_slots" options={availabilityOptions} values={availability} onChange={setAvailability} />
          <Textarea
            name="availability_notes"
            label="Any other notes about your schedule?"
            hint="Optional — add anything that helps us schedule meetings."
            defaultValue={existingAvailability || ""}
          />
        </div>
      )}

      {stepIdx === 3 && (
        <div className="space-y-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-havii-ink">{currentStep.title}</h2>
            <p className="mt-1 text-sm text-havii-muted">{currentStep.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-havii-mist bg-havii-sand/40 p-4 text-sm space-y-3">
            <div>
              <span className="font-medium text-havii-ink">Interests:</span>{" "}
              <span className="text-havii-muted">{interests.length > 0 ? interests.map((v) => interestOptions.find((o) => o.value === v)?.label || v).join(", ") : "None selected"}</span>
            </div>
            <div>
              <span className="font-medium text-havii-ink">Support areas:</span>{" "}
              <span className="text-havii-muted">{helpAreas.length > 0 ? helpAreas.map((v) => HELP_AREA_LABELS[v as keyof typeof HELP_AREA_LABELS] || v).join(", ") : "None selected"}</span>
            </div>
            <div>
              <span className="font-medium text-havii-ink">Availability:</span>{" "}
              <span className="text-havii-muted">{availability.length > 0 ? availability.map((v) => AVAILABILITY_LABELS[v] || v).join(", ") : "See notes"}</span>
            </div>
          </div>
          <p className="text-sm text-havii-muted">
            Our staff review requests carefully. We'll match you with a mentor who fits your interests and needs.
          </p>
        </div>
      )}

      <div className="sticky bottom-0 z-30 mt-6 -mx-4 flex items-center gap-3 border-t border-havii-mist bg-white/95 px-4 py-3 backdrop-blur-md pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {stepIdx > 0 && (
          <Button type="button" variant="outline" onClick={prevStep} className="flex-1">Back</Button>
        )}
        {!isLastStep ? (
          <Button type="button" onClick={nextStep} className="flex-1">Continue</Button>
        ) : (
          <Button type="submit" loading={pending} className="flex-1">Submit Request</Button>
        )}
      </div>
    </form>
  );
}
