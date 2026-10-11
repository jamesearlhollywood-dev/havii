"use client";

import type { StudentProgressSummary } from "@/lib/types";

function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCSV(value: string | number | null | undefined): string {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportStudentCompletion(students: StudentProgressSummary[]) {
  const headers = [
    "Student Name", "Organization", "Cohort", "Enrollment Status",
    "Lessons Completed", "Modules Completed", "Overall Progress",
    "Best Quiz Score", "Quiz Passed", "Decision Labs Completed",
    "Blueprint Sections", "Has Certificate", "Last Activity", "Stalled",
  ];

  const rows = students.map((s) => [
    s.student_name, s.organization_name, s.cohort_name, s.enrollment_status,
    s.lessons_completed, s.modules_completed, `${s.overall_progress}%`,
    s.best_quiz_score ?? "", s.quiz_passed ? "Yes" : "No", s.decision_labs_completed,
    s.blueprint_sections_completed, s.has_certificate ? "Yes" : "No",
    s.last_activity_date ?? "", s.is_stalled ? "Yes" : "No",
  ].map(escapeCSV).join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  downloadCSV("student-completion-report.csv", csv);
}

export function exportCertificates(certificates: any[]) {
  const headers = [
    "Certificate ID", "Student Name", "Course Name",
    "Organization", "Cohort", "Instructor",
    "Issued Date", "Status",
  ];

  const rows = certificates.map((c) => [
    c.certificate_id, c.student_name, c.course_name,
    c.organization_name ?? "", c.cohort_name ?? "", c.instructor_name ?? "",
    c.issued_at, c.status,
  ].map(escapeCSV).join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  downloadCSV("certificates-report.csv", csv);
}

export function exportCohortCompletion(students: StudentProgressSummary[]) {
  // Group by cohort
  const cohorts = new Map<string, StudentProgressSummary[]>();
  for (const s of students) {
    const arr = cohorts.get(s.cohort_name) ?? [];
    arr.push(s);
    cohorts.set(s.cohort_name, arr);
  }

  const headers = ["Cohort", "Total Students", "Completed", "Completion Rate", "Active", "Stalled", "Avg Score"];
  const rows: string[] = [];

  for (const [cohortName, cohortStudents] of cohorts) {
    const total = cohortStudents.length;
    const completed = cohortStudents.filter((s) => s.has_certificate).length;
    const active = cohortStudents.filter((s) => s.lessons_completed > 0 && !s.is_stalled && !s.has_certificate).length;
    const stalled = cohortStudents.filter((s) => s.is_stalled).length;
    const scores = cohortStudents.filter((s) => s.best_quiz_score !== null).map((s) => s.best_quiz_score!);
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    rows.push([cohortName, total, completed, `${rate}%`, active, stalled, `${avg}%`].map(escapeCSV).join(","));
  }

  const csv = [headers.join(","), ...rows].join("\n");
  downloadCSV("cohort-completion-report.csv", csv);
}

// Client-side button components
export function ExportStudentCompletionButton({ students }: { students: StudentProgressSummary[] }) {
  return (
    <button
      type="button"
      onClick={() => exportStudentCompletion(students)}
      className="rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light"
    >
      Export Student Completion CSV
    </button>
  );
}

export function ExportCertificatesButton({ certificates }: { certificates: any[] }) {
  return (
    <button
      type="button"
      onClick={() => exportCertificates(certificates)}
      className="rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light"
    >
      Export Certificates CSV
    </button>
  );
}

export function ExportCohortCompletionButton({ students }: { students: StudentProgressSummary[] }) {
  return (
    <button
      type="button"
      onClick={() => exportCohortCompletion(students)}
      className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
    >
      Export Cohort Rates CSV
    </button>
  );
}
