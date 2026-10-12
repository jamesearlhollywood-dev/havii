"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { hasValidSupabaseConfig } from "@/lib/supabase/server";
import type { Message, MessageReport, ReportStatus, UserRole } from "@/lib/types";
import { DEMO_MESSAGES, DEMO_MESSAGE_REPORTS } from "@/data/demo-data";
import { isAdministrator, isInstructor, isOrgManager } from "@/lib/roles";
import { fullName } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Fetch messages for the current user
// ---------------------------------------------------------------------------
export async function getMessages(): Promise<Message[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_MESSAGES;
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return [];

  // Students see messages where they are the recipient or sender
  // Instructors see messages where they are sender or recipient (for their cohorts)
  // Admins see all messages
  let query = supabase.from("messages").select("*");

  if (profile.role === "admin") {
    // Admin sees all
  } else if (profile.role === "instructor" || profile.role === "org_manager") {
    query = query.or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`);
  } else {
    query = query.or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`);
  }

  const { data } = await query.order("sent_at", { ascending: false }).limit(100);
  return (data ?? []) as Message[];
}

// ---------------------------------------------------------------------------
// Send a message
// ---------------------------------------------------------------------------
export async function sendMessage(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) return { error: "Not authenticated" };

  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const recipientId = String(formData.get("recipient_id") || "").trim() || null;
  const cohortId = String(formData.get("cohort_id") || "").trim() || null;
  const isBroadcast = formData.get("is_broadcast") === "on";

  if (!subject || !body) return { error: "Subject and message are required." };

  const senderName = fullName(profile);

  // Role-based authorization
  if (profile.role === "student") {
    // Students can only message their assigned instructor or support
    if (!recipientId) return { error: "Select a recipient." };
    // Verify recipient is their assigned instructor
    if (hasValidSupabaseConfig()) {
      const supabase = await createClient();
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("assigned_instructor_id")
        .eq("student_profile_id", profile.id)
        .maybeSingle();
      if (enrollment?.assigned_instructor_id !== recipientId) {
        return { error: "You can only message your assigned instructor." };
      }
    }
  } else if (profile.role === "instructor") {
    // Instructors can message students in their assigned cohorts or broadcast to a cohort
    if (isBroadcast && !cohortId) return { error: "Select a cohort to broadcast to." };
    if (!isBroadcast && !recipientId) return { error: "Select a recipient." };
  } else if (profile.role === "org_manager") {
    // Org managers can message users in their organization
    if (!recipientId && !isBroadcast) return { error: "Select a recipient." };
  } else if (profile.role === "admin") {
    // Admins can message anyone
    if (!recipientId && !isBroadcast) return { error: "Select a recipient." };
  }

  if (!hasValidSupabaseConfig()) {
    return { success: "Message sent (demo mode)." };
  }

  const supabase = await createClient();

  if (isBroadcast && cohortId) {
    // Broadcast to all students in the cohort
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("student_profile_id, profiles!inner(first_name, last_name, preferred_name)")
      .eq("cohort_id", cohortId);

    if (!enrollments || enrollments.length === 0) {
      return { error: "No students found in this cohort." };
    }

    // Insert broadcast message record
    await supabase.from("messages").insert({
      sender_id: profile.id,
      sender_name: senderName,
      sender_role: profile.role as UserRole,
      recipient_id: null,
      recipient_name: null,
      organization_id: profile.organization_id,
      cohort_id: cohortId,
      subject,
      body,
      sent_at: new Date().toISOString(),
      read_at: null,
      status: "sent",
      is_cohort_broadcast: true,
      reported: false,
    });

    // Create notifications for each student
    const { createNotification } = await import("@/actions/notifications");
    for (const enr of enrollments as any[]) {
      await createNotification({
        profileId: enr.student_profile_id,
        type: "instructor_message",
        category: "instructor_messages",
        title: `Message from ${senderName}`,
        description: subject,
        relatedType: "message",
        linkUrl: "/messages",
      });
    }
  } else if (recipientId) {
    // Single recipient
    const { data: recipient } = await supabase
      .from("profiles")
      .select("first_name, last_name, preferred_name")
      .eq("id", recipientId)
      .maybeSingle();

    const recipientName = recipient
      ? [recipient.first_name, recipient.last_name].filter(Boolean).join(" ") || recipient.preferred_name || null
      : null;

    await supabase.from("messages").insert({
      sender_id: profile.id,
      sender_name: senderName,
      sender_role: profile.role as UserRole,
      recipient_id: recipientId,
      recipient_name: recipientName,
      organization_id: profile.organization_id,
      cohort_id: cohortId,
      subject,
      body,
      sent_at: new Date().toISOString(),
      read_at: null,
      status: "sent",
      is_cohort_broadcast: false,
      reported: false,
    });

    // Create notification for recipient
    const { createNotification } = await import("@/actions/notifications");
    await createNotification({
      profileId: recipientId,
      type: profile.role === "admin" ? "admin_message" : "instructor_message",
      category: "instructor_messages",
      title: `Message from ${senderName}`,
      description: subject,
      relatedType: "message",
      linkUrl: "/messages",
    });
  }

  return { success: "Message sent successfully." };
}

// ---------------------------------------------------------------------------
// Mark a message as read
// ---------------------------------------------------------------------------
export async function markMessageRead(messageId: string) {
  if (!hasValidSupabaseConfig()) return;

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase) return;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString(), status: "read" })
    .eq("id", messageId)
    .eq("recipient_id", profile.id);
}

// ---------------------------------------------------------------------------
// Report a message
// ---------------------------------------------------------------------------
export async function reportMessage(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile) return { error: "Not authenticated" };

  const messageId = String(formData.get("message_id") || "").trim();
  const reason = String(formData.get("reason") || "").trim();

  if (!messageId || !reason) return { error: "Message and reason are required." };

  if (!hasValidSupabaseConfig()) {
    return { success: "Message reported. An admin will review it." };
  }

  const supabase = await createClient();
  const reporterName = fullName(profile);

  const { error } = await supabase.from("message_reports").insert({
    message_id: messageId,
    reported_by: profile.id,
    reported_by_name: reporterName,
    reason,
    status: "open",
  });

  if (error) return { error: error.message };

  // Mark message as reported
  await supabase.from("messages").update({ reported: true }).eq("id", messageId);

  return { success: "Message reported. An admin will review it shortly." };
}

// ---------------------------------------------------------------------------
// Admin: get all reported messages
// ---------------------------------------------------------------------------
export async function getMessageReports(): Promise<MessageReport[]> {
  if (!hasValidSupabaseConfig()) {
    return DEMO_MESSAGE_REPORTS;
  }

  const { profile, supabase } = await getCurrentUserAndProfile();
  if (!profile || !supabase || !isAdministrator(profile.role)) return [];

  const { data } = await supabase
    .from("message_reports")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as MessageReport[];
}

// ---------------------------------------------------------------------------
// Admin: resolve a message report
// ---------------------------------------------------------------------------
export async function resolveMessageReport(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const { profile } = await getCurrentUserAndProfile();
  if (!profile || !isAdministrator(profile.role)) {
    return { error: "Not authorized." };
  }

  const reportId = String(formData.get("report_id") || "").trim();
  const status = String(formData.get("status") || "resolved") as ReportStatus;
  const adminNote = String(formData.get("admin_note") || "").trim() || null;

  if (!reportId) return { error: "Report ID is required." };

  if (!hasValidSupabaseConfig()) {
    return { success: "Report resolved (demo mode)." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("message_reports")
    .update({
      status,
      admin_note: adminNote,
      resolved_by: profile.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  if (error) return { error: error.message };
  return { success: "Report updated successfully." };
}

// ---------------------------------------------------------------------------
// Admin: get message stats
// ---------------------------------------------------------------------------
export async function getMessageStats() {
  if (!hasValidSupabaseConfig()) {
    const all = DEMO_MESSAGES;
    const reports = DEMO_MESSAGE_REPORTS;
    return {
      totalMessages: all.length,
      unread: all.filter((m) => !m.read_at && m.recipient_id === "demo-student").length,
      broadcasts: all.filter((m) => m.is_cohort_broadcast).length,
      reported: all.filter((m) => m.reported).length,
      openReports: reports.filter((r) => r.status === "open").length,
    };
  }

  const supabase = await createClient();

  const { count: total } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true });

  const { count: broadcasts } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_cohort_broadcast", true);

  const { count: reported } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("reported", true);

  const { count: openReports } = await supabase
    .from("message_reports")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  return {
    totalMessages: total ?? 0,
    unread: 0,
    broadcasts: broadcasts ?? 0,
    reported: reported ?? 0,
    openReports: openReports ?? 0,
  };
}
