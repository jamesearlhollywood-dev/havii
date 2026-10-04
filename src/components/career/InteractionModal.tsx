"use client";

import { useState, useTransition } from "react";
import { logInteractionAction } from "@/actions/networking";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  INTERACTION_TYPES,
  type CareerContact,
  type ContactInteractionInput,
  type InteractionType,
} from "@/lib/career/types";
import type { JobLookup } from "@/components/career/TaskModal";

export function InteractionModal({
  open,
  onClose,
  contact,
  jobs,
}: {
  open: boolean;
  onClose: () => void;
  contact: CareerContact;
  jobs: JobLookup[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [type, setType] = useState<InteractionType>("Email");
  const [date, setDate] = useState(today);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [jobId, setJobId] = useState(contact.related_job_application_id ?? "");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  const jobOptions = [
    { value: "", label: "None" },
    ...jobs.map((j) => ({
      value: j.id,
      label: `${j.title || "Untitled"}${j.company ? ` · ${j.company}` : ""}`,
    })),
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setError("Please pick an interaction date.");
      return;
    }
    if (followUpRequired && !followUpDate) {
      setError("Pick a follow-up date, or turn off follow-up required.");
      return;
    }
    setError("");
    const input: ContactInteractionInput = {
      career_contact_id: contact.id,
      interaction_type: type,
      interaction_date: date,
      subject: subject.trim() || null,
      notes: notes.trim() || null,
      related_job_application_id: jobId || null,
      follow_up_required: followUpRequired,
      follow_up_date: followUpRequired ? followUpDate || null : null,
    };
    startTransition(async () => {
      const res = await logInteractionAction(input);
      if (res.error) setError(res.error);
      else onClose();
    });
  }

  const contactName = `${contact.first_name}${
    contact.last_name ? ` ${contact.last_name}` : ""
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-career-navy/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-career-navy">Log Interaction</h2>
            <p className="text-xs text-career-slate">with {contactName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-career-slate hover:bg-career-surface"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Interaction type"
              options={INTERACTION_TYPES.map((t) => ({ value: t, label: t }))}
              value={type}
              onChange={(e) => setType(e.target.value as InteractionType)}
            />
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Input
            label="Subject"
            placeholder="e.g. Sent networking email / Met at conference"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <Textarea
            label="Notes"
            rows={3}
            placeholder="What was discussed, outcomes, next steps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Select
            label="Related job"
            options={jobOptions}
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          />

          <div className="space-y-3 rounded-lg border border-career-border p-3">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-career-navy">
                Follow-up required
              </span>
              <input
                type="checkbox"
                checked={followUpRequired}
                onChange={(e) => setFollowUpRequired(e.target.checked)}
                className="h-4 w-4 rounded border-career-border text-career-blue focus:ring-career-blue"
              />
            </label>
            <p className="text-xs text-career-slate">
              When on, Career AI creates a Networking follow-up task automatically
              and updates this contact&apos;s next follow-up date.
            </p>
            {followUpRequired && (
              <Input
                label="Follow-up date"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Log Interaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
