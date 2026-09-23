"use client";

import React, { useState, useEffect, useRef } from "react";
import { JobPostingAnalysis, PreparedApplication } from "@portfolio/domain";
import {
  Globe,
  Lock,
  ExternalLink,
  Terminal,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Shield,
  Eye,
  Bot,
  Send,
  Edit3,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  Play,
  Check,
} from "lucide-react";

interface DiscoveredField {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  label: string;
  required: boolean;
}

interface LiveCandidacyIframeViewProps {
  job: JobPostingAnalysis;
  preparedApp: PreparedApplication;
  answers: Record<string, string | string[] | boolean>;
  coverLetter: string;
  onUpdateCoverLetter?: (newLetter: string) => void;
  onSubmitSuccess?: () => void;
  onBackToInput?: () => void;
}

export const LiveCandidacyIframeView: React.FC<LiveCandidacyIframeViewProps> = ({
  job,
  preparedApp,
  answers,
  coverLetter,
  onUpdateCoverLetter,
  onSubmitSuccess,
  onBackToInput,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillDone, setAutoFillDone] = useState(false);
  const [discoveredFields, setDiscoveredFields] = useState<DiscoveredField[]>([]);
  const [showEditLetter, setShowEditLetter] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<{
    fieldName: string;
    fieldLabel?: string;
    index: number;
    total: number;
    value: string;
  } | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([
    "Inicializando iframe seguro e estabelecendo bridge WebMCP...",
  ]);

  const proxyUrl = `/api/job-application/proxy?url=${encodeURIComponent(job.url)}`;

  // Candidate payload with verified info (Guilherme Rodovalho, phone +55 (34) 99161-9467)
  const candidatePayload = {
    firstName: "Guilherme",
    lastName: "Rodovalho",
    fullName: "Guilherme Rodovalho",
    email: "rodovalhogdeveloper@gmail.com",
    phone: "+55 (34) 99161-9467",
    linkedin: "https://linkedin.com/in/guilhermerodovalho",
    github: "https://github.com/guilhermerodovalho",
    personalUrl: "https://guilhermerodovalho.dev",
    coverLetter,
    resumeFilename: preparedApp.selectedResume.filename,
    customAnswers: answers,
  };

  // Listen to postMessage from the proxied page inside the iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;

      if (e.data.type === "WEBMCP_BRIDGE_READY") {
        setIframeLoaded(true);
        if (e.data.fields && Array.isArray(e.data.fields)) {
          setDiscoveredFields(e.data.fields);
        }
        setLogMessages((prev) => [
          ...prev.slice(-4),
          `[WebMCP:Ready] Conectado à página de candidatura (${job.company})`,
          `[WebMCP:DOM] ${e.data.fields?.length || 0} campos identificados no formulário ao vivo`,
        ]);
      }

      if (e.data.type === "WEBMCP_FIELDS_DISCOVERED") {
        if (e.data.fields && Array.isArray(e.data.fields)) {
          setDiscoveredFields(e.data.fields);
        }
      }

      if (e.data.type === "WEBMCP_FIELD_PROGRESS") {
        setCurrentProgress({
          fieldName: e.data.fieldName,
          fieldLabel: e.data.fieldLabel,
          index: e.data.index,
          total: e.data.total,
          value: e.data.value,
        });
        setLogMessages((prev) => [
          ...prev.slice(-4),
          `[WebMCP:DOM] ${e.data.fieldLabel || e.data.fieldName} -> "${e.data.value}"`,
        ]);
      }

      if (e.data.type === "WEBMCP_FILL_COMPLETE") {
        setIsAutoFilling(false);
        setAutoFillDone(true);
        setLogMessages((prev) => [
          ...prev.slice(-4),
          `[WebMCP:Success] Preenchimento dinâmico concluído! ${e.data.fieldsFilled || ""} campos preenchidos.`,
        ]);
      }

      if (e.data.type === "WEBMCP_SUBMIT_SUCCESS") {
        setLogMessages((prev) => [
          ...prev.slice(-4),
          `[WebMCP:Submit] Candidatura submetida com sucesso na página!`,
        ]);
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }

      if (e.data.type === "WEBMCP_SUBMIT_MANUAL_NEEDED") {
        setLogMessages((prev) => [
          ...prev.slice(-4),
          `[WebMCP:Aviso] Botão de submit não encontrado automaticamente. Por favor clique no botão de envio dentro do formulário.`,
        ]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [job, onSubmitSuccess]);

  const triggerIframeAutoFill = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      setIsAutoFilling(true);
      setAutoFillDone(false);
      setCurrentProgress(null);
      setLogMessages((prev) => [
        ...prev.slice(-4),
        `[WebMCP:AutoFill] Disparando injeção dinâmica de dados no DOM da página...`,
      ]);
      iframeRef.current.contentWindow.postMessage(
        {
          type: "WEBMCP_START_AUTO_FILL",
          payload: candidatePayload,
        },
        "*"
      );
    }
  };

  const triggerIframeSubmit = () => {
    setShowConfirmSubmit(false);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      setLogMessages((prev) => [
        ...prev.slice(-4),
        `[WebMCP:Submit] Confirmado por humano. Disparando envio do formulário...`,
      ]);
      iframeRef.current.contentWindow.postMessage(
        {
          type: "WEBMCP_EXECUTE_SUBMIT",
        },
        "*"
      );
    }
  };

  const handleRefreshIframe = () => {
    setIframeLoaded(false);
    setAutoFillDone(false);
    setCurrentProgress(null);
    if (iframeRef.current) {
      iframeRef.current.src = proxyUrl;
    }
  };

  const percent = currentProgress
    ? Math.round((currentProgress.index / currentProgress.total) * 100)
    : autoFillDone
    ? 100
    : isAutoFilling
    ? 25
    : 0;

  return (
    <div className="space-y-4">
      {/* TOP WORKSPACE CONTROLLER / HUD */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl space-y-4">
        {/* Row 1: Detected Job & Engine Pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Engine: {job.atsType.toUpperCase()}
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-zinc-400 text-xs font-mono">
                {discoveredFields.length > 0
                  ? `${discoveredFields.length} campos detectados no DOM`
                  : "Detectando formulário..."}
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{job.company}</span>
              <span className="text-zinc-500 font-normal">—</span>
              <span className="text-emerald-300 font-semibold">{job.title}</span>
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onBackToInput && (
              <button
                onClick={onBackToInput}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition border border-zinc-800"
              >
                Trocar URL
              </button>
            )}

            <button
              onClick={() => setShowEditLetter(!showEditLetter)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition border border-zinc-800"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Carta de Apresentação
              {showEditLetter ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={triggerIframeAutoFill}
              disabled={isAutoFilling}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg ${
                isAutoFilling
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                  : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20 active:scale-95"
              }`}
            >
              {isAutoFilling ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400 border-t-zinc-950 animate-spin" />
                  Preenchendo Página...
                </>
              ) : autoFillDone ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Preencher Novamente
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Preencher Automaticamente (WebMCP)
                </>
              )}
            </button>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={isAutoFilling}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar Candidatura
            </button>
          </div>
        </div>

        {/* Row 2: Verified Candidate Pill (Zero-Hallucination) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Dados Verificados:
            </span>
            <span className="text-zinc-200">Guilherme Rodovalho</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-300 font-semibold">+55 (34) 99161-9467</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">rodovalhogdeveloper@gmail.com</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
              CV: {preparedApp.selectedResume.filename}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-mono">
              Staff Front-End (Casas Bahia)
            </span>
          </div>
        </div>

        {/* Collapsible Cover Letter Drawer */}
        {showEditLetter && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                Carta de Apresentação Adaptada para {job.company}
              </label>
              <span className="text-[11px] text-emerald-400 font-mono">
                IA Zero-Hallucination
              </span>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => onUpdateCoverLetter && onUpdateCoverLetter(e.target.value)}
              rows={6}
              className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Progress Bar & Live Event Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-300 font-medium">Injeção no DOM ao Vivo:</span>
              <span className="text-emerald-400 font-bold">{percent}%</span>
            </div>
            <div className="text-zinc-400 text-[11px]">
              {autoFillDone ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Formulário preenchido com sucesso
                </span>
              ) : isAutoFilling ? (
                <span className="text-amber-400 animate-pulse">
                  Preenchendo campos na página...
                </span>
              ) : (
                <span>Aguardando comando</span>
              )}
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Log line */}
          <div className="text-[11px] font-mono text-emerald-300/90 flex items-center gap-2 truncate bg-zinc-900/40 px-3 py-1.5 rounded-lg border border-zinc-900">
            <span className="text-zinc-500 font-semibold">WebMCP Log:</span>
            <span>{logMessages[logMessages.length - 1]}</span>
          </div>
        </div>
      </div>

      {/* CONFIRM SUBMISSION MODAL (HUMAN-IN-THE-LOOP GUARD) */}
      {showConfirmSubmit && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-emerald-500/50 space-y-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-100">
                Confirmação Explícita de Envio (Human-in-the-Loop)
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Você revisou os dados preenchidos no formulário da <strong>{job.company}</strong> ({job.title})? O WebMCP irá disparar o clique de submissão diretamente na página da candidatura.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={() => setShowConfirmSubmit(false)}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition"
            >
              Voltar e Revisar
            </button>
            <button
              onClick={triggerIframeSubmit}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              Sim, Enviar Candidatura Agora
            </button>
          </div>
        </div>
      )}

      {/* 2. REAL WEBPAGE EMBEDDED IN MOCK BROWSER CHROME */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        {/* Browser Top Chrome */}
        <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>

          {/* URL bar */}
          <div className="flex-1 max-w-2xl px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-zinc-500 select-none">https://</span>
            <span className="text-emerald-300 font-medium truncate">
              {job.url.replace(/^https?:\/\//, "")}
            </span>
            <button
              onClick={handleRefreshIframe}
              className="ml-auto text-zinc-500 hover:text-zinc-300 transition"
              title="Recarregar página no iframe"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-emerald-400 ml-1 transition"
              title="Abrir página original em nova aba"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Live indicator badge */}
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold hidden md:inline">
              Live DOM Connected
            </span>
          </div>
        </div>

        {/* Real Webpage Iframe */}
        <div className="relative w-full h-[720px] bg-zinc-900">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-10 space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
              <p className="text-xs text-zinc-300 font-mono">
                Carregando a página real da vaga via Proxy Seguro ({job.company})...
              </p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={proxyUrl}
            title={`Página de Candidatura para ${job.title}`}
            className="w-full h-full border-0 bg-white"
            onLoad={() => {
              setIframeLoaded(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};
