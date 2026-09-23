import { SemanticResource, SemanticResourceMap, SemanticTreeNode } from "./types";

/**
 * Fallback semantic catalogue covering the entire portfolio structure.
 * Always available even before full DOM hydration.
 */
export const PORTFOLIO_SEMANTIC_RESOURCES: SemanticResourceMap = {
  home: {
    id: "home",
    resource: "page",
    action: "navigate",
    description: "Página inicial: apresentação, resumo de impacto, disponibilidade e destaques de engenharia.",
    target: "/",
    access: "public",
    breadcrumbs: ["Home"],
    domSelector: "#hero-section",
  },
  experience: {
    id: "experience",
    resource: "page",
    action: "navigate",
    description: "Histórico profissional detalhado: Casas Bahia (Staff Engineer / Tech Lead), métricas e cases.",
    target: "/experience",
    access: "public",
    breadcrumbs: ["Home", "Experiência"],
    domSelector: "#experience-section",
  },
  "casas-bahia-staff": {
    id: "casas-bahia-staff",
    resource: "case_study",
    action: "view",
    description: "Case de Engenharia Casas Bahia: 19M+ usuários, salto de 12 para 92.6k cliques em 3 meses (23M+ impressões no GSC), refatoração de busca e filtros, SSR/SSG e SEO técnico.",
    target: "/experience#casas-bahia-staff",
    access: "public",
    parent: "experience",
    breadcrumbs: ["Home", "Experiência", "Casas Bahia Staff"],
    domSelector: "#casas-bahia-staff",
  },
  projects: {
    id: "projects",
    resource: "page",
    action: "navigate",
    description: "Portfólio de projetos técnicos: plataformas de alta escala, arquiteturas de IA e microsserviços.",
    target: "/projects",
    access: "public",
    breadcrumbs: ["Home", "Projetos"],
    domSelector: "#projects-section",
  },
  skills: {
    id: "skills",
    resource: "page",
    action: "navigate",
    description: "Matriz completa de competências técnicas: Clean Architecture, Next.js, Web Performance, IA e Sistemas Distribuídos.",
    target: "/skills",
    access: "public",
    breadcrumbs: ["Home", "Competências"],
    domSelector: "#skills-section",
  },
  performance: {
    id: "performance",
    resource: "page",
    action: "navigate",
    description: "Observatório de Performance em tempo real: telemetria do navegador do visitante (TTFB, FCP, LCP, CLS), diagnóstico por IA e benchmarks de arquitetura.",
    target: "/performance",
    access: "public",
    breadcrumbs: ["Home", "Performance"],
    domSelector: "#performance-section",
  },
  resume: {
    id: "resume",
    resource: "page",
    action: "navigate",
    description: "Currículo executivo completo em formato web estruturado.",
    target: "/resume",
    access: "public",
    breadcrumbs: ["Home", "Currículo"],
    domSelector: "#resume-section",
  },
  "resume-download": {
    id: "resume-download",
    resource: "action",
    action: "download",
    description: "Baixar currículo oficial em PDF (disponível em pt-BR e en-US).",
    target: "/resumes/guilherme-rodovalho-cv-pt.pdf",
    access: "public",
    parent: "resume",
    breadcrumbs: ["Home", "Currículo", "Download PDF"],
    domSelector: "#btn-download-resume",
  },
  about: {
    id: "about",
    resource: "page",
    action: "navigate",
    description: "Filosofia de engenharia: Clean Architecture, simplicidade, Core Web Vitals e IA segura.",
    target: "/about",
    access: "public",
    breadcrumbs: ["Home", "Sobre & Filosofia"],
    domSelector: "#about-section",
  },
  career: {
    id: "career",
    resource: "page",
    action: "navigate",
    description: "Central interativa de IA e WebMCP: diagnóstico de Gemini Nano on-device e explorer de ferramentas.",
    target: "/career",
    access: "public",
    breadcrumbs: ["Home", "AI Platform"],
    domSelector: "#career-section",
  },
  "auto-apply": {
    id: "auto-apply",
    resource: "tool",
    action: "execute",
    description: "AI Job Application / Auto Apply: Análise de vagas, preenchimento assistido via WebMCP e histórico de candidaturas.",
    target: "/career",
    access: "public",
    parent: "career",
    breadcrumbs: ["Home", "AI Platform", "AI Auto Apply"],
    domSelector: "#auto-apply-hub",
  },
  contact: {
    id: "contact",
    resource: "page",
    action: "navigate",
    description: "Informações de contato direto: email, LinkedIn, GitHub e disponibilidade para conversas.",
    target: "/contact",
    access: "public",
    breadcrumbs: ["Home", "Contato"],
    domSelector: "#contact-section",
  },
};

/**
 * Scans the active browser DOM for elements marked with data-mcp-*
 * and merges them dynamically with the portfolio semantic catalogue.
 */
export function scanSemanticDOM(): SemanticResourceMap {
  const map: SemanticResourceMap = { ...PORTFOLIO_SEMANTIC_RESOURCES };

  if (typeof window === "undefined" || typeof document === "undefined") {
    return map;
  }

  try {
    const elements = document.querySelectorAll<HTMLElement>("[data-mcp-id], [data-mcp-resource]");
    elements.forEach((el) => {
      const id = el.getAttribute("data-mcp-id") || el.id;
      const resource = el.getAttribute("data-mcp-resource") || "element";
      const action = (el.getAttribute("data-mcp-action") as SemanticResource["action"]) || "view";
      const description = el.getAttribute("data-mcp-description") || el.getAttribute("aria-label") || el.innerText?.slice(0, 100) || "";
      const target = el.getAttribute("data-mcp-target") || (el as HTMLAnchorElement).getAttribute("href") || undefined;
      const parent = el.getAttribute("data-mcp-parent") || undefined;

      if (id) {
        map[id] = {
          id,
          resource,
          action,
          description: description || map[id]?.description || `Recurso interativo ${id}`,
          target: target || map[id]?.target,
          access: "public",
          parent,
          breadcrumbs: map[id]?.breadcrumbs || ["Página Atual", id],
          domSelector: `[data-mcp-id="${id}"]`,
        };
      }
    });
  } catch (err) {
    console.warn("[WebMCP Scanner] Erro ao escanear o DOM:", err);
  }

  return map;
}

/**
 * Builds a hierarchical tree for visual inspection
 */
export function getSemanticResourceTree(): SemanticTreeNode[] {
  const map = scanSemanticDOM();
  const tree: SemanticTreeNode[] = [];
  const nodesById: Record<string, SemanticTreeNode> = {};

  Object.values(map).forEach((res) => {
    nodesById[res.id] = {
      id: res.id,
      resource: res.resource,
      name: res.id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: res.description,
      action: res.action,
      target: res.target,
      access: res.access,
      children: [],
    };
  });

  Object.values(map).forEach((res) => {
    const node = nodesById[res.id];
    if (res.parent && nodesById[res.parent]) {
      nodesById[res.parent].children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
}
