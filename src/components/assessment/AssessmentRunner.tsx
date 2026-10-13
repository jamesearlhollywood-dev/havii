"use client";

import { useState, useMemo } from "react";
import { submitAssessment } from "@/actions/assessment";
import type { SafeQuestion, AssessmentResult } from "@/lib/assessment-scoring";
import { TOPIC_LABELS, DIFFICULTY_LABELS } from "@/data/assessment-types";
import { Alert } from "@/components/ui/Alert";

interface AssessmentRunnerProps {
  assessmentId: string;
  questions: SafeQuestion[];
  passingScore: number;
  feedbackMode: "immediate" | "after_submit";
  previousScore: number | null;
  previousPassed: boolean;
  maxRetakes: number | null;
  previousAttempts: number;
  hideAnswerKey?: boolean;
  showModuleBreakdown?: boolean;
  moduleLinks?: Record<string, string>;
  assessmentTitle?: string;
  assessmentSubtitle?: string;
}

export function AssessmentRunner({
  assessmentId,
  questions,
  passingScore,
  feedbackMode,
  previousScore,
  previousPassed,
  maxRetakes,
  previousAttempts,
  hideAnswerKey = false,
  showModuleBreakdown = false,
  moduleLinks = {},
  assessmentTitle,
  assessmentSubtitle,
}: AssessmentRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [immediateFeedback, setImmediateFeedback] = useState<
    Record<string, "correct" | "incorrect" | undefined>
 >({});

  const canRetake = maxRetakes === null || previousAttempts < maxRetakes;

  function setAnswer(qId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }

  function toggleMulti(qId: string, value: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? (prev[qId] as string[]) : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [qId]: next };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await submitAssessment(assessmentId, answers);
      setResult(res);
      setSubmitted(true);
    } catch {
      setResult({
        score: 0,
        percentage: 0,
        passed: false,
        totalPoints: 0,
        earnedPoints: 0,
        questionResults: [],
        reviewAreas: [],
      });
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  function handleRetake() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setCurrentIdx(0);
    setImmediateFeedback({});
  }

  const allAnswered = questions.every((q) => {
    const a = answers[q.id];
    if (q.type === "multiple_select") return Array.isArray(a) && a.length > 0;
    if (q.type === "matching") return Array.isArray(a) && a.length === (q.matches?.length ?? 0);
    return a !== undefined && a !== "";
  });

  // --- Results View ---
  if (submitted && result) {
    // Compute module breakdown for final assessment
    const moduleBreakdown = showModuleBreakdown
      ? (() => {
          const byModule: Record<string, { earned: number; total: number; count: number; correct: number }> = {};
          for (const qr of result.questionResults) {
            const mid = qr.moduleId || "unknown";
            if (!byModule[mid]) byModule[mid] = { earned: 0, total: 0, count: 0, correct: 0 };
            byModule[mid].total += qr.points;
            byModule[mid].earned += qr.earnedPoints;
            byModule[mid].count += 1;
            if (qr.correct) byModule[mid].correct += 1;
          }
          return Object.entries(byModule).map(([mid, data]) => ({
            moduleId: mid,
            percentage: data.total > 0 ? Math.round((data.earned / data.total) * 100) : 0,
            correct: data.correct,
            total: data.count,
          }));
        })()
      : [];

    return (
      <div className="space-y-6">
        {/* Score header */}
        <div
          className={`rounded-2xl border p-6 text-center ${
            result.passed
              ? "border-rise-success/30 bg-rise-success-light"
              : "border-rise-warning/30 bg-rise-warning-light"
          }`}
        >
          <div className="text-4xl">{result.passed ? "🎉" : "📚"}</div>
          {result.passed ? (
            <p className="mt-2 text-xl font-bold text-rise-success">Final Assessment Passed</p>
          ) : (
            <p className="mt-2 text-xl font-bold text-rise-warning">Not Yet — Keep Going</p>
          )}
          <p className="mt-2 text-3xl font-bold text-rise-navy">{result.percentage}%</p>
          <p className="mt-1 text-sm text-rise-muted">
            {result.passed
              ? "Congratulations! You passed."
              : `You need ${passingScore}% to pass.`}
          </p>
          <p className="mt-1 text-xs text-rise-muted">
            {result.earnedPoints} / {result.totalPoints} points
          </p>
        </div>

        {/* Module breakdown for final assessment */}
        {showModuleBreakdown && moduleBreakdown.length > 0 && (
          <div className="rounded-2xl border border-rise-border bg-white p-5">
            <h3 className="text-sm font-bold text-rise-navy">Performance by Module</h3>
            <div className="mt-3 space-y-2">
              {moduleBreakdown.map((mb) => {
                const mod = moduleLinks[mb.moduleId];
                const passed = mb.percentage >= passingScore;
                return (
                  <div key={mb.moduleId} className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${passed ? "bg-rise-success text-white" : "bg-rise-warning-light text-rise-warning"}`}>
                      {passed ? "✓" : "!"}
                    </span>
                    <span className="flex-1 text-sm text-rise-navy">
                      {mb.moduleId === "module-1" ? "Module 1: Income & Banking" :
                       mb.moduleId === "module-2" ? "Module 2: Budgeting & Saving" :
                       mb.moduleId === "module-3" ? "Module 3: Credit & Borrowing" :
                       mb.moduleId === "module-4" ? "Module 4: Education Financing" :
                       mb.moduleId === "module-5" ? "Module 5: Investing" :
                       mb.moduleId === "module-6" ? "Module 6: Cars, Housing & Protection" :
                       mb.moduleId}
                    </span>
                    <span className={`text-sm font-bold ${passed ? "text-rise-success" : "text-rise-warning"}`}>
                      {mb.correct}/{mb.total} · {mb.percentage}%
                    </span>
                    {mod && !passed && (
                      <a href={mod} className="text-xs font-medium text-rise-blue hover:underline">
                        Review →
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Topics to review for failed attempts */}
        {!result.passed && result.reviewAreas.length > 0 && (
          <div className="rounded-2xl border border-rise-warning/30 bg-white p-5">
            <p className="text-sm font-bold text-rise-navy">
              You&apos;re not finished yet. Review the areas below, then try again.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.reviewAreas.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-rise-warning-light px-3 py-1 text-xs font-medium text-rise-warning"
                >
                  {TOPIC_LABELS[topic as keyof typeof TOPIC_LABELS] || topic}
                </span>
              ))}
            </div>
            {/* Links back to relevant modules */}
            {showModuleBreakdown && moduleBreakdown.filter((m) => m.percentage < passingScore).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {moduleBreakdown
                  .filter((m) => m.percentage < passingScore && moduleLinks[m.moduleId])
                  .map((m) => (
                    <a
                      key={m.moduleId}
                      href={moduleLinks[m.moduleId]}
                      className="rounded-xl border border-rise-border bg-rise-sky px-4 py-2 text-xs font-semibold text-rise-navy hover:bg-rise-sky/70"
                    >
                      Review {m.moduleId.replace("module-", "Module ")} →
                    </a>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Question-by-question review (hidden when hideAnswerKey is true and not passed) */}
        {(!hideAnswerKey || result.passed) && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-rise-navy">Review Your Answers</h3>
            {questions.map((q, i) => {
              const qr = result.questionResults.find((r) => r.questionId === q.id);
              if (!qr) return null;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-4 ${
                    qr.correct
                      ? "border-rise-success/30 bg-rise-success-light/50"
                      : "border-red-200 bg-red-50/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{qr.correct ? "✓" : "✗"}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-rise-navy">
                        {i + 1}. {q.question}
                      </p>
                      <p className="mt-1 text-xs text-rise-muted">
                        Your answer:{" "}
                        {Array.isArray(qr.userAnswer)
                          ? qr.userAnswer.join(", ")
                          : qr.userAnswer || "—"}
                      </p>
                      {!qr.correct && (
                        <p className="mt-0.5 text-xs font-medium text-rise-success">
                          Correct:{" "}
                          {Array.isArray(qr.correctAnswer)
                            ? qr.correctAnswer.join(", ")
                            : qr.correctAnswer || "—"}
                        </p>
                      )}
                      {qr.explanation && (
                        <p className="mt-1 text-xs text-rise-muted">{qr.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* When answer key is hidden, show a note */}
        {hideAnswerKey && !result.passed && (
          <div className="rounded-xl border border-rise-border bg-rise-sky p-4 text-center">
            <p className="text-sm text-rise-muted">
              The full answer key is not shown before a retake. Review the module links above, study the topics, then try again.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {canRetake && !result.passed && (
            <button
              type="button"
              onClick={handleRetake}
              className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
            >
              Retake Assessment
            </button>
          )}
          {!canRetake && (
            <p className="text-sm text-rise-muted">
              Maximum retakes ({maxRetakes}) reached.
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- Taking View ---
  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const isImmediate = feedbackMode === "immediate";

  return (
    <div className="space-y-6">
      {previousScore !== null && (
        <Alert tone={previousPassed ? "success" : "warning"}>
          Previous best score: {previousScore}% {previousPassed ? "(Passed)" : "(Retake needed)"}
        </Alert>
      )}

      <Alert tone="info">
        You need {passingScore}% to pass.
        {maxRetakes === null
          ? " You can retake this assessment as many times as needed."
          : ` You have ${maxRetakes - previousAttempts} retake(s) remaining.`}
      </Alert>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-rise-border">
          <div
            className="h-full rounded-full bg-rise-blue transition-all"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-rise-muted">
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      {/* Current question */}
      <QuestionInput
        question={currentQ}
        index={currentIdx}
        answer={answers[currentQ.id]}
        feedback={immediateFeedback[currentQ.id]}
        onAnswer={(val) => {
          setAnswer(currentQ.id, val);
          if (isImmediate) {
            // For immediate mode, we'd need server-side checking
            // For now, just mark as answered
            setImmediateFeedback((prev) => ({
              ...prev,
              [currentQ.id]: "correct", // placeholder — actual grading happens on submit
            }));
          }
        }}
        onToggleMulti={(val) => toggleMulti(currentQ.id, val)}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="rounded-xl border border-rise-border bg-white px-4 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="rounded-xl bg-rise-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Assessment"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
            disabled={!answers[currentQ.id]}
            className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        )}
      </div>

      {!allAnswered && isLast && (
        <p className="text-center text-xs text-rise-muted">
          Answer all questions to submit.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question Input — renders the appropriate input for each question type
// ---------------------------------------------------------------------------
function QuestionInput({
  question: q,
  index,
  answer,
  feedback,
  onAnswer,
  onToggleMulti,
}: {
  question: SafeQuestion;
  index: number;
  answer: string | string[] | undefined;
  feedback?: "correct" | "incorrect";
  onAnswer: (val: string | string[]) => void;
  onToggleMulti: (val: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-rise-border bg-white p-5">
      <div className="mb-3 flex items-start gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rise-navy text-xs font-bold text-white">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
              {q.type.replace(/_/g, " ")}
            </p>
            <span className="rounded-full bg-rise-sky px-2 py-0.5 text-[10px] font-medium text-rise-muted">
              {DIFFICULTY_LABELS[q.difficulty]}
            </span>
            <span className="text-xs text-rise-muted">{q.points} pt</span>
          </div>
          <p className="mt-1 text-[15px] font-medium text-rise-navy">{q.question}</p>
        </div>
      </div>

      {/* Multiple choice / True-False / Scenario */}
      {(q.type === "multiple_choice" || q.type === "true_false" || q.type === "scenario") && (
        <div className="ml-9 space-y-2">
          {q.options?.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition ${
                answer === opt
                  ? "border-rise-blue bg-rise-sky"
                  : "border-rise-border hover:bg-rise-sky/50"
              }`}
            >
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={answer === opt}
                onChange={(e) => onAnswer(e.target.value)}
                className="accent-rise-navy"
              />
              <span className="text-rise-navy">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {/* Multiple select */}
      {q.type === "multiple_select" && (
        <div className="ml-9 space-y-2">
          {q.options?.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition ${
                Array.isArray(answer) && answer.includes(opt)
                  ? "border-rise-blue bg-rise-sky"
                  : "border-rise-border hover:bg-rise-sky/50"
              }`}
            >
              <input
                type="checkbox"
                name={q.id}
                value={opt}
                checked={Array.isArray(answer) && answer.includes(opt)}
                onChange={() => onToggleMulti(opt)}
                className="accent-rise-navy"
              />
              <span className="text-rise-navy">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {/* Matching */}
      {q.type === "matching" && q.matches && (
        <div className="ml-9 space-y-2">
          {q.matches.map((m, j) => (
            <div key={j} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="flex-1 text-sm text-rise-navy">{m.left}</span>
              <span className="text-rise-muted">→</span>
              <select
                value={(Array.isArray(answer) ? answer[j] : "") as string}
                onChange={(e) => {
                  const current = Array.isArray(answer) ? (answer as string[]) : [];
                  const next = [...current];
                  next[j] = e.target.value;
                  onAnswer(next);
                }}
                className="flex-1 rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
              >
                <option value="">Select...</option>
                {q.matches?.map((m2) => (
                  <option key={m2.right} value={m2.right}>
                    {m2.right}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Fill in the blank */}
      {q.type === "fill_in_blank" && (
        <div className="ml-9">
          <input
            type="text"
            value={(answer as string) || ""}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="w-full rounded-lg border border-rise-border bg-white px-4 py-2.5 text-sm text-rise-navy"
          />
        </div>
      )}

      {/* Short answer */}
      {q.type === "short_answer" && (
        <div className="ml-9">
          <textarea
            value={(answer as string) || ""}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Write your answer..."
            rows={4}
            className="w-full rounded-lg border border-rise-border bg-white px-4 py-2.5 text-sm text-rise-navy"
          />
        </div>
      )}

      {/* Calculation */}
      {q.type === "calculation" && (
        <div className="ml-9">
          <div className="flex items-center gap-2">
            <span className="text-sm text-rise-muted">{q.unit || "$"}</span>
            <input
              type="number"
              step="any"
              value={(answer as string) || ""}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="w-full rounded-lg border border-rise-border bg-white px-4 py-2.5 text-sm text-rise-navy"
            />
          </div>
        </div>
      )}
    </div>
  );
}
