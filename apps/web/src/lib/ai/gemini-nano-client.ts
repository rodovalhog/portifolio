import { AIProvider, AIProviderResponse } from "./types";
import {
  checkGeminiNanoAvailability,
  createGeminiNanoSession,
  GeminiNanoSession,
} from "./gemini-nano";
import { webMcpClient } from "../mcp/client";

export class GeminiNanoProvider implements AIProvider {
  public name = "Google Gemini Nano (Chrome On-Device AI)";
  private session: GeminiNanoSession | null = null;

  private async getSession(): Promise<GeminiNanoSession> {
    if (this.session) {
      return this.session;
    }

    this.session = await createGeminiNanoSession({
      outputLanguage: "pt",
      temperature: 0.2,
      topK: 3,
    });

    return this.session;
  }

  public async processQuery(
    query: string,
    currentContext?: Record<string, unknown>
  ): Promise<AIProviderResponse> {
    const availability = await checkGeminiNanoAvailability("pt");

    if (availability.status !== "available") {
      if (availability.status === "downloadable") {
        return {
          message:
            "⚡ **[Gemini Nano Local]** O modelo Chrome Built-in AI ainda precisa ser baixado pelo navegador (~1.5GB) para responder on-device. Você pode acompanhar em `/career` ou usar o modo Heurístico/Gemini Cloud enquanto isso.",
          suggestedResource: "career",
          toolCalls: [
            {
              name: "navigate_to_resource",
              input: { resourceId: "career" },
              output: { status: "download_required" },
            },
          ],
        };
      }

      if (availability.status === "downloading") {
        return {
          message:
            "⚡ **[Gemini Nano Local]** O modelo está sendo baixado em segundo plano pelo Chrome. Aguarde a conclusão do download.",
          suggestedResource: "career",
          toolCalls: [],
        };
      }

      return {
        message:
          "ℹ️ **[Gemini Nano Local]** A API nativa do Chrome não foi detectada neste navegador. Para habilitar: acesse `chrome://flags/#prompt-api-for-gemini-nano` no Chrome 131+ ou use o Gemini Cloud / Agente Heurístico.",
        toolCalls: [],
      };
    }

    try {
      const session = await this.getSession();

      const systemPrompt = `Você é o AI Navigator & Career Assistant no portfólio oficial de Guilherme Rodovalho (Staff Software Engineer / Tech Lead).
Você tem acesso às ferramentas WebMCP no navegador:
- navigate_to_resource(resourceId: string): Navega para uma seção ou página. Valores válidos: "home", "experience", "casas-bahia-staff", "projects", "skills", "resume", "about", "contact", "career".
- download_resume(language: "pt-BR" | "en-US"): Dispara o download oficial do currículo em PDF.
- switch_language(locale: "pt-BR" | "en-US"): Alterna o idioma do site entre pt-BR e en-US.
- adjust_font_size(action: "increase" | "decrease" | "reset"): Ajusta ou restaura o tamanho da fonte.

Instruções fundamentais:
1. Responda de forma sucinta, técnica e profissional.
2. Destaque os fatos reais: Casas Bahia (Staff Engineer, 150k rpm, redução de 66% no LCP de 4.2s para 1.4s, INP < 80ms, Server Components), Clean Architecture, Next.js, Micro Frontends.
3. Se a pergunta solicitar navegação ou ação, inclua no final exatamente um bloco de comando JSON:
ACTION: {"tool": "navigate_to_resource", "resourceId": "..."} ou ACTION: {"tool": "download_resume", "language": "pt-BR"} ou ACTION: {"tool": "adjust_font_size", "action": "increase"}`;

      const fullPrompt = `${systemPrompt}\n\nUsuário: ${query}\nAssistente:`;
      const responseText = await session.prompt(fullPrompt);

      // Check if action was requested
      const actionMatch = responseText.match(/ACTION:\s*(\{.*?\})/);
      let cleanMessage = responseText.replace(/ACTION:\s*\{.*?\}/g, "").trim();
      const toolCalls: AIProviderResponse["toolCalls"] = [];
      let suggestedResource: string | undefined;

      if (actionMatch) {
        try {
          const actionData = JSON.parse(actionMatch[1]);
          if (actionData.tool === "navigate_to_resource" && actionData.resourceId) {
            suggestedResource = actionData.resourceId;
            const navResult = await webMcpClient.navigateToResource(actionData.resourceId);
            toolCalls.push({
              name: "navigate_to_resource",
              input: { resourceId: actionData.resourceId },
              output: navResult,
            });
          } else if (actionData.tool === "download_resume") {
            suggestedResource = "resume-download";
            const dlResult = await webMcpClient.downloadResume(actionData.language);
            toolCalls.push({
              name: "download_resume",
              input: { language: actionData.language },
              output: dlResult,
            });
          } else if (actionData.tool === "switch_language") {
            const swResult = await webMcpClient.switchLanguage(actionData.locale);
            toolCalls.push({
              name: "switch_language",
              input: { locale: actionData.locale },
              output: swResult,
            });
          } else if (actionData.tool === "adjust_font_size") {
            const fontResult = await webMcpClient.adjustFontSize(actionData.action || "increase");
            toolCalls.push({
              name: "adjust_font_size",
              input: { action: actionData.action || "increase" },
              output: fontResult,
            });
          }
        } catch (e) {
          console.warn("[Gemini Nano] Falha ao decodificar ACTION JSON:", e);
        }
      }

      return {
        message: cleanMessage || responseText,
        suggestedResource,
        toolCalls,
      };
    } catch (err) {
      console.error("[Gemini Nano] Erro de inferência local:", err);
      // Reset session in case of corrupted context
      this.session = null;
      return {
        message: `Houve um erro na execução do Gemini Nano on-device: ${err instanceof Error ? err.message : String(err)}. Alternando para modo seguro.`,
        toolCalls: [],
      };
    }
  }
}
