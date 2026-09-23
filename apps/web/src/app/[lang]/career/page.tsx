import React from "react";
import { SupportedLocale } from "@portfolio/domain";
import { getTranslations } from "@portfolio/i18n";
import {
  Container,
  Section,
  Heading,
  Text,
  Badge,
  Card,
  Button,
} from "@portfolio/ui";
import { CareerAICenter } from "@/components/ai/CareerAICenter";
import {
  Sparkles,
  Bot,
  FileSearch,
  FileSignature,
  Server,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const t = getTranslations(params.lang);
  return {
    title: `${t.navigation.careerAI} — AI Career Platform`,
    description: "AI Career Suite: Ask My Resume, Job Analyzer, Cover Letter Generator and MCP Server.",
  };
}

export default function CareerHubPage({
  params,
}: {
  params: { lang: SupportedLocale };
}) {
  const { lang } = params;
  const t = getTranslations(lang);

  const modules = [
    {
      icon: Bot,
      title: lang === "pt-BR" ? "Ask My Resume" : "Ask My Resume",
      description:
        lang === "pt-BR"
          ? "Converse com um agente treinado estritamente nos meus dados profissionais verificados. Zero alucinação, contexto mínimo e proveniência de dados."
          : "Chat with an agent grounded strictly in verified professional data. Zero hallucinations, minimal context retrieval, and full provenance tracking.",
      status: "Phase 3",
      highlight: true,
    },
    {
      icon: FileSearch,
      title: lang === "pt-BR" ? "AI Job Description Analyzer" : "AI Job Description Analyzer",
      description:
        lang === "pt-BR"
          ? "Analise uma vaga de emprego, faça matching de requisitos com minhas experiências reais e identifique gaps técnicos de forma transparente."
          : "Analyze any job description, map requirements directly to real-world experience, and identify technical gaps objectively.",
      status: "Phase 3",
      highlight: false,
    },
    {
      icon: FileSignature,
      title: lang === "pt-BR" ? "Cover Letter Generator" : "Cover Letter Generator",
      description:
        lang === "pt-BR"
          ? "Geração assistida de cartas de apresentação direcionadas, baseadas em evidências concretas e com validação humana obrigatória."
          : "Evidence-backed tailored cover letter generator with strict provenance and mandatory human-in-the-loop review.",
      status: "Phase 3",
      highlight: false,
    },
    {
      icon: Server,
      title: lang === "pt-BR" ? "Model Context Protocol (MCP)" : "Model Context Protocol (MCP)",
      description:
        lang === "pt-BR"
          ? "Servidor MCP oficial integrado para que Claude, Cursor e outros agentes consumam meu perfil e projetos via ferramentas seguras e tipadas."
          : "Official Model Context Protocol server exposing verified profile resources and tools to Claude, Cursor, and autonomous agents.",
      status: "Phase 4",
      highlight: false,
    },
  ];

  return (
    <Section spacing="lg">
      <Container>
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI PLATFORM SUITE</span>
          </div>
          <Heading as="h1" className="mb-3">
            {lang === "pt-BR" ? "Plataforma de Carreira & Agentes de IA" : "AI Career Platform & Agent Suite"}
          </Heading>
          <Text variant="lead">
            {lang === "pt-BR"
              ? "Extensões inteligentes construídas com Clean Architecture, saídas estruturadas com Zod, e proteção rígida contra alucinações e prompt injection."
              : "Intelligent extensions built with Clean Architecture, Zod structured outputs, and rigorous anti-hallucination guardrails."}
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Card key={idx} hoverable className="p-6 bg-zinc-950/60 border-zinc-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={m.highlight ? "accent" : "neutral"}>{m.status}</Badge>
                  </div>
                  <Heading as="h3" className="mb-2 text-zinc-100">
                    {m.title}
                  </Heading>
                  <Text variant="body" className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {m.description}
                  </Text>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Human-in-the-Loop</span>
                  </span>
                  <span>TypeScript + Zod</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Live Interactive WebMCP & Gemini Nano Console */}
        <div id="career-interactive-center" className="mb-12">
          <CareerAICenter lang={lang} />
        </div>

        {/* Technical Guarantee Banner */}
        <Card className="p-6 bg-zinc-900/30 border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-zinc-200">
                {lang === "pt-BR" ? "Princípio de Segurança e Zero Alucinação" : "Safety & Zero-Hallucination Principle"}
              </div>
              <div className="text-xs text-zinc-400 max-w-2xl">
                {lang === "pt-BR"
                  ? "Nenhum agente tem autorização para inventar métricas, cargos ou tecnologias. Todas as respostas utilizam o modelo de domínio do perfil como única fonte de verdade."
                  : "No agent is authorized to fabricate metrics, roles, or skills. All outputs strictly leverage the domain profile model as the single source of truth."}
              </div>
            </div>
            <a href={`/${lang}/about`}>
              <Button variant="outline" size="sm">
                <span>{lang === "pt-BR" ? "Ver Princípios" : "View Principles"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
