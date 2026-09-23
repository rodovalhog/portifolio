import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import {
  Container,
  Section,
  Heading,
  Text,
  SkillCard,
} from "@portfolio/ui";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: t.skills.title,
    description: t.skills.subtitle,
  };
}

export default async function SkillsPage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);
  const repo = new FileProfileRepository();
  const skills = await repo.getSkills();

  return (
    <Section spacing="lg">
      <Container>
        <div className="mb-12 max-w-3xl">
          <Text variant="caption" className="mb-2 text-indigo-400">
            ENGINEERING DNA
          </Text>
          <Heading as="h1" className="mb-3">
            {t.skills.title}
          </Heading>
          <Text variant="lead">
            {t.skills.subtitle}
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} locale={lang} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
