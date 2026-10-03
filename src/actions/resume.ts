"use server";

import { createClient } from "@/lib/supabase/server";
import { localResumeParser } from "@/lib/career/resume-parser";
import { extractResumeText, validateResumeFile } from "@/lib/career/resume-text-extract";
import type { ParsedResumeData, Resume } from "@/lib/career/types";
import type { ResumeActionState, ResumeParseResult } from "@/actions/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getAuthedClient() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { supabase, user };
  } catch {
    return { supabase: null, user: null };
  }
}

function parseParsedData(value: unknown): ParsedResumeData {
  if (!value || typeof value !== "object") {
    return {
      candidate_name: null,
      headline: null,
      summary: null,
      skills: [],
      work_experience: [],
      education: [],
      certifications: [],
      keywords: [],
    };
  }
  const obj = value as Record<string, unknown>;
  return {
    candidate_name: (obj.candidate_name as string) || null,
    headline: (obj.headline as string) || null,
    summary: (obj.summary as string) || null,
    skills: Array.isArray(obj.skills) ? (obj.skills as string[]) : [],
    work_experience: Array.isArray(obj.work_experience) ? (obj.work_experience as ParsedResumeData["work_experience"]) : [],
    education: Array.isArray(obj.education) ? (obj.education as ParsedResumeData["education"]) : [],
    certifications: Array.isArray(obj.certifications) ? (obj.certifications as string[]) : [],
    keywords: Array.isArray(obj.keywords) ? (obj.keywords as string[]) : [],
  };
}

// ---------------------------------------------------------------------------
// Parse action — receives an uploaded file, extracts text, parses structure.
// Returns parsed data to the client for review. Does NOT persist to DB yet.
// ---------------------------------------------------------------------------

export async function parseResumeAction(
  _prev: ResumeParseResult,
  formData: FormData
): Promise<ResumeParseResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { error: "No file provided." };

    const validationError = validateResumeFile(file);
    if (validationError) return { error: validationError };

    const { rawText, fileName, fileSize } = await extractResumeText(file);
    if (!rawText) {
      return { error: "Could not extract any text from the file. It may be image-based or corrupted." };
    }

    const parsedData = localResumeParser.parse(rawText);

    return { rawText, parsedData, fileName, fileSize };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to parse resume." };
  }
}

// ---------------------------------------------------------------------------
// Save action — persists the resume + uploaded file to storage + DB.
// ---------------------------------------------------------------------------

export async function saveResumeAction(
  _prev: ResumeActionState,
  formData: FormData
): Promise<ResumeActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const name = String(formData.get("name") || "").trim();
    const targetRole = String(formData.get("target_role") || "").trim() || null;
    const setPrimary = formData.get("is_primary") === "true";
    const rawText = String(formData.get("raw_text") || "");
    const parsedDataJson = formData.get("parsed_data") as string;
    const parsedData = parsedDataJson ? parseParsedData(JSON.parse(parsedDataJson)) : null;

    if (!name) return { error: "Resume name is required." };
    if (!rawText) return { error: "Resume text is required." };

    // Upload the original file to Supabase Storage (private bucket)
    const file = formData.get("file") as File | null;
    let sourceFileUrl: string | null = null;

    if (file && file.size > 0) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { contentType: file.type || "application/octet-stream" });

      if (uploadError) {
        // Bucket may not exist yet — store filename as fallback reference
        console.error("resume upload:", uploadError.message);
        sourceFileUrl = file.name;
      } else {
        sourceFileUrl = filePath;
      }
    }

    // If setting as primary, unset other primaries first
    if (setPrimary) {
      await supabase
        .from("resumes")
        .update({ is_primary: false })
        .eq("user_id", user.id)
        .eq("is_primary", true);
    }

    const { error } = await supabase.from("resumes").insert({
      user_id: user.id,
      name,
      raw_text: rawText,
      target_role: targetRole,
      is_primary: setPrimary,
      source_file_url: sourceFileUrl,
      parsed_skills: parsedData?.skills ?? [],
      parsed_keywords: parsedData?.keywords ?? [],
      parsed_data: parsedData ?? {},
    });

    if (error) return { error: error.message };
    return { success: "Resume saved." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to save resume." };
  }
}

// ---------------------------------------------------------------------------
// Update parsed data (Edit Parsed Information)
// ---------------------------------------------------------------------------

export async function updateResumeAction(
  _prev: ResumeActionState,
  formData: FormData
): Promise<ResumeActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const id = String(formData.get("id") || "");
    if (!id) return { error: "Resume ID is required." };

    const name = String(formData.get("name") || "").trim() || null;
    const targetRole = String(formData.get("target_role") || "").trim() || null;
    const setPrimary = formData.get("is_primary") === "true";
    const parsedDataJson = formData.get("parsed_data") as string;
    const parsedData = parsedDataJson ? parseParsedData(JSON.parse(parsedDataJson)) : null;

    if (setPrimary) {
      await supabase
        .from("resumes")
        .update({ is_primary: false })
        .eq("user_id", user.id)
        .eq("is_primary", true)
        .neq("id", id);
    }

    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (name !== null) update.name = name;
    if (targetRole !== null) update.target_role = targetRole;
    if (parsedData) {
      update.parsed_data = parsedData;
      update.parsed_skills = parsedData.skills;
      update.parsed_keywords = parsedData.keywords;
    }
    update.is_primary = setPrimary;

    const { error } = await supabase
      .from("resumes")
      .update(update)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
    return { success: "Resume updated." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to update resume." };
  }
}

// ---------------------------------------------------------------------------
// Set as primary
// ---------------------------------------------------------------------------

export async function setPrimaryResumeAction(id: string): Promise<ResumeActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    await supabase
      .from("resumes")
      .update({ is_primary: false })
      .eq("user_id", user.id)
      .eq("is_primary", true)
      .neq("id", id);

    const { error } = await supabase
      .from("resumes")
      .update({ is_primary: true, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
    return { success: "Set as primary resume." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to set primary resume." };
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteResumeAction(id: string): Promise<ResumeActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    // Try to delete the file from storage
    const { data: resume } = await supabase
      .from("resumes")
      .select("source_file_url")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (resume?.source_file_url && resume.source_file_url.includes("/")) {
      await supabase.storage.from("resumes").remove([resume.source_file_url]);
    }

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return { error: error.message };
    return { success: "Resume deleted." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: e instanceof Error ? e.message : "Failed to delete resume." };
  }
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getResumes(): Promise<Resume[]> {
  const { supabase, user } = await getAuthedClient();
  if (!user) return [];

  const { data } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as Resume[];
}
