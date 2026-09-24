import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import {
  Container,
  Section,
  Heading,
  Text,
  ProjectCard,
} from "@portfolio/ui";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: t.projects.title,
    description: t.projects.subtitle,
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);
  const repo = new FileProfileRepository();
  const projects = await repo.getProjects();

  return (
    <Section spacing="lg">
      <Container>
        <div className="mb-12 max-w-3xl">
          <Text variant="caption" className="mb-2 text-indigo-400">
            ENGINEERING CASE STUDIES
          </Text>
          <Heading as="h1" className="mb-3">
            {t.projects.title}
          </Heading>
          <Text variant="lead">
            {t.projects.subtitle}
          </Text>

          <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                {lang === "pt-BR" ? "⚡ Hub de Cases com Diagnóstico Aprofundado" : "⚡ Interactive Cases Hub with Deep-Dive"}
              </div>
              <div className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                {lang === "pt-BR"
                  ? "Explore o case completo de performance SSR, as 7 frentes técnicas e hipóteses refutadas."
                  : "Explore the full SSR performance case study, 7 technical fronts, and empirical telemetry."}
              </div>
            </div>
            <a
              href={`/${lang}/cases`}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              {lang === "pt-BR" ? "Ver Página de Cases →" : "View Cases Page →"}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={lang}
              href={`/${lang}/projects/${project.slug}`}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
