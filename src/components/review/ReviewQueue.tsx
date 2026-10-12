"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ReviewQueueItem, ReviewQueueSort } from "@/lib/types";
import { formatDate } from "@/lib/utils";

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
  submitted: "Submitted",
  in_review: "In Review",
  resubmitted: "Resubmitted",
  feedback_provided: "Feedback Provided",
  revision_requested: "Revision Requested",
  completed: "Completed",
  not_submitted: "Not Submitted",
};

const TYPE_LABELS: Record<string, string> = {
  decision_lab: "Decision Lab",
  workbook: "Workbook",
  reflection: "Reflection",
  action_commitment: "Action Commitment",
  short_answer: "Short Answer",
  blueprint_section: "Blueprint Section",
  final_capstone: "Final Capstone",
};

const SORT_OPTIONS = [
  { value: "oldest_first", label: "Oldest submission first" },
  { value: "newest_first", label: "Newest submission first" },
  { value: "student_name", label: "Student name (A–Z)" },
  { value: "module", label: "Module order" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "in_review", label: "In Review" },
  { value: "resubmitted", label: "Resubmitted" },
  { value: "feedback_provided", label: "Feedback Provided" },
  { value: "revision_requested", label: "Revision Requested" },
  { value: "completed", label: "Completed" },
];

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All activity types" },
  { value: "decision_lab", label: "Decision Lab" },
  { value: "workbook", label: "Workbook" },
  { value: "reflection", label: "Reflection" },
  { value: "action_commitment", label: "Action Commitment" },
  { value: "short_answer", label: "Short Answer" },
  { value: "blueprint_section", label: "Blueprint Section" },
  { value: "final_capstone", label: "Final Capstone" },
];

export function ReviewQueue({ items, cohorts }: { items: ReviewQueueItem[]; cohorts: { id: string; name: string }[] }) {
  const [cohortFilter, setCohortFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [sort, setSort] = useState<ReviewQueueSort>("oldest_first");

  const cohortOptions = [
    { value: "all", label: "All cohorts" },
    ...cohorts.map((c) => ({ value: c.name, label: c.name })),
  ];

  const filtered = useMemo(() => {
    let result = [...items];

    if (cohortFilter !== "all") result = result.filter((i) => i.cohort_name === cohortFilter);
    if (statusFilter !== "all") result = result.filter((i) => i.review_status === statusFilter);
    if (typeFilter !== "all") result = result.filter((i) => i.submission_type === typeFilter);
    if (studentSearch) {
      const q = studentSearch.toLowerCase();
      result = result.filter((i) => i.student_name.toLowerCase().includes(q));
    }

    switch (sort) {
      case "oldest_first":
        result.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
        break;
      case "newest_first":
        result.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
        break;
      case "student_name":
        result.sort((a, b) => a.student_name.localeCompare(b.student_name));
        break;
      case "module":
        result.sort((a, b) => a.module_number - b.module_number);
        break;
    }

    return result;
  }, [items, cohortFilter, statusFilter, typeFilter, studentSearch, sort]);

  return (
    <div>
      {/* Filters */}
      <Card className="mb-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Select
            label="Cohort"
            name="cohort"
            options={cohortOptions}
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
          />
          <Select
            label="Activity Type"
            name="activity_type"
            options={TYPE_FILTER_OPTIONS}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <Select
            label="Review Status"
            name="review_status"
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            label="Sort By"
            name="sort"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value as ReviewQueueSort)}
          />
          <Input
            label="Search Student"
            name="student_search"
            type="text"
            placeholder="Student name…"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Queue table */}
      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-rise-muted">No submissions match your filters.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-rise-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rise-navy text-white">
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">Organization</th>
                <th className="px-4 py-3 text-left font-medium">Cohort</th>
                <th className="px-4 py-3 text-left font-medium">Module</th>
                <th className="px-4 py-3 text-left font-medium">Activity</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-center font-medium">Submitted</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Waiting</th>
                <th className="px-4 py-3 text-center font-medium">Review</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t border-rise-border ${item.is_overdue ? "bg-rise-red/5" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-rise-navy">{item.student_name}</td>
                  <td className="px-4 py-3 text-rise-muted">{item.organization_name}</td>
                  <td className="px-4 py-3 text-rise-muted">{item.cohort_name}</td>
                  <td className="px-4 py-3 text-rise-muted">M{item.module_number}</td>
                  <td className="px-4 py-3 text-rise-navy">{item.activity_title}</td>
                  <td className="px-4 py-3 text-rise-muted">{TYPE_LABELS[item.submission_type] ?? item.submission_type}</td>
                  <td className="px-4 py-3 text-center text-rise-muted">{formatDate(item.submitted_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.review_status] ?? ""}`}>
                      {STATUS_LABELS[item.review_status] ?? item.review_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold ${item.is_overdue ? "text-rise-red" : "text-rise-muted"}`}>
                      {item.days_waiting}d
                      {item.is_overdue && " ⚠"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/instructor/reviews/${item.id}`}
                      className="rounded-lg bg-rise-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-rise-navy-light"
                    >
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
