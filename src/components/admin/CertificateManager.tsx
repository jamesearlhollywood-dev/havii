"use client";

import { useState, useMemo, useTransition } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { exportCertificates } from "@/components/admin/CsvExport";
import {
  revokeCertificate,
  reissueCertificate,
  manuallyIssueCertificate,
} from "@/actions/certificates";

interface CertRecord {
  id: string;
  certificate_id: string;
  student_name: string;
  course_name: string;
  issued_at: string;
  status: "issued" | "revoked";
  organization_name?: string | null;
  cohort_name?: string | null;
  instructor_name?: string | null;
  profile_id?: string;
}

interface AuditEntry {
  id: string;
  certificate_id: string;
  action: string;
  performed_by: string;
  note: string | null;
  created_at: string;
}

interface EligibleStudent {
  profile_id: string;
  student_name: string;
  organization_name: string;
  cohort_name: string;
  eligible_for_completion: boolean;
}

export function CertificateManager({
  certificates: initialCerts,
  auditLog: initialAudit,
  supabaseConnected,
  eligibleStudents = [],
}: {
  certificates: CertRecord[];
  auditLog: AuditEntry[];
  supabaseConnected: boolean;
  eligibleStudents?: EligibleStudent[];
}) {
  const [certificates, setCertificates] = useState(initialCerts);
  const [auditLog, setAuditLog] = useState(initialAudit);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterOrg, setFilterOrg] = useState("");
  const [filterCohort, setFilterCohort] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isPending, startTransition] = useTransition();

  // Action dialog state
  const [actionDialog, setActionDialog] = useState<{
    type: "revoke" | "reissue" | "issue";
    cert?: CertRecord;
  } | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [issueStudentId, setIssueStudentId] = useState("");
  const [actionResult, setActionResult] = useState<string | null>(null);

  // Derive filter options from certificates
  const orgs = useMemo(
    () => [...new Set(certificates.map((c) => c.organization_name).filter(Boolean))] as string[],
    [certificates]
  );
  const cohorts = useMemo(
    () => [...new Set(certificates.map((c) => c.cohort_name).filter(Boolean))] as string[],
    [certificates]
  );

  const filtered = useMemo(
    () =>
      certificates.filter((c) => {
        if (filterStatus && c.status !== filterStatus) return false;
        if (filterOrg && c.organization_name !== filterOrg) return false;
        if (filterCohort && c.cohort_name !== filterCohort) return false;
        if (filterDate) {
          const certDate = new Date(c.issued_at).toISOString().slice(0, 7);
          if (certDate !== filterDate) return false;
        }
        if (search) {
          const s = search.toLowerCase();
          return (
            c.student_name.toLowerCase().includes(s) ||
            c.certificate_id.toLowerCase().includes(s) ||
            (c.organization_name?.toLowerCase().includes(s) ?? false) ||
            (c.cohort_name?.toLowerCase().includes(s) ?? false)
          );
        }
        return true;
      }),
    [certificates, search, filterStatus, filterOrg, filterCohort, filterDate]
  );

  const issuedCount = certificates.filter((c) => c.status === "issued").length;
  const revokedCount = certificates.filter((c) => c.status === "revoked").length;

  function closeDialog() {
    setActionDialog(null);
    setActionNote("");
    setIssueStudentId("");
    setActionResult(null);
  }

  function handleAction() {
    if (!actionDialog) return;

    startTransition(async () => {
      if (!supabaseConnected) {
        // Demo mode — update local state
        if (actionDialog.type === "revoke" && actionDialog.cert) {
          const certId = actionDialog.cert.certificate_id;
          setCertificates((prev) =>
            prev.map((c) =>
              c.certificate_id === certId ? { ...c, status: "revoked" as const } : c
            )
          );
          setAuditLog((prev) => [
            {
              id: `audit-${Date.now()}`,
              certificate_id: certId,
              action: "revoked",
              performed_by: "demo-admin",
              note: actionNote || null,
              created_at: new Date().toISOString(),
            },
            ...prev,
          ]);
        } else if (actionDialog.type === "reissue" && actionDialog.cert) {
          const certId = actionDialog.cert.certificate_id;
          setCertificates((prev) =>
            prev.map((c) =>
              c.certificate_id === certId
                ? { ...c, status: "issued" as const, issued_at: new Date().toISOString() }
                : c
            )
          );
          setAuditLog((prev) => [
            {
              id: `audit-${Date.now()}`,
              certificate_id: certId,
              action: "reissued",
              performed_by: "demo-admin",
              note: actionNote || null,
              created_at: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
        closeDialog();
        return;
      }

      // Supabase mode — call server actions
      try {
        let result: { error?: string; success?: string };
        if (actionDialog.type === "revoke" && actionDialog.cert) {
          result = await revokeCertificate(actionDialog.cert.certificate_id, actionNote);
        } else if (actionDialog.type === "reissue" && actionDialog.cert) {
          result = await reissueCertificate(actionDialog.cert.certificate_id, actionNote);
        } else if (actionDialog.type === "issue" && issueStudentId) {
          result = await manuallyIssueCertificate(issueStudentId, actionNote);
        } else {
          closeDialog();
          return;
        }

        if (result.error) {
          setActionResult(result.error);
        } else {
          // Update local state to reflect server change
          if (actionDialog.type === "revoke" && actionDialog.cert) {
            const certId = actionDialog.cert.certificate_id;
            setCertificates((prev) =>
              prev.map((c) =>
                c.certificate_id === certId ? { ...c, status: "revoked" as const } : c
              )
            );
            setAuditLog((prev) => [
              {
                id: `audit-${Date.now()}`,
                certificate_id: certId,
                action: "revoked",
                performed_by: "demo-admin",
                note: actionNote || null,
                created_at: new Date().toISOString(),
              },
              ...prev,
            ]);
          } else if (actionDialog.type === "reissue" && actionDialog.cert) {
            const certId = actionDialog.cert.certificate_id;
            setCertificates((prev) =>
              prev.map((c) =>
                c.certificate_id === certId
                  ? { ...c, status: "issued" as const, issued_at: new Date().toISOString() }
                  : c
              )
            );
            setAuditLog((prev) => [
              {
                id: `audit-${Date.now()}`,
                certificate_id: certId,
                action: "reissued",
                performed_by: "demo-admin",
                note: actionNote || null,
                created_at: new Date().toISOString(),
              },
              ...prev,
            ]);
          }
          closeDialog();
        }
      } catch {
        setActionResult("An unexpected error occurred.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-rise-navy">Certificate Management</h1>
        <button
          type="button"
          onClick={() => setActionDialog({ type: "issue" })}
          className="rounded-xl bg-rise-red px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Manual Issue
        </button>
      </div>

      {!supabaseConnected && (
        <div className="mb-4 rounded-xl border border-rise-warning/30 bg-rise-warning-light p-3 text-sm text-rise-warning">
          Demo mode — Supabase not connected. Certificate actions are simulated locally and won&apos;t persist.
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-rise-muted">Total Certificates</p>
          <p className="mt-1 text-2xl font-bold text-rise-navy">{certificates.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-rise-muted">Issued</p>
          <p className="mt-1 text-2xl font-bold text-rise-success">{issuedCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-rise-muted">Revoked</p>
          <p className="mt-1 text-2xl font-bold text-rise-red">{revokedCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            type="text"
            placeholder="Search by student, cert ID, org, or cohort..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
          >
            <option value="">All Statuses</option>
            <option value="issued">Issued</option>
            <option value="revoked">Revoked</option>
          </select>
          <select
            value={filterOrg}
            onChange={(e) => setFilterOrg(e.target.value)}
            className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
          >
            <option value="">All Organizations</option>
            {orgs.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <select
            value={filterCohort}
            onChange={(e) => setFilterCohort(e.target.value)}
            className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
          >
            <option value="">All Cohorts</option>
            {cohorts.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="month"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
          />
          <button
            type="button"
            onClick={() => exportCertificates(filtered)}
            className="rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light"
          >
            Export CSV
          </button>
        </div>
      </Card>

      {/* Certificate table */}
      <div className="mb-8 overflow-x-auto rounded-2xl border border-rise-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rise-navy text-white">
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Certificate ID</th>
              <th className="px-4 py-3 text-left font-medium">Organization</th>
              <th className="px-4 py-3 text-left font-medium">Cohort</th>
              <th className="px-4 py-3 text-left font-medium">Issued</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-rise-border">
                <td className="px-4 py-3 font-medium text-rise-navy">{c.student_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-rise-muted">{c.certificate_id}</td>
                <td className="px-4 py-3 text-rise-muted">{c.organization_name || "—"}</td>
                <td className="px-4 py-3 text-rise-muted">{c.cohort_name || "—"}</td>
                <td className="px-4 py-3 text-rise-muted">{formatDate(c.issued_at)}</td>
                <td className="px-4 py-3 text-center">
                  {c.status === "issued" ? (
                    <span className="rounded-full bg-rise-success-light px-2 py-0.5 text-xs font-semibold text-rise-success">
                      Issued
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                      Revoked
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-1">
                    {c.status === "issued" ? (
                      <button
                        type="button"
                        onClick={() => setActionDialog({ type: "revoke", cert: c })}
                        className="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActionDialog({ type: "reissue", cert: c })}
                        className="rounded-lg border border-rise-border bg-white px-2 py-1 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                      >
                        Reissue
                      </button>
                    )}
                    <a
                      href={`/verify-certificate?id=${c.certificate_id}`}
                      className="rounded-lg border border-rise-border bg-white px-2 py-1 text-xs font-semibold text-rise-navy hover:bg-rise-sky"
                    >
                      Verify
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-rise-muted">
                  No certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Log */}
      <h2 className="mb-3 text-xl font-bold text-rise-navy">Audit History</h2>
      <div className="space-y-2">
        {auditLog.map((entry) => (
          <Card key={entry.id}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-rise-muted">{entry.certificate_id}</span>
                <span className={`ml-2 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  entry.action === "issued" ? "bg-rise-success-light text-rise-success" :
                  entry.action === "revoked" ? "bg-red-100 text-red-700" :
                  entry.action === "reissued" ? "bg-rise-blue/20 text-rise-blue" :
                  "bg-rise-sky text-rise-navy"
                }`}>
                  {entry.action.replace(/_/g, " ")}
                </span>
              </div>
              <span className="text-xs text-rise-muted">{formatDate(entry.created_at)}</span>
            </div>
            {entry.note && <p className="mt-1 text-sm text-rise-muted">{entry.note}</p>}
          </Card>
        ))}
        {auditLog.length === 0 && (
          <Card><CardDescription>No audit entries.</CardDescription></Card>
        )
        }
      </div>

      {/* Action Dialog */}
      {actionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeDialog}>
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {actionDialog.type === "revoke" && (
              <>
                <h3 className="text-lg font-bold text-rise-navy">Revoke Certificate</h3>
                <p className="mt-1 text-sm text-rise-muted">
                  Revoke <span className="font-mono">{actionDialog.cert?.certificate_id}</span> for{" "}
                  <span className="font-medium">{actionDialog.cert?.student_name}</span>?
                  This will invalidate the certificate immediately.
                </p>
              </>
            )}
            {actionDialog.type === "reissue" && (
              <>
                <h3 className="text-lg font-bold text-rise-navy">Reissue Certificate</h3>
                <p className="mt-1 text-sm text-rise-muted">
                  Reissue <span className="font-mono">{actionDialog.cert?.certificate_id}</span> for{" "}
                  <span className="font-medium">{actionDialog.cert?.student_name}</span>?
                  This will reactivate the certificate with a new issue date.
                </p>
              </>
            )}
            {actionDialog.type === "issue" && (
              <>
                <h3 className="text-lg font-bold text-rise-navy">Manually Issue Certificate</h3>
                <p className="mt-1 text-sm text-rise-muted">
                  Select a student to issue a certificate. This is an admin override — use when automated
                  eligibility checks cannot run.
                </p>
                <select
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
                >
                  <option value="">Select a student...</option>
                  {eligibleStudents.map((s) => (
                    <option key={s.profile_id} value={s.profile_id}>
                      {s.student_name} — {s.organization_name}
                      {s.eligible_for_completion ? " (eligible)" : " (override)"}
                    </option>
                  ))}
                </select>
              </>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-rise-navy">
                Administrative Note
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Explain the reason for this manual adjustment..."
                rows={3}
                className="mt-1 w-full rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy"
              />
            </div>

            {actionResult && (
              <p className="mt-2 text-sm text-red-600">{actionResult}</p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAction}
                disabled={isPending || (actionDialog.type === "issue" && !issueStudentId)}
                className="rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light disabled:opacity-50"
              >
                {isPending ? "Processing..." : actionDialog.type === "revoke" ? "Revoke" : actionDialog.type === "reissue" ? "Reissue" : "Issue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
