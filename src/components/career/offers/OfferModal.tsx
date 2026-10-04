"use client";

import { useState, useTransition } from "react";
import { createOfferAction, updateOfferAction, deleteOfferAction } from "@/actions/offers";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  BONUS_TYPES,
  OFFER_STATUSES,
  WORK_MODES,
  type BonusType,
  type JobOffer,
  type JobOfferInput,
  type OfferStatus,
  type WorkMode,
} from "@/lib/career/types";
import type { JobLookup } from "@/components/career/TaskModal";

export function OfferModal({
  open,
  onClose,
  offer,
  jobs,
}: {
  open: boolean;
  onClose: () => void;
  offer: JobOffer | null;
  jobs: JobLookup[];
}) {
  const isEdit = !!offer;
  const [form, setForm] = useState<JobOfferInput>({
    job_application_id: offer?.job_application_id ?? null,
    company: offer?.company ?? "",
    role_title: offer?.role_title ?? null,
    base_salary: offer?.base_salary ?? null,
    bonus_amount: offer?.bonus_amount ?? null,
    bonus_type: offer?.bonus_type ?? null,
    equity_value: offer?.equity_value ?? null,
    signing_bonus: offer?.signing_bonus ?? null,
    retirement_match: offer?.retirement_match ?? null,
    health_benefit_value: offer?.health_benefit_value ?? null,
    paid_time_off_days: offer?.paid_time_off_days ?? null,
    remote_stipend: offer?.remote_stipend ?? null,
    relocation_assistance: offer?.relocation_assistance ?? null,
    other_compensation: offer?.other_compensation ?? null,
    total_estimated_compensation: offer?.total_estimated_compensation ?? null,
    location: offer?.location ?? null,
    work_mode: offer?.work_mode ?? null,
    start_date: offer?.start_date ?? null,
    response_deadline: offer?.response_deadline ?? null,
    offer_status: offer?.offer_status ?? "Received",
    notes: offer?.notes ?? null,
  });
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (!open) return null;

  function set<K extends keyof JobOfferInput>(key: K, value: JobOfferInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function numValue(v: string): number | null {
    if (v.trim() === "") return null;
    const n = Number(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  function submit() {
    setError(null);
    if (!form.company.trim()) {
      setError("Company is required.");
      return;
    }
    startTransition(async () => {
      const res = isEdit
        ? await updateOfferAction(offer!.id, form)
        : await createOfferAction(form);
      if (res.error) setError(res.error);
      else onClose();
    });
  }

  function handleDelete() {
    if (!offer) return;
    if (!confirm("Delete this offer?")) return;
    startTransition(async () => {
      await deleteOfferAction(offer.id);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-career-border bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-career-navy">
            {isEdit ? "Edit Offer" : "Add Offer"}
          </h2>
          <button type="button" onClick={onClose} className="text-career-slate hover:text-career-navy">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Company *"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="e.g. Acme Corp"
            />
            <Input
              label="Role title"
              value={form.role_title ?? ""}
              onChange={(e) => set("role_title", e.target.value || null)}
              placeholder="e.g. Senior Product Manager"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Offer status"
              options={OFFER_STATUSES.map((s) => ({ value: s, label: s }))}
              value={form.offer_status}
              onChange={(e) => set("offer_status", e.target.value as OfferStatus)}
            />
            <Select
              label="Linked job application"
              options={[{ value: "", label: "None" }, ...jobs.map((j) => ({ value: j.id, label: `${j.company || "Job"} — ${j.title || "Role"}` }))]}
              value={form.job_application_id ?? ""}
              onChange={(e) => set("job_application_id", e.target.value || null)}
            />
          </div>

          <div className="rounded-xl border border-career-border bg-career-bg p-4">
            <p className="mb-3 text-sm font-semibold text-career-navy">Compensation</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Base salary" type="number" value={form.base_salary ?? ""} onChange={(e) => set("base_salary", numValue(e.target.value))} placeholder="0" />
              <Input label="Bonus amount" type="number" value={form.bonus_amount ?? ""} onChange={(e) => set("bonus_amount", numValue(e.target.value))} placeholder="0" />
              <Select label="Bonus type" options={[{ value: "", label: "—" }, ...BONUS_TYPES.map((b) => ({ value: b, label: b }))]} value={form.bonus_type ?? ""} onChange={(e) => set("bonus_type", (e.target.value || null) as BonusType | null)} />
              <Input label="Equity value" type="number" value={form.equity_value ?? ""} onChange={(e) => set("equity_value", numValue(e.target.value))} placeholder="0" />
              <Input label="Signing bonus" type="number" value={form.signing_bonus ?? ""} onChange={(e) => set("signing_bonus", numValue(e.target.value))} placeholder="0" />
              <Input label="Retirement match" type="number" value={form.retirement_match ?? ""} onChange={(e) => set("retirement_match", numValue(e.target.value))} placeholder="0" />
              <Input label="Health benefit value" type="number" value={form.health_benefit_value ?? ""} onChange={(e) => set("health_benefit_value", numValue(e.target.value))} placeholder="0" />
              <Input label="Remote stipend" type="number" value={form.remote_stipend ?? ""} onChange={(e) => set("remote_stipend", numValue(e.target.value))} placeholder="0" />
              <Input label="Relocation assistance" type="number" value={form.relocation_assistance ?? ""} onChange={(e) => set("relocation_assistance", numValue(e.target.value))} placeholder="0" />
              <Input label="Total estimated comp" type="number" value={form.total_estimated_compensation ?? ""} onChange={(e) => set("total_estimated_compensation", numValue(e.target.value))} placeholder="0" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="PTO days" type="number" value={form.paid_time_off_days ?? ""} onChange={(e) => set("paid_time_off_days", numValue(e.target.value))} placeholder="0" />
            <Input label="Location" value={form.location ?? ""} onChange={(e) => set("location", e.target.value || null)} placeholder="e.g. San Francisco, CA" />
            <Select label="Work mode" options={[{ value: "", label: "—" }, ...WORK_MODES.map((w) => ({ value: w, label: w }))]} value={form.work_mode ?? ""} onChange={(e) => set("work_mode", (e.target.value || null) as WorkMode | null)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Start date" type="date" value={form.start_date ?? ""} onChange={(e) => set("start_date", e.target.value || null)} />
            <Input label="Response deadline" type="date" value={form.response_deadline ?? ""} onChange={(e) => set("response_deadline", e.target.value || null)} />
          </div>

          <Input label="Other compensation" value={form.other_compensation ?? ""} onChange={(e) => set("other_compensation", e.target.value || null)} placeholder="e.g. tuition reimbursement" />
          <Textarea label="Notes" value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value || null)} placeholder="Any details about the offer" />
        </div>

        <div className="mt-6 flex items-center justify-between">
          {isEdit ? (
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={submit}>{isEdit ? "Save Changes" : "Add Offer"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
