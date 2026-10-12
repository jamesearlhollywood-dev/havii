import type {
  StudentProgressSummary,
  ModulePerformance,
  ConfidenceAnalysis,
} from "@/lib/types";
import { BarChart } from "./Charts";

export function CohortOutcomesReport({
  organizationName,
  cohortName,
  reportingPeriod,
  students,
  modulePerformance,
  confidenceAnalysis,
  anonymized = false,
}: {
  organizationName: string;
  cohortName: string;
  reportingPeriod: string;
  students: StudentProgressSummary[];
  modulePerformance: ModulePerformance[];
  confidenceAnalysis: ConfidenceAnalysis;
  anonymized?: boolean;
}) {
  const enrollmentCount = students.length;
  const completionCount = students.filter((s) => s.has_certificate).length;
  const completionRate = enrollmentCount > 0 ? Math.round((completionCount / enrollmentCount) * 100) : 0;
  const certCount = students.filter((s) => s.has_certificate).length;

  const assessedStudents = students.filter((s) => s.best_quiz_score !== null);
  const avgAssessment = assessedStudents.length > 0
    ? Math.round(assessedStudents.reduce((sum, s) => sum + (s.best_quiz_score ?? 0), 0) / assessedStudents.length)
    : 0;

  // Strengths and areas needing instruction
  const sortedByScore = [...modulePerformance].sort((a, b) => b.avg_knowledge_check_score - a.avg_knowledge_check_score);
  const strengths = sortedByScore.slice(0, 3);
  const needsWork = sortedByScore.slice(-3).reverse();

  return (
    <div className="rounded-2xl border border-rise-border bg-white p-8 shadow-sm print:block">
      {/* Header */}
      <div className="mb-6 border-b-2 border-rise-navy pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-rise-navy">RISE USA Cohort Outcomes Report</h1>
            <p className="text-sm text-rise-muted">Roadmap to Income, Savings, and Equity</p>
          </div>
          <div className="text-right text-sm text-rise-muted">
            <p>Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            {anonymized && <p className="font-semibold text-rise-red">ANONYMIZED</p>}
          </div>
        </div>
      </div>

      {/* Report metadata */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs font-medium text-rise-muted">Organization</p>
          <p className="font-semibold text-rise-navy">{organizationName}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-rise-muted">Cohort</p>
          <p className="font-semibold text-rise-navy">{cohortName}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-rise-muted">Reporting Period</p>
          <p className="font-semibold text-rise-navy">{reportingPeriod}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-rise-muted">Report Type</p>
          <p className="font-semibold text-rise-navy">{anonymized ? "Anonymized" : "Standard"}</p>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Enrollment Count", value: enrollmentCount },
          { label: "Completion Count", value: completionCount },
          { label: "Completion Rate", value: `${completionRate}%` },
          { label: "Avg Assessment Score", value: `${avgAssessment}%` },
          { label: "Certificate Count", value: certCount },
          { label: "Active Students", value: students.filter((s) => s.lessons_completed > 0 && !s.is_stalled && !s.has_certificate).length },
          { label: "Stalled Students", value: students.filter((s) => s.is_stalled).length },
          { label: "Avg Progress", value: `${enrollmentCount > 0 ? Math.round(students.reduce((a, s) => a + s.overall_progress, 0) / enrollmentCount) : 0}%` },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-rise-border bg-rise-sky px-4 py-3">
            <p className="text-xs text-rise-muted">{m.label}</p>
            <p className="mt-1 text-xl font-bold text-rise-navy">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Module-level performance */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-rise-navy">Module-Level Performance</h2>
        <div className="overflow-x-auto rounded-xl border border-rise-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-rise-navy text-white">
                <th className="px-3 py-2 text-left">Module</th>
                <th className="px-3 py-2 text-center">Avg KC Score</th>
                <th className="px-3 py-2 text-center">Pass Rate</th>
                <th className="px-3 py-2 text-center">Avg Attempts</th>
              </tr>
            </thead>
            <tbody>
              {modulePerformance.map((m) => (
                <tr key={m.module_id} className="border-t border-rise-border">
                  <td className="px-3 py-2 text-rise-navy">M{m.module_number}: {m.module_title.split("—")[0]}</td>
                  <td className="px-3 py-2 text-center font-semibold">{m.avg_knowledge_check_score}%</td>
                  <td className="px-3 py-2 text-center">{m.pass_rate}%</td>
                  <td className="px-3 py-2 text-center">{m.avg_attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pre/Post Confidence */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-rise-navy">
          Pre/Post Financial Confidence Improvement
        </h2>
        <p className="mb-3 text-xs text-rise-muted">
          Self-reported financial confidence (1–5 scale). Not a measure of financial behavior or success.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-rise-border bg-rise-sky px-4 py-3">
            <p className="text-xs text-rise-muted">Avg Pre-Course</p>
            <p className="mt-1 text-xl font-bold text-rise-navy">{confidenceAnalysis.avg_pre_score.toFixed(1)}/5</p>
          </div>
          <div className="rounded-xl border border-rise-border bg-rise-sky px-4 py-3">
            <p className="text-xs text-rise-muted">Avg Post-Course</p>
            <p className="mt-1 text-xl font-bold text-rise-navy">
              {confidenceAnalysis.has_post_data ? `${confidenceAnalysis.avg_post_score.toFixed(1)}/5` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-rise-border bg-rise-sky px-4 py-3">
            <p className="text-xs text-rise-muted">Improvement</p>
            <p className="mt-1 text-xl font-bold text-rise-success">
              {confidenceAnalysis.has_post_data ? `+${confidenceAnalysis.percentage_change}%` : "—"}
            </p>
          </div>
        </div>
        {confidenceAnalysis.has_post_data && (
          <div className="mt-4">
            <BarChart
              data={confidenceAnalysis.by_topic.map((t) => ({
                label: t.question.slice(0, 30) + "...",
                value: t.change,
              }))}
              color="var(--rise-success)"
            />
          </div>
        )}
      </div>

      {/* Strengths and areas needing instruction */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-rise-success/30 bg-rise-success-light p-4">
          <h3 className="mb-2 font-bold text-rise-success">Major Areas of Student Strength</h3>
          <ul className="space-y-1 text-sm text-rise-navy">
            {strengths.map((m) => (
              <li key={m.module_id}>
                • M{m.module_number}: {m.module_title.split("—")[0]} ({m.avg_knowledge_check_score}% avg)
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rise-warning/30 bg-rise-warning-light p-4">
          <h3 className="mb-2 font-bold text-rise-warning">Areas Requiring Additional Instruction</h3>
          <ul className="space-y-1 text-sm text-rise-navy">
            {needsWork.map((m) => (
              <li key={m.module_id}>
                • M{m.module_number}: {m.module_title.split("—")[0]} ({m.avg_knowledge_check_score}% avg)
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="border-t border-rise-border pt-4 text-xs text-rise-muted">
        <p>
          This report excludes Social Security numbers, financial account information,
          passwords, private Financial Blueprint answers, and other sensitive information.
          {anonymized && " Individual student names have been removed for anonymized reporting."}
          {!anonymized && " Do not publicly rank students, schools, instructors, or organizations based on this data."}
        </p>
      </div>
    </div>
  );
}
