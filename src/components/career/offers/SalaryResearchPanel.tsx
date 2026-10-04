"use client";

import { useState, useTransition } from "react";
import { salaryResearchAction } from "@/actions/offers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  COMPANY_SIZES,
  WORK_MODES,
  type CompanySize,
  type SalaryEstimate,
  type SalaryResearchRequest,
  type WorkMode,
} from "@/lib/career/types";

function money(v: number | null): string {
  if (v == null) return "—";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

export function SalaryResearchPanel() {
  const [form, setForm] = useState<SalaryResearchRequest>({
    title: "",
    location: "",
    years_experience: null,
    industry: null,
    company_size: null,
    work_mode: null,
  });
  const [estimate, setEstimate] = useState<SalaryEstimate | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [, startTransition] = useTransition();

  function set<K extends keyof SalaryResearchRequest>(key: K, value: SalaryResearchRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function run() {
    setError(null);
    if (!form.title.trim()) {
      setError("Enter a job title to research salary data.");
      return;
    }
    setLoading(true);
    setSearched(true);
    startTransition(async () => {
      const res = await salaryResearchAction(form);
      setEstimate(res.estimate);
      setConfigured(res.configured);
      setError(res.error ?? null);
      setLoading(false);
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-career-navy">Salary Research</h2>
        <p className="mt-1 text-sm text-career-slate">
          Get estimated market pay for a role. Estimates come from a connected
          compensation data provider — Career AI never fabricates salary data.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Job title *" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Product Manager" />
          <Input label="Location" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Remote, or New York" />
          <Input label="Years of experience" type="number" value={form.years_experience ?? ""} onChange={(e) => set("years_experience", e.target.value ? Number(e.target.value) : null)} placeholder="e.g. 5" />
          <Input label="Industry" value={form.industry ?? ""} onChange={(e) => set("industry", e.target.value || null)} placeholder="e.g. Technology" />
          <Select label="Company size" options={[{ value: "", label: "—" }, ...COMPANY_SIZES.map((c) => ({ value: c, label: c }))]} value={form.company_size ?? ""} onChange={(e) => set("company_size", (e.target.value || null) as CompanySize | null)} />
          <Select label="Work arrangement" options={[{ value: "", label: "—" }, ...WORK_MODES.map((w) => ({ value: w, label: w }))]} value={form.work_mode ?? ""} onChange={(e) => set("work_mode", (e.target.value || null) as WorkMode | null)} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button onClick={run} loading={loading}>
            Research Salary
          </Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </div>

      {/* Result */}
      {searched && !loading && (
        <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
          {configured === false ? (
            <EmptyState />
          ) : estimate ? (
            <EstimateResult estimate={estimate} />
          ) : error ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Could not retrieve salary data from the provider: {error}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-career-surface text-career-slate">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2v20M16 6.5C16 4.5 14 3.5 12 3.5S8 4.5 8 6.5 10 9 12 9.5s4 1 4 3.5-2 3-4 3-4-1-4-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="max-w-md text-sm text-career-slate">
        Salary market data will appear here once a compensation data provider is connected.
      </p>
    </div>
  );
}

function EstimateResult({ estimate }: { estimate: SalaryEstimate }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Verified market data
        </span>
        <span className="text-xs text-career-slate">
          Source: <span className="font-medium text-career-navy">{estimate.source}</span>
          {estimate.data_date && ` · updated ${estimate.data_date}`}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Estimated range" value={`${money(estimate.salary_min)} – ${money(estimate.salary_max)}`} />
        <Metric label="Median salary" value={money(estimate.salary_median)} highlight />
        <Metric label="25th percentile" value={money(estimate.percentile_25)} />
        <Metric label="75th percentile" value={money(estimate.percentile_75)} />
        <Metric label="Location adjustment" value={estimate.location_adjustment != null ? `${estimate.location_adjustment > 0 ? "+" : ""}${estimate.location_adjustment}%` : "—"} />
        <Metric label="Experience adjustment" value={estimate.experience_adjustment != null ? `${estimate.experience_adjustment > 0 ? "+" : ""}${estimate.experience_adjustment}%` : "—"} />
      </div>

      {estimate.source_url && (
        <p className="mt-4 text-xs text-career-slate">
          <a href={estimate.source_url} target="_blank" rel="noopener noreferrer" className="text-career-blue hover:underline">
            View source ↗
          </a>
          {estimate.currency && ` · currency: ${estimate.currency}`}
        </p>
      )}
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-career-blue bg-blue-50" : "border-career-border bg-career-bg"}`}>
      <p className="text-xs text-career-slate">{label}</p>
      <p className={`mt-1 text-lg font-bold ${highlight ? "text-career-blue" : "text-career-navy"}`}>{value}</p>
    </div>
  );
}
