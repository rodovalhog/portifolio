"use client";

import React, { useState } from "react";
import {
  Quote,
  Award,
  Users,
  FileCheck2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: { "pt-BR": string; "en-US": string };
  company: string;
  relationship: { "pt-BR": string; "en-US": string };
  content: { "pt-BR": string; "en-US": string };
  highlight: { "pt-BR": string; "en-US": string };
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "rec-1",
    name: "Liderança de Engenharia",
    role: {
      "pt-BR": "Engineering Manager & Tech Director",
      "en-US": "Engineering Manager & Tech Director",
    },
    company: "E-commerce de Alta Escala (19M+ MAU)",
    relationship: {
      "pt-BR": "Gestor direto em projetos de alta criticidade",
      "en-US": "Direct manager in mission-critical platforms",
    },
    highlight: {
      "pt-BR": "Pilar técnico na migração para arquitetura distribuída e sustentação de 19M+ usuários",
      "en-US": "Key technical driver in distributed architecture migration and 19M+ user scaling",
    },
    content: {
      "pt-BR":
        "O Guilherme foi peça-chave na modernização arquitetural do ecossistema de frontend. Sua postura de ownership, capacidade de navegar em restrições extremas de escala (como a Black Friday com zero downtime) e rigor na implementação de Clean Architecture colocam sua senioridade no topo da engenharia de software.",
      "en-US":
        "Guilherme was instrumental in modernizing our frontend architecture ecosystem. His strong ownership, ability to navigate extreme scale constraints (such as Black Friday with zero downtime), and rigorous Clean Architecture implementation set his seniority at the highest standard of software engineering.",
    },
  },
  {
    id: "rec-2",
    name: "Parceiro de Arquitetura",
    role: {
      "pt-BR": "Staff Software Engineer / Arquiteto",
      "en-US": "Staff Software Engineer / Architect",
    },
    company: "Grupo Casas Bahia",
    relationship: {
      "pt-BR": "Parceiro em definições técnicas transversais",
      "en-US": "Cross-functional architecture partner",
    },
    highlight: {
      "pt-BR": "Elevação contínua da barra técnica, RFCs rigorosas e mentoria",
      "en-US": "Elevating technical standards, rigorous RFCs, and mentorship",
    },
    content: {
      "pt-BR":
        "O que mais se destaca no Guilherme é a clareza ao comunicar trade-offs complexos. Em discussões de RFCs e revisões de design de sistemas, ele sempre conecta métricas técnicas (LCP, latência, isolamento de falhas) aos objetivos estratégicos do negócio, mentorando e elevando o nível de mais de 80 engenheiros.",
      "en-US":
        "What stands out most about Guilherme is his clarity in communicating complex trade-offs. In RFC discussions and system design reviews, he consistently bridges technical metrics (LCP, latency, fault isolation) with strategic business goals, mentoring and uplifting more than 80 engineers.",
    },
  },
  {
    id: "rec-3",
    name: "Liderança de Produto",
    role: {
      "pt-BR": "Group Product Manager (GPM)",
      "en-US": "Group Product Manager (GPM)",
    },
    company: "Plataformas Digitais",
    relationship: {
      "pt-BR": "Parceria estratégica entre Engenharia e Produto",
      "en-US": "Strategic Engineering-Product partnership",
    },
    highlight: {
      "pt-BR": "Foco obsessivo em impacto no usuário final e métricas de conversão",
      "en-US": "Relentless focus on end-user experience and conversion uplift",
    },
    content: {
      "pt-BR":
        "Trabalhar com o Guilherme é ter a certeza de que a engenharia pensa como dona do produto. Ele não entrega apenas código; ele investiga a jornada do cliente, combate ativamente gargalos de performance e propõe inovações que aumentam a conversão orgânica e a fidelização.",
      "en-US":
        "Partnering with Guilherme guarantees that engineering thinks as a product co-owner. He doesn't just deliver code; he interrogates the customer journey, actively eliminates performance bottlenecks, and champions technical innovations that directly boost organic conversion.",
    },
  },
];

export const LeadershipTestimonials: React.FC<{ locale: "pt-BR" | "en-US" }> = ({
  locale,
}) => {
  const [activeTab, setActiveTab] = useState<"testimonials" | "adr">("testimonials");
  const isPt = locale === "pt-BR";

  return (
    <div className="w-full my-12 rounded-3xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <Award className="w-3.5 h-3.5" />
              {isPt ? "LIDERANÇA & RECONHECIMENTO" : "LEADERSHIP & PEER RECOGNITION"}
            </span>
            <span className="text-xs font-mono text-zinc-500">
              {isPt ? "Impacto Comprovado" : "Verified Impact"}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {isPt
              ? "Reconhecimento Técnico & Práticas de Liderança"
              : "Peer Endorsements & Engineering Leadership"}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            {isPt
              ? "Como pares de engenharia, gestores e parceiros de produto avaliam a atuação técnica, mentoria e liderança arquitetural de Guilherme."
              : "How engineering peers, leaders, and product partners evaluate Guilherme's architectural decisions, mentorship, and system delivery."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === "testimonials"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {isPt ? "Endossos & Depoimentos" : "Endorsements"}
          </button>
          <button
            onClick={() => setActiveTab("adr")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
              activeTab === "adr"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {isPt ? "Exemplo de ADR (Design Doc)" : "Sample ADR (Design Doc)"}
          </button>
        </div>
      </div>

      {activeTab === "testimonials" ? (
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors shadow-2xs"
            >
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-emerald-500/60" />
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                  {item.highlight[locale]}
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  "{item.content[locale]}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-0.5">
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {item.role[locale]}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.company}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  {item.relationship[locale]}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ADR (Architectural Decision Record) Preview */
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900 text-zinc-100 font-mono text-xs sm:text-sm leading-relaxed border border-zinc-800 shadow-inner overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800 text-xs text-zinc-400">
              <span className="text-emerald-400 font-bold">ADR-042: Hybrid Micro Frontends via Module Federation</span>
              <span>Status: APPROVED & IN PRODUCTION</span>
            </div>

            <div className="space-y-4 text-zinc-300 text-xs">
              <div>
                <span className="text-zinc-500 uppercase block font-bold mb-1">
                  1. Context & Problem Statement
                </span>
                <p>
                  {isPt
                    ? "Com mais de 80 engenheiros atuando no monolito de frontend, o tempo de build ultrapassava 25 minutos e o risco de regressões cruzadas entre Checkout e Catálogo era crítico durante eventos de alto tráfego (Black Friday)."
                    : "With 80+ engineers working on a monolithic frontend, CI build times exceeded 25 minutes and cross-domain regression risks between Checkout and Catalog were critical during high-traffic surges (Black Friday)."}
                </p>
              </div>

              <div>
                <span className="text-zinc-500 uppercase block font-bold mb-1">
                  2. Decision Drivers
                </span>
                <p>
                  • Zero Downtime & Fault Isolation (se a busca oscilar, o checkout deve operar).<br />
                  • Core Web Vitals (manter LCP &lt; 1.2s e sem duplicação de bundles React na memória).<br />
                  • Deploys autônomos múltiplos por dia sem rebuild do container host.
                </p>
              </div>

              <div>
                <span className="text-zinc-500 uppercase block font-bold mb-1">
                  3. Considered Options
                </span>
                <p>
                  A) IFrames isolados (Rejeitado: terrível para Core Web Vitals, SEO e quebra de acessibilidade).<br />
                  B) Server-Side Includes / Edge Routing puro (Rejeitado: falta de persistência de estado do carrinho).<br />
                  C) Webpack Module Federation com Next.js SSR Streaming (Escolhido: isolamento por squad + contratos TypeScript).
                </p>
              </div>

              <div>
                <span className="text-zinc-500 uppercase block font-bold mb-1">
                  4. Production Outcome & Validation
                </span>
                <p className="text-emerald-400">
                  {isPt
                    ? "✓ Tempo de deploy reduzido de 25 min para 3.5 min por squad.<br />✓ 0 regressões cruzadas registradas durante o trimestre da Black Friday.<br />✓ LCP mobile melhorou de 4.2s para 1.1s com Edge Caching."
                    : "✓ Deploy time slashed from 25 min to 3.5 min per squad.<br />✓ 0 cross-domain regressions recorded across Black Friday quarter.<br />✓ Mobile LCP improved from 4.2s to 1.1s with distributed Edge Caching."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
