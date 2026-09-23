import { AIProviderResponse, ToolCall } from "./types";
import { webMcpClient } from "../mcp/client";

/**
 * Gemini tool declarations matching the WebMCP server tools
 */
export const GEMINI_MCP_TOOLS = [
  {
    function_declarations: [
      {
        name: "navigate_to_resource",
        description:
          "Executa a navegação da tela para uma seção ou página no portfólio interativo de Guilherme Rodovalho.",
        parameters: {
          type: "OBJECT",
          properties: {
            resourceId: {
              type: "STRING",
              description:
                "ID do recurso ou seção para navegar. Exemplos: 'home', 'experience', 'casas-bahia-staff', 'projects', 'skills', 'resume', 'about', 'career', 'contact'",
            },
          },
          required: ["resourceId"],
        },
      },
      {
        name: "search_resources",
        description:
          "Pesquisa recursos, páginas, cases de arquitetura ou competências no portfólio.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "Termo de busca em linguagem natural",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "download_resume",
        description: "Dispara o download oficial do currículo de Guilherme Rodovalho em formato PDF.",
        parameters: {
          type: "OBJECT",
          properties: {
            language: {
              type: "STRING",
              description: "Idioma do currículo: 'pt-BR' ou 'en-US'",
            },
          },
        },
      },
      {
        name: "switch_language",
        description: "Alterna o idioma ativo do portfólio entre Português (pt-BR) e Inglês (en-US).",
        parameters: {
          type: "OBJECT",
          properties: {
            locale: {
              type: "STRING",
              description: "Código do idioma: 'pt-BR' ou 'en-US'",
            },
          },
          required: ["locale"],
        },
      },
      {
        name: "adjust_font_size",
        description: "Ajusta ou restaura o tamanho da fonte (acessibilidade) do portfólio. Permite aumentar ('increase'), diminuir ('decrease') ou restaurar ao tamanho normal ('reset').",
        parameters: {
          type: "OBJECT",
          properties: {
            action: {
              type: "STRING",
              description: "Ação de ajuste da fonte: 'increase', 'decrease' ou 'reset'",
            },
          },
          required: ["action"],
        },
      },
    ],
  },
];

let cachedResolvedModel: string | null = null;

export async function resolveGeminiModel(apiKey: string): Promise<string> {
  if (cachedResolvedModel && cachedResolvedModel !== "gemini-2.0-flash") {
    return cachedResolvedModel;
  }

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("portfolio_gemini_model");
    if (saved && saved !== "gemini-2.0-flash" && saved !== "gemini-2.0-flash-exp") {
      cachedResolvedModel = saved;
      return saved;
    }
  }

  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`;
    const res = await fetch(listUrl);
    if (res.ok) {
      const data = await res.json();
      const models: Array<{ name: string; supportedGenerationMethods?: string[] }> = data.models || [];
      const generateModels = models
        .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m) => m.name.replace(/^models\//, ""));

      const preferred = [
        "gemini-3.8-flash",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
        "gemini-flash-latest",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
      ];

      for (const pref of preferred) {
        if (generateModels.includes(pref)) {
          cachedResolvedModel = pref;
          if (typeof window !== "undefined") {
            localStorage.setItem("portfolio_gemini_model", pref);
          }
          return pref;
        }
      }

      const anyFlash = generateModels.find((m) => m.includes("flash"));
      if (anyFlash) {
        cachedResolvedModel = anyFlash;
        return anyFlash;
      }
    }
  } catch (e) {
    console.warn("[Gemini API] Falha na descoberta de modelo, usando gemini-3.8-flash como fallback:", e);
  }

  return "gemini-3.8-flash";
}

export async function callGeminiWithTools(
  apiKey: string,
  userMessage: string,
  modelName: string = "gemini-3.8-flash"
): Promise<AIProviderResponse> {
  let effectiveModel = modelName;
  if (!effectiveModel || effectiveModel === "gemini-2.0-flash" || effectiveModel === "gemini-2.0-flash-exp") {
    effectiveModel = await resolveGeminiModel(apiKey);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${effectiveModel}:generateContent?key=${apiKey.trim()}`;

  const systemInstruction = `Você é o Assistente Oficial e AI Navigator do portfólio de engenharia de Guilherme Rodovalho (Staff Software Engineer / Tech Lead).
Seu objetivo é apresentar suas experiências, cases de arquitetura (Casas Bahia: 150k rpm, redução de 66% no LCP, Core Web Vitals, Clean Architecture), projetos e habilidades.
Sempre que o usuário pedir para ver algo, acessar uma página, rolar a tela, baixar o currículo ou mudar de idioma, utilize as ferramentas (tools) declaradas.
Seja conciso, técnico e transparente. Não invente informações além das experiências reais de Guilherme.`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    tools: GEMINI_MCP_TOOLS,
    toolConfig: {
      functionCallingConfig: {
        mode: "AUTO",
      },
    },
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  };

  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.clone().json().catch(() => ({}));
    const errText = errorBody.error?.message || "";
    if (
      errText.includes("no longer available") ||
      errText.includes("not found") ||
      errText.includes("high demand") ||
      response.status === 404 ||
      response.status === 503
    ) {
      const fallbackList = [
        "gemini-3.8-flash",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
        "gemini-flash-latest",
      ].filter((m) => m !== effectiveModel);

      for (const fallbackModel of fallbackList) {
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${apiKey.trim()}`;
        const fallbackRes = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (fallbackRes.ok) {
          response = fallbackRes;
          effectiveModel = fallbackModel;
          cachedResolvedModel = fallbackModel;
          if (typeof window !== "undefined") {
            localStorage.setItem("portfolio_gemini_model", fallbackModel);
          }
          break;
        }
      }
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `Erro da API do Gemini (HTTP ${response.status})`
    );
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (!candidate) {
    return {
      message: "Não obtive resposta do modelo.",
      toolCalls: [],
    };
  }

  const parts = candidate.content?.parts || [];
  let responseText = "";
  const toolCalls: ToolCall[] = [];
  let suggestedResource: string | undefined;

  for (const part of parts) {
    if (part.text) {
      responseText += part.text;
    }
    if (part.functionCall) {
      const { name, args } = part.functionCall;
      try {
        const result = await webMcpClient.executeTool(name, args || {});
        toolCalls.push({
          name,
          input: args || {},
          output: result,
        });

        if (name === "navigate_to_resource") {
          suggestedResource = (args?.resourceId as string) || undefined;
        }
      } catch (err) {
        toolCalls.push({
          name,
          input: args || {},
          output: { error: err instanceof Error ? err.message : String(err) },
        });
      }
    }
  }

  // If Gemini only made a tool call without textual explanation, generate a friendly confirmation
  if (!responseText.trim() && toolCalls.length > 0) {
    const firstCall = toolCalls[0];
    if (firstCall.name === "navigate_to_resource") {
      responseText = `Navegando para o recurso **${firstCall.input.resourceId}** no portfólio.`;
    } else if (firstCall.name === "download_resume") {
      responseText = "Iniciando o download do currículo oficial em PDF.";
    } else if (firstCall.name === "switch_language") {
      responseText = `Alternando idioma do portfólio para **${firstCall.input.locale}**.`;
    } else if (firstCall.name === "adjust_font_size") {
      const act = firstCall.input.action;
      responseText = act === "reset"
        ? "Tamanho da fonte restaurado para o padrão (100%) via WebMCP."
        : `Tamanho da fonte ajustado (${act}) via WebMCP para melhor acessibilidade.`;
    }
  }

  return {
    message: responseText || "Comando executado com sucesso.",
    suggestedResource,
    toolCalls,
  };
}
