"use client";

import { useState } from "react";
import { saveLessonProgress } from "@/actions/progress";
import { useRouter } from "next/navigation";

export function LessonActions({
  moduleId,
  lessonId,
  isComplete,
  nextLessonHref,
  isLastLesson,
}: {
  moduleId: string;
  lessonId: string;
  isComplete: boolean;
  nextLessonHref: string | null;
  isLastLesson: boolean;
}) {
  const [marking, setMarking] = useState(false);
  const [done, setDone] = useState(isComplete);
  const router = useRouter();

  async function handleComplete() {
    setMarking(true);
    try {
      await saveLessonProgress(moduleId, lessonId, "completed");
      setDone(true);
      router.refresh();
    } catch {
      // ignore
    }
    setMarking(false);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={handleComplete}
        disabled={marking || done}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          done
            ? "bg-rise-success-light text-rise-success"
            : "bg-rise-navy text-white hover:bg-rise-navy-light"
        }`}
      >
        {done ? "✓ Lesson Complete" : marking ? "Saving..." : "Mark as Complete"}
      </button>
      {nextLessonHref && (
        <a
          href={nextLessonHref}
          className="rounded-xl border border-rise-border bg-white px-5 py-2.5 text-sm font-semibold text-rise-navy hover:bg-rise-sky"
        >
          {isLastLesson ? "Review Module →" : "Next Lesson →"}
        </a>
      )}
    </div>
  );
}
