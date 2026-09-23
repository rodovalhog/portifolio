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
