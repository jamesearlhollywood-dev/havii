"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { modules } from "@/data/course";
import { completeOnboardingAction, type OnboardingState } from "@/actions/onboarding";
import { CONFIDENCE_SURVEY_QUESTIONS } from "@/data/confidence-survey";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 6;

const POST_GRAD_OPTIONS = [
  { value: "four_year_college", label: "Four-year college" },
  { value: "community_college", label: "Community college" },
  { value: "trade_technical", label: "Trade or technical school" },
  { value: "apprenticeship", label: "Apprenticeship" },
  { value: "military", label: "Military" },
  { value: "workforce", label: "Workforce / employment" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "undecided", label: "Undecided" },
  { value: "other", label: "Other" },
];

const LEARNING_GOAL_OPTIONS: { value: string; label: string }[] = [
  { value: "managing_paycheck", label: "Managing a paycheck" },
  { value: "banking", label: "Banking" },
  { value: "budgeting", label: "Budgeting" },
  { value: "saving_money", label: "Saving money" },
  { value: "building_credit", label: "Building credit" },
  { value: "avoiding_debt", label: "Avoiding debt" },
  { value: "paying_college", label: "Paying for college or training" },
  { value: "student_loans", label: "Student loans" },
  { value: "investing", label: "Investing" },
  { value: "buying_car", label: "Buying a car" },
  { value: "renting_apartment", label: "Renting an apartment" },
  { value: "insurance", label: "Insurance" },
  { value: "avoiding_scams", label: "Avoiding scams" },
  { value: "starting_business", label: "Starting a business" },
];

const initial: OnboardingState = {};

export function OnboardingWizard({
  supabaseConnected,
}: {
  supabaseConnected: boolean;
}) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Step 2 — Profile data
  const [preferredName, setPreferredName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [schoolOrProgram, setSchoolOrProgram] = useState("");
  const [postGrad, setPostGrad] = useState("");

  // Step 4 — Confidence survey
  const [confidence, setConfidence] = useState<number[]>(Array(CONFIDENCE_SURVEY_QUESTIONS.length).fill(0));

  // Step 5 — Learning goals
  const [goals, setGoals] = useState<string[]>([]);

  const [actionState, action, pending] = useActionState(completeOnboardingAction, initial);

  function next() {
    setError(null);
    if (step === 2 && !preferredName.trim()) {
      setError("Please enter your preferred name to continue.");
      return;
    }
    if (step === 4 && confidence.some((c) => c === 0)) {
      setError("Please rate every statement before continuing.");
      return;
    }
    if (step === 5 && goals.length === 0) {
      setError("Please select at least one goal to continue.");
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  function toggleGoal(value: string) {
    if (goals.includes(value)) {
      setGoals(goals.filter((g) => g !== value));
    } else if (goals.length < 3) {
      setGoals([...goals, value]);
    }
  }

  function setConfidenceValue(idx: number, value: number) {
    const next = [...confidence];
    next[idx] = value;
    setConfidence(next);
  }

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-rise-muted">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="text-sm font-bold text-rise-navy">{progressPct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-rise-border">
          <div
            className="h-full rounded-full bg-rise-navy transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {(error || actionState.error) && (
        <Alert tone="error" className="mb-4">
          {error || actionState.error}
        </Alert>
      )}

      {/* Step 1 — Welcome */}
      {step === 1 && (
        <div className="rounded-2xl bg-rise-navy p-8 text-white">
          <p className="text-sm font-medium uppercase tracking-wider text-rise-blue-light">
            Welcome to
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            RISE USA
          </h1>
          <p className="mt-1 text-lg font-medium text-rise-blue-light">
            Roadmap to Income, Savings, and Equity
          </p>
          <p className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Build What Lasts.
          </p>
          <p className="mt-4 text-white/80">
            RISE USA helps you prepare for the real-world financial decisions
            you&apos;ll face after high school — income, banking, budgeting,
            credit, education, investing, transportation, housing, insurance,
            and financial protection.
          </p>
          <p className="mt-4 text-sm font-medium uppercase tracking-wider text-rise-blue">
            Start Small. Scale Smart. Stay Consistent.
          </p>
        </div>
      )}

      {/* Step 2 — Student Profile */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-rise-navy">Tell us about you</h2>
            <p className="mt-1 text-rise-muted">
              A few questions so we can personalize your experience. You can
              change these later.
            </p>
          </div>
          <Input
            name="preferred_name"
            label="Preferred name"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            placeholder="What should we call you?"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Grade level"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              options={[
                { value: "", label: "Select..." },
                { value: "9th", label: "9th grade" },
                { value: "10th", label: "10th grade" },
                { value: "11th", label: "11th grade" },
                { value: "12th", label: "12th grade" },
                { value: "college", label: "College / Post-secondary" },
                { value: "other", label: "Other" },
              ]}
            />
            <Input
              name="graduation_year"
              label="Graduation year"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="e.g. 2027"
            />
          </div>
          <Input
            name="school_or_program"
            label="School or program"
            value={schoolOrProgram}
            onChange={(e) => setSchoolOrProgram(e.target.value)}
            placeholder="e.g. Lincoln High School"
          />
          <Select
            label="What are you most interested in after graduation?"
            value={postGrad}
            onChange={(e) => setPostGrad(e.target.value)}
            options={[{ value: "", label: "Select..." }, ...POST_GRAD_OPTIONS]}
          />
          <p className="text-xs text-rise-muted">
            We will never ask for your Social Security number, bank information,
            household income, passwords, credit-report information, or other
            sensitive financial data.
          </p>
        </div>
      )}

      {/* Step 3 — How RISE Works */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-rise-navy">How RISE works</h2>
            <p className="mt-1 text-rise-muted">
              Here&apos;s what you&apos;ll experience in the RISE USA course.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              { icon: "📚", title: "Six Modules", body: "Each module covers a key area of personal finance — from income and banking to investing and protection." },
              { icon: "📖", title: "Lessons", body: "Bite-sized lessons with real-world examples, key terms, and practical explanations." },
              { icon: "🎯", title: "RISE Decision Labs", body: "Practice real financial decisions in a safe, fictional environment." },
              { icon: "✅", title: "Knowledge Checks", body: "Short quizzes to check your understanding — pass with 70% or higher." },
              { icon: "🤔", title: "Reflections", body: "Think about what you learned and how it applies to your life." },
              { icon: "💪", title: "Action Commitments", body: "Commit to one concrete step you&apos;ll take based on what you learned." },
              { icon: "📋", title: "My RISE Financial Blueprint", body: "Build a personalized financial plan, section by section, throughout the course." },
              { icon: "📝", title: "Final Assessment", body: "A comprehensive quiz covering all six modules." },
              { icon: "🏆", title: "Certificate of Completion", body: "Earn your RISE USA Certificate when you complete all requirements." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl border border-rise-border bg-white p-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-rise-navy">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-rise-muted">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 — Financial Starting Point */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-rise-navy">Financial starting point</h2>
            <p className="mt-1 text-rise-muted">
              Rate how confident you feel about each statement. This is not graded
              — it&apos;s just a starting point so you can see how far you&apos;ve
              come by the end.
            </p>
          </div>
          <div className="space-y-4">
            {CONFIDENCE_SURVEY_QUESTIONS.map((q, idx) => (
              <div key={idx} className="rounded-xl border border-rise-border bg-white p-4">
                <p className="text-sm font-medium text-rise-navy">{q}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-rise-muted">Not confident</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setConfidenceValue(idx, val)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition",
                          confidence[idx] === val
                            ? "border-rise-navy bg-rise-navy text-white"
                            : "border-rise-border bg-white text-rise-muted hover:border-rise-blue hover:bg-rise-sky"
                        )}
                        aria-label={`Confidence level ${val} of 5`}
                        aria-pressed={confidence[idx] === val}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-rise-muted">Very confident</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5 — My Goals */}
      {step === 5 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-rise-navy">My goals</h2>
            <p className="mt-1 text-rise-muted">
              Pick up to three things you most want to learn. We&apos;ll save
              these to your profile.
            </p>
            <p className="mt-1 text-xs font-medium text-rise-blue-dark">
              {goals.length} of 3 selected
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {LEARNING_GOAL_OPTIONS.map((opt) => {
              const checked = goals.includes(opt.value);
              const disabled = !checked && goals.length >= 3;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleGoal(opt.value)}
                  disabled={disabled}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition",
                    checked
                      ? "border-rise-navy bg-rise-sky text-rise-navy"
                      : "border-rise-border bg-white text-rise-muted hover:border-rise-blue hover:bg-rise-sky/50",
                    disabled && "opacity-40 cursor-not-allowed"
                  )}
                  aria-pressed={checked}
                >
                  <span className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs",
                    checked ? "border-rise-navy bg-rise-navy text-white" : "border-rise-border"
                  )}>
                    {checked && "✓"}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 6 — Course Start */}
      {step === 6 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-rise-navy">Your RISE journey starts here</h2>
            <p className="mt-1 text-rise-muted">
              Here&apos;s your six-module roadmap. Module 1 is ready to go!
            </p>
          </div>
          <div className="space-y-2">
            {modules.map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4",
                  i === 0
                    ? "border-rise-navy bg-rise-sky"
                    : "border-rise-border bg-white opacity-60"
                )}
              >
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                    Module {m.number}
                  </p>
                  <p className="text-sm font-bold text-rise-navy">
                    {m.title.split("—")[0].trim()}
                  </p>
                  <p className="text-xs text-rise-muted">{m.estimatedTime}</p>
                </div>
                {i === 0 ? (
                  <span className="rounded-full bg-rise-success-light px-3 py-1 text-xs font-semibold text-rise-success">
                    Ready
                  </span>
                ) : (
                  <span className="text-sm text-rise-muted">🔒 Locked</span>
                )}
              </div>
            ))}
          </div>

          {/* Hidden form for submission */}
          <form action={action} className="hidden" id="onboarding-form">
            <input type="hidden" name="preferred_name" value={preferredName} />
            <input type="hidden" name="grade_level" value={gradeLevel} />
            <input type="hidden" name="graduation_year" value={graduationYear} />
            <input type="hidden" name="school_or_program" value={schoolOrProgram} />
            <input type="hidden" name="post_graduation_interest" value={postGrad} />
            <input type="hidden" name="learning_goals" value={JSON.stringify(goals)} />
            <input
              type="hidden"
              name="starting_point_survey"
              value={JSON.stringify(
                CONFIDENCE_SURVEY_QUESTIONS.map((q, i) => ({ question: q, confidence: confidence[i] }))
              )}
            />
            <input type="hidden" name="demo_mode" value={supabaseConnected ? "false" : "true"} />
          </form>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={back} type="button">
            ← Back
          </Button>
        ) : (
          <span />
        )}
        {step < TOTAL_STEPS ? (
          <Button onClick={next} type="button" size="lg">
            Continue →
          </Button>
        ) : (
          <Button
            type="submit"
            form="onboarding-form"
            size="lg"
            loading={pending}
          >
            Start My RISE Journey →
          </Button>
        )}
      </div>
    </div>
  );
}
