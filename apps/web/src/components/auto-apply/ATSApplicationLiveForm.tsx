"use client";

import React from "react";
import {
  ApplicationFormField,
  JobPostingAnalysis,
  PreparedApplication,
} from "@portfolio/domain";
import {
  Globe,
  Lock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Upload,
  Sparkles,
  Terminal,
  Check,
  Building2,
  Paperclip,
  ExternalLink,
} from "lucide-react";

interface ATSApplicationLiveFormProps {
  job: JobPostingAnalysis;
  preparedApp: PreparedApplication;
  answers: Record<string, string | string[] | boolean>;
  coverLetter: string;
  currentFillingIndex: number; // Index of field currently being filled (or >= total if all filled)
  isAnimating: boolean;
  onSkipAnimation?: () => void;
  logs?: string[];
}

export const ATSApplicationLiveForm: React.FC<ATSApplicationLiveFormProps> = ({
  job,
  preparedApp,
  answers,
  coverLetter,
  currentFillingIndex,
  isAnimating,
  onSkipAnimation,
  logs = [],
}) => {
  const fields = job.fields;
  const totalFields = fields.length;
  const filledCount = Math.min(
    isAnimating ? currentFillingIndex + 1 : totalFields,
    totalFields
  );
  const progressPercent = Math.round((filledCount / totalFields) * 100);

  // Helper to check if a specific field is filled yet in the animation
  const isFieldFilled = (fieldIndex: number) => {
    if (!isAnimating) return true;
    return fieldIndex <= currentFillingIndex;
  };

  const isFieldActive = (fieldIndex: number) => {
    return isAnimating && fieldIndex === currentFillingIndex;
  };

  // Find answers for core fields
  const firstName = (answers["first_name"] as string) || "Guilherme";
  const lastName = (answers["last_name"] as string) || "Rodovalho";
  const email = (answers["email"] as string) || "rodovalhogdeveloper@gmail.com";
  const phonePrefix = (answers["phone_prefix"] as string) || "+55";
  const phone = (answers["phone"] as string) || "(34) 99161-9467";
  const personalUrl =
    (answers["personal_url"] as string) ||
    "https://www.linkedin.com/in/guilherme-rodovalho/";

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-950 overflow-hidden shadow-2xl space-y-0">
      {/* 1. MOCK BROWSER HEADER */}
      <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between gap-4">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>

        {/* URL Address Bar */}
        <div className="flex-1 max-w-2xl px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-zinc-500 select-none">https://</span>
          <span className="text-emerald-300 font-medium truncate">
            {job.url.replace(/^https?:\/\//, "")}
          </span>
          <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 uppercase font-sans font-semibold">
            {job.atsType} ATS
          </span>
        </div>

        {/* WebMCP Pulse Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isAnimating ? "bg-emerald-400" : "bg-blue-400"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isAnimating ? "bg-emerald-500" : "bg-blue-500"
              }`}
            ></span>
          </span>
          <span className="text-zinc-300 hidden md:inline">
            {isAnimating ? "WebMCP Preenchendo DOM..." : "WebMCP Conectado"}
          </span>
        </div>
      </div>

      {/* 2. AUTOMATION TELEMETRY & PROGRESS BAR */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-zinc-200">
              Progresso da Automação WebMCP no Formulário:
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {filledCount} de {totalFields} campos ({progressPercent}%)
            </span>
          </div>

          {isAnimating && onSkipAnimation && (
            <button
              onClick={onSkipAnimation}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono transition flex items-center gap-1"
            >
              Pular animação ⚡
            </button>
          )}
        </div>

        {/* Visual Progress Track */}
        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Live log stream line */}
        {logs.length > 0 && (
          <div className="text-[11px] font-mono text-emerald-300/90 flex items-center gap-2 truncate">
            <span className="text-zinc-500">Log:</span>
            <span>{logs[logs.length - 1]}</span>
          </div>
        )}
      </div>

      {/* 3. SIMULATED APPLICATION PAGE (FACTORIAL HR / ATS LOOK & FEEL) */}
      <div className="p-6 md:p-8 bg-zinc-950 space-y-8 max-h-[700px] overflow-y-auto">
        {/* ATS Job Banner */}
        <div className="border-b border-zinc-800 pb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {job.atsType.toUpperCase()} CAREERS FORM
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400">{job.location || "Remote (Brazil)"}</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">{job.title}</h2>
            <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {job.company}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-right space-y-0.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Candidato Identificado
            </span>
            <p className="text-xs font-semibold text-zinc-200">
              Guilherme Rodovalho
            </p>
            <p className="text-[11px] text-zinc-400 font-mono">
              Staff Software Engineer
            </p>
          </div>
        </div>

        {/* SIMULATED FORM */}
        <div className="space-y-8">
          {/* SECTION: DADOS PESSOAIS */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono border-b border-zinc-800/80 pb-2 flex items-center justify-between">
              <span>1. Informações Pessoais</span>
              <span className="text-[11px] text-zinc-500 lowercase font-sans font-normal">
                campos sincronizados via profile.json
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              {renderFieldCard(
                "first_name",
                "Nome *",
                fields.findIndex((f) => f.name === "first_name"),
                <input
                  type="text"
                  readOnly
                  value={isFieldFilled(fields.findIndex((f) => f.name === "first_name")) ? firstName : ""}
                  placeholder="Nome do candidato..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-xs font-mono transition ${
                    isFieldActive(fields.findIndex((f) => f.name === "first_name"))
                      ? "border-emerald-400 ring-2 ring-emerald-500/40 text-emerald-200"
                      : isFieldFilled(fields.findIndex((f) => f.name === "first_name"))
                      ? "border-zinc-700 text-zinc-100 bg-zinc-900/90"
                      : "border-zinc-800 text-zinc-500 bg-zinc-950"
                  }`}
                />
              )}

              {/* Last Name */}
              {renderFieldCard(
                "last_name",
                "Sobrenome / Cognome *",
                fields.findIndex((f) => f.name === "last_name"),
                <input
                  type="text"
                  readOnly
                  value={isFieldFilled(fields.findIndex((f) => f.name === "last_name")) ? lastName : ""}
                  placeholder="Sobrenome..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-xs font-mono transition ${
                    isFieldActive(fields.findIndex((f) => f.name === "last_name"))
                      ? "border-emerald-400 ring-2 ring-emerald-500/40 text-emerald-200"
                      : isFieldFilled(fields.findIndex((f) => f.name === "last_name"))
                      ? "border-zinc-700 text-zinc-100 bg-zinc-900/90"
                      : "border-zinc-800 text-zinc-500 bg-zinc-950"
                  }`}
                />
              )}

              {/* Email */}
              {renderFieldCard(
                "email",
                "Email corporativo / pessoal *",
                fields.findIndex((f) => f.name === "email"),
                <input
                  type="email"
                  readOnly
                  value={isFieldFilled(fields.findIndex((f) => f.name === "email")) ? email : ""}
                  placeholder="email@exemplo.com..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-xs font-mono transition ${
                    isFieldActive(fields.findIndex((f) => f.name === "email"))
                      ? "border-emerald-400 ring-2 ring-emerald-500/40 text-emerald-200"
                      : isFieldFilled(fields.findIndex((f) => f.name === "email"))
                      ? "border-zinc-700 text-zinc-100 bg-zinc-900/90"
                      : "border-zinc-800 text-zinc-500 bg-zinc-950"
                  }`}
                />
              )}

              {/* Phone Prefix + Phone */}
              {renderFieldCard(
                "phone",
                "Telefone com DDD / Código de País *",
                fields.findIndex((f) => f.name === "phone"),
                <div className="flex gap-2">
                  <div className="w-24 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300">
                    {phonePrefix}
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={isFieldFilled(fields.findIndex((f) => f.name === "phone")) ? phone : ""}
                    placeholder="Telefone..."
                    className={`flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-xs font-mono transition ${
                      isFieldActive(fields.findIndex((f) => f.name === "phone"))
                        ? "border-emerald-400 ring-2 ring-emerald-500/40 text-emerald-200"
                        : isFieldFilled(fields.findIndex((f) => f.name === "phone"))
                        ? "border-zinc-700 text-zinc-100 bg-zinc-900/90"
                        : "border-zinc-800 text-zinc-500 bg-zinc-950"
                    }`}
                  />
                </div>
              )}

              {/* Personal URL */}
              <div className="md:col-span-2">
                {renderFieldCard(
                  "personal_url",
                  "URL Pessoal (LinkedIn / GitHub / Portfólio)",
                  fields.findIndex((f) => f.name === "personal_url"),
                  <input
                    type="text"
                    readOnly
                    value={isFieldFilled(fields.findIndex((f) => f.name === "personal_url")) ? personalUrl : ""}
                    placeholder="https://..."
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-xs font-mono transition ${
                      isFieldActive(fields.findIndex((f) => f.name === "personal_url"))
                        ? "border-emerald-400 ring-2 ring-emerald-500/40 text-emerald-200"
                        : isFieldFilled(fields.findIndex((f) => f.name === "personal_url"))
                        ? "border-zinc-700 text-zinc-100 bg-zinc-900/90"
                        : "border-zinc-800 text-zinc-500 bg-zinc-950"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* SECTION: DOCUMENTOS E CARTA */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono border-b border-zinc-800/80 pb-2 flex items-center justify-between">
              <span>2. Currículo e Carta Motivacional</span>
              <span className="text-[11px] text-zinc-500 lowercase font-sans font-normal">
                upload de arquivo & geração factual
              </span>
            </h3>

            {/* Resume Upload Card */}
            {renderFieldCard(
              "cv",
              "Upload do Currículo Oficial (PDF) *",
              fields.findIndex((f) => f.name === "cv" || f.semanticType === "resume"),
              <div
                className={`p-4 rounded-xl border-2 border-dashed transition flex items-center justify-between gap-4 ${
                  isFieldFilled(fields.findIndex((f) => f.name === "cv" || f.semanticType === "resume"))
                    ? "border-emerald-500/50 bg-emerald-950/20"
                    : "border-zinc-800 bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                      {isFieldFilled(fields.findIndex((f) => f.name === "cv" || f.semanticType === "resume")) ? (
                        <>
                          <span>{preparedApp.selectedResume.filename}</span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            (Anexado via WebMCP FileList)
                          </span>
                        </>
                      ) : (
                        <span className="text-zinc-500">Aguardando injeção do arquivo...</span>
                      )}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Documento PDF formatado e validado em dois idiomas (PT/EN)
                    </p>
                  </div>
                </div>

                {isFieldFilled(fields.findIndex((f) => f.name === "cv" || f.semanticType === "resume")) && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> 100% Uploaded
                  </span>
                )}
              </div>
            )}

            {/* Cover Letter Textarea */}
            {renderFieldCard(
              "cover_letter",
              "Carta de Apresentação (Cover Letter)",
              fields.findIndex((f) => f.name === "cover_letter" || f.semanticType === "coverLetter"),
              <textarea
                readOnly
                rows={5}
                value={
                  isFieldFilled(fields.findIndex((f) => f.name === "cover_letter" || f.semanticType === "coverLetter"))
                    ? coverLetter
                    : ""
                }
                placeholder="Carta motivacional sendo injetada..."
                className={`w-full p-3.5 rounded-xl bg-zinc-900 border text-xs font-mono leading-relaxed transition ${
                  isFieldActive(fields.findIndex((f) => f.name === "cover_letter" || f.semanticType === "coverLetter"))
                    ? "border-emerald-400 ring-2 ring-emerald-500/40 text-emerald-200"
                    : isFieldFilled(fields.findIndex((f) => f.name === "cover_letter" || f.semanticType === "coverLetter"))
                    ? "border-zinc-700 text-zinc-200 bg-zinc-900/90"
                    : "border-zinc-800 text-zinc-500 bg-zinc-950"
                }`}
              />
            )}
          </div>

          {/* SECTION: CUSTOM QUESTIONS (FACTORIAL AQ_*) */}
          {job.fields.some((f) => f.semanticType === "customQuestion") && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono border-b border-zinc-800/80 pb-2 flex items-center justify-between">
                <span>3. Perguntas Específicas da Vaga (ATS Custom Questions)</span>
                <span className="text-[11px] text-zinc-500 lowercase font-sans font-normal">
                  respostas fundamentadas
                </span>
              </h3>

              <div className="space-y-4">
                {job.fields
                  .filter((f) => f.semanticType === "customQuestion")
                  .map((field) => {
                    const fieldIdx = fields.findIndex((f) => f.id === field.id);
                    const rawVal = answers[field.id] ?? answers[field.name];
                    const filled = isFieldFilled(fieldIdx);
                    const active = isFieldActive(fieldIdx);

                    return (
                      <div key={field.id}>
                        {renderFieldCard(
                          field.id,
                          field.label,
                          fieldIdx,
                          field.type === "textarea" ? (
                            <textarea
                              readOnly
                              rows={3}
                              value={filled ? (rawVal as string) : ""}
                              placeholder="Injetando resposta..."
                              className={`w-full p-3 rounded-xl bg-zinc-900 border text-xs font-mono transition ${
                                active
                                  ? "border-emerald-400 ring-2 ring-emerald-500/40 text-emerald-200"
                                  : filled
                                  ? "border-zinc-700 text-zinc-200"
                                  : "border-zinc-800 text-zinc-500 bg-zinc-950"
                              }`}
                            />
                          ) : field.type === "checkbox" && field.options ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {field.options.map((opt, i) => {
                                const isChecked =
                                  filled &&
                                  (Array.isArray(rawVal)
                                    ? rawVal.includes(opt.value)
                                    : rawVal === opt.value);
                                return (
                                  <div
                                    key={i}
                                    className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                                      isChecked
                                        ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300 font-medium"
                                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
                                    }`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                        isChecked
                                          ? "bg-emerald-500 border-emerald-400 text-zinc-950 font-bold"
                                          : "border-zinc-700 bg-zinc-950"
                                      }`}
                                    >
                                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span className="text-xs">{opt.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <input
                              type="text"
                              readOnly
                              value={filled ? (rawVal as string) : ""}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200"
                            />
                          )
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* SECTION: TERMOS E CONSENTIMENTOS */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono border-b border-zinc-800/80 pb-2">
              4. Termos e Privacidade
            </h3>

            <div className="space-y-2">
              {job.fields
                .filter((f) => f.semanticType === "consent")
                .map((field) => {
                  const fieldIdx = fields.findIndex((f) => f.id === field.id);
                  const filled = isFieldFilled(fieldIdx);
                  return (
                    <div
                      key={field.id}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 transition ${
                        filled
                          ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                          : "bg-zinc-900/40 border-zinc-800 text-zinc-500"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                          filled
                            ? "bg-emerald-500 border-emerald-400 text-zinc-950 font-bold"
                            : "border-zinc-700 bg-zinc-950"
                        }`}
                      >
                        {filled && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs">{field.label}</span>
                      {filled && (
                        <span className="ml-auto text-[10px] font-mono text-emerald-400">
                          Aceito
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper renderer for each form card with status badge
  function renderFieldCard(
    fieldKey: string,
    label: string,
    fieldIndex: number,
    inputElement: React.ReactNode
  ) {
    const filled = isFieldFilled(fieldIndex);
    const active = isFieldActive(fieldIndex);

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-zinc-300 flex items-center gap-2">
            <span>{label}</span>
          </label>

          {active ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3" /> Preenchendo agora...
            </span>
          ) : filled ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Injetado via WebMCP
            </span>
          ) : (
            <span className="text-[10px] font-mono text-zinc-600">
              Pendente
            </span>
          )}
        </div>
        {inputElement}
      </div>
    );
  }
};
