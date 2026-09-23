import React from "react";
import { SupportedLocale, getLocalized } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import {
  Container,
  Section,
  Heading,
  Text,
  Badge,
  Button,
  Card,
} from "@portfolio/ui";
import { PrintButton } from "./PrintButton";
import { Download, Mail, MapPin, Globe, Calendar } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: t.resume.title,
    description: t.resume.subtitle,
  };
}

export default async function ResumePage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);
  const repo = new FileProfileRepository();
  const profile = await repo.getProfile();
  const experiences = await repo.getExperiences();
  const skills = await repo.getSkills();

  return (
    <Section spacing="lg">
      <Container size="narrow">
        {/* Actions bar (hidden in print) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print pb-6 border-b border-zinc-900">
          <div>
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              {t.resume.version}: v{profile.version}
            </div>
            <Heading as="h1" className="text-2xl sm:text-3xl mt-1">
              {t.resume.title}
            </Heading>
          </div>

          <div className="flex items-center gap-3">
            <PrintButton label={t.resume.printFriendly} />

            <a
              href={`/resumes/guilherme-rodovalho-cv-${lang === "pt-BR" ? "pt" : "en"}.pdf`}
              download={`guilherme-rodovalho-cv-${lang === "pt-BR" ? "pt" : "en"}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.resume.downloadPDF}</span>
            </a>
          </div>
        </div>

        {/* Printable Resume Document Sheet */}
        <div className="bg-zinc-950/80 sm:border border-zinc-800/80 rounded-2xl p-6 sm:p-12 space-y-10">
          {/* Header */}
          <div className="border-b border-zinc-800/80 pb-8">
            <Heading as="h1" className="text-3xl sm:text-4xl text-zinc-100 font-extrabold mb-2">
              {profile.personal.name}
            </Heading>
            <div className="text-lg font-mono text-emerald-400 mb-4">
              {getLocalized(profile.personal.headline, lang)}
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                {getLocalized(profile.personal.location, lang)}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                {profile.personal.email}
              </span>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-zinc-200"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                linkedin.com/in/guilherme-rodovalho
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-zinc-200"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                github.com/rodovalhog
              </a>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2 font-bold">
              {t.resume.summaryTitle}
            </div>
            <Text variant="body" className="text-zinc-300 leading-relaxed text-sm sm:text-base">
              {getLocalized(profile.summary, lang)}
            </Text>
          </div>

          {/* Technical Competencies */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3 font-bold">
              {t.resume.skillsTitle}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map((s) => (
                <div key={s.id} className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-200">{s.name}</span>
                    <Badge variant="default">{s.level}</Badge>
                  </div>
                  <div className="text-xs text-zinc-400">
                    {s.tags.join(" • ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-6 font-bold">
              {t.resume.experienceTitle}
            </div>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l border-zinc-800 pl-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-base font-bold text-zinc-100">
                      {getLocalized(exp.role, lang)}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {exp.period.startDate} — {exp.period.isCurrent ? (lang === "pt-BR" ? "Presente" : "Present") : exp.period.endDate}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-emerald-400">
                    {exp.company} • {getLocalized(exp.location, lang)}
                  </div>

                  <Text variant="body" className="text-zinc-300 text-sm">
                    {getLocalized(exp.summary, lang)}
                  </Text>

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1.5 pl-2 text-xs text-zinc-300">
                      {exp.highlights.map((hl, idx) => (
                        <li key={idx} className="leading-relaxed flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{getLocalized(hl, lang)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.engineeringCases && exp.engineeringCases.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-zinc-900">
                      {exp.engineeringCases.map((ec, idx) => (
                        <div key={idx} className="text-xs text-zinc-400 space-y-1">
                          <span className="font-semibold text-zinc-200 block">
                            • {getLocalized(ec.title, lang)}:
                          </span>
                          <span className="text-zinc-300 block pl-3">
                            {getLocalized(ec.impact, lang)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs font-mono text-zinc-500 pt-1">
                    Tech: {exp.technologies.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="border-t border-zinc-800/80 pt-6">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3 font-bold">
              {t.resume.educationTitle}
            </div>
            {profile.education.map((edu) => (
              <div key={edu.id} className="text-sm text-zinc-300">
                <span className="font-semibold text-zinc-100">{edu.institution}</span> —{" "}
                <span>{getLocalized(edu.degree, lang)}</span> ({edu.startDate} - {edu.endDate ?? "Present"})
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
