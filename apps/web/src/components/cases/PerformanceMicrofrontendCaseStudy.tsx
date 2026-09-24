"use client";

import React, { useState } from "react";
import { SupportedLocale } from "@portfolio/domain";
import {
  Activity,
  Zap,
  Cpu,
  Layers,
  Clock,
  Trash2,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Server,
  FileCode,
  Gauge,
  Flame,
  Search,
  Sliders,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Split,
  Eye,
} from "lucide-react";

interface Props {
  locale: SupportedLocale;
}

export function PerformanceMicrofrontendCaseStudy({ locale }: Props) {
  const isPt = locale === "pt-BR";
  const [activeFrente, setActiveFrente] = useState<number>(1);
  const [expandedHypothesis, setExpandedHypothesis] = useState<number | null>(null);

  const frentes = [
    {
      id: 1,
      name: isPt ? "Diagnóstico de Event Loop" : "Event Loop Diagnostics",
      subtitle: isPt
        ? "Descoberta de alvo incorreto e correção de medições"
        : "Wrong profiling target discovered & baseline fixed",
      icon: Activity,
      tag: isPt ? "p50: 1.062ms → 690ms" : "p50: 1062ms → 690ms",
      color: "emerald",
    },
    {
      id: 2,
      name: isPt ? "Atribuição de CPU por Função" : "CPU Function Attribution",
      subtitle: isPt
        ? "Flame graph de 5.276 amostras: react-dom era apenas 2,1%"
        : "5,276 flame graph samples: react-dom was only 2.1%",
      icon: Flame,
      tag: isPt ? "ETag: -4,9% CPU" : "ETag: -4.9% CPU",
      color: "amber",
    },
    {
      id: 3,
      name: isPt ? "Decomposição do Payload" : "Payload Decomposition",
      subtitle: isPt
        ? "170 repetições do mesmo SVG de estrela somando 140,9 KB"
        : "170 rating star SVG repeats wasting 140.9 KB",
      icon: Layers,
      tag: isPt ? "154 KB desperdiçados" : "154 KB wasted",
      color: "indigo",
    },
    {
      id: 4,
      name: isPt ? "CSS-in-JS & Recálculo de Estilo" : "CSS-in-JS & Style Recalc",
      subtitle: isPt
        ? "295 tags style no body reduzidas a zero: -53% recalc"
        : "295 body style tags reduced to zero: -53% recalc",
      icon: Zap,
      tag: isPt ? "−53,1% Recalc & −96,6 KB" : "−53.1% Recalc & −96.6 KB",
      color: "emerald",
    },
    {
      id: 5,
      name: isPt ? "Vazamentos de Temporizadores" : "Timer Leaks & Server Loops",
      subtitle: isPt
        ? "Recursão infinita a cada 750ms no SSR erradicada"
        : "Infinite 750ms SSR recursion & render leaks eradicated",
      icon: Clock,
      tag: isPt ? "5 bugs críticos corrigidos" : "5 critical bugs fixed",
      color: "rose",
    },
    {
      id: 6,
      name: isPt ? "Remoção de Código Morto" : "Dead Code Purge",
      subtitle: isPt
        ? "Camada Redis inativa e servidor Express obsoleto eliminados"
        : "Inactive Redis caching & obsolete Express server purged",
      icon: Trash2,
      tag: isPt ? "15 arquivos & 4 deps" : "15 files & 4 deps",
      color: "zinc",
    },
    {
      id: 7,
      name: isPt ? "Análise de Bundle & Tree-Shaking" : "Bundle Analysis & Tree-Shaking",
      subtitle: isPt
        ? "Falso alarme desmistificado e pacote corrigido (81,2 KB)"
        : "False alarm clarified & broken tree-shaking solved (81.2 KB)",
      icon: Package,
      tag: isPt ? "81,2 KB recuperados" : "81.2 KB reclaimed",
      color: "blue",
    },
  ];

  const hypotheses = [
    {
      id: 1,
      hypothesis: isPt
        ? "A renderização SSR do React bloqueia o event loop de forma sistemática"
        : "React SSR rendering systematically blocks the Node.js event loop",
      refutation: isPt
        ? "O profiling comprovou que react-dom consumia apenas 2,1% da CPU e a distribuição de atraso era bimodal (p50 de 0,7 ms, p95 de 25 ms). O gargalo eram hashes de ETag e I/O síncrono."
        : "Profiling revealed react-dom accounted for only 2.1% of CPU, and event loop delay was bimodal (p50: 0.7 ms, p95: 25 ms). The real culprit was synchronous ETag hashing and I/O.",
      verdict: isPt ? "REFUTADA COM DADOS" : "REFUTED WITH DATA",
    },
    {
      id: 2,
      hypothesis: isPt
        ? "O objeto __NEXT_DATA__ domina o tamanho do payload HTML"
        : "The __NEXT_DATA__ state dominates HTML response payload",
      refutation: isPt
        ? "O __NEXT_DATA__ representava apenas 17,3% da resposta (139,8 KB). O verdadeiro dominador eram SVGs inline desnecessariamente duplicados (35,0% do HTML, 283,5 KB)."
        : "__NEXT_DATA__ accounted for only 17.3% of the document (139.8 KB). The primary offender was duplicate inline SVGs (35.0% of HTML, 283.5 KB).",
      verdict: isPt ? "REFUTADA COM DADOS" : "REFUTED WITH DATA",
    },
    {
      id: 3,
      hypothesis: isPt
        ? "PurgeCSS resolveria o inchaço de 189 KB de CSS-in-JS"
        : "PurgeCSS would eliminate the 189 KB CSS-in-JS overhead",
      refutation: isPt
        ? "A análise de cobertura de CSS via Chrome DevTools Protocol apontou 0% de CSS não utilizado. O problema não era CSS órfão, mas a reemissão do mesmo identificador de classe 33 vezes (88,7 KB de tags idênticas)."
        : "Coverage analysis via CDP revealed 0% unused CSS. The root problem was repeated re-emission of identical rule blocks up to 33 times in the body, which PurgeCSS cannot fix.",
      verdict: isPt ? "REFUTADA COM DADOS" : "REFUTED WITH DATA",
    },
    {
      id: 4,
      hypothesis: isPt
        ? "Imports de barril (barrel files) do Design System estavam inflando o bundle"
        : "Barrel file imports in the Design System were bloating bundle size",
      refutation: isPt
        ? "A inspeção dos pacotes demonstrou que eles declaram ESM correto e `sideEffects: false`. O tree-shaking funcionava perfeitamente; o único pacote com problema não tinha relação com barris."
        : "Package inspection proved they declare proper ESM and `sideEffects: false`. Tree-shaking was fully operational; the single defective package had missing ESM entries instead.",
      verdict: isPt ? "REFUTADA COM DADOS" : "REFUTED WITH DATA",
    },
    {
      id: 5,
      hypothesis: isPt
        ? "O bundle sofreu uma regressão de 136 KB em First Load JS"
        : "The bundle suffered a 136 KB regression in shared First Load JS",
      refutation: isPt
        ? "Demonstrado matematicamente por subtração que os 141 KB antes específicos de cada rota migraram para um chunk compartilhado e cacheável. A carga líquida por rota variou apenas +3 KB (+0,9%)."
        : "Mathematically proven through chunk subtraction that 141 KB formerly routed per-page migrated into a shared cacheable chunk. Net transfer per route changed by only +3 KB (+0.9%).",
      verdict: isPt ? "FALSO ALARME ESCLARECIDO" : "FALSE ALARM DISPROVED",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Banner with Executive Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 p-6 sm:p-10 shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPt ? "Case Principal de Performance" : "Premier Performance Case"}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
              Next.js 14 • React 18 • Clinic.js
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
              {isPt ? "Engenharia Orientada a Evidência" : "Evidence-Based Engineering"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100 mb-4 leading-snug">
            {isPt
              ? "Micro-frontend SSR de E-commerce: Diagnóstico & Otimização de Performance"
              : "E-Commerce Micro-Frontend SSR: Evidence-Based Performance Diagnostic"}
          </h2>

          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
            {isPt
              ? "Investigação aprofundada conduzida sob o princípio de medir antes de propor e validar depois de implementar. Nenhuma alteração foi promovida sem evidência empírica. Atuação direta sobre o caminho crítico de renderização de busca, catálogo e coleção de 3 bandeiras de grande varejo."
              : "In-depth investigation guided by the principle of measuring before proposing and validating after implementing. No change was deployed without raw data. Direct optimization across search, catalog, and category rendering for 3 major retail brands."}
          </p>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "Recálculo de Estilo" : "Style Recalculation"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingDown className="w-5 h-5" />
                <span>−53,1%</span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                53.9ms → 25.3ms (CPU 4x)
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "Payload HTML" : "HTML Payload"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingDown className="w-5 h-5" />
                <span>−96,6 KB</span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {isPt ? "por requisição SSR" : "per SSR response"}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "Tags <style> no Body" : "Body Style Tags"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" />
                <span>295 → 0</span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {isPt ? "Extração SSR limpa" : "Clean SSR extraction"}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "Hipóteses Refutadas" : "Refuted Hypotheses"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <ShieldCheck className="w-5 h-5" />
                <span>5 falsas</span>
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {isPt ? "Derrubadas com dados" : "Disproved with data"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Baseline Context & Methodology Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase text-zinc-500 font-bold tracking-wider">
            <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isPt ? "Arquitetura & Contexto da Aplicação" : "Architecture & Application Context"}</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
              <span className="text-zinc-500">{isPt ? "Stack Principal" : "Core Stack"}</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">Next.js 14 (Pages) • React 18 • TS</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
              <span className="text-zinc-500">{isPt ? "Modelo de Entrega" : "Delivery Model"}</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">Micro-frontend SSR Multi-marca</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
              <span className="text-zinc-500">{isPt ? "Payload Médio Inicial" : "Initial Avg Payload"}</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">~800 KB por requisição</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
              <span className="text-zinc-500">{isPt ? "Latência p99 Sob Carga" : "p99 Latency Under Load"}</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">~1,8 segundo</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
              <span className="text-zinc-500">{isPt ? "Runtimes de Estilo" : "Style Runtimes"}</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">Emotion + styled-components (conflito)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{isPt ? "Estado Global" : "Global State"}</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">Redux Toolkit com serialização SSR</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono uppercase text-zinc-500 font-bold tracking-wider">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{isPt ? "Arsenal de Instrumentação & Ferramentas" : "Instrumentation Toolkit"}</span>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
            {isPt
              ? "A equipe baseava-se em leituras visuais de relatórios que se mostraram enganosas. Implementei profiling programático consumindo dados brutos de amostragem."
              : "The team initially relied on visual GUI reports that yielded misleading interpretations. I built programmatic parser scripts ingesting raw sample distributions."}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Clinic.js Suite</div>
              <div className="text-zinc-500 mt-0.5">Doctor, Flame & Bubbleprof</div>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">autocannon</div>
              <div className="text-zinc-500 mt-0.5">Carga HTTP controlada</div>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">CDP via Playwright</div>
              <div className="text-zinc-500 mt-0.5">CSS coverage & render timing</div>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">Scripts em Node</div>
              <div className="text-zinc-500 mt-0.5">Agregação de 5.276 stacks brutos</div>
            </div>
          </div>
        </div>
      </div>

      {/* The 7 Technical Fronts - Interactive Navigator */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
              DEEP-DIVE TÉCNICO
            </span>
            <span className="text-xs font-mono text-zinc-500">
              {isPt ? "Selecione uma frente para inspecionar" : "Select a front to inspect"}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {isPt ? "As 7 Frentes de Diagnóstico & Otimização" : "The 7 Technical Investigation Fronts"}
          </h3>
        </div>

        {/* Tab Buttons Horizontal */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {frentes.map((frente) => {
            const Icon = frente.icon;
            const isActive = activeFrente === frente.id;
            return (
              <button
                key={frente.id}
                type="button"
                onClick={() => setActiveFrente(frente.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-md"
                    : "bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-white/20 dark:bg-zinc-900/20 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    Frente 0{frente.id}
                  </span>
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                </div>
                <span className="text-xs font-semibold leading-tight line-clamp-2">
                  {frente.name}
                </span>
                <span
                  className={`text-[10px] font-mono mt-2 truncate w-full ${
                    isActive
                      ? "text-emerald-300 dark:text-emerald-700 font-bold"
                      : "text-zinc-500"
                  }`}
                >
                  {frente.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Frente Detailed Panel */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm">
          {activeFrente === 1 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Frente 01 • INVESTIGAÇÃO DE EVENT LOOP
                  </span>
                  <h4 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Diagnóstico de Event Loop: Descarte de GC e Alvo Incorreto"
                      : "Event Loop Diagnosis: GC Rule-out and Target Correction"}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  p50: 1.062 ms → 690 ms
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "O perfil inicial apontava travamentos de até 6,6 s no event loop sob carga. Ao correlacionar cada travamento com métricas simultâneas de CPU e heap, desmistifiquei o diagnóstico de Garbage Collection: travamentos de segundos com CPU de apenas 10% a 15% descartam GC (que consome CPU a 100%) e comprovam espera por I/O síncrono."
                  : "Initial profiling indicated event loop stalls up to 6.6s under load. By correlating stalls with CPU and heap data, I refuted Garbage Collection: multi-second delays with 10%-15% CPU rule out GC (which saturates CPU at 100%) and point to synchronous I/O waiting."}
              </p>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-zinc-100 dark:bg-zinc-950/80 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="p-3">t (s)</th>
                      <th className="p-3">Delay Medido</th>
                      <th className="p-3">Uso de CPU</th>
                      <th className="p-3">Heap Alocado</th>
                      <th className="p-3">Diagnóstico Técnico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    <tr>
                      <td className="p-3">4,2s</td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">4.191 ms</td>
                      <td className="p-3">11%</td>
                      <td className="p-3">241 MB</td>
                      <td className="p-3 text-zinc-500">I/O síncrono bloqueante</td>
                    </tr>
                    <tr>
                      <td className="p-3">18,8s</td>
                      <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold">6.663 ms</td>
                      <td className="p-3">13%</td>
                      <td className="p-3">433 MB</td>
                      <td className="p-3 text-zinc-500">I/O síncrono bloqueante</td>
                    </tr>
                    <tr>
                      <td className="p-3">25,2s</td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">3.437 ms</td>
                      <td className="p-3">15%</td>
                      <td className="p-3">406 MB</td>
                      <td className="p-3 text-zinc-500">I/O síncrono bloqueante</td>
                    </tr>
                    <tr>
                      <td className="p-3">37,4s</td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">4.638 ms</td>
                      <td className="p-3">10%</td>
                      <td className="p-3">621 MB</td>
                      <td className="p-3 text-zinc-500">I/O síncrono bloqueante</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Senior Engineering Correction Note */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>
                    {isPt
                      ? "O Ponto de Inflexão: O Alvo Perfilado Estava Errado"
                      : "The Turning Point: Profiling Target Was Incorrect"}
                  </span>
                </div>
                <p className="leading-relaxed">
                  {isPt
                    ? "Identifiquei duas falhas graves na medição prévia do time: o profiling rodava em modo de desenvolvimento (com webpack ativo e React dev build) e o Dockerfile executava `next start`, não o servidor Express real de produção. Refiz todo o diagnóstico contra o container e o binário de produção real. O resultado: p50 real era 690 ms (não 1.062 ms) e a distribuição do event loop era bimodal (p50 de 0,7 ms), comprovando que o SSR React NÃO bloqueava o loop sistematicamente."
                    : "I identified two major measurement flaws in the previous setup: profiling ran in dev mode with webpack active, and the Dockerfile invoked `next start` instead of the actual Express production server. I rebuilt the diagnostic against the real production container. Result: actual p50 latency was 690 ms (not 1062 ms) and event loop delay was bimodal (p50 of 0.7 ms), disproving the assumption that SSR was choking the loop."}
                </p>
              </div>
            </div>
          )}

          {activeFrente === 2 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                    Frente 02 • PROFILING DE CPU POR FUNÇÃO
                  </span>
                  <h4 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Flame Graph com 5.276 Amostras: O Custo Oculto do ETag"
                      : "Flame Graph with 5,276 Samples: The Hidden ETag Hashing Cost"}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {isPt ? "−4,9% CPU por requisição" : "−4.9% CPU per request"}
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Criei um script em Node para processar 5.276 amostras brutas de stack do Flame Graph, calculando self time por pacote e função. O resultado contrariou frontalmente o senso comum da equipe:"
                  : "I built a Node script to parse 5,276 raw stack frames from Clinic.js Flame, aggregating self-time per package. The data overturned the team's assumptions:"}
              </p>

              {/* Flame Visual Bar */}
              <div className="space-y-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs font-mono text-zinc-500 uppercase font-semibold">
                  {isPt ? "Distribuição de CPU por Componente" : "CPU Allocation by Component"}
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-zinc-700 dark:text-zinc-300">Carregamento de Módulos (Node Internals)</span>
                      <span className="font-bold text-zinc-500">~22.0%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-zinc-500 h-full rounded-full" style={{ width: "22%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-amber-700 dark:text-amber-300 font-semibold">
                        {isPt ? "fnv1a52 (Hash de ETag em cada resposta de 809 KB)" : "fnv1a52 (ETag hash on each 809 KB payload)"}
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">4.9%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: "4.9%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                        react-dom (Renderização de toda a árvore SSR)
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">2.1%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "2.1%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                        {isPt ? "Código da Aplicação (Componentes e Lógica)" : "Application Code (Components & Logic)"}
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">2.0%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: "2.0%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Taken */}
              <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs space-y-2">
                <div className="text-zinc-400 font-semibold">
                  // next.config.js — {isPt ? "Ação cirúrgica implementada" : "Surgical change deployed"}
                </div>
                <div className="text-emerald-400">
                  generateEtags: false, <span className="text-zinc-500">// Cache já é gerido por CDN e Redis de borda</span>
                </div>
                <div className="text-zinc-400 pt-1 text-[11px]">
                  {isPt
                    ? "Ganho comprovado: eliminação imediata de 4,9% de CPU por requisição, validado via inspeção de headers."
                    : "Verified outcome: immediate elimination of 4.9% CPU per request, verified via HTTP response headers."}
                </div>
              </div>
            </div>
          )}

          {activeFrente === 3 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    Frente 03 • DECOMPOSIÇÃO DO PAYLOAD HTML
                  </span>
                  <h4 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "809 KB Decompostos: 170 Ícones de Estrela Desperdiçando 154 KB"
                      : "809 KB Decomposed: 170 Star Icons Wasting 154 KB"}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {isPt ? "35,0% do HTML era SVG inline" : "35.0% of HTML was inline SVG"}
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Decompus cirurgicamente o documento de 809 KB por tipo de conteúdo. A suposição anterior de que o objeto de hidratação do Next.js inchava o payload foi totalmente refutada:"
                  : "I disassembled the 809 KB document by content type. The assumption that Next.js hydration data dominated payload was completely debunked:"}
              </p>

              {/* Payload Breakdown Visual Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-zinc-500">{isPt ? "SVG Inline" : "Inline SVGs"}</div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 my-1">283,5 KB</div>
                  <div className="text-zinc-500 font-bold">35,0% {isPt ? "do HTML" : "of HTML"}</div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                  <div className="text-zinc-500">CSS-in-JS</div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 my-1">189,9 KB</div>
                  <div className="text-zinc-500 font-bold">23,5% {isPt ? "do HTML" : "of HTML"}</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-500/10 border border-zinc-500/30">
                  <div className="text-zinc-500">Markup DOM</div>
                  <div className="text-2xl font-bold text-zinc-700 dark:text-zinc-300 my-1">191,4 KB</div>
                  <div className="text-zinc-500 font-bold">23,7% {isPt ? "do HTML" : "of HTML"}</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-zinc-500">__NEXT_DATA__</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 my-1">139,8 KB</div>
                  <div className="text-zinc-500 font-bold">17,3% {isPt ? "do HTML" : "of HTML"}</div>
                </div>
              </div>

              {/* Discovery Callout */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 font-mono">
                  <Search className="w-4 h-4 text-indigo-500" />
                  <span>
                    {isPt
                      ? "O Rastreador do Gargalo: Componente Rating"
                      : "The Culprit Pinpointed: Rating Component"}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  {isPt
                    ? "Dos 233 SVGs inline inseridos no HTML, apenas 45 eram únicos. Um único ícone de estrela de avaliação repetia-se 170 vezes na página, totalizando 140,9 KB isoladamente. O componente Rating do design system renderizava duas camadas de 5 estrelas por avaliação em 5 filtros e 12 cards de produto. Total desperdiçado por duplicação pura: 154 KB (mapeado para migração para Sprite SVG)."
                    : "Of 233 inline SVGs in the HTML, only 45 were unique. A single rating star icon was repeated 170 times across the document, totaling 140.9 KB on its own. The Design System Rating component rendered two layers of 5 stars across 5 facet filters and 12 product cards. Total waste from duplication: 154 KB (architected for SVG Sprite adoption)."}
                </p>
              </div>
            </div>
          )}

          {activeFrente === 4 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Frente 04 • CSS-IN-JS & CPU DE RECÁLCULO
                  </span>
                  <h4 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Eliminação de 295 Tags <style> no Body: −53% de Recálculo de Estilo"
                      : "Purging 295 Body Style Tags: −53% Style Recalculation Time"}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Recalc: 53.9ms → 25.3ms (CPU 4x)
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Diagnostiquei a execução simultânea de dois runtimes de estilo (Emotion e styled-components). O Emotion gerava 295 tags <style> espalhadas no <body> com 88,7 KB de blocos de CSS idênticos repetidos até 33 vezes. A cobertura via Chrome DevTools Protocol apontou 0% de CSS não utilizado, descartando PurgeCSS e provando que o problema era repetição, não regras mortas."
                  : "I discovered two styling runtimes running simultaneously (Emotion & styled-components). Emotion injected 295 <style> tags across the <body> with 88.7 KB of duplicate identical rules emitted up to 33 times. CDP coverage revealed 0% unused CSS, eliminating PurgeCSS and proving the issue was duplicate rule re-emission."}
              </p>

              {/* Controlled Experiment Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-zinc-100 dark:bg-zinc-950/80 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="p-3">{isPt ? "Métrica de Validação" : "Validation Metric"}</th>
                      <th className="p-3">{isPt ? "Antes (Baseline)" : "Before (Baseline)"}</th>
                      <th className="p-3">{isPt ? "Depois (Otimizado)" : "After (Optimized)"}</th>
                      <th className="p-3">{isPt ? "Ganho Comprovado" : "Proven Delta"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    <tr>
                      <td className="p-3 font-semibold">Recalc Style (CPU 4x throttled)</td>
                      <td className="p-3">53,9 ms</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">25,3 ms</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">−53,1%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Recalc Style (Desktop baseline)</td>
                      <td className="p-3">11,9 ms</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">6,0 ms</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">−49,7%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Tamanho do HTML</td>
                      <td className="p-3">811,4 KB</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">714,8 KB</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">−96,6 KB</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Tags &lt;style&gt; no &lt;body&gt;</td>
                      <td className="p-3 text-rose-500">295 tags</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">0 tags</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">100% no &lt;head&gt;</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Implementation Architecture */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {isPt ? "Solução Arquitetural Implementada:" : "Engineered Architectural Solution:"}
                </div>
                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 font-sans">
                  <li>
                    {isPt
                      ? "Cache do Emotion explícito por requisição para evitar vazamento entre requisições concorrentes no Node."
                      : "Explicit per-request Emotion cache to prevent memory bleeding across concurrent Node requests."}
                  </li>
                  <li>
                    {isPt
                      ? "Extração SSR via `@emotion/server` no `_document`, reemitindo CSS consolidado no `<head>`."
                      : "SSR extraction via `@emotion/server` in `_document`, emitting consolidated sheets cleanly in the `<head>`."}
                  </li>
                  <li>
                    {isPt
                      ? "Distinção chave: CSS comprimia para 15 KB em gzip; o gargalo não era rede, mas CPU de renderização do browser."
                      : "Key architectural finding: CSS gzipped down to 15 KB; bottleneck was client-side CPU recalc, not network bandwidth."}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeFrente === 5 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">
                    Frente 05 • VAZAMENTOS DE MEMÓRIA & TEMPORIZADORES
                  </span>
                  <h4 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Auditoria em 43 Timers: Recursão Infinita no SSR Eliminada"
                      : "43 Timers Audited: Eradicating Infinite Server-Side Recursion"}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {isPt ? "1.940 testes passando" : "1,940 tests passing"}
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Auditei individualmente 43 ocorrências de setTimeout e setInterval em todo o repositório, sanando cinco defeitos graves que comprometiam a estabilidade do processo Node.js em produção:"
                  : "I audited all 43 occurrences of setTimeout and setInterval across the repository, resolving five critical defects that degraded Node.js runtime health:"}
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-rose-900 dark:text-rose-200">
                      {isPt ? "Recursão Infinita no Servidor:" : "Infinite Server Recursion:"}
                    </span>{" "}
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {isPt
                        ? "Função reagendava-se recursivamente a cada 750 ms sem condição de parada no SSR, mantendo workers do Node ocupados indefinidamente."
                        : "Function rescheduled itself recursively every 750 ms without termination criteria during SSR, keeping Node workers pinned."}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {isPt ? "Timers durante Render:" : "Timers During Render:"}
                    </span>{" "}
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {isPt
                        ? "Temporizadores instanciados no corpo de funções de componentes eram recriados a cada render e vazavam para o processo do SSR."
                        : "Timers instantiated inside component function bodies were recreated on every render and leaked into SSR workers."}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {isPt ? "Timer em Escopo de Módulo:" : "Module-Scoped Timer State:"}
                    </span>{" "}
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {isPt
                        ? "Estado global compartilhado acidentalmente entre requisições de usuários concorrentes."
                        : "State unintentionally shared across concurrent client requests on the same Node instance."}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {isPt ? "Ausência de Cleanup em Hooks:" : "Missing Hook Cleanup:"}
                    </span>{" "}
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {isPt
                        ? "setInterval e setTimeout sem cancelamento no unmount, gerando referências órfãs e erros em nós de DOM destacado."
                        : "setInterval & setTimeout missing unmount cleanups, causing zombie callbacks and detached DOM leaks."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFrente === 6 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-zinc-500 font-bold">
                    Frente 06 • HIGIENE DE CÓDIGO & INFRAESTRUTURA
                  </span>
                  <h4 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Remoção de Código Morto: 15 Arquivos e Camada Redis Obsoleta"
                      : "Dead Code Removal: 15 Files and Obsolete Redis Layer Purged"}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                  {isPt ? "15 arquivos • 4 dependências" : "15 files • 4 dependencies"}
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Descobri que uma camada legada de cache Redis estava morta no código por dois motivos independentes:"
                  : "I discovered a legacy Redis caching layer was completely dormant due to two distinct reasons:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    1. {isPt ? "Desabilitada por Configuração" : "Disabled by Config"}
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400">
                    {isPt
                      ? "As flags de ativação estavam setadas em false em todos os ambientes e bandeiras de varejo."
                      : "Flags set to false across all production environments and retail brand configurations."}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    2. {isPt ? "Servidor Inativo em Prod" : "Server Inactive in Prod"}
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400">
                    {isPt
                      ? "Pertencia a um servidor Express legado, mas os containers de produção executavam `next start`."
                      : "Tied to legacy Express server, whereas production containers executed `next start` directly."}
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-500 font-mono">
                {isPt
                  ? "Foram expurgados 15 arquivos, 4 dependências desnecessárias, variáveis de ambiente e configurações de infraestrutura local, reduzindo a superfície de manutenção."
                  : "Purged 15 source files, 4 unused packages, environment variables, and local infra overhead, decreasing technical debt."}
              </p>
            </div>
          )}

          {activeFrente === 7 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                    Frente 07 • ANÁLISE DE BUNDLE & TREE-SHAKING
                  </span>
                  <h4 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Desmistificação de Falso Alarme e 81,2 KB de Tree-Shaking Corrigidos"
                      : "Bundle False Alarm Disproved & 81.2 KB Tree-Shaking Defect Resolved"}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {isPt ? "+0,9% real por rota" : "+0.9% actual per route"}
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "O indicador 'First Load JS shared by all' saltou de 191 KB para 327 KB, gerando pânico na equipe por suposta regressão. Demonstrei matematicamente com decomposição de chunks que NÃO houve regressão:"
                  : "The 'First Load JS shared by all' metric surged from 191 KB to 327 KB, alarming the team over an apparent regression. Through mathematical chunk breakdown, I proved NO regression existed:"}
              </p>

              {/* Chunk Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-xs font-mono text-left">
                  <thead className="bg-zinc-100 dark:bg-zinc-950/80 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="p-3">Chunk Segment</th>
                      <th className="p-3">{isPt ? "Antes" : "Before"}</th>
                      <th className="p-3">{isPt ? "Depois" : "After"}</th>
                      <th className="p-3">{isPt ? "Análise Técnica" : "Technical Insight"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    <tr>
                      <td className="p-3 font-semibold">Total por Rota</td>
                      <td className="p-3">332 KB</td>
                      <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">335 KB</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                        {isPt ? "Apenas +3 KB (+0,9%)" : "Only +3 KB (+0.9%)"}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Compartilhado (Vendor)</td>
                      <td className="p-3">191 KB</td>
                      <td className="p-3">327 KB</td>
                      <td className="p-3 text-zinc-500">Migração para chunk cacheável</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Específico da Rota</td>
                      <td className="p-3">141 KB</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">8 KB</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                        {isPt ? "Desacoplamento de rotas" : "Per-route payload decoupled"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Defective Package Identified */}
              <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs space-y-2">
                <div className="text-zinc-400 font-semibold">
                  // {isPt ? "Achado Real: 1 pacote quebrava o tree-shaking" : "Actual Defect: 1 package broke tree-shaking"}
                </div>
                <div className="text-rose-400">
                  {`"main": "src/index.ts",   // arquivo inexistente no tarball publicado`}
                  <br />
                  {`"module": ausente,        // sem entrada ESM`}
                  <br />
                  {`"sideEffects": ausente    // webpack assume efeitos colaterais forçados`}
                </div>
                <div className="text-zinc-400 pt-1 text-[11px]">
                  {isPt
                    ? "Esse único pacote impedia a eliminação de 81,2 KB de código não utilizado, isolado e documentado para correção."
                    : "This single package prevented elimination of 81.2 KB of dead code, isolated and documented for upstream patch."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refuted Hypotheses Section - Staff Engineer Hallmark */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-bold">
            RIGOR ANALÍTICO & MATURIDADE TÉCNICA
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {isPt ? "5 Hipóteses Iniciais Refutadas com Evidência" : "5 Initial Hypotheses Refuted with Empirical Evidence"}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {isPt
              ? "Grande parte do valor da engenharia sênior reside em descartar caminhos errados antes de queimar semanas de esforço da equipe."
              : "A critical hallmark of Senior/Staff engineering is invalidating wrong assumptions before burning weeks of team engineering cycles."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hypotheses.map((item) => {
            const isExpanded = expandedHypothesis === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedHypothesis(isExpanded ? null : item.id)}
                className="cursor-pointer p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                      {item.verdict}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">0{item.id}</span>
                  </div>

                  <h5 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-2 leading-snug">
                    &quot;{item.hypothesis}&quot;
                  </h5>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.refutation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>{isPt ? "Evidência comprovada" : "Verified with telemetry"}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radical Transparency & Technical Ethics Callout */}
      <div className="p-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/30 space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isPt ? "Notas de Transparência & Rigor Técnico" : "Transparency & Technical Rigor Notes"}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100 block mb-1">
              {isPt ? "FCP sem melhora estatística:" : "FCP inconclusive:"}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {isPt
                ? "O First Contentful Paint não apresentou melhora estatisticamente confiável no experimento isolado; reportado abertamente sem inflar dados."
                : "FCP showed no statistically reliable delta in isolated trials; reported truthfully rather than misrepresented."}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100 block mb-1">
              {isPt ? "Sprite SVG Mapeado:" : "SVG Sprite Architectural Scope:"}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {isPt
                ? "A economia de ~130 KB via sprite foi dimensionada e mapeada, aguardando aprovação arquitetural do design system compartilhado."
                : "The ~130 KB SVG sprite optimization was dimensioned and cataloged, pending Design System component governance."}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100 block mb-1">
              {isPt ? "Tree-Shaking Cross-Team:" : "Cross-Team Tree-Shaking:"}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {isPt
                ? "A correção dos 81,2 KB depende de novo release de pacote mantido por outra equipe, diagnosticado e documentado formalmente."
                : "The 81.2 KB fix requires a patch release from a sister squad, isolated and formally submitted with reproduction steps."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
