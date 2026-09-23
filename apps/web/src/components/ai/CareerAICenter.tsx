"use client";

import React, { useState } from "react";
import { useAI } from "@/context/AIContext";
import {
  Sparkles,
  Bot,
  Layers,
  Cpu,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Play,
  RotateCw,
  Terminal,
} from "lucide-react";
import { PORTFOLIO_SEMANTIC_RESOURCES, scanSemanticDOM } from "@/lib/mcp/scanner";
import { highlightMCPResource } from "@/lib/mcp/highlighter";
import { AutoApplyHub } from "../auto-apply/AutoApplyHub";

export const CareerAICenter: React.FC<{ lang: string }> = ({ lang }) => {
  const {
    activeModel,
    setActiveModel,
    nanoStatus,
    refreshNanoStatus,
    toggleChat,
    sendMessage,
    executeNavigation,
  } = useAI();

  const [activeTab, setActiveTab] = useState<"nano" | "webmcp" | "cases" | "auto-apply">("auto-apply");
  const [selectedResourceId, setSelectedResourceId] = useState<string>("casas-bahia-staff");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const isPt = lang === "pt-BR";
  const resources = Object.values(PORTFOLIO_SEMANTIC_RESOURCES);

  const handleTestHighlight = (resId: string, target?: string) => {
    setActionFeedback(`Executando WebMCP: highlightMCPResource("${resId}")`);
    highlightMCPResource(resId);
    if (target && target.startsWith("/")) {
      executeNavigation(target, resId);
    }
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleAskCase = (casePrompt: string) => {
    toggleChat();
    sendMessage(casePrompt);
  };

  return (
    <div className="space-y-10">
      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex border-b border-zinc-800 pb-3 gap-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("auto-apply")}
          id="tab-auto-apply"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === "auto-apply"
              ? "bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI Auto Apply</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
            NEW
          </span>
        </button>

        <button
          onClick={() => setActiveTab("nano")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === "nano"
              ? "bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Chrome Built-in AI (Gemini Nano)</span>
        </button>

        <button
          onClick={() => setActiveTab("webmcp")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === "webmcp"
              ? "bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>WebMCP Semantic Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab("cases")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === "cases"
              ? "bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>Ask My Career & Cases</span>
        </button>
      </div>

      {/* TAB 1: Gemini Nano Console */}
      {activeTab === "nano" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>On-Device AI Engine Status</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {isPt
                    ? "Detecção em tempo real da Prompt API (window.ai / window.LanguageModel) no seu navegador."
                    : "Real-time detection of Chrome Prompt API (window.ai / window.LanguageModel) in your browser."}
                </p>
              </div>

              <button
                onClick={refreshNanoStatus}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition"
              >
                <RotateCw className="w-3 h-3" />
                <span>{isPt ? "Re-verificar" : "Re-check"}</span>
              </button>
            </div>

            {/* Status Card */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                nanoStatus?.status === "available"
                  ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  : nanoStatus?.status === "downloadable"
                  ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                  : "bg-zinc-950 border-zinc-800 text-zinc-300"
              }`}
            >
              {nanoStatus?.status === "available" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-semibold text-xs flex items-center gap-2">
                  <span>
                    {nanoStatus?.status === "available"
                      ? isPt
                        ? "Gemini Nano está Pronto para Inferência On-Device"
                        : "Gemini Nano is Ready for On-Device Inference"
                      : nanoStatus?.status === "downloadable"
                      ? isPt
                        ? "Download do Modelo Suportado pelo Chrome"
                        : "Model Download Supported by Chrome"
                      : isPt
                        ? "Prompt API Não Habilitada Neste Navegador"
                        : "Prompt API Not Detected In This Browser"}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                    raw: {nanoStatus?.rawStatus || "checking"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {nanoStatus?.message ||
                    (isPt
                      ? "Verificando se o Chrome suporta o modelo on-device..."
                      : "Checking Chrome on-device model support...")}
                </p>
              </div>
            </div>

            {/* How to activate instruction */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
              <span className="font-semibold text-zinc-300">
                {isPt ? "Como ativar o Gemini Nano no Chrome:" : "How to activate Gemini Nano in Chrome:"}
              </span>
              <ol className="list-decimal pl-5 space-y-1.5 text-zinc-400">
                <li>
                  {isPt ? "Abra o Google Chrome 131+ ou Chrome Canary." : "Open Google Chrome 131+ or Chrome Canary."}
                </li>
                <li>
                  {isPt ? "Acesse " : "Navigate to "}
                  <code className="text-emerald-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">
                    chrome://flags/#prompt-api-for-gemini-nano
                  </code>
                </li>
                <li>
                  {isPt
                    ? "Defina como 'Enabled' e reinicie o navegador."
                    : "Set to 'Enabled' and restart the browser."}
                </li>
                <li>
                  {isPt
                    ? "Acesse chrome://components e garanta que 'Optimization Guide On Device Model' esteja atualizado."
                    : "Visit chrome://components and check that 'Optimization Guide On Device Model' is updated."}
                </li>
              </ol>
            </div>
          </div>

          {/* Quick Trigger Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                <Sparkles className="w-3 h-3" />
                <span>INTERACTIVE ASSISTANT</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-100">
                {isPt ? "Experimente o AI Navigator" : "Experience AI Navigator"}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isPt
                  ? "Nosso orquestrador alterna com fluidez entre Gemini Nano (on-device), Gemini Cloud e o Agente Heurístico para garantir que nenhuma consulta fique sem resposta."
                  : "Our orchestrator seamlessly falls back between on-device Gemini Nano, Gemini Cloud, and the Heuristic Agent ensuring zero dead ends."}
              </p>
            </div>

            <button
              onClick={toggleChat}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition group"
            >
              <span>{isPt ? "Abrir AI Navigator Chat" : "Open AI Navigator Chat"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: WebMCP Semantic Explorer */}
      {activeTab === "webmcp" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>WebMCP Semantic DOM Catalog ({resources.length} recursos mapeados)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {isPt
                  ? "Recursos mapeados declarativamente via data-mcp-*. Clique em 'Destacar' para testar o visual pulse highlighter no DOM."
                  : "Declaratively mapped resources via data-mcp-*. Click 'Highlight' to test visual pulse highlighting."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                      {res.resource}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      action: {res.action}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-zinc-200 mb-1">
                    {res.id}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[140px]">
                    {res.target || "#dom"}
                  </span>
                  <button
                    onClick={() => handleTestHighlight(res.id, res.target)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-emerald-950 hover:text-emerald-300 border border-zinc-800 hover:border-emerald-800/50 text-[11px] text-zinc-300 font-medium transition"
                  >
                    <Play className="w-2.5 h-2.5" />
                    <span>{isPt ? "Destacar" : "Highlight"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Ask My Career & Cases */}
      {activeTab === "cases" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>{isPt ? "Casos de Engenharia Prontos para Teste" : "Ready-to-Test Engineering Cases"}</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isPt
                ? "Clique em qualquer pergunta abaixo para abrir o AI Navigator e ver o agente responder com dados verificados e navegar autonomamente pela aplicação:"
                : "Click any query below to launch AI Navigator and watch the agent answer with verified data and autonomously navigate:"}
            </p>

            <div className="space-y-2.5">
              {[
                "Como você reduziu o LCP nas Casas Bahia de 4.2s para 1.4s?",
                "Qual foi a estratégia de Server Components e Edge Streaming?",
                "Como sustentou 150k requisições/minuto na Black Friday?",
                "Quais os princípios fundamentais da sua Clean Architecture?",
                "Mostre os projetos que implementam WebMCP e IA",
                "Baixar o currículo oficial em PDF",
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskCase(query)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/40 text-xs text-zinc-300 hover:text-zinc-100 flex items-center justify-between group transition"
                >
                  <span className="leading-snug">{query}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isPt ? "Garantias Técnicas e Governança" : "Technical Guarantees & Governance"}</span>
              </h3>
              <ul className="space-y-3 text-xs text-zinc-400">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-zinc-200">Zero Alucinação:</strong> Respostas estritamente fundamentadas no modelo de domínio de perfil verificado.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-zinc-200">Contrato Semântico Declarativo:</strong> O agente interage com o DOM por atributos padronizados, sem seletores frágeis ou screen scraping.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-zinc-200">Privacidade On-Device:</strong> O Gemini Nano roda inteiramente na máquina do visitante, sem trafegar dados confidenciais por servidores terceiros.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>TypeScript + Zod + WebMCP</span>
              <span className="text-emerald-400 font-semibold">100% Type-Safe</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AI Job Application (Auto Apply) */}
      {activeTab === "auto-apply" && <AutoApplyHub lang={lang} />}
    </div>
  );
};
