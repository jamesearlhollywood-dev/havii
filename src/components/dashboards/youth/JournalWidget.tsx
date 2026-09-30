"use client";

import { useActionState, useState } from "react";
import { createJournalEntryAction, type ActionResult } from "@/actions/youth";
import type { JournalEntry } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Link from "next/link";

export function JournalWidget({ entries }: { entries: JournalEntry[] }) {
  const [showForm, setShowForm] = useState(false);
  const [state, action, pending] = useActionState(createJournalEntryAction, {} as ActionResult);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-havii-muted">
          🔒 Your journal is private — only you can see it.
        </p>
        <Link href="/dashboard/journal" className="text-xs font-medium text-havii-teal hover:underline">
          View all
        </Link>
      </div>

      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : state.success ? (
        <p className="text-sm font-medium text-havii-teal">{state.success}</p>
      ) : null}

      {entries.length > 0 && !showForm ? (
        <div className="space-y-2">
          {entries.slice(0, 3).map((entry) => (
            <Link
              key={entry.id}
              href={`/dashboard/journal#${entry.id}`}
              className="block rounded-xl border border-havii-mist bg-white p-3 transition hover:border-havii-teal/40"
            >
              <p className="text-sm font-medium text-havii-ink">
                {entry.title || "Untitled entry"}
              </p>
              <p className="mt-0.5 text-xs text-havii-muted line-clamp-2">
                {entry.body}
              </p>
              <p className="mt-1 text-xs text-havii-muted">
                {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </Link>
          ))}
        </div>
      ) : null}

      {showForm ? (
        <form action={action} className="space-y-3 rounded-xl border border-havii-mist bg-havii-sand/30 p-4">
          <Input name="title" label="Title (optional)" placeholder="Give your entry a title" />
          <Textarea
            name="body"
            label="Write here"
            required
            placeholder="What's on your mind?"
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={pending}>
              Save entry
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(true)}>
          + New entry
        </Button>
      )}
    </div>
  );
}
