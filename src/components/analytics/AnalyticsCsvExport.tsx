"use client";

import type {
  StudentProgressSummary,
  ModulePerformance,
  ConfidenceAnalysis,
  AnalyticsMetrics,
} from "@/lib/types";

function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function esc(value: string | number | null | undefined): string {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// --- Enrollment Report ---
export function exportEnrollmentReport(students: StudentProgressSummary[]) {
  const headers = ["Student Name", "Organization", "Cohort", "Enrollment Status", "Enrolled Date"];
  const rows = students.map((s) =>
    [s.student_name, s.organization_name, s.cohort_name, s.enrollment_status, ""].map(esc).join(",")
  );
  downloadCSV("enrollment-report.csv", [headers.join(","), ...rows].join("\n"));
}

// --- Student Progress Report ---
export function exportStudentProgressReport(students: StudentProgressSummary[]) {
  const headers = [
    "Student Name", "Organization", "Cohort",
    "Lessons Completed", "Modules Completed", "Overall Progress",
    "Last Activity", "Stalled",
  ];
  const rows = students.map((s) =>
    [s.student_name, s.organization_name, s.cohort_name,
     s.lessons_completed, s.modules_completed, `${s.overall_progress}%`,
     s.last_activity_date ?? "", s.is_stalled ? "Yes" : "No"].map(esc).join(",")
  );
  downloadCSV("student-progress-report.csv", [headers.join(","), ...rows].join("\n"));
}

// --- Module Completion Report ---
export function exportModuleCompletionReport(students: StudentProgressSummary[]) {
  const headers = ["Student Name", "Modules Completed", "Decision Labs", "Blueprint Sections", "Module Completion Rate"];
  const rows = students.map((s) =>
    [s.student_name, s.modules_completed, s.decision_labs_completed,
     s.blueprint_sections_completed, `${Math.round((s.modules_completed / 6) * 100)}%`].map(esc).join(",")
  );
  downloadCSV("module-completion-report.csv", [headers.join(","), ...rows].join("\n"));
}

// --- Assessment Results ---
export function exportAssessmentResults(students: StudentProgressSummary[]) {
  const headers = ["Student Name", "Cohort", "Best Quiz Score", "Quiz Passed", "Final Assessment Status"];
  const rows = students.map((s) =>
    [s.student_name, s.cohort_name, s.best_quiz_score ?? "",
     s.quiz_passed ? "Passed" : "Not Passed",
     s.has_certificate ? "Passed" : "Not Taken"].map(esc).join(",")
  );
  downloadCSV("assessment-results.csv", [headers.join(","), ...rows].join("\n"));
}

// --- Knowledge Check Results ---
export function exportKnowledgeCheckResults(modules: ModulePerformance[]) {
  const headers = ["Module", "Avg KC Score", "Pass Rate", "Avg Attempts", "Most Missed Topics", "Strongest Topics"];
  const rows = modules.map((m) =>
    [`M${m.module_number}: ${m.module_title}`, `${m.avg_knowledge_check_score}%`,
     `${m.pass_rate}%`, m.avg_attempts,
     m.most_missed_topics.join("; "), m.strongest_topics.join("; ")].map(esc).join(",")
  );
  downloadCSV("knowledge-check-results.csv", [headers.join(","), ...rows].join("\n"));
}

// --- Pre/Post Confidence Results ---
export function exportConfidenceResults(analysis: ConfidenceAnalysis) {
  const headers = ["Question", "Avg Pre", "Avg Post", "Change"];
  const rows = analysis.by_topic.map((t) =>
    [t.question, t.avg_pre, t.avg_post, t.change].map(esc).join(",")
  );
  const summary = ["", "", "", ""].map(esc).join(",");
  const summaryRow = [`OVERALL (${analysis.level_name})`, analysis.avg_pre_score, analysis.avg_post_score, analysis.percentage_change + "%"].map(esc).join(",");
  downloadCSV("confidence-results.csv", [headers.join(","), ...rows, summary, summaryRow].join("\n"));
}

// --- Cohort Outcomes ---
export function exportCohortOutcomes(students: StudentProgressSummary[]) {
  const cohorts = new Map<string, StudentProgressSummary[]>();
  for (const s of students) {
    const arr = cohorts.get(s.cohort_name) ?? [];
    arr.push(s);
    cohorts.set(s.cohort_name, arr);
  }
  const headers = ["Cohort", "Total", "Completed", "Completion Rate", "Active", "Stalled", "Avg Score", "Avg Progress"];
  const rows: string[] = [];
  for (const [name, cs] of cohorts) {
    const total = cs.length;
    const completed = cs.filter((s) => s.has_certificate).length;
    const active = cs.filter((s) => s.lessons_completed > 0 && !s.is_stalled && !s.has_certificate).length;
    const stalled = cs.filter((s) => s.is_stalled).length;
    const scores = cs.filter((s) => s.best_quiz_score !== null).map((s) => s.best_quiz_score!);
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const avgProg = cs.length > 0 ? Math.round(cs.reduce((a, s) => a + s.overall_progress, 0) / cs.length) : 0;
    rows.push([name, total, completed, `${Math.round((completed / total) * 100)}%`, active, stalled, `${avg}%`, `${avgProg}%`].map(esc).join(","));
  }
  downloadCSV("cohort-outcomes.csv", [headers.join(","), ...rows].join("\n"));
}

// --- Button components ---
function ExportBtn({ onClick, label, variant = "primary" }: { onClick: () => void; label: string; variant?: "primary" | "outline" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        variant === "primary"
          ? "rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light"
          : "rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
      }
    >
      {label}
    </button>
  );
}

export function ExportEnrollmentButton({ students }: { students: StudentProgressSummary[] }) {
  return <ExportBtn onClick={() => exportEnrollmentReport(students)} label="Enrollment CSV" />;
}
export function ExportProgressButton({ students }: { students: StudentProgressSummary[] }) {
  return <ExportBtn onClick={() => exportStudentProgressReport(students)} label="Progress CSV" />;
}
export function ExportModuleCompletionButton({ students }: { students: StudentProgressSummary[] }) {
  return <ExportBtn onClick={() => exportModuleCompletionReport(students)} label="Module Completion CSV" />;
}
export function ExportAssessmentResultsButton({ students }: { students: StudentProgressSummary[] }) {
  return <ExportBtn onClick={() => exportAssessmentResults(students)} label="Assessment Results CSV" />;
}
export function ExportKnowledgeCheckButton({ modules }: { modules: ModulePerformance[] }) {
  return <ExportBtn onClick={() => exportKnowledgeCheckResults(modules)} label="Knowledge Check CSV" />;
}
export function ExportConfidenceButton({ analysis }: { analysis: ConfidenceAnalysis }) {
  return <ExportBtn onClick={() => exportConfidenceResults(analysis)} label="Confidence Results CSV" />;
}
export function ExportCohortOutcomesButton({ students }: { students: StudentProgressSummary[] }) {
  return <ExportBtn onClick={() => exportCohortOutcomes(students)} label="Cohort Outcomes CSV" />;
}
