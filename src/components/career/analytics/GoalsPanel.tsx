"use client";

import { useState, useTransition } from "react";
import {
  createGoalAction,
  deleteGoalAction,
  updateGoalAction,
} from "@/actions/analytics";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ProgressBar } from "@/components/career/analytics/charts";
import {
  GOAL_PERIODS,
  GOAL_STATUSES,
  GOAL_TYPES,
  type CareerGoalWithProgress,
  type GoalPeriod,
  type GoalStatus,
  type GoalType,
} from "@/lib/career/types";

export function GoalsPanel({ goals }: { goals: CareerGoalWithProgress[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    goal_type: "Applications" as GoalType,
    target_value: "5",
    period: "Weekly" as GoalPeriod,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: "",
    status: "Active" as GoalStatus,
  });
  const [, startTransition] = useTransition();

  function submit() {
    setError(null);
    const target = Number(form.target_value);
    if (!target || target <= 0) {
      setError("Target value must be greater than zero.");
      return;
    }
    startTransition(async () => {
      const res = await createGoalAction({
        goal_type: form.goal_type,
        target_value: target,
        period: form.period,
        start_date: form.start_date,
        end_date: form.end_date || null,
        status: form.status,
      });
      if (res.error) setError(res.error);
      else setOpen(false);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this goal?")) return;
    startTransition(async () => {
      await deleteGoalAction(id);
    });
  }

  function toggleComplete(g: CareerGoalWithProgress) {
    const newStatus: GoalStatus = g.status === "Completed" ? "Active" : "Completed";
    startTransition(async () => {
      await updateGoalAction(g.id, {
        goal_type: g.goal_type,
        target_value: g.target_value,
        period: g.period,
        start_date: g.start_date,
        end_date: g.end_date,
        status: newStatus,
      });
    });
  }

  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-career-navy">Job-Search Goals</h3>
          <p className="mt-0.5 text-sm text-career-slate">
            Set targets and track real progress against your Career AI records.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? "Cancel" : "Add Goal"}
        </Button>
      </div>

      {open && (
        <div className="mb-4 space-y-3 rounded-lg border border-career-border bg-career-bg p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              label="Goal type"
              options={GOAL_TYPES.map((g) => ({ value: g, label: g }))}
              value={form.goal_type}
              onChange={(e) => setForm({ ...form, goal_type: e.target.value as GoalType })}
            />
            <Input label="Target value" type="number" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: e.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Select label="Period" options={GOAL_PERIODS.map((p) => ({ value: p, label: p }))} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value as GoalPeriod })} />
            <Input label="Start date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <Input label="End date (optional)" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={submit}>Create Goal</Button>
        </div>
      )}

      {goals.length === 0 ? (
        <p className="py-6 text-center text-sm text-career-slate">
          No goals set yet. Add a goal to start tracking your progress.
        </p>
      ) : (
        <div className="space-y-4">
          {goals.map((g) => (
            <div key={g.id} className="rounded-lg border border-career-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-career-navy">{g.goal_type}</span>
                  <span className="rounded-full bg-career-surface px-2 py-0.5 text-xs text-career-slate">{g.period}</span>
                  {g.status === "Completed" && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Completed</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toggleComplete(g)}>
                    {g.status === "Completed" ? "Reopen" : "Complete"}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(g.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar
                  pct={g.progress_pct}
                  label={`${g.current_value} of ${g.target_value} ${g.goal_type.toLowerCase()}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
