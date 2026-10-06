"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SupportedLocale } from "@portfolio/domain";
import {
  Activity,
  Maximize2,
  X,
  TrendingDown,
  Server,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Eye,
  BarChart3,
  Calendar,
} from "lucide-react";

interface Props {
  locale: SupportedLocale;
  showTitle?: boolean;
}

export function PerformanceEvidenceViewer({ locale, showTitle = true }: Props) {
  const isPt = locale === "pt-BR";
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isPt ? "EVIDÊNCIA EMPÍRICA EM PRODUÇÃO" : "EMPIRICAL PRODUCTION EVIDENCE"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {isPt
                ? "Telemetria APM: Queda de ~60% no Consumo de CPU por Requisição"
                : "APM Telemetry: ~60% CPU Consumption Reduction per Request"}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              {isPt
                ? "Gráfico de telemetria extraído diretamente do APM (Dynatrace) monitorando a métrica 'CPU per request' (ms/req) versus volume de requisições (/min) durante o deploy das otimizações cirúrgicas."
                : "Live telemetry dashboard captured directly from APM (Dynatrace) correlating 'CPU per request' (ms/req) against throughput volume (/min) during surgical optimization deployment."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isPt ? "Dados Reais Validados" : "Verified Production Data"}</span>
          </div>
        </div>
      )}

      {/* Main Image Showcase Card */}
      <div className="relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-xl transition-all">
        {/* Top bar with APM Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/90 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-zinc-200 font-bold">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dynatrace APM • Service Performance Details</span>
            </span>
            <span className="hidden sm:inline-block text-zinc-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>CPU per request (ms/req)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isPt ? "Expandir Imagem" : "Inspect High-Res"}</span>
            </button>
          </div>
        </div>

        {/* Interactive Image Frame */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative cursor-zoom-in bg-zinc-950 p-3 sm:p-5 flex items-center justify-center overflow-hidden"
          title={isPt ? "Clique para ampliar e inspecionar os detalhes" : "Click to enlarge and inspect details"}
        >
          <img
            src="/images/evidence/dynatrace-cpu-drop.jpg"
            alt="Telemetria APM Dynatrace comprovando redução de 60% de CPU por requisição"
            className="w-full h-auto max-h-[460px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 text-white font-mono text-xs border border-zinc-700 shadow-xl">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{isPt ? "Clique para inspecionar em tela cheia" : "Click to view fullscreen"}</span>
            </div>
          </div>
        </div>

        {/* Legend Ribbon */}
        <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 rounded" />
              <strong className="text-zinc-200">{isPt ? "Linha contínua:" : "Solid line:"}</strong> CPU consumption (ms/req)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-300/60 rounded-xs" />
              <strong className="text-zinc-200">{isPt ? "Barras verticais:" : "Bars:"}</strong> Requests Throughput (/min)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500/30 border border-emerald-500/60 rounded-xs" />
              <strong className="text-emerald-400">{isPt ? "Área verde:" : "Green window:"}</strong> {isPt ? "Pico sustentado (~1.1k req/min)" : "Sustained peak (~1.1k req/min)"}
            </span>
          </div>

          <span className="text-zinc-500">{isPt ? "Janela temporal: 26. Sep — 29. Sep" : "Timeframe: Sep 26 — Sep 29"}</span>
        </div>
      </div>

      {/* Analytical Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Step 1: Baseline */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400">
              01 • {isPt ? "BASELINE PRÉ-DEPLOY" : "PRE-DEPLOY BASELINE"}
            </span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>~130 – 160 ms/req</span>
          </div>
          <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {isPt
              ? "Entre 26 e 28 de setembro, o tempo de CPU por requisição oscilava alto mesmo sob tráfego estável, com picos de até 165 ms/req provocados pelo hash de ETag (fnv1a52) e ineficiência de CSS no SSR."
              : "Between Sep 26 and Sep 28, CPU per request consistently plateaued around ~130-160 ms/req, with spikes to 165 ms/req driven by fnv1a52 ETag hashing and unextracted SSR style rules."}
          </p>
        </div>

        {/* Step 2: The Inflection Point */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              02 • {isPt ? "O PONTO DE INFLEXÃO" : "THE TURNING POINT"}
            </span>
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <TrendingDown className="w-5 h-5" />
            <span>28. Sep às 20:00</span>
          </div>
          <p className="font-sans text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {isPt
              ? "Queda imediata e drástica no exato instante do deploy das otimizações cirúrgicas: desativação do cálculo de ETag, extração consolidada de CSS Emotion no <head> e mitigação de temporizadores no SSR."
              : "Immediate cliff-like drop at the exact deployment timestamp: disabling ETag computation, consolidated Emotion SSR extraction into <head>, and eradicating server-side timer overhead."}
          </p>
        </div>

        {/* Step 3: Sustained Efficiency */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-600 dark:text-indigo-400">
              03 • {isPt ? "EFICIÊNCIA SUSTENTADA" : "SUSTAINED EFFICIENCY"}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span>~50 – 55 ms/req</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
              −60% CPU
            </span>
          </div>
          <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {isPt
              ? "No dia 29 de setembro, mesmo durante horário comercial com tráfego escalando para mais de 1.100 req/min (janela verde), a CPU permaneceu travada em ~50 ms/req, atestando ganho de performance genuíno."
              : "On Sep 29, even as traffic surged past 1,100 req/min during peak hours (green window), CPU usage remained locked at ~50 ms/req, proving genuine algorithmic and architectural optimization."}
          </p>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-7xl w-full max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold font-mono text-zinc-100">
                    {isPt
                      ? "Evidência de Produção — Dynatrace APM Telemetry"
                      : "Production Evidence — Dynatrace APM Telemetry"}
                  </h4>
                  <p className="text-xs font-mono text-zinc-400">
                    CPU consumption (ms/req) vs Throughput (req/min) • 26. Sep – 29. Sep
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title={isPt ? "Fechar visualização (Esc)" : "Close viewer (Esc)"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body with Scroll */}
            <div className="p-4 sm:p-6 overflow-auto max-h-[75vh] flex items-center justify-center bg-zinc-950">
              <img
                src="/images/evidence/dynatrace-cpu-drop.jpg"
                alt="Telemetria APM Dynatrace ampliada"
                className="w-full h-auto max-h-[72vh] object-contain rounded-lg"
              />
            </div>

            {/* Modal Footer Summary */}
            <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold">
                  {isPt ? "Resultado Comprovado: −60% de CPU por requisição" : "Verified Outcome: −60% CPU per request"}
                </span>
                <span className="hidden sm:inline text-zinc-600">|</span>
                <span className="text-zinc-300">
                  {isPt ? "135 ms/req → 52 ms/req" : "135 ms/req → 52 ms/req"}
                </span>
              </div>
              <span className="text-zinc-500">
                {isPt ? "Pressione ESC para fechar" : "Press ESC to close"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
