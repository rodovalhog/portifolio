import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import {
  Container,
  Section,
  Heading,
  Text,
  Timeline,
} from "@portfolio/ui";
import { Code2, Users, FileText, Download } from "lucide-react";
import { LeadershipTestimonials } from "@/components/social/LeadershipTestimonials";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: t.experience.title,
    description: t.experience.subtitle,
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);
  const repo = new FileProfileRepository();
  const experiences = await repo.getExperiences();

  return (
    <Section spacing="lg">
      <Container size="narrow">
        <div className="mb-8">
          <Text variant="caption" className="mb-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            CAREER TIMELINE
          </Text>
          <Heading as="h1" className="mb-3">
            {t.experience.title}
          </Heading>
          <Text variant="lead">
            {t.experience.subtitle}
          </Text>
        </div>

        {/* Resume Actions Card: View Resume or Download PDF */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {lang === "pt-BR" ? "Currículo Completo & Documentação" : "Official Resume & Credentials"}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {lang === "pt-BR"
                  ? "Consulte a versão detalhada para recrutadores ou faça o download direto em PDF."
                  : "Explore the full recruiter-ready version or download the official PDF directly."}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href={`/${lang}/resume`}
              id="btn-view-resume-hero"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-800 hover:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-300 dark:text-zinc-200 dark:hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:border-zinc-700 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>{t.common.viewResume}</span>
            </a>

            <a
              href={`/resumes/guilherme-rodovalho-cv-${lang === "pt-BR" ? "pt" : "en"}.pdf`}
              download={`guilherme-rodovalho-cv-${lang === "pt-BR" ? "pt" : "en"}.pdf`}
              id="btn-download-resume-hero"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 dark:text-emerald-400 dark:bg-emerald-950/50 dark:hover:bg-emerald-950/80 dark:border-emerald-700/70 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.common.downloadResume}</span>
            </a>
          </div>
        </div>

        {/* Executive Overview: Hard & Soft Skills Architecture */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-none space-y-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-1">
              {lang === "pt-BR" ? "Posicionamento & Liderança Técnica" : "Technical Positioning & Leadership"}
            </div>
            <Heading as="h2" className="text-xl sm:text-2xl text-zinc-900 dark:text-zinc-100 font-bold">
              {lang === "pt-BR"
                ? "Engenharia de Alto Impacto: Hard Skills Profundas & Soft Skills de Liderança"
                : "High-Impact Engineering: Deep Hard Skills & Leadership Soft Skills"}
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-900">
            {/* Hard Skills Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-200">
                <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === "pt-BR" ? "Hard Skills & Excelência Técnica" : "Hard Skills & Technical Mastery"}</span>
              </div>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Frontend Architecture:</strong> React, Next.js (Server Components, SSR/SSG), Micro Frontends com Module Federation, Clean Architecture e SOLID.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Web Performance & SEO:</strong> Core Web Vitals (LCP, INP, CLS), TTFB, Akamai CDN, code splitting, bundle optimization e SEO técnico (schema.org, canonicalização).
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">AI Engineering:</strong> Agentic AI, LLMs estruturados com Zod, WebMCP (Model Context Protocol) e engenharia de contexto aplicada ao desenvolvimento.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Qualidade & Observabilidade:</strong> Testes automatizados (Jest, RTL), SonarCloud, CI/CD GitHub Actions, Sentry e Real User Monitoring (RUM).
                </li>
              </ul>
            </div>

            {/* Soft Skills Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-200">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === "pt-BR" ? "Soft Skills, Ownership & Negócio" : "Soft Skills, Ownership & Business Impact"}</span>
              </div>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Ownership & Inconformismo:</strong> Foco absoluto no impacto real do sistema e do time; postura ativa de questionar o status quo para buscar soluções escaláveis e sustentáveis.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Decisão por Trade-offs:</strong> Conexão entre rigor técnico e metas de negócio (conversão, SEO orgânico, receita e disponibilidade em larga escala).
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Visão Sistêmica:</strong> Antecipação de riscos operacionais e identificação precoce de gargalos antes que afetem a experiência do usuário.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-200">Mentoria & Colaboração:</strong> Elevação contínua do nível técnico do time, revisões de arquitetura e parceria estratégica com Produto, UX, mobile e backend.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Timeline experiences={experiences} locale={lang} />

        {/* Leadership & Peer Endorsements with Sample ADR */}
        <LeadershipTestimonials locale={lang} />

        {/* Bottom Resume Callout */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {lang === "pt-BR" ? "Deseja salvar ou analisar o currículo formal?" : "Need a formal copy of my resume?"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              {lang === "pt-BR"
                ? "Acesse a versão formatada para recrutadores ou baixe o PDF oficial com um clique."
                : "View the recruiter-friendly layout or download the official PDF directly."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`/${lang}/resume`}
              id="btn-view-resume-footer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-800 hover:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-300 dark:text-zinc-200 dark:hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:border-zinc-700 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span>{t.common.viewResume}</span>
            </a>

            <a
              href={`/resumes/guilherme-rodovalho-cv-${lang === "pt-BR" ? "pt" : "en"}.pdf`}
              download={`guilherme-rodovalho-cv-${lang === "pt-BR" ? "pt" : "en"}.pdf`}
              id="btn-download-resume-footer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 dark:text-emerald-400 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:border-emerald-700/60 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.common.downloadResume}</span>
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

