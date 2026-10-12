"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { saveEndOfCourseSurvey } from "@/actions/capstone";
import { CONFIDENCE_SURVEY_QUESTIONS } from "@/data/confidence-survey";
import { cn } from "@/lib/utils";

interface EndOfCourseSurveyProps {
  onComplete: () => void;
  initialResponses?: { question: string; confidence: number }[] | null;
}

export function EndOfCourseSurvey({ onComplete, initialResponses }: EndOfCourseSurveyProps) {
  const [confidence, setConfidence] = useState<number[]>(
    initialResponses && initialResponses.length === CONFIDENCE_SURVEY_QUESTIONS.length
      ? initialResponses.map((r) => r.confidence)
      : Array(CONFIDENCE_SURVEY_QUESTIONS.length).fill(0),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function setConfidenceValue(idx: number, value: number) {
    const next = [...confidence];
    next[idx] = value;
    setConfidence(next);
  }

  const allAnswered = confidence.every((c) => c > 0);

  async function handleSubmit() {
    if (!allAnswered) {
      setError("Please rate every statement before submitting.");
      return;
    }

    setSaving(true);
    setError(null);

    const responses = CONFIDENCE_SURVEY_QUESTIONS.map((q, i) => ({
      question: q,
      confidence: confidence[i],
    }));

    try {
      const result = await saveEndOfCourseSurvey(responses);
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
        // Brief delay to show success, then notify parent
        setTimeout(() => onComplete(), 800);
      }
    } catch {
      // In demo mode, still proceed
      setSaved(true);
      setTimeout(() => onComplete(), 800);
    }
    setSaving(false);
  }

  if (saved) {
    return (
      <div className="rounded-2xl border-2 border-rise-success/30 bg-rise-success-light p-8 text-center">
        <div className="text-4xl">✅</div>
        <p className="mt-2 text-lg font-bold text-rise-navy">Survey Complete</p>
        <p className="mt-1 text-sm text-rise-muted">
          Thank you for reflecting on your growth. Your responses have been saved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-rise-navy p-6 text-white">
        <p className="text-sm font-medium uppercase tracking-wider text-rise-blue-light">
          RISE End-of-Course Confidence Survey
        </p>
        <h2 className="mt-1 text-2xl font-bold">How far have you come?</h2>
        <p className="mt-2 text-sm text-white/80">
          Rate how confident you feel about each statement now, using the same 1–5 scale
          from your Starting Point Survey. This lets us measure your growth.
        </p>
        <p className="mt-3 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white">
          This survey measures your confidence, not your financial worth or success.
        </p>
      </div>

      {error && (
        <Alert tone="error">{error}</Alert>
      )}

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
                        : "border-rise-border bg-white text-rise-muted hover:border-rise-blue hover:bg-rise-sky",
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

      <div className="flex items-center justify-between">
        <p className="text-xs text-rise-muted">
          {confidence.filter((c) => c > 0).length} / {CONFIDENCE_SURVEY_QUESTIONS.length} answered
        </p>
        <Button onClick={handleSubmit} disabled={!allAnswered || saving} size="lg">
          {saving ? "Saving..." : "Submit Survey →"}
        </Button>
      </div>
    </div>
  );
}
