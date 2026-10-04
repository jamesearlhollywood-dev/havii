"use client";

import { useState, useTransition } from "react";
import {
  getAnalyticsAction,
  getAnalyticsInsightsAction,
  listGoalsAction,
} from "@/actions/analytics";
import {
  ANALYSIS_RANGES,
  type AnalyticsInsightsResult,
  type AnalyticsMetrics,
  type AnalyticsRange,
  type CareerGoalWithProgress,
} from "@/lib/career/types";
import {
  BarList,
  EmptyChart,
  FunnelChart,
  GroupedBarChart,
  KpiCard,
  ProgressBar,
  SectionCard,
} from "@/components/career/analytics/charts";
import { GoalsPanel } from "@/components/career/analytics/GoalsPanel";
import { Button } from "@/components/ui/Button";

function money(v: number | null): string {
  if (v == null) return "—";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}
function pctOr(v: number | null, fallback = "—"): string {
  return v == null ? fallback : `${v}%`;
}

export function AnalyticsView({
  initialMetrics,
  initialGoals,
  loadError,
}: {
  initialMetrics: AnalyticsMetrics | null;
  initialGoals: CareerGoalWithProgress[];
  loadError?: string;
}) {
  const [range, setRange] = useState<AnalyticsRange>("all");
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(initialMetrics);
  const [goals, setGoals] = useState<CareerGoalWithProgress[]>(initialGoals);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AnalyticsInsightsResult | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [, startTransition] = useTransition();

  function changeRange(r: AnalyticsRange) {
    setRange(r);
    setLoading(true);
    startTransition(async () => {
      const res = await getAnalyticsAction(r);
      if (res.metrics) setMetrics(res.metrics);
      const g = await listGoalsAction();
      if (!g.error) setGoals(g.goals);
      setLoading(false);
    });
  }

  function runInsights() {
    if (!metrics) return;
    setInsightsLoading(true);
    startTransition(async () => {
      const res = await getAnalyticsInsightsAction(metrics);
      setInsights(res);
      setInsightsLoading(false);
    });
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  const m = metrics;
  const hasData = m && m.overview.total_tracked > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-career-navy">Analytics</h1>
          <p className="mt-1 text-sm text-career-slate">
            Performance insights derived from your actual Career AI records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => changeRange(e.target.value as AnalyticsRange)}
            className="rounded-xl border border-career-border bg-white px-3 py-2 text-sm shadow-sm"
          >
            {ANALYSIS_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={() => alert("Export (PDF/CSV) is coming soon. The analytics architecture is ready for an export provider.")}>
            Export Report
          </Button>
        </div>
      </div>

      {loading && <p className="text-sm text-career-slate">Updating…</p>}

      {!hasData ? (
        <div className="rounded-xl border border-dashed border-career-border bg-white p-12 text-center">
          <p className="text-sm text-career-slate">
            No analytics yet. Start tracking jobs, applications, and tasks to see your
            job-search performance here. All metrics are computed from your real records —
            none are fabricated.
          </p>
        </div>
      ) : (
        m && (
          <>
            {/* Overview KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Total Jobs Tracked" value={m.overview.total_tracked} tone="slate" />
              <KpiCard label="Applications Submitted" value={m.overview.applications_submitted} tone="blue" />
              <KpiCard label="Interviews Received" value={m.overview.interviews_received} tone="amber" />
              <KpiCard label="Offers Received" value={m.overview.offers_received} tone="emerald" />
              <KpiCard label="Rejections" value={m.overview.rejections} tone="red" />
              <KpiCard label="Withdrawn" value={m.overview.withdrawn} tone="slate" />
              <KpiCard label="Active Opportunities" value={m.overview.active_opportunities} tone="blue" />
              <KpiCard label="Avg Match Score" value={m.overview.avg_match_score != null ? m.overview.avg_match_score.toFixed(0) : "—"} tone="slate" />
            </div>

            {/* Funnel */}
            <SectionCard title="Application Funnel" subtitle="Conversion between stages (Saved → Applied → Interview → Offer).">
              <FunnelChart stages={m.funnel} />
            </SectionCard>

            {/* Activity over time */}
            <SectionCard title="Application Activity Over Time" subtitle={`By ${m.activity.granularity} · ${ANALYSIS_RANGES.find((r) => r.value === range)?.label}`}>
              <GroupedBarChart buckets={m.activity.buckets} />
            </SectionCard>

            {/* Velocity */}
            <SectionCard title="Job-Search Velocity" subtitle="Pace and timing of your application pipeline.">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Metric label="Applications / week" value={m.velocity.applications_per_week ?? "—"} />
                <Metric label="Interviews / month" value={m.velocity.interviews_per_month ?? "—"} />
                <Metric label="Avg Saved→Applied (days)" value={m.velocity.avg_saved_to_applied_days ?? "—"} />
                <Metric label="Avg Applied→Interview (days)" value={m.velocity.avg_applied_to_interview_days ?? "—"} />
                <Metric label="Avg Interview→Offer (days)" value={m.velocity.avg_interview_to_offer_days ?? "—"} />
              </div>
              {!m.velocity.avg_saved_to_applied_days && !m.velocity.avg_applied_to_interview_days && (
                <p className="mt-3 text-xs text-career-slate">Timing metrics appear once enough dated stage transitions exist.</p>
              )}
            </SectionCard>

            {/* Sources */}
            <SectionCard title="Source Performance" subtitle="Where your opportunities are coming from.">
              <BarList items={m.sources.map((s) => ({ label: s.source, value: s.found, sub: `${s.applied} applied · ${s.interviews} interviews` }))} />
            </SectionCard>

            {/* Match score */}
            <SectionCard title="Outcome Patterns by Match Score" subtitle="Observational only — higher match scores may correlate with better outcomes. Does not imply causation.">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric label="Avg match score" value={m.matchScore.avg?.toFixed(1) ?? "—"} />
                  <Metric label="Highest" value={m.matchScore.highest?.toFixed(0) ?? "—"} />
                  <Metric label="Avg (applied)" value={m.matchScore.avg_applied?.toFixed(1) ?? "—"} />
                  <Metric label="Avg (interviews)" value={m.matchScore.avg_interview?.toFixed(1) ?? "—"} />
                  <Metric label="Avg (offers)" value={m.matchScore.avg_offer?.toFixed(1) ?? "—"} />
                </div>
                <BarList items={m.matchScore.outcome_buckets.map((b) => ({ label: `Score ${b.label}`, value: b.applied, sub: `${b.interviews} int · ${b.offers} off` }))} />
              </div>
            </SectionCard>

            {/* Roles */}
            <SectionCard title="Role Analysis" subtitle="Which role families are producing outcomes.">
              <BarList items={m.roles.map((r) => ({ label: r.role, value: r.opportunities, sub: `${r.applied} applied · ${r.interviews} int · ${r.offers} off` }))} />
            </SectionCard>

            {/* Location & work mode */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Location Analysis">
                <BarList items={m.locations.map((l) => ({ label: l.location, value: l.jobs, sub: `${pctOr(l.interview_rate)} int rate` }))} />
              </SectionCard>
              <SectionCard title="Work Mode Analysis">
                <BarList items={m.workModes.map((w) => ({ label: w.work_mode, value: w.jobs, sub: `${pctOr(w.offer_rate)} offer rate` }))} />
              </SectionCard>
            </div>

            {/* Salary */}
            <SectionCard title="Salary Analytics" subtitle={`From ${m.salary.count_with_salary} record${m.salary.count_with_salary === 1 ? "" : "s"} with numeric salary data.`}>
              {m.salary.count_with_salary === 0 ? (
                <EmptyChart label="No records with numeric salary data yet." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <Metric label="Avg min salary" value={money(m.salary.avg_min)} />
                  <Metric label="Avg max salary" value={money(m.salary.avg_max)} />
                  <Metric label="Highest tracked" value={money(m.salary.highest)} />
                  <Metric label="Avg (interview stage)" value={money(m.salary.avg_interview_stage)} />
                  <Metric label="Avg (offer stage)" value={money(m.salary.avg_offer_stage)} />
                </div>
              )}
            </SectionCard>

            {/* Response rate */}
            <SectionCard title="Application Response Rate">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Metric label="Applications" value={m.responseRate.applications} />
                <Metric label="With response" value={m.responseRate.with_response} />
                <Metric label="No response" value={m.responseRate.no_response} />
                <Metric label="Interview rate" value={pctOr(m.responseRate.interview_rate)} />
                <Metric label="Offer rate" value={pctOr(m.responseRate.offer_rate)} />
              </div>
            </SectionCard>

            {/* Follow-up performance */}
            <SectionCard title="Follow-Up Performance" subtitle="Observational data — completed follow-ups vs outcomes.">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Follow-ups created" value={m.followUps.created} />
                <Metric label="Completed" value={m.followUps.completed} />
                <Metric label="Overdue" value={m.followUps.overdue} tone="red" />
                <Metric label="Avg completion (days)" value={m.followUps.avg_completion_days ?? "—"} />
              </div>
              {m.followUps.completion_rate_applications_with != null && (
                <p className="mt-3 text-xs text-career-slate">
                  Response rate with completed follow-ups: {pctOr(m.followUps.completion_rate_applications_with)} ·
                  without: {pctOr(m.followUps.completion_rate_applications_without)} (observational, not causal).
                </p>
              )}
            </SectionCard>

            {/* Networking */}
            <SectionCard title="Networking Analytics">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Active contacts" value={m.networking.active_contacts} />
                <Metric label="Recruiters" value={m.networking.recruiters} />
                <Metric label="Hiring managers" value={m.networking.hiring_managers} />
                <Metric label="Referrals" value={m.networking.referrals} />
                <Metric label="Interactions logged" value={m.networking.interactions} />
                <Metric label="Follow-ups completed" value={m.networking.follow_ups_completed} />
                <Metric label="Applications with contact" value={m.networking.applications_with_contact} />
              </div>
            </SectionCard>

            {/* Documents & interviews */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Document Activity">
                {m.documents.length === 0 ? (
                  <EmptyChart label="No generated documents yet." />
                ) : (
                  <BarList items={m.documents.map((d) => ({ label: d.label, value: d.count }))} />
                )}
              </SectionCard>
              <SectionCard title="Interview Analytics">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Metric label="Prepared for" value={m.interviews.prepared_for} />
                  <Metric label="Sessions completed" value={m.interviews.sessions_completed} />
                  <Metric label="Avg score" value={m.interviews.avg_score?.toFixed(0) ?? "—"} />
                </div>
                {m.interviews.by_type.length > 0 && (
                  <div className="mt-4">
                    <BarList items={m.interviews.by_type.map((t) => ({ label: t.type, value: t.count }))} />
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Offer analytics */}
            <SectionCard title="Offer Analytics" subtitle="From your tracked JobOffer records.">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <Metric label="Offers received" value={m.offers.received} />
                <Metric label="Accepted" value={m.offers.accepted} tone="emerald" />
                <Metric label="Declined" value={m.offers.declined} />
                <Metric label="Negotiating" value={m.offers.negotiating} tone="amber" />
                <Metric label="Avg base salary" value={money(m.offers.avg_base_salary)} />
                <Metric label="Avg total comp" value={money(m.offers.avg_total_comp)} />
              </div>
            </SectionCard>

            {/* Insights */}
            <SectionCard
              title="Insights"
              subtitle="Deterministic observations from your metrics. Optionally generate AI interpretation."
              right={
                <Button size="sm" variant="outline" onClick={runInsights} loading={insightsLoading}>
                  Generate AI Insights
                </Button>
              }
            >
              {m.insights.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-career-navy">
                  {m.insights.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-career-slate">Not enough data for deterministic insights yet.</p>
              )}

              {insights && insights.ai_configured && (
                <div className="mt-4 space-y-3 rounded-lg border border-career-border bg-career-bg p-4">
                  <p className="text-xs font-semibold uppercase text-career-slate">AI-generated interpretation</p>
                  {insights.patterns.length > 0 && <InsightGroup title="Patterns" items={insights.patterns} />}
                  {insights.improvements.length > 0 && <InsightGroup title="Potential improvements" items={insights.improvements} />}
                  {insights.questions.length > 0 && <InsightGroup title="Questions to consider" items={insights.questions} />}
                  {insights.suggested_actions.length > 0 && <InsightGroup title="Suggested next actions" items={insights.suggested_actions} />}
                </div>
              )}
              {insights && !insights.ai_configured && (
                <p className="mt-3 text-xs text-career-slate">Connect an AI provider to generate AI-based interpretation of your analytics.</p>
              )}
            </SectionCard>

            {/* Goals */}
            <GoalsPanel goals={goals} />
          </>
        )
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: "red" | "emerald" | "amber" }) {
  const tones: Record<string, string> = {
    red: "text-red-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
  };
  return (
    <div className="rounded-lg border border-career-border bg-career-bg p-3">
      <p className="text-xs text-career-slate">{label}</p>
      <p className={`mt-1 text-lg font-bold ${tone ? tones[tone] : "text-career-navy"}`}>{value}</p>
    </div>
  );
}

function InsightGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium text-career-navy">{title}</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-career-slate">
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
