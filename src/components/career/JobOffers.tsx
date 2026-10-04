"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOffersForJobAction, updateApplicationStatusFromOfferAction } from "@/actions/offers";
import { Button } from "@/components/ui/Button";
import type { JobOffer } from "@/lib/career/types";

function money(v: number | null): string {
  if (v == null) return "—";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

const STATUS_COLORS: Record<string, string> = {
  Received: "bg-blue-50 text-career-blue",
  Negotiating: "bg-amber-50 text-amber-700",
  Accepted: "bg-emerald-50 text-emerald-700",
  Declined: "bg-slate-100 text-slate-600",
  Expired: "bg-red-50 text-red-600",
};

export function JobOffers({ jobId }: { jobId: string }) {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function load() {
    const res = await getOffersForJobAction(jobId);
    if (!res.error) setOffers(res.offers);
  }

  useEffect(() => {
    load();
  }, [jobId]);

  function handleMarkOffer(o: JobOffer) {
    if (!confirm("Update this job application status to Offer?")) return;
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
    <div className="rounded-xl border border-career-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-career-navy">Offers</h2>
        <Link href="/app/offers" className="text-sm font-medium text-career-blue hover:underline">
          Manage in Offers &amp; Salary
        </Link>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {feedback && <p className="mt-2 text-sm text-emerald-600">{feedback}</p>}

      {offers.length === 0 ? (
        <p className="mt-3 text-sm text-career-slate">
          No offers linked to this application. Add one from the Offers &amp; Salary page and link
          it here to track compensation and deadlines.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {offers.map((o) => (
            <div key={o.id} className="rounded-lg border border-career-border bg-career-bg p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-career-navy">{o.company}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[o.offer_status] ?? STATUS_COLORS.Received}`}>
                      {o.offer_status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-career-slate">
                    {o.role_title || "—"}
                    {o.response_deadline ? ` · deadline ${o.response_deadline}` : ""}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-career-slate">
                    Base <span className="font-medium text-career-navy">{money(o.base_salary)}</span>
                  </span>
                  <span className="text-career-slate">
                    Total <span className="font-medium text-career-navy">{money(o.total_estimated_compensation)}</span>
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleMarkOffer(o)}>
                  Mark application as Offer
                </Button>
                <Link href="/app/offers">
                  <Button size="sm" variant="ghost">Compare / Negotiate</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
