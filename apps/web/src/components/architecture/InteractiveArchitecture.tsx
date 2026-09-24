"use client";

import React, { useState } from "react";
import {
  Globe,
  Server,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  TrendingUp,
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Clock,
  ExternalLink,
} from "lucide-react";

interface ArchitectureTier {
  id: string;
  name: { "pt-BR": string; "en-US": string };
  role: { "pt-BR": string; "en-US": string };
  tech: string[];
  latency: string;
  availability: string;
  cacheStrategy: { "pt-BR": string; "en-US": string };
  resilience: { "pt-BR": string; "en-US": string };
  architecturalRationale: { "pt-BR": string; "en-US": string };
  tradeOffs: { "pt-BR": string; "en-US": string };
}

const ARCHITECTURE_TIERS: ArchitectureTier[] = [
  {
    id: "edge-cdn",
    name: {
      "pt-BR": "1. Edge CDN & Caching Distribuído",
      "en-US": "1. Distributed Edge CDN & Caching",
    },
    role: {
      "pt-BR": "Roteamento inteligente, terminação TLS, compressão Brotli e edge caching agressivo.",
      "en-US": "Smart geo-routing, TLS termination, Brotli compression, and aggressive edge caching.",
    },
    tech: ["Akamai CDN", "Brotli Edge", "HTTP/2 & HTTP/3", "GeoDNS"],
    latency: "< 15ms TTFB",
    availability: "99.999%",
    cacheStrategy: {
      "pt-BR": "Stale-While-Revalidate (SWR) com TTL de 300s em páginas estáticas e bypass para sessões autenticadas.",
      "en-US": "Stale-While-Revalidate (SWR) with 300s TTL on static pages; bypass for authenticated sessions.",
    },
    resilience: {
      "pt-BR": "Origin Shield contra picos de tráfego (Black Friday) e fallback automático para página estática de contingência.",
      "en-US": "Origin Shield against traffic spikes (Black Friday) and automatic fallback to static emergency pages.",
    },
    architecturalRationale: {
      "pt-BR": "Absorver 92% do tráfego estático na borda, desonerando servidores de renderização e garantindo LCP sub-segundo.",
      "en-US": "Absorb 92% of static traffic at edge, freeing up SSR servers and ensuring sub-second LCP.",
    },
    tradeOffs: {
      "pt-BR": "Complexidade de invalidação instantânea de cache vs. economia de 70% em custo de computação cloud.",
      "en-US": "Instant cache invalidation complexity vs. 70% reduction in cloud compute costs.",
    },
  },
  {
    id: "ssr-cluster",
    name: {
      "pt-BR": "2. Cluster Next.js Node SSR & Streaming",
      "en-US": "2. Next.js Node SSR & Streaming Cluster",
    },
    role: {
      "pt-BR": "Renderização híbrida (SSR Streaming + ISR), injeção de SEO técnico e orquestração de Micro Frontends.",
      "en-US": "Hybrid rendering (SSR Streaming + ISR), technical SEO injection, and Micro Frontend orchestration.",
    },
    tech: ["Next.js 14", "React Server Components", "Node.js Cluster", "Docker Kubernetes (EKS)"],
    latency: "35ms - 65ms",
    availability: "99.99%",
    cacheStrategy: {
      "pt-BR": "Incremental Static Regeneration (ISR) em páginas de produto e catálogo com revalidação on-demand.",
      "en-US": "Incremental Static Regeneration (ISR) on catalog/product pages with on-demand revalidation.",
    },
    resilience: {
      "pt-BR": "Autoscaling horizontal baseado em RPS e CPU; circuit breakers em chamadas para APIs downstream.",
      "en-US": "Horizontal autoscaling based on RPS/CPU; circuit breakers on all downstream API invocations.",
    },
    architecturalRationale: {
      "pt-BR": "Garantir 100% de indexabilidade por bots de busca e primeiro byte com shell visual imediato para 19M+ usuários.",
      "en-US": "Guarantee 100% search engine indexability and instant initial UI shell for 19M+ monthly active users.",
    },
    tradeOffs: {
      "pt-BR": "Consumo de memória do SSR vs. ganhos maciços de SEO orgânico e First Contentful Paint.",
      "en-US": "SSR server memory consumption vs. massive organic SEO gains and fast First Contentful Paint.",
    },
  },
  {
    id: "micro-frontends",
    name: {
      "pt-BR": "3. Micro Frontends & Module Federation",
      "en-US": "3. Micro Frontends & Module Federation",
    },
    role: {
      "pt-BR": "Desacoplamento de domínio entre times autônomos: Checkout, Catálogo, Busca, Conta e PDP.",
      "en-US": "Domain decoupling across autonomous teams: Checkout, Catalog, Search, Account, and PDP.",
    },
    tech: ["Webpack Module Federation", "TypeScript Shared Contracts", "Design System UI", "Turborepo"],
    latency: "< 5ms (In-Memory)",
    availability: "Isolamento Total",
    cacheStrategy: {
      "pt-BR": "Carregamento assíncrono de remotes com fallbacks de erro (Error Boundaries) por domínio.",
      "en-US": "Async loading of federated remotes with isolated Error Boundaries per domain.",
    },
    resilience: {
      "pt-BR": "Se o checkout ou busca externa oscilar, a home e o catálogo continuam servindo produtos normalmente.",
      "en-US": "If checkout or search external remote fails, home and catalog continue operating uninterrupted.",
    },
    architecturalRationale: {
      "pt-BR": "Permitir múltiplos deploys diários simultâneos sem risco de regressão cruzada entre squads.",
      "en-US": "Enable multiple simultaneous daily deployments without cross-squad regression risks.",
    },
    tradeOffs: {
      "pt-BR": "Governança estrita de dependências compartilhadas vs. agilidade de entrega de mais de 80 engenheiros.",
      "en-US": "Strict governance of shared singleton dependencies vs. rapid delivery across 80+ engineers.",
    },
  },
  {
    id: "backend-bff",
    name: {
      "pt-BR": "4. BFF Gateway & Integração de APIs",
      "en-US": "4. BFF Gateway & API Aggregation",
    },
    role: {
      "pt-BR": "Agregação de microsserviços legados em endpoints otimizados para clientes web e mobile.",
      "en-US": "Aggregating legacy microservices into lightweight endpoints tailored for web and mobile clients.",
    },
    tech: ["Node.js", "GraphQL / REST", "Zod Validation", "OpenTelemetry Tracing"],
    latency: "20ms - 40ms",
    availability: "99.98%",
    cacheStrategy: {
      "pt-BR": "Cache compartilhado em Redis com TTL adaptativo baseado no comportamento de preço e estoque.",
      "en-US": "Shared Redis cache with adaptive TTL driven by real-time pricing and stock volatility.",
    },
    resilience: {
      "pt-BR": "Retry exponencial com jitter, timeout agressivo (800ms) e degradação suave de dados secundários.",
      "en-US": "Exponential backoff with jitter, aggressive timeouts (800ms), and graceful degradation of secondary metadata.",
    },
    architecturalRationale: {
      "pt-BR": "Eliminar over-fetching de dados na rede móvel e blindar a interface contra instabilidades de sistemas legados.",
      "en-US": "Eliminate network over-fetching on mobile and shield the UI from legacy backend flakiness.",
    },
    tradeOffs: {
      "pt-BR": "Camada adicional de manutenção de gateway vs. payloads 65% mais leves e seguros.",
      "en-US": "Additional gateway maintenance layer vs. 65% lighter, securely validated client payloads.",
    },
  },
];

interface MetricComparison {
  metric: string;
  before: string;
  after: string;
  delta: string;
  impact: { "pt-BR": string; "en-US": string };
}

const COMPARISON_METRICS: MetricComparison[] = [
  {
    metric: "Largest Contentful Paint (LCP)",
    before: "4.2s (Ruim)",
    after: "1.1s (Excelente)",
    delta: "-73%",
    impact: {
      "pt-BR": "Tempo de renderização principal reduzido drasticamente, elevando pontuação no Google Core Web Vitals.",
      "en-US": "Main content paint time slashed drastically, achieving top scores in Google Core Web Vitals.",
    },
  },
  {
    metric: "Interaction to Next Paint (INP)",
    before: "380ms (Ruim)",
    after: "32ms (Verde)",
    delta: "-91%",
    impact: {
      "pt-BR": "Eliminação de bloqueios na main thread através de code-splitting e desacoplamento de scripts de terceiros.",
      "en-US": "Eliminated main thread blocking via surgical code-splitting and third-party script isolation.",
    },
  },
  {
    metric: "Disponibilidade na Black Friday",
    before: "Instabilidades frequentes",
    after: "99.99% (0 Downtime)",
    delta: "100% SLA",
    impact: {
      "pt-BR": "Suportou pico de tráfego com 19M+ usuários sem degradação na taxa de conversão ou checkout.",
      "en-US": "Handled massive traffic peak with 19M+ users with zero checkout degradation.",
    },
  },
  {
    metric: "Tráfego Orgânico & Conversão",
    before: "Indexação parcial",
    after: "+18% Conversão Orgânica",
    delta: "+18%",
    impact: {
      "pt-BR": "Migração para SSR dinâmico e SEO estruturado resultou em aumento de receita direta de milhões de reais.",
      "en-US": "Dynamic SSR and structured technical SEO migration generated direct millions in organic revenue.",
    },
  },
];

export const InteractiveArchitecture: React.FC<{ locale: "pt-BR" | "en-US" }> = ({
  locale,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>("ssr-cluster");
  const [activeTab, setActiveTab] = useState<"diagram" | "metrics">("diagram");

  const isPt = locale === "pt-BR";
  const selectedTier =
    ARCHITECTURE_TIERS.find((t) => t.id === selectedTierId) || ARCHITECTURE_TIERS[0];

  return (
    <div className="w-full my-12 rounded-3xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden transition-colors">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <Activity className="w-3 h-3 animate-pulse" />
              {isPt ? "ARQUITETURA DE ALTA ESCALA" : "HIGH-SCALE SYSTEM ARCHITECTURE"}
            </span>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500">
              {isPt ? "Caso Real: 19M+ Usuários" : "Production Case: 19M+ MAU"}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {isPt
              ? "Laboratório de Arquitetura: Frontend Distribuído & Resiliência"
              : "Architecture Lab: Distributed Frontend & Resilience"}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            {isPt
              ? "Explore as camadas arquiteturais reais projetadas para suportar o maior e-commerce do Brasil com zero downtime e máxima performance."
              : "Explore the real architectural tiers designed to sustain Brazil's highest-volume e-commerce with zero downtime and peak performance."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("diagram")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === "diagram"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {isPt ? "Diagrama Interativo" : "Interactive Diagram"}
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === "metrics"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {isPt ? "Antes vs. Depois" : "Before vs. After"}
          </button>
        </div>
      </div>

      {activeTab === "diagram" ? (
        <div className="p-6 sm:p-8 space-y-8">
          {/* Architecture Pipeline Flow Visualizer */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              {isPt ? "Pipeline de Requisição & Camadas (Clique para inspecionar):" : "Request Pipeline & Tiers (Click to inspect):"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ARCHITECTURE_TIERS.map((tier, idx) => {
                const isSelected = tier.id === selectedTierId;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`relative p-4 rounded-2xl text-left border transition-all duration-200 ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/80 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/40"
                        : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                        LAYER 0{idx + 1}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>

                    <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">
                      {tier.name[locale].split(". ")[1]}
                    </div>

                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      ⚡ {tier.latency}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector Panel for Selected Tier */}
          <div className="p-6 sm:p-7 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-500" />
                  <span>{selectedTier.name[locale]}</span>
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                  {selectedTier.role[locale]}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
                  SLA: {selectedTier.availability}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {selectedTier.latency}
                </span>
              </div>
            </div>

            {/* Deep Technical Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Stack & Cache */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono uppercase text-zinc-500 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isPt ? "Tecnologias & Padrões" : "Technologies & Standards"}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTier.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-zinc-500 font-semibold mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isPt ? "Estratégia de Cache" : "Caching Strategy"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {selectedTier.cacheStrategy[locale]}
                  </p>
                </div>
              </div>

              {/* Resilience & Trade-offs */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono uppercase text-zinc-500 font-semibold mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>{isPt ? "Resiliência & Tolerância a Falhas" : "Resilience & Fault Tolerance"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {selectedTier.resilience[locale]}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase text-zinc-500 font-semibold mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isPt ? "Decisão & Trade-offs Arquiteturais" : "Architectural Rationale & Trade-offs"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {selectedTier.architecturalRationale[locale]}
                  </p>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 italic">
                    ⚖️ {selectedTier.tradeOffs[locale]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Before vs After Metrics Panel */
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
            {isPt
              ? "Comparativo de Métricas de Negócio & Performance (Antes vs. Depois da Re-arquitetura):"
              : "Business & Performance Metrics Comparison (Before vs. After Re-architecture):"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPARISON_METRICS.map((item) => (
              <div
                key={item.metric}
                className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {item.metric}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    {item.delta}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/15">
                    <span className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400 block font-semibold">
                      {isPt ? "Antes (Legado)" : "Before (Legacy)"}
                    </span>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {item.before}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 block font-semibold">
                      {isPt ? "Depois (Re-arquitetura)" : "After (New Architecture)"}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {item.after}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                  {item.impact[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
