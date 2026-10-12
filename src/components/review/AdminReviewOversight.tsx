"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { reassignSubmissionAction } from "@/actions/reviews";
import { formatDate } from "@/lib/utils";
import type { ReviewQueueItem, Submission, InstructorWorkloadMetrics } from "@/lib/types";
import { InstructorWorkloadCard } from "@/components/review/InstructorWorkloadCard";

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-rise-sky text-rise-navy",
  in_review: "bg-rise-blue-light text-rise-navy",
  resubmitted: "bg-rise-blue-light text-rise-navy",
  feedback_provided: "bg-rise-success-light text-rise-success",
  revision_requested: "bg-rise-warning-light text-rise-warning",
  completed: "bg-rise-success-light text-rise-success",
  not_submitted: "bg-rise-border text-rise-muted",
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

export function AdminReviewOversight({
  pending,
  unassigned,
  allSubmissions,
  workload,
  instructors,
}: {
  pending: ReviewQueueItem[];
  unassigned: Submission[];
  allSubmissions: Submission[];
  workload: InstructorWorkloadMetrics[];
  instructors: { id: string; name: string }[];
}) {
  const [reassignState, setReassignState] = useState<Record<string, { error?: string; success?: string }>>({});

  async function handleReassign(submissionId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("submission_id", submissionId);
    const result = await reassignSubmissionAction({}, formData);
    setReassignState((prev) => ({ ...prev, [submissionId]: result }));
  }

  const instructorOptions = instructors.map((i) => ({ value: i.id, label: i.name }));

  return (
    <div className="space-y-6">
      {/* Workload metrics */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-rise-navy">Instructor Workload</h2>
        <p className="mb-3 text-sm text-rise-muted">
          These metrics are for internal oversight only and are not used to publicly rank instructors.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workload.map((w) => (
            <InstructorWorkloadCard key={w.instructor_id} metrics={w} />
          ))}
        </div>
      </div>

      {/* Unassigned submissions */}
      {unassigned.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-rise-navy">
            Unassigned Submissions ({unassigned.length})
          </h2>
          <div className="space-y-3">
            {unassigned.map((sub) => (
              <Card key={sub.id} className="border-rise-warning/40">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-rise-navy">{sub.activity_title}</h3>
                    <p className="text-sm text-rise-muted">
                      {sub.student_name} · {sub.cohort_name} · Submitted {formatDate(sub.submitted_at)}
                    </p>
                  </div>
                  <form onSubmit={(e) => handleReassign(sub.id, e)} className="flex items-end gap-2">
                    <Select
                      name="new_instructor_id"
                      options={[{ value: "", label: "Assign to…" }, ...instructorOptions]}
                      className="min-w-[180px]"
                    />
                    <input type="hidden" name="new_instructor_name" value="" />
                    <Button type="submit" size="sm">Assign</Button>
                  </form>
                </div>
                {reassignState[sub.id]?.error && (
                  <p className="mt-2 text-sm text-red-600">{reassignState[sub.id]?.error}</p>
                )}
                {reassignState[sub.id]?.success && (
                  <p className="mt-2 text-sm text-rise-success">{reassignState[sub.id]?.success}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending submissions */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-rise-navy">Pending Reviews ({pending.length})</h2>
        {pending.length === 0 ? (
          <Card><p className="text-sm text-rise-muted">No pending reviews.</p></Card>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-rise-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-rise-navy text-white">
                  <th className="px-4 py-3 text-left font-medium">Student</th>
                  <th className="px-4 py-3 text-left font-medium">Cohort</th>
                  <th className="px-4 py-3 text-left font-medium">Module</th>
                  <th className="px-4 py-3 text-left font-medium">Activity</th>
                  <th className="px-4 py-3 text-center font-medium">Submitted</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-center font-medium">Waiting</th>
                  <th className="px-4 py-3 text-left font-medium">Instructor</th>
                  <th className="px-4 py-3 text-center font-medium">Reassign</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((item) => (
                  <tr key={item.id} className={`border-t border-rise-border ${item.is_overdue ? "bg-rise-red/5" : ""}`}>
                    <td className="px-4 py-3 font-medium text-rise-navy">{item.student_name}</td>
                    <td className="px-4 py-3 text-rise-muted">{item.cohort_name}</td>
                    <td className="px-4 py-3 text-rise-muted">M{item.module_number}</td>
                    <td className="px-4 py-3 text-rise-navy">{item.activity_title}</td>
                    <td className="px-4 py-3 text-center text-rise-muted">{formatDate(item.submitted_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.review_status] ?? ""}`}>
                        {STATUS_LABELS[item.review_status] ?? item.review_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold ${item.is_overdue ? "text-rise-red" : "text-rise-muted"}`}>
                        {item.days_waiting}d{item.is_overdue && " ⚠"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-rise-muted">{item.assigned_instructor_name ?? "Unassigned"}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/instructor/reviews/${item.id}`}
                        className="rounded-lg bg-rise-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-rise-navy-light"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All submissions history */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-rise-navy">Submission History ({allSubmissions.length})</h2>
        <div className="overflow-x-auto rounded-2xl border border-rise-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rise-navy text-white">
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">Activity</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Score</th>
                <th className="px-4 py-3 text-center font-medium">Instructor</th>
                <th className="px-4 py-3 text-center font-medium">Submitted</th>
                <th className="px-4 py-3 text-center font-medium">Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {allSubmissions.slice(0, 50).map((sub) => (
                <tr key={sub.id} className="border-t border-rise-border">
                  <td className="px-4 py-3 font-medium text-rise-navy">{sub.student_name}</td>
                  <td className="px-4 py-3 text-rise-muted">{sub.activity_title}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[sub.review_status] ?? ""}`}>
                      {STATUS_LABELS[sub.review_status] ?? sub.review_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-rise-muted">
                    {sub.score !== null ? `${sub.score}${sub.max_score ? `/${sub.max_score}` : ""}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-rise-muted">{sub.assigned_instructor_name ?? "—"}</td>
                  <td className="px-4 py-3 text-center text-rise-muted">{formatDate(sub.submitted_at)}</td>
                  <td className="px-4 py-3 text-center text-rise-muted">{sub.reviewed_at ? formatDate(sub.reviewed_at) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
