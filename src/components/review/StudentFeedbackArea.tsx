import { Card } from "@/components/ui/Card";
import type { StudentFeedbackItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  not_submitted: "bg-rise-border text-rise-muted",
  submitted: "bg-rise-sky text-rise-navy",
  in_review: "bg-rise-blue-light text-rise-navy",
  feedback_provided: "bg-rise-success-light text-rise-success",
  revision_requested: "bg-rise-warning-light text-rise-warning",
  resubmitted: "bg-rise-blue-light text-rise-navy",
  completed: "bg-rise-success-light text-rise-success",
};

const STATUS_LABELS: Record<string, string> = {
  not_submitted: "Not Submitted",
  submitted: "Submitted",
  in_review: "In Review",
  feedback_provided: "Feedback Provided",
  revision_requested: "Revision Requested",
  resubmitted: "Resubmitted",
  completed: "Completed",
};

export function StudentFeedbackArea({ items }: { items: StudentFeedbackItem[] }) {
  if (items.length === 0) return null;

  const hasRevisions = items.some((i) => i.resubmission_status === "revision_requested");

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-xl font-bold text-rise-navy">Instructor Feedback</h2>

      {hasRevisions && (
        <Card className="mb-4 border-rise-warning/40 bg-rise-warning-light">
          <div className="flex items-start gap-3">
            <span className="text-lg">📝</span>
            <div>
              <p className="font-semibold text-rise-navy">
                Your instructor requested a revision. Review the feedback, update your work, and resubmit when ready.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.submission_id}>
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-rise-navy">{item.activity_title}</h3>
                  <p className="text-xs text-rise-muted">
                    Module {item.module_number}: {item.module_title}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.review_status] ?? ""}`}>
                  {STATUS_LABELS[item.review_status] ?? item.review_status}
                </span>
              </div>

              {item.instructor_feedback && (
                <div className="rounded-lg bg-rise-sky p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rise-muted">
                    Instructor Feedback
                  </p>
                  <p className="mt-1 text-sm text-rise-navy whitespace-pre-wrap">
                    {item.instructor_feedback}
                  </p>
                  {item.reviewed_at && (
                    <p className="mt-2 text-xs text-rise-muted">
                      Reviewed on {formatDate(item.reviewed_at)}
                    </p>
                  )}
                </div>
              )}

              {item.score !== null && (
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-rise-muted">Score</p>
                    <p className="text-lg font-bold text-rise-navy">
                      {item.score}{item.max_score ? ` / ${item.max_score}` : ""}
                    </p>
                  </div>
                  {item.rubric_result && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-xs font-medium text-rise-blue-dark hover:underline">
                        View rubric breakdown
                      </summary>
                      <div className="mt-2 space-y-1">
                        {item.rubric_result.criterion_results.map((cr) => (
                          <div key={cr.criterion_id} className="flex items-center justify-between gap-4 text-xs">
                            <span className="text-rise-navy">{cr.criterion_title}</span>
                            <span className="font-medium text-rise-muted capitalize">
                              {cr.performance_level} ({cr.point_value}pt)
                            </span>
                          </div>
                        ))}
                        <div className="mt-1 flex items-center justify-between border-t border-rise-border pt-1 text-xs font-bold">
                          <span className="text-rise-navy">Total</span>
                          <span className="text-rise-navy">
                            {item.rubric_result.total_points} / {item.rubric_result.max_points}
                          </span>
                        </div>
                      </div>
                    </details>
                  )}
                </div>
              )}

              {item.resubmission_status === "revision_requested" && (
                <div className="rounded-lg border border-rise-warning/40 bg-rise-warning-light p-3">
                  <p className="text-sm font-semibold text-rise-warning">
                    Revision requested — update your work and resubmit.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-rise-muted">
                <span>Submitted: {formatDate(item.submitted_at)}</span>
                {item.link_url && (
                  <Link href={item.link_url} className="font-medium text-rise-blue-dark hover:underline">
                    Go to activity →
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
