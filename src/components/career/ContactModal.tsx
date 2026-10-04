"use client";

import { useState, useTransition } from "react";
import { createContactAction, updateContactAction } from "@/actions/networking";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  RELATIONSHIP_TYPES,
  RELATIONSHIP_STRENGTHS,
  type CareerContact,
  type CareerContactInput,
  type RelationshipType,
  type RelationshipStrength,
} from "@/lib/career/types";
import type { JobLookup } from "@/components/career/TaskModal";

export function ContactModal({
  open,
  onClose,
  contact,
  jobs,
}: {
  open: boolean;
  onClose: () => void;
  contact: CareerContact | null;
  jobs: JobLookup[];
}) {
  const isEdit = !!contact;
  const [firstName, setFirstName] = useState(contact?.first_name ?? "");
  const [lastName, setLastName] = useState(contact?.last_name ?? "");
  const [organization, setOrganization] = useState(contact?.organization ?? "");
  const [jobTitle, setJobTitle] = useState(contact?.job_title ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [phone, setPhone] = useState(contact?.phone ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(contact?.linkedin_url ?? "");
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(
    contact?.relationship_type ?? "Professional Contact"
  );
  const [strength, setStrength] = useState<RelationshipStrength>(
    contact?.relationship_strength ?? "New"
  );
  const [location, setLocation] = useState(contact?.location ?? "");
  const [notes, setNotes] = useState(contact?.notes ?? "");
  const [source, setSource] = useState(contact?.source ?? "");
  const [lastContactDate, setLastContactDate] = useState(contact?.last_contact_date ?? "");
  const [nextFollowUp, setNextFollowUp] = useState(contact?.next_follow_up_date ?? "");
  const [jobId, setJobId] = useState(contact?.related_job_application_id ?? "");
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
    if (!firstName.trim()) {
      setError("Please enter the contact's first name.");
      return;
    }
    setError("");
    const input: CareerContactInput = {
      first_name: firstName.trim(),
      last_name: lastName.trim() || null,
      organization: organization.trim() || null,
      job_title: jobTitle.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      relationship_type: relationshipType,
      relationship_strength: strength,
      location: location.trim() || null,
      notes: notes.trim() || null,
      source: source.trim() || null,
      last_contact_date: lastContactDate || null,
      next_follow_up_date: nextFollowUp || null,
      related_job_application_id: jobId || null,
    };
    startTransition(async () => {
      const res = isEdit
        ? await updateContactAction(contact!.id, input)
        : await createContactAction(input);
      if (res.error) setError(res.error);
      else onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-career-navy/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
          <h2 className="text-lg font-semibold text-career-navy">
            {isEdit ? "Edit Contact" : "Add Contact"}
          </h2>
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
            <Input
              label="First name"
              placeholder="e.g. Jordan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
            />
            <Input
              label="Last name"
              placeholder="e.g. Rivera"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              label="Organization"
              placeholder="e.g. Acme Corp"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
            <Input
              label="Job title"
              placeholder="e.g. Senior Recruiter"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Phone"
              placeholder="e.g. +1 555 0100"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/..."
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
            <Input
              label="Location"
              placeholder="e.g. New York, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Relationship type"
              options={RELATIONSHIP_TYPES.map((t) => ({ value: t, label: t }))}
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
            />
            <Select
              label="Relationship strength"
              options={RELATIONSHIP_STRENGTHS.map((s) => ({ value: s, label: s }))}
              value={strength}
              onChange={(e) => setStrength(e.target.value as RelationshipStrength)}
            />
            <Select
              label="Related job"
              options={jobOptions}
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            />
            <Input
              label="Source"
              placeholder="e.g. LinkedIn, Referral"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
            <Input
              label="Last contact date"
              type="date"
              value={lastContactDate}
              onChange={(e) => setLastContactDate(e.target.value)}
            />
            <Input
              label="Next follow-up date"
              type="date"
              value={nextFollowUp}
              onChange={(e) => setNextFollowUp(e.target.value)}
            />
          </div>

          <Textarea
            label="Notes"
            rows={3}
            placeholder="Context, how you met, interests..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? "Save Changes" : "Add Contact"}
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
