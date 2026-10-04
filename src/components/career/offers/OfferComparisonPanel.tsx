"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteOfferAction,
  createOfferDeadlineTaskAction,
  updateApplicationStatusFromOfferAction,
} from "@/actions/offers";
import { Button } from "@/components/ui/Button";
import type { JobOffer } from "@/lib/career/types";
import type { JobLookup } from "@/components/career/TaskModal";

function money(v: number | null): string {
  if (v == null) return "—";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

/** Subjective dimensions the user rates (1–5). Importance weight (1–5) per dimension. */
const SUBJECTIVE_DIMENSIONS = [
  "Flexibility",
  "Commute/location",
  "Role level",
  "Career growth",
  "Mission alignment",
  "Stability",
  "Work-life balance",
] as const;

type Dimension = (typeof SUBJECTIVE_DIMENSIONS)[number];

/** Auto-filled financial dimensions derived from offer data. */
const FINANCIAL_ROWS: { label: string; get: (o: JobOffer) => string }[] = [
  { label: "Base salary", get: (o) => money(o.base_salary) },
  { label: "Bonus", get: (o) => (o.bonus_amount != null ? `${money(o.bonus_amount)}${o.bonus_type ? ` (${o.bonus_type})` : ""}` : "—") },
  { label: "Equity", get: (o) => money(o.equity_value) },
  { label: "Signing bonus", get: (o) => money(o.signing_bonus) },
  { label: "Retirement match", get: (o) => money(o.retirement_match) },
  { label: "Benefits value", get: (o) => money(o.health_benefit_value) },
  { label: "PTO", get: (o) => (o.paid_time_off_days != null ? `${o.paid_time_off_days} days` : "—") },
  { label: "Remote stipend", get: (o) => money(o.remote_stipend) },
  { label: "Relocation support", get: (o) => money(o.relocation_assistance) },
  { label: "Estimated total comp", get: (o) => money(o.total_estimated_compensation) },
  { label: "Start date", get: (o) => o.start_date ?? "—" },
  { label: "Response deadline", get: (o) => o.response_deadline ?? "—" },
];

export function OfferComparisonPanel({
  offers,
  jobs,
  onEdit,
  onRefresh,
  onAdd,
}: {
  offers: JobOffer[];
  jobs: JobLookup[];
  onEdit: (o: JobOffer) => void;
  onRefresh: () => void;
  onAdd: () => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // ratings[offerId][dimension] = 1..5 ; weights[dimension] = 1..5
  const [ratings, setRatings] = useState<Record<string, Record<Dimension, number>>>({});
  const [weights, setWeights] = useState<Record<Dimension, number>>({
    Flexibility: 3,
    "Commute/location": 3,
    "Role level": 3,
    "Career growth": 3,
    "Mission alignment": 3,
    Stability: 3,
    "Work-life balance": 3,
  });

  function toggle(id: string) {
    setError(null);
    setFeedback(null);
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        setError("You can compare up to three offers at a time.");
        return prev;
      }
      return [...prev, id];
    });
  }

  const compared = offers.filter((o) => selected.includes(o.id));

  function setRating(offerId: string, dim: Dimension, value: number) {
    setRatings((r) => ({
      ...r,
      [offerId]: { ...(r[offerId] ?? emptyRatings()), [dim]: value },
    }));
  }

  function emptyRatings(): Record<Dimension, number> {
    return {
      Flexibility: 0,
      "Commute/location": 0,
      "Role level": 0,
      "Career growth": 0,
      "Mission alignment": 0,
      Stability: 0,
      "Work-life balance": 0,
    };
  }

  // Weighted score only when the user has entered ratings for that offer.
  function weightedScore(offerId: string): number | null {
    const r = ratings[offerId];
    if (!r) return null;
    let hasAny = false;
    let sum = 0;
    let weightSum = 0;
    for (const dim of SUBJECTIVE_DIMENSIONS) {
      const rating = r[dim];
      if (rating > 0) {
        hasAny = true;
        sum += rating * weights[dim];
        weightSum += weights[dim];
      }
    }
    if (!hasAny || weightSum === 0) return null;
    return Math.round((sum / weightSum) * 10) / 10;
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this offer?")) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteOfferAction(id);
      if (res.error) setError(res.error);
      else {
        setSelected((s) => s.filter((x) => x !== id));
        await onRefresh();
      }
    });
  }

  function handleDeadlineTask(o: JobOffer) {
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      const res = await createOfferDeadlineTaskAction(o.id);
      if (res.error) setError(res.error);
      else {
        setFeedback(res.success ?? "Reminder task created.");
        router.refresh();
      }
    });
  }

  function handleMarkApplicationOffer(o: JobOffer) {
    if (!o.job_application_id) {
      setError("This offer is not linked to a job application.");
      return;
    }
    if (!confirm("Update the linked job application status to Offer?")) return;
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      const res = await updateApplicationStatusFromOfferAction({ job_offer_id: o.id, status: "Offer" });
      if (res.error) setError(res.error);
      else {
        setFeedback("Application status updated to Offer.");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      {offers.length === 0 ? (
        <div className="rounded-xl border border-career-border bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-career-slate">
            No offers yet. Add an offer to start comparing compensation packages.
          </p>
          <Button className="mt-4" onClick={onAdd}>
            Add Offer
          </Button>
        </div>
      ) : (
        <>
          {/* Offer selection list */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-career-slate">
              Select up to three offers to compare side-by-side.
            </p>
            {offers.map((o) => (
              <OfferSelectRow
                key={o.id}
                offer={o}
                selected={selected.includes(o.id)}
                onToggle={() => toggle(o.id)}
                onEdit={() => onEdit(o)}
                onDelete={() => handleDelete(o.id)}
                onDeadlineTask={() => handleDeadlineTask(o)}
                onMarkApplicationOffer={() => handleMarkApplicationOffer(o)}
              />
            ))}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {feedback && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {feedback}
            </div>
          )}

          {/* Comparison table */}
          {compared.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-career-border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-career-border bg-career-bg">
                    <th className="px-4 py-3 text-left font-semibold text-career-navy">Dimension</th>
                    {compared.map((o) => (
                      <th key={o.id} className="px-4 py-3 text-left font-semibold text-career-navy">
                        {o.company}
                        <span className="block text-xs font-normal text-career-slate">
                          {o.role_title || "—"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FINANCIAL_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-career-border">
                      <td className="px-4 py-2.5 text-career-slate">{row.label}</td>
                      {compared.map((o) => (
                        <td key={o.id} className="px-4 py-2.5 font-medium text-career-navy">
                          {row.get(o)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Subjective dimensions with weights + ratings */}
                  <tr className="border-b border-career-border bg-career-bg">
                    <td className="px-4 py-2 text-xs font-semibold uppercase text-career-slate">
                      Your ratings (1–5)
                    </td>
                    {compared.map((o) => (
                      <td key={o.id} />
                    ))}
                  </tr>
                  {SUBJECTIVE_DIMENSIONS.map((dim) => (
                    <tr key={dim} className="border-b border-career-border">
                      <td className="px-4 py-2.5">
                        <span className="text-career-navy">{dim}</span>
                        <span className="mt-1 block text-xs text-career-slate">
                          weight&nbsp;
                          <select
                            value={weights[dim]}
                            onChange={(e) => setWeights((w) => ({ ...w, [dim]: Number(e.target.value) }))}
                            className="rounded border border-career-border bg-white px-1 py-0.5 text-xs"
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </span>
                      </td>
                      {compared.map((o) => (
                        <td key={o.id} className="px-4 py-2.5">
                          <select
                            value={ratings[o.id]?.[dim] ?? 0}
                            onChange={(e) => setRating(o.id, dim, Number(e.target.value))}
                            className="rounded-lg border border-career-border bg-white px-2 py-1 text-sm"
                          >
                            <option value={0}>—</option>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Weighted score row */}
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 font-semibold text-career-navy">
                      Weighted score
                      <span className="block text-xs font-normal text-career-slate">
                        from your ratings &amp; weights
                      </span>
                    </td>
                    {compared.map((o) => {
                      const score = weightedScore(o.id);
                      return (
                        <td key={o.id} className="px-4 py-3">
                          <span className={`text-lg font-bold ${score != null ? "text-career-blue" : "text-career-slate-light"}`}>
                            {score != null ? score.toFixed(1) : "—"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
              <p className="border-t border-career-border px-4 py-3 text-xs text-career-slate">
                Weighted scores are calculated only from the ratings you enter. Financial figures are
                pulled from your offer records; subjective dimensions are not scored automatically.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OfferSelectRow({
  offer,
  selected,
  onToggle,
  onEdit,
  onDelete,
  onDeadlineTask,
  onMarkApplicationOffer,
}: {
  offer: JobOffer;
  selected: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDeadlineTask: () => void;
  onMarkApplicationOffer: () => void;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm transition ${
        selected ? "border-career-blue ring-1 ring-career-blue" : "border-career-border"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="mt-1 h-4 w-4 rounded border-career-border text-career-blue focus:ring-career-blue"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-career-navy">{offer.company}</h3>
              <StatusBadge status={offer.offer_status} />
            </div>
            <p className="mt-0.5 text-sm text-career-slate">
              {offer.role_title || "—"}
              {offer.location ? ` · ${offer.location}` : ""}
              {offer.work_mode ? ` · ${offer.work_mode}` : ""}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-career-slate">
              <span>Base: <span className="font-medium text-career-navy">{money(offer.base_salary)}</span></span>
              <span>Total: <span className="font-medium text-career-navy">{money(offer.total_estimated_compensation)}</span></span>
              {offer.response_deadline && (
                <span>Deadline: <span className="font-medium text-amber-700">{offer.response_deadline}</span></span>
              )}
            </div>
          </div>
        </label>
        <div className="flex shrink-0 flex-wrap gap-2">
          {offer.response_deadline && (
            <Button size="sm" variant="outline" onClick={onDeadlineTask}>
              Add deadline task
            </Button>
          )}
          {offer.job_application_id && (
            <Button size="sm" variant="outline" onClick={onMarkApplicationOffer}>
              Mark app as Offer
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Received: "bg-blue-50 text-career-blue",
    Negotiating: "bg-amber-50 text-amber-700",
    Accepted: "bg-emerald-50 text-emerald-700",
    Declined: "bg-slate-100 text-slate-600",
    Expired: "bg-red-50 text-red-600",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? colors.Received}`}>
      {status}
    </span>
  );
}
