"use server";

// Networking & contact management — server actions.
// Contact storage lives in career_contacts; interactions in contact_interactions.
// When an interaction requires follow-up, a CareerTask is created automatically
// (task_type "Networking"). AI draft generation delegates to the centralized AI
// service layer in src/lib/career/networking.ts. No message is ever marked
// "sent" — delivery is gated by src/lib/career/network-email.ts.

import { createClient } from "@/lib/supabase/server";
import type {
  CareerContact,
  CareerContactInput,
  ContactInteraction,
  ContactInteractionInput,
  RelationshipType,
  RelationshipStrength,
  InteractionType,
  NetworkMessageType,
  NetworkDraftResult,
} from "@/lib/career/types";
import type { NetworkingActionState } from "@/actions/types";
import { draftNetworkingMessage } from "@/lib/career/networking";

interface ContactRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string | null;
  organization: string | null;
  job_title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  relationship_type: RelationshipType;
  relationship_strength: RelationshipStrength;
  location: string | null;
  notes: string | null;
  source: string | null;
  last_contact_date: string | null;
  next_follow_up_date: string | null;
  related_job_application_id: string | null;
  created_at: string;
}

interface InteractionRow {
  id: string;
  user_id: string;
  career_contact_id: string;
  interaction_type: InteractionType;
  interaction_date: string;
  subject: string | null;
  notes: string | null;
  related_job_application_id: string | null;
  follow_up_required: boolean;
  follow_up_date: string | null;
  created_at: string;
}

function rowToContact(row: ContactRow): CareerContact {
  return {
    id: row.id,
    user_id: row.user_id,
    first_name: row.first_name,
    last_name: row.last_name,
    organization: row.organization,
    job_title: row.job_title,
    email: row.email,
    phone: row.phone,
    linkedin_url: row.linkedin_url,
    relationship_type: row.relationship_type,
    relationship_strength: row.relationship_strength,
    location: row.location,
    notes: row.notes,
    source: row.source,
    last_contact_date: row.last_contact_date,
    next_follow_up_date: row.next_follow_up_date,
    related_job_application_id: row.related_job_application_id,
    created_date: row.created_at,
  };
}

function rowToInteraction(row: InteractionRow): ContactInteraction {
  return {
    id: row.id,
    user_id: row.user_id,
    career_contact_id: row.career_contact_id,
    interaction_type: row.interaction_type,
    interaction_date: row.interaction_date,
    subject: row.subject,
    notes: row.notes,
    related_job_application_id: row.related_job_application_id,
    follow_up_required: row.follow_up_required,
    follow_up_date: row.follow_up_date,
    created_date: row.created_at,
  };
}

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// ---------------------------------------------------------------------------
// List contacts
// ---------------------------------------------------------------------------

export async function listContactsAction(): Promise<{
  error?: string;
  contacts: CareerContact[];
}> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", contacts: [] };
  }
  if (!userId) return { error: "Not authenticated.", contacts: [] };

  const { data, error } = await supabase
    .from("career_contacts")
    .select("*")
    .eq("user_id", userId)
    .order("next_follow_up_date", { ascending: true, nullsFirst: false });

  if (error) return { error: "Could not load contacts.", contacts: [] };
  return { contacts: (data as ContactRow[]).map(rowToContact) };
}

// ---------------------------------------------------------------------------
// Get a single contact
// ---------------------------------------------------------------------------

export async function getContactAction(
  id: string
): Promise<{ error?: string; contact: CareerContact | null }> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated.", contact: null };

    const { data, error } = await supabase
      .from("career_contacts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error || !data)
      return { error: "Contact not found.", contact: null };
    return { contact: rowToContact(data as ContactRow) };
  } catch {
    return { error: "Contact not found.", contact: null };
  }
}

// ---------------------------------------------------------------------------
// Create contact
// ---------------------------------------------------------------------------

export async function createContactAction(
  input: CareerContactInput
): Promise<NetworkingActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase.from("career_contacts").insert({
      user_id: user.id,
      first_name: input.first_name.trim(),
      last_name: input.last_name?.trim() || null,
      organization: input.organization?.trim() || null,
      job_title: input.job_title?.trim() || null,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      linkedin_url: input.linkedin_url?.trim() || null,
      relationship_type: input.relationship_type,
      relationship_strength: input.relationship_strength,
      location: input.location?.trim() || null,
      notes: input.notes?.trim() || null,
      source: input.source?.trim() || null,
      last_contact_date: input.last_contact_date || null,
      next_follow_up_date: input.next_follow_up_date || null,
      related_job_application_id: input.related_job_application_id || null,
    });
    if (error) return { error: "Could not create the contact." };
    return { success: "Contact added." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not create the contact." };
  }
}

// ---------------------------------------------------------------------------
// Update contact
// ---------------------------------------------------------------------------

export async function updateContactAction(
  id: string,
  input: CareerContactInput
): Promise<NetworkingActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("career_contacts")
      .update({
        first_name: input.first_name.trim(),
        last_name: input.last_name?.trim() || null,
        organization: input.organization?.trim() || null,
        job_title: input.job_title?.trim() || null,
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        linkedin_url: input.linkedin_url?.trim() || null,
        relationship_type: input.relationship_type,
        relationship_strength: input.relationship_strength,
        location: input.location?.trim() || null,
        notes: input.notes?.trim() || null,
        source: input.source?.trim() || null,
        last_contact_date: input.last_contact_date || null,
        next_follow_up_date: input.next_follow_up_date || null,
        related_job_application_id: input.related_job_application_id || null,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not update the contact." };
    return { success: "Contact updated." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not update the contact." };
  }
}

// ---------------------------------------------------------------------------
// Delete contact (interactions cascade)
// ---------------------------------------------------------------------------

export async function deleteContactAction(id: string): Promise<NetworkingActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("career_contacts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not delete the contact." };
    return { success: "Contact deleted." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not delete the contact." };
  }
}

// ---------------------------------------------------------------------------
// Add a note to a contact (append to existing notes)
// ---------------------------------------------------------------------------

export async function addContactNoteAction(
  id: string,
  note: string
): Promise<NetworkingActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { data: contact } = await supabase
      .from("career_contacts")
      .select("notes")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!contact) return { error: "Contact not found." };

    const stamp = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const existing = (contact.notes ?? "").trim();
    const updated = existing
      ? `${existing}\n\n[${stamp}] ${note.trim()}`
      : `[${stamp}] ${note.trim()}`;

    const { error } = await supabase
      .from("career_contacts")
      .update({ notes: updated })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not save the note." };
    return { success: "Note added." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not save the note." };
  }
}

// ---------------------------------------------------------------------------
// Link a contact to a job application
// ---------------------------------------------------------------------------

export async function linkContactToJobAction(
  contactId: string,
  jobApplicationId: string | null
): Promise<NetworkingActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("career_contacts")
      .update({ related_job_application_id: jobApplicationId })
      .eq("id", contactId)
      .eq("user_id", user.id);
    if (error) return { error: "Could not link the contact." };
    return { success: "Contact linked." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not link the contact." };
  }
}

// ---------------------------------------------------------------------------
// List interactions for a contact
// ---------------------------------------------------------------------------

export async function listInteractionsAction(
  contactId: string
): Promise<{ error?: string; interactions: ContactInteraction[] }> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", interactions: [] };
  }
  if (!userId) return { error: "Not authenticated.", interactions: [] };

  const { data, error } = await supabase
    .from("contact_interactions")
    .select("*")
    .eq("user_id", userId)
    .eq("career_contact_id", contactId)
    .order("interaction_date", { ascending: false });

  if (error) return { error: "Could not load interactions.", interactions: [] };
  return { interactions: (data as InteractionRow[]).map(rowToInteraction) };
}

// ---------------------------------------------------------------------------
// Log an interaction — auto-creates a Networking CareerTask when follow-up required
// ---------------------------------------------------------------------------

export async function logInteractionAction(
  input: ContactInteractionInput
): Promise<NetworkingActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    // Verify the contact belongs to the user
    const { data: contact } = await supabase
      .from("career_contacts")
      .select("id, first_name, last_name, organization, job_title")
      .eq("id", input.career_contact_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!contact) return { error: "Contact not found." };

    const { data: interaction, error } = await supabase
      .from("contact_interactions")
      .insert({
        user_id: user.id,
        career_contact_id: input.career_contact_id,
        interaction_type: input.interaction_type,
        interaction_date: input.interaction_date,
        subject: input.subject?.trim() || null,
        notes: input.notes?.trim() || null,
        related_job_application_id: input.related_job_application_id || null,
        follow_up_required: input.follow_up_required,
        follow_up_date: input.follow_up_date || null,
      })
      .select("id")
      .single();
    if (error || !interaction)
      return { error: "Could not log the interaction." };

    // Update the contact's last_contact_date and next_follow_up_date
    const nextFollowUp = input.follow_up_required
      ? input.follow_up_date || null
      : null;
    await supabase
      .from("career_contacts")
      .update({
        last_contact_date: input.interaction_date,
        next_follow_up_date: nextFollowUp,
      })
      .eq("id", input.career_contact_id)
      .eq("user_id", user.id);

    // Auto-create a Networking CareerTask when follow-up is required
    if (input.follow_up_required && nextFollowUp) {
      const contactName =
        `${contact.first_name}${contact.last_name ? ` ${contact.last_name}` : ""}`.trim();
      const dueDate = nextFollowUp;
      const title = `Follow up with ${contactName}`;
      const description = `Networking follow-up after "${input.interaction_type}"${
        input.subject ? ` — ${input.subject}` : ""
      }${contact.organization ? ` at ${contact.organization}` : ""}.`;

      await supabase.from("career_tasks").insert({
        user_id: user.id,
        title,
        description,
        task_type: "Networking",
        related_job_application_id: input.related_job_application_id || null,
        due_date: dueDate,
        priority: "Medium",
        status: "To Do",
        reminder_enabled: true,
        reminder_date: dueDate,
        reminder_time: "09:00",
      });
    }

    return { success: "Interaction logged." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not log the interaction." };
  }
}

// ---------------------------------------------------------------------------
// Delete an interaction
// ---------------------------------------------------------------------------

export async function deleteInteractionAction(
  id: string
): Promise<NetworkingActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("contact_interactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not delete the interaction." };
    return { success: "Interaction deleted." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not delete the interaction." };
  }
}

// ---------------------------------------------------------------------------
// AI draft networking message (never claims "sent")
// ---------------------------------------------------------------------------

export async function draftNetworkingMessageAction(args: {
  type: NetworkMessageType;
  contactId: string;
  jobContext?: string | null;
  userNote?: string | null;
  senderName?: string | null;
}): Promise<NetworkDraftResult & { error?: string }> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated.", subject: "", body: "", ai_provider: null, model: null, sent: false, note: "" };

    const { data: contactRow } = await supabase
      .from("career_contacts")
      .select("*")
      .eq("id", args.contactId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!contactRow) return { error: "Contact not found.", subject: "", body: "", ai_provider: null, model: null, sent: false, note: "" };

    const contact = rowToContact(contactRow as ContactRow);

    return draftNetworkingMessage(args.type, {
      contact,
      senderName: args.senderName,
      jobContext: args.jobContext,
      userNote: args.userNote,
    });
  } catch {
    return { error: "Could not draft the message.", subject: "", body: "", ai_provider: null, model: null, sent: false, note: "" };
  }
}

// ---------------------------------------------------------------------------
// Dashboard: networking follow-ups (real data only — never fabricated)
// ---------------------------------------------------------------------------

export async function getDashboardNetworkingAction(): Promise<{
  dueFollowUps: CareerContact[];
  recentInteractions: { interaction: ContactInteraction; contactName: string; organization: string | null }[];
  upcomingNetworkingTasks: { id: string; title: string; due_date: string | null; priority: string }[];
}> {
  const empty = {
    dueFollowUps: [],
    recentInteractions: [],
    upcomingNetworkingTasks: [],
  };
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return empty;
  }
  if (!userId) return empty;

  const today = new Date().toISOString().slice(0, 10);

  // Contacts due for follow-up (next_follow_up_date <= today)
  const { data: dueContacts } = await supabase
    .from("career_contacts")
    .select("*")
    .eq("user_id", userId)
    .not("next_follow_up_date", "is", null)
    .lte("next_follow_up_date", today)
    .order("next_follow_up_date", { ascending: true })
    .limit(5);

  // Recent interactions (across all contacts), newest first
  const { data: recentRows } = await supabase
    .from("contact_interactions")
    .select("id, career_contact_id, interaction_type, interaction_date, subject")
    .eq("user_id", userId)
    .order("interaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  // Build contact name map for recent interactions
  const contactIds = Array.from(
    new Set((recentRows ?? []).map((r) => r.career_contact_id))
  );
  let contactMap = new Map<string, { name: string; organization: string | null }>();
  if (contactIds.length > 0) {
    const { data: namedContacts } = await supabase
      .from("career_contacts")
      .select("id, first_name, last_name, organization")
      .in("id", contactIds);
    contactMap = new Map(
      (namedContacts ?? []).map((c) => [
        c.id,
        {
          name: `${c.first_name}${c.last_name ? ` ${c.last_name}` : ""}`.trim(),
          organization: c.organization,
        },
      ])
    );
  }

  // Upcoming networking tasks (active, with a future due date)
  const { data: taskRows } = await supabase
    .from("career_tasks")
    .select("id, title, due_date, priority")
    .eq("user_id", userId)
    .eq("task_type", "Networking")
    .in("status", ["To Do", "In Progress"])
    .gte("due_date", today)
    .order("due_date", { ascending: true })
    .limit(5);

  return {
    dueFollowUps: (dueContacts as ContactRow[] | null)?.map(rowToContact) ?? [],
    recentInteractions: (recentRows ?? []).map((r) => {
      const c = contactMap.get(r.career_contact_id);
      return {
        interaction: rowToInteraction(r as InteractionRow),
        contactName: c?.name ?? "Unknown",
        organization: c?.organization ?? null,
      };
    }),
    upcomingNetworkingTasks: (taskRows ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      due_date: t.due_date,
      priority: t.priority,
    })),
  };
}
