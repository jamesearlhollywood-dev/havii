"use client";

import { useRef, useState, useEffect } from "react";
import { useActionState } from "react";
import { parseResumeAction } from "@/actions/resume";
import type { ResumeParseResult } from "@/actions/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

const EMPTY: ResumeParseResult = {};

export function ResumeUploadForm({
  onParsed,
  onCancel,
}: {
  onParsed: (result: ResumeParseResult, resumeName: string, file: File) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, action, pending] = useActionState<ResumeParseResult, FormData>(
    parseResumeAction,
    EMPTY
  );
  const formRef = useRef<HTMLFormElement>(null);
  const parsedRef = useRef(false);

  // When parsing succeeds, pass result + file up — once.
  useEffect(() => {
    if (state.parsedData && !parsedRef.current) {
      parsedRef.current = true;
      onParsed(state, name || state.fileName || "Untitled Resume", selectedFile!);
    }
  }, [state, name, selectedFile, onParsed]);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Input
        name="resume_name"
        label="Resume name"
        placeholder="e.g. Software Engineer — General"
        value={name}
        onChange={(e) => setName(e.target.value)}
        hint="Give this resume version a name so you can find it later."
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-career-navy">
          Resume file
        </label>
        <div className="rounded-xl border-2 border-dashed border-career-border bg-career-bg px-6 py-8 text-center">
          <input
            type="file"
            name="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            className="hidden"
            id="resume-file-input"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />
          <label
            htmlFor="resume-file-input"
            className="cursor-pointer text-sm font-medium text-career-blue hover:underline"
          >
            {selectedFile ? selectedFile.name : "Click to choose a PDF or DOCX file"}
          </label>
          <p className="mt-2 text-xs text-career-slate">
            PDF or DOCX, up to 10 MB
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {pending ? "Parsing…" : "Upload & Parse"}
        </Button>
      </div>
    </form>
  );
}
