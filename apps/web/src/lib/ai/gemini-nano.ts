/**
 * Gemini Nano / Chrome Built-in AI Client Module
 *
 * Provides direct, client-side access to Chrome's native Prompt API (LanguageModel).
 * Operates 100% locally on-device with zero API keys, zero network latency,
 * and complete privacy.
 */

export type GeminiNanoAvailabilityStatus =
  | "unavailable"
  | "downloadable"
  | "downloading"
  | "available";

export interface GeminiNanoAvailabilityResult {
  status: GeminiNanoAvailabilityStatus;
  rawStatus: string;
  supportedLanguages: string[];
  outputLanguage: string;
  message: string;
}

export interface GeminiNanoSessionOptions {
  outputLanguage?: string;
  temperature?: number;
  topK?: number;
  signal?: AbortSignal;
  onDownloadProgress?: (loadedBytes: number, totalBytes: number, percent: number) => void;
}

export interface GeminiNanoSession {
  prompt(text: string): Promise<string>;
  promptStreaming?(text: string): AsyncIterable<string>;
  destroy(): void;
  maxTokens?: number;
  tokensLeft?: number;
  tokensSoFar?: number;
}

interface ChromeLanguageModelMonitor {
  addEventListener(
    type: "downloadprogress",
    listener: (e: { loaded: number; total: number }) => void
  ): void;
}

interface ChromeLanguageModelStatic {
  availability(options?: {
    outputLanguage?: string;
    expectedOutputs?: Array<{ type: string; languages: string[] }>;
  }): Promise<string>;
  create(options?: {
    outputLanguage?: string;
    expectedOutputs?: Array<{ type: string; languages: string[] }>;
    temperature?: number;
    topK?: number;
    signal?: AbortSignal;
    monitor?: (m: ChromeLanguageModelMonitor) => void;
  }): Promise<GeminiNanoSession>;
}

declare global {
  interface Window {
    LanguageModel?: ChromeLanguageModelStatic;
    ai?: {
      languageModel?: ChromeLanguageModelStatic;
      assistant?: ChromeLanguageModelStatic;
    };
  }
}

/**
 * Safely resolves the LanguageModel constructor in browser environment.
 * Supports modern WICG standards and fallbacks.
 */
export function getLanguageModelAPI(): ChromeLanguageModelStatic | null {
  if (typeof window === "undefined") {
    return null;
  }

  const win = window;

  // 1. Modern WICG standard: window.LanguageModel
  if (typeof win.LanguageModel !== "undefined" && typeof win.LanguageModel.availability === "function") {
    return win.LanguageModel;
  }

  // 2. Global scope check
  const globalRef = globalThis as unknown as { LanguageModel?: ChromeLanguageModelStatic };
  if (typeof globalRef.LanguageModel !== "undefined" && typeof globalRef.LanguageModel.availability === "function") {
    return globalRef.LanguageModel;
  }

  // 3. Fallback: window.ai.languageModel
  if (win.ai?.languageModel && typeof (win.ai.languageModel as unknown as ChromeLanguageModelStatic).availability === "function") {
    return win.ai.languageModel as unknown as ChromeLanguageModelStatic;
  }

  // 4. Legacy fallback: window.ai.assistant
  if (win.ai?.assistant && typeof (win.ai.assistant as unknown as ChromeLanguageModelStatic).availability === "function") {
    return win.ai.assistant as unknown as ChromeLanguageModelStatic;
  }

  return null;
}

/**
 * Checks whether Google Chrome's built-in Gemini Nano Prompt API is available in this browser.
 */
export async function checkGeminiNanoAvailability(
  outputLanguage: string = "pt"
): Promise<GeminiNanoAvailabilityResult> {
  const supportedLanguages = ["pt", "en", "es", "ja"];

  if (typeof window === "undefined") {
    return {
      status: "unavailable",
      rawStatus: "ssr",
      supportedLanguages,
      outputLanguage,
      message: "Execução fora do navegador (SSR).",
    };
  }

  const api = getLanguageModelAPI();
  if (!api) {
    return {
      status: "unavailable",
      rawStatus: "not_supported",
      supportedLanguages,
      outputLanguage,
      message:
        "Chrome Built-in AI não detectado. Habilite 'chrome://flags/#prompt-api-for-gemini-nano' no Google Chrome.",
    };
  }

  try {
    const raw = await api.availability({ outputLanguage });
    const normalized = raw.toLowerCase().trim();

    if (normalized === "readily" || normalized === "available" || normalized === "ready") {
      return {
        status: "available",
        rawStatus: raw,
        supportedLanguages,
        outputLanguage,
        message: "Gemini Nano está ativo e pronto para inferência on-device no Chrome!",
      };
    }

    if (normalized === "after-download" || normalized === "downloadable") {
      return {
        status: "downloadable",
        rawStatus: raw,
        supportedLanguages,
        outputLanguage,
        message: "Suportado pelo hardware! O modelo Gemini Nano precisa ser baixado pelo Chrome (~1.5GB).",
      };
    }

    if (normalized === "downloading") {
      return {
        status: "downloading",
        rawStatus: raw,
        supportedLanguages,
        outputLanguage,
        message: "O modelo Gemini Nano está sendo baixado em segundo plano pelo Chrome.",
      };
    }

    return {
      status: "unavailable",
      rawStatus: raw,
      supportedLanguages,
      outputLanguage,
      message: `Gemini Nano indisponível no momento (${raw}).`,
    };
  } catch (err) {
    return {
      status: "unavailable",
      rawStatus: "error",
      supportedLanguages,
      outputLanguage,
      message: `Erro ao consultar disponibilidade: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Creates an active Gemini Nano session using Chrome's native API.
 */
export async function createGeminiNanoSession(
  options: GeminiNanoSessionOptions = {}
): Promise<GeminiNanoSession> {
  const api = getLanguageModelAPI();
  if (!api) {
    throw new Error(
      "Chrome Built-in AI (Gemini Nano) não está disponível neste navegador."
    );
  }

  const sessionOptions: Parameters<ChromeLanguageModelStatic["create"]>[0] = {
    outputLanguage: options.outputLanguage || "pt",
    temperature: options.temperature ?? 0.2,
    topK: options.topK ?? 3,
    signal: options.signal,
  };

  if (options.onDownloadProgress) {
    sessionOptions.monitor = (m: ChromeLanguageModelMonitor) => {
      m.addEventListener("downloadprogress", (e) => {
        const percent = e.total > 0 ? Math.round((e.loaded / e.total) * 100) : 0;
        options.onDownloadProgress?.(e.loaded, e.total, percent);
      });
    };
  }

  return await api.create(sessionOptions);
}
