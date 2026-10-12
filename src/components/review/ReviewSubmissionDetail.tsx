"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { submitReviewAction } from "@/actions/reviews";
import { formatDate } from "@/lib/utils";
import type { Submission, SubmissionVersion, Rubric, RubricResult, PerformanceLevel } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  not_submitted: "Not Submitted",
  submitted: "Submitted",
  in_review: "In Review",
  feedback_provided: "Feedback Provided",
  revision_requested: "Revision Requested",
  resubmitted: "Resubmitted",
  completed: "Completed",
};

const TYPE_LABELS: Record<string, string> = {
  decision_lab: "Decision Lab",
  workbook: "Workbook",
  reflection: "Reflection",
  action_commitment: "Action Commitment",
  short_answer: "Short Answer",
  blueprint_section: "Blueprint Section",
  final_capstone: "Final Capstone",
};

const LEVEL_OPTIONS: { value: PerformanceLevel; label: string }[] = [
  { value: "beginning", label: "Beginning" },
  { value: "developing", label: "Developing" },
  { value: "proficient", label: "Proficient" },
  { value: "strong", label: "Strong" },
];

export function ReviewSubmissionDetail({
  submission,
  versions,
  rubric,
}: {
  submission: Submission;
  versions: SubmissionVersion[];
  rubric: Rubric | null;
}) {
  const [feedback, setFeedback] = useState(submission.instructor_feedback ?? "");
  const [privateNotes, setPrivateNotes] = useState(submission.private_instructor_notes ?? "");
  const [score, setScore] = useState(submission.score?.toString() ?? "");
  const [maxScore, setMaxScore] = useState(submission.max_score?.toString() ?? "");
  const [state, setState] = useState<{ error?: string; success?: string }>({});
  const [pending, setPending] = useState(false);
  const [criterionLevels, setCriterionLevels] = useState<Record<string, PerformanceLevel>>({});
  const [criterionComments, setCriterionComments] = useState<Record<string, string>>({});

  const showRubric = submission.review_mode === "rubric_scored" && rubric;
  const showScore = submission.review_mode === "scored" || submission.review_mode === "rubric_scored";

  // Calculate rubric total
  const rubricTotal = useMemo(() => {
    if (!showRubric || !rubric) return null;
    let total = 0;
    let max = 0;
    const results = rubric.criteria.map((c) => {
      const level = criterionLevels[c.id];
      const perf = rubric.performance_levels.find((p) => p.level === level);
      const pts = perf?.point_value ?? 0;
      if (level) total += pts;
      max += rubric.performance_levels[0]?.point_value
        ? Math.max(...rubric.performance_levels.map((p) => p.point_value))
        : 0;
      return { criterion: c, level, pts };
    });
    max = rubric.criteria.length * Math.max(...rubric.performance_levels.map((p) => p.point_value));
    return { total, max };
  }, [showRubric, rubric, criterionLevels]);

  async function handleAction(action: "feedback" | "revision" | "complete") {
    setPending(true);
    const formData = new FormData();
    formData.set("submission_id", submission.id);
    formData.set("instructor_feedback", feedback);
    formData.set("private_notes", privateNotes);
    formData.set("score", score);
    formData.set("max_score", maxScore);
    formData.set("review_action", action);

    if (showRubric && rubric && rubricTotal) {
      const rubricResult: RubricResult = {
        rubric_id: rubric.id,
        rubric_title: rubric.title,
        criterion_results: rubric.criteria.map((c) => {
          const level = criterionLevels[c.id] ?? "beginning";
          const perf = rubric.performance_levels.find((p) => p.level === level);
          return {
            criterion_id: c.id,
            criterion_title: c.title,
            performance_level: level,
            point_value: perf?.point_value ?? 0,
            instructor_comment: criterionComments[c.id] ?? "",
          };
        }),
        total_points: rubricTotal.total,
        max_points: rubricTotal.max,
      };
      formData.set("rubric_result", JSON.stringify(rubricResult));
      // Auto-fill score from rubric
      formData.set("score", rubricTotal.total.toString());
      formData.set("max_score", rubricTotal.max.toString());
    }

    const result = await submitReviewAction({}, formData);
    setState(result);
    setPending(false);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link href="/instructor/reviews" className="text-sm font-medium text-rise-blue-dark hover:underline">
        ← Back to Review Queue
      </Link>

      {/* Submission header */}
      <Card>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-rise-sky px-2.5 py-0.5 text-xs font-semibold text-rise-navy">
              {TYPE_LABELS[submission.submission_type] ?? submission.submission_type}
            </span>
            <span className="text-xs text-rise-muted">
              Module {submission.module_number}: {submission.module_title}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-rise-navy">{submission.activity_title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-rise-muted">
            <span><strong className="text-rise-navy">Student:</strong> {submission.student_name}</span>
            <span><strong className="text-rise-navy">Cohort:</strong> {submission.cohort_name}</span>
            <span><strong className="text-rise-navy">Organization:</strong> {submission.organization_name}</span>
            <span><strong className="text-rise-navy">Submitted:</strong> {formatDate(submission.submitted_at)}</span>
            <span><strong className="text-rise-navy">Status:</strong> {STATUS_LABELS[submission.review_status] ?? submission.review_status}</span>
            <span><strong className="text-rise-navy">Version:</strong> {submission.version_number}</span>
          </div>
        </div>
      </Card>

      {/* Activity instructions */}
      <Card>
        <h2 className="mb-2 text-lg font-bold text-rise-navy">Activity Instructions</h2>
        <p className="text-sm text-rise-muted whitespace-pre-wrap">{submission.activity_instructions}</p>
      </Card>

      {/* Student submission */}
      <Card className="border-rise-blue-light">
        <h2 className="mb-2 text-lg font-bold text-rise-navy">Student Submission</h2>
        <div className="rounded-lg bg-rise-sky p-4">
          <p className="text-sm text-rise-navy whitespace-pre-wrap">{submission.student_response}</p>
        </div>
        {submission.attached_file_url && submission.attached_file_name && (
          <div className="mt-3">
            <a
              href={submission.attached_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-rise-border bg-white px-3 py-2 text-sm font-medium text-rise-navy hover:bg-rise-sky"
            >
              📎 {submission.attached_file_name}
            </a>
          </div>
        )}
      </Card>

      {/* Previous submissions / version history */}
      {versions.length > 0 && (
        <Card>
          <h2 className="mb-3 text-lg font-bold text-rise-navy">Submission History</h2>
          <div className="space-y-3">
            {versions.map((v) => (
              <div key={v.version_number} className="rounded-lg border border-rise-border p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-rise-muted">
                    Version {v.version_number} · {STATUS_LABELS[v.review_status] ?? v.review_status}
                  </span>
                  <span className="text-xs text-rise-muted">{formatDate(v.submitted_at)}</span>
                </div>
                <p className="text-sm text-rise-navy whitespace-pre-wrap">{v.student_response}</p>
                {v.instructor_feedback && (
                  <div className="mt-2 rounded bg-rise-sky p-2">
                    <p className="text-xs font-semibold text-rise-muted">Instructor Feedback</p>
                    <p className="mt-0.5 text-sm text-rise-navy whitespace-pre-wrap">{v.instructor_feedback}</p>
                  </div>
                )}
                {v.score !== null && (
                  <p className="mt-1 text-xs text-rise-muted">Score: {v.score}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Existing feedback (if already reviewed) */}
      {submission.instructor_feedback && (
        <Card className="border-rise-success/30 bg-rise-success-light/30">
          <h2 className="mb-2 text-lg font-bold text-rise-navy">Previous Instructor Feedback</h2>
          <p className="text-sm text-rise-navy whitespace-pre-wrap">{submission.instructor_feedback}</p>
          {submission.score !== null && (
            <p className="mt-2 text-sm font-semibold text-rise-navy">
              Score: {submission.score}{submission.max_score ? ` / ${submission.max_score}` : ""}
            </p>
          )}
        </Card>
      )}

      {/* Instructor feedback form */}
      <Card className="border-rise-navy/20">
        <h2 className="mb-4 text-lg font-bold text-rise-navy">Instructor Review</h2>
        <form className="space-y-4">
          {/* Rubric scoring */}
          {showRubric && rubric && (
            <div className="rounded-xl border border-rise-border p-4">
              <h3 className="mb-1 font-bold text-rise-navy">{rubric.title}</h3>
              <p className="mb-3 text-xs text-rise-muted">
                Evaluate the student&apos;s reasoning and use of financial information. Multiple reasonable choices may exist.
              </p>
              <div className="space-y-4">
                {rubric.criteria.map((c) => (
                  <div key={c.id} className="rounded-lg bg-rise-sky/50 p-3">
                    <p className="font-semibold text-rise-navy">{c.title}</p>
                    <p className="mb-2 text-xs text-rise-muted">{c.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {LEVEL_OPTIONS.map((opt) => {
                        const perf = rubric.performance_levels.find((p) => p.level === opt.value);
                        const active = criterionLevels[c.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setCriterionLevels((prev) => ({ ...prev, [c.id]: opt.value }))
                            }
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                              active
                                ? "bg-rise-navy text-white"
                                : "bg-white border border-rise-border text-rise-navy hover:bg-rise-sky"
                            }`}
                          >
                            {opt.label} ({perf?.point_value}pt)
                          </button>
                        );
                      })}
                    </div>
                    <Textarea
                      name={`comment_${c.id}`}
                      placeholder="Comment on this criterion (optional)…"
                      className="mt-2 min-h-[60px]"
                      value={criterionComments[c.id] ?? ""}
                      onChange={(e) =>
                        setCriterionComments((prev) => ({ ...prev, [c.id]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
              {rubricTotal && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-rise-navy p-3 text-white">
                  <span className="text-sm font-semibold">Rubric Total</span>
                  <span className="text-lg font-bold">
                    {rubricTotal.total} / {rubricTotal.max}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Written feedback */}
          <Textarea
            label="Written Feedback"
            name="instructor_feedback"
            placeholder="Provide feedback to the student…"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          {/* Score (for scored/rubric-scored activities) */}
          {showScore && !showRubric && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Score"
                name="score"
                type="number"
                step="0.5"
                placeholder="e.g. 85"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              <Input
                label="Max Score"
                name="max_score"
                type="number"
                step="0.5"
                placeholder="e.g. 100"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
              />
            </div>
          )}

          {/* Private instructor notes */}
          <Textarea
            label="Private Instructor Notes"
            name="private_notes"
            placeholder="Notes visible only to instructors and admins — never visible to students or org managers."
            hint="These notes are never shown to students or organization managers."
            className="min-h-[80px]"
            value={privateNotes}
            onChange={(e) => setPrivateNotes(e.target.value)}
          />

          {/* Action buttons */}
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          {state.success && <p className="text-sm text-rise-success">{state.success}</p>}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="primary"
              disabled={pending}
              onClick={() => handleAction("feedback")}
            >
              {pending ? "Submitting…" : "Post Feedback"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => handleAction("revision")}
            >
              Request Revision
            </Button>
            <Button
              type="button"
              variant="success"
              disabled={pending}
              onClick={() => handleAction("complete")}
            >
              Mark Complete
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
