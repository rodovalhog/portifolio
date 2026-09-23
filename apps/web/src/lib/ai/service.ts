import { AIProvider, AIProviderResponse } from "./types";
import { HeuristicPortfolioProvider } from "./heuristic-provider";

export class AIService {
  private provider: AIProvider;

  constructor() {
    this.provider = new HeuristicPortfolioProvider();
  }

  public setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async processQuery(
    query: string,
    currentContext?: Record<string, unknown>
  ): Promise<AIProviderResponse> {
    try {
      return await this.provider.processQuery(query, currentContext);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[AIService] Falha no provedor ${this.provider.name} (${errorMsg}), acionando Agente Heurístico:`, err);
      const fallback = new HeuristicPortfolioProvider();
      const res = await fallback.processQuery(query, currentContext);
      return {
        ...res,
        message: `*(Aviso: Falha no provedor externo [${errorMsg}]. Resposta gerada via Agente Heurístico)*\n\n${res.message}`,
      };
    }
  }
}

export const aiService = new AIService();
