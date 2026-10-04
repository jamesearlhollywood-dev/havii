"use client";

import { useState, useTransition } from "react";
import {
  negotiationStrategyAction,
  draftNegotiationDocumentAction,
  saveNegotiationDocumentAction,
} from "@/actions/offers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  NEGOTIATION_DOCUMENT_TYPES,
  type JobOffer,
  type NegotiationDocumentType,
  type NegotiationStrategy,
  type NegotiationStrategyResult,
} from "@/lib/career/types";

function money(v: number | null): string {
  if (v == null) return "—";
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

export function NegotiationPrepPanel({
  offers,
  userName,
}: {
  offers: JobOffer[];
  userName: string;
}) {
  const [offerId, setOfferId] = useState<string>(offers[0]?.id ?? "");
  const [desired, setDesired] = useState<string>("");
  const [minimum, setMinimum] = useState<string>("");
  const [priorityBenefits, setPriorityBenefits] = useState<string>("");
  const [competing, setCompeting] = useState<string>("");
  const [leverage, setLeverage] = useState<string>("");
  const [result, setResult] = useState<NegotiationStrategyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const selectedOffer = offers.find((o) => o.id === offerId) ?? null;

  function num(v: string): number | null {
    if (v.trim() === "") return null;
    const n = Number(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  function run() {
    setError(null);
    if (!offerId) {
      setError("Select an offer first.");
      return;
    }
    setLoading(true);
    setResult(null);
    startTransition(async () => {
      const res = await negotiationStrategyAction({
        job_offer_id: offerId,
        desired_salary: num(desired),
        minimum_acceptable_salary: num(minimum),
        priority_benefits: priorityBenefits
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        competing_offer_info: competing.trim() || null,
        leverage_points: leverage.trim() || null,
      });
      setResult(res);
      setError(res.error ?? null);
      setLoading(false);
    });
  }

  return (
    <div className="space-y-5">
      {offers.length === 0 ? (
        <div className="rounded-xl border border-career-border bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-career-slate">
            Add an offer first to prepare a negotiation strategy.
          </p>
        </div>
      ) : (
        <>
          {/* Inputs */}
          <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-career-navy">Negotiation Prep</h2>
            <p className="mt-1 text-sm text-career-slate">
              Build a structured strategy. The AI distinguishes verified market data, your
              entered information, and its own generated recommendations.
            </p>

            <div className="mt-4 space-y-4">
              <Select
                label="Select an offer"
                options={offers.map((o) => ({ value: o.id, label: `${o.company} — ${o.role_title || "Role"}` }))}
                value={offerId}
                onChange={(e) => setOfferId(e.target.value)}
              />

              {selectedOffer && (
                <div className="rounded-lg border border-career-border bg-career-bg p-4 text-sm">
                  <p className="font-medium text-career-navy">Current offer · {selectedOffer.company}</p>
                  <div className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-3">
                    <span className="text-career-slate">Base: <span className="font-medium text-career-navy">{money(selectedOffer.base_salary)}</span></span>
                    <span className="text-career-slate">Total comp: <span className="font-medium text-career-navy">{money(selectedOffer.total_estimated_compensation)}</span></span>
                    <span className="text-career-slate">Deadline: <span className="font-medium text-career-navy">{selectedOffer.response_deadline ?? "—"}</span></span>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Desired salary" value={desired} onChange={(e) => setDesired(e.target.value)} placeholder="e.g. 165000" />
                <Input label="Minimum acceptable salary" value={minimum} onChange={(e) => setMinimum(e.target.value)} placeholder="e.g. 150000" />
              </div>
              <Input label="Priority benefits (comma-separated)" value={priorityBenefits} onChange={(e) => setPriorityBenefits(e.target.value)} placeholder="e.g. Remote work, more PTO, equity" />
              <Textarea label="Competing offer information" value={competing} onChange={(e) => setCompeting(e.target.value)} placeholder="Details of any competing offers" />
              <Textarea label="Reasoning / leverage points" value={leverage} onChange={(e) => setLeverage(e.target.value)} placeholder="Why you deserve more — experience, unique skills, market data" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button onClick={run} loading={loading}>
                Generate Strategy
              </Button>
              {error && <span className="text-sm text-red-600">{error}</span>}
            </div>
          </div>

          {/* Result */}
          {result && <StrategyResult result={result} />}

          {/* Negotiation documents */}
          {selectedOffer && (
            <NegotiationDocuments offer={selectedOffer} userName={userName} />
          )}
        </>
      )}
    </div>
  );
}

function StrategyResult({ result }: { result: NegotiationStrategyResult }) {
  const s: NegotiationStrategy | null = result.strategy;
  const ds = result.data_sources;

  return (
    <div className="space-y-4 rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold text-career-navy">Negotiation Strategy</h3>
        {result.ai_configured ? (
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-career-blue">AI-generated</span>
        ) : (
          <span className="rounded-full bg-career-surface px-2.5 py-0.5 text-xs font-medium text-career-slate">AI not connected</span>
        )}
      </div>

      {/* Data provenance */}
      <div className="flex flex-wrap gap-2 text-xs">
        <ProvenanceBadge label="Verified market data" active={ds.market_data_verified} />
        <ProvenanceBadge label="User-entered information" active={ds.user_entered.length > 0} />
        <ProvenanceBadge label="AI-generated strategy" active={ds.ai_generated} />
      </div>

      {!s ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          {result.ai_configured
            ? result.error ?? "Could not generate a strategy. Please try again."
            : "Connect an AI provider to generate a structured negotiation strategy. You can still draft negotiation documents below."}
        </div>
      ) : (
        <div className="space-y-4">
          {s.negotiation_position && (
            <Field label="Negotiation position">{s.negotiation_position}</Field>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recommended target">{money(s.recommended_target)}</Field>
            <Field label="Recommended floor">{money(s.recommended_floor)}</Field>
          </div>
          <ListField label="Strongest leverage points" items={s.strongest_leverage_points} />
          <ListField label="Risks" items={s.risks} />
          <ListField label="Recommended sequence" items={s.recommended_sequence} numbered />
          <ListField label="Suggested talking points" items={s.suggested_talking_points} />
          {s.suggested_email && (
            <Field label="Suggested email">
              <pre className="whitespace-pre-wrap rounded-lg bg-career-bg p-3 text-sm text-career-navy">{s.suggested_email}</pre>
            </Field>
          )}
          {s.suggested_phone_script && (
            <Field label="Suggested phone script">
              <pre className="whitespace-pre-wrap rounded-lg bg-career-bg p-3 text-sm text-career-navy">{s.suggested_phone_script}</pre>
            </Field>
          )}
        </div>
      )}
    </div>
  );
}

function ProvenanceBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 font-medium ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
      {active ? "✓" : "—"} {label}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-career-slate">{label}</p>
      <div className="mt-1 text-sm text-career-navy">{children}</div>
    </div>
  );
}

function ListField({ label, items, numbered }: { label: string; items: string[]; numbered?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-career-slate">{label}</p>
      <ol className={`mt-1 space-y-1 text-sm text-career-navy ${numbered ? "list-decimal" : "list-disc"} pl-5`}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Negotiation documents
// ---------------------------------------------------------------------------

function NegotiationDocuments({ offer, userName }: { offer: JobOffer; userName: string }) {
  const [type, setType] = useState<NegotiationDocumentType>("salary_negotiation_email");
  const [doc, setDoc] = useState<{ subject: string; body: string; ai_provider: string | null; model: string | null } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function generate() {
    setError(null);
    setSaved(false);
    setDoc(null);
    setLoading(true);
    startTransition(async () => {
      const res = await draftNegotiationDocumentAction({ type, job_offer_id: offer.id, senderName: userName });
      if (res.error) setError(res.error);
      else setDoc({ subject: res.subject, body: res.body, ai_provider: res.ai_provider, model: res.model });
      setLoading(false);
    });
  }

  function save() {
    if (!doc) return;
    setError(null);
    startTransition(async () => {
      const res = await saveNegotiationDocumentAction({
        type,
        job_offer_id: offer.id,
        subject: doc.subject,
        body: doc.body,
        ai_provider: doc.ai_provider,
        model: doc.model,
      });
      if (res.error) setError(res.error);
      else setSaved(true);
    });
  }

  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-career-navy">Negotiation Documents</h3>
      <p className="mt-1 text-sm text-career-slate">
        Generate a draft email for {offer.company}. Review it, then save it to your documents.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <Select
          label="Document type"
          options={NEGOTIATION_DOCUMENT_TYPES.map((d) => ({ value: d.value, label: d.label }))}
          value={type}
          onChange={(e) => setType(e.target.value as NegotiationDocumentType)}
        />
        <div className="flex items-end">
          <Button onClick={generate} loading={loading}>
            Generate
          </Button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {doc && (
        <div className="mt-4 space-y-3">
          <Input label="Subject" value={doc.subject} onChange={(e) => setDoc({ ...doc, subject: e.target.value })} />
          <Textarea label="Body" value={doc.body} onChange={(e) => setDoc({ ...doc, body: e.target.value })} className="min-h-[180px]" />
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={save}>Save to Documents</Button>
            {saved && <span className="text-sm text-emerald-600">Saved to your documents.</span>}
            {!doc.ai_provider && <span className="text-xs text-career-slate">Draft generated locally — connect an AI provider for tailored drafts.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
