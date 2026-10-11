"use client";

import { useState, useEffect, useCallback } from "react";
import { saveBlueprintSection } from "@/actions/progress";
import type { BlueprintUpdate } from "@/data/course-types";
import { Alert } from "@/components/ui/Alert";

export function BlueprintSectionEditor({
  sectionNumber,
  sectionKey,
  sectionTitle,
  blueprintUpdate,
  initialData,
  initialCompleted,
  unlocked,
}: {
  sectionNumber: number;
  sectionKey: string;
  sectionTitle: string;
  blueprintUpdate: BlueprintUpdate;
  initialData: Record<string, unknown> | null;
  initialCompleted: boolean;
  unlocked: boolean;
}) {
  const [data, setData] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(initialCompleted);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      const parsed: Record<string, string> = {};
      for (const [k, v] of Object.entries(initialData)) {
        parsed[k] = typeof v === "string" ? v : String(v ?? "");
      }
      setData(parsed);
    }
  }, [initialData]);

  const autosave = useCallback((newData: Record<string, string>) => {
    if (!unlocked) return;
    setSaved("saving");
    if (timer) clearTimeout(timer);
    const t = setTimeout(async () => {
      try {
        await saveBlueprintSection(sectionNumber, sectionKey, sectionTitle, newData as any, false);
        setSaved("saved");
        setTimeout(() => setSaved("idle"), 2000);
      } catch {
        setSaved("idle");
      }
    }, 2000);
    setTimer(t);
  }, [sectionNumber, sectionKey, sectionTitle, unlocked, timer]);

  useEffect(() => {
    return () => { if (timer) clearTimeout(timer); };
  }, [timer]);

  function updateField(id: string, value: string) {
    const newData = { ...data, [id]: value };
    setData(newData);
    autosave(newData);
  }

  async function handleComplete() {
    try {
      await saveBlueprintSection(sectionNumber, sectionKey, sectionTitle, data as any, true);
      setCompleted(true);
      setSaved("saved");
      setTimeout(() => setSaved("idle"), 2000);
    } catch {
      // ignore
    }
  }

  if (!unlocked) {
    return (
      <div className="rounded-2xl border border-rise-border bg-rise-sky/20 p-6 text-center">
        <div className="text-3xl">🔒</div>
        <p className="mt-2 text-sm font-medium text-rise-muted">
          Complete Module {sectionNumber} to unlock this Blueprint section.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-rise-red">
            Section {sectionNumber}
          </p>
          <h3 className="text-lg font-bold text-rise-navy">{sectionTitle}</h3>
        </div>
        <div className="flex items-center gap-2">
          {completed && (
            <span className="rounded-full bg-rise-success-light px-2.5 py-1 text-xs font-semibold text-rise-success">
              ✓ Complete
            </span>
          )}
          <span className="text-xs text-rise-muted">
            {saved === "saving" && "Saving..."}
            {saved === "saved" && "✓ Saved"}
          </span>
        </div>
      </div>

      <Alert tone="info">{blueprintUpdate.prompt}</Alert>

      <div className="space-y-3">
        {blueprintUpdate.fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-rise-navy">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                value={data[field.id] ?? ""}
                onChange={(e) => updateField(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1 min-h-[80px] w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-sm text-rise-navy placeholder:text-rise-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-rise-blue"
              />
            ) : (
              <input
                type={field.type === "number" ? "number" : "text"}
                value={data[field.id] ?? ""}
                onChange={(e) => updateField(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1 w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-sm text-rise-navy placeholder:text-rise-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-rise-blue"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={completed}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          completed
            ? "bg-rise-success-light text-rise-success"
            : "bg-rise-navy text-white hover:bg-rise-navy-light"
        }`}
      >
        {completed ? "✓ Section Complete" : "Mark Section Complete"}
      </button>
    </div>
  );
}
