// Compensation / salary data — provider-agnostic abstraction.
//
// Centralized compensation data service. A concrete compensation provider adapter
// implements CompensationProvider and is registered in the registry below. The
// Offers & Salary page calls getCompensationProvider() which delegates to the
// active provider. When no provider is configured, callers receive null and the
// UI surfaces a clear empty state — salary market data is NEVER fabricated.
//
// This follows the same registry pattern as src/lib/career/jobs-api.ts and
// src/lib/ai/provider.ts. API credentials stay server-side only.

import type { SalaryEstimate, SalaryResearchRequest } from "@/lib/career/types";

export interface CompensationProvider {
  readonly name: string;
  salaryEstimate(req: SalaryResearchRequest): Promise<SalaryEstimate>;
}

// ---------------------------------------------------------------------------
// Registry — add provider adapters here when a compensation / labor-market API
// is connected (e.g. Glassdoor, Levels.fyi, Pave, Salary.com, BLS).
// ---------------------------------------------------------------------------

const providers: Record<string, CompensationProvider> = {};

export function registerCompensationProvider(
  name: string,
  provider: CompensationProvider
) {
  providers[name] = provider;
}

export function getActiveCompensationProviderName(): string | null {
  const configured = process.env.COMPENSATION_PROVIDER;
  if (configured && providers[configured]) return configured;
  return Object.keys(providers).length > 0
    ? Object.keys(providers)[0]
    : null;
}

export function getCompensationProvider(): CompensationProvider | null {
  const name = getActiveCompensationProviderName();
  if (!name) return null;
  return providers[name];
}

export function isCompensationConfigured(): boolean {
  return getActiveCompensationProviderName() !== null;
}

/**
 * Run a salary estimate against the active compensation provider.
 * Returns `{ estimate: null, configured: false }` when no provider is connected —
 * the UI must surface the empty state rather than fabricating data.
 */
export async function runSalaryEstimate(
  req: SalaryResearchRequest
): Promise<{ estimate: SalaryEstimate | null; configured: boolean; error?: string }> {
  const provider = getCompensationProvider();
  if (!provider) return { estimate: null, configured: false };

  try {
    const estimate = await provider.salaryEstimate(req);
    return { estimate, configured: true };
  } catch (e) {
    return {
      estimate: null,
      configured: true,
      error: e instanceof Error ? e.message : "Compensation provider error.",
    };
  }
}
