"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import type { StudentProgressSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function InstructorProgressDashboard({
  students,
  cohorts,
  stalledThreshold,
}: {
  students: StudentProgressSummary[];
  cohorts: { id: string; name: string }[];
  stalledThreshold: number;
}) {
  const [cohortFilter, setCohortFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (cohortFilter !== "all" && s.cohort_name !== cohorts.find((c) => c.id === cohortFilter)?.name) return false;
      if (statusFilter !== "all" && s.enrollment_status !== statusFilter) return false;
      if (activityFilter === "not_started" && s.lessons_completed > 0) return false;
      if (activityFilter === "active" && (s.lessons_completed === 0 || s.is_stalled)) return false;
      if (activityFilter === "stalled" && !s.is_stalled) return false;
      return true;
    });
  }, [students, cohortFilter, statusFilter, activityFilter, cohorts]);

  // Category counts
  const notStarted = students.filter((s) => s.lessons_completed === 0 && s.enrollment_status !== "withdrawn");
  const active = students.filter((s) => s.lessons_completed > 0 && !s.is_stalled && s.enrollment_status !== "completed" && s.enrollment_status !== "withdrawn");
  const stalled = students.filter((s) => s.is_stalled);
  const failedQuiz = students.filter((s) => s.failed_quiz_attempts > 0 && !s.quiz_passed);
  const missingBlueprint = students.filter((s) => s.missing_blueprint_sections > 0 && s.modules_completed > 0);
  const eligible = students.filter((s) => s.eligible_for_completion);

  const categories = [
    { label: "Not Started", count: notStarted.length, color: "text-rise-muted", bg: "bg-rise-border" },
    { label: "Active", count: active.length, color: "text-rise-navy", bg: "bg-rise-sky" },
    { label: `Stalled (${stalledThreshold}+ days)`, count: stalled.length, color: "text-rise-warning", bg: "bg-rise-warning-light" },
    { label: "Failed Quiz", count: failedQuiz.length, color: "text-rise-red", bg: "bg-rise-red/10" },
    { label: "Missing Blueprint", count: missingBlueprint.length, color: "text-rise-blue-dark", bg: "bg-rise-blue-light" },
    { label: "Eligible for Completion", count: eligible.length, color: "text-rise-success", bg: "bg-rise-success-light" },
  ];

  return (
    <div className="space-y-6">
      {/* Category cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rise-muted">{cat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${cat.color}`}>{cat.count}</p>
            </div>
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${cat.bg} text-sm font-bold ${cat.color}`}>
              {cat.count}
            </span>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Select
          label="Cohort"
          value={cohortFilter}
          onChange={(e) => setCohortFilter(e.target.value)}
          options={[
            { value: "all", label: "All cohorts" },
            ...cohorts.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <Select
          label="Enrollment status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "all", label: "All statuses" },
            { value: "invited", label: "Invited" },
            { value: "not_started", label: "Not Started" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
            { value: "withdrawn", label: "Withdrawn" },
          ]}
        />
        <Select
          label="Activity"
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
          options={[
            { value: "all", label: "All activity" },
            { value: "active", label: "Active" },
            { value: "stalled", label: `Stalled (${stalledThreshold}+ days)` },
            { value: "not_started", label: "Not started" },
          ]}
        />
      </div>

      {/* Student progress table */}
      <div className="overflow-x-auto rounded-2xl border border-rise-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rise-navy text-white">
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Cohort</th>
              <th className="px-4 py-3 text-center font-medium">Lessons</th>
              <th className="px-4 py-3 text-center font-medium">Modules</th>
              <th className="px-4 py-3 text-center font-medium">Quiz</th>
              <th className="px-4 py-3 text-center font-medium">Decision Labs</th>
              <th className="px-4 py-3 text-center font-medium">Blueprint</th>
              <th className="px-4 py-3 text-center font-medium">Certificate</th>
              <th className="px-4 py-3 text-center font-medium">Last Activity</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.profile_id} className="border-t border-rise-border">
                <td className="px-4 py-3 font-medium text-rise-navy">{s.student_name}</td>
                <td className="px-4 py-3 text-rise-muted">{s.cohort_name}</td>
                <td className="px-4 py-3 text-center text-rise-navy">{s.lessons_completed}/24</td>
                <td className="px-4 py-3 text-center text-rise-navy">{s.modules_completed}/6</td>
                <td className="px-4 py-3 text-center">
                  {s.best_quiz_score !== null ? (
                    <span className={s.quiz_passed ? "text-rise-success font-medium" : "text-rise-warning font-medium"}>
                      {s.best_quiz_score}%
                    </span>
                  ) : (
                    <span className="text-rise-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-rise-navy">{s.decision_labs_completed}/6</td>
                <td className="px-4 py-3 text-center text-rise-navy">{s.blueprint_sections_completed}/6</td>
                <td className="px-4 py-3 text-center">{s.has_certificate ? "✓" : "—"}</td>
                <td className="px-4 py-3 text-rise-muted">
                  {s.last_activity_date ? formatDate(s.last_activity_date) : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {s.is_stalled ? (
                    <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">
                      Stalled
                    </span>
                  ) : s.enrollment_status === "completed" || s.has_certificate ? (
                    <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs font-semibold text-rise-success">
                      Complete
                    </span>
                  ) : s.eligible_for_completion ? (
                    <span className="rounded-full bg-rise-blue-light px-2 py-0.5 text-xs font-semibold text-rise-navy">
                      Eligible
                    </span>
                  ) : s.lessons_completed === 0 ? (
                    <span className="rounded-full bg-rise-border px-2 py-0.5 text-xs font-medium text-rise-muted">
                      Not Started
                    </span>
                  ) : s.failed_quiz_attempts > 0 && !s.quiz_passed ? (
                    <span className="rounded-full bg-rise-red/10 px-2 py-0.5 text-xs font-semibold text-rise-red">
                      Retry Needed
                    </span>
                  ) : (
                    <span className="rounded-full bg-rise-sky px-2 py-0.5 text-xs font-medium text-rise-navy">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-rise-muted">
                  No students match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
