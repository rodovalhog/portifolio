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
import {
  GraduationCap,
  Award,
  Languages,
  Compass,
  Cpu,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  Target,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: `${t.about.title} | Guilherme Rodovalho`,
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

  const technicalHighlights =
    lang === "pt-BR"
      ? [
          {
            icon: Layers,
            title: "Arquitetura & Decisões Estratégicas",
            description:
              "Definição e sustentação de padrões escaláveis em React, Next.js e Node.js com governança técnica e visão de longo prazo.",
          },
          {
            icon: Activity,
            title: "Auditoria & Profiling de Performance",
            description:
              "Diagnóstico e eliminação metódica de gargalos críticos de CPU, memória, rede e ciclos de renderização.",
          },
          {
            icon: TrendingUp,
            title: "Modernização & Evolução de Legados",
            description:
              "Refatoração estrutural com foco em redução de custos operacionais, aumento de resiliência e elevação da experiência do usuário.",
          },
          {
            icon: Sparkles,
            title: "IA como Multiplicador de Produtividade",
            description:
              "Aceleração de pesquisa, análise e execução sem abrir mão da qualidade técnica, da profundidade de código ou da tomada de decisão humana.",
          },
        ]
      : [
          {
            icon: Layers,
            title: "Architecture & Strategic Decision-Making",
            description:
              "Defining and governing scalable, high-performance standards in React, Next.js, and Node.js with long-term architectural foresight.",
          },
          {
            icon: Activity,
            title: "Performance Audits & Deep Profiling",
            description:
              "Methodical diagnostics and elimination of critical CPU, memory, network, and rendering cycle bottlenecks.",
          },
          {
            icon: TrendingUp,
            title: "Legacy Modernization & Evolution",
            description:
              "Structural refactoring aimed at lowering infrastructure costs, boosting system resilience, and elevating end-user experience.",
          },
          {
            icon: Sparkles,
            title: "AI as an Engineering Multiplier",
            description:
              "Accelerating research, analysis, and execution without delegating architectural judgment, code craftsmanship, or quality.",
          },
        ];

  const quickStats =
    lang === "pt-BR"
      ? [
          { label: "Experiência", value: "7+ Anos" },
          { label: "Foco Principal", value: "Arquitetura & Front-end" },
          { label: "Especialidade", value: "Web Performance & Profiling" },
          { label: "Abordagem", value: "Orientada a Trade-offs" },
        ]
      : [
          { label: "Experience", value: "7+ Years" },
          { label: "Core Focus", value: "Architecture & Frontend" },
          { label: "Specialty", value: "Web Performance & Profiling" },
          { label: "Approach", value: "Trade-off Driven" },
        ];

  return (
    <Section spacing="lg">
      <Container>
        <div className="max-w-4xl mx-auto space-y-14">
          {/* Header & Positioning */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {lang === "pt-BR"
                  ? "TRAJETÓRIA & MINDSET // PERFIL PROFISSIONAL"
                  : "CAREER & MINDSET // PROFESSIONAL PROFILE"}
              </span>
            </div>

            <Heading as="h1" className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {profile.personal.name}
            </Heading>

            <Text variant="lead" className="text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed text-lg sm:text-xl">
              {getLocalized(profile.personal.headline, lang)}
            </Text>

            {/* Quick Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {quickStats.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 backdrop-blur-sm"
                >
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PILAR 1: SOBRE MIM TECNICAMENTE */}
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <Heading as="h2" className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {t.about.technicalProfileTitle}
                  </Heading>
                </div>
              </div>
              <Badge variant="success" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 text-xs font-mono">
                {t.about.technicalProfileBadge}
              </Badge>
            </div>

            {/* Technical Narrative Card */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-white via-zinc-50/50 to-emerald-50/20 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-emerald-950/20 p-6 sm:p-8 shadow-sm">
              <div className="border-l-2 border-emerald-500/60 pl-5 py-1">
                <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                  {getLocalized(profile.summary, lang)}
                </p>
              </div>

              {/* Technical Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
                {technicalHighlights.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 transition-colors hover:border-emerald-500/40"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* PILAR 2: SOBRE MIM COMO PESSOA */}
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <Heading as="h2" className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {t.about.personalProfileTitle}
                  </Heading>
                </div>
              </div>
              <Badge variant="accent" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 text-xs font-mono">
                {t.about.personalProfileBadge}
              </Badge>
            </div>

            {/* Personal Narrative Card */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-white via-zinc-50/50 to-indigo-50/20 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-indigo-950/20 p-6 sm:p-8 shadow-sm">
              <div className="border-l-2 border-indigo-500/60 pl-5 py-1">
                <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                  {profile.personalStatement
                    ? getLocalized(profile.personalStatement, lang)
                    : getLocalized(profile.personal.bio, lang)}
                </p>
              </div>

              {/* 4 Cultural & Mindset Pillars */}
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
                <div className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                  {t.about.mindsetPrinciplesTitle}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.engineeringPhilosophy.map((phil, idx) => {
                    const rawText = getLocalized(phil, lang);
                    const colonIndex = rawText.indexOf(":");
                    const title = colonIndex !== -1 ? rawText.substring(0, colonIndex).trim() : `Princípio 0${idx + 1}`;
                    const description = colonIndex !== -1 ? rawText.substring(colonIndex + 1).trim() : rawText;

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 transition-colors hover:border-indigo-500/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-500">
                            PILARES // 0{idx + 1}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {title}
                        </h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Education & Certifications */}
          <div className="space-y-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            {/* Formação Acadêmica */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <Heading as="h3" className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {t.about.educationTitle}
                  </Heading>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.education.map((edu) => (
                  <Card key={edu.id} className="p-5 border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{edu.institution}</div>
                      <Badge variant="success" className="text-[11px] font-mono shrink-0">
                        {edu.startDate} — {edu.endDate ?? (lang === "pt-BR" ? "Atual" : "Present")}
                      </Badge>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {getLocalized(edu.degree, lang)}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {getLocalized(edu.fieldOfStudy, lang)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certificações & Especializações */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <Heading as="h3" className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {t.about.certificationsTitle}
                  </Heading>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {profile.certifications.map((cert) => (
                  <Card
                    key={cert.id}
                    className="p-4 border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-1">
                        {cert.name}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        {cert.issuer}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>{lang === "pt-BR" ? "FORMAÇÃO" : "CREDENTIAL"}</span>
                      <span>{cert.issueDate}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Languages className="w-5 h-5" />
              </div>
              <Heading as="h3" className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {t.about.languagesTitle}
              </Heading>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.languages.map((l) => (
                <Card key={l.code} className="p-5 border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">{getLocalized(l.name, lang)}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {lang === "pt-BR" ? (l.code === "pt-BR" ? "Idioma Nativo" : "Proficiência Profissional") : (l.code === "pt-BR" ? "Native Language" : "Professional Proficiency")}
                    </div>
                  </div>
                  <Badge variant={l.code === "pt-BR" ? "success" : "accent"} className="text-xs font-mono font-semibold">
                    {getLocalized(l.proficiency, lang)}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
