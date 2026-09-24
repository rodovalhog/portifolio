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
import { Code2, Users } from "lucide-react";

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
      </Container>
    </Section>
  );
}
