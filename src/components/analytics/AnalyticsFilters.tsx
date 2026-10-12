"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Organization, Cohort, Profile } from "@/lib/types";

export function AnalyticsFilters({
  organizations,
  cohorts,
  instructors,
  showOrgFilter = true,
  showCohortFilter = true,
  showInstructorFilter = false,
  showGradeFilter = false,
  showDateFilter = true,
  basePath,
}: {
  organizations?: Organization[];
  cohorts?: (Cohort & { organization_name: string })[];
  instructors?: Profile[];
  showOrgFilter?: boolean;
  showCohortFilter?: boolean;
  showInstructorFilter?: boolean;
  showGradeFilter?: boolean;
  showDateFilter?: boolean;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [orgId, setOrgId] = useState(searchParams.get("org") ?? "");
  const [cohortId, setCohortId] = useState(searchParams.get("cohort") ?? "");
  const [instructorId, setInstructorId] = useState(searchParams.get("instructor") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [dateFrom, setDateFrom] = useState(searchParams.get("from") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("to") ?? "");
  const [gradeLevel, setGradeLevel] = useState(searchParams.get("grade") ?? "");
  const [gradYear, setGradYear] = useState(searchParams.get("grad_year") ?? "");

  function applyFilters() {
    startTransition(() => {
      const params = new URLSearchParams();
      if (orgId) params.set("org", orgId);
      if (cohortId) params.set("cohort", cohortId);
      if (instructorId) params.set("instructor", instructorId);
      if (status && status !== "all") params.set("status", status);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      if (gradeLevel) params.set("grade", gradeLevel);
      if (gradYear) params.set("grad_year", gradYear);
      router.push(`${basePath}?${params.toString()}`);
    });
  }

  function resetFilters() {
    startTransition(() => {
      router.push(basePath);
    });
  }

  const selectClass =
    "rounded-lg border border-rise-border bg-white px-3 py-2 text-sm text-rise-navy focus:outline-none focus:ring-2 focus:ring-rise-blue";

  return (
    <div className="rounded-2xl border border-rise-border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        {showOrgFilter && organizations && (
          <div>
            <label className="mb-1 block text-xs font-medium text-rise-muted">Organization</label>
            <select
              className={selectClass}
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
            >
              <option value="">All Organizations</option>
              {organizations.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
        )}
        {showCohortFilter && cohorts && (
          <div>
            <label className="mb-1 block text-xs font-medium text-rise-muted">Cohort</label>
            <select
              className={selectClass}
              value={cohortId}
              onChange={(e) => setCohortId(e.target.value)}
            >
              <option value="">All Cohorts</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        {showInstructorFilter && instructors && (
          <div>
            <label className="mb-1 block text-xs font-medium text-rise-muted">Instructor</label>
            <select
              className={selectClass}
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
            >
              <option value="">All Instructors</option>
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.first_name} {i.last_name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-medium text-rise-muted">Enrollment Status</label>
          <select
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
        {showGradeFilter && (
          <>
            <div>
              <label className="mb-1 block text-xs font-medium text-rise-muted">Grade Level</label>
              <select
                className={selectClass}
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="">All Grades</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
                <option value="post-grad">Post-Grad</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-rise-muted">Graduation Year</label>
              <select
                className={selectClass}
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
              >
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </>
        )}
        {showDateFilter && (
          <>
            <div>
              <label className="mb-1 block text-xs font-medium text-rise-muted">Date From</label>
              <input
                type="date"
                className={selectClass}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-rise-muted">Date To</label>
              <input
                type="date"
                className={selectClass}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={applyFilters}
            disabled={isPending}
            className="rounded-lg bg-rise-navy px-4 py-2 text-sm font-semibold text-white hover:bg-rise-navy-light disabled:opacity-50"
          >
            {isPending ? "Applying..." : "Apply Filters"}
          </button>
          <button
            type="button"
            onClick={resetFilters}
            disabled={isPending}
            className="rounded-lg border border-rise-border bg-white px-4 py-2 text-sm font-semibold text-rise-navy hover:bg-rise-sky disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
