export interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
}

export interface AIProviderResponse {
  message: string;
  suggestedResource?: string;
  resourceContext?: Record<string, unknown>;
  toolCalls?: ToolCall[];
}

export interface AIProvider {
  name: string;
  processQuery(
    query: string,
    currentContext?: Record<string, unknown>
  ): Promise<AIProviderResponse>;
}
