import type { ConfidenceAnalysis } from "@/lib/types";
import { ComparisonBar, ProgressRing } from "./Charts";
import { Alert } from "@/components/ui/Alert";

export function ConfidenceAnalysisView({
  analysis,
  anonymized = false,
}: {
  analysis: ConfidenceAnalysis;
  anonymized?: boolean;
}) {
  return (
    <div className="space-y-6">
      <Alert tone="info">
        <strong>Self-Reported Financial Confidence.</strong> These results
        reflect students&apos; self-assessment of their financial knowledge and
        comfort. They are <strong>not</strong> a measure of actual financial
        behavior or financial success.
      </Alert>

      {/* Summary metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
          <p className="text-sm text-rise-muted">Average Pre-Course Score</p>
          <p className="mt-1 text-3xl font-bold text-rise-navy">
            {analysis.avg_pre_score.toFixed(1)}<span className="text-lg text-rise-muted">/5</span>
          </p>
          <p className="mt-0.5 text-xs text-rise-muted">{analysis.student_count} students</p>
        </div>
        <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
          <p className="text-sm text-rise-muted">Average Post-Course Score</p>
          <p className="mt-1 text-3xl font-bold text-rise-navy">
            {analysis.has_post_data ? (
              <>{analysis.avg_post_score.toFixed(1)}<span className="text-lg text-rise-muted">/5</span></>
            ) : (
              <span className="text-lg text-rise-muted">No data yet</span>
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
          <p className="text-sm text-rise-muted">Percentage Change</p>
          <p className={`mt-1 text-3xl font-bold ${analysis.percentage_change > 0 ? "text-rise-success" : "text-rise-muted"}`}>
            {analysis.has_post_data ? (
              <>{analysis.percentage_change > 0 ? "+" : ""}{analysis.percentage_change}%</>
            ) : "—"}
          </p>
        </div>
      </div>

      {/* Overall comparison ring */}
      {analysis.has_post_data && (
        <div className="flex flex-wrap items-center justify-around gap-6 rounded-2xl border border-rise-border bg-white p-6 shadow-sm">
          <div className="text-center">
            <ProgressRing
              value={Math.round((analysis.avg_pre_score / 5) * 100)}
              label={analysis.avg_pre_score.toFixed(1)}
              sublabel="Pre / 5"
              color="var(--rise-blue-light)"
            />
            <p className="mt-2 text-sm font-medium text-rise-muted">Pre-Course</p>
          </div>
          <div className="text-center">
            <ProgressRing
              value={Math.round((analysis.avg_post_score / 5) * 100)}
              label={analysis.avg_post_score.toFixed(1)}
              sublabel="Post / 5"
              color="var(--rise-blue-dark)"
            />
            <p className="mt-2 text-sm font-medium text-rise-muted">Post-Course</p>
          </div>
          <div className="text-center">
            <ProgressRing
              value={Math.max(0, analysis.percentage_change)}
              label={`${analysis.percentage_change > 0 ? "+" : ""}${analysis.percentage_change}%`}
              sublabel="Change"
              color="var(--rise-success)"
            />
            <p className="mt-2 text-sm font-medium text-rise-muted">Improvement</p>
          </div>
        </div>
      )}

      {/* Topic-by-topic comparison */}
      <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-rise-navy">
          Improvement by Topic
        </h3>
        <div className="space-y-4">
          {analysis.by_topic.map((topic, i) => (
            <ComparisonBar
              key={i}
              label={topic.question}
              preValue={topic.avg_pre}
              postValue={topic.avg_post}
              max={5}
            />
          ))}
        </div>
      </div>

      {anonymized && (
        <Alert tone="warning">
          Anonymized reporting mode: individual student names are hidden.{" "}
          {analysis.student_count < 5 && analysis.student_count > 0
            ? `This group has fewer than 5 students (${analysis.student_count}); student-level breakdowns are suppressed.`
            : "Aggregate data only is shown."}
        </Alert>
      )}
    </div>
  );
}
