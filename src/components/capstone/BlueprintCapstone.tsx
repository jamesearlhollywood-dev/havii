"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import {
  saveCapstoneData,
  confirmBlueprintReview,
  ACTION_PLAN_CATEGORIES,
  ACTION_PLAN_STATUSES,
  SUGGESTED_MONEY_RULES,
  type ActionPlanItem,
  type CapstoneData,
} from "@/actions/capstone";
import { cn } from "@/lib/utils";

interface BlueprintSectionData {
  number: number;
  title: string;
  moduleIcon: string;
  moduleTitle: string;
  fields: { id: string; label: string }[];
  data: Record<string, unknown> | null;
  completed: boolean;
}

interface BlueprintCapstoneProps {
  sections: BlueprintSectionData[];
  initialCapstoneData: CapstoneData;
  studentName: string;
  onCommitmentConfirmed: () => void;
}

export function BlueprintCapstone({
  sections,
  initialCapstoneData,
  studentName,
  onCommitmentConfirmed,
}: BlueprintCapstoneProps) {
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>(
    initialCapstoneData.actionPlan.length > 0
      ? initialCapstoneData.actionPlan
      : [createEmptyAction()],
  );
  const [topPriorities, setTopPriorities] = useState<string[]>(initialCapstoneData.topPriorities);
  const [moneyRules, setMoneyRules] = useState<string[]>(
    initialCapstoneData.moneyRules.length > 0
      ? initialCapstoneData.moneyRules
      : [...SUGGESTED_MONEY_RULES.slice(0, 5)],
  );
  const [finalReflection, setFinalReflection] = useState(initialCapstoneData.finalReflection);
  const [commitmentConfirmed, setCommitmentConfirmed] = useState(initialCapstoneData.commitmentConfirmed);
  const [reviewChecked, setReviewChecked] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [confirming, setConfirming] = useState(false);

  // Autosave
  const autosave = useCallback((data: Partial<CapstoneData>) => {
    setSaved("saving");
    saveCapstoneData(data)
      .then(() => {
        setSaved("saved");
        setTimeout(() => setSaved("idle"), 2000);
      })
      .catch(() => setSaved("idle"));
  }, []);

  // Debounced autosave for text fields
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  function debouncedSave(data: Partial<CapstoneData>) {
    if (saveTimer) clearTimeout(saveTimer);
    const t = setTimeout(() => autosave(data), 1500);
    setSaveTimer(t);
  }

  useEffect(() => {
    return () => { if (saveTimer) clearTimeout(saveTimer); };
  }, [saveTimer]);

  // --- Action Plan ---
  function createEmptyAction(): ActionPlanItem {
    return { goal: "", whyItMatters: "", targetDate: "", firstStep: "", status: "Not Started", category: "" };
  }

  function updateAction(idx: number, field: keyof ActionPlanItem, value: string) {
    const next = [...actionPlan];
    next[idx] = { ...next[idx], [field]: value };
    setActionPlan(next);
    debouncedSave({ actionPlan: next });
  }

  function addAction() {
    if (actionPlan.length >= 6) return;
    const next = [...actionPlan, createEmptyAction()];
    setActionPlan(next);
  }

  function removeAction(idx: number) {
    if (actionPlan.length <= 1) return;
    const next = actionPlan.filter((_, i) => i !== idx);
    setActionPlan(next);
    debouncedSave({ actionPlan: next });
  }

  // --- Priorities ---
  function togglePriority(value: string) {
    const next = topPriorities.includes(value)
      ? topPriorities.filter((v) => v !== value)
      : topPriorities.length < 3
        ? [...topPriorities, value]
        : topPriorities;
    setTopPriorities(next);
    debouncedSave({ topPriorities: next });
  }

  // --- Money Rules ---
  function updateRule(idx: number, value: string) {
    const next = [...moneyRules];
    next[idx] = value;
    setMoneyRules(next);
    debouncedSave({ moneyRules: next });
  }

  function addRule() {
    const next = [...moneyRules, ""];
    setMoneyRules(next);
  }

  function removeRule(idx: number) {
    if (moneyRules.length <= 5) return;
    const next = moneyRules.filter((_, i) => i !== idx);
    setMoneyRules(next);
    debouncedSave({ moneyRules: next });
  }

  function addSuggestedRule(rule: string) {
    if (moneyRules.includes(rule)) return;
    const next = [...moneyRules, rule];
    setMoneyRules(next);
    debouncedSave({ moneyRules: next });
  }

  // --- Reflection ---
  function updateReflection(value: string) {
    setFinalReflection(value);
    debouncedSave({ finalReflection: value });
  }

  // --- Commitment ---
  async function handleConfirm() {
    if (!reviewChecked) return;
    if (moneyRules.filter((r) => r.trim()).length < 5) return;
    setConfirming(true);
    try {
      await confirmBlueprintReview();
      await saveCapstoneData({ commitmentConfirmed: true, moneyRules, actionPlan, topPriorities, finalReflection });
      setCommitmentConfirmed(true);
      setTimeout(() => onCommitmentConfirmed(), 1000);
    } catch {
      // ignore
    }
    setConfirming(false);
  }

  const allSectionsComplete = sections.every((s) => s.completed);
  const rulesValid = moneyRules.filter((r) => r.trim()).length >= 5;
  const completionDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-8">
      {/* Save indicator */}
      <div className="no-print flex items-center justify-end text-xs text-rise-muted">
        {saved === "saving" && "Saving..."}
        {saved === "saved" && "✓ Saved"}
      </div>

      {/* Printable Cover */}
      <div className="print-only hidden print:block rounded-2xl bg-rise-navy p-8 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rise-blue-light">RISE USA</p>
        <h1 className="mt-2 text-3xl font-bold">My 12-Month Financial Blueprint</h1>
        <p className="mt-2 text-lg text-white/80">{studentName}</p>
        <p className="mt-1 text-sm text-white/60">{completionDate}</p>
        <p className="mt-4 text-xl font-bold text-rise-blue">Build What Lasts.</p>
      </div>

      {/* Section 1–6: Combined Blueprint */}
      <div className="space-y-4">
        <div className="no-print">
          <h2 className="text-2xl font-bold text-rise-navy">My 12-Month RISE Financial Blueprint</h2>
          <p className="mt-1 text-sm text-rise-muted">
            Your six module Blueprint sections are combined below. This is your personalized financial plan.
          </p>
        </div>

        {sections.map((s) => (
          <div key={s.number} className="print-page rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rise-sky text-xl">
                {s.moduleIcon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                  Section {s.number}
                </p>
                <h3 className="text-base font-bold text-rise-navy">{s.title}</h3>
              </div>
            </div>
            <div className="space-y-1.5">
              {s.fields.map((f) => (
                <div key={f.id} className="flex justify-between border-b border-rise-border pb-1 text-sm">
                  <span className="text-rise-muted">{f.label}</span>
                  <span className="font-medium text-rise-navy text-right">
                    {s.data ? String(s.data[f.id] ?? "—") : "—"}
                  </span>
                </div>
              ))}
              {!s.completed && (
                <p className="mt-2 text-xs font-medium text-rise-warning">
                  ⚠ This section is not yet complete. Visit the Blueprint page to finish it.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* My Next 12 Months — Action Plan */}
      <div className="rounded-2xl border-2 border-rise-blue-light bg-rise-sky/30 p-6">
        <h2 className="text-xl font-bold text-rise-navy">My Next 12 Months</h2>
        <p className="mt-1 text-sm text-rise-muted">
          Identify up to 6 actions you'll take in the next 12 months. {actionPlan.length} of 6 actions.
        </p>

        <div className="mt-4 space-y-4">
          {actionPlan.map((action, idx) => (
            <div key={idx} className="rounded-xl border border-rise-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rise-navy text-xs font-bold text-white">
                  {idx + 1}
                </span>
                {actionPlan.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAction(idx)}
                    className="text-xs text-rise-muted hover:text-rise-red"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Goal / Action"
                  value={action.goal}
                  onChange={(e) => updateAction(idx, "goal", e.target.value)}
                  placeholder="e.g. Open a savings account"
                />
                <Select
                  label="Category"
                  value={action.category}
                  onChange={(e) => updateAction(idx, "category", e.target.value)}
                  options={[{ value: "", label: "Select..." }, ...ACTION_PLAN_CATEGORIES.map((c) => ({ value: c, label: c }))]}
                />
                <Input
                  label="Why It Matters"
                  value={action.whyItMatters}
                  onChange={(e) => updateAction(idx, "whyItMatters", e.target.value)}
                  placeholder="Why is this important to you?"
                />
                <Input
                  label="Target Date"
                  type="date"
                  value={action.targetDate}
                  onChange={(e) => updateAction(idx, "targetDate", e.target.value)}
                />
                <Input
                  label="First Step"
                  value={action.firstStep}
                  onChange={(e) => updateAction(idx, "firstStep", e.target.value)}
                  placeholder="What's the first thing you'll do?"
                />
                <Select
                  label="Progress Status"
                  value={action.status}
                  onChange={(e) => updateAction(idx, "status", e.target.value)}
                  options={ACTION_PLAN_STATUSES.map((s) => ({ value: s, label: s }))}
                />
              </div>
            </div>
          ))}
        </div>

        {actionPlan.length < 6 && (
          <button
            type="button"
            onClick={addAction}
            className="mt-4 rounded-xl border border-dashed border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            + Add Action ({actionPlan.length}/6)
          </button>
        )}
      </div>

      {/* My Top 3 Priorities */}
      <div className="rounded-2xl border border-rise-border bg-white p-6">
        <h2 className="text-xl font-bold text-rise-navy">My Top 3 Priorities</h2>
        <p className="mt-1 text-sm text-rise-muted">
          Choose your three most important financial priorities for the next 12 months.
          <span className="ml-1 font-medium text-rise-blue-dark">{topPriorities.length} of 3 selected</span>
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACTION_PLAN_CATEGORIES.map((cat) => {
            const checked = topPriorities.includes(cat);
            const disabled = !checked && topPriorities.length >= 3;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => togglePriority(cat)}
                disabled={disabled}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition",
                  checked
                    ? "border-rise-navy bg-rise-sky text-rise-navy"
                    : "border-rise-border bg-white text-rise-muted hover:border-rise-blue hover:bg-rise-sky/50",
                  disabled && "opacity-40 cursor-not-allowed",
                )}
                aria-pressed={checked}
              >
                <span className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs",
                  checked ? "border-rise-navy bg-rise-navy text-white" : "border-rise-border",
                )}>
                  {checked && "✓"}
                </span>
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* My RISE Money Rules */}
      <div className="rounded-2xl border border-rise-border bg-white p-6">
        <h2 className="text-xl font-bold text-rise-navy">My RISE Money Rules</h2>
        <p className="mt-1 text-sm text-rise-muted">
          Create or confirm at least five personal rules. You can edit these in your own words.
          <span className={cn("ml-1 font-medium", rulesValid ? "text-rise-success" : "text-rise-warning")}>
            {moneyRules.filter((r) => r.trim()).length} of 5 minimum
          </span>
        </p>

        <div className="mt-4 space-y-2">
          {moneyRules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="mt-2.5 text-sm font-bold text-rise-muted">{idx + 1}.</span>
              <input
                type="text"
                value={rule}
                onChange={(e) => updateRule(idx, e.target.value)}
                placeholder="Write your personal money rule..."
                className="flex-1 rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-sm text-rise-navy placeholder:text-rise-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-rise-blue"
              />
              {moneyRules.length > 5 && (
                <button
                  type="button"
                  onClick={() => removeRule(idx)}
                  className="mt-2.5 text-xs text-rise-muted hover:text-rise-red"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRule}
          className="mt-3 rounded-xl border border-dashed border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
        >
          + Add Rule
        </button>

        {/* Suggested rules that aren't already added */}
        {SUGGESTED_MONEY_RULES.filter((r) => !moneyRules.includes(r)).length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-rise-muted">Suggested rules you can add:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTED_MONEY_RULES.filter((r) => !moneyRules.includes(r)).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => addSuggestedRule(r)}
                  className="rounded-lg border border-rise-border bg-rise-sky/30 px-3 py-1.5 text-xs text-rise-navy hover:bg-rise-sky"
                >
                  + {r}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Final Reflection */}
      <div className="rounded-2xl border border-rise-border bg-white p-6">
        <h2 className="text-xl font-bold text-rise-navy">Final Reflection</h2>
        <p className="mt-1 text-sm font-medium text-rise-navy">
          What is the most important financial lesson you are taking from RISE USA, and how do you plan to use it during the next 12 months?
        </p>
        <Textarea
          value={finalReflection}
          onChange={(e) => updateReflection(e.target.value)}
          placeholder="Write your reflection here..."
          className="mt-3 min-h-[120px]"
        />
      </div>

      {/* My RISE Commitment */}
      <div className="rounded-2xl border-2 border-rise-navy bg-rise-navy p-6 text-white">
        <h2 className="text-xl font-bold">My RISE Commitment</h2>
        <blockquote className="mt-3 border-l-2 border-rise-blue pl-4 text-lg font-medium text-white/90">
          I understand that my financial plan can change as my life changes. My goal is not to have everything figured out today. My goal is to make informed decisions, review my progress, ask questions, understand what I sign, and build what lasts.
        </blockquote>

        {commitmentConfirmed ? (
          <div className="mt-4 rounded-xl bg-rise-success/20 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-white">✓ You have reviewed your RISE Financial Blueprint.</p>
          </div>
        ) : (
          <>
            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={reviewChecked}
                onChange={(e) => setReviewChecked(e.target.checked)}
                className="h-5 w-5 accent-rise-blue"
              />
              <span className="text-sm text-white/90">
                I have reviewed my RISE Financial Blueprint.
              </span>
            </label>
            <p className="mt-2 text-xs text-white/50">
              This confirms you have reviewed your blueprint. It is not a legally binding signature.
            </p>

            {!rulesValid && reviewChecked && (
              <p className="mt-2 text-xs text-rise-warning-light">
                You need at least 5 Money Rules before confirming.
              </p>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!reviewChecked || !rulesValid || confirming}
              className="mt-4 rounded-xl bg-rise-blue px-6 py-2.5 text-sm font-semibold text-white hover:bg-rise-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirming ? "Confirming..." : "Confirm My Commitment →"}
            </button>
          </>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-rise-muted">
        For educational planning purposes. This document does not constitute individualized financial, legal, tax, or investment advice.
      </p>

      {/* Export buttons */}
      <div className="no-print flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
        >
          Print / Export PDF
        </button>
      </div>

      {/* Print-only CSS */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-page { break-inside: avoid; page-break-inside: avoid; }
          body { background: white; }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>
    </div>
  );
}
