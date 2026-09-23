import React from "react";
import { notFound } from "next/navigation";
import { SupportedLocale, getLocalized } from "@portfolio/domain";
import { getTranslations, SUPPORTED_LOCALES } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import {
  Container,
  Section,
  Heading,
  Text,
  Badge,
  Card,
  Button,
} from "@portfolio/ui";
import {
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  ShieldAlert,
  GitBranch,
  Flame,
} from "lucide-react";

export async function generateStaticParams() {
  const repo = new FileProfileRepository();
  const projects = await repo.getProjects();
  const params: Array<{ lang: SupportedLocale; slug: string }> = [];

  for (const lang of SUPPORTED_LOCALES) {
    for (const p of projects) {
      params.push({ lang, slug: p.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale; slug: string };
}) {
  const repo = new FileProfileRepository();
  const project = await repo.getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: getLocalized(project.title, params.lang),
    description: getLocalized(project.tagline, params.lang),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { lang: SupportedLocale; slug: string };
}) {
  const { lang, slug } = params;
  const t = getTranslations(lang);
  const repo = new FileProfileRepository();
  const project = await repo.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <Section spacing="lg">
      <Container size="narrow">
        {/* Back Link */}
        <div className="mb-8">
          <a
            href={`/${lang}/projects`}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.common.backToProjects}</span>
          </a>
        </div>

        {/* Case Header */}
        <div className="mb-12 border-b border-zinc-900 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="accent">Case Study</Badge>
            <span className="text-xs font-mono text-zinc-500">{project.period}</span>
          </div>

          <Heading as="h1" className="mb-4">
            {getLocalized(project.title, lang)}
          </Heading>

          <Text variant="lead" className="mb-6">
            {getLocalized(project.tagline, lang)}
          </Text>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Real Metrics Highlights */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-14">
            <Text variant="caption" className="mb-3 text-emerald-400">
              {t.projects.metricsTitle}
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.metrics.map((m, idx) => (
                <Card key={idx} className="p-4 bg-zinc-900/50 border-zinc-800">
                  <div className="text-xs font-mono text-zinc-500 mb-1">
                    {getLocalized(m.label, lang)}
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>{m.value}</span>
                  </div>
                  {m.change && (
                    <div className="text-xs font-mono text-zinc-400 mt-1">
                      {m.change}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Deep Dive Case Content */}
        <div className="space-y-12">
          {/* Context */}
          <div className="space-y-3">
            <Heading as="h3" className="flex items-center gap-2 text-zinc-200">
              <span className="text-emerald-400 font-mono text-sm">01.</span>
              <span>{t.projects.contextTitle}</span>
            </Heading>
            <Text variant="body" className="text-zinc-300 leading-relaxed">
              {getLocalized(project.context, lang)}
            </Text>
          </div>

          {/* Problem & Constraints */}
          <div className="space-y-3">
            <Heading as="h3" className="flex items-center gap-2 text-zinc-200">
              <span className="text-emerald-400 font-mono text-sm">02.</span>
              <span>{t.projects.problemTitle}</span>
            </Heading>
            <Text variant="body" className="text-zinc-300 leading-relaxed">
              {getLocalized(project.problem, lang)}
            </Text>
            {project.constraints && (
              <Card className="mt-4 p-4 bg-zinc-950/70 border-zinc-800/80">
                <div className="text-xs font-mono uppercase text-amber-400 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{t.projects.constraintsTitle}</span>
                </div>
                <div className="text-sm text-zinc-400">
                  {getLocalized(project.constraints, lang)}
                </div>
              </Card>
            )}
          </div>

          {/* Options & Decision */}
          <div className="space-y-3">
            <Heading as="h3" className="flex items-center gap-2 text-zinc-200">
              <span className="text-emerald-400 font-mono text-sm">03.</span>
              <span>{t.projects.decisionTitle}</span>
            </Heading>
            {project.optionsConsidered && (
              <div className="mb-4 text-sm text-zinc-400 bg-zinc-900/30 p-4 rounded-lg border border-zinc-800">
                <span className="text-xs font-mono uppercase text-zinc-500 block mb-1">
                  {t.projects.optionsTitle}
                </span>
                {getLocalized(project.optionsConsidered, lang)}
              </div>
            )}
            <Text variant="body" className="text-zinc-300 leading-relaxed">
              {getLocalized(project.decision, lang)}
            </Text>
            {project.tradeoffs && (
              <Card className="mt-4 p-4 bg-zinc-950/70 border-zinc-800/80">
                <div className="text-xs font-mono uppercase text-indigo-400 mb-1 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Trade-offs & Consequências</span>
                </div>
                <div className="text-sm text-zinc-400">
                  {getLocalized(project.tradeoffs, lang)}
                </div>
              </Card>
            )}
          </div>

          {/* Solution & Implementation */}
          <div className="space-y-3">
            <Heading as="h3" className="flex items-center gap-2 text-zinc-200">
              <span className="text-emerald-400 font-mono text-sm">04.</span>
              <span>{t.projects.solutionTitle}</span>
            </Heading>
            <Text variant="body" className="text-zinc-300 leading-relaxed">
              {getLocalized(project.solution, lang)}
            </Text>
            <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 text-sm text-zinc-400 mt-2">
              <div className="text-xs font-mono uppercase text-zinc-500 mb-1">
                Implementação Técnica
              </div>
              {getLocalized(project.implementation, lang)}
            </div>
          </div>

          {/* Impact */}
          <div className="space-y-3 pt-6 border-t border-zinc-900">
            <Heading as="h3" className="flex items-center gap-2 text-zinc-100">
              <span className="text-emerald-400 font-mono text-sm">05.</span>
              <span>{t.projects.impactTitle}</span>
            </Heading>
            <Text variant="body" className="text-zinc-200 leading-relaxed font-medium">
              {getLocalized(project.impact, lang)}
            </Text>
          </div>
        </div>
      </Container>
    </Section>
  );
}
