import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { modules, TOTAL_LESSONS } from "@/data/course";
import { formatDate } from "@/lib/utils";
import { PrintButton } from "@/components/ui/PrintButton";
import type {
  StudentProgressSummary,
  Enrollment,
  Cohort,
  Certificate,
} from "@/lib/types";
import type { StudentRecordDetail } from "@/data/demo-data";

type CohortWithInstructor = Cohort & { organization_name: string; instructor_name: string | null };

interface StudentRecordViewProps {
  student: StudentProgressSummary;
  enrollment: Enrollment | undefined;
  cohort: CohortWithInstructor | undefined;
  certificate: Certificate | undefined;
  recordDetail: StudentRecordDetail | undefined;
  dashboardHref: string;
  dashboardLabel: string;
}

export function StudentRecordView({
  student,
  enrollment,
  cohort,
  certificate,
  recordDetail,
  dashboardHref,
  dashboardLabel,
}: StudentRecordViewProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
        <Link href={dashboardHref} className="hover:text-rise-navy">
          {dashboardLabel}
        </Link>
        <span>/</span>
        <span className="text-rise-navy">{student.student_name}</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-rise-navy">Student Course Record</h1>
          <p className="mt-1 text-sm text-rise-muted">{student.student_name}</p>
        </div>
        <div className="flex gap-2">
          <PrintButton label="Print Record" />
        </div>
      </div>

      {/* Student info */}
      <Card className="mb-4">
        <CardTitle>Student Information</CardTitle>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <InfoRow label="Student" value={student.student_name} />
          <InfoRow label="Organization" value={student.organization_name} />
          <InfoRow label="Cohort" value={student.cohort_name} />
          <InfoRow label="Instructor" value={cohort?.instructor_name || "Unassigned"} />
          <InfoRow label="Enrollment Date" value={enrollment ? formatDate(enrollment.enrolled_at) : "—"} />
          <InfoRow label="Completion Date" value={student.has_certificate ? formatDate(certificate?.issued_at || new Date().toISOString()) : "—"} />
        </div>
      </Card>

      {/* Overall progress */}
      <Card className="mb-4">
        <CardTitle>Overall Progress</CardTitle>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-rise-muted">Course Progress</span>
            <span className="font-bold text-rise-navy">{student.overall_progress}%</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-rise-border">
            <div
              className="h-full rounded-full bg-rise-blue"
              style={{ width: `${student.overall_progress}%` }}
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <InfoRow label="Lessons Completed" value={`${student.lessons_completed}/${TOTAL_LESSONS}`} />
            <InfoRow label="Modules Completed" value={`${student.modules_completed}/6`} />
            <InfoRow label="Decision Labs" value={`${student.decision_labs_completed}/6`} />
            <InfoRow label="Blueprint Sections" value={`${student.blueprint_sections_completed}/6`} />
            <InfoRow label="Best Quiz Score" value={student.best_quiz_score !== null ? `${student.best_quiz_score}%` : "—"} />
            <InfoRow label="Quiz Passed" value={student.quiz_passed ? "Yes" : "No"} />
          </div>
        </div>
      </Card>

      {/* Module completion with detailed breakdown */}
      <Card className="mb-4">
        <CardTitle>Module Completion & Assessment Details</CardTitle>
        <div className="mt-3 space-y-3">
          {modules.map((m) => {
            const detail = recordDetail?.modules.find((d) => d.module_id === m.id);
            const isComplete = detail?.module_completed ?? false;
            return (
              <div key={m.number} className="rounded-xl border border-rise-border p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rise-sky text-lg">{m.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">Module {m.number}</p>
                    <p className="text-sm text-rise-navy">{m.title.split("—")[0].trim()}</p>
                  </div>
                  {isComplete ? (
                    <span className="rounded-full bg-rise-success-light px-3 py-1 text-xs font-semibold text-rise-success">✓ Complete</span>
                  ) : (
                    <span className="rounded-full bg-rise-border px-3 py-1 text-xs font-medium text-rise-muted">Incomplete</span>
                  )}
                </div>
                {/* Per-module breakdown */}
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <DetailChip
                    label="Lessons"
                    value={detail ? `${detail.lessons_completed}/${detail.lessons_total}` : "—"}
                    done={detail?.lessons_completed === detail?.lessons_total}
                  />
                  <DetailChip
                    label="Knowledge Check"
                    value={detail?.knowledge_check_score !== null && detail?.knowledge_check_score !== undefined ? `${detail.knowledge_check_score}%` : "Not taken"}
                    done={detail?.knowledge_check_passed ?? false}
                  />
                  <DetailChip
                    label="Decision Lab"
                    value={detail?.decision_lab_completed ? "Submitted" : "Pending"}
                    done={detail?.decision_lab_completed ?? false}
                  />
                  <DetailChip
                    label="Blueprint Section"
                    value={detail?.blueprint_section_completed ? "Complete" : "Pending"}
                    done={detail?.blueprint_section_completed ?? false}
                  />
                </div>
                {detail && detail.knowledge_check_attempts > 0 && (
                  <p className="mt-2 text-xs text-rise-muted">
                    Knowledge Check attempts: {detail.knowledge_check_attempts}
                    {detail.knowledge_check_score !== null && ` · Best score: ${detail.knowledge_check_score}%`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Final assessment & certificate */}
      <Card className="mb-4">
        <CardTitle>Final Assessment & Certificate</CardTitle>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <InfoRow
            label="Final Assessment Score"
            value={recordDetail?.final_assessment_score !== null && recordDetail?.final_assessment_score !== undefined ? `${recordDetail.final_assessment_score}%` : "Not taken"}
          />
          <InfoRow
            label="Final Assessment Status"
            value={recordDetail?.final_assessment_passed ? "Passed" : "Not passed"}
          />
          <InfoRow label="Certificate ID" value={certificate?.certificate_id || "—"} />
          <InfoRow label="Certificate Status" value={certificate?.status || "Not issued"} />
          <InfoRow label="Completion Status" value={student.enrollment_status === "completed" ? "Completed" : "In Progress"} />
          <InfoRow label="Eligible for Completion" value={student.eligible_for_completion ? "Yes" : "No"} />
        </div>
      </Card>

      {/* Printable Course Completion Record */}
      <div className="mt-8 hidden print:block">
        <div className="rounded-2xl border-2 border-rise-navy bg-white p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rise-navy text-lg font-bold text-white">
              R
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-rise-red">RISE USA</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-rise-muted">
              Roadmap to Income, Savings, and Equity
            </p>
            <div className="mx-auto my-4 h-px w-32 bg-rise-border" />
            <p className="text-sm font-bold text-rise-navy">Course Completion Record</p>
            <p className="mt-4 text-sm text-rise-muted">This document certifies that</p>
            <p className="mt-2 text-xl font-bold text-rise-navy">{student.student_name}</p>
            <p className="mt-3 text-sm text-rise-muted">has completed all requirements of</p>
            <p className="mt-1 text-base font-semibold text-rise-navy">
              RISE USA: Roadmap to Income, Savings, and Equity
            </p>
          </div>

          <div className="mt-6 space-y-1">
            {modules.map((m) => {
              const detail = recordDetail?.modules.find((d) => d.module_id === m.id);
              const isComplete = detail?.module_completed ?? false;
              return (
                <div key={m.number} className="flex justify-between border-b border-rise-border py-1 text-sm">
                  <span className="text-rise-navy">Module {m.number}: {m.title.split("—")[0].trim()}</span>
                  <span className="font-medium text-rise-success">{isComplete ? "✓ Completed" : "—"}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between text-sm">
            <div>
              <p className="text-xs text-rise-muted">Total Course Status</p>
              <p className="font-medium text-rise-navy">{student.enrollment_status === "completed" ? "Completed" : "In Progress"}</p>
            </div>
            <div>
              <p className="text-xs text-rise-muted">Completion Date</p>
              <p className="font-medium text-rise-navy">
                {student.has_certificate ? formatDate(certificate?.issued_at || new Date().toISOString()) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-rise-muted">Final Assessment</p>
              <p className="font-medium text-rise-navy">
                {recordDetail?.final_assessment_passed
                  ? `Passed (${recordDetail.final_assessment_score}%)`
                  : "Not passed"}
              </p>
            </div>
            <div>
              <p className="text-xs text-rise-muted">Certificate Number</p>
              <p className="font-mono text-rise-navy">{certificate?.certificate_id || "—"}</p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs font-medium uppercase tracking-wider text-rise-blue">
            Build What Lasts
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-rise-muted">{label}</p>
      <p className="text-sm font-medium text-rise-navy">{value}</p>
    </div>
  );
}

function DetailChip({ label, value, done }: { label: string; value: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-rise-sky px-3 py-2">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${done ? "bg-rise-success text-white" : "bg-rise-border text-rise-muted"}`}>
        {done ? "✓" : "○"}
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-rise-muted">{label}</p>
        <p className="text-xs font-medium text-rise-navy">{value}</p>
      </div>
    </div>
  );
}
