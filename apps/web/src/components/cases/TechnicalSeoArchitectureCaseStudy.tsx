"use client";

import React, { useState, useEffect } from "react";
import { SupportedLocale } from "@portfolio/domain";
import {
  TrendingUp,
  Search,
  Globe,
  Layers,
  Link2,
  FileCode,
  ShieldCheck,
  Maximize2,
  X,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Compass,
  Zap,
  Target,
  ExternalLink,
} from "lucide-react";

interface Props {
  locale: SupportedLocale;
}

export function TechnicalSeoArchitectureCaseStudy({ locale }: Props) {
  const isPt = locale === "pt-BR";
  const [activeTab, setActiveTab] = useState<"overview" | "urls">("overview");
  const [activeFrente, setActiveFrente] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const frentes = [
    {
      id: 1,
      name: isPt ? "Padrão de URLs & Roteamento" : "URL Standards & Semantic Routing",
      tag: isPt ? "Hierarquia RESTful /c/..." : "RESTful /c/... Routing",
      icon: Compass,
      color: "emerald",
    },
    {
      id: 2,
      name: isPt ? "Canonicalização & Crawl Budget" : "Canonical Tags & Crawl Budget",
      tag: isPt ? "Zero canibalização de facetas" : "Zero facet cannibalization",
      icon: Link2,
      color: "indigo",
    },
    {
      id: 3,
      name: isPt ? "SSR & Schema.org (JSON-LD)" : "SSR & Schema.org (JSON-LD)",
      tag: isPt ? "BreadcrumbList & CollectionPage" : "BreadcrumbList & Rich Snippets",
      icon: FileCode,
      color: "amber",
    },
    {
      id: 4,
      name: isPt ? "Top Queries & Penetração SERP" : "Top Queries & SERP Penetration",
      tag: isPt ? "Posição 9 → 2 no Google" : "Ranked #2 on Google",
      icon: Target,
      color: "blue",
    },
    {
      id: 5,
      name: isPt ? "Diagnóstico de CTR & Próximos Passos" : "CTR Optimization & Roadmap",
      tag: isPt ? "Sitemaps & Backlog Estratégico" : "Sitemaps & Meta Title Tests",
      icon: Sparkles,
      color: "rose",
    },
  ];

  const topPagesData = [
    {
      url: "https://www.casasbahia.com.br/c/eletrodomesticos?filtro=categoria-c13",
      category: isPt ? "Eletrodomésticos" : "Home Appliances",
      clicks: "34.634",
      prevClicks: "0",
      diffClicks: "+34.634 (▲ +3.463.400%)",
      impressions: "6.991.788",
    },
    {
      url: "https://www.casasbahia.com.br/c/moveis?filtro=categoria-c93",
      category: isPt ? "Móveis" : "Furniture",
      clicks: "31.636",
      prevClicks: "0",
      diffClicks: "+31.636 (▲ +3.163.600%)",
      impressions: "7.421.874",
    },
    {
      url: "https://www.casasbahia.com.br/c/telefones-e-celulares?filtro=categoria-c38",
      category: isPt ? "Telefones e Celulares" : "Phones & Smartphones",
      clicks: "5.894",
      prevClicks: "0",
      diffClicks: "+5.894 (▲ +589.400%)",
      impressions: "4.033.621",
    },
    {
      url: "https://www.casasbahia.com.br/c/tv-e-video?filtro=categoria-c1",
      category: isPt ? "TV e Vídeo" : "TV & Audio",
      clicks: "3.635",
      prevClicks: "0",
      diffClicks: "+3.635 (▲ +363.500%)",
      impressions: "2.537.426",
    },
    {
      url: "https://www.casasbahia.com.br/c/eletrodomesticos/lavadoras/maquina-de-lavar-acima-de-10-kg?filtro=categoria-c13_c24_c168",
      category: isPt ? "Máquinas de Lavar (>10kg)" : "Washing Machines (>10kg)",
      clicks: "1.990",
      prevClicks: "0",
      diffClicks: "+1.990 (▲ +199.000%)",
      impressions: "143.219",
    },
    {
      url: "https://www.casasbahia.com.br/c/eletrodomesticos/refrigeradores/geladeira-2-portas?filtro=categoria-c13_c14_c143",
      category: isPt ? "Geladeiras 2 Portas" : "Double-door Refrigerators",
      clicks: "1.198",
      prevClicks: "0",
      diffClicks: "+1.198 (▲ +119.800%)",
      impressions: "318.590",
    },
    {
      url: "https://www.casasbahia.com.br/c/telefones-e-celulares/smartphones/iphone?filtro=categoria-c38_c326_c3267",
      category: "iPhones",
      clicks: "1.027",
      prevClicks: "0",
      diffClicks: "+1.027 (▲ +102.700%)",
      impressions: "95.997",
    },
    {
      url: "https://www.casasbahia.com.br/c/eletroportateis/processador-de-alimentos?filtro=categoria-c73_c86",
      category: isPt ? "Processadores de Alimentos" : "Food Processors",
      clicks: "588",
      prevClicks: "0",
      diffClicks: "+588 (▲ +58.800%)",
      impressions: "182.919",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Banner with Executive Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 p-6 sm:p-10 shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-300 dark:border-blue-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPt ? "Case de Arquitetura & SEO Técnico" : "Technical SEO & Architecture Case"}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
              Grupo Casas Bahia • 19M+ Usuários
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Google Search Console Data</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100 mb-4 leading-snug">
            {isPt
              ? "Reestruturação Estrutural de URLs, Canonicalização & SEO Técnico em Alta Escala"
              : "Structural URL Hierarchy, Canonicalization & High-Scale Technical SEO"}
          </h1>

          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
            {isPt
              ? "Liderança técnica na reformulação arquitetural do padrão de roteamento de departamentos, categorias, subcategorias e coleções em um dos maiores e-commerces da América Latina. Alinhando arquitetura frontend com crawl budget e canonicalização, o tráfego orgânico saltou de 12 para 92,6K cliques (+7.717.167%) e 23,4M de impressões em 3 meses no Google Search Console."
              : "Technical lead in the architectural reengineering of department, category, subcategory, and collection route standards for one of Latin America's top e-commerce platforms. Aligning frontend architecture with crawl budget and canonicalization skyrocketed organic clicks from 12 to 92.6K (+7,717,167%) and 23.4M impressions over 3 months."}
          </p>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "Cliques Totais" : "Total Clicks"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <TrendingUp className="w-5 h-5 shrink-0" />
                <span>92,6K</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                {isPt ? "de 12 para 92.600" : "from 12 to 92.6K"}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "Impressões SERP" : "SERP Impressions"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <TrendingUp className="w-5 h-5 shrink-0" />
                <span>23,4M</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                {isPt ? "de 8,9K para 23,4M" : "from 8.9K to 23.4M"}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "Posição Média" : "Average Rank"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>#2</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                {isPt ? "era #9 (melhora 77%)" : "was #9 (77% gain)"}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "CTR Médio" : "Average CTR"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <TrendingUp className="w-5 h-5 shrink-0" />
                <span>0,4%</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                {isPt ? "crescimento de +300%" : "+300% growth (was 0.1%)"}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                {isPt ? "Top Categoria" : "Top Category"}
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                +3.4M%
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                {isPt ? "Eletro: 34,6k cliques" : "Appliances: 34.6k"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Evidence Section with Interactive Tabs & Lightbox */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>{isPt ? "TELEMETRIA REAL GOOGLE SEARCH CONSOLE" : "AUTHENTIC GSC TELEMETRY"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {isPt
                ? "Evidência Fotográfica do Impacto no Google Search Console"
                : "Photographic Evidence from Google Search Console"}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              {isPt
                ? "Capturas do painel oficial do Google Search Console comparando a performance dos últimos 3 meses contra os 3 meses anteriores ao deploy arquitetural."
                : "Screenshots from Google Search Console benchmarking performance over the last 3 months vs the preceding 3-month baseline."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
              }`}
            >
              {isPt ? "Visão Geral (Cliques & Impressões)" : "Overview (Clicks & Impressions)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("urls")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === "urls"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
              }`}
            >
              {isPt ? "Performance por URL (Top Pages)" : "Per-URL Performance"}
            </button>
          </div>
        </div>

        {/* Evidence Card Display */}
        <div className="relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-xl">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/90 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-200 font-bold">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {activeTab === "overview"
                  ? "Google Search Console • Performance: Last 3 months vs. Previous 3 months"
                  : "Google Search Console • Top Pages by Clicks & Impressions"}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedImage(
                  activeTab === "overview"
                    ? "/images/evidence/dados-google-console.jpeg"
                    : "/images/evidence/dados-das-url-google-console.jpeg"
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{isPt ? "Inspecionar em Alta Resolução" : "Inspect High-Res"}</span>
            </button>
          </div>

          {/* Image Showcase */}
          <div
            onClick={() =>
              setSelectedImage(
                activeTab === "overview"
                  ? "/images/evidence/dados-google-console.jpeg"
                  : "/images/evidence/dados-das-url-google-console.jpeg"
              )
            }
            className="cursor-zoom-in p-4 sm:p-6 bg-zinc-950 flex items-center justify-center min-h-[300px]"
            title={isPt ? "Clique para ampliar" : "Click to enlarge"}
          >
            <img
              src={
                activeTab === "overview"
                  ? "/images/evidence/dados-google-console.jpeg"
                  : "/images/evidence/dados-das-url-google-console.jpeg"
              }
              alt="Google Search Console Evidence"
              className="w-full h-auto max-h-[500px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.005]"
            />
          </div>

          {/* Footer Ribbon with Key Facts */}
          <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
            {activeTab === "overview" ? (
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  <strong className="text-blue-400">Total clicks:</strong> 92.6K (▲ +7.717.167%)
                </span>
                <span>
                  <strong className="text-purple-400">Total impressions:</strong> 23.4M (▲ +2.632.167%)
                </span>
                <span>
                  <strong className="text-emerald-400">Average position:</strong> #2 (▲ 77%)
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  <strong className="text-blue-400">Top 1 Eletrodomésticos:</strong> 34.634 cliques / 6.9M impr.
                </span>
                <span>
                  <strong className="text-purple-400">Top 2 Móveis:</strong> 31.636 cliques / 7.4M impr.
                </span>
                <span>
                  <strong className="text-emerald-400">Variação das URLs novas:</strong> +8.000% a +3.400.000%
                </span>
              </div>
            )}
            <span className="text-zinc-500">{isPt ? "Fonte: GSC Oficial" : "Source: Official GSC"}</span>
          </div>
        </div>
      </div>

      {/* The 5 Architectural & SEO Technical Fronts */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">
            ARQUITETURA & DECISÕES DE ENGENHARIA
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {isPt ? "As 5 Frentes da Reestruturação de SEO" : "The 5 Structural SEO Fronts"}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {isPt
              ? "Como o redesenho arquitetural do roteamento e indexabilidade transformou a performance orgânica."
              : "How architectural routing and indexing reengineering unlocked exponential organic growth."}
          </p>
        </div>

        {/* Tab Selector Horizontal */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
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
                      ? "text-blue-300 dark:text-blue-700 font-bold"
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
                    Frente 01 • ENGENHARIA DE ROTEAMENTO
                  </span>
                  <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Reestruturação do Padrão de URLs: De Caos a Hierarquia Semântica RESTful"
                      : "URL Pattern Restructuring: From Chaos to RESTful Semantic Hierarchy"}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {isPt ? "URLs Limpas & Previsíveis" : "Clean & Predictable URLs"}
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Antes da reestruturação, os filtros de catálogo utilizavam delimitadores proprietários com caracteres especiais (:^_), como em ?filtro=categoriac13:^_c14:^_c142. Essa sintaxe causava severos problemas de URL encoding (%3A%5E_), quebrava a normalização nos crawlers e impedia que o Googlebot compreendesse a taxonomia do catálogo, resultando em 0 cliques para grande parte dos departamentos (como comprovado na coluna 'Previous 3 months = 0' do GSC)."
                  : "Before restructuring, catalog filters relied on proprietary delimiters with special characters (:^_), such as ?filtro=categoriac13:^_c14:^_c142. This syntax caused severe URL encoding issues (%3A%5E_), broke crawler normalization, and prevented Googlebot from understanding catalog taxonomy, resulting in 0 clicks across major departments (verified by 'Previous 3 months = 0' in GSC)."}
              </p>

              {/* Code comparison box */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200">
                  <div className="font-bold mb-1">
                    {isPt
                      ? "// Padrão Anterior (Caracteres especiais ':^_', encoding %3A%5E_ e não-indexável):"
                      : "// Previous Pattern (Special characters ':^_', %3A%5E_ encoding & non-indexable):"}
                  </div>
                  <div className="text-rose-800 dark:text-rose-300 font-semibold break-all">
                    /c/eletrodomesticos/refrigeradores/geladeira-1-porta?filtro=categoriac13:^_c14:^_c142
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 mt-1 text-[11px]">
                    {isPt
                      ? "Filtros concatenados com delimitador ':^_' (não URL-safe, canibalização e falha de normalização no Googlebot)"
                      : "Filters concatenated with ':^_' delimiter (unsafe encoding, parameter cannibalization & crawler normalization failure)"}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
                  <div className="font-bold mb-1">
                    {isPt
                      ? "// Novo Padrão Arquitetural Implementado (100% URL-Safe e Semântico):"
                      : "// New Architectural Pattern Implemented (100% URL-Safe & Semantic):"}
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-300 font-semibold break-all">
                    /c/[departamento]/[categoria]/[subcategoria]?filtro=categoria-c[id]
                  </div>
                  <div className="text-zinc-500 mt-1 text-[11px] break-all">
                    {isPt
                      ? "Exemplo real: /c/eletrodomesticos/refrigeradores/geladeira-2-portas?filtro=categoria-c13_c14_c143 (Padronizado com '_' e hífen, ranqueando no Top 2 nacional)"
                      : "Real example: /c/eletrodomesticos/refrigeradores/geladeira-2-portas?filtro=categoria-c13_c14_c143 (Standardized with '_' and hyphen, ranking Top 2 nationally)"}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                <strong>{isPt ? "Decisão Arquitetural:" : "Architectural Decision:"}</strong>{" "}
                {isPt
                  ? "Substituição do delimitador com caracteres especiais proprietários (':^_') por uma sintaxe estritamente limpa e URL-safe ('categoria-c13_c14_c143'), combinada com separação estrita entre o slug semântico de navegação e os parâmetros de facetas com canonicalização determinística no Next.js SSR."
                  : "Replaced proprietary special-character delimiters (':^_') with a strictly clean, URL-safe syntax ('categoria-c13_c14_c143'), coupled with strict decoupling between semantic navigation slugs and facet parameters with deterministic canonicalization in Next.js SSR."}
              </div>
            </div>
          )}

          {activeFrente === 2 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    Frente 02 • CANONICALIZAÇÃO & CRAWL BUDGET
                  </span>
                  <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Ajuste na URL Canônica: Blindagem de Crawl Budget e Eliminação de Conteúdo Duplicado"
                      : "Canonical URL Engineering: Protecting Crawl Budget & Eliminating Duplicate Content"}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {isPt ? "Zero Canibalização" : "Zero Cannibalization"}
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Em e-commerces com milhões de SKUs, filtros faciais combinatórios (como marca, cor, voltagem, faixa de preço e paginação) geram bilhões de URLs variantes. Sem canonicalização e normalização precisa, o Googlebot gasta todo o crawl budget rastreando variações irrelevantes e divide a autoridade da página entre centenas de URLs idênticas."
                  : "In multi-million SKU e-commerces, combinatorial facet filters (brand, color, voltage, price ranges) spawn billions of URL permutations. Without strict canonicalization, Googlebot squanders crawl budget on duplicate pages, dividing link authority across duplicate URLs."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isPt ? "Auto-Canonicalização em Páginas Principais" : "Self-Referencing Canonicals"}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {isPt
                      ? "Páginas puras de departamento, categoria e subcategoria possuem tag canonical auto-referencial absoluta e limpa, garantindo autoridade máxima na SERP."
                      : "Category and subcategory landing pages carry clean self-referencing absolute canonical tags, concentrating PageRank and link equity."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isPt ? "Consolidação de Facetas e Filtros" : "Facet Consolidation Rules"}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {isPt
                      ? "Filtros não-indexáveis apontam sua URL canônica para o nível de categoria imediatamente superior, instruindo o Google a não criar páginas duplicadas no índice."
                      : "Non-indexable sorting and secondary filters point canonical targets back to the root category, instructing Google not to index duplicate facets."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs space-y-1">
                <div className="text-zinc-400">// Injeção de Meta Tag Canônica no _document/SSR:</div>
                <div className="text-emerald-400">
                  {`<link rel="canonical" href="https://www.casasbahia.com.br/c/eletrodomesticos/refrigeradores/geladeira-2-portas" />`}
                </div>
              </div>
            </div>
          )}

          {activeFrente === 3 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                    Frente 03 • RENDERIZAÇÃO SSR & DADOS ESTRUTURADOS
                  </span>
                  <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "SSR no Next.js com Schema.org: Rich Snippets e Rastreabilidade Imediata"
                      : "Next.js SSR with Schema.org: Rich Snippets and Instant Indexability"}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  JSON-LD Automatizado
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Para superar a limitação de crawlers que não executam JavaScript client-side de forma eficiente, garantimos que 100% dos dados semânticos fossem gerados no servidor (Server-Side Rendering) com injeção de microdados padronizados pelo Schema.org."
                  : "To circumvent bot crawl delays with heavy client-side JavaScript, we ensured 100% of semantic page markup was synthesized on the server via Next.js SSR with standardized Schema.org JSON-LD microdata."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">BreadcrumbList</div>
                  <p className="text-zinc-500 font-sans text-[11px]">
                    {isPt
                      ? "Caminho navegacional completo (Home > Eletrodomésticos > Refrigeradores > 2 Portas) mapeado para sitelinks no Google."
                      : "Full breadcrumb trail mapped directly to Google search sitelinks."}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">CollectionPage</div>
                  <p className="text-zinc-500 font-sans text-[11px]">
                    {isPt
                      ? "Declaração explícita de página de coleção com contagem de produtos e metadados de categoria."
                      : "Explicit catalog collection declaration with item counts and category metadata."}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">ItemList & Products</div>
                  <p className="text-zinc-500 font-sans text-[11px]">
                    {isPt
                      ? "Cards de produto pré-renderizados no HTML inicial para indexação de títulos, imagens e faixas de preço."
                      : "Product cards pre-rendered in initial HTML payload for rich SERP pricing snippets."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeFrente === 4 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                    Frente 04 • PENETRAÇÃO NA SERP & TOP QUERIES
                  </span>
                  <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Subida Histórica de Posição: Média Saiu de 9 para 2 no Google"
                      : "Historic SERP Climb: Average Position Jumped from #9 to #2"}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Rank #2 Consolidado
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "A combinação de páginas de categorias estruturadas com alta velocidade de carregamento (Core Web Vitals otimizados) fez a posição média saltar de 9 para 2 (ganho de 77%). As páginas de categoria passaram a competir e vencer players concorrentes em buscas de alto volume e intenção de compra imediata."
                  : "The pairing of structurally sound category pages with high loading speeds (optimized Core Web Vitals) pushed average ranking from #9 to #2 (a 77% improvement). Category routes outranked rival retail giants across top-tier commercial queries."}
              </p>

              {/* Top queries pill badges */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-zinc-500 font-bold">
                  {isPt ? "Top Queries com Crescimento Expressivo:" : "Top High-Growth Queries:"}
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-800 dark:text-blue-300 font-bold">
                    &quot;casa bahia&quot; • Alta dominância de marca
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold">
                    &quot;geladeira duas portas&quot; • Top 1 SERP
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-800 dark:text-purple-300 font-bold">
                    &quot;processador de alimentos&quot; • Escala nacional
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold">
                    &quot;maquina de lavar acima de 10 kg&quot; • Long-tail comercial
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold">
                    &quot;sofas&quot; / &quot;guarda roupas&quot; • Departamento móveis
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeFrente === 5 && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">
                    Frente 05 • ANÁLISE CRÍTICA & PRÓXIMOS PASSOS
                  </span>
                  <h3 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                    {isPt
                      ? "Oportunidade do CTR (0,4%) & Backlog Estratégico de Escala"
                      : "CTR Opportunity (0.4%) & Strategic Architectural Roadmap"}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Visão de Futuro
                </span>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {isPt
                  ? "Com 23,4 milhões de impressões e posição média no topo do Google, o CTR de 0,4% (mesmo tendo subido +300%) revela a maior alavanca de crescimento inexplorada do projeto. Cada 0,1% adicional de CTR representa ~23.400 novos cliques orgânicos diretos sem custo de mídia paga."
                  : "With 23.4M impressions and #2 average rank, the 0.4% CTR (despite a 300% surge) highlights the highest-leverage growth vector. Every 0.1% boost in CTR delivers ~23,400 incremental organic clicks without ad spend."}
              </p>

              {/* Roadmap Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>1. Sitemaps Dinâmicos</span>
                  </div>
                  <p className="text-zinc-500 font-sans text-[11px] leading-relaxed">
                    {isPt
                      ? "Geração granular de sitemaps XML segmentados por departamento com tags lastmod automáticas baseadas em atualização de catálogo."
                      : "Dynamic XML sitemaps partitioned by department with real-time lastmod timestamps."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>2. Otimização de CTR</span>
                  </div>
                  <p className="text-zinc-500 font-sans text-[11px] leading-relaxed">
                    {isPt
                      ? "Testes A/B em meta title tags e meta descriptions persuasivas com diferenciais competitivos (parcelamento, frete grátis)."
                      : "A/B testing meta title tags and persuasive descriptions featuring installment offers and free shipping."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>3. Expansão Long-Tail</span>
                  </div>
                  <p className="text-zinc-500 font-sans text-[11px] leading-relaxed">
                    {isPt
                      ? "Indexação seletiva de combinações de alta intenção comercial (ex: 'geladeira frost free inox 110v')."
                      : "Selective indexing of high-intent multi-attribute combos (e.g. 'frost free stainless steel refrigerator')."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Pages Performance Table */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider font-bold">
            DADOS AUDITADOS DO GOOGLE SEARCH CONSOLE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {isPt
              ? "Performance por Categoria: As URLs Que Lideraram o Crescimento"
              : "Category Performance: Top URLs Powering the Growth"}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {isPt
              ? "Extração fiel das Top Pages do GSC comprovando a decolagem a partir de zero cliques após a implantação do novo padrão de rotas."
              : "Verbatim extract of top GSC landing pages illustrating the explosive surge from zero baseline clicks."}
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-3.5">{isPt ? "Categoria / Departamento" : "Category / Department"}</th>
                <th className="p-3.5">{isPt ? "Cliques (Últimos 3m)" : "Clicks (Last 3m)"}</th>
                <th className="p-3.5">{isPt ? "Cliques Anteriores" : "Prev. Clicks"}</th>
                <th className="p-3.5">{isPt ? "Variação Líquida" : "Net Growth"}</th>
                <th className="p-3.5">{isPt ? "Impressões" : "Impressions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              {topPagesData.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{row.category}</div>
                    <div className="text-[10px] text-zinc-500 truncate max-w-md mt-0.5">{row.url}</div>
                  </td>
                  <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400">{row.clicks}</td>
                  <td className="p-3.5 text-zinc-400">{row.prevClicks}</td>
                  <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">{row.diffClicks}</td>
                  <td className="p-3.5 font-mono">{row.impressions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-7xl w-full max-h-[92vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/90">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-400" />
                <div>
                  <h4 className="text-sm font-bold font-mono text-zinc-100">
                    Google Search Console • Evidência de Performance SEO
                  </h4>
                  <p className="text-xs font-mono text-zinc-400">
                    Casas Bahia • Comparativo de 3 meses pós-reestruturação arquitetural
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title={isPt ? "Fechar (Esc)" : "Close (Esc)"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 sm:p-6 overflow-auto max-h-[75vh] flex items-center justify-center bg-zinc-950">
              <img
                src={selectedImage}
                alt="Google Search Console Expanded Evidence"
                className="w-full h-auto max-h-[72vh] object-contain rounded-lg"
              />
            </div>

            {/* Modal Footer Summary */}
            <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="text-blue-400 font-bold">92,6K Cliques (+7.717.167%)</span>
                <span className="text-zinc-600">|</span>
                <span className="text-purple-400 font-bold">23,4M Impressões (+2.632.167%)</span>
                <span className="text-zinc-600">|</span>
                <span className="text-emerald-400 font-bold">Posição Média #2</span>
              </div>
              <span className="text-zinc-500">Pressione ESC para fechar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
