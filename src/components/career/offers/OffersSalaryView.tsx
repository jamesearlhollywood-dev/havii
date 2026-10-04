"use client";

import { useState } from "react";
import type { JobOffer } from "@/lib/career/types";
import { listOffersAction } from "@/actions/offers";
import { OfferModal } from "@/components/career/offers/OfferModal";
import { SalaryResearchPanel } from "@/components/career/offers/SalaryResearchPanel";
import { OfferComparisonPanel } from "@/components/career/offers/OfferComparisonPanel";
import { NegotiationPrepPanel } from "@/components/career/offers/NegotiationPrepPanel";
import { Button } from "@/components/ui/Button";
import type { JobLookup } from "@/components/career/TaskModal";

type Tab = "research" | "comparison" | "negotiation";

const TABS: { id: Tab; label: string }[] = [
  { id: "research", label: "Salary Research" },
  { id: "comparison", label: "Offer Comparison" },
  { id: "negotiation", label: "Negotiation Prep" },
];

export function OffersSalaryView({
  initialOffers,
  jobs,
  userName,
  loadError,
}: {
  initialOffers: JobOffer[];
  jobs: JobLookup[];
  userName: string;
  loadError?: string;
}) {
  const [offers, setOffers] = useState<JobOffer[]>(initialOffers);
  const [tab, setTab] = useState<Tab>("research");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JobOffer | null>(null);

  async function refresh() {
    const res = await listOffersAction();
    if (!res.error) setOffers(res.offers);
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(offer: JobOffer) {
    setEditing(offer);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-career-navy">Offers &amp; Salary</h1>
          <p className="mt-1 text-sm text-career-slate">
            Research market pay, compare offers side-by-side, and prepare to negotiate.
          </p>
        </div>
        <Button onClick={openCreate}>Add Offer</Button>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-career-border bg-white p-1 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-career-blue text-white"
                : "text-career-slate hover:bg-career-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "research" && <SalaryResearchPanel />}
      {tab === "comparison" && (
        <OfferComparisonPanel
          offers={offers}
          jobs={jobs}
          onEdit={openEdit}
          onRefresh={refresh}
          onAdd={openCreate}
        />
      )}
      {tab === "negotiation" && (
        <NegotiationPrepPanel offers={offers} userName={userName} />
      )}

      {modalOpen && (
        <OfferModal
          open={modalOpen}
          onClose={handleModalClose}
          offer={editing}
          jobs={jobs}
        />
      )}
    </div>
  );
}
