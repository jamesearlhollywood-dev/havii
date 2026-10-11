"use client";

import type { CmsLesson, CmsModule } from "@/data/cms-types";
import { ContentRenderer } from "@/components/course/ContentRenderer";
import { RiseContentTypeBadge } from "./RiseContentTypeBadge";

interface CmsPreviewViewProps {
  lesson: CmsLesson;
  module: CmsModule;
  onBack: () => void;
}

export function CmsPreviewView({ lesson, module, onBack }: CmsPreviewViewProps) {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Preview banner */}
      <div className="mb-4 flex items-center justify-between rounded-xl bg-rise-navy px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="text-lg">👁</span>
          <div>
            <p className="text-sm font-semibold">Student Preview</p>
            <p className="text-xs text-white/70">
              This is exactly what students will see. Instructor notes and unpublished content are hidden.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
        >
          ← Back to Editor
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-rise-muted">
        <span>Course</span>
        <span>/</span>
        <span>Module {module.number}</span>
        <span>/</span>
        <span className="truncate text-rise-navy">{lesson.title}</span>
      </div>

      {/* Lesson header (student view) */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rise-red">
            Module {module.number} · Lesson
          </span>
          {!lesson.isRequired && (
            <span className="rounded-full bg-rise-gold/15 px-2.5 py-0.5 text-xs font-medium text-rise-warning">
              Enrichment (Optional)
            </span>
          )}
          {lesson.riseContentType && (
            <RiseContentTypeBadge type={lesson.riseContentType} />
          )}
        </div>
        <h1 className="mt-1 text-2xl font-bold text-rise-navy">{lesson.title}</h1>
        <p className="mt-1 text-sm text-rise-muted">
          {lesson.subtitle} · {lesson.estimatedMinutes} min
        </p>
      </div>

      {/* Student instructions */}
      {lesson.studentInstructions && (
        <div className="mb-6 rounded-xl border border-rise-blue-light bg-rise-sky px-4 py-3">
          <p className="text-sm text-rise-navy">{lesson.studentInstructions}</p>
        </div>
      )}

      {/* Content (only published blocks) */}
      <div className="mb-8 rounded-2xl border border-rise-border bg-white p-6 sm:p-8">
        <ContentRenderer blocks={lesson.content} />
      </div>

      {/* Reflection prompt (from module) */}
      <div className="mb-8 rounded-2xl border border-rise-border bg-white p-5">
        <h3 className="mb-2 text-sm font-bold text-rise-navy">🤔 Reflection</h3>
        <p className="text-sm text-rise-muted">{module.reflection.prompt}</p>
        <textarea
          disabled
          placeholder={module.reflection.placeholder}
          className="mt-3 w-full rounded-xl border border-rise-border bg-rise-sky/30 px-3.5 py-2.5 text-sm text-rise-muted"
        />
      </div>

      {/* Footer note */}
      <div className="border-t border-rise-border pt-4 text-center text-xs text-rise-muted">
        End of student preview
      </div>
    </div>
  );
}
