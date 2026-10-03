"use client";

import { useState } from "react";
import { setPrimaryResumeAction, deleteResumeAction } from "@/actions/resume";
import type { Resume } from "@/lib/career/types";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function ResumeLibrary({
  resumes,
  onUploadClick,
}: {
  resumes: Resume[];
  onUploadClick: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useState<Resume[] | null>(null);
  const list = optimistic ?? resumes;

  async function handleSetPrimary(id: string) {
    setBusy(id);
    setError(null);
    const result = await setPrimaryResumeAction(id);
    if (result.error) setError(result.error);
    else setOptimistic(list.map((r) => ({ ...r, is_primary: r.id === id })));
    setBusy(null);
  }

  async function handleDelete(id: string) {
    setBusy(id);
    setError(null);
    const result = await deleteResumeAction(id);
    if (result.error) setError(result.error);
    else setOptimistic(list.filter((r) => r.id !== id));
    setBusy(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-career-navy">Resume Library</h2>
        <Button size="sm" onClick={onUploadClick}>
          + Upload Resume
        </Button>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}

      {list.length === 0 ? (
        <div className="rounded-xl border border-career-border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
            📄
          </div>
          <h3 className="mt-4 font-semibold text-career-navy">No resumes yet</h3>
          <p className="mt-1 text-sm text-career-slate">
            Upload a PDF or DOCX resume to get started.
          </p>
          <Button className="mt-4" onClick={onUploadClick}>
            Upload your first resume
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between rounded-xl border border-career-border bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium text-career-navy">
                    {resume.name || "Untitled Resume"}
                  </h3>
                  {resume.is_primary ? (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-career-blue">
                      Primary
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-career-slate">
                  {resume.target_role ? <span>Target: {resume.target_role}</span> : null}
                  {resume.source_file_url ? <span>File: {resume.source_file_url.split("/").pop()}</span> : null}
                  {(resume.parsed_skills?.length ?? 0) > 0 ? (
                    <span>{resume.parsed_skills!.length} skills</span>
                  ) : null}
                  {(resume.parsed_keywords?.length ?? 0) > 0 ? (
                    <span>{resume.parsed_keywords!.length} keywords</span>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!resume.is_primary ? (
                  <Button
                    size="sm"
                    variant="outline"
                    loading={busy === resume.id}
                    onClick={() => handleSetPrimary(resume.id)}
                  >
                    Set Primary
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="danger"
                  loading={busy === resume.id}
                  onClick={() => handleDelete(resume.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
