"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { modules, blueprintSections, PASSING_SCORE } from "@/data/course";
import { generateCertificateId } from "@/lib/utils";
import type { QuizQuestion } from "@/data/course-types";

// ---------------------------------------------------------------------------
// Lesson progress
// ---------------------------------------------------------------------------
export async function saveLessonProgress(
  moduleId: string,
  lessonId: string,
  status: "in_progress" | "completed",
  reflectionText?: string
) {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) throw new Error("Not authenticated");

  const supabase = await createClient();
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      profile_id: profile.id,
      module_id: moduleId,
      lesson_id: lessonId,
      status,
      reflection_text: reflectionText ?? null,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    },
    { onConflict: "profile_id,module_id,lesson_id" }
  );
  if (error) throw new Error(error.message);

  // Update module progress aggregate
  await updateModuleProgress(profile.id, moduleId);
}

export async function saveReflection(moduleId: string, lessonId: string, text: string) {
  return saveLessonProgress(moduleId, lessonId, "in_progress", text);
}

// ---------------------------------------------------------------------------
// Module progress
// ---------------------------------------------------------------------------
async function updateModuleProgress(profileId: string, moduleId: string) {
  const supabase = await createClient();
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) return;

  const { data: lessons } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("profile_id", profileId)
    .eq("module_id", moduleId)
    .eq("status", "completed");

  const lessonsCompleted = lessons?.length ?? 0;

  const { data: existing } = await supabase
    .from("module_progress")
    .select("*")
    .eq("profile_id", profileId)
    .eq("module_id", moduleId)
    .maybeSingle();

  const moduleCompleted =
    lessonsCompleted >= mod.lessons.length &&
    (existing?.knowledge_check_passed ?? false) &&
    (existing?.decision_lab_submitted ?? false) &&
    (existing?.blueprint_section_completed ?? false);

  await supabase.from("module_progress").upsert(
    {
      profile_id: profileId,
      module_id: moduleId,
      lessons_completed: lessonsCompleted,
      knowledge_check_score: existing?.knowledge_check_score ?? null,
      knowledge_check_passed: existing?.knowledge_check_passed ?? false,
      knowledge_check_attempts: existing?.knowledge_check_attempts ?? 0,
      decision_lab_submitted: existing?.decision_lab_submitted ?? false,
      blueprint_section_completed: existing?.blueprint_section_completed ?? false,
      module_completed: moduleCompleted,
      completed_at: moduleCompleted ? new Date().toISOString() : null,
    },
    { onConflict: "profile_id,module_id" }
  );

  // Check if all modules complete → issue certificate
  if (moduleCompleted) {
    await checkAndIssueCertificate(profileId);
  }
}

// ---------------------------------------------------------------------------
// Knowledge check
// ---------------------------------------------------------------------------
export async function submitKnowledgeCheck(
  moduleId: string,
  answers: Record<string, string | string[]>
): Promise<{ score: number; passed: boolean }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) throw new Error("Not authenticated");

  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) throw new Error("Module not found");

  // Calculate score
  let correct = 0;
  let total = mod.knowledgeCheck.length;

  for (const q of mod.knowledgeCheck) {
    const userAnswer = answers[q.id];
    if (q.type === "matching") {
      // For matching, check if all matches are correct
      const userMatches = Array.isArray(userAnswer) ? userAnswer : [];
      const correctMatches = q.matches?.every((m, i) => userMatches[i] === m.right) ?? false;
      if (correctMatches) correct++;
    } else if (q.type === "multiple_select") {
      const userSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
      const correctSet = new Set(Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]);
      if (userSet.size === correctSet.size && [...userSet].every((v) => correctSet.has(v))) correct++;
    } else {
      if (userAnswer === q.correctAnswer) correct++;
    }
  }

  const score = Math.round((correct / total) * 100);
  const passed = score >= PASSING_SCORE;

  const supabase = await createClient();

  // Save attempt
  await supabase.from("quiz_attempts").insert({
    profile_id: profile.id,
    module_id: moduleId,
    score,
    passed,
    answers,
  });

  // Update module progress
  const { data: existing } = await supabase
    .from("module_progress")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  const attempts = (existing?.knowledge_check_attempts ?? 0) + 1;
  const bestScore = Math.max(score, Number(existing?.knowledge_check_score ?? 0));

  await supabase.from("module_progress").upsert(
    {
      profile_id: profile.id,
      module_id: moduleId,
      lessons_completed: existing?.lessons_completed ?? 0,
      knowledge_check_score: bestScore,
      knowledge_check_passed: passed || (existing?.knowledge_check_passed ?? false),
      knowledge_check_attempts: attempts,
      decision_lab_submitted: existing?.decision_lab_submitted ?? false,
      blueprint_section_completed: existing?.blueprint_section_completed ?? false,
      module_completed: false,
      completed_at: null,
    },
    { onConflict: "profile_id,module_id" }
  );

  await updateModuleProgress(profile.id, moduleId);

  return { score, passed };
}

// ---------------------------------------------------------------------------
// Decision lab
// ---------------------------------------------------------------------------
export async function submitDecisionLab(
  moduleId: string,
  labType: string,
  responses: Record<string, unknown>
) {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) throw new Error("Not authenticated");

  const supabase = await createClient();

  await supabase.from("decision_lab_submissions").insert({
    profile_id: profile.id,
    module_id: moduleId,
    lab_type: labType,
    responses,
  });

  // Update module progress
  const { data: existing } = await supabase
    .from("module_progress")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  await supabase.from("module_progress").upsert(
    {
      profile_id: profile.id,
      module_id: moduleId,
      lessons_completed: existing?.lessons_completed ?? 0,
      knowledge_check_score: existing?.knowledge_check_score ?? null,
      knowledge_check_passed: existing?.knowledge_check_passed ?? false,
      knowledge_check_attempts: existing?.knowledge_check_attempts ?? 0,
      decision_lab_submitted: true,
      blueprint_section_completed: existing?.blueprint_section_completed ?? false,
      module_completed: false,
      completed_at: null,
    },
    { onConflict: "profile_id,module_id" }
  );

  await updateModuleProgress(profile.id, moduleId);
}

// ---------------------------------------------------------------------------
// Blueprint
// ---------------------------------------------------------------------------
export async function saveBlueprintSection(
  sectionNumber: number,
  sectionKey: string,
  sectionTitle: string,
  data: Record<string, unknown>,
  completed: boolean
) {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) throw new Error("Not authenticated");

  const supabase = await createClient();

  await supabase.from("blueprint_sections").upsert(
    {
      profile_id: profile.id,
      section_number: sectionNumber,
      section_key: sectionKey,
      section_title: sectionTitle,
      data,
      completed,
      unlocked: true,
    },
    { onConflict: "profile_id,section_number" }
  );

  // If completed, update the corresponding module progress
  const bpSection = blueprintSections.find((s) => s.number === sectionNumber);
  if (bpSection && completed) {
    const { data: existing } = await supabase
      .from("module_progress")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("module_id", bpSection.moduleId)
      .maybeSingle();

    if (existing) {
      await supabase.from("module_progress").upsert(
        {
          ...existing,
          blueprint_section_completed: true,
        },
        { onConflict: "profile_id,module_id" }
      );
      await updateModuleProgress(profile.id, bpSection.moduleId);
    }
  }
}

export async function unlockBlueprintSection(sectionNumber: number) {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) throw new Error("Not authenticated");

  const supabase = await createClient();
  const section = blueprintSections.find((s) => s.number === sectionNumber);
  if (!section) return;

  const { data: existing } = await supabase
    .from("blueprint_sections")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("section_number", sectionNumber)
    .maybeSingle();

  if (!existing) {
    await supabase.from("blueprint_sections").insert({
      profile_id: profile.id,
      section_number: sectionNumber,
      section_key: section.key,
      section_title: section.title,
      data: {},
      completed: false,
      unlocked: true,
    });
  }
}

// ---------------------------------------------------------------------------
// Final assessment
// ---------------------------------------------------------------------------
export async function submitFinalAssessment(
  answers: Record<string, string | string[]>,
  questions: QuizQuestion[]
): Promise<{ score: number; passed: boolean }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) throw new Error("Not authenticated");

  let correct = 0;
  for (const q of questions) {
    const userAnswer = answers[q.id];
    if (q.type === "multiple_select") {
      const userSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
      const correctSet = new Set(Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]);
      if (userSet.size === correctSet.size && [...userSet].every((v) => correctSet.has(v))) correct++;
    } else if (q.type === "matching") {
      const userMatches = Array.isArray(userAnswer) ? userAnswer : [];
      if (q.matches?.every((m, i) => userMatches[i] === m.right)) correct++;
    } else {
      if (userAnswer === q.correctAnswer) correct++;
    }
  }

  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= PASSING_SCORE;

  const supabase = await createClient();
  await supabase.from("final_assessment_attempts").insert({
    profile_id: profile.id,
    score,
    passed,
    answers,
  });

  if (passed) {
    await checkAndIssueCertificate(profile.id);
  }

  return { score, passed };
}

// ---------------------------------------------------------------------------
// Certificate
// ---------------------------------------------------------------------------
async function checkAndIssueCertificate(profileId: string) {
  const supabase = await createClient();

  // Check all modules completed
  const { data: moduleProgress } = await supabase
    .from("module_progress")
    .select("*")
    .eq("profile_id", profileId);

  const allModulesComplete = modules.every((m) =>
    moduleProgress?.some((mp) => mp.module_id === m.id && mp.module_completed)
  );
  if (!allModulesComplete) return;

  // Check final assessment passed
  const { data: finalAttempts } = await supabase
    .from("final_assessment_attempts")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1);

  const finalPassed = finalAttempts?.some((a) => a.passed);
  if (!finalPassed) return;

  // Check if certificate already exists
  const { data: existing } = await supabase
    .from("certificates")
    .select("*")
    .eq("profile_id", profileId)
    .eq("status", "issued")
    .maybeSingle();

  if (existing) return;

  // Get student name
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (!profile) return;

  const studentName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.preferred_name || "Student";

  // Issue certificate
  await supabase.from("certificates").insert({
    profile_id: profileId,
    certificate_id: generateCertificateId(),
    student_name: studentName,
    course_name: "RISE USA: Roadmap to Income, Savings, and Equity",
    status: "issued",
  });
}

// ---------------------------------------------------------------------------
// Support request
// ---------------------------------------------------------------------------
export async function submitSupportRequest(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) return { error: "Not authenticated" };

  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!subject || !body) return { error: "Subject and message are required." };

  const supabase = await createClient();
  const { error } = await supabase.from("support_requests").insert({
    profile_id: profile.id,
    subject,
    body,
    status: "open",
  });

  if (error) return { error: error.message };
  return { success: "Your support request has been submitted. We'll get back to you soon." };
}

// ---------------------------------------------------------------------------
// Profile update
// ---------------------------------------------------------------------------
export async function updateProfile(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: String(formData.get("first_name") || "").trim() || null,
      last_name: String(formData.get("last_name") || "").trim() || null,
      preferred_name: String(formData.get("preferred_name") || "").trim() || null,
      pronouns: String(formData.get("pronouns") || "").trim() || null,
      city: String(formData.get("city") || "").trim() || null,
      state: String(formData.get("state") || "").trim() || null,
      phone: String(formData.get("phone") || "").trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) return { error: error.message };
  return { success: "Profile updated successfully." };
}
