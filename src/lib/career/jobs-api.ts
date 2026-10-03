// Jobs API abstraction — provider-agnostic interface for external job search APIs.
// A concrete provider adapter implements JobsProvider and is registered in the
// registry below. The UI calls searchJobs() which delegates to the active provider.
// When no provider is configured, searchJobs returns an empty list (UI shows the
// API-not-connected state).

import type { JobSearchRequest, NormalizedJobResult } from "./types";

export interface JobsProvider {
  readonly name: string;
  search(req: JobSearchRequest): Promise<NormalizedJobResult[]>;
}

// ---------------------------------------------------------------------------
// Registry — add provider adapters here when external APIs are connected.
// ---------------------------------------------------------------------------

const providers: Record<string, JobsProvider> = {};

export function registerJobsProvider(name: string, provider: JobsProvider) {
  providers[name] = provider;
}

export function getActiveProviderName(): string | null {
  const configured = process.env.JOBS_API_PROVIDER;
  if (configured && providers[configured]) return configured;
  return Object.keys(providers).length > 0 ? Object.keys(providers)[0] : null;
}

export async function searchJobs(
  req: JobSearchRequest
): Promise<{ results: NormalizedJobResult[]; provider: string | null }> {
  const providerName = getActiveProviderName();
  if (!providerName) {
    return { results: [], provider: null };
  }
  const provider = providers[providerName];
  const results = await provider.search(req);
  return { results, provider: provider.name };
}

export function isJobsApiConfigured(): boolean {
  return getActiveProviderName() !== null;
}
