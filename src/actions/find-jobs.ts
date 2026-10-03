"use server";

import { searchJobs, isJobsApiConfigured } from "@/lib/career/jobs-api";
import type { JobSearchRequest, NormalizedJobResult } from "@/lib/career/types";

export type SearchJobsResult = {
  results: NormalizedJobResult[];
  provider: string | null;
  configured: boolean;
  error?: string;
};

export async function searchJobsAction(
  req: JobSearchRequest
): Promise<SearchJobsResult> {
  try {
    const configured = isJobsApiConfigured();
    if (!configured) {
      return { results: [], provider: null, configured: false };
    }
    const { results, provider } = await searchJobs(req);
    return { results, provider, configured: true };
  } catch (e) {
    return {
      results: [],
      provider: null,
      configured: isJobsApiConfigured(),
      error: e instanceof Error ? e.message : "Search failed.",
    };
  }
}

export async function isJobsApiConfiguredAction(): Promise<boolean> {
  return isJobsApiConfigured();
}
