// AI provider abstraction — provider-agnostic interface for LLM chat completions.
// A concrete provider adapter implements AIProvider and is registered in the
// registry below. The Career Assistant calls getAIProvider() which delegates to
// the active provider. When no provider is configured, callers receive null and
// can surface a graceful "not connected" state.
//
// This follows the same registry pattern as src/lib/career/jobs-api.ts.

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionResponse {
  content: string;
  provider: string;
  model: string;
}

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  complete(req: AICompletionRequest): Promise<AICompletionResponse>;
}

// ---------------------------------------------------------------------------
// Registry — add provider adapters here when external APIs are connected.
// ---------------------------------------------------------------------------

const providers: Record<string, AIProvider> = {};

export function registerAIProvider(name: string, provider: AIProvider) {
  providers[name] = provider;
}

export function getActiveAIProviderName(): string | null {
  const configured = process.env.AI_PROVIDER;
  if (configured && providers[configured]) return configured;
  return Object.keys(providers).length > 0 ? Object.keys(providers)[0] : null;
}

export function getAIProvider(): AIProvider | null {
  const name = getActiveAIProviderName();
  if (!name) return null;
  return providers[name];
}

export function isAIConfigured(): boolean {
  return getActiveAIProviderName() !== null;
}
