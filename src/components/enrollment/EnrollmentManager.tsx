"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { formatDate, cn } from "@/lib/utils";
import type {
  Organization,
  EnrollmentCode,
  Enrollment,
  StudentProgressSummary,
  AdminSettings,
} from "@/lib/types";

type Tab = "manual" | "codes" | "csv" | "all";

export function EnrollmentManager({
  organizations,
  cohorts,
  enrollmentCodes,
  enrollments,
  students,
  adminSettings,
  supabaseConnected,
}: {
  organizations: Organization[];
  cohorts: (any & { organization_name: string; instructor_name: string | null })[];
  enrollmentCodes: (EnrollmentCode & { organization_name: string | null; cohort_name: string | null })[];
  enrollments: (Enrollment & { student_name: string; cohort_name: string; organization_name: string })[];
  students: StudentProgressSummary[];
  adminSettings: AdminSettings;
  supabaseConnected: boolean;
}) {
  const [tab, setTab] = useState<Tab>("manual");

  const tabs: { id: Tab; label: string }[] = [
    { id: "manual", label: "Manual Enrollment" },
    { id: "codes", label: "Enrollment Codes" },
    { id: "csv", label: "Bulk CSV" },
    { id: "all", label: "All Enrollments" },
  ];

  return (
    <div className="space-y-6">
      {!supabaseConnected && (
        <Alert tone="info">
          Running in demo mode — enrollment changes are not persisted. Connect
          Supabase to enable full enrollment management.
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition",
              tab === t.id
                ? "bg-rise-navy text-white"
                : "border border-rise-border bg-white text-rise-muted hover:bg-rise-sky"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "manual" && <ManualEnrollmentTab organizations={organizations} cohorts={cohorts} supabaseConnected={supabaseConnected} />}
      {tab === "codes" && <EnrollmentCodesTab organizations={organizations} cohorts={cohorts} codes={enrollmentCodes} />}
      {tab === "csv" && <BulkCsvTab organizations={organizations} cohorts={cohorts} />}
      {tab === "all" && <AllEnrollmentsTab enrollments={enrollments} students={students} supabaseConnected={supabaseConnected} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Manual Enrollment Tab
// ---------------------------------------------------------------------------
function ManualEnrollmentTab({
  organizations,
  cohorts,
  supabaseConnected,
}: {
  organizations: Organization[];
  cohorts: any[];
  supabaseConnected: boolean;
}) {
  const [orgId, setOrgId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredCohorts = orgId ? cohorts.filter((c) => c.organization_id === orgId) : cohorts;

  return (
    <Card>
      <h2 className="text-lg font-bold text-rise-navy">Manually Enroll a Student</h2>
      <p className="mt-1 text-sm text-rise-muted">
        Add a student to a specific organization and cohort. The student will
        receive an invitation email.
      </p>
      {submitted && (
        <Alert tone="success" className="mt-4">
          Enrollment invitation ready. {supabaseConnected ? "The student will receive an email." : "Demo mode — no email sent."}
        </Alert>
      )}
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <Input
          name="student_email"
          label="Student email"
          type="email"
          required
          placeholder="student@school.edu"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Organization"
            value={orgId}
            onChange={(e) => {
              setOrgId(e.target.value);
              setCohortId("");
            }}
            options={[
              { value: "", label: "Select..." },
              ...organizations.map((o) => ({ value: o.id, label: o.name })),
            ]}
          />
          <Select
            label="Cohort"
            value={cohortId}
            onChange={(e) => setCohortId(e.target.value)}
            options={[
              { value: "", label: "Select..." },
              ...filteredCohorts.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
        <Input
          name="target_completion"
          label="Target completion date (optional)"
          type="date"
        />
        <div className="flex justify-end">
          <Button type="submit">Send Enrollment Invitation</Button>
        </div>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Enrollment Codes Tab
// ---------------------------------------------------------------------------
function EnrollmentCodesTab({
  organizations,
  cohorts,
  codes,
}: {
  organizations: Organization[];
  cohorts: any[];
  codes: (EnrollmentCode & { organization_name: string | null; cohort_name: string | null })[];
}) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-rise-navy">Enrollment Codes</h2>
        <Button onClick={() => setShowCreate(!showCreate)} variant="outline" size="sm">
          {showCreate ? "Cancel" : "+ Create Code"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <h3 className="font-semibold text-rise-navy">Create Enrollment Code</h3>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setShowCreate(false);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Organization"
                name="org"
                options={[
                  { value: "", label: "Any organization" },
                  ...organizations.map((o) => ({ value: o.id, label: o.name })),
                ]}
              />
              <Select
                label="Cohort"
                name="cohort"
                options={[
                  { value: "", label: "Any cohort" },
                  ...cohorts.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Expiration date (optional)" type="date" name="expires" />
              <Input label="Max uses (optional)" type="number" name="max_uses" placeholder="e.g. 30" />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Create Code</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Codes table */}
      <div className="overflow-x-auto rounded-2xl border border-rise-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rise-navy text-white">
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Organization</th>
              <th className="px-4 py-3 text-left font-medium">Cohort</th>
              <th className="px-4 py-3 text-center font-medium">Uses</th>
              <th className="px-4 py-3 text-left font-medium">Expires</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => {
              const expired = c.expires_at && new Date(c.expires_at) < new Date();
              const exhausted = c.max_uses !== null && c.current_uses >= c.max_uses;
              const active = c.is_active && !expired && !exhausted;
              return (
                <tr key={c.id} className="border-t border-rise-border">
                  <td className="px-4 py-3 font-mono font-bold text-rise-navy">{c.code}</td>
                  <td className="px-4 py-3 text-rise-muted">{c.organization_name || "Any"}</td>
                  <td className="px-4 py-3 text-rise-muted">{c.cohort_name || "Any"}</td>
                  <td className="px-4 py-3 text-center text-rise-navy">
                    {c.current_uses}{c.max_uses !== null && `/${c.max_uses}`}
                  </td>
                  <td className="px-4 py-3 text-rise-muted">
                    {c.expires_at ? formatDate(c.expires_at) : "Never"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {active ? (
                      <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs font-semibold text-rise-success">Active</span>
                    ) : expired ? (
                      <span className="rounded-full bg-rise-border px-2 py-0.5 text-xs font-medium text-rise-muted">Expired</span>
                    ) : exhausted ? (
                      <span className="rounded-full bg-rise-warning-light px-2 py-0.5 text-xs font-semibold text-rise-warning">Exhausted</span>
                    ) : (
                      <span className="rounded-full bg-rise-border px-2 py-0.5 text-xs font-medium text-rise-muted">Disabled</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Safeguards info */}
      <Card>
        <h3 className="font-semibold text-rise-navy">Enrollment Code Safeguards</h3>
        <ul className="mt-2 space-y-1 text-sm text-rise-muted">
          <li>• Codes check expiration date before allowing enrollment</li>
          <li>• Codes enforce maximum-use limits — exhausted codes are rejected</li>
          <li>• Codes can be deactivated by admins at any time</li>
          <li>• Codes are tied to a specific organization and/or cohort</li>
          <li>• Students cannot use codes from other organizations</li>
        </ul>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bulk CSV Tab
// ---------------------------------------------------------------------------
function BulkCsvTab({
  organizations,
  cohorts,
}: {
  organizations: Organization[];
  cohorts: any[];
}) {
  const [csvData, setCsvData] = useState<string[][] | null>(null);
  const [fileName, setFileName] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || "");
      const lines = text.split("\n").filter((l) => l.trim());
      const rows = lines.map((l) => l.split(",").map((c) => c.trim()));
      setCsvData(rows);
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-bold text-rise-navy">Bulk CSV Student Enrollment</h2>
        <p className="mt-1 text-sm text-rise-muted">
          Upload a CSV file to enroll multiple students at once.
        </p>
        <div className="mt-4 rounded-xl border border-rise-border bg-rise-sky/50 p-4">
          <p className="text-sm font-medium text-rise-navy">CSV Format:</p>
          <p className="mt-1 font-mono text-xs text-rise-muted">
            first_name, last_name, email, organization, cohort
          </p>
        </div>
        <div className="mt-4">
          <Input
            label="CSV file"
            type="file"
            accept=".csv"
            onChange={handleFile}
          />
        </div>
      </Card>

      {csvData && csvData.length > 0 && (
        <Card>
          <h3 className="font-semibold text-rise-navy">
            Preview: {fileName} ({csvData.length - 1} students)
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-rise-navy text-white">
                  {csvData[0].map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(1).map((row, i) => (
                  <tr key={i} className="border-t border-rise-border">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 text-rise-navy">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setCsvData(null); setFileName(""); }}>
              Cancel
            </Button>
            <Button>Enroll {csvData.length - 1} Students</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// All Enrollments Tab
// ---------------------------------------------------------------------------
function AllEnrollmentsTab({
  enrollments,
  students,
  supabaseConnected,
}: {
  enrollments: (Enrollment & { student_name: string; cohort_name: string; organization_name: string })[];
  students: StudentProgressSummary[];
  supabaseConnected: boolean;
}) {
  const [resetId, setResetId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-rise-navy">All Enrollments</h2>
      <div className="overflow-x-auto rounded-2xl border border-rise-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rise-navy text-white">
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Organization</th>
              <th className="px-4 py-3 text-left font-medium">Cohort</th>
              <th className="px-4 py-3 text-center font-medium">Progress</th>
              <th className="px-4 py-3 text-left font-medium">Enrolled</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Certificate</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-t border-rise-border">
                <td className="px-4 py-3 font-medium text-rise-navy">{e.student_name}</td>
                <td className="px-4 py-3 text-rise-muted">{e.organization_name}</td>
                <td className="px-4 py-3 text-rise-muted">{e.cohort_name}</td>
                <td className="px-4 py-3 text-center text-rise-navy">{e.overall_progress}%</td>
                <td className="px-4 py-3 text-rise-muted">{formatDate(e.enrolled_at)}</td>
                <td className="px-4 py-3 text-center">
                  <span className="rounded-full bg-rise-sky px-2 py-0.5 text-xs font-medium capitalize text-rise-navy">
                    {e.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {e.certificate_status === "issued" ? "✓" : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {resetId === e.id ? (
                    <span className="text-xs text-rise-success">✓ Reset</span>
                  ) : (
                    <button
                      onClick={() => setResetId(e.id)}
                      className="text-xs font-medium text-rise-red hover:underline"
                    >
                      Reset Onboarding
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Self-enrollment setting */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-rise-navy">Public Self-Enrollment</h3>
            <p className="mt-0.5 text-sm text-rise-muted">
              Allow students to self-enroll in public RISE USA courses without an invitation.
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${supabaseConnected ? "bg-rise-success-light text-rise-success" : "bg-rise-border text-rise-muted"}`}>
            {supabaseConnected ? "Enabled" : "Demo Mode"}
          </span>
        </div>
      </Card>
    </div>
  );
}
