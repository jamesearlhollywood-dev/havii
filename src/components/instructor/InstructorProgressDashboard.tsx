"use client";

import { useState, useMemo } from "react";
import type { StudentProgressSummary } from "@/lib/types";
import { modules, TOTAL_LESSONS } from "@/data/course";
import { Card } from "@/components/ui/Card";

export function InstructorProgressDashboard({
  students,
  cohorts,
  stalledThreshold,
}: {
  students: StudentProgressSummary[];
  cohorts: { id: string; name: string }[];
  stalledThreshold: number;
}) {
  const [filterCohort, setFilterCohort] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = useMemo(
    () =>
      students.filter((s) => {
        if (filterCohort && s.cohort_name !== cohorts.find((c) => c.id === filterCohort)?.name)
          return false;
        if (filterStatus === "active" && (s.is_stalled || s.enrollment_status === "completed" || s.enrollment_status === "withdrawn"))
          return false;
        if (filterStatus === "stalled" && !s.is_stalled) return false;
        if (filterStatus === "completed" && s.enrollment_status !== "completed" && !s.has_certificate)
          return false;
        return true;
      }),
    [students, filterCohort, filterStatus, cohorts],
  );

  // Assessment metrics
  const studentsWithScores = filtered.filter((s) => s.best_quiz_score !== null);
  const avgScore =
    studentsWithScores.length > 0
      ? Math.round(studentsWithScores.reduce((sum, s) => sum + (s.best_quiz_score ?? 0), 0) / studentsWithScores.length)
      : 0;
  const passedCount = filtered.filter((s) => s.quiz_passed).length;
  const totalAttempts = filtered.reduce((sum, s) => sum + s.failed_quiz_attempts, 0);

  return (
    <div className="space-y-4">
      {/* Assessment metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-rise-muted">Avg Assessment Score</p>
          <p className="mt-1 text-2xl font-bold text-rise-navy">{avgScore}%</p>
        </Card>
        <Card>
          <p className="text-sm text-rise-muted">Passed Knowledge Checks</p>
          <p className="mt-1 text-2xl font-bold text-rise-success">{passedCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-rise-muted">Failed Attempts</p>
          <p className="mt-1 text-2xl font-bold text-rise-warning">{totalAttempts}</p>
        </Card>
        <Card>
          <p className="text-sm text-rise-muted">Completion Rate</p>
          <p className="mt-1 text-2xl font-bold text-rise-navy">
            {filtered.length > 0 ? Math.round((filtered.filter((s) => s.has_certificate).length / filtered.length) * 100) : 0}%
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={filterCohort}
          onChange={(e) => setFilterCohort(e.target.value)}
          className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
        >
          <option value="">All Cohorts</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
        >
          <option value="all">All Students</option>
          <option value="active">Active</option>
          <option value="stalled">Stalled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Student table */}
      <div className="overflow-x-auto rounded-2xl border border-rise-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rise-navy text-white">
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-center font-medium">Lessons</th>
              <th className="px-4 py-3 text-center font-medium">Modules</th>
              <th className="px-4 py-3 text-center font-medium">Quiz Score</th>
              <th className="px-4 py-3 text-center font-medium">Decision Labs</th>
              <th className="px-4 py-3 text-center font-medium">Blueprint</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Record</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.profile_id} className="border-t border-rise-border">
                <td className="px-4 py-3 font-medium text-rise-navy">{s.student_name}</td>
                <td className="px-4 py-3 text-center text-rise-navy">{s.lessons_completed}/{TOTAL_LESSONS}</td>
                <td className="px-4 py-3 text-center text-rise-navy">{s.modules_completed}/6</td>
                <td className="px-4 py-3 text-center text-rise-navy">
                  {s.best_quiz_score !== null ? `${s.best_quiz_score}%` : "—"}
                  {s.failed_quiz_attempts > 0 && (
                    <span className="ml-1 text-xs text-rise-warning">({s.failed_quiz_attempts} retake{s.failed_quiz_attempts > 1 ? "s" : ""})</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-rise-navy">{s.decision_labs_completed}/6</td>
                <td className="px-4 py-3 text-center text-rise-navy">{s.blueprint_sections_completed}/6</td>
                <td className="px-4 py-3 text-center">
                  {s.is_stalled ? (
                    <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">Stalled</span>
                  ) : s.has_certificate ? (
                    <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs font-semibold text-rise-success">Complete</span>
                  ) : s.lessons_completed === 0 ? (
                    <span className="rounded-full bg-rise-border px-2 py-0.5 text-xs font-medium text-rise-muted">Not Started</span>
                  ) : (
                    <span className="rounded-full bg-rise-sky px-2 py-0.5 text-xs font-medium text-rise-navy">Active</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <a
                    href={`/admin/records/${s.profile_id}`}
                    className="rounded-lg border border-rise-border bg-white px-2 py-1 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
