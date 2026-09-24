import React from "react";
import { SupportedLocale, getLocalized } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import {
  Container,
  Section,
  Heading,
  Text,
  Card,
  Badge,
} from "@portfolio/ui";
import { GraduationCap, Award, Languages, Compass, Shield, Terminal } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: t.about.title,
    description: t.about.subtitle,
  };
}

export default async function AboutPage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);
  const repo = new FileProfileRepository();
  const profile = await repo.getProfile();

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <div>
            <Text variant="caption" className="mb-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              ENGINEERING PHILOSOPHY
            </Text>
            <Heading as="h1" className="mb-4">
              {t.about.title}
            </Heading>
            <Text variant="lead">
              {t.about.subtitle}
            </Text>
          </div>

          {/* Bio Deep Dive */}
          <div className="prose max-w-none text-zinc-700 dark:text-zinc-300 space-y-4 leading-relaxed">
            <p className="text-lg">
              {getLocalized(profile.personal.bio, lang)}
            </p>
            <p>
              {getLocalized(profile.summary, lang)}
            </p>
          </div>

          {/* Philosophy & Principles */}
          <div>
            <Heading as="h2" className="mb-6 flex items-center gap-3">
              <Compass className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              <span>{t.about.philosophyTitle}</span>
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.engineeringPhilosophy.map((phil, idx) => (
                <Card key={idx} className="p-5">
                  <div className="text-xs font-mono text-zinc-500 mb-2">PRINCIPLE // 0{idx + 1}</div>
                  <Text variant="body" className="text-zinc-800 dark:text-zinc-200">
                    {getLocalized(phil, lang)}
                  </Text>
                </Card>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-900">
            <div>
              <Heading as="h3" className="mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-200">
                <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.about.educationTitle}</span>
              </Heading>
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <Card key={edu.id} className="p-4">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{edu.institution}</div>
                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {getLocalized(edu.degree, lang)}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {getLocalized(edu.fieldOfStudy, lang)} • {edu.startDate} — {edu.endDate ?? "Atual"}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Heading as="h3" className="mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-200">
                <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <span>{t.about.certificationsTitle}</span>
              </Heading>
              <div className="space-y-4">
                {profile.certifications.map((cert) => (
                  <Card key={cert.id} className="p-4">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{cert.name}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {cert.issuer} • {cert.issueDate}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-900">
            <Heading as="h3" className="mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-200">
              <Languages className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span>Idiomas</span>
            </Heading>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {profile.languages.map((l) => (
                <Card key={l.code} className="p-4 text-center">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{getLocalized(l.name, lang)}</div>
                  <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-1">
                    {getLocalized(l.proficiency, lang)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
