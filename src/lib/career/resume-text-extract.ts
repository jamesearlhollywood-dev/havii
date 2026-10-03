/**
 * Server-side text extraction from uploaded resume files (PDF / DOCX).
 *
 * This module is imported only by server actions — never by client components.
 * External parsing API credentials would be read from server-side env vars
 * here, never exposed to the browser.
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
const ALLOWED_EXTENSIONS = new Set(["pdf", "docx"]);

export interface ExtractedFile {
  rawText: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export function validateResumeFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_EXTENSIONS.has(ext) && !ALLOWED_TYPES.has(file.type)) {
    return "Unsupported file type. Please upload a PDF or DOCX file.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Maximum size is 10 MB.";
  }
  if (file.size === 0) {
    return "File appears to be empty.";
  }
  return null;
}

async function extractFromPdf(buffer: Buffer): Promise<string> {
  // dynamic import keeps pdf-parse out of the client bundle
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(buffer);
  return result.text || "";
}

async function extractFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

export async function extractResumeText(file: File): Promise<ExtractedFile> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const buffer = Buffer.from(await file.arrayBuffer());

  let rawText: string;
  if (ext === "pdf" || file.type === "application/pdf") {
    rawText = await extractFromPdf(buffer);
  } else {
    rawText = await extractFromDocx(buffer);
  }

  return {
    rawText: rawText.trim(),
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || (ext === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
  };
}
