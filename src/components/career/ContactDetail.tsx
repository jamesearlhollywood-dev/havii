"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  listInteractionsAction,
  deleteInteractionAction,
  deleteContactAction,
  addContactNoteAction,
  draftNetworkingMessageAction,
} from "@/actions/networking";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ContactModal } from "@/components/career/ContactModal";
import { InteractionModal } from "@/components/career/InteractionModal";
import type { JobLookup } from "@/components/career/TaskModal";
import {
  NETWORK_MESSAGE_TYPES,
  type CareerContact,
  type ContactInteraction,
  type NetworkMessageType,
} from "@/lib/career/types";
import { contactName, isFollowUpDue } from "@/lib/career/networking";

export function ContactDetail({
  contact,
  interactions,
  jobs,
  userName,
}: {
  contact: CareerContact;
  interactions: ContactInteraction[];
  jobs: JobLookup[];
  userName: string;
}) {
  const [interactionList, setInteractionList] = useState<ContactInteraction[]>(interactions);
  const [editOpen, setEditOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ subject: string; body: string; note: string } | null>(null);
  const [draftType, setDraftType] = useState<NetworkMessageType>("networking_email");
  const [drafting, setDrafting] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const today = new Date().toISOString().slice(0, 10);
  const due = isFollowUpDue(contact, today);
  const jobMap = new Map(jobs.map((j) => [j.id, j]));
  const linkedJob = contact.related_job_application_id
    ? jobMap.get(contact.related_job_application_id) ?? null
    : null;

  async function refreshInteractions() {
    const res = await listInteractionsAction(contact.id);
    if (!res.error) setInteractionList(res.interactions);
  }

  function handleEditClose() {
    setEditOpen(false);
    router.refresh();
  }

  function handleLogClose() {
    setLogOpen(false);
    startTransition(async () => {
      await refreshInteractions();
      router.refresh();
    });
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await addContactNoteAction(contact.id, noteText);
      if (res.error) setError(res.error);
      else {
        setNoteText("");
        router.refresh();
      }
    });
  }

  function handleDeleteInteraction(id: string) {
    if (!confirm("Delete this interaction?")) return;
    startTransition(async () => {
      const res = await deleteInteractionAction(id);
      if (res.error) setError(res.error);
      else await refreshInteractions();
    });
  }

  function handleDeleteContact() {
    if (!confirm("Delete this contact? Their interactions will also be removed.")) return;
    startTransition(async () => {
      const res = await deleteContactAction(contact.id);
      if (res.error) setError(res.error);
      else router.push("/app/network");
    });
  }

  function handleDraft() {
    setDrafting(true);
    setError(null);
    setDraft(null);
    startTransition(async () => {
      const res = await draftNetworkingMessageAction({
        type: draftType,
        contactId: contact.id,
        senderName: userName,
        jobContext: linkedJob ? `${linkedJob.title || "role"} at ${linkedJob.company || "the company"}` : null,
      });
      if (res.error) {
        setError(res.error);
      } else {
        setDraft({ subject: res.subject, body: res.body, note: res.note });
      }
      setDrafting(false);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => router.push("/app/network")}
          className="mb-2 text-sm font-medium text-career-blue hover:underline"
        >
          ← Back to Network
        </button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-career-navy">{contactName(contact)}</h1>
            <p className="mt-1 text-sm text-career-slate">
              {contact.job_title || "—"}
              {contact.organization ? ` · ${contact.organization}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setLogOpen(true)}>
              Log Interaction
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button size="sm" variant="danger" onClick={handleDeleteContact}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Follow-up indicator */}
      <div
        className={`rounded-xl border p-4 ${
          due ? "border-amber-200 bg-amber-50" : "border-career-border bg-white"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-career-navy">Follow-up</p>
            <p className={`text-sm ${due ? "text-amber-700" : "text-career-slate"}`}>
              {contact.next_follow_up_date
                ? `Due ${new Date(contact.next_follow_up_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}${due ? " — overdue" : ""}`
                : "No follow-up scheduled."}
            </p>
          </div>
          {due && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Follow-up due
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact information */}
          <Section title="Contact Information">
            <DetailGrid>
              <Detail label="Email" value={contact.email} />
              <Detail label="Phone" value={contact.phone} />
              <Detail label="LinkedIn" value={contact.linkedin_url} link={contact.linkedin_url || undefined} />
              <Detail label="Location" value={contact.location} />
            </DetailGrid>
          </Section>

          {/* Professional information */}
          <Section title="Professional Information">
            <DetailGrid>
              <Detail label="Organization" value={contact.organization} />
              <Detail label="Job title" value={contact.job_title} />
              <Detail label="Source" value={contact.source} />
              <Detail
                label="Related opportunity"
                value={linkedJob ? `${linkedJob.title || "Untitled"}${linkedJob.company ? ` · ${linkedJob.company}` : ""}` : null}
                link={linkedJob ? `/app/jobs/${contact.related_job_application_id}` : undefined}
              />
            </DetailGrid>
          </Section>

          {/* Relationship details */}
          <Section title="Relationship Details">
            <div className="flex flex-wrap gap-2">
              <Chip label="Type" value={contact.relationship_type} tone="blue" />
              <Chip label="Strength" value={contact.relationship_strength} tone="navy" />
              <Chip
                label="Last contact"
                value={contact.last_contact_date ? new Date(contact.last_contact_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "None yet"}
                tone="slate"
              />
              <Chip label="Added" value={new Date(contact.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} tone="slate" />
            </div>
          </Section>

          {/* Notes */}
          <Section title="Notes">
            {contact.notes ? (
              <p className="whitespace-pre-line text-sm text-career-slate">{contact.notes}</p>
            ) : (
              <p className="text-sm text-career-slate">No notes yet.</p>
            )}
            <div className="mt-4 space-y-2">
              <Textarea
                rows={2}
                placeholder="Add a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim()}>
                  Add Note
                </Button>
              </div>
            </div>
          </Section>

          {/* Communication history */}
          <Section title="Communication History">
            {interactionList.length === 0 ? (
              <p className="text-sm text-career-slate">
                No interactions logged yet. Use &ldquo;Log Interaction&rdquo; above to record an email, call, meeting, or event.
              </p>
            ) : (
              <div className="space-y-3">
                {interactionList.map((i) => (
                  <div key={i.id} className="rounded-lg border border-career-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-career-blue">
                          {i.interaction_type}
                        </span>
                        {i.subject && (
                          <span className="text-sm font-medium text-career-navy">{i.subject}</span>
                        )}
                        {i.follow_up_required && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            Follow-up
                            {i.follow_up_date ? ` · ${new Date(i.follow_up_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-career-slate">
                          {new Date(i.interaction_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteInteraction(i.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {i.notes && (
                      <p className="mt-2 whitespace-pre-line text-sm text-career-slate">{i.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Right column: networking actions + AI drafts */}
        <div className="space-y-6">
          <Section title="Networking Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" onClick={() => setLogOpen(true)}>
                Log new interaction
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setEditOpen(true)}>
                Edit contact details
              </Button>
            </div>
          </Section>

          {/* AI draft message */}
          <Section title="Draft a Message">
            <p className="text-xs text-career-slate">
              Generate a draft for review. No email is sent unless a real email
              provider is connected.
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  className="flex-1 rounded-xl border border-career-border bg-white px-3 py-2 text-sm"
                  value={draftType}
                  onChange={(e) => setDraftType(e.target.value as NetworkMessageType)}
                >
                  {NETWORK_MESSAGE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <Button size="sm" onClick={handleDraft} loading={drafting}>
                  Draft
                </Button>
              </div>

              {draft && (
                <div className="rounded-lg border border-career-border bg-career-surface/40 p-3">
                  <p className="text-xs font-medium text-career-navy">Subject</p>
                  <p className="mb-2 text-sm text-career-slate">{draft.subject}</p>
                  <p className="text-xs font-medium text-career-navy">Body</p>
                  <p className="whitespace-pre-line text-sm text-career-slate">{draft.body}</p>
                  <p className="mt-2 text-[11px] text-career-slate">{draft.note}</p>
                </div>
              )}
            </div>
          </Section>

          {/* Suggested networking actions */}
          <Section title="Suggested Actions">
            <ul className="space-y-2 text-sm">
              {[
                "Follow up with recruiter",
                "Thank referral contact",
                "Reconnect with former colleague",
                "Ask for informational interview",
                "Send post-interview thank-you",
                "Check in after application",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2 text-career-slate">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-career-blue" />
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      {editOpen && (
        <ContactModal open={editOpen} onClose={handleEditClose} contact={contact} jobs={jobs} />
      )}
      {logOpen && (
        <InteractionModal open={logOpen} onClose={handleLogClose} contact={contact} jobs={jobs} />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-career-slate">
        {title}
      </h2>
      {children}
    </div>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>;
}

function Detail({
  label,
  value,
  link,
}: {
  label: string;
  value: string | null;
  link?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-career-slate">{label}</dt>
      <dd className="mt-0.5 text-sm text-career-navy">
        {value ? (
          link ? (
            <a href={link} target={link.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-career-blue hover:underline break-all">
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-career-slate">—</span>
        )}
      </dd>
    </div>
  );
}

function Chip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "navy" | "slate";
}) {
  const tones = {
    blue: "bg-blue-50 text-career-blue",
    navy: "bg-career-navy text-white",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`rounded-lg px-3 py-1.5 text-xs font-medium ${tones[tone]}`}>
      {label}: <span className="font-semibold">{value}</span>
    </span>
  );
}
