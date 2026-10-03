"use client";

import { useState } from "react";
import type { ResumeParseResult } from "@/actions/types";
import { ResumeLibrary } from "@/components/career/ResumeLibrary";
import { ResumeUploadForm } from "@/components/career/ResumeUploadForm";
import { ResumeReview } from "@/components/career/ResumeReview";

type Step = "library" | "upload" | "review";

interface ReviewState {
  result: ResumeParseResult;
  resumeName: string;
  file: File | null;
}

export function ResumeManager({ initialResumes }: { initialResumes: import("@/lib/career/types").Resume[] }) {
  const [step, setStep] = useState<Step>("library");
  const resumes = initialResumes;
  const [review, setReview] = useState<ReviewState | null>(null);

  function handleParsed(result: ResumeParseResult, resumeName: string, file: File) {
    setReview({ result, resumeName, file });
    setStep("review");
  }

  function handleDone() {
    setReview(null);
    setStep("library");
    // Refresh by reloading the page data
    window.location.reload();
  }

  if (step === "upload") {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-career-navy">Upload Resume</h1>
          <p className="mt-1 text-sm text-career-slate">
            Upload a PDF or DOCX file. We&apos;ll extract the text and parse key information for your review.
          </p>
        </div>
        <div className="rounded-xl border border-career-border bg-white p-6 shadow-sm">
          <ResumeUploadForm
            onParsed={handleParsed}
            onCancel={() => setStep("library")}
          />
        </div>
      </div>
    );
  }

  if (step === "review" && review) {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-career-navy">Review Resume</h1>
          <p className="mt-1 text-sm text-career-slate">
            Verify the extracted information before saving. You can edit any field that needs correction.
          </p>
        </div>
        <ResumeReview
          rawText={review.result.rawText || ""}
          parsedData={review.result.parsedData!}
          fileName={review.result.fileName || ""}
          resumeName={review.resumeName}
          file={review.file}
          onDone={handleDone}
          onCancel={() => {
            setReview(null);
            setStep("library");
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-career-navy">Resume AI</h1>
        <p className="mt-1 text-sm text-career-slate">
          Upload and manage your resumes. We&apos;ll parse key information for analysis and tailoring.
        </p>
      </div>
      <ResumeLibrary
        resumes={resumes}
        onUploadClick={() => setStep("upload")}
      />
    </div>
  );
}
