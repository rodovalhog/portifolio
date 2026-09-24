"use client";

import React, { useState } from "react";
import { Project, SupportedLocale, getLocalized } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import {
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Zap,
  Layers,
  Cpu,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { PerformanceMicrofrontendCaseStudy } from "./PerformanceMicrofrontendCaseStudy";

interface Props {
  projects: Project[];
  locale: SupportedLocale;
}

export function CasesExplorer({ projects, locale }: Props) {
  const t = getTranslations(locale);
  const isPt = locale === "pt-BR";
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: t.casesPage.allCases, icon: Filter },
    { id: "performance", label: t.casesPage.filterPerformance, icon: Zap },
    { id: "scale", label: t.casesPage.filterScale, icon: Layers },
    { id: "architecture", label: t.casesPage.filterArchitecture, icon: Cpu },
    { id: "mobile", label: t.casesPage.filterFintech, icon: Smartphone },
    { id: "ai", label: t.casesPage.filterAI, icon: Sparkles },
  ];

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "performance") {
      return (
        project.skills.includes("performance") ||
        project.technologies.some((tech) =>
          ["Performance", "SSR", "Clinic.js", "Core Web Vitals"].some((k) =>
            tech.toLowerCase().includes(k.toLowerCase())
          )
        )
      );
    }
    if (activeCategory === "scale") {
      return (
        project.id === "ecommerce-search-engine" ||
        project.id === "performance-microfrontend-ssr" ||
        project.metrics.some((m) => m.value.includes("M+") || m.value.includes("k"))
      );
    }
    if (activeCategory === "architecture") {
      return (
        project.skills.includes("architecture") ||
        project.technologies.includes("Module Federation") ||
        project.technologies.includes("Clean Architecture")
      );
    }
    if (activeCategory === "mobile") {
      return (
        project.id === "mobile-hybrid-cards-bradesco" ||
        project.skills.includes("backend") ||
        project.technologies.includes("WebView")
      );
    }
    if (activeCategory === "ai") {
      return (
        project.id === "ai-career-platform" ||
        project.skills.includes("ai") ||
        project.technologies.includes("WebMCP")
      );
    }
    return true;
  });

  return (
    <div className="space-y-16">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/60 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              {cat.id !== "all" && (
                <span className="text-[10px] opacity-60">
                  (
                  {
                    projects.filter((p) => {
                      if (cat.id === "performance") return p.skills.includes("performance");
                      if (cat.id === "scale") return p.id.includes("search") || p.id.includes("performance");
                      if (cat.id === "architecture") return p.skills.includes("architecture");
                      if (cat.id === "mobile") return p.id.includes("bradesco");
                      if (cat.id === "ai") return p.skills.includes("ai");
                      return true;
                    }).length
                  }
                  )
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Featured Deep-Dive Section (Content of case.md) */}
      {(activeCategory === "all" || activeCategory === "performance" || activeCategory === "scale") && (
        <section id="case-study-performance-ssr" className="scroll-mt-20">
          <PerformanceMicrofrontendCaseStudy locale={locale} />
        </section>
      )}

      {/* Grid of Other Real-World Success Cases */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
            {isPt ? "PORTFÓLIO DE ENTREGAS" : "PRODUCTION DELIVERIES"}
          </span>
          <h3 className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {isPt ? "Mais Cases de Sucesso de Alta Escala" : "Additional High-Scale Success Cases"}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {isPt
              ? "Projetos em produção onde atuei na concepção, liderança de engenharia e sustentação de arquiteturas críticas."
              : "Production initiatives where I led technical design, architectural decisions, and critical system reliability."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isPerformanceCase = project.slug === "performance-microfrontend-ssr";
            return (
              <div
                key={project.id}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                      {project.period}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {project.slug === "performance-microfrontend-ssr"
                        ? "Deep Dive Included"
                        : "Verified Production"}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <a
                      href={
                        isPerformanceCase
                          ? "#case-study-performance-ssr"
                          : `/${locale}/cases/${project.slug}`
                      }
                      className="inline-flex items-center gap-2"
                    >
                      <span>{getLocalized(project.title, locale)}</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </h4>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    {getLocalized(project.tagline, locale)}
                  </p>

                  {/* Metrics preview */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 mb-6 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800">
                      {project.metrics.slice(0, 3).map((m, idx) => (
                        <div key={idx}>
                          <div className="text-[10px] font-mono text-zinc-500 truncate">
                            {getLocalized(m.label, locale)}
                          </div>
                          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                            <span>{m.value}</span>
                          </div>
                          {m.change && (
                            <div className="text-[10px] font-mono text-zinc-400 truncate">
                              {m.change}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mb-4">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-800"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="text-[11px] font-mono text-zinc-500 px-1 py-0.5">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>

                  <a
                    href={
                      isPerformanceCase
                        ? "#case-study-performance-ssr"
                        : `/${locale}/cases/${project.slug}`
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <span>{isPerformanceCase ? t.casesPage.readDeepDive : t.casesPage.viewCase}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
