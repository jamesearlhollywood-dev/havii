"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboardingAction, type OnboardingState } from "@/actions/onboarding";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

function calculateAge(dob: string): number {
  if (!dob) return 0;
  const birth = new Date(dob + "T00:00:00Z");
  const today = new Date();
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const m = today.getUTCMonth() - birth.getUTCMonth();
  if (m < 0 || (m === 0 && today.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

const TOTAL_STEPS = 4;

export function OnboardingFlow() {
  const [state, formAction, isPending] = useActionState<OnboardingState, FormData>(
    completeOnboardingAction,
    {}
  );
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [preferredName, setPreferredName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }, []);

  const age = calculateAge(dateOfBirth);
  const isAdult = age >= 18 && age <= 24;
  const isMinor = age >= 13 && age <= 17;
  const isIneligible = dateOfBirth !== "" && (age < 13 || age > 24);

  function canProceed(): boolean {
    if (step === 1) return preferredName.trim().length > 0;
    if (step === 2) return dateOfBirth !== "" && !isIneligible;
    if (step === 3) return isAdult ? consentGiven : true;
    return true;
  }

  return (
    <div className="flex min-h-screen flex-col bg-havii-cream px-6 py-8">
      {/* Progress */}
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition ${
                s <= step ? "bg-havii-teal" : "bg-havii-mist"
              }`}
              aria-label={`Step ${s}`}
            />
          ))}
        </div>
        <p className="mb-6 text-sm text-havii-muted">
          Step {step} of {TOTAL_STEPS}
        </p>

        {state.error && step === 4 ? (
          <Alert tone="error" className="mb-4">{state.error}</Alert>
        ) : null}

        <form action={formAction} className="space-y-6">
          {/* Hidden fields always present */}
          <input type="hidden" name="preferred_name" value={preferredName} />
          <input type="hidden" name="date_of_birth" value={dateOfBirth} />
          <input type="hidden" name="timezone" value={timezone} />
          {isAdult && (
            <input type="hidden" name="consent_given" value={consentGiven ? "true" : "false"} />
          )}

          {/* Step 1: Preferred Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-havii-ink">What should we call you?</h2>
                <p className="mt-1 text-sm text-havii-muted">
                  Enter the name you&apos;d like to be greeted with in HAVII.
                </p>
              </div>
              <Input
                name="display_preferred_name"
                label="Preferred name"
                placeholder="e.g. Alex"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                autoFocus
                autoComplete="off"
              />
            </div>
          )}

          {/* Step 2: Date of Birth */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-havii-ink">Your date of birth</h2>
                <p className="mt-1 text-sm text-havii-muted">
                  We use this to confirm you&apos;re in the right age range for HAVII (13–24).
                </p>
              </div>
              <Input
                name="display_date_of_birth"
                label="Date of birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                autoFocus
              />
              {dateOfBirth && !isIneligible && (
                <p className="text-sm text-havii-teal">
                  You are {age} years old.
                </p>
              )}
              {isIneligible && (
                <Alert tone="error">
                  HAVII is for youth ages 13–24. Based on this date of birth, you are not eligible to enroll.
                </Alert>
              )}
            </div>
          )}

          {/* Step 3: Privacy & Consent */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-havii-ink">Privacy & consent</h2>
              </div>
              <div className="space-y-3 rounded-xl border border-havii-mist bg-white p-4 text-sm text-havii-ink">
                <p>HAVII collects your preferred name, date of birth, and daily check-in entries (mood and optional notes).</p>
                <p>Your check-ins and notes are <strong>private</strong> — only you can see them. Mentors, caregivers, and other participants do not have access.</p>
                <p>You can edit your check-ins and update your account at any time.</p>
                <p className="text-havii-muted">HAVII is not an emergency service and is not monitored 24/7.</p>
              </div>

              {isAdult && (
                <label className="flex items-start gap-3 rounded-xl border border-havii-mist bg-white p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-havii-mist text-havii-teal focus-visible:ring-havii-teal"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                  />
                  <span className="text-sm text-havii-ink">
                    I understand how HAVII uses my information and I consent to participate.
                  </span>
                </label>
              )}

              {isMinor && (
                <Alert tone="warning">
                  <p className="font-medium">Caregiver consent required.</p>
                  <p className="mt-1">
                    Because you are {age}, a parent or legal guardian needs to provide consent before you can use check-ins and other program features.
                  </p>
                  <p className="mt-1">
                    You can finish setting up your account now. Protected features will stay locked until caregiver consent is verified.
                  </p>
                  <p className="mt-1 text-xs">
                    Caregiver consent verification is not available yet. You can still browse public support information and sign out.
                  </p>
                </Alert>
              )}
            </div>
          )}

          {/* Step 4: Review & Finish */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-havii-ink">Review your information</h2>
                <p className="mt-1 text-sm text-havii-muted">
                  Please check everything looks right before finishing.
                </p>
              </div>
              <dl className="space-y-3 rounded-xl border border-havii-mist bg-white p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-havii-muted">Preferred name</dt>
                  <dd className="font-medium text-havii-ink">{preferredName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-havii-muted">Date of birth</dt>
                  <dd className="font-medium text-havii-ink">
                    {new Date(dateOfBirth + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-havii-muted">Age</dt>
                  <dd className="font-medium text-havii-ink">{age}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-havii-muted">Time zone</dt>
                  <dd className="font-medium text-havii-ink">{timezone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-havii-muted">Consent</dt>
                  <dd className="font-medium text-havii-ink">
                    {isAdult ? "Self-consented" : "Pending caregiver consent"}
                  </dd>
                </div>
              </dl>

              {isMinor && (
                <p className="text-sm text-havii-muted">
                  You can finish now. Check-ins and other protected features will be unlocked after caregiver consent is verified.
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={isPending}
              >
                Back
              </Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                loading={isPending}
              >
                Finish
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-havii-teal underline-offset-2 hover:underline"
            onClick={() => router.push("/help")}
          >
            Need help?
          </button>
        </div>
      </div>
    </div>
  );
}
