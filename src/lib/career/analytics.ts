// Analytics — deterministic aggregation engine + AI insights.
//
// All metrics are computed from the signed-in user's actual Career AI records.
// Nothing is fabricated: missing data yields nulls / zeros, never sample data.
// The aggregation is pure (input rows → output metrics), so it is testable and
// reusable. careerAnalyticsInsights is an OPTIONAL AI operation that only
// interprets the aggregated statistics provided — it must not invent data.

import "@/lib/ai/openai-provider"; // side-effect: registers AI provider if key set
import { getAIProvider, isAIConfigured, type AIMessage } from "@/lib/ai/provider";
import type {
  ActivityBucket,
  AnalyticsInsightsResult,
  AnalyticsMetrics,
  AnalyticsRange,
  CareerGoalWithProgress,
  FunnelStage,
  SourceBreakdown,
  RoleBreakdown,
  LocationBreakdown,
  WorkModeBreakdown,
} from "@/lib/career/types";
import type {
  JobApplication,
  CareerTask,
  InterviewSession,
  GeneratedDocument,
  SavedJobSearch,
  CareerContact,
  ContactInteraction,
  JobOffer,
  CareerGoal,
} from "@/lib/career/types";

// ---------------------------------------------------------------------------
// Raw input rows — passed in by the action layer (which owns the DB reads).
// ---------------------------------------------------------------------------

export interface AnalyticsRawInput {
  jobs: JobApplication[];
  tasks: CareerTask[];
  interviews: InterviewSession[];
  offers: JobOffer[];
  documents: GeneratedDocument[];
  savedSearches: SavedJobSearch[];
  contacts: CareerContact[];
  interactions: ContactInteraction[];
  goals: CareerGoal[];
}

function avg(nums: number[]): number | null {
  const valid = nums.filter((n) => n != null && Number.isFinite(n));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function rate(num: number, denom: number): number | null {
  if (!denom) return null;
  return num / denom;
}

function pct(num: number, denom: number): number | null {
  const r = rate(num, denom);
  return r == null ? null : Math.round(r * 100);
}

function daysBetween(a: string | null, b: string | null): number | null {
  if (!a || !b) return null;
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  if (Number.isNaN(d1) || Number.isNaN(d2)) return null;
  const diff = Math.round((d2 - d1) / 86400000);
  return diff >= 0 ? diff : null;
}

function rangeStart(range: AnalyticsRange): Date | null {
  if (range === "all") return null;
  const now = new Date();
  const d = new Date(now);
  if (range === "30d") d.setDate(d.getDate() - 30);
  else if (range === "90d") d.setDate(d.getDate() - 90);
  else if (range === "6m") d.setMonth(d.getMonth() - 6);
  else if (range === "12m") d.setFullYear(d.getFullYear() - 1);
  return d;
}

// ---------------------------------------------------------------------------
// Compute the full analytics payload
// ---------------------------------------------------------------------------

export function computeAnalytics(
  raw: AnalyticsRawInput,
  range: AnalyticsRange
): AnalyticsMetrics {
  const { jobs, tasks, interviews, offers, documents, contacts, interactions, goals } = raw;

  // ---- Overview ----
  const applied = jobs.filter((j) => j.status !== "Saved");
  const overview = {
    total_tracked: jobs.length,
    applications_submitted: applied.length,
    interviews_received: jobs.filter((j) => j.status === "Interview" || j.status === "Offer").length,
    offers_received: jobs.filter((j) => j.status === "Offer").length,
    rejections: jobs.filter((j) => j.status === "Rejected").length,
    withdrawn: jobs.filter((j) => j.status === "Withdrawn").length,
    active_opportunities: jobs.filter((j) =>
      ["Saved", "Applied", "Interview"].includes(j.status)
    ).length,
    avg_match_score: avg(jobs.map((j) => j.match_score).filter((s): s is number => s != null)),
  };

  // ---- Funnel ----
  // All tracked jobs pass through the "Saved" concept (the tracker entry point).
  const saved = jobs.length;
  const appliedCount = applied.length;
  const interviewCount = jobs.filter((j) => j.status === "Interview" || j.status === "Offer").length;
  const offerCount = jobs.filter((j) => j.status === "Offer").length;
  const funnel: FunnelStage[] = [
    { stage: "Saved", count: saved, conversion_from_prior: null },
    { stage: "Applied", count: appliedCount, conversion_from_prior: pct(appliedCount, saved) },
    { stage: "Interview", count: interviewCount, conversion_from_prior: pct(interviewCount, appliedCount) },
    { stage: "Offer", count: offerCount, conversion_from_prior: pct(offerCount, interviewCount) },
  ];

  // ---- Activity over time ----
  const start = rangeStart(range);
  const inRange = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return false;
    return !start || d >= start;
  };
  const granularity: "week" | "month" = range === "30d" || range === "90d" ? "week" : "month";
  const buckets = buildActivityBuckets(jobs, start, granularity);

  // ---- Velocity ----
  const velocity = computeVelocity(jobs);

  // ---- Sources ----
  const sources = computeSources(jobs);

  // ---- Match score ----
  const scored = jobs.filter((j) => j.match_score != null);
  const matchBuckets = [
    { label: "0–50", min: 0, max: 50 },
    { label: "51–70", min: 51, max: 70 },
    { label: "71–85", min: 71, max: 85 },
    { label: "86–100", min: 86, max: 100 },
  ].map((b) => {
    const inb = scored.filter((j) => (j.match_score ?? 0) >= b.min && (j.match_score ?? 0) <= b.max);
    return {
      label: b.label,
      applied: inb.filter((j) => j.status !== "Saved").length,
      interviews: inb.filter((j) => j.status === "Interview" || j.status === "Offer").length,
      offers: inb.filter((j) => j.status === "Offer").length,
    };
  });
  const matchScore = {
    avg: avg(scored.map((j) => j.match_score!)),
    highest: scored.length ? Math.max(...scored.map((j) => j.match_score!)) : null,
    avg_applied: avg(scored.filter((j) => j.status !== "Saved").map((j) => j.match_score!)),
    avg_interview: avg(scored.filter((j) => j.status === "Interview" || j.status === "Offer").map((j) => j.match_score!)),
    avg_offer: avg(scored.filter((j) => j.status === "Offer").map((j) => j.match_score!)),
    outcome_buckets: matchBuckets,
  };

  // ---- Roles ----
  const roles = computeRoles(jobs);

  // ---- Locations & work modes ----
  const locations = computeLocations(jobs);
  const workModes = computeWorkModes(jobs);

  // ---- Salary ----
  const withSalary = jobs.filter((j) => j.salary_min != null || j.salary_max != null);
  const salary = {
    avg_min: avg(withSalary.map((j) => j.salary_min).filter((v): v is number => v != null)),
    avg_max: avg(withSalary.map((j) => j.salary_max).filter((v): v is number => v != null)),
    highest: withSalary.length
      ? Math.max(...withSalary.map((j) => j.salary_max ?? j.salary_min ?? 0))
      : null,
    avg_interview_stage: avg(
      withSalary
        .filter((j) => j.status === "Interview" || j.status === "Offer")
        .map((j) => j.salary_max ?? j.salary_min)
        .filter((v): v is number => v != null)
    ),
    avg_offer_stage: avg(
      withSalary
        .filter((j) => j.status === "Offer")
        .map((j) => j.salary_max ?? j.salary_min)
        .filter((v): v is number => v != null)
    ),
    count_with_salary: withSalary.length,
  };

  // ---- Response rate ----
  const applications = applied;
  const withResponse = applications.filter((j) =>
    ["Interview", "Offer", "Rejected"].includes(j.status)
  ).length;
  const noResponse = applications.length - withResponse;
  const responseRate = {
    applications: applications.length,
    with_response: withResponse,
    no_response: noResponse,
    interview_rate: pct(applications.filter((j) => j.status === "Interview" || j.status === "Offer").length, applications.length),
    rejection_rate: pct(applications.filter((j) => j.status === "Rejected").length, applications.length),
    offer_rate: pct(applications.filter((j) => j.status === "Offer").length, applications.length),
  };

  // ---- Follow-up performance ----
  const followUps = tasks.filter((t) => t.task_type === "Follow-Up");
  const completedFollowUps = followUps.filter((t) => t.status === "Completed");
  const overdueFollowUps = followUps.filter(
    (t) => t.status !== "Completed" && t.status !== "Cancelled" && t.due_date && t.due_date < new Date().toISOString().slice(0, 10)
  );
  const completionTimes = completedFollowUps
    .map((t) => daysBetween(t.created_date, t.completed_at))
    .filter((d): d is number => d != null);
  // Compare outcomes for applications with vs without completed follow-ups
  const jobsWithCompletedFollowUp = new Set(
    completedFollowUps
      .filter((t) => t.related_job_application_id)
      .map((t) => t.related_job_application_id!)
  );
  const appsWith = applications.filter((j) => jobsWithCompletedFollowUp.has(j.id));
  const appsWithout = applications.filter((j) => !jobsWithCompletedFollowUp.has(j.id));
  const followUpsMetric = {
    created: followUps.length,
    completed: completedFollowUps.length,
    overdue: overdueFollowUps.length,
    avg_completion_days: avg(completionTimes),
    completion_rate_applications_with: pct(
      appsWith.filter((j) => ["Interview", "Offer"].includes(j.status)).length,
      appsWith.length
    ),
    completion_rate_applications_without: pct(
      appsWithout.filter((j) => ["Interview", "Offer"].includes(j.status)).length,
      appsWithout.length
    ),
  };

  // ---- Networking ----
  const networking = {
    active_contacts: contacts.length,
    recruiters: contacts.filter((c) => c.relationship_type === "Recruiter").length,
    hiring_managers: contacts.filter((c) => c.relationship_type === "Hiring Manager").length,
    referrals: contacts.filter((c) => c.relationship_type === "Referral").length,
    interactions: interactions.length,
    follow_ups_completed: tasks.filter((t) => t.task_type === "Networking" && t.status === "Completed").length,
    applications_with_contact: jobs.filter((j) =>
      contacts.some((c) => c.related_job_application_id === j.id)
    ).length,
  };

  // ---- Documents ----
  const documentGroups: { type: string; label: string }[] = [
    { type: "cover_letter", label: "Cover letters" },
    { type: "follow_up_message", label: "Follow-up messages" },
    { type: "thank_you_note", label: "Thank-you messages" },
    { type: "networking_email", label: "Networking messages" },
    { type: "recruiter_follow_up", label: "Recruiter follow-ups" },
    { type: "referral_request", label: "Referral requests" },
    { type: "salary_negotiation_email", label: "Salary negotiation emails" },
    { type: "counteroffer_email", label: "Counteroffer emails" },
    { type: "offer_acceptance_email", label: "Offer acceptance emails" },
    { type: "offer_decline_email", label: "Offer decline emails" },
    { type: "tailored_resume", label: "Tailored resumes" },
  ];
  const documentActivity = documentGroups
    .map((g) => ({
      type: g.type,
      label: g.label,
      count: documents.filter((d) => d.document_type === g.type).length,
    }))
    .filter((d) => d.count > 0);

  // ---- Interview analytics ----
  const scoredSessions = interviews.filter((s) => s.score != null);
  const interviewByType = new Map<string, number>();
  for (const s of interviews) {
    const t = s.interview_type || "Unspecified";
    interviewByType.set(t, (interviewByType.get(t) ?? 0) + 1);
  }
  const interviewAnalytics = {
    prepared_for: new Set(interviews.map((s) => s.job_application_id).filter(Boolean)).size,
    sessions_completed: interviews.length,
    avg_score: avg(scoredSessions.map((s) => s.score!)),
    by_type: Array.from(interviewByType, ([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
  };

  // ---- Offer analytics ----
  const offerAnalytics = {
    received: offers.length,
    accepted: offers.filter((o) => o.offer_status === "Accepted").length,
    declined: offers.filter((o) => o.offer_status === "Declined").length,
    negotiating: offers.filter((o) => o.offer_status === "Negotiating").length,
    avg_base_salary: avg(offers.map((o) => o.base_salary).filter((v): v is number => v != null)),
    avg_total_comp: avg(offers.map((o) => o.total_estimated_compensation).filter((v): v is number => v != null)),
  };

  // ---- Goals ----
  const goalsWithProgress = goals.map((g) => computeGoalProgress(g, raw));

  // ---- Deterministic insights ----
  const insights = buildDeterministicInsights({
    overview,
    responseRate,
    roles,
    workModes,
    applications: applications.length,
    jobs,
  });

  return {
    overview,
    funnel,
    activity: { buckets, granularity },
    velocity,
    sources,
    matchScore,
    roles,
    locations,
    workModes,
    salary,
    responseRate,
    followUps: followUpsMetric,
    networking,
    documents: documentActivity,
    interviews: interviewAnalytics,
    offers: offerAnalytics,
    goals: goalsWithProgress,
    insights,
  };
}

// ---------------------------------------------------------------------------
// Goal progress — computed against actual records within the goal window
// ---------------------------------------------------------------------------

export function computeGoalProgress(
  goal: CareerGoal,
  raw: AnalyticsRawInput
): CareerGoalWithProgress {
  const start = goal.start_date;
  const end = goal.end_date;
  const inWindow = (dateStr: string | null): boolean => {
    if (!dateStr) return false;
    return (!start || dateStr >= start) && (!end || dateStr <= end);
  };

  let current = 0;
  switch (goal.goal_type) {
    case "Applications":
      current = raw.jobs.filter(
        (j) => j.status !== "Saved" && inWindow(j.applied_date ?? j.created_at)
      ).length;
      break;
    case "Networking Contacts":
      current = raw.contacts.filter((c) => inWindow(c.created_date)).length;
      break;
    case "Follow-Ups":
      current = raw.tasks.filter(
        (t) => t.task_type === "Follow-Up" && inWindow(t.created_date)
      ).length;
      break;
    case "Interviews":
      current = raw.interviews.filter((s) => inWindow(s.created_at)).length;
      break;
    case "Resume Tailoring":
      current = raw.documents.filter(
        (d) => d.document_type === "tailored_resume" && inWindow(d.created_at)
      ).length;
      break;
    case "Job Searches":
      current = raw.savedSearches.filter((s) => inWindow(s.created_date)).length;
      break;
  }

  const progress_pct = goal.target_value > 0 ? Math.min(100, Math.round((current / goal.target_value) * 100)) : 0;
  return { ...goal, current_value: current, progress_pct };
}

// ---------------------------------------------------------------------------
// Activity buckets (over time)
// ---------------------------------------------------------------------------

function buildActivityBuckets(
  jobs: JobApplication[],
  start: Date | null,
  granularity: "week" | "month"
): ActivityBucket[] {
  const buckets: ActivityBucket[] = [];
  if (jobs.length === 0) return buckets;

  // Determine the span to render
  const dates = jobs
    .map((j) => new Date(j.created_at))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (dates.length === 0) return buckets;

  const end = new Date();
  const begin = start ?? new Date(Math.min(...dates.map((d) => d.getTime())));

  if (granularity === "week") {
    // Align begin to the start of its week (Sunday)
    const cur = new Date(begin);
    cur.setDate(cur.getDate() - cur.getDay());
    while (cur <= end) {
      const next = new Date(cur);
      next.setDate(next.getDate() + 7);
      const label = cur.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      buckets.push(bucketFor(jobs, cur, next, label));
      cur.setTime(next.getTime());
    }
  } else {
    const cur = new Date(begin.getFullYear(), begin.getMonth(), 1);
    while (cur <= end) {
      const next = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
      const label = cur.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      buckets.push(bucketFor(jobs, cur, next, label));
      cur.setTime(next.getTime());
    }
  }
  return buckets.slice(-16); // cap to last 16 buckets for readability
}

function bucketFor(jobs: JobApplication[], from: Date, to: Date, label: string): ActivityBucket {
  const inBucket = (dateStr: string | null) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d >= from && d < to;
  };
  return {
    label,
    saved: jobs.filter((j) => inBucket(j.created_at) && j.status === "Saved").length,
    applied: jobs.filter((j) => inBucket(j.applied_date ?? j.created_at) && j.status !== "Saved").length,
    interviews: jobs.filter((j) => inBucket(j.created_at) && (j.status === "Interview" || j.status === "Offer")).length,
    offers: jobs.filter((j) => inBucket(j.created_at) && j.status === "Offer").length,
  };
}

// ---------------------------------------------------------------------------
// Velocity
// ---------------------------------------------------------------------------

function computeVelocity(jobs: JobApplication[]) {
  const now = new Date();
  const weeks = Math.max(1, Math.round((now.getTime() - new Date(jobs.length ? Math.min(...jobs.map((j) => new Date(j.created_at).getTime())) : now.getTime()).getTime()) / (7 * 86400000)) || 1);
  const months = Math.max(1, Math.round((now.getTime() - new Date(jobs.length ? Math.min(...jobs.map((j) => new Date(j.created_at).getTime())) : now.getTime()).getTime()) / (30 * 86400000)) || 1);

  const applied = jobs.filter((j) => j.status !== "Saved");
  const interviewsAll = jobs.filter((j) => j.status === "Interview" || j.status === "Offer");
  const offersAll = jobs.filter((j) => j.status === "Offer");

  // Timing metrics — only when dates exist
  const savedToApplied = jobs
    .filter((j) => j.applied_date && j.created_at)
    .map((j) => daysBetween(j.created_at.slice(0, 10), j.applied_date))
    .filter((d): d is number => d != null);
  const appliedToInterview = jobs
    .filter((j) => j.applied_date && (j.status === "Interview" || j.status === "Offer"))
    .map((j) => daysBetween(j.applied_date, j.created_at))
    .filter((d): d is number => d != null);
  // For interview→offer we don't store an interview date; estimate with created_at of Offer-stage.
  const interviewToOffer: number[] = [];

  return {
    applications_per_week: applied.length ? Math.round((applied.length / weeks) * 10) / 10 : null,
    interviews_per_month: interviewsAll.length ? Math.round((interviewsAll.length / months) * 10) / 10 : null,
    avg_saved_to_applied_days: avg(savedToApplied),
    avg_applied_to_interview_days: avg(appliedToInterview),
    avg_interview_to_offer_days: interviewToOffer.length ? avg(interviewToOffer) : null,
  };
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

function computeSources(jobs: JobApplication[]): SourceBreakdown[] {
  const map = new Map<string, SourceBreakdown>();
  for (const j of jobs) {
    const key = j.source || j.api_provider || "Manual entry";
    const entry = map.get(key) ?? { source: key, found: 0, saved: 0, applied: 0, interviews: 0, offers: 0 };
    entry.found += 1;
    if (j.status === "Saved") entry.saved += 1;
    else entry.applied += 1;
    if (j.status === "Interview" || j.status === "Offer") entry.interviews += 1;
    if (j.status === "Offer") entry.offers += 1;
    map.set(key, entry);
  }
  return Array.from(map.values()).sort((a, b) => b.found - a.found);
}

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

function computeRoles(jobs: JobApplication[]): RoleBreakdown[] {
  const map = new Map<string, RoleBreakdown>();
  for (const j of jobs) {
    const key = (j.title || "Unspecified").trim();
    const entry = map.get(key) ?? { role: key, opportunities: 0, applied: 0, interviews: 0, offers: 0, avg_match_score: null };
    entry.opportunities += 1;
    if (j.status !== "Saved") entry.applied += 1;
    if (j.status === "Interview" || j.status === "Offer") entry.interviews += 1;
    if (j.status === "Offer") entry.offers += 1;
    map.set(key, entry);
  }
  const arr = Array.from(map.values()).sort((a, b) => b.opportunities - a.opportunities);
  for (const r of arr) {
    r.avg_match_score = avg(
      jobs.filter((j) => (j.title || "Unspecified").trim() === r.role && j.match_score != null).map((j) => j.match_score!)
    );
  }
  return arr.slice(0, 12);
}

// ---------------------------------------------------------------------------
// Locations & work modes
// ---------------------------------------------------------------------------

function computeLocations(jobs: JobApplication[]): LocationBreakdown[] {
  const map = new Map<string, { location: string; jobs: number; applied: number; interviews: number; offers: number }>();
  for (const j of jobs) {
    const key = (j.location || "Unspecified").trim();
    const entry = map.get(key) ?? { location: key, jobs: 0, applied: 0, interviews: 0, offers: 0 };
    entry.jobs += 1;
    if (j.status !== "Saved") entry.applied += 1;
    if (j.status === "Interview" || j.status === "Offer") entry.interviews += 1;
    if (j.status === "Offer") entry.offers += 1;
    map.set(key, entry);
  }
  return Array.from(map.values())
    .map((e) => ({
      ...e,
      interview_rate: pct(e.interviews, e.applied || e.jobs),
      offer_rate: pct(e.offers, e.applied || e.jobs),
    }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 10);
}

function computeWorkModes(jobs: JobApplication[]): WorkModeBreakdown[] {
  const map = new Map<string, { work_mode: string; jobs: number; applied: number; interviews: number; offers: number }>();
  for (const j of jobs) {
    const key = j.work_mode || "Unspecified";
    const entry = map.get(key) ?? { work_mode: key, jobs: 0, applied: 0, interviews: 0, offers: 0 };
    entry.jobs += 1;
    if (j.status !== "Saved") entry.applied += 1;
    if (j.status === "Interview" || j.status === "Offer") entry.interviews += 1;
    if (j.status === "Offer") entry.offers += 1;
    map.set(key, entry);
  }
  const order = ["Remote", "Hybrid", "On-site", "Unspecified"];
  return Array.from(map.values())
    .map((e) => ({
      ...e,
      interview_rate: pct(e.interviews, e.applied || e.jobs),
      offer_rate: pct(e.offers, e.applied || e.jobs),
    }))
    .sort((a, b) => order.indexOf(a.work_mode) - order.indexOf(b.work_mode));
}

// ---------------------------------------------------------------------------
// Deterministic insights (no AI — derived purely from the metrics)
// ---------------------------------------------------------------------------

function buildDeterministicInsights(ctx: {
  overview: AnalyticsMetrics["overview"];
  responseRate: AnalyticsMetrics["responseRate"];
  roles: RoleBreakdown[];
  workModes: WorkModeBreakdown[];
  applications: number;
  jobs: JobApplication[];
}): string[] {
  const out: string[] = [];
  const { overview, responseRate, roles, workModes, applications } = ctx;

  if (applications > 0 && responseRate.interview_rate != null) {
    out.push(`Your interview rate is ${responseRate.interview_rate}%.`);
  }
  if (roles.length > 0 && roles[0].opportunities > 0) {
    const top = roles[0];
    out.push(`Most of your tracked opportunities are for ${top.role} (${top.opportunities}).`);
  }
  if (roles.length > 0) {
    const interviewRoles = roles.filter((r) => r.interviews > 0);
    if (interviewRoles.length > 0) {
      const top = interviewRoles.sort((a, b) => b.interviews - a.interviews)[0];
      out.push(`Most of your interviews are coming from ${top.role} roles.`);
    }
  }
  if (workModes.length > 0 && applications > 0) {
    const remote = workModes.find((w) => w.work_mode === "Remote");
    if (remote) {
      const share = Math.round((remote.applied / applications) * 100);
      if (share > 0) out.push(`Remote roles represent ${share}% of your applications.`);
    }
  }
  if (overview.offers_received > 0) {
    out.push(`You have received ${overview.offers_received} offer${overview.offers_received === 1 ? "" : "s"}.`);
  }
  if (overview.rejections > 0 && applications > 0) {
    out.push(`Rejection rate is ${Math.round((overview.rejections / applications) * 100)}% of submitted applications.`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// careerAnalyticsInsights — optional AI interpretation of aggregated metrics
// ---------------------------------------------------------------------------

export async function careerAnalyticsInsights(
  metrics: AnalyticsMetrics
): Promise<AnalyticsInsightsResult> {
  if (!isAIConfigured()) {
    return { ai_configured: false, patterns: [], improvements: [], questions: [], suggested_actions: [], ai_provider: null, model: null };
  }
  const provider = getAIProvider()!;

  const systemMsg: AIMessage = {
    role: "system",
    content:
      "You are a career analytics coach. Interpret ONLY the aggregated statistics provided. " +
      "Never invent data or numbers not present. When data is insufficient, say so. " +
      "Return ONLY a JSON object with keys: patterns (string[]), improvements (string[]), " +
      "questions (string[]), suggested_actions (string[]).",
  };

  const userMsg: AIMessage = {
    role: "user",
    content:
      "Here are the user's aggregated job-search analytics (derived from their real records):\n" +
      JSON.stringify(metrics, null, 2) +
      "\n\nInterpret these statistics. Do not add any figures that are not in the data above.",
  };

  try {
    const res = await provider.complete({
      messages: [systemMsg, userMsg],
      temperature: 0.4,
      maxTokens: 1000,
    });
    const obj = safeParse(res.content);
    return {
      ai_configured: true,
      patterns: arr(obj.patterns),
      improvements: arr(obj.improvements),
      questions: arr(obj.questions),
      suggested_actions: arr(obj.suggested_actions),
      ai_provider: res.provider,
      model: res.model,
    };
  } catch (e) {
    return {
      ai_configured: true,
      patterns: [],
      improvements: [],
      questions: [],
      suggested_actions: [],
      ai_provider: null,
      model: null,
      error: e instanceof Error ? e.message : "Could not generate insights.",
    };
  }
}

function safeParse(content: string): Record<string, unknown> {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start < 0 || end <= start) return {};
  try {
    return JSON.parse(content.slice(start, end + 1));
  } catch {
    return {};
  }
}

function arr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x)).filter(Boolean) : [];
}
