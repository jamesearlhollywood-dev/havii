import Link from "next/link";
import type { StudentOutcomesProfile } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "./Charts";

export function StudentOutcomesProfileView({
  student,
  backHref,
}: {
  student: StudentOutcomesProfile;
  backHref: string;
}) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-rise-muted">
        <Link href={backHref} className="hover:text-rise-navy">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-rise-navy">{student.student_name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-rise-navy">{student.student_name}</h1>
          <p className="text-sm text-rise-muted">
            {student.organization_name} · {student.cohort_name}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
          student.enrollment_status === "completed"
            ? "bg-rise-success-light text-rise-success"
            : student.enrollment_status === "in_progress"
            ? "bg-rise-sky text-rise-navy"
            : "bg-rise-border text-rise-muted"
        }`}>
          {student.enrollment_status.replace("_", " ")}
        </span>
      </div>

      {/* Overview rings */}
      <div className="flex flex-wrap items-center justify-around gap-6 rounded-2xl border border-rise-border bg-white p-6 shadow-sm">
        <div className="text-center">
          <ProgressRing
            value={student.overall_progress}
            label={`${student.overall_progress}%`}
            sublabel="Progress"
          />
          <p className="mt-2 text-sm font-medium text-rise-muted">Overall Progress</p>
        </div>
        <div className="text-center">
          <ProgressRing
            value={Math.round((student.modules_completed / 6) * 100)}
            label={`${student.modules_completed}/6`}
            sublabel="Modules"
            color="var(--rise-blue-dark)"
          />
          <p className="mt-2 text-sm font-medium text-rise-muted">Modules Completed</p>
        </div>
        {student.starting_confidence !== null && (
          <div className="text-center">
            <ProgressRing
              value={Math.round((student.starting_confidence / 5) * 100)}
              label={student.starting_confidence.toFixed(1)}
              sublabel="Pre / 5"
              color="var(--rise-blue-light)"
            />
            <p className="mt-2 text-sm font-medium text-rise-muted">Starting Confidence</p>
          </div>
        )}
        {student.ending_confidence !== null && (
          <div className="text-center">
            <ProgressRing
              value={Math.round((student.ending_confidence / 5) * 100)}
              label={student.ending_confidence.toFixed(1)}
              sublabel="Post / 5"
              color="var(--rise-success)"
            />
            <p className="mt-2 text-sm font-medium text-rise-muted">Ending Confidence</p>
          </div>
        )}
      </div>

      {/* Confidence change note */}
      {student.confidence_change !== null && (
        <div className="rounded-xl border border-rise-blue-light bg-rise-sky px-4 py-3 text-sm">
          <strong className="text-rise-navy">Confidence Change:</strong>{" "}
          <span className={student.confidence_change > 0 ? "text-rise-success" : "text-rise-muted"}>
            {student.confidence_change > 0 ? "+" : ""}{student.confidence_change.toFixed(1)} points
          </span>
          <span className="text-rise-muted"> (self-reported, not a measure of financial behavior)</span>
        </div>
      )}

      {/* Module details table */}
      <div className="overflow-x-auto rounded-2xl border border-rise-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rise-navy text-white">
              <th className="px-4 py-3 text-left font-medium">Module</th>
              <th className="px-4 py-3 text-center font-medium">KC Score</th>
              <th className="px-4 py-3 text-center font-medium">KC Passed</th>
              <th className="px-4 py-3 text-center font-medium">Decision Lab</th>
              <th className="px-4 py-3 text-center font-medium">Blueprint</th>
              <th className="px-4 py-3 text-center font-medium">Completed</th>
            </tr>
          </thead>
          <tbody>
            {student.module_details.map((m) => (
              <tr key={m.module_id} className="border-t border-rise-border">
                <td className="px-4 py-3">
                  <span className="font-medium text-rise-navy">M{m.module_number}</span>
                  <span className="block text-xs text-rise-muted">{m.module_title.split("—")[0]}</span>
                </td>
                <td className="px-4 py-3 text-center text-rise-navy">
                  {m.knowledge_check_score !== null ? `${m.knowledge_check_score}%` : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {m.knowledge_check_passed ? (
                    <span className="text-rise-success">✓</span>
                  ) : (
                    <span className="text-rise-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {m.decision_lab_completed ? (
                    <span className="text-rise-success">✓</span>
                  ) : (
                    <span className="text-rise-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {m.blueprint_section_completed ? (
                    <span className="text-rise-success">✓</span>
                  ) : (
                    <span className="text-rise-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {m.module_completed ? (
                    <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs font-semibold text-rise-success">Yes</span>
                  ) : (
                    <span className="rounded-full bg-rise-border px-2 py-0.5 text-xs font-medium text-rise-muted">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-rise-muted">Decision Labs</p>
          <p className="mt-1 text-2xl font-bold text-rise-navy">{student.decision_labs_completed}/6</p>
        </Card>
        <Card>
          <p className="text-sm text-rise-muted">Blueprint Sections</p>
          <p className="mt-1 text-2xl font-bold text-rise-navy">{student.blueprint_sections_completed}/6</p>
        </Card>
        <Card>
          <p className="text-sm text-rise-muted">Final Assessment</p>
          <p className="mt-1 text-2xl font-bold text-rise-navy">
            {student.final_assessment_score !== null
              ? `${student.final_assessment_score}%`
              : "Not taken"}
          </p>
          {student.final_assessment_passed && (
            <p className="text-xs text-rise-success">Passed</p>
          )}
        </Card>
        <Card>
          <p className="text-sm text-rise-muted">Certificate</p>
          <p className="mt-1 text-2xl font-bold capitalize text-rise-navy">
            {student.certificate_status.replace("_", " ")}
          </p>
        </Card>
      </div>

      {/* Privacy note */}
      <div className="rounded-xl border border-rise-border bg-rise-sky px-4 py-3 text-xs text-rise-muted">
        Student Financial Blueprint written responses are private and are not
        shown on analytics dashboards.
      </div>
    </div>
  );
}
