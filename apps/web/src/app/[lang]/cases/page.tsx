import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import { FileProfileRepository } from "@portfolio/infrastructure";
import { Container, Section, Heading, Text } from "@portfolio/ui";
import { CasesExplorer } from "@/components/cases/CasesExplorer";
import {
  Gauge,
  TrendingUp,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: `${t.casesPage.title} | Guilherme Rodovalho`,
    description: t.casesPage.subtitle,
  };
}

export default async function CasesPage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);
  const isPt = lang === "pt-BR";
  const repo = new FileProfileRepository();
  const projects = await repo.getProjects();

  return (
    <Section spacing="lg">
      <Container>
        {/* Page Hero Header */}
        <div className="mb-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.casesPage.badge}</span>
          </div>

          <Heading as="h1" className="mb-4">
            {t.casesPage.title}
          </Heading>

          <Text variant="lead" className="text-zinc-700 dark:text-zinc-300">
            {t.casesPage.subtitle}
          </Text>

          {/* Aggregated Real Impact Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">SSR PERFORMANCE</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                −53,1%
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Recálculo de Estilo</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">ALTA ESCALA SEO</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                92.6k
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Cliques no Google</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">MICRO FRONTENDS</div>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                35M+
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Usuários Ativos</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">MOBILE HYBRID</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                0%
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Perda de Sessão SSO</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase">RESILIÊNCIA</div>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                99.99%
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">SLA Black Friday</div>
            </div>
          </div>
        </div>

        {/* Interactive Explorer & Deep-Dive Cases */}
        <CasesExplorer projects={projects} locale={lang} />
      </Container>
    </Section>
  );
}
