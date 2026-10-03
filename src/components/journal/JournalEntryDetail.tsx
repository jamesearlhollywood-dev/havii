"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";
import {
  deleteJournalAction,
  type JournalState,
  type JournalEntry,
} from "@/actions/journal";
import { JournalEditor } from "@/components/journal/JournalEditor";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function JournalEntryDetail({ entry }: { entry: JournalEntry }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteState, deleteAction, deletePending] = useActionState<JournalState, FormData>(
    deleteJournalAction,
    {}
  );

  if (isEditing) {
    return <JournalEditor entry={entry} onCancel={() => setIsEditing(false)} />;
  }

  const wasUpdated = entry.updated_at !== entry.created_at;

  return (
    <div className="space-y-5">
      {/* Top bar with back link */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/app/journal"
          className="text-sm font-medium text-havii-muted hover:text-havii-ink"
        >
          ← Journal
        </Link>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      {/* Entry content */}
      <article className="rounded-2xl border border-havii-mist bg-white p-5 shadow-sm">
        <h1 className="text-xl font-bold text-havii-ink">
          {entry.title || "Untitled"}
        </h1>
        <p className="mt-1 text-xs text-havii-muted">
          {formatDate(entry.created_at)} at {formatTime(entry.created_at)}
          {wasUpdated && " · edited"}
        </p>
        <div className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-havii-ink">
          {entry.body}
        </div>
      </article>

      {/* Privacy notice */}
      <p className="text-xs text-havii-muted">
        Your journal is private. Only you can read, edit, or delete your entries.
      </p>

      {/* Edit button */}
      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={() => setIsEditing(true)}
      >
        Edit Entry
      </Button>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="delete-title" className="text-lg font-bold text-havii-ink">
              Delete this entry?
            </h2>
            <p className="mt-2 text-sm text-havii-muted">
              This cannot be undone. The entry will be permanently removed from your journal.
            </p>
            {deleteState.error && (
              <Alert tone="error" className="mt-3">
                {deleteState.error}
              </Alert>
            )}
            <form action={deleteAction} className="mt-4 flex gap-3">
              <input type="hidden" name="entryId" value={entry.id} />
              <Button
                type="submit"
                variant="danger"
                size="lg"
                className="flex-1"
                loading={deletePending}
                disabled={deletePending}
              >
                {deletePending ? "Deleting…" : "Delete"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletePending}
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
