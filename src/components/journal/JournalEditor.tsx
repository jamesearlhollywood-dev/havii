"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { saveJournalAction, type JournalState, type JournalEntry } from "@/actions/journal";
import { JOURNAL_PROMPTS } from "@/lib/journalConstants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Alert } from "@/components/ui/Alert";

export function JournalEditor({
  entry,
  onCancel,
}: {
  entry?: JournalEntry | null;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<JournalState, FormData>(
    saveJournalAction,
    {}
  );

  const [title, setTitle] = useState(entry?.title ?? "");
  const [body, setBody] = useState(entry?.body ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const initialTitle = entry?.title ?? "";
  const initialBody = entry?.body ?? "";
  const isDirty = title !== initialTitle || body !== initialBody;

  // Warn before leaving with unsaved changes (browser tab close / refresh)
  // and in-app link clicks (bottom nav, etc.)
  useEffect(() => {
    if (!isDirty) return;

    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);

    const clickCapture = (e: MouseEvent) => {
      if (!isDirty) return;
      const link = (e.target as HTMLElement)?.closest("a");
      if (link && link.getAttribute("href")) {
        if (!window.confirm("You have unsaved changes. Leave anyway?")) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    document.addEventListener("click", clickCapture, true);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", clickCapture, true);
    };
  }, [isDirty]);

  const handlePromptClick = (prompt: string) => {
    setBody((prev) => {
      if (!prev.trim()) return prompt + "\n";
      return prev + "\n\n" + prompt;
    });
    // Focus the textarea and move cursor to end
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (ta) {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
      }
    });
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Leave anyway?")) {
      return;
    }
    if (onCancel) {
      onCancel();
    } else {
      router.push("/app/journal");
    }
  };

  const heading = entry ? "Edit Entry" : "New Entry";
  const saveLabel = entry ? "Save Changes" : "Save Entry";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-havii-ink">{heading}</h1>
        <button
          type="button"
          onClick={handleCancel}
          className="text-sm font-medium text-havii-muted hover:text-havii-ink"
        >
          Cancel
        </button>
      </div>

      {state.error && <Alert tone="error">{state.error}</Alert>}

      <form action={formAction} className="flex flex-1 flex-col space-y-4">
        {entry && <input type="hidden" name="entryId" value={entry.id} />}
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="body" value={body} />

        <Input
          name="title_display"
          label="Title (optional)"
          placeholder="Give your entry a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />

        <div className="space-y-1.5">
          <label htmlFor="body_display" className="block text-sm font-medium text-havii-ink">
            Entry <span className="text-havii-muted">(required)</span>
          </label>
          <textarea
            ref={textareaRef}
            id="body_display"
            name="body_display"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write what's on your mind…"
            maxLength={10000}
            className="w-full rounded-xl border border-havii-mist bg-white px-3.5 py-2.5 text-havii-ink placeholder:text-havii-muted shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-havii-teal focus-visible:border-havii-teal min-h-[200px] resize-y"
            aria-required="true"
          />
        </div>

        {/* Optional prompts */}
        <div>
          <p className="mb-2 text-sm font-medium text-havii-muted">
            Need a prompt? Tap one to add it:
          </p>
          <div className="flex flex-wrap gap-2">
            {JOURNAL_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="rounded-full border border-havii-mist bg-white px-3 py-2 text-xs font-medium text-havii-ink transition hover:border-havii-teal/40 hover:bg-havii-teal/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-havii-teal"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Sticky action bar — reachable when keyboard is open */}
        <div className="sticky bottom-20 mt-auto flex gap-3 border-t border-havii-mist bg-havii-cream pt-4">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            loading={isPending}
            disabled={isPending || !body.trim()}
          >
            {isPending ? "Saving…" : saveLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
