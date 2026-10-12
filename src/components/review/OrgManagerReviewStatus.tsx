import { Card } from "@/components/ui/Card";
import type { OrgManagerReviewItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

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

export function OrgManagerReviewStatus({ items }: { items: OrgManagerReviewItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-1 text-xl font-bold text-rise-navy">Instructor Review Status</h2>
      <p className="mb-4 text-sm text-rise-muted">
        Completion status for required activities. Detailed student responses and instructor comments are private.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-rise-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rise-navy text-white">
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Cohort</th>
              <th className="px-4 py-3 text-left font-medium">Module</th>
              <th className="px-4 py-3 text-left font-medium">Activity</th>
              <th className="px-4 py-3 text-center font-medium">Submitted</th>
              <th className="px-4 py-3 text-center font-medium">Review Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-rise-border">
                <td className="px-4 py-3 font-medium text-rise-navy">{item.student_name}</td>
                <td className="px-4 py-3 text-rise-muted">{item.cohort_name}</td>
                <td className="px-4 py-3 text-rise-muted">M{item.module_number}: {item.module_title}</td>
                <td className="px-4 py-3 text-rise-muted">{item.activity_title}</td>
                <td className="px-4 py-3 text-center text-rise-muted">
                  {item.submitted_at ? formatDate(item.submitted_at) : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.review_status] ?? ""}`}>
                    {STATUS_LABELS[item.review_status] ?? item.review_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
