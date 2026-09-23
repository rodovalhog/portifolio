"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAI } from "@/context/AIContext";
import {
  Sparkles,
  X,
  Send,
  Bot,
  Key,
  HelpCircle,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Check,
  Copy,
  ExternalLink,
  Sliders,
  Compass,
} from "lucide-react";

export const ChatWidget: React.FC = () => {
  const {
    isOpen,
    toggleChat,
    messages,
    isLoading,
    sendMessage,
    clearHistory,
    activeModel,
    setActiveModel,
    apiKey,
    setApiKey,
    autoPilot,
    setAutoPilot,
    actionNotification,
    testConnection,
    nanoStatus,
    refreshNanoStatus,
  } = useAI();

  const [input, setInput] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<"nano" | "webmcp" | "cloud">("nano");
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Ver performance em tempo real",
    "Aumentar tamanho da fonte",
    "Como reduziu o LCP nas Casas Bahia?",
    "Mostre os projetos de IA e WebMCP",
    "Quais são as principais competências?",
    "Baixar currículo em PDF",
    "Mudar idioma para inglês",
    "Qual a filosofia de Clean Architecture?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testConnection(activeModel, apiKey);
      setTestResult(res);
    } catch {
      setTestResult({ success: false, message: "Erro de comunicação ao testar conexão." });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      {/* Floating Action Banner when WebMCP is autonomously navigating */}
      {actionNotification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-mono font-semibold shadow-2xl flex items-center gap-2.5 border border-emerald-400/30 animate-bounce">
          <Bot className="w-4 h-4 text-emerald-200 animate-spin" />
          <span>{actionNotification}</span>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        id="btn-mcp-chat-trigger"
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 rounded-full shadow-2xl hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-200 border border-zinc-700/80 backdrop-blur-md group"
        aria-label="Abrir assistente semântico WebMCP"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="text-left pr-1">
          <div className="font-bold text-xs tracking-wide text-zinc-100 flex items-center gap-1.5">
            <span>AI Navigator</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              WebMCP
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
            <span>
              {activeModel === "nano"
                ? "✨ Gemini Nano"
                : activeModel === "gemini"
                ? "⚡ Gemini Cloud"
                : "🤖 Heurístico"}
            </span>
            <span>•</span>
            <span className={autoPilot ? "text-emerald-400" : "text-zinc-500"}>
              {autoPilot ? "Auto" : "Manual"}
            </span>
          </div>
        </div>
      </button>

      {/* Floating Chat Drawer / Panel */}
      {isOpen && (
        <div
          id="mcp-chat-panel"
          className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[460px] h-[640px] max-h-[82vh] z-50 glass-panel rounded-2xl flex flex-col overflow-hidden border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shadow-inner">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-zinc-100">AI Navigator & WebMCP</h3>
                  <button
                    onClick={() => {
                      setShowConfig(!showConfig);
                      if (showGuide) setShowGuide(false);
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center gap-1 transition"
                    title="Configurações de IA e Auto-Pilot"
                  >
                    <span>
                      {activeModel === "nano"
                        ? "Gemini Nano"
                        : activeModel === "gemini"
                        ? "Gemini Cloud"
                        : "Heurístico"}
                    </span>
                    <Sliders className="w-2.5 h-2.5" />
                  </button>

                  <button
                    onClick={() => {
                      setShowGuide(!showGuide);
                      if (showConfig) setShowConfig(false);
                    }}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border flex items-center gap-1 transition ${
                      showGuide
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/50"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800"
                    }`}
                    title="Guia WebMCP & Gemini Nano"
                  >
                    <HelpCircle className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Guia</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Guilherme Rodovalho</span>
                  </span>
                  <span>•</span>
                  <span className={autoPilot ? "text-emerald-400" : "text-zinc-500"}>
                    {autoPilot ? "🤖 Modo Autônomo" : "Modo Manual"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 rounded-md transition"
                title="Limpar histórico"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition"
                aria-label="Fechar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Configuration Dropdown Modal */}
          {showConfig && (
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/95 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Provedor de Inteligência Artificial</span>
                </span>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-[11px]"
                >
                  Fechar
                </button>
              </div>

              {/* Provider Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setActiveModel("heuristic")}
                  className={`py-1.5 px-2 rounded-md font-medium text-center transition ${
                    activeModel === "heuristic"
                      ? "bg-zinc-800 text-emerald-400 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Heurístico
                </button>
                <button
                  onClick={() => {
                    setActiveModel("nano");
                    refreshNanoStatus();
                  }}
                  className={`py-1.5 px-2 rounded-md font-medium text-center transition ${
                    activeModel === "nano"
                      ? "bg-zinc-800 text-emerald-400 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Gemini Nano
                </button>
                <button
                  onClick={() => setActiveModel("gemini")}
                  className={`py-1.5 px-2 rounded-md font-medium text-center transition ${
                    activeModel === "gemini"
                      ? "bg-zinc-800 text-emerald-400 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Gemini Cloud
                </button>
              </div>

              {/* Nano Status Description */}
              {activeModel === "nano" && (
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-zinc-300">Status Chrome Built-in AI:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        nanoStatus?.status === "available"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : nanoStatus?.status === "downloadable"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {nanoStatus?.status === "available"
                        ? "Ativo On-Device"
                        : nanoStatus?.status === "downloadable"
                        ? "Download Pendente"
                        : "Indisponível"}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {nanoStatus?.message || "Verificando compatibilidade da API Prompt do Chrome..."}
                  </p>
                  <button
                    onClick={refreshNanoStatus}
                    className="text-emerald-400 hover:underline text-[11px] font-mono"
                  >
                    ↻ Re-verificar status
                  </button>
                </div>
              )}

              {/* Gemini Cloud API Key Input */}
              {activeModel === "gemini" && (
                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-emerald-400" />
                    <span>Google Gemini API Key</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy... (ou deixe vazio se usar .env.local)"
                      className="flex-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                    />
                    <button
                      onClick={handleTestKey}
                      disabled={isTesting}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs font-medium disabled:opacity-50 transition"
                    >
                      {isTesting ? "Testando..." : "Validar"}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Dica: Você pode definir <code className="text-zinc-400 bg-zinc-900 px-1 py-0.5 rounded">GEMINI_API_KEY</code> no <code className="text-zinc-400 bg-zinc-900 px-1 py-0.5 rounded">.env.local</code> do servidor para não precisar digitar aqui.
                  </p>
                  {testResult && (
                    <div
                      className={`p-2 rounded text-[11px] flex items-center gap-1.5 ${
                        testResult.success
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800"
                          : "bg-red-950/60 text-red-300 border border-red-800"
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Heuristic Description */}
              {activeModel === "heuristic" && (
                <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                  O modo **Heurístico** opera 100% no cliente sem chaves de API. Ele responde estritamente com base nos dados verificados de arquitetura e dispara ações WebMCP reais no DOM.
                </p>
              )}

              {/* AutoPilot Toggle */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-zinc-200 font-medium">Navegação Autônoma (Auto-Pilot)</div>
                  <div className="text-[10px] text-zinc-500">
                    Executa scroll, navegação e download automaticamente
                  </div>
                </div>
                <button
                  onClick={() => setAutoPilot(!autoPilot)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                    autoPilot ? "bg-emerald-600 justify-end" : "bg-zinc-700 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>
          )}

          {/* Guide Modal */}
          {showGuide && (
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/95 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Como Habilitar e Usar o WebMCP</span>
                </span>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-[11px]"
                >
                  Fechar
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-zinc-800 pb-2">
                <button
                  onClick={() => setGuideTab("nano")}
                  className={`pb-1 text-xs transition ${
                    guideTab === "nano" ? "text-emerald-400 border-b-2 border-emerald-400 font-semibold" : "text-zinc-400"
                  }`}
                >
                  Gemini Nano (Chrome)
                </button>
                <button
                  onClick={() => setGuideTab("webmcp")}
                  className={`pb-1 text-xs transition ${
                    guideTab === "webmcp" ? "text-emerald-400 border-b-2 border-emerald-400 font-semibold" : "text-zinc-400"
                  }`}
                >
                  WebMCP Protocol
                </button>
              </div>

              {guideTab === "nano" ? (
                <div className="space-y-2 text-[11px] text-zinc-300 leading-relaxed">
                  <p>
                    O <strong>Gemini Nano</strong> roda nativamente no navegador através da <strong>Chrome Prompt API</strong> (sem chaves de API, com zero custo e 100% de privacidade).
                  </p>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="font-mono text-zinc-400">1. Abra no Chrome 131+:</div>
                    <div className="flex items-center justify-between bg-zinc-900 px-2 py-1 rounded font-mono text-[10px] text-emerald-400">
                      <span>chrome://flags/#prompt-api-for-gemini-nano</span>
                      <button
                        onClick={() => handleCopy("chrome://flags/#prompt-api-for-gemini-nano")}
                        className="text-zinc-400 hover:text-white"
                      >
                        {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="font-mono text-zinc-400 pt-1">2. Marque como <strong>Enabled</strong> e reinicie o Chrome.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-[11px] text-zinc-300 leading-relaxed">
                  <p>
                    O <strong>WebMCP (Web Model Context Protocol)</strong> transforma a aplicação em um ambiente navegável por agentes de IA.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                    <li>Componentes do DOM expõem <code>data-mcp-*</code> declarativos.</li>
                    <li>O servidor WebMCP expõe ferramentas tipadas com validação Zod.</li>
                    <li>A IA pesquisa rotas, rola a tela e destaca recursos com pulsos visuais.</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-600 text-white font-medium rounded-tr-none shadow-md"
                      : "bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-line text-[11.5px]">{m.content}</div>

                  {/* Render Tool Calls if present */}
                  {m.toolCalls && m.toolCalls.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800/80 space-y-1.5">
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                        <Layers className="w-3 h-3" />
                        <span>Ações WebMCP Executadas:</span>
                      </div>
                      {m.toolCalls.map((tc, idx) => (
                        <div
                          key={idx}
                          className="px-2 py-1 rounded bg-zinc-950/80 border border-zinc-800 text-[10px] font-mono text-zinc-300 flex items-center justify-between"
                        >
                          <span className="text-emerald-400">{tc.name}</span>
                          <span className="text-zinc-500 truncate max-w-[180px]">
                            {JSON.stringify(tc.input)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-zinc-600 mt-1 px-1">
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-2">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Processando comando e consultando WebMCP...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 border-t border-zinc-800/60 bg-zinc-950/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-emerald-500/50 hover:text-emerald-300 transition whitespace-nowrap disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre arquitetura ou peça para navegar..."
              disabled={isLoading}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl disabled:opacity-40 disabled:hover:bg-emerald-600 transition shadow-sm"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
