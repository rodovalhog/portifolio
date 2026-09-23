import { AIProvider, AIProviderResponse } from "./types";
import { callGeminiWithTools } from "./gemini-client";

export class LiveLLMProvider implements AIProvider {
  public name = "Google Gemini Cloud (MCP Tool Calling)";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-3.8-flash") {
    this.apiKey = apiKey;
    this.model = model;
  }

  public async processQuery(
    query: string,
    currentContext?: Record<string, unknown>
  ): Promise<AIProviderResponse> {
    if (this.apiKey) {
      return await callGeminiWithTools(this.apiKey, query, this.model);
    }

    // Backend route fallback (uses GEMINI_API_KEY in server environment if present)
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query, model: this.model }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      message: data.message,
      suggestedResource: data.suggestedResource,
      toolCalls: data.toolCalls || [],
    };
  }
}
