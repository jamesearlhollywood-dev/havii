import Link from "next/link";
import type { GoalWithSteps } from "@/lib/goalConstants";
import { categoryLabel } from "./goalHelpers";
import { GoalProgress } from "./GoalProgress";

/**
 * Small Home card showing the user's next active goal, or an encouraging
 * empty state when no goals exist yet.
 */
export function HomeGoalCard({ goal }: { goal: GoalWithSteps | null }) {
  if (!goal) {
    return (
      <Link
        href="/app/goals/new"
        className="block rounded-2xl border border-havii-mist bg-white p-5 shadow-sm transition hover:border-havii-teal/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-havii-teal"
      >
        <p className="text-sm font-semibold text-havii-ink">Goals</p>
        <p className="mt-1 text-sm text-havii-muted">
          Start with one small step. What would you like to work toward?
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-havii-teal">
          Create a goal →
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/app/goals/${goal.id}`}
      className="block rounded-2xl border border-havii-mist bg-white p-5 shadow-sm transition hover:border-havii-teal/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-havii-teal"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-havii-ink">Your next goal</p>
        <span className="rounded-full bg-havii-sand px-2.5 py-0.5 text-xs font-medium text-havii-teal-dark">
          {categoryLabel(goal.category)}
        </span>
      </div>
      <h2 className="mt-1.5 text-lg font-bold text-havii-ink line-clamp-2">
        {goal.title}
      </h2>
      <div className="mt-3">
        <GoalProgress
          stepTotal={goal.stepTotal}
          stepCompleted={goal.stepCompleted}
          status={goal.status}
          compact
        />
      </div>
      <span className="mt-3 inline-block text-sm font-medium text-havii-teal">
        Open goal →
      </span>
    </Link>
  );
}
