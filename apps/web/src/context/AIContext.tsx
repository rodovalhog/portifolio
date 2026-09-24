"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AIChatMessage } from "@/lib/mcp/types";
import { aiService } from "@/lib/ai/service";
import { HeuristicPortfolioProvider } from "@/lib/ai/heuristic-provider";
import { LiveLLMProvider } from "@/lib/ai/llm-provider";
import {
  GeminiNanoProvider,
} from "@/lib/ai/gemini-nano-client";
import {
  checkGeminiNanoAvailability,
  GeminiNanoAvailabilityResult,
} from "@/lib/ai/gemini-nano";
import { highlightMCPResource } from "@/lib/mcp/highlighter";
import { webMcpClient } from "@/lib/mcp/client";

export type ModelType = "heuristic" | "gemini" | "nano";

interface AIContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleChat: () => void;
  messages: AIChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  executeNavigation: (targetRoute: string, resourceId?: string) => void;
  highlightResource: (resourceId: string) => void;
  clearHistory: () => void;
  activeModel: ModelType;
  setActiveModel: (model: ModelType) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  providerName: string;
  autoPilot: boolean;
  setAutoPilot: (enabled: boolean) => void;
  actionNotification: string | null;
  testConnection: (model: ModelType, key: string) => Promise<{ success: boolean; message: string }>;
  nanoStatus: GeminiNanoAvailabilityResult | null;
  refreshNanoStatus: () => Promise<GeminiNanoAvailabilityResult>;
}

const INITIAL_MESSAGES: AIChatMessage[] = [
  {
    id: "welcome-portfolio",
    sender: "assistant",
    content:
      "Olá! Eu sou o **AI Navigator** do portfólio de Guilherme Rodovalho conectado ao **Google Gemini Cloud** com suporte a **Ações Autônomas via WebMCP** e **Gemini Nano**.\n\nVocê pode me perguntar: *'Como reduziu o LCP nas Casas Bahia?'*, *'Mostre os projetos de IA'*, *'Baixar currículo em PDF'* ou *'Mudar idioma para inglês'*. Eu respondo com raciocínio avançado e **executo ações no site por você**!",
    timestamp: Date.now() - 5000,
  },
];

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModelState] = useState<ModelType>("gemini");
  const [apiKey, setApiKeyState] = useState<string>("");
  const [providerName, setProviderName] = useState<string>("Google Gemini Cloud (MCP Tool Calling)");
  const [autoPilot, setAutoPilotState] = useState<boolean>(true);
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [nanoStatus, setNanoStatus] = useState<GeminiNanoAvailabilityResult | null>(null);

  const router = useRouter();

  const refreshNanoStatus = useCallback(async () => {
    const res = await checkGeminiNanoAvailability("pt");
    setNanoStatus(res);
    return res;
  }, []);

  useEffect(() => {
    try {
      const savedModel = localStorage.getItem("portfolio_ai_model") as ModelType;
      const savedKey = localStorage.getItem("portfolio_ai_key") || "";
      const savedAutoPilot = localStorage.getItem("portfolio_ai_autopilot");

      if (savedModel) {
        setActiveModelState(savedModel);
      } else {
        setActiveModelState("gemini");
      }
      if (savedKey) setApiKeyState(savedKey);
      if (savedAutoPilot !== null) setAutoPilotState(savedAutoPilot === "true");

      refreshNanoStatus();
    } catch {
      // ignore local storage errors
    }
  }, [refreshNanoStatus]);

  // Sync provider instance when activeModel or apiKey changes
  useEffect(() => {
    if (activeModel === "nano") {
      const nano = new GeminiNanoProvider();
      aiService.setProvider(nano);
      setProviderName(nano.name);
    } else if (activeModel === "gemini") {
      const live = new LiveLLMProvider(apiKey.trim());
      aiService.setProvider(live);
      setProviderName(live.name);
    } else {
      const heuristic = new HeuristicPortfolioProvider();
      aiService.setProvider(heuristic);
      setProviderName(heuristic.name);
    }
  }, [activeModel, apiKey]);

  const setActiveModel = (model: ModelType) => {
    setActiveModelState(model);
    try {
      localStorage.setItem("portfolio_ai_model", model);
    } catch {
      // ignore
    }
  };

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    try {
      localStorage.setItem("portfolio_ai_key", key);
    } catch {
      // ignore
    }
  };

  const setAutoPilot = (enabled: boolean) => {
    setAutoPilotState(enabled);
    try {
      localStorage.setItem("portfolio_ai_autopilot", String(enabled));
    } catch {
      // ignore
    }
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  const clearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const highlightResource = (resourceId: string) => {
    highlightMCPResource(resourceId);
  };

  const executeNavigation = (targetRoute: string, resourceId?: string) => {
    if (targetRoute.startsWith("#")) {
      const el = document.querySelector(targetRoute);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        if (resourceId) highlightMCPResource(resourceId);
      }
      return;
    }

    router.push(targetRoute);
    if (resourceId) {
      setTimeout(() => {
        highlightMCPResource(resourceId);
      }, 400);
    }
  };

  const testConnection = async (
    model: ModelType,
    key: string
  ): Promise<{ success: boolean; message: string }> => {
    if (model === "nano") {
      const status = await refreshNanoStatus();
      if (status.status === "available") {
        return { success: true, message: "Gemini Nano está ativo e funcionando localmente on-device!" };
      }
      return { success: false, message: status.message };
    }

    if (model === "gemini") {
      const trimmedKey = key.trim();
      if (trimmedKey) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${trimmedKey}`
          );
          if (res.ok) {
            return { success: true, message: "Conexão com a Google Gemini API validada com sucesso!" };
          }
          const err = await res.json().catch(() => ({}));
          return { success: false, message: err.error?.message || `Erro HTTP ${res.status}` };
        } catch (e) {
          return { success: false, message: e instanceof Error ? e.message : "Erro de conexão." };
        }
      }

      // Se a chave não foi informada manualmente, verifica se o servidor possui GEMINI_API_KEY (.env.local)
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          if (data.configured) {
            return {
              success: true,
              message: "Chave GEMINI_API_KEY detectada e ativa no servidor (.env.local)!",
            };
          }
        }
        return {
          success: false,
          message: "Nenhuma chave no navegador e GEMINI_API_KEY não configurada no servidor (.env.local).",
        };
      } catch {
        return {
          success: false,
          message: "Insira uma Google Gemini API Key válida ou configure GEMINI_API_KEY no .env.local.",
        };
      }
    }

    return {
      success: true,
      message: "Portfolio Deterministic Agent está sempre ativo com latência zero e 100% de confiabilidade.",
    };
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await aiService.processQuery(content);

      // Handle autonomous action execution when autoPilot is enabled
      if (autoPilot && response.toolCalls && response.toolCalls.length > 0) {
        for (const tc of response.toolCalls) {
          if (tc.name === "navigate_to_resource") {
            const resId = (tc.input.resourceId as string) || response.suggestedResource;
            if (resId) {
              setActionNotification(`🤖 WebMCP: Navegando para ${resId}...`);
              const navResult = (tc.output as { resolvedRoute?: string }) || (await webMcpClient.navigateToResource(resId));
              if (navResult.resolvedRoute) {
                executeNavigation(navResult.resolvedRoute, resId);
              } else {
                highlightMCPResource(resId);
              }
              setTimeout(() => setActionNotification(null), 3000);
            }
          } else if (tc.name === "download_resume") {
            setActionNotification("🤖 WebMCP: Baixando currículo oficial...");
            setTimeout(() => setActionNotification(null), 3000);
          } else if (tc.name === "switch_language") {
            const targetLocale = (tc.input.locale as string) || "pt-BR";
            setActionNotification(`🤖 WebMCP: Alternando idioma para ${targetLocale}...`);
            const currentPath = window.location.pathname;
            const searchAndHash = window.location.search + window.location.hash;
            let newPath = currentPath.replace(/^\/(pt-BR|en-US)(\/|$|\?|#)/, `/${targetLocale}$2`);
            if (!newPath.startsWith(`/${targetLocale}`)) {
              newPath = `/${targetLocale}${newPath.startsWith("/") ? newPath : `/${newPath}`}`;
            }
            window.location.href = `${newPath}${searchAndHash}`;
            setTimeout(() => setActionNotification(null), 3000);
          } else if (tc.name === "adjust_font_size") {
            const action = (tc.input.action as string) || "increase";
            setActionNotification(`🤖 WebMCP: Ajustando tamanho de fonte (${action})...`);
            await webMcpClient.executeTool("adjust_font_size", { action });
            setTimeout(() => setActionNotification(null), 3000);
          }
        }
      }

      const assistantMsg: AIChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        content: response.message,
        timestamp: Date.now(),
        toolCalls: response.toolCalls,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("[AIContext] Erro ao enviar mensagem:", err);
      const errMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        content: `Ocorreu um erro no processamento: ${err instanceof Error ? err.message : String(err)}. Tente novamente ou alterne para o Agente Heurístico.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleChat,
        messages,
        isLoading,
        sendMessage,
        executeNavigation,
        highlightResource,
        clearHistory,
        activeModel,
        setActiveModel,
        apiKey,
        setApiKey,
        providerName,
        autoPilot,
        setAutoPilot,
        actionNotification,
        testConnection,
        nanoStatus,
        refreshNanoStatus,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI deve ser utilizado dentro de um AIProvider");
  }
  return context;
};
