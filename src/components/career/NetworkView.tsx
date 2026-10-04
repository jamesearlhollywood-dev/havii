"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  listContactsAction,
  deleteContactAction,
} from "@/actions/networking";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ContactModal } from "@/components/career/ContactModal";
import type { JobLookup } from "@/components/career/TaskModal";
import {
  RELATIONSHIP_TYPES,
  RELATIONSHIP_STRENGTHS,
  type CareerContact,
  type RelationshipType,
  type RelationshipStrength,
} from "@/lib/career/types";
import { contactName, isFollowUpDue } from "@/lib/career/networking";

export function NetworkView({
  initialContacts,
  jobs,
  userName,
}: {
  initialContacts: CareerContact[];
  jobs: JobLookup[];
  userName: string;
}) {
  const [contacts, setContacts] = useState<CareerContact[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [relType, setRelType] = useState<string>("");
  const [strength, setStrength] = useState<string>("");
  const [followUpOnly, setFollowUpOnly] = useState(false);
  const [company, setCompany] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const today = new Date().toISOString().slice(0, 10);

  async function refresh() {
    const res = await listContactsAction();
    if (!res.error) setContacts(res.contacts);
  }

  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  // Unique organizations for the company filter
  const organizations = Array.from(
    new Set(contacts.map((c) => c.organization).filter(Boolean))
  ).sort() as string[];

  const filtered = contacts.filter((c) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const hay = [
        contactName(c),
        c.organization ?? "",
        c.job_title ?? "",
        c.location ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (relType && c.relationship_type !== relType) return false;
    if (strength && c.relationship_strength !== strength) return false;
    if (followUpOnly && !isFollowUpDue(c, today)) return false;
    if (company && c.organization !== company) return false;
    return true;
  });

  const dueCount = contacts.filter((c) => isFollowUpDue(c, today)).length;

  // Relationship overview counts
  const overview = RELATIONSHIP_TYPES.map((t) => ({
    type: t,
    count: contacts.filter((c) => c.relationship_type === t).length,
  })).filter((o) => o.count > 0);

  function handleDelete(id: string) {
    setError(null);
    if (!confirm("Delete this contact? Their interactions will also be removed.")) return;
    startTransition(async () => {
      const res = await deleteContactAction(id);
      if (res.error) setError(res.error);
      else await refresh();
    });
  }

  function handleModalClose() {
    setModalOpen(false);
    startTransition(async () => {
      await refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-career-navy">Network</h1>
          <p className="mt-1 text-sm text-career-slate">
            Manage relationships, log interactions, and never miss a follow-up.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Contact</Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Relationship overview */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          label="Total Contacts"
          value={contacts.length}
          tone="slate"
        />
        <OverviewCard
          label="Due for Follow-Up"
          value={dueCount}
          tone={dueCount > 0 ? "amber" : "slate"}
        />
        <OverviewCard
          label="Organizations"
          value={organizations.length}
          tone="blue"
        />
        <OverviewCard
          label="Strong Relationships"
          value={contacts.filter((c) => c.relationship_strength === "Strong").length}
          tone="emerald"
        />
      </div>

      {/* Relationship type breakdown */}
      {overview.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {overview.map((o) => (
            <button
              key={o.type}
              type="button"
              onClick={() => setRelType(relType === o.type ? "" : o.type)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                relType === o.type
                  ? "border-career-blue bg-career-blue text-white"
                  : "border-career-border bg-white text-career-slate hover:bg-career-surface"
              }`}
            >
              {o.type} · {o.count}
            </button>
          ))}
        </div>
      )}

      {/* Search + filters */}
      <div className="space-y-3 rounded-xl border border-career-border bg-white p-4 shadow-sm">
        <Input
          placeholder="Search by name, organization, job title, or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Relationship type"
            options={[{ value: "", label: "All" }, ...RELATIONSHIP_TYPES.map((t) => ({ value: t, label: t }))]}
            value={relType}
            onChange={(e) => setRelType(e.target.value)}
          />
          <Select
            label="Strength"
            options={[{ value: "", label: "All" }, ...RELATIONSHIP_STRENGTHS.map((s) => ({ value: s, label: s }))]}
            value={strength}
            onChange={(e) => setStrength(e.target.value)}
          />
          <Select
            label="Company"
            options={[{ value: "", label: "All" }, ...organizations.map((o) => ({ value: o, label: o }))]}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <label className="flex items-end gap-2 rounded-xl border border-career-border bg-white px-3.5 py-2.5 text-sm">
            <input
              type="checkbox"
              checked={followUpOnly}
              onChange={(e) => setFollowUpOnly(e.target.checked)}
              className="h-4 w-4 rounded border-career-border text-career-blue focus:ring-career-blue"
            />
            <span className="font-medium text-career-navy">Follow-up due</span>
          </label>
        </div>
      </div>

      {/* Contact list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-career-border bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-career-slate">
            {contacts.length === 0
              ? "No contacts yet. Add your first contact to start building your network."
              : "No contacts match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <ContactRow
              key={c.id}
              contact={c}
              today={today}
              job={c.related_job_application_id ? jobMap.get(c.related_job_application_id) ?? null : null}
              onOpen={() => router.push(`/app/network/${c.id}`)}
              onDelete={() => handleDelete(c.id)}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <ContactModal
          open={modalOpen}
          onClose={handleModalClose}
          contact={null}
          jobs={jobs}
        />
      )}
    </div>
  );
}

function ContactRow({
  contact,
  today,
  job,
  onOpen,
  onDelete,
}: {
  contact: CareerContact;
  today: string;
  job: { title: string | null; company: string | null } | null;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const due = isFollowUpDue(contact, today);
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm transition ${
        due ? "border-amber-200" : "border-career-border"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-career-navy hover:text-career-blue">
              {contactName(contact)}
            </h3>
            <RelBadge type={contact.relationship_type} />
            <StrengthBadge strength={contact.relationship_strength} />
            {due && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Follow-up due
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-career-slate">
            {contact.job_title || "—"}
            {contact.organization ? ` · ${contact.organization}` : ""}
            {contact.location ? ` · ${contact.location}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-career-slate">
            <span>
              Last contact:{" "}
              <span className="font-medium text-career-navy">
                {contact.last_contact_date
                  ? new Date(contact.last_contact_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—"}
              </span>
            </span>
            <span>
              Next follow-up:{" "}
              <span className={`font-medium ${due ? "text-amber-700" : "text-career-navy"}`}>
                {contact.next_follow_up_date
                  ? new Date(contact.next_follow_up_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—"}
              </span>
            </span>
            {job && (
              <span className="text-career-blue">
                Linked: {job.company || "Job"}
              </span>
            )}
          </div>
        </button>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="outline" onClick={onOpen}>
            View
          </Button>
          <Button size="sm" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "blue" | "amber" | "emerald";
}) {
  const tones = {
    slate: "text-slate-700",
    blue: "text-career-blue",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
  };
  return (
    <div className="rounded-xl border border-career-border bg-white p-4 shadow-sm">
      <p className={`text-2xl font-bold ${tones[tone]}`}>{value}</p>
      <p className="mt-0.5 text-xs text-career-slate">{label}</p>
    </div>
  );
}

function RelBadge({ type }: { type: RelationshipType }) {
  return (
    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-career-blue">
      {type}
    </span>
  );
}

function StrengthBadge({ strength }: { strength: RelationshipStrength }) {
  const colors: Record<string, string> = {
    New: "bg-slate-100 text-slate-600",
    Developing: "bg-blue-100 text-blue-700",
    Established: "bg-emerald-100 text-emerald-700",
    Strong: "bg-career-navy text-white",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[strength] ?? colors.New}`}>
      {strength}
    </span>
  );
}
