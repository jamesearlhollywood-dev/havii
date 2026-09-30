"use client";

import { useActionState, useMemo, useState } from "react";
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

function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasHadBirthday =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hasHadBirthday) age--;
  return age;
}

type StepDef = {
  id: string;
  title: string;
  subtitle: string;
  canShow: () => boolean;
};

export function OnboardingForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(completeOnboardingAction, initial);
  const [interests, setInterests] = useState<string[]>([]);
  const [helpAreas, setHelpAreas] = useState<string[]>([]);
  const [mentoringInterests, setMentoringInterests] = useState<string[]>([]);
  const [supportAreas, setSupportAreas] = useState<string[]>([]);
  const [mentorshipInterested, setMentorshipInterested] = useState(true);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [dob, setDob] = useState(profile.date_of_birth ?? "");
  const [stepIdx, setStepIdx] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);

  const isYouth = profile.role === "youth";
  const age = calculateAge(dob);
  const isMinor = isYouth && age !== null && age < 18;

  const role = profile.role;

  const allSteps: StepDef[] = useMemo(() => [
    {
      id: "consent",
      title: "Consent & agreement",
      subtitle: "Please review before you continue.",
      canShow: () => true,
    },
    {
      id: "name",
      title: "What should we call you?",
      subtitle: "Your name and pronouns.",
      canShow: () => true,
    },
    {
      id: "dob",
      title: "Your birthday",
      subtitle: "This helps us personalize your experience.",
      canShow: () => isYouth || role === "mentor",
    },
    {
      id: "location",
      title: "Where you live",
      subtitle: "City and state are enough — keep it comfortable.",
      canShow: () => isYouth || role === "caregiver",
    },
    {
      id: "caregiver",
      title: "Caregiver permission",
      subtitle: "We need a caregiver or guardian's permission.",
      canShow: () => isMinor,
    },
    {
      id: "interests",
      title: "What are you into?",
      subtitle: "Pick anything that feels like you.",
      canShow: () => isYouth,
    },
    {
      id: "support",
      title: "Where do you want support?",
      subtitle: "Pick areas where you'd like help.",
      canShow: () => isYouth,
    },
    {
      id: "youth-extra",
      title: "Mentorship & school",
      subtitle: "A couple more things for your profile.",
      canShow: () => isYouth,
    },
    {
      id: "mentor-profession",
      title: "Your profession",
      subtitle: "Tell us about your background.",
      canShow: () => role === "mentor",
    },
    {
      id: "mentor-interests",
      title: "Mentoring interests",
      subtitle: "What can you help with?",
      canShow: () => role === "mentor",
    },
    {
      id: "caregiver-notes",
      title: "Anything else?",
      subtitle: "Optional notes about your connection.",
      canShow: () => role === "caregiver",
    },
    {
      id: "partner-org",
      title: "Your organization",
      subtitle: "Tell us about your organization.",
      canShow: () => role === "community_partner",
    },
    {
      id: "review",
      title: "Ready to go?",
      subtitle: "Review and finish your setup.",
      canShow: () => true,
    },
  ], [isYouth, role, isMinor]);

  const visibleSteps = useMemo(() => allSteps.filter((s) => s.canShow()), [allSteps]);
  const currentStep = visibleSteps[stepIdx];
  const totalSteps = visibleSteps.length;
  const isLastStep = stepIdx === totalSteps - 1;
  const progress = totalSteps > 1 ? (stepIdx / (totalSteps - 1)) * 100 : 100;

  function nextStep() {
    setStepError(null);

    // Validate current step
    const form = document.getElementById("onboarding-form") as HTMLFormElement | null;
    if (!form) return;

    // Check required fields in the current visible step
    const stepEl = form.querySelector(`[data-step="${currentStep.id}"]`);
    if (stepEl) {
      const requiredFields = stepEl.querySelectorAll("[required]");
      for (const field of requiredFields) {
        const input = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (!input.value?.trim()) {
          input.focus();
          setStepError("Please fill in this field to continue.");
          return;
        }
      }
    }

    // Consent validation
    if (currentStep.id === "consent" && !consentAccepted) {
      setStepError("Please review and accept the consent terms to continue.");
      return;
    }

    if (stepIdx < totalSteps - 1) {
      setStepIdx(stepIdx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function prevStep() {
    setStepError(null);
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form id="onboarding-form" action={action} className="space-y-0">
      {/* Server action feedback */}
      {state.error ? <Alert tone="error" className="mb-4">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success" className="mb-4">{state.success}</Alert> : null}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-havii-muted">
          <span>Step {stepIdx + 1} of {totalSteps}</span>
          <span>{displayRoleName(profile.role)} setup</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-havii-sand">
          <div
            className="h-full rounded-full bg-havii-teal transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step error */}
      {stepError ? (
        <Alert tone="error" className="mb-4">{stepError}</Alert>
      ) : null}

      {/* Step content — all steps in DOM, only current visible */}
      {visibleSteps.map((step) => {
        const isCurrent = step.id === currentStep.id;
        return (
          <div key={step.id} data-step={step.id} className={isCurrent ? "" : "hidden"}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-havii-ink">
                {step.title}
              </h2>
              <p className="mt-1 text-sm text-havii-muted">{step.subtitle}</p>
            </div>

            {/* CONSENT STEP */}
            {step.id === "consent" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-havii-teal/30 bg-havii-teal/5 p-4">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-sm text-havii-ink">
                      <input
                        type="checkbox"
                        checked={consentAccepted}
                        onChange={(e) => setConsentAccepted(e.target.checked)}
                        className="mt-0.5 h-5 w-5 rounded border-havii-mist text-havii-teal focus:ring-havii-teal"
                      />
                      <span>
                        I understand that <strong>HAVII is not an emergency service</strong> and is not
                        monitored 24/7. If I or someone else is in danger, I will call 911 or 988. I agree
                        to HAVII&apos;s Terms of Use and Privacy Policy, and I consent to participate.
                      </span>
                    </label>
                  </div>
                </div>
                <input type="hidden" name="consent_accepted" value={consentAccepted ? "true" : "false"} />
              </div>
            )}

            {/* NAME STEP */}
            {step.id === "name" && (
              <div className="space-y-4">
                <Input name="first_name" label="First name" defaultValue={profile.first_name ?? ""} />
                <Input name="last_name" label="Last name" defaultValue={profile.last_name ?? ""} />
                <Input
                  name="preferred_name"
                  label="Preferred name"
                  hint="What should we call you?"
                  defaultValue={profile.preferred_name ?? profile.first_name ?? ""}
                  required
                />
                <Input name="pronouns" label="Pronouns (optional)" placeholder="e.g. they/them" />
              </div>
            )}

            {/* DOB STEP */}
            {step.id === "dob" && (
              <div className="space-y-4">
                <Input
                  name="date_of_birth"
                  label="Date of birth"
                  type="date"
                  required={isYouth}
                  defaultValue={profile.date_of_birth ?? ""}
                  onChange={(e) => setDob(e.target.value)}
                />
                {isMinor && (
                  <Alert tone="info">
                    Since you&apos;re under 18, we&apos;ll ask for a caregiver&apos;s permission next.
                  </Alert>
                )}
              </div>
            )}

            {/* LOCATION STEP */}
            {step.id === "location" && (
              <div className="space-y-4">
                <Input name="city" label="City" defaultValue={profile.city ?? ""} />
                <Input name="state" label="State" defaultValue={profile.state ?? ""} />
                <Input name="phone" label="Phone (optional)" type="tel" />
              </div>
            )}

            {/* CAREGIVER PERMISSION STEP */}
            {step.id === "caregiver" && (
              <div className="space-y-4">
                <Alert tone="warning">
                  You are under 18, so we need a caregiver or guardian&apos;s permission.
                  We&apos;ll reach out to confirm.
                </Alert>
                <Input name="caregiver_name" label="Caregiver name" required />
                <Input name="caregiver_email" label="Caregiver email" type="email" required />
                <Input
                  name="caregiver_relationship"
                  label="Relationship (optional)"
                  placeholder="e.g. parent, guardian, grandparent"
                />
              </div>
            )}

            {/* INTERESTS STEP */}
            {step.id === "interests" && (
              <div className="space-y-4">
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
              </div>
            )}

            {/* SUPPORT AREAS STEP */}
            {step.id === "support" && (
              <div className="space-y-4">
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
              </div>
            )}

            {/* YOUTH EXTRA STEP */}
            {step.id === "youth-extra" && (
              <div className="space-y-4">
                <Input
                  name="location_general"
                  label="General location"
                  hint="City/region is enough — keep it comfortable"
                  placeholder="e.g. Atlanta area"
                />
                <Input name="school_or_program" label="School or program (optional)" />
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
                        className="h-5 w-5 text-havii-teal"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="mentorship_interested_ui"
                        checked={!mentorshipInterested}
                        onChange={() => setMentorshipInterested(false)}
                        className="h-5 w-5 text-havii-teal"
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
              </div>
            )}

            {/* MENTOR PROFESSION STEP */}
            {step.id === "mentor-profession" && (
              <div className="space-y-4">
                <Alert tone="info">
                  Completing this profile starts your mentor application — it does{" "}
                  <strong>not</strong> mean you are an approved mentor yet.
                </Alert>
                <Input
                  name="profession"
                  label="Profession / role"
                  placeholder="e.g. Software engineer, counselor, entrepreneur"
                  required
                />
                <Textarea
                  name="background_summary"
                  label="Background summary"
                  hint="A short note about your experience and why you want to mentor"
                />
                <Input name="location_general" label="General location" />
              </div>
            )}

            {/* MENTOR INTERESTS STEP */}
            {step.id === "mentor-interests" && (
              <div className="space-y-4">
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
              </div>
            )}

            {/* CAREGIVER NOTES STEP */}
            {step.id === "caregiver-notes" && (
              <div className="space-y-4">
                <Textarea
                  name="relationship_notes"
                  label="Notes (optional)"
                  hint="Youth connections are set up later with consent — nothing is linked automatically."
                />
              </div>
            )}

            {/* PARTNER ORG STEP */}
            {step.id === "partner-org" && (
              <div className="space-y-4">
                <Input name="organization_name" label="Organization name" required />
                <Input name="title_role" label="Your title / role" />
                <Input name="contact_email" type="email" label="Contact email" />
                <Textarea
                  name="reason_for_use"
                  label="Reason for using HAVII"
                  hint="Your account will be pending review after you submit."
                  required
                />
              </div>
            )}

            {/* REVIEW STEP */}
            {step.id === "review" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-havii-mist bg-havii-sand/40 p-4 text-sm text-havii-muted">
                  Setting up your <strong className="text-havii-ink">{displayRoleName(profile.role)}</strong> profile.
                  You can update details later.
                </div>
                {(profile.role === "staff" || profile.role === "administrator") && (
                  <Alert tone="info">
                    Staff/admin onboarding is minimal. Confirm your name and continue.
                  </Alert>
                )}
                <p className="text-sm text-havii-muted">
                  Tap &quot;Finish&quot; to complete your setup. You can always change
                  your details later.
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation buttons — fixed bottom bar on mobile */}
      <div className="sticky bottom-0 z-30 mt-6 -mx-4 flex items-center gap-3 border-t border-havii-mist bg-white/95 px-4 py-3 backdrop-blur-md pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {stepIdx > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            Back
          </Button>
        )}
        {!isLastStep ? (
          <Button
            type="button"
            onClick={nextStep}
            className="flex-1"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            loading={pending}
            className="flex-1"
          >
            Finish
          </Button>
        )}
      </div>
    </form>
  );
}
