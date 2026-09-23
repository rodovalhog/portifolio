import { AIProvider, AIProviderResponse, ToolCall } from "./types";
import { webMcpClient } from "../mcp/client";

/**
 * Deterministic Heuristic Portfolio Agent
 *
 * Grounded 100% in verified data from content/profile.json.
 * Guarantees zero latency, zero hallucinations, and immediate interactive WebMCP execution
 * even when the user has no Gemini API key or is running a browser without Chrome Built-in AI.
 */
export class HeuristicPortfolioProvider implements AIProvider {
  public name = "Portfolio Deterministic Agent (WebMCP Heurístico)";

  public async processQuery(
    query: string,
    currentContext?: Record<string, unknown>
  ): Promise<AIProviderResponse> {
    const q = query.toLowerCase().trim();
    const toolCalls: ToolCall[] = [];
    let suggestedResource: string | undefined;
    let message = "";

    // 1. Download Resume intent
    if (
      q.includes("currículo") ||
      q.includes("curriculo") ||
      q.includes("cv") ||
      q.includes("resume") ||
      q.includes("baixar") ||
      q.includes("download")
    ) {
      const isEnglish = q.includes("english") || q.includes("en") || q.includes("inglês") || q.includes("ingles");
      const lang = isEnglish ? "en-US" : "pt-BR";
      const result = await webMcpClient.downloadResume(lang);
      suggestedResource = "resume-download";
      toolCalls.push({
        name: "download_resume",
        input: { language: lang },
        output: result,
      });
      message = `📄 **Download do Currículo Iniciado!**\n\nO arquivo oficial em PDF (\`${result.filename}\`) está sendo baixado. Você também pode visualizar o currículo online na seção **/resume**.`;
      return { message, suggestedResource, toolCalls };
    }

    // 2. Language switch intent
    if (
      q.includes("mudar idioma") ||
      q.includes("trocar idioma") ||
      q.includes("inglês") ||
      q.includes("ingles") ||
      q.includes("português") ||
      q.includes("portugues") ||
      q.includes("english") ||
      q.includes("switch language")
    ) {
      const targetLocale = q.includes("português") || q.includes("portugues") || q.includes("pt") ? "pt-BR" : "en-US";
      const result = await webMcpClient.switchLanguage(targetLocale);
      toolCalls.push({
        name: "switch_language",
        input: { locale: targetLocale },
        output: result,
      });
      message = `🌐 **Idioma alterado para ${targetLocale === "pt-BR" ? "Português (pt-BR)" : "English (en-US)"}!**\n\nA aplicação está atualizando as rotas e textos.`;
      return { message, toolCalls };
    }

    // 2.1 Font size adjustment intent
    if (
      q.includes("fonte") ||
      q.includes("font") ||
      q.includes("letra") ||
      q.includes("texto maior") ||
      q.includes("texto menor") ||
      q.includes("aumentar texto") ||
      q.includes("diminuir texto")
    ) {
      let action: "increase" | "decrease" | "reset" = "increase";
      if (
        q.includes("diminuir") ||
        q.includes("menor") ||
        q.includes("reduzir") ||
        q.includes("decrease") ||
        q.includes("smaller")
      ) {
        action = "decrease";
      } else if (
        q.includes("normal") ||
        q.includes("padrao") ||
        q.includes("padrão") ||
        q.includes("reset") ||
        q.includes("voltar") ||
        q.includes("restaurar") ||
        q.includes("default")
      ) {
        action = "reset";
      }

      const result = await webMcpClient.adjustFontSize(action);
      toolCalls.push({
        name: "adjust_font_size",
        input: { action },
        output: result,
      });

      if (action === "reset") {
        message = `🔤 **Tamanho da Fonte Restaurado!**\n\nA tipografia da aplicação voltou ao tamanho original (100%). Você também pode ajustar a qualquer momento pelos botões [A- / A / A+] no topo da página.`;
      } else if (action === "decrease") {
        message = `🔤 **Tamanho da Fonte Reduzido!**\n\nO tamanho da fonte foi reduzido via WebMCP para visualização mais compacta.`;
      } else {
        message = `🔤 **Tamanho da Fonte Aumentado!**\n\nO tamanho da fonte foi aumentado via ferramenta WebMCP para proporcionar maior legibilidade e acessibilidade. Para voltar ao normal, basta pedir aqui ou clicar no botão [A+] no topo da página.`;
      }
      return { message, toolCalls };
    }

    // 2.2 Performance Observatory intent
    if (
      q.includes("telemetria") ||
      q.includes("observatório") ||
      q.includes("observatorio") ||
      q.includes("tempo de carregamento") ||
      q.includes("dados de performance") ||
      q.includes("métrica do navegador") ||
      q.includes("metrica do navegador") ||
      q.includes("core web vitals") ||
      (q.includes("performance") &&
        (q.includes("site") ||
          q.includes("aplicação") ||
          q.includes("aplicacao") ||
          q.includes("navegador") ||
          q.includes("ver") ||
          q.includes("mostrar") ||
          q.includes("abrir")))
    ) {
      suggestedResource = "performance";
      const navResult = await webMcpClient.navigateToResource("performance");
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: "performance" },
        output: navResult,
      });

      message = `⚡ **Observatório de Performance em Tempo Real Ativado!**\n\nNavegando para **/performance** para inspecionar a telemetria ao vivo do seu navegador (TTFB, FCP, LCP, CLS, hardware e rede) auditados pela IA.`;
      return { message, suggestedResource, toolCalls };
    }

    // 3. Casas Bahia / High Scale / LCP case
    if (
      q.includes("casas bahia") ||
      q.includes("lcp") ||
      q.includes("inp") ||
      q.includes("performance") ||
      q.includes("escala") ||
      q.includes("black friday") ||
      q.includes("150k") ||
      q.includes("otimização")
    ) {
      suggestedResource = "casas-bahia-staff";
      const navResult = await webMcpClient.navigateToResource("casas-bahia-staff");
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: "casas-bahia-staff" },
        output: navResult,
      });

      message = `⚡ **Case Casas Bahia — Redução de LCP e Alta Escala (150k rpm):**\n\n` +
        `• **Papel:** Staff Software Engineer / Tech Lead.\n` +
        `• **Desafio:** LCP na busca ultrapassava **4.2s** no 4G mobile, impactando a conversão durante a Black Friday.\n` +
        `• **Decisão:** Migração para **Next.js Server Components com Edge Streaming**, eliminação de bundles monolíticos legados e cache stale-while-revalidate.\n` +
        `• **Impacto:**\n` +
        `  - **LCP:** 4.2s ➔ **1.4s** (-66% de latência percebida)\n` +
        `  - **INP:** mantido abaixo de **80ms** (p95)\n` +
        `  - **Conversão de busca:** aumento mensurável de **+14%**\n` +
        `  - **Disponibilidade:** **99.99%** sustentando picos > 150.000 rpm.\n\n` +
        `*Acabei de navegar e destacar o case na sua tela via WebMCP!*`;

      return { message, suggestedResource, toolCalls };
    }

    // 4. Experience navigation
    if (
      q.includes("experiência") ||
      q.includes("experiencia") ||
      q.includes("carreira") ||
      q.includes("onde trabalhou") ||
      q.includes("histórico")
    ) {
      suggestedResource = "experience";
      const navResult = await webMcpClient.navigateToResource("experience");
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: "experience" },
        output: navResult,
      });

      message = `💼 **Histórico Profissional de Guilherme Rodovalho:**\n\n` +
        `Com mais de uma década de engenharia de software de alta escala, Guilherme atuou como **Staff Software Engineer / Tech Lead no Grupo Casas Bahia**, liderando a modernização do storefront e da busca.\n\n` +
        `Naveguei para a seção de **Experiência** para você visualizar a timeline completa!`;

      return { message, suggestedResource, toolCalls };
    }

    // 5. Projects navigation
    if (
      q.includes("projeto") ||
      q.includes("projects") ||
      q.includes("portfólio") ||
      q.includes("portfolio") ||
      q.includes("trabalhos")
    ) {
      suggestedResource = "projects";
      const navResult = await webMcpClient.navigateToResource("projects");
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: "projects" },
        output: navResult,
      });

      message = `🚀 **Projetos de Engenharia e IA:**\n\n` +
        `Guilherme desenhou projetos que combinam **Clean Architecture**, **Sistemas Distribuídos**, **WebMCP** e **Chrome Built-in AI**.\n\n` +
        `Rolei a tela e posicionei você na seção de **Projetos**!`;

      return { message, suggestedResource, toolCalls };
    }

    // 6. Skills navigation
    if (
      q.includes("skill") ||
      q.includes("habilidade") ||
      q.includes("stack") ||
      q.includes("tecnologia") ||
      q.includes("next.js") ||
      q.includes("react") ||
      q.includes("typescript")
    ) {
      suggestedResource = "skills";
      const navResult = await webMcpClient.navigateToResource("skills");
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: "skills" },
        output: navResult,
      });

      message = `🛠️ **Stack Tecnológica & Competências Principais:**\n\n` +
        `• **Frontend Core:** Next.js (App Router, RSC), React, TypeScript, Tailwind CSS.\n` +
        `• **Arquitetura & Engenharia:** Clean Architecture, SOLID, Micro Frontends, Design Systems.\n` +
        `• **Performance Web:** Core Web Vitals (LCP, INP, CLS), Edge Streaming, Multi-tier Caching.\n` +
        `• **AI & Protocolos:** Model Context Protocol (WebMCP), Chrome Built-in AI (Gemini Nano), Gemini Vision, Agentes Autônomos.\n` +
        `• **Backend & Dados:** Node.js, Redis, Kafka, PostgreSQL, Docker.\n\n` +
        `Naveguei até a seção de **Competências**!`;

      return { message, suggestedResource, toolCalls };
    }

    // 7. Philosophy / About navigation
    if (
      q.includes("filosofia") ||
      q.includes("clean architecture") ||
      q.includes("sobre") ||
      q.includes("about") ||
      q.includes("princípios") ||
      q.includes("principios")
    ) {
      suggestedResource = "about";
      const navResult = await webMcpClient.navigateToResource("about");
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: "about" },
        output: navResult,
      });

      message = `📐 **Filosofia de Engenharia de Guilherme Rodovalho:**\n\n` +
        `1. **Simplicidade sobre abstrações especulativas**: Só adicionar filas ou microserviços quando houver necessidade mensurável.\n` +
        `2. **Limites Arquiteturais Fortes (Clean Architecture)**: O domínio nunca depende de frameworks ou provedores externos.\n` +
        `3. **Performance é Feature de Produto**: Cada milissegundo de LCP/INP impacta retenção e receita.\n` +
        `4. **IA com Rigor e Segurança**: Zero alucinação, proveniência e validação estrita.\n\n` +
        `Naveguei até a página de **Filosofia & Arquitetura**!`;

      return { message, suggestedResource, toolCalls };
    }

    // 8. Contact / Availability
    if (
      q.includes("contato") ||
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("linkedin") ||
      q.includes("falar") ||
      q.includes("contratar") ||
      q.includes("disponibilidade")
    ) {
      suggestedResource = "contact";
      const navResult = await webMcpClient.navigateToResource("contact");
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: "contact" },
        output: navResult,
      });

      message = `📬 **Contato & Disponibilidade:**\n\n` +
        `• **Status:** Aberto a conversas estratégicas e liderança técnica como Staff Engineer / Tech Lead.\n` +
        `• **Email:** \`rodovalhogdeveloper@gmail.com\`\n` +
        `• **Localização:** São Paulo, SP — Brasil (atuação remota ou híbrida)\n\n` +
        `Abri a seção de **Contato** para você!`;

      return { message, suggestedResource, toolCalls };
    }

    // 9. WebMCP / AI Platform
    if (
      q.includes("mcp") ||
      q.includes("nano") ||
      q.includes("on-device") ||
      q.includes("como funciona") ||
      q.includes("inteligência artificial") ||
      q.includes("ia")
    ) {
      suggestedResource = "career";
      const navResult = await webMcpClient.navigateToResource("career");
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: "career" },
        output: navResult,
      });

      message = `🤖 **Arquitetura WebMCP + Chrome Built-in AI:**\n\n` +
        `Este portfólio integra um **AI Navigation Layer** com 3 pilares:\n` +
        `1. **DOM Semântico**: Atributos declarativos \`data-mcp-*\` permitindo mapeamento ultra-leve.\n` +
        `2. **WebMCP Server In-App**: Ferramentas tipadas com Zod para navegação e ações.\n` +
        `3. **Tri-Provider Orchestrator**: Gemini Nano (on-device local), Gemini Cloud (API) e Agente Heurístico de Alta Fidelidade.\n\n` +
        `Você está na página **/career** onde pode inspecionar os recursos e status do modelo local!`;

      return { message, suggestedResource, toolCalls };
    }

    // Default fallback: search semantic resources
    const search = await webMcpClient.searchResources(q);
    if (search.length > 0) {
      const top = search[0];
      suggestedResource = top.id;
      const navResult = await webMcpClient.navigateToResource(top.id);
      toolCalls.push({
        name: "navigate_to_resource",
        input: { resourceId: top.id },
        output: navResult,
      });

      message = `Encontrei o recurso **${top.breadcrumbs.join(" → ")}** relevante para sua busca (*"${top.description}"*). Naveguei para o local correspondente!`;
    } else {
      message = `Olá! Sou o **AI Navigator do Portfólio de Guilherme Rodovalho**.\n\nVocê pode me perguntar sobre:\n` +
        `• *"Como reduziu o LCP nas Casas Bahia?"*\n` +
        `• *"Mostre os projetos de IA e WebMCP"*\n` +
        `• *"Quais as competências principais?"*\n` +
        `• *"Baixar currículo em PDF"*\n` +
        `• *"Mudar o idioma para inglês"*`;
    }

    return { message, suggestedResource, toolCalls };
  }
}
