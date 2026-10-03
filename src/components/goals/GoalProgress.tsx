import type { GoalStatus } from "@/lib/goalConstants";
import { statusLabel, statusTone } from "./goalHelpers";

/**
 * Progress indicator for a goal.
 * - When the goal has steps, shows completed/total and a progress bar.
 * - When the goal has no steps, shows only its status (no invented percentage).
 */
export function GoalProgress({
  stepTotal,
  stepCompleted,
  status,
  compact = false,
}: {
  stepTotal: number;
  stepCompleted: number;
  status: GoalStatus;
  compact?: boolean;
}) {
  if (stepTotal === 0) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusTone(status)}`}
      >
        {statusLabel(status)}
      </span>
    );
  }

  const pct = Math.round((stepCompleted / stepTotal) * 100);

  if (compact) {
    return (
      <span className="text-xs font-medium text-havii-muted">
        {stepCompleted}/{stepTotal} steps · {pct}%
      </span>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-havii-muted">
          {stepCompleted} of {stepTotal} steps
        </span>
        <span className="font-semibold text-havii-teal-dark">{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-havii-sand"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Step progress"
      >
        <div
          className="h-full rounded-full bg-havii-teal transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
