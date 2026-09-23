"use client";

import React, { useState, useEffect } from "react";
import {
  ApplicationStatus,
  JobApplicationRecord,
  JobPostingAnalysis,
  PreparedApplication,
} from "@portfolio/domain";
import { applicationHistoryStore } from "@/lib/auto-apply/history-store";
import { prepareJobApplication } from "@/lib/auto-apply/application-preparer";
import { atsRegistry } from "@/lib/auto-apply/ats-adapters/registry";
import {
  Sparkles,
  Briefcase,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Shield,
  Send,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Edit3,
  ExternalLink,
  Bot,
  Globe,
  Clock,
  Check,
} from "lucide-react";
import { LiveCandidacyIframeView } from "./LiveCandidacyIframeView";

interface AutoApplyHubProps {
  lang: string;
}

export const AutoApplyHub: React.FC<AutoApplyHubProps> = ({ lang }) => {
  const isPt = lang === "pt-BR";

  // Form inputs
  const [jobUrl, setJobUrl] = useState<string>(
    "https://xfarm.factorialhr.com/apply/brazil-senior-front-end-developer-309222?utm_source=linkedin.com"
  );
  const [selectedResume, setSelectedResume] = useState<"pt-BR" | "en-US">("en-US");

  // State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Analysis & Prepared Data
  const [jobAnalysis, setJobAnalysis] = useState<JobPostingAnalysis | null>(null);
  const [preparedApp, setPreparedApp] = useState<PreparedApplication | null>(null);
  const [editedCoverLetter, setEditedCoverLetter] = useState<string>("");
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string | string[] | boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<JobApplicationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"apply" | "history">("apply");

  // Load history on mount
  useEffect(() => {
    setHistory(applicationHistoryStore.getApplications());
    const unsubscribe = applicationHistoryStore.subscribe((updated) => {
      setHistory(updated);
    });
    return () => unsubscribe();
  }, []);

  // 1. Analyze Job Posting and launch dynamic iframe workspace
  const handleLaunchLiveWorkspace = async () => {
    if (!jobUrl.trim()) {
      setErrorMessage("Por favor, informe a URL da vaga.");
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);

    try {
      let analysis: JobPostingAnalysis;

      const res = await fetch("/api/job-application/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl }),
      });

      if (!res.ok) {
        throw new Error(`Erro ao analisar vaga (${res.status})`);
      }

      const data = await res.json();
      analysis = data.job;

      // Handle CAPTCHA / bot protection block
      if (analysis.automationBlocked || analysis.hasCaptcha) {
        setJobAnalysis(analysis);
        const record: JobApplicationRecord = {
          id: `app-blocked-${Date.now()}`,
          company: analysis.company || "Empresa externa",
          role: analysis.title || "Vaga",
          jobUrl,
          date: new Date().toISOString(),
          resumeUsed:
            selectedResume === "pt-BR"
              ? "guilherme-rodovalho-cv-pt.pdf"
              : "guilherme-rodovalho-cv-en.pdf",
          status: "manual_action_required",
          atsType: analysis.atsType,
          notes: analysis.blockReason || "Bloqueio anti-bot ou CAPTCHA detectado.",
        };
        applicationHistoryStore.saveApplication(record);
        setIsAnalyzing(false);
        setErrorMessage(
          analysis.blockReason ||
            "Ação manual necessária: Proteção contra automação (Cloudflare/CAPTCHA) detectada."
        );
        return;
      }

      setJobAnalysis(analysis);

      // 2. Prepare Application with AI
      const resumeFilename =
        selectedResume === "pt-BR"
          ? "guilherme-rodovalho-cv-pt.pdf"
          : "guilherme-rodovalho-cv-en.pdf";

      const prepared = await prepareJobApplication(analysis, {
        filename: resumeFilename,
        locale: selectedResume,
        url: `/resumes/${resumeFilename}`,
      });

      setPreparedApp(prepared);
      setEditedCoverLetter(prepared.coverLetter);

      // Initialize answers
      const initialAnswers: Record<string, string | string[] | boolean> = {};
      prepared.answers.forEach((ans) => {
        initialAnswers[ans.fieldId] = ans.value;
      });
      setEditedAnswers(initialAnswers);

      // Save initial record in history
      const initialRecord: JobApplicationRecord = {
        id: prepared.id,
        company: analysis.company,
        role: analysis.title,
        jobUrl: analysis.url,
        date: new Date().toISOString(),
        resumeUsed: resumeFilename,
        status: "ready_for_review",
        atsType: analysis.atsType,
        coverLetterSnippet: prepared.coverLetter.slice(0, 150) + "...",
        notes: "Vaga carregada e renderizada no iframe dinâmico via WebMCP.",
      };
      applicationHistoryStore.saveApplication(initialRecord);

      setIsAnalyzing(false);
    } catch (err) {
      console.error("[AutoApply Analyze Error]:", err);
      // Fallback using local adapter
      try {
        const adapter = atsRegistry.resolve(jobUrl);
        const fallbackAnalysis = adapter.parseJobPosting(jobUrl, "");
        setJobAnalysis(fallbackAnalysis);

        const resumeFilename =
          selectedResume === "pt-BR"
            ? "guilherme-rodovalho-cv-pt.pdf"
            : "guilherme-rodovalho-cv-en.pdf";

        const prepared = await prepareJobApplication(fallbackAnalysis, {
          filename: resumeFilename,
          locale: selectedResume,
          url: `/resumes/${resumeFilename}`,
        });

        setPreparedApp(prepared);
        setEditedCoverLetter(prepared.coverLetter);
        const initialAnswers: Record<string, string | string[] | boolean> = {};
        prepared.answers.forEach((ans) => {
          initialAnswers[ans.fieldId] = ans.value;
        });
        setEditedAnswers(initialAnswers);
        setIsAnalyzing(false);
      } catch (fallbackErr) {
        setErrorMessage(
          err instanceof Error ? err.message : "Falha ao processar a vaga informada."
        );
        setIsAnalyzing(false);
      }
    }
  };

  const handleSubmissionSuccess = () => {
    if (preparedApp) {
      applicationHistoryStore.updateApplicationStatus(
        preparedApp.id,
        "submitted",
        "Candidatura enviada diretamente através da página com confirmação explícita."
      );
    }
    setIsSubmitted(true);
  };

  const resetFlow = () => {
    setJobAnalysis(null);
    setPreparedApp(null);
    setErrorMessage(null);
    setIsSubmitted(false);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Enviada
          </span>
        );
      case "filled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/80 text-blue-400 border border-blue-800">
            <Bot className="w-3.5 h-3.5" /> Preenchida
          </span>
        );
      case "ready_for_review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/80 text-amber-400 border border-amber-800">
            <Edit3 className="w-3.5 h-3.5" /> Pronta para revisão
          </span>
        );
      case "manual_action_required":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-950/80 text-purple-400 border border-purple-800">
            <AlertTriangle className="w-3.5 h-3.5" /> Ação manual necessária
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-400 border border-rose-800">
            <AlertCircle className="w-3.5 h-3.5" /> Falhou
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
            <Clock className="w-3.5 h-3.5" /> Em análise
          </span>
        );
    }
  };

  return (
    <div id="auto-apply-hub" className="space-y-6">
      {/* Sub-nav toggle between Apply Hub and History */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("apply");
              setIsSubmitted(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === "apply"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Nova Candidatura (Iframe Live)
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === "history"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            Histórico ({history.length})
          </button>
        </div>

        {/* Ethical Safety Guardrail Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-400 text-xs font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Hallucination & Human-in-the-Loop</span>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">Atenção</p>
            <p className="text-xs text-rose-300/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* TAB 1: APPLY WORKSPACE */}
      {activeTab === "apply" && (
        <div className="space-y-6">
          {/* Submission Success Banner */}
          {isSubmitted && (
            <div className="p-8 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-100">
                  Candidatura Enviada com Sucesso!
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  A candidatura para <strong>{jobAnalysis?.title}</strong> na <strong>{jobAnalysis?.company}</strong> foi registrada no histórico com confirmação explícita.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab("history")}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-medium hover:bg-zinc-700 transition"
                >
                  Ver no Histórico
                </button>
                <button
                  onClick={resetFlow}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-semibold hover:bg-emerald-400 transition"
                >
                  Aplicar para Nova Vaga
                </button>
              </div>
            </div>
          )}

          {/* VIEW A: INPUT FORM (when no job is loaded yet) */}
          {!jobAnalysis && !isSubmitted && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  Auto Implementation: URL da Vaga & Renderização em Iframe
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Informe a URL de qualquer vaga (Factorial HR, Ashby HQ, Lever, Greenhouse ou página personalizada). A aplicação renderiza a página real dentro de um iframe com WebMCP conectado para inspecionar o DOM e preencher os dados do candidato de forma 100% dinâmica.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-medium text-zinc-300">
                    URL da candidatura
                  </label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  {/* Preset quick test chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1.5">
                    <span className="text-[11px] text-zinc-500 font-mono">Exemplos para teste dinâmico:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setJobUrl(
                          "https://xfarm.factorialhr.com/apply/brazil-senior-front-end-developer-309222?utm_source=linkedin.com"
                        );
                        setSelectedResume("en-US");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-emerald-400 border border-zinc-700 transition"
                    >
                      xFarm (Factorial HR)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setJobUrl(
                          "https://jobs.ashbyhq.com/canals/b652f476-7c7b-452c-870c-5fddb737f0ba/application?utm_source=VANyKzAEAm"
                        );
                        setSelectedResume("en-US");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-blue-400 border border-zinc-700 transition"
                    >
                      Canals (Ashby HQ)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">
                    Currículo a utilizar
                  </label>
                  <select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value as "pt-BR" | "en-US")}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  >
                    <option value="en-US">Guilherme_Rodovalho_CV_en.pdf (English)</option>
                    <option value="pt-BR">Guilherme_Rodovalho_CV_pt.pdf (Português)</option>
                  </select>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Telefone: +55 (34) 99161-9467
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleLaunchLiveWorkspace}
                  disabled={isAnalyzing}
                  id="btn-analyze-job"
                  className={`px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg ${
                    isAnalyzing
                      ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700"
                      : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20 active:scale-95"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-zinc-500 border-t-zinc-200 animate-spin" />
                      Analisando Vaga & Carregando Iframe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Renderizar Página no Iframe & Auto Implementar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* VIEW B: LIVE IFRAME & WEBMCP WORKSPACE (ACTIVE JOB) */}
          {jobAnalysis && preparedApp && !isSubmitted && (
            <LiveCandidacyIframeView
              job={jobAnalysis}
              preparedApp={preparedApp}
              answers={editedAnswers}
              coverLetter={editedCoverLetter}
              onUpdateCoverLetter={(newLetter) => setEditedCoverLetter(newLetter)}
              onSubmitSuccess={handleSubmissionSuccess}
              onBackToInput={resetFlow}
            />
          )}
        </div>
      )}

      {/* TAB 2: AUDITABLE HISTORY TABLE */}
      {activeTab === "history" && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Histórico de Candidaturas Auditável
              </h3>
              <p className="text-xs text-zinc-400">
                Registro detalhado de candidaturas, status de envio no ATS e currículo utilizado.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Total: {history.length}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs font-mono">
              Nenhuma candidatura registrada até o momento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="py-3 px-3">Empresa</th>
                    <th className="py-3 px-3">Cargo</th>
                    <th className="py-3 px-3">Data</th>
                    <th className="py-3 px-3">Currículo</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3 px-3 font-medium text-zinc-200">
                        {record.company}
                      </td>
                      <td className="py-3 px-3 text-zinc-300">
                        {record.role}
                      </td>
                      <td className="py-3 px-3 text-zinc-500 font-mono">
                        {new Date(record.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">
                        {record.resumeUsed}
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {record.jobUrl && (
                          <a
                            href={record.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 inline-flex items-center transition"
                            title="Abrir vaga original"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
