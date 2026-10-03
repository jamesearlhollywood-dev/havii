// OpenAI-compatible AI provider adapter.
// Activated when OPENAI_API_KEY is present. Supports any OpenAI-compatible
// endpoint (OpenAI, Azure OpenAI, OpenRouter, local LLMs) via OPENAI_BASE_URL.
//
// No SDK dependency — uses fetch. Credentials stay server-side only.

import { registerAIProvider } from "./provider";
import type { AIProvider, AICompletionRequest, AICompletionResponse } from "./provider";

class OpenAICompatibleProvider implements AIProvider {
  readonly name: string;
  readonly model: string;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.name = process.env.AI_PROVIDER_NAME || "openai";
    this.model = process.env.OPENAI_MODEL || "gpt-4o";
    this.apiKey = process.env.OPENAI_API_KEY!;
    this.baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  }

  async complete(req: AICompletionRequest): Promise<AICompletionResponse> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: req.messages,
        temperature: req.temperature ?? 0.7,
        max_tokens: req.maxTokens ?? 2000,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`AI provider error ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    return { content, provider: this.name, model: this.model };
  }
}

// Auto-register when the key is available (server-side only).
if (process.env.OPENAI_API_KEY) {
  registerAIProvider("openai", new OpenAICompatibleProvider());
}
