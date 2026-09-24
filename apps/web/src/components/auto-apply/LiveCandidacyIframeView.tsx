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
  Copy,
  Download,
  Bookmark,
  Layers,
  Code2,
  CheckCheck,
  Laptop,
} from "lucide-react";

export type ViewMode = "iframe" | "assisted" | "bookmarklet";

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
  initialViewMode?: ViewMode;
  onUpdateCoverLetter?: (newLetter: string) => void;
  onSubmitSuccess?: () => void;
  onBackToInput?: () => void;
}

export const LiveCandidacyIframeView: React.FC<LiveCandidacyIframeViewProps> = ({
  job,
  preparedApp,
  answers,
  coverLetter,
  initialViewMode = "iframe",
  onUpdateCoverLetter,
  onSubmitSuccess,
  onBackToInput,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeBlockedDetected, setIframeBlockedDetected] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillDone, setAutoFillDone] = useState(false);
  const [discoveredFields, setDiscoveredFields] = useState<DiscoveredField[]>([]);
  const [showEditLetter, setShowEditLetter] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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
    linkedin: "https://www.linkedin.com/in/guilherme-rodovalho/",
    github: "https://github.com/rodovalhog",
    personalUrl: "https://guilhermerodovalho.dev",
    location: "São Paulo, SP — Brasil",
    headline: "Senior Software Engineer | Especialista Frontend | AI Engineer",
    coverLetter,
    resumeFilename: preparedApp.selectedResume.filename,
    customAnswers: answers,
  };

  // Structured fields for 1-click copy cards
  const candidateFields = [
    {
      id: "fullName",
      label: "Nome Completo",
      value: candidatePayload.fullName,
      description: "Full Legal Name",
    },
    {
      id: "firstName",
      label: "Primeiro Nome",
      value: candidatePayload.firstName,
      description: "First Name",
    },
    {
      id: "lastName",
      label: "Sobrenome",
      value: candidatePayload.lastName,
      description: "Last Name",
    },
    {
      id: "email",
      label: "E-mail Profissional",
      value: candidatePayload.email,
      description: "Email Address",
    },
    {
      id: "phone",
      label: "Telefone / WhatsApp",
      value: candidatePayload.phone,
      description: "Phone with Country Code",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: candidatePayload.linkedin,
      description: "Perfil Completo",
    },
    {
      id: "github",
      label: "GitHub",
      value: candidatePayload.github,
      description: "Repositórios e Código",
    },
    {
      id: "personalUrl",
      label: "Portfólio Pessoal",
      value: candidatePayload.personalUrl,
      description: "Website e Demonstrações",
    },
    {
      id: "location",
      label: "Localização / Residência",
      value: candidatePayload.location,
      description: "Remoto / Híbrido",
    },
    {
      id: "headline",
      label: "Headline / Cargo",
      value: candidatePayload.headline,
      description: "Posicionamento Profissional",
    },
  ];

  // Copy helper with feedback
  const copyToClipboard = (text: string, key: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // Copy all candidate data in structured format
  const copyAllFormattedData = () => {
    const text = `CANDIDATURA: Guilherme Rodovalho
VAGA: ${job.title} — ${job.company} (${job.url})

--- DADOS PESSOAIS ---
Nome Completo: Guilherme Rodovalho
Primeiro Nome: Guilherme
Sobrenome: Rodovalho
E-mail: rodovalhogdeveloper@gmail.com
Telefone / WhatsApp: +55 (34) 99161-9467
LinkedIn: https://www.linkedin.com/in/guilherme-rodovalho/
GitHub: https://github.com/rodovalhog
Portfólio: https://guilhermerodovalho.dev
Localização: São Paulo, SP — Brasil
Currículo: /resumes/${preparedApp.selectedResume.filename}

--- CARTA DE APRESENTAÇÃO ---
${coverLetter}
`;
    copyToClipboard(text, "all-data");
  };

  // Generate Bookmarklet & Console script
  const generateScriptCode = () => {
    return `(function(){
  const d = {
    fullName: "Guilherme Rodovalho",
    firstName: "Guilherme",
    lastName: "Rodovalho",
    email: "rodovalhogdeveloper@gmail.com",
    phone: "+55 (34) 99161-9467",
    linkedin: "https://www.linkedin.com/in/guilherme-rodovalho/",
    github: "https://github.com/rodovalhog",
    website: "https://guilhermerodovalho.dev",
    location: "São Paulo, SP - Brasil",
    headline: "Senior Software Engineer | Especialista Frontend | AI Engineer",
    coverLetter: ${JSON.stringify(coverLetter)}
  };

  function setVal(el, val) {
    if (!el || !val) return false;
    try {
      const proto = Object.getPrototypeOf(el);
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) {
        desc.set.call(el, val);
      } else {
        el.value = val;
      }
    } catch(e) {
      el.value = val;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
    return true;
  }

  let count = 0;
  const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea'));

  inputs.forEach(el => {
    const text = ((el.name || '') + ' ' + (el.id || '') + ' ' + (el.placeholder || '') + ' ' + (el.getAttribute('aria-label') || '')).toLowerCase();
    const type = (el.type || '').toLowerCase();

    if (type === 'email' || text.includes('email') || text.includes('e-mail')) {
      if (setVal(el, d.email)) count++;
    } else if (type === 'tel' || text.includes('phone') || text.includes('telefone') || text.includes('celular') || text.includes('whatsapp') || text.includes('mobile')) {
      if (setVal(el, d.phone)) count++;
    } else if (text.includes('first_name') || text.includes('firstname') || text.includes('primeiro_nome') || text.includes('first name') || text.includes('given-name')) {
      if (setVal(el, d.firstName)) count++;
    } else if (text.includes('last_name') || text.includes('lastname') || text.includes('sobrenome') || text.includes('last name') || text.includes('family-name')) {
      if (setVal(el, d.lastName)) count++;
    } else if (text.includes('name') || text.includes('nome') || text.includes('full_name') || text.includes('fullname') || text.includes('candidate_name')) {
      if (setVal(el, d.fullName)) count++;
    } else if (text.includes('linkedin')) {
      if (setVal(el, d.linkedin)) count++;
    } else if (text.includes('github') || text.includes('git')) {
      if (setVal(el, d.github)) count++;
    } else if (text.includes('portfolio') || text.includes('website') || text.includes('site') || text.includes('link') || text.includes('url')) {
      if (setVal(el, d.website)) count++;
    } else if (text.includes('city') || text.includes('cidade') || text.includes('location') || text.includes('localização') || text.includes('address') || text.includes('endereço')) {
      if (setVal(el, d.location)) count++;
    } else if (text.includes('cover') || text.includes('carta') || text.includes('motivation') || text.includes('motivação') || text.includes('comments') || text.includes('mensagem')) {
      if (d.coverLetter && setVal(el, d.coverLetter)) count++;
    }
  });

  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;background:#064e3b;color:#34d399;border:2px solid #10b981;border-radius:12px;padding:14px 20px;font-family:system-ui,-apple-system,sans-serif;font-size:14px;box-shadow:0 10px 25px rgba(0,0,0,0.5);display:flex;align-items:center;gap:10px;font-weight:600;';
  toast.innerHTML = '<span>⚡</span> <span>Autopreenchido com Sucesso! (' + count + ' campos preenchidos com os dados de Guilherme Rodovalho)</span>';
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 6000);
})();`;
  };

  const bookmarkletHref = `javascript:${encodeURIComponent(generateScriptCode())}`;

  // Auto-detect iframe blocker if bridge does not respond after 5.5s
  useEffect(() => {
    if (viewMode === "iframe" && !iframeLoaded) {
      const timer = setTimeout(() => {
        setIframeBlockedDetected(true);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [viewMode, iframeLoaded]);

  // Listen to postMessage from the proxied page inside the iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;

      if (e.data.type === "WEBMCP_BRIDGE_READY") {
        setIframeLoaded(true);
        setIframeBlockedDetected(false);
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
    setIframeBlockedDetected(false);
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
                {viewMode === "iframe"
                  ? discoveredFields.length > 0
                    ? `${discoveredFields.length} campos detectados no DOM`
                    : "Detectando formulário..."
                  : "Modo Alternativo Ativo"}
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

            {viewMode === "iframe" ? (
              <>
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
              </>
            ) : (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir Vaga em Nova Aba
              </a>
            )}
          </div>
        </div>

        {/* Row 2: VIEW MODE SELECTOR TABS (Iframe vs Modo Assistido vs Bookmarklet) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode("iframe")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition border ${
                viewMode === "iframe"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-800"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Iframe Integrado</span>
            </button>

            <button
              onClick={() => setViewMode("assisted")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition border ${
                viewMode === "assisted"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-800"
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Modo Assistido (Cópia Rápida)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                Anti-Bloqueio
              </span>
            </button>

            <button
              onClick={() => setViewMode("bookmarklet")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition border ${
                viewMode === "bookmarklet"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-800"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Bookmarklet / Script (1-Clique)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyAllFormattedData}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-300 text-xs font-mono transition border border-zinc-800 flex items-center gap-1.5"
            >
              {copiedKey === "all-data" ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Tudo Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Copiar Todos os Dados</span>
                </>
              )}
            </button>

            <a
              href={`/resumes/${preparedApp.selectedResume.filename}`}
              download={preparedApp.selectedResume.filename}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 text-xs font-mono transition border border-zinc-800 flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              <span>Baixar CV ({preparedApp.selectedResume.locale})</span>
            </a>
          </div>
        </div>

        {/* Row 3: Verified Candidate Pill (Zero-Hallucination) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Dados Verificados:
            </span>
            <span className="text-zinc-200">{candidatePayload.fullName}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-300 font-semibold">{candidatePayload.phone}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">{candidatePayload.email}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
              CV: {preparedApp.selectedResume.filename}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-mono">
              Staff / Senior Front-End Engineer
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => copyToClipboard(coverLetter, "drawer-letter")}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-emerald-400 flex items-center gap-1 transition"
                >
                  {copiedKey === "drawer-letter" ? (
                    <>
                      <Check className="w-3 h-3" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copiar Carta
                    </>
                  )}
                </button>
                <span className="text-[11px] text-emerald-400 font-mono">
                  IA Zero-Hallucination
                </span>
              </div>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => onUpdateCoverLetter && onUpdateCoverLetter(e.target.value)}
              rows={6}
              className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Progress Bar & Live Event Log (shown in iframe mode) */}
        {viewMode === "iframe" && (
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
        )}
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

      {/* ========================================================
          MODE 1: REAL WEBPAGE EMBEDDED IN MOCK BROWSER IFRAME
          ======================================================== */}
      {viewMode === "iframe" && (
        <div className="space-y-3">
          {/* Iframe blocker alert banner */}
          {iframeBlockedDetected && !iframeLoaded && (
            <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-200 space-y-2 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">
                      O site da vaga parece bloquear exibição em Iframe
                    </h4>
                    <p className="text-xs text-amber-300/80 leading-relaxed mt-0.5">
                      Empresas externas (como Greenhouse, Ashby, Factorial ou Workday) costumam utilizar cabeçalhos restritivos (<code className="bg-amber-900/50 px-1 py-0.5 rounded text-[11px]">X-Frame-Options</code> ou proteção Cloudflare anti-bot).
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setViewMode("assisted")}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Ir para Modo Assistido
                  </button>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-medium flex items-center gap-1.5 transition border border-amber-700/50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir em Nova Aba
                  </a>
                </div>
              </div>
            </div>
          )}

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
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-10 space-y-3 p-6 text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                  <p className="text-xs text-zinc-300 font-mono">
                    Carregando a página real da vaga via Proxy Seguro ({job.company})...
                  </p>
                  <p className="text-[11px] text-zinc-500 max-w-md">
                    Se a página permanecer em branco ou recusar conexão, clique no botão acima para alternar para o <strong>Modo Assistido</strong>.
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
                  setIframeBlockedDetected(false);
                }}
                onError={() => {
                  setIframeBlockedDetected(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 2: MODO ASSISTIDO (COPILOT EM NOVA ABA + CÓPIA RÁPIDA)
          ======================================================== */}
      {viewMode === "assisted" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Executive Header Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Modo Alternativo • Sem Dependência de Iframe
                </span>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Copilot Assistido de Candidatura
                </h3>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  Ideal para sites que bloqueiam iframes (<code className="text-emerald-300 font-mono text-[11px]">X-Frame-Options / CSP</code>). Abra a vaga em uma nova aba e utilize os botões de 1-clique abaixo para preencher os dados instantaneamente.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir Página da Vaga ↗
                </a>

                <a
                  href={`/resumes/${preparedApp.selectedResume.filename}`}
                  download={preparedApp.selectedResume.filename}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 transition border border-zinc-700"
                >
                  <Download className="w-4 h-4" />
                  Baixar Currículo PDF
                </a>
              </div>
            </div>
          </div>

          {/* Quick-Copy Cards Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
                Dados do Candidato (Cópia em 1-Clique)
              </h4>
              <span className="text-[11px] text-zinc-500 font-mono">
                Clique no card para copiar para a área de transferência
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {candidateFields.map((field) => {
                const isCopied = copiedKey === field.id;
                return (
                  <div
                    key={field.id}
                    onClick={() => copyToClipboard(field.value, field.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer relative group flex flex-col justify-between ${
                      isCopied
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-200"
                        : "bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-emerald-400 transition">
                          {field.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {field.description}
                        </span>
                      </div>
                      <p className="text-xs font-mono font-medium text-zinc-100 break-all select-all">
                        {field.value}
                      </p>
                    </div>

                    <div className="pt-2.5 flex items-center justify-end">
                      <span
                        className={`text-[11px] font-mono font-semibold flex items-center gap-1 transition ${
                          isCopied
                            ? "text-emerald-400"
                            : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copiar
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tailored Cover Letter Card */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Carta de Apresentação Gerada para {job.company}
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Baseada nas evidências reais do perfil (Casas Bahia Staff, 150k rpm, LCP 1.4s)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(coverLetter, "card-cover-letter")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedKey === "card-cover-letter" ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copiado com Sucesso!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar Carta Completa
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={coverLetter}
              onChange={(e) => onUpdateCoverLetter && onUpdateCoverLetter(e.target.value)}
              rows={7}
              className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Job Specific Questions & Prepared Answers */}
          {preparedApp.answers.length > 0 && (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Respostas Personalizadas para Perguntas Específicas da Vaga ({preparedApp.answers.length})
              </h4>

              <div className="space-y-2">
                {preparedApp.answers.map((ans, idx) => {
                  const key = `ans-${idx}`;
                  const isCopied = copiedKey === key;
                  const strVal = String(ans.value);
                  const matchingField = job.fields?.find(
                    (f) => f.name === ans.fieldName || f.id === ans.fieldId
                  );
                  const displayLabel = matchingField?.label || ans.fieldName;

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1 min-w-[200px]">
                        <span className="text-[11px] font-semibold text-zinc-400">
                          {displayLabel}
                        </span>
                        <p className="text-xs text-zinc-200 font-mono">{strVal || "(Campo livre)"}</p>
                      </div>

                      {strVal && (
                        <button
                          onClick={() => copyToClipboard(strVal, key)}
                          className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 text-xs font-mono flex items-center gap-1.5 transition border border-zinc-800"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mark as applied bar */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-zinc-200">
                Já concluiu a inscrição na aba externa?
              </h4>
              <p className="text-[11px] text-zinc-400">
                Clique para registrar a candidatura no histórico auditável da sua plataforma.
              </p>
            </div>

            <button
              onClick={() => {
                if (onSubmitSuccess) onSubmitSuccess();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar Inscrição Realizada
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 3: BOOKMARKLET DE AUTOPREENCHIMENTO (1-CLIQUE)
          ======================================================== */}
      {viewMode === "bookmarklet" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-emerald-500/30 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Automação Portátil de DOM
                </span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-zinc-400 text-xs font-mono">Bypassa 100% dos bloqueios de Iframe</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                Bookmarklet de Autopreenchimento de 1-Clique
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                O Bookmarklet é um script seguro que roda diretamente no contexto da página da vaga externa (Ashby, Greenhouse, Factorial, Gupy, Lever, etc.). Ele preenche os campos automaticamente no navegador, ignorando todas as restrições de <code className="text-emerald-400 font-mono">X-Frame-Options</code>, CSP ou CORS.
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </div>
                <h4 className="text-xs font-bold text-zinc-200">
                  Arraste o Botão para Favoritos
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Arraste o botão verde abaixo diretamente para a barra de favoritos do seu navegador (ou copie o script para o Console).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </div>
                <h4 className="text-xs font-bold text-zinc-200">
                  Abra a Página da Vaga
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Clique no botão para abrir a vaga original da <strong>{job.company}</strong> em uma nova aba regular do navegador.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  3
                </div>
                <h4 className="text-xs font-bold text-zinc-200">
                  Clique no Bookmarklet
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Na aba da vaga, dê um clique no favorito. Todos os campos (nome, email, telefone, linkedin, cover letter) serão preenchidos instantaneamente!
                </p>
              </div>
            </div>

            {/* Draggable Bookmarklet & Buttons */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                  Botão de Favorito (Draggable Bookmarklet):
                </span>
                <p className="text-xs text-zinc-500">
                  Clique e arraste este botão para sua barra de favoritos:
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={bookmarkletHref}
                  onClick={(e) => {
                    // Prevent navigation when clicked inside our own page
                    e.preventDefault();
                    copyToClipboard(generateScriptCode(), "bookmarklet-code");
                  }}
                  draggable
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-90 cursor-grab active:cursor-grabbing transition"
                  title="Arraste para a barra de favoritos ou clique para copiar o script"
                >
                  <Bookmark className="w-4 h-4 fill-zinc-950" />
                  ⚡ AutoFill Guilherme ({job.company})
                </a>

                <button
                  onClick={() => copyToClipboard(generateScriptCode(), "bookmarklet-code")}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-semibold flex items-center gap-2 border border-zinc-700 transition"
                >
                  {copiedKey === "bookmarklet-code" ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Script Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>Copiar Script para Console (F12)</span>
                    </>
                  )}
                </button>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir Vaga em Nova Aba
                </a>
              </div>
            </div>

            {/* Script Source Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-zinc-400 font-semibold flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Código JavaScript Injetável (Preview):
                </label>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Totalmente auditável e seguro
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed select-all">
                {generateScriptCode()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
