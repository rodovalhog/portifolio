import { NextRequest, NextResponse } from "next/server";
import { SupportedLocale, getLocalized } from "@portfolio/domain";
import { FileProfileRepository } from "@portfolio/infrastructure";
import { resolveGeminiModel } from "@/lib/ai/gemini-client";

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, locale = "pt-BR" } = await req.json();
    const targetLocale: SupportedLocale = locale === "en-US" ? "en-US" : "pt-BR";

    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "Descrição da vaga não informada ou vazia." },
        { status: 400 }
      );
    }

    const trimmedJob = jobDescription.trim();
    const isPt = targetLocale === "pt-BR";

    const repo = new FileProfileRepository();
    const profile = await repo.getProfile();

    // Collect all technical skills and keywords from profile
    const allSkills = profile.skills.map((s) => ({
      name: s.name,
      tags: s.tags,
      category: s.category,
      level: s.level,
    }));
    const allTags = Array.from(new Set(profile.skills.flatMap((s) => s.tags)));

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // 1. Try Gemini AI if API Key is configured
    if (apiKey) {
      try {
        const modelName = await resolveGeminiModel(apiKey);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const systemPrompt = `Você é um avaliador técnico rigoroso e honesto de recrutamento para posições de Engenharia de Software.
Você está avaliando a compatibilidade entre uma VAGA DE EMPREGO (ou texto fornecido pelo recrutador) e o perfil técnico REAL de Guilherme Rodovalho.

PERFIL REAL DE GUILHERME RODOVALHO:
- Nome: ${profile.personal.name}
- Headline: ${getLocalized(profile.personal.headline, targetLocale)}
- Anos de Experiência: 7+ anos (Sênior / Staff / Lead)
- Principais Hard Skills: React, Next.js (SSR, SSG, ISR), TypeScript, JavaScript, Micro Frontends (Module Federation), Node.js, GraphQL, REST APIs, Tailwind CSS, Clean Architecture, SOLID, Web Performance & Core Web Vitals (LCP, INP, CLS), Testes Automatizados (Jest, RTL), Observabilidade (Sentry, OpenTelemetry), AI Engineering (Agentic AI, LLMs estruturados com Zod, WebMCP, Gemini Nano).
- Caso de Maior Escala: Grupo Casas Bahia (19M+ usuários ativos mensais, 0 downtime na Black Friday, redução de 66% no LCP de 4.2s para 1.4s, SEO técnico gerando +18% de conversão orgânica).

REGRAS CRÍTICAS DE AVALIAÇÃO:
1. SE O TEXTO INFORMADO NÃO FOR UMA VAGA DE ENGENHARIA DE SOFTWARE OU TECNOLOGIA (exemplo: 'comer macarrão', 'vaga de garçom', 'receita de bolo', piadas ou frases aleatórias sem requisitos técnicos):
   - O score DEVE ser 0.
   - isRelevantJob DEVE ser false.
   - verdict DEVE ser "Incompatível / Sem Relação Técnica" (ou em inglês se locale for en-US).
   - matchedSkills DEVE ser [].
   - missingSkills DEVE conter explicação de que o texto não descreve uma vaga técnica.
   - summary DEVE afirmar categoricamente que o texto não tem qualquer relação com as competências de software de Guilherme.
2. SE O TEXTO FOR UMA VAGA REAL:
   - Identifique as hard skills e requisitos reais exigidos na vaga.
   - Compare com as hard skills comprovadas no perfil de Guilherme.
   - Calcule um score de 0 a 100 realista proporcional aos requisitos atendidos.
   - Liste as hard skills atendidas em 'matchedSkills'.
   - Liste eventuais requisitos da vaga que o perfil não cobre em 'missingSkills'.
   - Indique cases reais aplicáveis em 'relevantCases'.
   - Redija um resumo executivo objetivo e profissional em 'summary'.

RETORNE ESTRITAMENTE UM OBJETO JSON VÁLIDO (sem markdown codeblocks):
{
  "score": number, // 0 a 100
  "isRelevantJob": boolean,
  "verdict": string,
  "matchedSkills": string[],
  "missingSkills": string[],
  "relevantCases": [ { "title": string, "metric": string } ],
  "summary": string
}`;

        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Analise a seguinte descrição de vaga para o idioma ${locale}:\n\n"""\n${trimmedJob}\n"""`,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText.trim());
            return NextResponse.json({
              success: true,
              source: "gemini-cloud",
              result: parsed,
            });
          }
        }
      } catch (geminiError) {
        console.warn("[Job Matcher API] Gemini API error, falling back to strict semantic evaluator:", geminiError);
      }
    }

    // 2. Strict Deterministic Semantic Evaluator (Fallback or Local)
    const lowerJob = trimmedJob.toLowerCase();

    // List of known software engineering domain indicators
    const techDictionary: Record<string, string> = {
      react: "React",
      next: "Next.js",
      "next.js": "Next.js",
      typescript: "TypeScript",
      javascript: "JavaScript",
      node: "Node.js",
      "node.js": "Node.js",
      frontend: "Frontend Architecture",
      "front-end": "Frontend Architecture",
      backend: "Backend Services",
      "back-end": "Backend Services",
      "full stack": "Full Stack Software Engineering",
      fullstack: "Full Stack Software Engineering",
      graphql: "GraphQL",
      rest: "REST APIs",
      api: "API Integration",
      "micro frontends": "Micro Frontends (Module Federation)",
      "micro-frontends": "Micro Frontends (Module Federation)",
      "module federation": "Webpack Module Federation",
      "clean architecture": "Clean Architecture & SOLID",
      solid: "Clean Architecture & SOLID",
      "web performance": "Web Performance Optimization",
      performance: "Web Performance & Core Web Vitals",
      "core web vitals": "Core Web Vitals (LCP, INP, CLS)",
      lcp: "Core Web Vitals (LCP)",
      inp: "Core Web Vitals (INP)",
      seo: "SEO Técnico & Indexabilidade",
      tailwind: "Tailwind CSS",
      jest: "Testes Automatizados (Jest, RTL)",
      testing: "Qualidade de Software & Testes",
      ci: "CI/CD GitHub Actions",
      "ci/cd": "CI/CD GitHub Actions",
      docker: "Containers & Docker",
      sentry: "Observabilidade & Sentry",
      ai: "AI Engineering & LLMs",
      llm: "LLM Integration & Agentic AI",
      agent: "AI Agents & WebMCP",
      mcp: "Model Context Protocol (WebMCP)",
      scale: "Arquitetura de Alta Escala",
      escala: "Arquitetura de Alta Escala",
      architecture: "Arquitetura de Sistemas",
      arquiteto: "Arquitetura de Sistemas",
      lead: "Liderança Técnica & Mentoria",
      liderança: "Liderança Técnica & Mentoria",
      staff: "Nível Staff Engineer",
      principal: "Nível Principal Engineer",
    };

    const matchedKeys: string[] = [];
    for (const [key, label] of Object.entries(techDictionary)) {
      // Regex boundary check for words to avoid substring false positives
      const regex = new RegExp(`\\b${key.replace(".", "\\.")}\\b`, "i");
      if (regex.test(lowerJob)) {
        if (!matchedKeys.includes(label)) {
          matchedKeys.push(label);
        }
      }
    }

    // CHECK: Is this even a software job?
    if (matchedKeys.length === 0) {
      return NextResponse.json({
        success: true,
        source: "deterministic-evaluator",
        result: {
          score: 0,
          isRelevantJob: false,
          verdict: isPt ? "Incompatível / Sem Relação Técnica" : "No Technical Relevance",
          matchedSkills: [],
          missingSkills: [
            isPt
              ? "O texto inserido não contém requisitos técnicos de Engenharia de Software ou desenvolvimento web."
              : "The provided text does not contain Software Engineering or web development requirements.",
          ],
          relevantCases: [],
          summary: isPt
            ? `O texto informado ("${trimmedJob.slice(0, 60)}...") não descreve uma vaga de Engenharia de Software nem possui qualquer correlação com as competências técnicas de Guilherme Rodovalho (React, Next.js, Node.js, Arquitetura e IA).`
            : `The provided text ("${trimmedJob.slice(0, 60)}...") does not describe a Software Engineering job and has zero match with Guilherme Rodovalho's technical stack (React, Next.js, Node.js, Architecture & AI).`,
        },
      });
    }

    // It is a software job! Calculate score based on breadth of match
    const baseScore = Math.min(50 + matchedKeys.length * 8, 98);
    const relevantCases = [];

    if (matchedKeys.some((k) => k.includes("Performance") || k.includes("Escala") || k.includes("Micro Frontends"))) {
      relevantCases.push({
        title: isPt ? "Grupo Casas Bahia — Re-arquitetura E-commerce" : "Grupo Casas Bahia — E-commerce Re-architecture",
        metric: "19M+ MAU • 0 Downtime na Black Friday • LCP -66%",
      });
    }

    if (matchedKeys.some((k) => k.includes("AI") || k.includes("LLM") || k.includes("MCP"))) {
      relevantCases.push({
        title: isPt ? "AI Career Platform & WebMCP" : "AI Career Platform & WebMCP",
        metric: "Tool-use autônomo • On-device AI • Zod Validation",
      });
    }

    const summary = isPt
      ? `O perfil de Guilherme Rodovalho possui **${baseScore}% de aderência** aos requisitos técnicos identificados nesta vaga. Ele possui mais de 7 anos de experiência comprovada em ${matchedKeys.slice(0, 4).join(", ")}, com entregas de alto impacto em ambientes de grande escala.`
      : `Guilherme Rodovalho's profile matches **${baseScore}%** of the technical requirements found in this job posting. He brings 7+ years of proven production experience across ${matchedKeys.slice(0, 4).join(", ")}, with high-impact deliveries in mission-critical environments.`;

    return NextResponse.json({
      success: true,
      source: "deterministic-evaluator",
      result: {
        score: baseScore,
        isRelevantJob: true,
        verdict: baseScore >= 80 ? (isPt ? "Alta Compatibilidade" : "Strong Match") : (isPt ? "Compatibilidade Parcial" : "Moderate Match"),
        matchedSkills: matchedKeys,
        missingSkills: [],
        relevantCases,
        summary,
      },
    });
  } catch (error) {
    console.error("[API /api/job-matcher Error]:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Falha interna ao analisar a vaga.",
      },
      { status: 500 }
    );
  }
}
