"use client";

// Lightweight chart primitives — no external chart dependency.
// All charts render from real data; empty arrays produce graceful empty states.

import type { ActivityBucket } from "@/lib/career/types";

const SERIES_COLORS: Record<string, string> = {
  saved: "#94a3b8",
  applied: "#2563eb",
  interviews: "#f59e0b",
  offers: "#10b981",
};

const SERIES_LABELS: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  interviews: "Interviews",
  offers: "Offers",
};

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------

export function KpiCard({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "slate" | "blue" | "amber" | "emerald" | "red";
}) {
  const tones: Record<string, string> = {
    slate: "text-career-navy",
    blue: "text-career-blue",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    red: "text-red-600",
  };
  return (
    <div className="rounded-xl border border-career-border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-career-slate">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold ${tones[tone]}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-career-slate">{hint}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

export function ProgressBar({ pct, label }: { pct: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-career-slate">
          <span>{label}</span>
          <span className="font-medium text-career-navy">{pct}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-career-surface">
        <div
          className="h-full rounded-full bg-career-blue transition-all"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Funnel
// ---------------------------------------------------------------------------

export function FunnelChart({ stages }: { stages: { stage: string; count: number; conversion_from_prior: number | null }[] }) {
  const max = Math.max(1, ...stages.map((s) => s.count));
  return (
    <div className="space-y-3">
      {stages.map((s, i) => {
        const width = (s.count / max) * 100;
        return (
          <div key={s.stage}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-career-navy">{s.stage}</span>
              <span className="text-career-slate">
                {s.count}
                {i > 0 && s.conversion_from_prior != null && (
                  <span className="ml-2 text-xs text-career-slate-light">
                    ({s.conversion_from_prior}% from prior)
                  </span>
                )}
              </span>
            </div>
            <div className="h-7 w-full overflow-hidden rounded-lg bg-career-surface">
              <div
                className="flex h-full items-center justify-end rounded-lg bg-career-blue px-2 text-xs font-medium text-white transition-all"
                style={{ width: `${Math.max(8, width)}%` }}
              >
                {s.count > 0 && s.count}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grouped bar chart (activity over time)
// ---------------------------------------------------------------------------

export function GroupedBarChart({ buckets }: { buckets: ActivityBucket[] }) {
  if (buckets.length === 0) {
    return <EmptyChart label="No activity in this range yet." />;
  }
  const series = ["saved", "applied", "interviews", "offers"] as const;
  const max = Math.max(1, ...buckets.flatMap((b) => [b.saved, b.applied, b.interviews, b.offers]));
  const barW = 7;
  const gap = 2;
  const groupW = series.length * (barW + gap) + 8;
  const chartW = buckets.length * groupW + 20;

  return (
    <div className="overflow-x-auto">
      <svg width={Math.max(chartW, 280)} height={180} role="img" aria-label="Application activity over time">
        {/* y-axis grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={28} x2={Math.max(chartW, 280) - 4} y1={150 - f * 130} y2={150 - f * 130} stroke="#e2e8f0" strokeWidth={1} />
        ))}
        {buckets.map((b, i) => {
          const x0 = 32 + i * groupW;
          return (
            <g key={i}>
              {series.map((s, si) => {
                const val = b[s];
                const h = (val / max) * 130;
                const x = x0 + si * (barW + gap);
                const y = 150 - h;
                return <rect key={s} x={x} y={y} width={barW} height={Math.max(0, h)} rx={1.5} fill={SERIES_COLORS[s]} />;
              })}
              <text x={x0 + groupW / 2 - 4} y={168} fontSize={8} fill="#64748b" textAnchor="middle">
                {b.label.length > 8 ? b.label.slice(0, 7) + "…" : b.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3">
        {series.map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-xs text-career-slate">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SERIES_COLORS[s] }} />
            {SERIES_LABELS[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Simple horizontal bar list (for roles, sources, locations)
// ---------------------------------------------------------------------------

export function BarList({ items }: { items: { label: string; value: number; sub?: string }[] }) {
  if (items.length === 0) {
    return <EmptyChart label="No data available." />;
  }
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="space-y-2.5">
      {items.map((i) => (
        <div key={i.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="truncate text-career-navy">{i.label}</span>
            <span className="shrink-0 text-career-slate">
              {i.value}
              {i.sub && <span className="ml-1 text-xs text-career-slate-light">{i.sub}</span>}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-career-surface">
            <div className="h-full rounded-full bg-career-blue" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

export function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-career-border text-sm text-career-slate">
      {label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section card
// ---------------------------------------------------------------------------

export function SectionCard({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-career-navy">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-career-slate">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
