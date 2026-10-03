"use server";

// Job match analysis — AI service operation that evaluates how well a job
// matches a candidate's profile and resume. Returns structured analysis.
// Also provides getRecommendationsAction which runs the full recommendation
// pipeline with caching.

import { createClient } from "@/lib/supabase/server";
import "@/lib/ai/openai-provider"; // side-effect: auto-registers if OPENAI_API_KEY is set
import { getAIProvider, type AIMessage } from "@/lib/ai/provider";
import { isJobsApiConfigured } from "@/lib/career/jobs-api";
import {
  getCandidateProfile,
  isProfileComplete,
  getCandidateJobs,
  applyFilters,
  rankJobs,
  getCachedAnalyses,
  buildRecommendations,
  jobCacheKey,
} from "@/lib/career/job-recommendations";
import {
  scoreToLabel,
  type CareerProfile,
  type Resume,
  type NormalizedJobResult,
  type JobMatchAnalysis,
  type RecommendationFilters,
} from "@/lib/career/types";
import type { RecommendationsResult, JobMatchActionResult } from "@/actions/types";

const DEFAULT_FILTERS: RecommendationFilters = {
  minMatchScore: 0,
  remoteOnly: false,
  salaryMin: null,
  employmentType: null,
  datePosted: null,
  sortBy: "best_match",
};

const MAX_AUTO_ANALYZE = 5;

// ---------------------------------------------------------------------------
// jobMatchAnalysis — core AI operation
// Inputs: career_profile, resume, normalized_job
// Returns: structured match analysis (server-side, AI-determined scores)
// ---------------------------------------------------------------------------

const MATCH_SYSTEM_PROMPT = `You are an expert job matching analyst. You evaluate how well a job matches a candidate's profile and resume, returning a structured analysis.

You MUST respond with a single valid JSON object — no markdown, no code fences:
{
  "match_score": <integer 0-100>,
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1"],
  "experience_alignment": "aligned" | "slightly below" | "above" | "insufficient data",
  "salary_alignment": "aligned" | "below expectations" | "above expectations" | "no data",
  "location_alignment": "aligned" | "commute needed" | "remote mismatch" | "no data",
  "work_mode_alignment": "aligned" | "partial" | "mismatch" | "no data",
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1"],
  "recommendation_reason": "<one or two sentences explaining the match>"
}

Scoring guide:
- 90-100: Excellent Match — candidate meets or exceeds nearly all requirements
- 75-89: Strong Match — candidate meets most key requirements with minor gaps
- 60-74: Potential Match — candidate meets some requirements but has notable gaps
- Below 60: Low Match — significant gaps in skills, experience, or preferences

Do NOT include "match_label" in your response — it will be derived from match_score.
Be specific and evidence-based. Reference actual skills and requirements from the data.`;

export async function jobMatchAnalysis(
  careerProfile: CareerProfile | null,
  resume: Resume | null,
  job: NormalizedJobResult
): Promise<JobMatchAnalysis | null> {
  const provider = getAIProvider();
  if (!provider) return null;

  const profileSection = careerProfile
    ? `## Candidate Profile
Name: ${careerProfile.full_name ?? "N/A"}
Headline: ${careerProfile.headline ?? "N/A"}
Location: ${careerProfile.location ?? "N/A"}
Target roles: ${(careerProfile.target_roles ?? []).join(", ") || "N/A"}
Skills: ${(careerProfile.skills ?? []).join(", ") || "N/A"}
Years of experience: ${careerProfile.years_experience ?? "N/A"}
Salary range: ${careerProfile.salary_min ?? "?"} - ${careerProfile.salary_max ?? "?"}
Work preferences: ${careerProfile.work_preferences ?? "N/A"}`
    : "## Candidate Profile\nNo career profile data available.";

  const resumeSection = resume
    ? `## Resume
Target role: ${resume.target_role ?? "N/A"}
Skills: ${(resume.parsed_skills ?? []).join(", ") || "N/A"}
Keywords: ${(resume.parsed_keywords ?? []).join(", ") || "N/A"}
${resume.parsed_data?.summary ? `Summary: ${resume.parsed_data.summary}` : ""}
${resume.raw_text ? `Resume text (truncated):\n${resume.raw_text.slice(0, 2000)}` : ""}`
    : "## Resume\nNo resume data available.";

  const jobSection = `## Job to Analyze
Title: ${job.title}
Company: ${job.company}
Location: ${job.location || "N/A"}
Employment type: ${job.employment_type || "N/A"}
Work mode: ${job.work_mode || "N/A"}
Salary: ${job.salary_text || "N/A"}
Description: ${job.description?.slice(0, 1500) || "N/A"}`;

  const messages: AIMessage[] = [
    { role: "system", content: `${MATCH_SYSTEM_PROMPT}\n\n${profileSection}\n\n${resumeSection}\n\n${jobSection}` },
    { role: "user", content: "Analyze the match between this candidate and this job. Return the JSON analysis." },
  ];

  try {
    const result = await provider.complete({
      messages,
      temperature: 0.3,
      maxTokens: 1000,
    });

    return parseMatchAnalysis(result.content);
  } catch {
    return null;
  }
}

function parseMatchAnalysis(raw: string): JobMatchAnalysis | null {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  try {
    const obj = JSON.parse(text);
    const score = Math.max(0, Math.min(100, Math.round(Number(obj.match_score) || 0)));
    return {
      match_score: score,
      match_label: scoreToLabel(score),
      matching_skills: Array.isArray(obj.matching_skills) ? obj.matching_skills : [],
      missing_skills: Array.isArray(obj.missing_skills) ? obj.missing_skills : [],
      experience_alignment: String(obj.experience_alignment ?? "insufficient data"),
      salary_alignment: String(obj.salary_alignment ?? "no data"),
      location_alignment: String(obj.location_alignment ?? "no data"),
      work_mode_alignment: String(obj.work_mode_alignment ?? "no data"),
      strengths: Array.isArray(obj.strengths) ? obj.strengths : [],
      gaps: Array.isArray(obj.gaps) ? obj.gaps : [],
      recommendation_reason: String(obj.recommendation_reason ?? ""),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

async function cacheAnalysis(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  job: NormalizedJobResult,
  analysis: JobMatchAnalysis,
  aiProvider: string,
  modelName: string
) {
  await supabase.from("job_match_analyses").upsert(
    {
      user_id: userId,
      source_job_id: job.source_job_id,
      api_provider: job.api_provider,
      job_data: job,
      match_score: analysis.match_score,
      match_label: analysis.match_label,
      matching_skills: analysis.matching_skills,
      missing_skills: analysis.missing_skills,
      experience_alignment: analysis.experience_alignment,
      salary_alignment: analysis.salary_alignment,
      location_alignment: analysis.location_alignment,
      work_mode_alignment: analysis.work_mode_alignment,
      strengths: analysis.strengths,
      gaps: analysis.gaps,
      recommendation_reason: analysis.recommendation_reason,
      ai_provider: aiProvider,
      model_name: modelName,
    },
    { onConflict: "user_id,source_job_id,api_provider" }
  );
}

// ---------------------------------------------------------------------------
// getRecommendationsAction — full pipeline
// ---------------------------------------------------------------------------

export async function getRecommendationsAction(
  filters?: Partial<RecommendationFilters>
): Promise<RecommendationsResult> {
  const f: RecommendationFilters = { ...DEFAULT_FILTERS, ...filters };

  // 1. Authenticate
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", profileReady: false, jobsAvailable: false, apiConfigured: false, recommendations: [], analyzedCount: 0, totalCandidates: 0 };
  }
  if (!userId) return { error: "Not authenticated.", profileReady: false, jobsAvailable: false, apiConfigured: false, recommendations: [], analyzedCount: 0, totalCandidates: 0 };

  // 2. Retrieve candidate profile
  const { profile, primaryResume } = await getCandidateProfile(supabase, userId);
  const profileReady = isProfileComplete(profile, primaryResume);

  // 3. Retrieve candidate jobs
  const allJobs = await getCandidateJobs(supabase, userId, profile);
  const jobsAvailable = allJobs.length > 0;

  // 4. Apply basic filters
  const filteredJobs = applyFilters(allJobs, f);

  // 5. Check cache
  const cache = await getCachedAnalyses(supabase, userId);
  let recommendations = buildRecommendations(filteredJobs, cache);

  // 6. Auto-analyze uncached jobs (up to MAX_AUTO_ANALYZE) if AI is configured
  const provider = getAIProvider();
  let analyzedCount = 0;
  if (provider && profileReady) {
    const uncached = recommendations.filter((r) => !r.cached).slice(0, MAX_AUTO_ANALYZE);
    for (const rec of uncached) {
      const analysis = await jobMatchAnalysis(profile, primaryResume, rec.job);
      if (analysis) {
        await cacheAnalysis(supabase, userId, rec.job, analysis, provider.name, provider.model);
        rec.analysis = analysis;
        rec.cached = true;
        analyzedCount++;
      }
    }
  }

  // 7. Apply min match score filter (after analysis)
  if (f.minMatchScore > 0) {
    recommendations = recommendations.filter(
      (r) => !r.analysis || r.analysis.match_score >= f.minMatchScore
    );
  }

  // 8. Rank
  recommendations = rankJobs(recommendations, f.sortBy);

  return {
    profileReady,
    jobsAvailable,
    apiConfigured: isJobsApiConfigured(),
    recommendations,
    analyzedCount,
    totalCandidates: filteredJobs.length,
  };
}

// ---------------------------------------------------------------------------
// analyzeJobMatchAction — analyze a single job on demand (user clicks "Analyze Match")
// ---------------------------------------------------------------------------

export async function analyzeJobMatchAction(
  job: NormalizedJobResult
): Promise<JobMatchActionResult> {
  let supabase;
  let userId: string | null = null;
  try {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database." };
  }
  if (!userId) return { error: "Not authenticated." };

  // Check cache first
  const cache = await getCachedAnalyses(supabase, userId);
  const cached = cache.get(jobCacheKey(job));
  if (cached) return { analysis: cached };

  // Get profile + resume for analysis
  const { profile, primaryResume } = await getCandidateProfile(supabase, userId);
  const provider = getAIProvider();
  if (!provider) return { error: "AI provider not connected. Match analysis requires an AI API key to be configured." };

  const analysis = await jobMatchAnalysis(profile, primaryResume, job);
  if (!analysis) return { error: "Match analysis failed. Please try again." };

  await cacheAnalysis(supabase, userId, job, analysis, provider.name, provider.model);
  return { analysis };
}
