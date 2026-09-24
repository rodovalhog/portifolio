import React from "react";
import { SupportedLocale, getLocalized } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import {
  Container,
  Section,
  Heading,
  Text,
  Button,
  Badge,
  ProjectCard,
  SkillCard,
  Card,
} from "@portfolio/ui";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Download,
  CheckCircle,
  TrendingUp,
  Cpu,
  Layers,
  Gauge,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);
  const repo = new FileProfileRepository();

  const profile = await repo.getProfile();
  const projects = await repo.getProjects();
  const skills = await repo.getSkills();

  const featuredProjects = projects.filter((p) => p.featured);
  const highlightedSkills = skills.filter((s) => s.highlight);

  return (
    <div>
      {/* Hero Section */}
      <Section
        id="hero-section"
        data-mcp-id="home"
        data-mcp-resource="page"
        data-mcp-description="Página inicial e apresentação de Guilherme Rodovalho"
        spacing="xl"
        className="border-b border-zinc-200 dark:border-zinc-900 relative overflow-hidden"
      >
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{getLocalized(profile.personal.availability, lang)}</span>
            </div>

            <Heading as="h1" className="mb-6 leading-tight">
              <span>{t.home.heroTitlePrefix} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-400">
                {t.home.heroTitleHighlight}
              </span>
            </Heading>

            <Text variant="lead" className="mb-8">
              {getLocalized(profile.personal.bio, lang)}
            </Text>

            <div className="flex flex-wrap items-center gap-4">
              <a href={`/${lang}/projects`}>
                <Button variant="primary" size="lg" className="group">
                  <span>{t.common.exploreWork}</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>

              <a href={`/${lang}/resume`}>
                <Button variant="outline" size="lg">
                  <FileText className="w-4 h-4 mr-1 text-zinc-400" />
                  <span>{t.common.viewResume}</span>
                </Button>
              </a>

              <a
                id="btn-download-resume"
                data-mcp-id="resume-download"
                data-mcp-resource="action"
                data-mcp-action="download"
                data-mcp-description="Baixar currículo oficial em formato PDF"
                href={`/resumes/guilherme-rodovalho-cv-${lang === "pt-BR" ? "pt" : "en"}.pdf`}
                download={`guilherme-rodovalho-cv-${lang === "pt-BR" ? "pt" : "en"}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-emerald-800/50 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300"
                >
                  <Download className="w-4 h-4 mr-1 text-emerald-400" />
                  <span>{t.common.downloadResume}</span>
                </Button>
              </a>

              <a href={`/${lang}/career`}>
                <Button variant="secondary" size="lg" className="border-zinc-800 text-zinc-300 hover:text-zinc-100">
                  <Sparkles className="w-4 h-4 mr-1 text-emerald-400" />
                  <span>{t.common.talkToAI}</span>
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Real Impact Metrics Bar */}
      <section
        id="casas-bahia-metric"
        data-mcp-id="casas-bahia-staff"
        data-mcp-resource="case_study"
        data-mcp-description="Métricas de Impacto Casas Bahia: redução de 66% no LCP de 4.2s para 1.4s, 150k rpm na Black Friday com 99.99% de SLA"
        className="border-b border-zinc-200 bg-zinc-100/60 dark:border-zinc-900 dark:bg-zinc-950/60 py-8"
      >
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/60 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>PERFORMANCE (LCP)</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">-66% LCP</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">4.2s → 1.4s no mobile</div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/60 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>VOLUME DE PICOS</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">150k+ rpm</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Sustentação na Black Friday</div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/60 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>SLA & DISPONIBILIDADE</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">99.99%</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Zero downtime em produção</div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/60 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>CONVERSÃO DE BUSCA</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">+14% Uplift</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Impacto direto no GMV</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Engineering Case Studies */}
      <Section
        id="projects-section"
        data-mcp-id="projects"
        data-mcp-resource="section"
        data-mcp-description="Projetos em destaque e estudos de caso de arquitetura de software"
        spacing="lg"
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Text variant="caption" className="mb-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                CASE STUDIES
              </Text>
              <Heading as="h2">{t.home.featuredProjectsTitle}</Heading>
              <Text variant="body" className="text-zinc-600 dark:text-zinc-400 mt-1">
                {t.home.featuredProjectsSubtitle}
              </Text>
            </div>
            <a href={`/${lang}/projects`}>
              <Button variant="outline" size="sm" className="self-start md:self-auto">
                <span>{t.projects.filterAll}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
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

      {/* Engineering DNA */}
      <Section
        id="skills-section"
        data-mcp-id="skills"
        data-mcp-resource="section"
        data-mcp-description="Matriz de competências técnicas e domínios de engenharia"
        spacing="lg"
        className="border-b border-zinc-200 dark:border-zinc-900"
      >
        <Container>
          <div className="mb-12">
            <Text variant="caption" className="mb-2 text-indigo-600 dark:text-indigo-400 font-semibold">
              CORE DOMAINS
            </Text>
            <Heading as="h2">{t.home.dnaTitle}</Heading>
            <Text variant="body" className="text-zinc-600 dark:text-zinc-400 mt-1">
              {t.home.dnaSubtitle}
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} locale={lang} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Engineering Philosophy Cards */}
      <Section spacing="lg">
        <Container>
          <div className="mb-12">
            <Text variant="caption" className="mb-2 text-zinc-500 font-semibold">
              PRINCIPLES & TRADEOFFS
            </Text>
            <Heading as="h2">{t.about.philosophyTitle}</Heading>
            <Text variant="body" className="text-zinc-600 dark:text-zinc-400 mt-1">
              {t.about.subtitle}
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.engineeringPhilosophy.map((item, index) => (
              <Card key={index} className="flex gap-4 p-6 bg-white/80 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
                <span className="text-xl font-mono font-bold text-zinc-400 dark:text-zinc-600">0{index + 1}</span>
                <Text variant="body" className="text-zinc-800 dark:text-zinc-200">
                  {getLocalized(item, lang)}
                </Text>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
