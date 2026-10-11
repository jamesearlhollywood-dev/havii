"use client";

import { useState } from "react";
import { submitKnowledgeCheck } from "@/actions/progress";
import type { QuizQuestion } from "@/data/course-types";
import { Alert } from "@/components/ui/Alert";

export function KnowledgeCheck({
  moduleId,
  questions,
  passingScore,
  previousScore,
  previousPassed,
}: {
  moduleId: string;
  questions: QuizQuestion[];
  passingScore: number;
  previousScore: number | null;
  previousPassed: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setAnswer(qId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }

  function toggleMulti(qId: string, value: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? prev[qId] as string[] : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [qId]: next };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await submitKnowledgeCheck(moduleId, answers);
      setResult(res);
      setSubmitted(true);
    } catch (e) {
      setResult({ score: 0, passed: false });
    }
    setSubmitting(false);
  }

  function handleRetake() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }

  const allAnswered = questions.every((q) => {
    const a = answers[q.id];
    if (q.type === "multiple_select") return Array.isArray(a) && a.length > 0;
    if (q.type === "matching") return Array.isArray(a) && a.length === (q.matches?.length ?? 0);
    return a !== undefined && a !== "";
  });

  if (submitted && result) {
    return (
      <div className="space-y-6">
        <div className={`rounded-2xl border p-6 text-center ${result.passed ? "border-rise-success/30 bg-rise-success-light" : "border-rise-warning/30 bg-rise-warning-light"}`}>
          <div className="text-4xl">{result.passed ? "🎉" : "📚"}</div>
          <p className="mt-2 text-3xl font-bold text-rise-navy">{result.score}%</p>
          <p className="mt-1 text-sm text-rise-muted">
            {result.passed
              ? "Congratulations! You passed the knowledge check."
              : `You need ${passingScore}% to pass. Review the lessons and try again.`}
          </p>
        </div>

        {/* Review answers */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-rise-navy">Review Your Answers</h3>
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = q.type === "multiple_select"
              ? JSON.stringify((Array.isArray(userAnswer) ? userAnswer : []).sort()) === JSON.stringify((Array.isArray(q.correctAnswer) ? q.correctAnswer : []).sort())
              : q.type === "matching"
              ? q.matches?.every((m, j) => (Array.isArray(userAnswer) ? userAnswer[j] : "") === m.right)
              : userAnswer === q.correctAnswer;

            return (
              <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? "border-rise-success/30 bg-rise-success-light/50" : "border-red-200 bg-red-50/50"}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">{isCorrect ? "✓" : "✗"}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-rise-navy">{i + 1}. {q.question}</p>
                    <p className="mt-1 text-xs text-rise-muted">
                      Your answer: {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || "—"}
                    </p>
                    {!isCorrect && (
                      <p className="mt-0.5 text-xs font-medium text-rise-success">
                        Correct: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : q.correctAnswer || q.matches?.map((m) => `${m.left}→${m.right}`).join(", ")}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="mt-1 text-xs text-rise-muted">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRetake}
            className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
          >
            Retake Quiz
          </button>
          <a
            href={`/course/module/${moduleId}`}
            className="rounded-xl bg-rise-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rise-navy-light"
          >
            Back to Module
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {previousScore !== null && (
        <Alert tone={previousPassed ? "success" : "warning"}>
          Previous best score: {previousScore}% {previousPassed ? "(Passed)" : "(Retake needed)"}
        </Alert>
      )}

      <Alert tone="info">
        You need {passingScore}% to pass. You can retake this quiz as many times as needed.
      </Alert>

      {questions.map((q, i) => (
        <div key={q.id} className="rounded-2xl border border-rise-border bg-white p-5">
          <div className="mb-3 flex items-start gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rise-navy text-xs font-bold text-white">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wider text-rise-red">
                {q.type.replace(/_/g, " ")}
              </p>
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
                    answers[q.id] === opt
                      ? "border-rise-blue bg-rise-sky"
                      : "border-rise-border hover:bg-rise-sky/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
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
                    (Array.isArray(answers[q.id]) && answers[q.id].includes(opt))
                      ? "border-rise-blue bg-rise-sky"
                      : "border-rise-border hover:bg-rise-sky/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={q.id}
                    value={opt}
                    checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)}
                    onChange={() => toggleMulti(q.id, opt)}
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
                    value={(Array.isArray(answers[q.id]) ? answers[q.id][j] : "") as string}
                    onChange={(e) => {
                      const current = Array.isArray(answers[q.id]) ? answers[q.id] as string[] : [];
                      const next = [...current];
                      next[j] = e.target.value;
                      setAnswer(q.id, next);
                    }}
                    className="flex-1 rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
                  >
                    <option value="">Select...</option>
                    {q.matches?.map((m2) => (
                      <option key={m2.right} value={m2.right}>{m2.right}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allAnswered || submitting}
        className="w-full rounded-xl bg-rise-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-rise-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Answers"}
      </button>
      {!allAnswered && (
        <p className="text-center text-xs text-rise-muted">Answer all questions to submit.</p>
      )}
    </div>
  );
}
