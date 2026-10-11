"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { canAccessAdminRoutes } from "@/lib/roles";
import type { CmsModule, CmsLesson, CmsActivity } from "@/data/cms-types";

// ---------------------------------------------------------------------------
// Guard — all CMS actions require admin role
// ---------------------------------------------------------------------------
async function requireAdmin() {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) throw new Error("Not authenticated");
  if (!canAccessAdminRoutes(profile.role)) throw new Error("Not authorized — admin role required");
  return profile;
}

// ---------------------------------------------------------------------------
// Module actions
// ---------------------------------------------------------------------------
export async function saveModule(moduleId: string, data: Partial<CmsModule>) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_modules").upsert({
    id: moduleId,
    ...data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function deleteModule(moduleId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_modules").delete().eq("id", moduleId);
  if (error) throw new Error(error.message);
}

export async function reorderModules(moduleIds: string[]) {
  await requireAdmin();
  const supabase = await createClient();
  for (let i = 0; i < moduleIds.length; i++) {
    await supabase.from("cms_modules").update({ number: i + 1 }).eq("id", moduleIds[i]);
  }
}

// ---------------------------------------------------------------------------
// Lesson actions
// ---------------------------------------------------------------------------
export async function saveLesson(moduleId: string, lessonId: string, data: Partial<CmsLesson>) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_lessons").upsert({
    id: lessonId,
    module_id: moduleId,
    ...data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function deleteLesson(lessonId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_lessons").delete().eq("id", lessonId);
  if (error) throw new Error(error.message);
}

export async function duplicateLesson(moduleId: string, lessonId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: original } = await supabase.from("cms_lessons").select("*").eq("id", lessonId).maybeSingle();
  if (!original) throw new Error("Lesson not found");
  const { id, created_at, updated_at, ...rest } = original;
  const { error } = await supabase.from("cms_lessons").insert({
    ...rest,
    title: `${original.title} (Copy)`,
    is_published: false,
    status: "draft",
  });
  if (error) throw new Error(error.message);
}

export async function reorderLessons(moduleId: string, lessonIds: string[]) {
  await requireAdmin();
  const supabase = await createClient();
  for (let i = 0; i < lessonIds.length; i++) {
    await supabase.from("cms_lessons").update({ sort_order: i }).eq("id", lessonIds[i]);
  }
}

// ---------------------------------------------------------------------------
// Activity actions
// ---------------------------------------------------------------------------
export async function saveActivity(lessonId: string, activityId: string, data: Partial<CmsActivity>) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_activities").upsert({
    id: activityId,
    lesson_id: lessonId,
    ...data,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function deleteActivity(activityId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_activities").delete().eq("id", activityId);
  if (error) throw new Error(error.message);
}

export async function duplicateActivity(lessonId: string, activityId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: original } = await supabase.from("cms_activities").select("*").eq("id", activityId).maybeSingle();
  if (!original) throw new Error("Activity not found");
  const { id, created_at, updated_at, ...rest } = original;
  const { error } = await supabase.from("cms_activities").insert({
    ...rest,
    title: `${original.title} (Copy)`,
    is_published: false,
    status: "draft",
  });
  if (error) throw new Error(error.message);
}

export async function reorderActivities(lessonId: string, activityIds: string[]) {
  await requireAdmin();
  const supabase = await createClient();
  for (let i = 0; i < activityIds.length; i++) {
    await supabase.from("cms_activities").update({ sort_order: i }).eq("id", activityIds[i]);
  }
}

// ---------------------------------------------------------------------------
// Publish / Unpublish
// ---------------------------------------------------------------------------
export async function publishModule(moduleId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_modules").update({
    is_published: true,
    status: "published",
    updated_at: new Date().toISOString(),
  }).eq("id", moduleId);
  if (error) throw new Error(error.message);
}

export async function unpublishModule(moduleId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_modules").update({
    is_published: false,
    status: "draft",
    updated_at: new Date().toISOString(),
  }).eq("id", moduleId);
  if (error) throw new Error(error.message);
}

export async function publishLesson(lessonId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_lessons").update({
    is_published: true,
    status: "published",
    updated_at: new Date().toISOString(),
  }).eq("id", lessonId);
  if (error) throw new Error(error.message);
}

export async function unpublishLesson(lessonId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("cms_lessons").update({
    is_published: false,
    status: "draft",
    updated_at: new Date().toISOString(),
  }).eq("id", lessonId);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Reset student progress (explicit admin action — never automatic)
// ---------------------------------------------------------------------------
export async function resetModuleProgress(moduleId: string) {
  await requireAdmin();
  const supabase = await createClient();
  // Delete lesson progress for this module
  await supabase.from("lesson_progress").delete().eq("module_id", moduleId);
  // Reset module progress
  await supabase.from("module_progress").delete().eq("module_id", moduleId);
  // Delete quiz attempts
  await supabase.from("quiz_attempts").delete().eq("module_id", moduleId);
  // Delete decision lab submissions
  await supabase.from("decision_lab_submissions").delete().eq("module_id", moduleId);
}
