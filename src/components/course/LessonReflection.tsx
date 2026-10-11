"use client";

import { useState, useEffect, useCallback } from "react";
import { saveReflection } from "@/actions/progress";

export function LessonReflection({
  moduleId,
  lessonId,
  prompt,
  placeholder,
  initialText,
}: {
  moduleId: string;
  lessonId: string;
  prompt: string;
  placeholder: string;
  initialText: string | null;
}) {
  const [text, setText] = useState(initialText || "");
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const autosave = useCallback((value: string) => {
    setSaved("saving");
    if (timer) clearTimeout(timer);
    const t = setTimeout(async () => {
      try {
        await saveReflection(moduleId, lessonId, value);
        setSaved("saved");
        setTimeout(() => setSaved("idle"), 2000);
      } catch {
        setSaved("idle");
      }
    }, 1500);
    setTimer(t);
  }, [moduleId, lessonId, timer]);

  useEffect(() => {
    return () => { if (timer) clearTimeout(timer); };
  }, [timer]);

  return (
    <div className="rounded-2xl border border-rise-border bg-rise-sky/30 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-bold text-rise-navy">Reflection</h3>
        <span className="text-xs text-rise-muted">
          {saved === "saving" && "Saving..."}
          {saved === "saved" && "✓ Saved"}
        </span>
      </div>
      <p className="mb-3 text-sm text-rise-muted">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          autosave(e.target.value);
        }}
        placeholder={placeholder}
        className="min-h-[120px] w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-sm text-rise-navy placeholder:text-rise-muted shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-rise-blue"
      />
      <p className="mt-2 text-xs text-rise-muted">Your response is saved automatically.</p>
    </div>
  );
}
