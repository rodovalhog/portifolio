"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  X,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Send,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { useAI } from "@/context/AIContext";

interface JobMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: "pt-BR" | "en-US";
}

interface MatchResult {
  score: number;
  isRelevantJob: boolean;
  verdict: string;
  matchedSkills: string[];
  missingSkills?: string[];
  relevantCases: { title: string; metric: string }[];
  summary: string;
}

const PRESET_JOBS = [
  {
    title: { "pt-BR": "Staff Frontend Engineer", "en-US": "Staff Frontend Engineer" },
    sample:
      "Looking for a Staff Frontend Engineer with 7+ years of experience in React, Next.js, TypeScript, Micro Frontends, Core Web Vitals optimization, and high-scale consumer applications. Must have experience with system design, technical leadership, and mentoring.",
  },
  {
    title: { "pt-BR": "Software Architect / Tech Lead", "en-US": "Software Architect / Tech Lead" },
    sample:
      "Seeking a Principal Software Architect to design distributed web architectures, define standards, lead cross-functional engineering teams, and implement Clean Architecture with Node.js and Next.js for high-volume transactions.",
  },
  {
    title: { "pt-BR": "AI Engineer (Full Stack & LLMs)", "en-US": "AI Engineer (Full Stack & LLMs)" },
    sample:
      "Hiring an AI Engineer with expertise in React, Next.js, Node.js, Agentic AI, Model Context Protocol (MCP), tool-use, structured JSON outputs, and embedding on-device models with Google Gemini.",
  },
];

export const JobMatcherModal: React.FC<JobMatcherModalProps> = ({
  isOpen,
  onClose,
  locale,
}) => {
  const { toggleChat, sendMessage } = useAI();
  const [jobText, setJobText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPt = locale === "pt-BR";

  const handleAnalyze = async () => {
    if (!jobText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/job-matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobText.trim(),
          locale,
        }),
      });

      if (!res.ok) {
        throw new Error(isPt ? "Falha ao processar análise da vaga." : "Failed to analyze job posting.");
      }

      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (err) {
      console.error("[JobMatcherModal Error]:", err);
      setErrorMessage(
        isPt
          ? "Houve um problema de conexão com a IA. Tente novamente."
          : "Connection issue with AI evaluator. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const shareText = `Avaliação de Candidato - Guilherme Rodovalho:\nCompatibilidade: ${result.score}%\nDiagnóstico: ${result.verdict}\n\nResumo:\n${result.summary}\n\nHard Skills Alinhadas:\n${result.matchedSkills.map((s) => `• ${s}`).join("\n")}\n\nVer perfil completo: https://guilhermerodovalho.dev`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAskAIAssistant = () => {
    onClose();
    toggleChat();
    const prompt = isPt
      ? `Olá! Estou avaliando o Guilherme para a seguinte vaga:\n"${jobText.slice(0, 300)}..."\nQuais experiências do Guilherme comprovam que ele é o candidato ideal para este desafio?`
      : `Hi! I am evaluating Guilherme for this job opportunity:\n"${jobText.slice(0, 300)}..."\nWhat specific experiences prove he is the ideal fit for this challenge?`;
    sendMessage(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>{isPt ? "Recruiter Quick-Match (IA)" : "Recruiter Quick-Match (AI)"}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                  REAL-TIME
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isPt
                  ? "Análise rigorosa e sem alucinação: cruza requisitos reais com as hard skills do Guilherme."
                  : "Honest zero-hallucination analysis: compares real job requirements with Guilherme's verified skills."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Presets */}
          <div>
            <div className="text-xs font-mono uppercase text-zinc-500 font-semibold mb-2">
              {isPt ? "Exemplos rápidos de vagas:" : "Quick role examples:"}
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_JOBS.map((preset) => (
                <button
                  key={preset.title["en-US"]}
                  onClick={() => {
                    setJobText(preset.sample);
                    setResult(null);
                    setErrorMessage(null);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200 dark:border-zinc-800 transition-all"
                >
                  {preset.title[locale]}
                </button>
              ))}
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
              {isPt ? "Descrição ou requisitos da vaga:" : "Job description or key requirements:"}
            </label>
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder={
                isPt
                  ? "Cole aqui a descrição ou requisitos da vaga (ex: React, Next.js, Node, Arquitetura, Liderança)..."
                  : "Paste the job description or requirements here (e.g., React, Next.js, Node, Architecture, Leadership)..."
              }
              rows={4}
              className="w-full p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none font-sans"
            />

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !jobText.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isPt ? "Avaliando compatibilidade técnica com a IA..." : "Evaluating technical match with AI..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isPt ? "Analisar Compatibilidade" : "Analyze Job Match"}</span>
                </>
              )}
            </button>
          </div>

          {/* Result Card: Zero Match / Irrelevant Input */}
          {result && (!result.isRelevantJob || result.score === 0) && (
            <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-600 dark:text-red-400 font-mono font-bold text-lg">
                    0%
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-red-600 dark:text-red-400 block">
                      {result.verdict || (isPt ? "Incompatível / Sem Relação Técnica" : "No Technical Relevance")}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {isPt ? "Zero Alucinação: O texto informado não descreve uma vaga técnica" : "Zero Hallucination: The input does not describe a technical job"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {result.summary}
              </p>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  {isPt
                    ? "Dica: Para testar a IA de recrutamento, cole uma descrição real de vaga (ex: Desenvolvedor Frontend, Arquiteto de Software, Full Stack ou Engenheiro de IA) ou selecione um dos exemplos rápidos acima."
                    : "Tip: To test the recruiter AI, paste a real job posting (e.g., Frontend Engineer, Software Architect, Full Stack, or AI Engineer) or choose one of the preset roles above."}
                </span>
              </div>
            </div>
          )}

          {/* Result Card: Valid Software Match */}
          {result && result.isRelevantJob && result.score > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-4 animate-in fade-in duration-300">
              {/* Score Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {result.score}%
                  </span>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-emerald-700 dark:text-emerald-300 block">
                      {result.verdict}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {isPt ? "Baseado em competências e entregas reais" : "Based on verified production deliveries"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar Resumo" : "Copy Summary")}</span>
                </button>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {result.summary}
              </p>

              {/* Matched Skills */}
              {result.matchedSkills && result.matchedSkills.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-emerald-500/20">
                  <div className="text-xs font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400">
                    {isPt ? "Hard Skills & Competências Identificadas:" : "Identified Hard Skills & Competencies:"}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedSkills.map((str, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{str}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Relevant Case Studies */}
              {result.relevantCases && result.relevantCases.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-emerald-500/20">
                  <div className="text-xs font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400">
                    {isPt ? "Cases Comprovados Aplicáveis:" : "Proven Applicable Case Studies:"}
                  </div>
                  {result.relevantCases.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs"
                    >
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{c.title}</div>
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{c.metric}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Next Actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-emerald-500/20">
                <button
                  onClick={handleAskAIAssistant}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPt ? "Tirar Dúvidas com a IA do Guilherme" : "Ask Guilherme's AI Assistant"}</span>
                </button>

                <a
                  href={`/resumes/guilherme-rodovalho-cv-${locale === "pt-BR" ? "pt" : "en"}.pdf`}
                  download={`guilherme-rodovalho-cv-${locale === "pt-BR" ? "pt" : "en"}.pdf`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isPt ? "Baixar Currículo PDF" : "Download PDF Resume"}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
