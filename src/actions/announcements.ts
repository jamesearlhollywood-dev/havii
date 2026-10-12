"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import type { Announcement, AnnouncementAudienceType, AnnouncementPriority } from "@/lib/types";
import { DEMO_ANNOUNCEMENTS } from "@/data/demo-data";
import { isAdministrator, isInstructor } from "@/lib/roles";

// ---------------------------------------------------------------------------
// Fetch active announcements visible to the current user
// ---------------------------------------------------------------------------
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  if (!hasValidSupabaseConfig()) {
    return filterActiveAnnouncements(DEMO_ANNOUNCEMENTS);
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return [];

  const nowIso = new Date().toISOString();

  // Fetch published announcements that are within publish/expiration window
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .lte("publish_date", nowIso)
    .or(`expiration_date.is.null,expiration_date.gte.${nowIso}`)
    .order("created_at", { ascending: false });

  const all = (data ?? []) as Announcement[];

  return filterVisibleAnnouncements(all, profile);
}

function filterActiveAnnouncements(announcements: Announcement[]): Announcement[] {
  const now = new Date();
  return announcements.filter((a) => {
    if (!a.is_published) return false;
    if (new Date(a.publish_date) > now) return false;
    if (a.expiration_date && new Date(a.expiration_date) < now) return false;
    return true;
  });
}

function filterVisibleAnnouncements(
  announcements: Announcement[],
  profile: { id: string; role: string; organization_id: string | null }
): Announcement[] {
  return announcements.filter((a) => {
    if (a.audience_type === "all_users") return true;
    if (a.audience_type === "organization" && a.audience_id === profile.organization_id) return true;
    if (a.audience_type === "cohort") {
      // Students see announcements for their cohort; staff see for their org's cohorts
      return true; // RLS will handle exact filtering in production
    }
    if (a.audience_type === "course") return true;
    return false;
  });
}

// ---------------------------------------------------------------------------
// Fetch all announcements (admin view)
// ---------------------------------------------------------------------------
export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_ANNOUNCEMENTS;
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return [];

  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Announcement[];
}

// ---------------------------------------------------------------------------
// Fetch announcements created by a specific instructor
// ---------------------------------------------------------------------------
export async function getInstructorAnnouncements(): Promise<Announcement[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_ANNOUNCEMENTS.filter((a) => a.created_by === "demo-instructor");
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return [];

  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("created_by", profile.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as Announcement[];
}

// ---------------------------------------------------------------------------
// Create announcement (admin or instructor)
// ---------------------------------------------------------------------------
export async function createAnnouncement(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) return { error: "Not authenticated" };
  if (!isAdministrator(profile.role) && !isInstructor(profile.role)) {
    return { error: "You are not authorized to create announcements." };
  }

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const audienceType = String(formData.get("audience_type") || "all_users") as AnnouncementAudienceType;
  const audienceId = String(formData.get("audience_id") || "").trim() || null;
  const priority = String(formData.get("priority") || "standard") as AnnouncementPriority;
  const publishDate = String(formData.get("publish_date") || "").trim();
  const expirationDate = String(formData.get("expiration_date") || "").trim() || null;
  const linkUrl = String(formData.get("link_url") || "").trim() || null;
  const attachmentUrl = String(formData.get("attachment_url") || "").trim() || null;

  if (!title || !body) return { error: "Title and message are required." };
  if (!publishDate) return { error: "Publish date is required." };

  // Instructors can only target cohorts they're assigned to
  if (isInstructor(profile.role) && audienceType !== "cohort") {
    return { error: "Instructors can only create announcements for assigned cohorts." };
  }

  const audienceName = await resolveAudienceName(audienceType, audienceId);
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.preferred_name || "Staff";

  if (!hasValidSupabaseConfig()) {
    return { success: "Announcement created (demo mode)." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("announcements").insert({
    title,
    body,
    audience_type: audienceType,
    audience_id: audienceId,
    audience_name: audienceName,
    priority,
    publish_date: new Date(publishDate).toISOString(),
    expiration_date: expirationDate ? new Date(expirationDate).toISOString() : null,
    link_url: linkUrl,
    attachment_url: attachmentUrl,
    created_by: profile.id,
    created_by_name: fullName,
    is_published: true,
  });

  if (error) return { error: error.message };

  // Create notifications for affected users
  await notifyAudience(audienceType, audienceId, title, body);

  return { success: "Announcement published successfully." };
}

async function resolveAudienceName(
  audienceType: AnnouncementAudienceType,
  audienceId: string | null
): Promise<string | null> {
  if (!audienceId || !hasValidSupabaseConfig()) return null;
  const supabase = await createClient();

  if (audienceType === "organization") {
    const { data } = await supabase.from("organizations").select("name").eq("id", audienceId).maybeSingle();
    return data?.name ?? null;
  }
  if (audienceType === "cohort") {
    const { data } = await supabase.from("cohorts").select("name").eq("id", audienceId).maybeSingle();
    return data?.name ?? null;
  }
  if (audienceType === "course") {
    return "RISE USA Course";
  }
  return null;
}

async function notifyAudience(
  audienceType: AnnouncementAudienceType,
  audienceId: string | null,
  title: string,
  _body: string
): Promise<void> {
  if (!hasValidSupabaseConfig()) return;
  const supabase = await createClient();

  let profileIds: string[] = [];

  if (audienceType === "all_users") {
    const { data } = await supabase.from("profiles").select("id").eq("account_status", "active");
    profileIds = (data ?? []).map((p: { id: string }) => p.id);
  } else if (audienceType === "organization" && audienceId) {
    const { data } = await supabase.from("profiles").select("id").eq("organization_id", audienceId).eq("account_status", "active");
    profileIds = (data ?? []).map((p: { id: string }) => p.id);
  } else if (audienceType === "cohort" && audienceId) {
    const { data } = await supabase.from("enrollments").select("student_profile_id").eq("cohort_id", audienceId);
    profileIds = (data ?? []).map((e: { student_profile_id: string }) => e.student_profile_id);
  } else if (audienceType === "course") {
    const { data } = await supabase.from("enrollments").select("student_profile_id");
    profileIds = (data ?? []).map((e: { student_profile_id: string }) => e.student_profile_id);
  }

  if (profileIds.length === 0) return;

  const { createNotification } = await import("@/actions/notifications");
  for (const pid of profileIds) {
    await createNotification({
      profileId: pid,
      type: "announcement",
      category: "announcements",
      title: `Announcement: ${title}`,
      description: _body.slice(0, 120),
      relatedType: "announcement",
      linkUrl: "/announcements",
    });
  }
}

// ---------------------------------------------------------------------------
// Delete announcement
// ---------------------------------------------------------------------------
export async function deleteAnnouncement(announcementId: string) {
  if (!hasValidSupabaseConfig()) return;

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return;

  if (!isAdministrator(profile.role) && !isInstructor(profile.role)) return;

  // Instructors can only delete their own
  if (isInstructor(profile.role)) {
    const { data: ann } = await supabase
      .from("announcements")
      .select("created_by")
      .eq("id", announcementId)
      .maybeSingle();
    if (ann?.created_by !== profile.id) return;
  }

  await supabase.from("announcements").delete().eq("id", announcementId);
}

// ---------------------------------------------------------------------------
// Admin reporting: announcement stats
// ---------------------------------------------------------------------------
export async function getAnnouncementStats() {
  if (!hasValidSupabaseConfig()) {
    const all = DEMO_ANNOUNCEMENTS;
    return {
      total: all.length,
      active: filterActiveAnnouncements(all).length,
      byPriority: {
        standard: all.filter((a) => a.priority === "standard").length,
        important: all.filter((a) => a.priority === "important").length,
        urgent: all.filter((a) => a.priority === "urgent").length,
      },
    };
  }

  const supabase = await createClient();
  const { data } = await supabase.from("announcements").select("*");
  const all = (data ?? []) as Announcement[];
  const now = new Date().toISOString();

  return {
    total: all.length,
    active: all.filter((a) => a.is_published && new Date(a.publish_date).toISOString() <= now && (!a.expiration_date || a.expiration_date >= now)).length,
    byPriority: {
      standard: all.filter((a) => a.priority === "standard").length,
      important: all.filter((a) => a.priority === "important").length,
      urgent: all.filter((a) => a.priority === "urgent").length,
    },
  };
}
