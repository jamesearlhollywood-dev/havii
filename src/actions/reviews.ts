"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import type {
  Submission,
  SubmissionVersion,
  ReviewSettings,
  InstructorWorkloadMetrics,
  ReviewQueueItem,
  ReviewQueueFilters,
  ReviewQueueSort,
  StudentFeedbackItem,
  OrgManagerReviewItem,
  Rubric,
  RubricResult,
  ActivityReviewMode,
  ActivityPrivacyLevel,
  ReviewStatus,
  NotificationCategory,
  NotificationType,
  RelatedEntityType,
} from "@/lib/types";
import {
  DEMO_SUBMISSIONS,
  DEMO_SUBMISSION_VERSIONS,
  DEMO_REVIEW_SETTINGS,
  DEMO_INSTRUCTOR_WORKLOAD,
  DEMO_RUBRICS,
  DEFAULT_DECISION_LAB_RUBRIC,
  DEFAULT_BLUEPRINT_RUBRIC,
  getDemoReviewQueueItems,
  getDemoStudentFeedback,
  getDemoOrgManagerReviewItems,
  DEMO_ACTIVITY_REVIEW_CONFIGS,
  type ActivityReviewConfig,
} from "@/data/review-demo-data";
import { createNotification } from "@/actions/notifications";
import { modules } from "@/data/course";

// ---------------------------------------------------------------------------
// Rubrics
// ---------------------------------------------------------------------------

export async function getRubrics(): Promise<Rubric[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_RUBRICS;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("rubrics")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Rubric[];
}

export async function getRubric(rubricId: string): Promise<Rubric | null> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_RUBRICS.find((r) => r.id === rubricId) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("rubrics")
    .select("*")
    .eq("id", rubricId)
    .maybeSingle();
  return (data as Rubric) ?? null;
}

export async function createRubricAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "Only admins can create rubrics." };
  }

  const title = formData.get("title") as string;
  const activityType = formData.get("activity_type") as string;
  const criteriaJson = formData.get("criteria") as string;

  if (!title || !activityType || !criteriaJson) {
    return { error: "Title, activity type, and criteria are required." };
  }

  let criteria;
  try {
    criteria = JSON.parse(criteriaJson);
  } catch {
    return { error: "Invalid criteria format." };
  }

  const performanceLevels = [
    { level: "beginning", label: "Beginning", point_value: 1, description: "Shows minimal understanding." },
    { level: "developing", label: "Developing", point_value: 2, description: "Shows partial understanding." },
    { level: "proficient", label: "Proficient", point_value: 3, description: "Shows solid understanding." },
    { level: "strong", label: "Strong", point_value: 4, description: "Shows thorough understanding." },
  ];

  if (!hasValidSupabaseConfig()) {
    return { success: "Rubric created (demo mode)." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rubrics").insert({
    title,
    activity_type: activityType,
    criteria,
    performance_levels: performanceLevels,
    is_default: false,
    created_by: profile.id,
    created_by_name: `${profile.first_name} ${profile.last_name}`,
  });

  if (error) return { error: error.message };
  return { success: "Rubric created successfully." };
}

export async function updateRubricAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "Only admins can edit rubrics." };
  }

  const rubricId = formData.get("rubric_id") as string;
  const title = formData.get("title") as string;
  const criteriaJson = formData.get("criteria") as string;

  if (!rubricId || !title) {
    return { error: "Rubric ID and title are required." };
  }

  let criteria;
  try {
    criteria = criteriaJson ? JSON.parse(criteriaJson) : undefined;
  } catch {
    return { error: "Invalid criteria format." };
  }

  if (!hasValidSupabaseConfig()) {
    return { success: "Rubric updated (demo mode)." };
  }

  const supabase = await createClient();
  const update: Record<string, unknown> = { title, updated_at: new Date().toISOString() };
  if (criteria) update.criteria = criteria;

  const { error } = await supabase
    .from("rubrics")
    .update(update)
    .eq("id", rubricId);

  if (error) return { error: error.message };
  return { success: "Rubric updated successfully." };
}

// ---------------------------------------------------------------------------
// Activity Review Configuration
// ---------------------------------------------------------------------------

export async function getActivityReviewConfigs(): Promise<ActivityReviewConfig[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_ACTIVITY_REVIEW_CONFIGS;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("activity_review_configs")
    .select("*")
    .order("activity_id");
  return (data ?? []) as ActivityReviewConfig[];
}

export async function updateActivityReviewModeAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "Only admins can change activity review settings." };
  }

  const activityId = formData.get("activity_id") as string;
  const reviewMode = formData.get("review_mode") as ActivityReviewMode;
  const privacyLevel = formData.get("privacy_level") as ActivityPrivacyLevel;
  const rubricId = (formData.get("rubric_id") as string) || null;

  if (!activityId || !reviewMode || !privacyLevel) {
    return { error: "Missing required fields." };
  }

  if (!hasValidSupabaseConfig()) {
    return { success: "Activity review settings updated (demo mode)." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("activity_review_configs")
    .upsert({
      activity_id: activityId,
      review_mode: reviewMode,
      privacy_level: privacyLevel,
      rubric_id: rubricId,
    }, { onConflict: "activity_id" });

  if (error) return { error: error.message };
  return { success: "Activity review settings updated." };
}

// ---------------------------------------------------------------------------
// Review Settings
// ---------------------------------------------------------------------------

export async function getReviewSettings(): Promise<ReviewSettings> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_REVIEW_SETTINGS;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("review_settings")
    .select("*")
    .maybeSingle();
  return (data as ReviewSettings) ?? DEMO_REVIEW_SETTINGS;
}

export async function updateReviewSettingsAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "Only admins can update review settings." };
  }

  const targetDays = parseInt(formData.get("review_target_days") as string, 10);
  const highlightOverdue = formData.get("highlight_overdue") === "on";

  if (isNaN(targetDays) || targetDays < 1) {
    return { error: "Review target days must be a positive number." };
  }

  if (!hasValidSupabaseConfig()) {
    return { success: "Review settings updated (demo mode)." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("review_settings")
    .upsert({
      review_target_days: targetDays,
      highlight_overdue: highlightOverdue,
    }, { onConflict: "id" });

  if (error) return { error: error.message };
  return { success: "Review settings updated." };
}

// ---------------------------------------------------------------------------
// Instructor Review Queue
// ---------------------------------------------------------------------------

export async function getInstructorReviewQueue(
  filters: ReviewQueueFilters,
  sort: ReviewQueueSort
): Promise<ReviewQueueItem[]> {
  const settings = await getReviewSettings();

  if (!hasValidSupabaseConfig()) {
    let items = getDemoReviewQueueItems(settings.review_target_days);
    items = applyFilters(items, filters);
    items = applySort(items, sort);
    return items;
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return [];

  // Get cohorts assigned to this instructor
  const { data: assignments } = await supabase
    .from("instructor_assignments")
    .select("cohort_id")
    .eq("instructor_profile_id", profile.id);

  const assignedCohortIds = (assignments ?? []).map((a: any) => a.cohort_id);
  if (assignedCohortIds.length === 0) return [];

  let query = supabase
    .from("submissions")
    .select("*")
    .in("cohort_id", assignedCohortIds)
    .in("review_status", ["submitted", "in_review", "resubmitted"]);

  if (filters.cohort_id) query = query.eq("cohort_id", filters.cohort_id);
  if (filters.module_id) query = query.eq("module_id", filters.module_id);
  if (filters.activity_type && filters.activity_type !== "all")
    query = query.eq("submission_type", filters.activity_type);
  if (filters.review_status && filters.review_status !== "all")
    query = query.eq("review_status", filters.review_status);
  if (filters.date_from) query = query.gte("submitted_at", filters.date_from);
  if (filters.date_to) query = query.lte("submitted_at", filters.date_to);

  const { data } = await query.order("submitted_at", { ascending: false });

  let items: ReviewQueueItem[] = (data ?? []).map((s: any) => {
    const daysWaiting = Math.floor(
      (now(s.submitted_at).getTime() - new Date(s.submitted_at).getTime()) / 86400000
    );
    return {
      id: s.id,
      student_name: s.student_name,
      organization_name: s.organization_name ?? "",
      cohort_name: s.cohort_name ?? "",
      module_number: s.module_number,
      module_title: s.module_title,
      activity_title: s.activity_title,
      submission_type: s.submission_type,
      submitted_at: s.submitted_at,
      review_status: s.review_status,
      days_waiting: daysWaiting,
      is_overdue: daysWaiting > settings.review_target_days,
      assigned_instructor_name: s.assigned_instructor_name,
    };
  });

  if (filters.student_search) {
    const q = filters.student_search.toLowerCase();
    items = items.filter((i) => i.student_name.toLowerCase().includes(q));
  }

  items = applySort(items, sort);
  return items;
}

function now(_d?: string) {
  return new Date();
}

function applyFilters(items: ReviewQueueItem[], filters: ReviewQueueFilters): ReviewQueueItem[] {
  return items.filter((i) => {
    if (filters.cohort_id && i.cohort_name !== filters.cohort_id) return false;
    if (filters.module_id && `module-${i.module_number}` !== filters.module_id) return false;
    if (filters.activity_type && filters.activity_type !== "all" && i.submission_type !== filters.activity_type) return false;
    if (filters.review_status && filters.review_status !== "all" && i.review_status !== filters.review_status) return false;
    if (filters.student_search) {
      const q = filters.student_search.toLowerCase();
      if (!i.student_name.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function applySort(items: ReviewQueueItem[], sort: ReviewQueueSort): ReviewQueueItem[] {
  const sorted = [...items];
  switch (sort) {
    case "oldest_first":
      return sorted.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
    case "newest_first":
      return sorted.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    case "student_name":
      return sorted.sort((a, b) => a.student_name.localeCompare(b.student_name));
    case "module":
      return sorted.sort((a, b) => a.module_number - b.module_number);
    default:
      return sorted;
  }
}

// ---------------------------------------------------------------------------
// Single Submission (for Review Submission page)
// ---------------------------------------------------------------------------

export async function getSubmission(submissionId: string): Promise<Submission | null> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_SUBMISSIONS.find((s) => s.id === submissionId) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", submissionId)
    .maybeSingle();
  return (data as Submission) ?? null;
}

export async function getSubmissionVersions(submissionId: string): Promise<SubmissionVersion[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_SUBMISSION_VERSIONS[submissionId] ?? [];
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("submission_versions")
    .select("*")
    .eq("submission_id", submissionId)
    .order("version_number", { ascending: true });
  return (data ?? []) as SubmissionVersion[];
}

// ---------------------------------------------------------------------------
// Submit Review (instructor provides feedback)
// ---------------------------------------------------------------------------

export async function submitReviewAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || (profile.role !== "instructor" && profile.role !== "admin")) {
    return { error: "Only instructors and admins can review submissions." };
  }

  const submissionId = formData.get("submission_id") as string;
  const feedback = (formData.get("instructor_feedback") as string) || "";
  const privateNotes = (formData.get("private_notes") as string) || "";
  const scoreStr = formData.get("score") as string;
  const maxScoreStr = formData.get("max_score") as string;
  const rubricResultJson = formData.get("rubric_result") as string;
  const action = formData.get("review_action") as string; // "feedback" | "revision" | "complete"

  if (!submissionId) {
    return { error: "Submission ID is required." };
  }

  let rubricResult: RubricResult | null = null;
  if (rubricResultJson) {
    try {
      rubricResult = JSON.parse(rubricResultJson);
    } catch {
      return { error: "Invalid rubric result format." };
    }
  }

  const score = scoreStr ? parseFloat(scoreStr) : null;
  const maxScore = maxScoreStr ? parseFloat(maxScoreStr) : null;

  let newStatus: ReviewStatus;
  let resubmissionStatus: "none" | "revision_requested" | "resubmitted";

  if (action === "revision") {
    newStatus = "revision_requested";
    resubmissionStatus = "revision_requested";
  } else if (action === "complete") {
    newStatus = "completed";
    resubmissionStatus = "none";
  } else {
    newStatus = "feedback_provided";
    resubmissionStatus = "none";
  }

  // Get the submission to find the student ID
  const submission = await getSubmission(submissionId);
  if (!submission) {
    return { error: "Submission not found." };
  }

  // Send notification to student
  const notifType: NotificationType =
    action === "revision" ? "revision_requested" :
    action === "complete" ? "activity_marked_complete" :
    "feedback_posted";
  const notifCategory: NotificationCategory = "assignment_reminders";
  const notifTitle =
    action === "revision" ? "Revision requested" :
    action === "complete" ? "Activity marked complete" :
    "Instructor feedback posted";
  const notifDesc =
    action === "revision"
      ? `Your instructor requested a revision on "${submission.activity_title}". Review the feedback, update your work, and resubmit when ready.`
      : action === "complete"
      ? `Your instructor marked "${submission.activity_title}" as complete.`
      : `Your instructor posted feedback on "${submission.activity_title}". Check it out!`;
  const linkUrl = submission.submission_type === "blueprint_section"
    ? "/blueprint"
    : `/course/module/${submission.module_id}`;

  await createNotification({
    profileId: submission.student_profile_id,
    type: notifType,
    category: notifCategory,
    title: notifTitle,
    description: notifDesc,
    relatedType: "submission" as RelatedEntityType,
    relatedId: submissionId,
    linkUrl,
  });

  if (!hasValidSupabaseConfig()) {
    return { success: action === "revision" ? "Revision requested. Student has been notified." : action === "complete" ? "Activity marked complete. Student has been notified." : "Feedback posted. Student has been notified." };
  }

  const supabase = await createClient();

  // Save current version to submission_versions before updating
  await supabase.from("submission_versions").insert({
    submission_id: submissionId,
    version_number: submission.version_number,
    student_response: submission.student_response,
    submitted_at: submission.submitted_at,
    instructor_feedback: submission.instructor_feedback,
    review_status: submission.review_status,
    score: submission.score,
    reviewed_at: submission.reviewed_at,
  });

  const { error } = await supabase
    .from("submissions")
    .update({
      instructor_feedback: feedback,
      private_instructor_notes: privateNotes,
      score: score,
      max_score: maxScore,
      rubric_result: rubricResult,
      review_status: newStatus,
      resubmission_status: resubmissionStatus,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) return { error: error.message };
  return { success: action === "revision" ? "Revision requested. Student has been notified." : action === "complete" ? "Activity marked complete. Student has been notified." : "Feedback posted. Student has been notified." };
}

// ---------------------------------------------------------------------------
// Student Resubmit (after revision requested)
// ---------------------------------------------------------------------------

export async function resubmitAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "student") {
    return { error: "Only students can resubmit." };
  }

  const submissionId = formData.get("submission_id") as string;
  const newResponse = formData.get("student_response") as string;

  if (!submissionId || !newResponse) {
    return { error: "Submission ID and response are required." };
  }

  const submission = await getSubmission(submissionId);
  if (!submission || submission.student_profile_id !== profile.id) {
    return { error: "Submission not found." };
  }

  // Notify instructor
  if (submission.assigned_instructor_id) {
    await createNotification({
      profileId: submission.assigned_instructor_id,
      type: "resubmission_received",
      category: "assignment_reminders",
      title: "Resubmission received",
      description: `${profile.first_name} ${profile.last_name} resubmitted "${submission.activity_title}".`,
      relatedType: "submission",
      relatedId: submissionId,
      linkUrl: `/instructor/reviews/${submissionId}`,
    });
  }

  if (!hasValidSupabaseConfig()) {
    return { success: "Resubmitted. Your instructor has been notified." };
  }

  const supabase = await createClient();

  // Save previous version
  await supabase.from("submission_versions").insert({
    submission_id: submissionId,
    version_number: submission.version_number,
    student_response: submission.student_response,
    submitted_at: submission.submitted_at,
    instructor_feedback: submission.instructor_feedback,
    review_status: submission.review_status,
    score: submission.score,
    reviewed_at: submission.reviewed_at,
  });

  const { error } = await supabase
    .from("submissions")
    .update({
      student_response: newResponse,
      review_status: "resubmitted",
      resubmission_status: "resubmitted",
      version_number: submission.version_number + 1,
      submitted_at: new Date().toISOString(),
      instructor_feedback: null,
      score: null,
      rubric_result: null,
      reviewed_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) return { error: error.message };
  return { success: "Resubmitted. Your instructor has been notified." };
}

// ---------------------------------------------------------------------------
// Student Feedback (for student dashboard)
// ---------------------------------------------------------------------------

export async function getStudentFeedback(): Promise<StudentFeedbackItem[]> {
  if (!hasValidSupabaseConfig()) {
    return getDemoStudentFeedback("demo-student");
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return [];

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("student_profile_id", profile.id)
    .order("updated_at", { ascending: false });

  return (data ?? []).map((s: any) => ({
    submission_id: s.id,
    activity_title: s.activity_title,
    module_number: s.module_number,
    module_title: s.module_title,
    submission_type: s.submission_type,
    review_status: s.review_status,
    instructor_feedback: s.instructor_feedback,
    score: s.score,
    max_score: s.max_score,
    rubric_result: s.rubric_result,
    resubmission_status: s.resubmission_status,
    reviewed_at: s.reviewed_at,
    submitted_at: s.submitted_at,
    link_url: s.submission_type === "blueprint_section" ? "/blueprint" : `/course/module/${s.module_id}`,
  }));
}

// ---------------------------------------------------------------------------
// Instructor Workload Metrics
// ---------------------------------------------------------------------------

export async function getInstructorWorkload(): Promise<InstructorWorkloadMetrics[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_INSTRUCTOR_WORKLOAD;
  }

  const supabase = await createClient();

  // Get all instructors
  const { data: instructors } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("role", "instructor");

  if (!instructors || instructors.length === 0) return [];

  const metrics: InstructorWorkloadMetrics[] = [];

  for (const inst of instructors) {
    const { data: awaiting } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("assigned_instructor_id", inst.id)
      .in("review_status", ["submitted", "in_review", "resubmitted"]);

    const { data: completed } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("assigned_instructor_id", inst.id)
      .in("review_status", ["completed", "feedback_provided"]);

    const { data: revisions } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("assigned_instructor_id", inst.id)
      .eq("review_status", "revision_requested");

    // Overdue: submitted > review_target_days ago
    const settings = await getReviewSettings();
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - settings.review_target_days);
    const { data: overdue } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("assigned_instructor_id", inst.id)
      .in("review_status", ["submitted", "in_review", "resubmitted"])
      .lt("submitted_at", overdueDate.toISOString());

    metrics.push({
      instructor_id: inst.id,
      instructor_name: `${inst.first_name} ${inst.last_name}`,
      submissions_awaiting_review: awaiting?.length ?? 0,
      reviews_completed: completed?.length ?? 0,
      avg_review_turnaround_hours: 48, // Would calculate from actual review times
      revisions_requested: revisions?.length ?? 0,
      overdue_reviews: overdue?.length ?? 0,
    });
  }

  return metrics;
}

// ---------------------------------------------------------------------------
// Admin Review Oversight
// ---------------------------------------------------------------------------

export async function getAdminReviewOversight(): Promise<{
  pending: ReviewQueueItem[];
  unassigned: Submission[];
  allSubmissions: Submission[];
}> {
  const settings = await getReviewSettings();

  if (!hasValidSupabaseConfig()) {
    const pending = getDemoReviewQueueItems(settings.review_target_days);
    const unassigned = DEMO_SUBMISSIONS.filter((s) => !s.assigned_instructor_id);
    return { pending, unassigned, allSubmissions: DEMO_SUBMISSIONS };
  }

  const supabase = await createClient();

  const { data: allData } = await supabase
    .from("submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  const allSubs = (allData ?? []) as Submission[];

  const pending: ReviewQueueItem[] = allSubs
    .filter((s) => ["submitted", "in_review", "resubmitted"].includes(s.review_status))
    .map((s) => {
      const daysWaiting = Math.floor(
        (Date.now() - new Date(s.submitted_at).getTime()) / 86400000
      );
      return {
        id: s.id,
        student_name: s.student_name,
        organization_name: s.organization_name || "",
        cohort_name: s.cohort_name || "",
        module_number: s.module_number,
        module_title: s.module_title,
        activity_title: s.activity_title,
        submission_type: s.submission_type,
        submitted_at: s.submitted_at,
        review_status: s.review_status,
        days_waiting: daysWaiting,
        is_overdue: daysWaiting > settings.review_target_days,
        assigned_instructor_name: s.assigned_instructor_name,
      };
    });

  const unassigned = allSubs.filter((s) => !s.assigned_instructor_id);

  return { pending, unassigned, allSubmissions: allSubs };
}

export async function reassignSubmissionAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "Only admins can reassign submissions." };
  }

  const submissionId = formData.get("submission_id") as string;
  const newInstructorId = formData.get("new_instructor_id") as string;
  const newInstructorName = formData.get("new_instructor_name") as string;

  if (!submissionId || !newInstructorId) {
    return { error: "Submission ID and new instructor are required." };
  }

  if (!hasValidSupabaseConfig()) {
    return { success: "Submission reassigned (demo mode)." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("submissions")
    .update({
      assigned_instructor_id: newInstructorId,
      assigned_instructor_name: newInstructorName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) return { error: error.message };
  return { success: "Submission reassigned successfully." };
}

// ---------------------------------------------------------------------------
// Org Manager Review Status
// ---------------------------------------------------------------------------

export async function getOrgManagerReviewStatus(): Promise<OrgManagerReviewItem[]> {
  if (!hasValidSupabaseConfig()) {
    return getDemoOrgManagerReviewItems("org-lincoln");
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return [];

  // Get cohorts in this org
  const { data: cohorts } = await supabase
    .from("cohorts")
    .select("id")
    .eq("organization_id", profile.organization_id);

  const cohortIds = (cohorts ?? []).map((c: any) => c.id);
  if (cohortIds.length === 0) return [];

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .in("cohort_id", cohortIds)
    .order("submitted_at", { ascending: false });

  return (data ?? []).map((s: any) => ({
    student_name: s.student_name,
    cohort_name: s.cohort_name ?? "",
    module_number: s.module_number,
    module_title: s.module_title,
    activity_title: s.activity_title,
    submission_type: s.submission_type,
    review_status: s.review_status,
    submitted_at: s.submitted_at,
    reviewed_at: s.reviewed_at,
    is_org_visible: s.privacy_level === "org_visible_completion",
  }));
}

// ---------------------------------------------------------------------------
// Create Submission (called when a student submits an activity)
// ---------------------------------------------------------------------------

export async function createSubmission(params: {
  studentProfileId: string;
  studentName: string;
  enrollmentId: string | null;
  organizationId: string | null;
  organizationName: string | null;
  cohortId: string | null;
  cohortName: string | null;
  courseId: string;
  moduleId: string;
  moduleNumber: number;
  moduleTitle: string;
  lessonId: string | null;
  lessonTitle: string | null;
  activityId: string;
  activityTitle: string;
  activityInstructions: string;
  submissionType: Submission["submission_type"];
  studentResponse: string;
  attachedFileUrl?: string | null;
  attachedFileName?: string | null;
  assignedInstructorId?: string | null;
  assignedInstructorName?: string | null;
  reviewMode?: ActivityReviewMode;
  privacyLevel?: ActivityPrivacyLevel;
}): Promise<{ error?: string; submissionId?: string }> {
  const reviewMode = params.reviewMode ?? "instructor_reviewed";
  const privacyLevel = params.privacyLevel ?? "student_instructor_admin";

  // If completion_only, no submission record is needed — just mark complete
  if (reviewMode === "completion_only") {
    return { submissionId: undefined };
  }

  if (!hasValidSupabaseConfig()) {
    return { submissionId: "demo-submission" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from("submissions").insert({
    student_profile_id: params.studentProfileId,
    student_name: params.studentName,
    enrollment_id: params.enrollmentId,
    organization_id: params.organizationId,
    organization_name: params.organizationName,
    cohort_id: params.cohortId,
    cohort_name: params.cohortName,
    course_id: params.courseId,
    module_id: params.moduleId,
    module_number: params.moduleNumber,
    module_title: params.moduleTitle,
    lesson_id: params.lessonId,
    lesson_title: params.lessonTitle,
    activity_id: params.activityId,
    activity_title: params.activityTitle,
    activity_instructions: params.activityInstructions,
    submission_type: params.submissionType,
    student_response: params.studentResponse,
    attached_file_url: params.attachedFileUrl ?? null,
    attached_file_name: params.attachedFileName ?? null,
    submitted_at: new Date().toISOString(),
    review_status: "submitted",
    assigned_instructor_id: params.assignedInstructorId ?? null,
    assigned_instructor_name: params.assignedInstructorName ?? null,
    instructor_feedback: null,
    score: null,
    max_score: null,
    rubric_result: null,
    private_instructor_notes: null,
    reviewed_at: null,
    resubmission_status: "none",
    version_number: 1,
    privacy_level: privacyLevel,
    review_mode: reviewMode,
  }).select("id").single();

  if (error) return { error: error.message };

  // Notify instructor
  if (params.assignedInstructorId) {
    await createNotification({
      profileId: params.assignedInstructorId,
      type: "submission_awaiting_review",
      category: "assignment_reminders",
      title: "New submission awaiting review",
      description: `${params.studentName} submitted "${params.activityTitle}".`,
      relatedType: "submission",
      relatedId: data.id,
      linkUrl: `/instructor/reviews/${data.id}`,
    });
  }

  return { submissionId: data.id };
}
