import { Card } from "@/components/ui/Card";
import type { InstructorWorkloadMetrics } from "@/lib/types";

export function InstructorWorkloadCard({ metrics }: { metrics: InstructorWorkloadMetrics }) {
  return (
    <Card>
      <h3 className="mb-3 font-bold text-rise-navy">{metrics.instructor_name}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-rise-muted">Awaiting Review</p>
          <p className="text-xl font-bold text-rise-navy">{metrics.submissions_awaiting_review}</p>
        </div>
        <div>
          <p className="text-xs text-rise-muted">Reviews Completed</p>
          <p className="text-xl font-bold text-rise-success">{metrics.reviews_completed}</p>
        </div>
        <div>
          <p className="text-xs text-rise-muted">Avg Turnaround</p>
          <p className="text-xl font-bold text-rise-navy">
            {metrics.avg_review_turnaround_hours < 24
              ? `${metrics.avg_review_turnaround_hours}h`
              : `${(metrics.avg_review_turnaround_hours / 24).toFixed(1)}d`}
          </p>
        </div>
        <div>
          <p className="text-xs text-rise-muted">Revisions Requested</p>
          <p className="text-xl font-bold text-rise-warning">{metrics.revisions_requested}</p>
        </div>
        <div>
          <p className="text-xs text-rise-muted">Overdue</p>
          <p className={`text-xl font-bold ${metrics.overdue_reviews > 0 ? "text-rise-red" : "text-rise-success"}`}>
            {metrics.overdue_reviews}
          </p>
        </div>
      </div>
    </Card>
  );
}
