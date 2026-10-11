"use client";

import { useState, useMemo } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { exportCertificates } from "@/components/admin/CsvExport";

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
}

interface AuditEntry {
  id: string;
  certificate_id: string;
  action: string;
  performed_by: string;
  note: string | null;
  created_at: string;
}

export function CertificateManager({
  certificates,
  auditLog,
  supabaseConnected,
}: {
  certificates: CertRecord[];
  auditLog: AuditEntry[];
  supabaseConnected: boolean;
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = useMemo(
    () =>
      certificates.filter((c) => {
        if (filterStatus && c.status !== filterStatus) return false;
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
    [certificates, search, filterStatus],
  );

  const issuedCount = certificates.filter((c) => c.status === "issued").length;
  const revokedCount = certificates.filter((c) => c.status === "revoked").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-rise-navy">Certificate Management</h1>

      {!supabaseConnected && (
        <div className="mb-4 rounded-xl border border-rise-warning/30 bg-rise-warning-light p-3 text-sm text-rise-warning">
          Demo mode — Supabase not connected. Certificate actions require a live database.
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                        className="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        type="button"
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
        )}
      </div>
    </div>
  );
}
