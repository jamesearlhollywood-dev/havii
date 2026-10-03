"use server";

import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { getSession, getProfile } from "@/lib/session";

export type JournalState = { error?: string; success?: string };

export type JournalEntry = {
  id: string;
  title: string | null;
  body: string;
  created_at: string;
  updated_at: string;
};

export const JOURNAL_PROMPTS = [
  "What has been on your mind today?",
  "What is one thing you wish someone understood?",
  "What helped you through a difficult moment?",
  "What is one small thing you are looking forward to?",
] as const;

/** Verify the user has full access (eligible + consented). */
async function requireFullAccess() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." as const, session: null, profile: null };

  const profile = await getProfile();
  if (!profile) return { error: "Profile not found." as const, session, profile: null };

  if (profile.eligibility_status !== "eligible") {
    return { error: "You are not eligible to use this feature." as const, session, profile };
  }
  if (profile.consent_status !== "self_consented" && profile.consent_status !== "caregiver_consented") {
    return { error: "Caregiver consent is required before you can use the journal." as const, session, profile };
  }
  return { error: null, session, profile };
}

/** Get all journal entries for the current user, newest first. */
export async function getJournalEntries(): Promise<JournalEntry[]> {
  const session = await getSession();
  if (!session) return [];
  const { rows } = await query<JournalEntry>(
    `SELECT id, title, body, created_at, updated_at
     FROM journal_entries WHERE user_id = $1
     ORDER BY created_at DESC`,
    [session.userId]
  );
  return rows;
}

/** Get a single journal entry, verifying ownership. */
export async function getJournalEntry(entryId: string): Promise<JournalEntry | null> {
  const session = await getSession();
  if (!session) return null;
  const { rows } = await query<JournalEntry>(
    `SELECT id, title, body, created_at, updated_at
     FROM journal_entries WHERE id = $1 AND user_id = $2`,
    [entryId, session.userId]
  );
  return rows[0] ?? null;
}

/** Create a new entry or update an existing one. Derives the owner from the session. */
export async function saveJournalAction(
  _prev: JournalState,
  formData: FormData
): Promise<JournalState> {
  const access = await requireFullAccess();
  if (access.error || !access.session) {
    return { error: access.error };
  }

  const entryId = String(formData.get("entryId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!body) {
    return { error: "Please write something before saving." };
  }

  if (entryId) {
    // Update existing entry — ownership verified via user_id in WHERE clause
    try {
      const result = await query(
        `UPDATE journal_entries SET title = $1, body = $2
         WHERE id = $3 AND user_id = $4
         RETURNING id`,
        [title || null, body, entryId, access.session.userId]
      );
      if (result.rowCount === 0) {
        return { error: "Entry not found." };
      }
    } catch (err) {
      // Do not log entry content — only the error message
      console.error("updateJournal error:", err instanceof Error ? err.message : "unknown");
      return { error: "Something went wrong. Your text has been preserved — please try again." };
    }
    redirect(`/app/journal/${entryId}`);
  }

  // Create new entry
  let newId: string | null = null;
  try {
    const { rows } = await query<{ id: string }>(
      `INSERT INTO journal_entries (user_id, title, body) VALUES ($1, $2, $3) RETURNING id`,
      [access.session.userId, title || null, body]
    );
    newId = rows[0].id;
  } catch (err) {
    console.error("createJournal error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Your text has been preserved — please try again." };
  }

  if (newId) {
    redirect(`/app/journal/${newId}`);
  }
  return { error: "Something went wrong. Please try again." };
}

/** Delete a journal entry, verifying ownership. */
export async function deleteJournalAction(
  _prev: JournalState,
  formData: FormData
): Promise<JournalState> {
  const access = await requireFullAccess();
  if (access.error || !access.session) {
    return { error: access.error };
  }

  const entryId = String(formData.get("entryId") || "").trim();
  if (!entryId) {
    return { error: "Entry not found." };
  }

  try {
    const result = await query(
      `DELETE FROM journal_entries WHERE id = $1 AND user_id = $2`,
      [entryId, access.session.userId]
    );
    if (result.rowCount === 0) {
      return { error: "Entry not found." };
    }
  } catch (err) {
    console.error("deleteJournal error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/app/journal");
}
