"use client";

import { useState } from "react";
import Link from "next/link";
import type { GoalWithSteps, GoalStatus } from "@/lib/goalConstants";
import { Button } from "@/components/ui/Button";
import { GoalProgress } from "./GoalProgress";
import { categoryLabel } from "./goalHelpers";

const TABS: { value: GoalStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export function GoalList({
  goals,
  initialTab = "active",
}: {
  goals: GoalWithSteps[];
  initialTab?: GoalStatus;
}) {
  const [tab, setTab] = useState<GoalStatus>(initialTab);

  const visible = goals.filter((g) => g.status === tab);
  const counts: Record<GoalStatus, number> = {
    active: goals.filter((g) => g.status === "active").length,
    completed: goals.filter((g) => g.status === "completed").length,
    archived: goals.filter((g) => g.status === "archived").length,
  };
  const isEmpty = visible.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-havii-ink">Goals</h1>
        <Link href="/app/goals/new" className="shrink-0">
          <Button size="sm">+ New Goal</Button>
        </Link>
      </div>

      <p className="text-xs text-havii-muted">
        Your goals are private. Move at your own pace — missed dates don&apos;t reset
        anything, and you won&apos;t be ranked against anyone.
      </p>

      {/* Tabs */}
      <div
        className="flex gap-1 rounded-xl border border-havii-mist bg-white p-1"
        role="tablist"
        aria-label="Goal views"
      >
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.value
                ? "bg-havii-teal text-white"
                : "text-havii-muted hover:bg-havii-sand"
            }`}
          >
            {t.label}
            {counts[t.value] > 0 && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  tab === t.value ? "bg-white/20" : "bg-havii-sand"
                }`}
              >
                {counts[t.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-havii-mist bg-white p-8 text-center">
          <p className="text-base font-medium text-havii-ink">
            {tab === "active"
              ? "No active goals yet."
              : tab === "completed"
              ? "No completed goals yet."
              : "No archived goals."}
          </p>
          <p className="mt-1 text-sm text-havii-muted">
            {tab === "active"
              ? "Start with one small step. What would you like to work toward?"
              : tab === "completed"
              ? "Goals you complete will show up here to celebrate."
              : "Goals you archive will be kept here."}
          </p>
          {tab === "active" && (
            <Link href="/app/goals/new" className="mt-4 inline-block">
              <Button size="lg">Create a goal</Button>
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((goal) => (
            <li key={goal.id}>
              <Link
                href={`/app/goals/${goal.id}`}
                className="block rounded-2xl border border-havii-mist bg-white p-4 shadow-sm transition hover:border-havii-teal/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-havii-teal"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-havii-ink line-clamp-2">
                    {goal.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-havii-sand px-2.5 py-0.5 text-xs font-medium text-havii-teal-dark">
                    {categoryLabel(goal.category)}
                  </span>
                </div>
                {goal.description && (
                  <p className="mt-1.5 text-sm text-havii-muted line-clamp-2">
                    {goal.description}
                  </p>
                )}
                <div className="mt-3">
                  <GoalProgress
                    stepTotal={goal.stepTotal}
                    stepCompleted={goal.stepCompleted}
                    status={goal.status}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
