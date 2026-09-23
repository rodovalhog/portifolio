import { describe, it, expect } from "vitest";
import { WebMCPServer } from "../server";
import { WebMCPClient } from "../client";
import { HeuristicPortfolioProvider } from "../../ai/heuristic-provider";

describe("WebMCP Server & Tools", () => {
  const server = new WebMCPServer();

  it("should find resources via semantic fuzzy search", async () => {
    const res = await server.searchResources({ query: "casas bahia" });
    expect(res.resources.length).toBeGreaterThan(0);
    expect(res.resources[0].id).toBe("casas-bahia-staff");
  });

  it("should resolve route for navigation to Casas Bahia case", async () => {
    const nav = await server.navigateToResource({ resourceId: "casas-bahia-staff", lang: "pt-BR" });
    expect(nav.success).toBe(true);
    expect(nav.resolvedRoute).toContain("experience");
  });

  it("should generate proper resume download payload for pt-BR and en-US", async () => {
    const pt = await server.downloadResume({ language: "pt-BR" });
    expect(pt.success).toBe(true);
    expect(pt.filename).toBe("guilherme-rodovalho-cv-pt.pdf");

    const en = await server.downloadResume({ language: "en-US" });
    expect(en.success).toBe(true);
    expect(en.filename).toBe("guilherme-rodovalho-cv-en.pdf");
  });

  it("should correctly switch language between pt-BR and en-US", async () => {
    const sw = await server.switchLanguage({ locale: "en-US" });
    expect(sw.success).toBe(true);
    expect(sw.locale).toBe("en-US");
    expect(sw.newPath).toContain("/en-US");
  });

  it("should handle adjust_font_size actions", async () => {
    const res = await server.adjustFontSize({ action: "increase" });
    expect(res.success).toBe(true);
  });
});

describe("WebMCP Client", () => {
  const client = new WebMCPClient();

  it("should execute navigate_to_resource dynamically", async () => {
    const res = (await client.executeTool("navigate_to_resource", {
      resourceId: "projects",
    })) as { success: boolean; resolvedRoute?: string };
    expect(res.success).toBe(true);
    expect(res.resolvedRoute).toContain("projects");
  });

  it("should execute download_resume dynamically", async () => {
    const res = (await client.executeTool("download_resume", {
      language: "en-US",
    })) as { success: boolean; filename: string };
    expect(res.success).toBe(true);
    expect(res.filename).toBe("guilherme-rodovalho-cv-en.pdf");
  });
});

describe("HeuristicPortfolioProvider", () => {
  const provider = new HeuristicPortfolioProvider();

  it("should answer Casas Bahia LCP question with verified metrics and generate toolCall", async () => {
    const res = await provider.processQuery("Como você reduziu o LCP nas Casas Bahia?");
    expect(res.message).toContain("1.4s");
    expect(res.message).toContain("-66%");
    expect(res.toolCalls?.length).toBeGreaterThan(0);
    expect(res.toolCalls?.[0].name).toBe("navigate_to_resource");
    expect(res.toolCalls?.[0].input.resourceId).toBe("casas-bahia-staff");
  });

  it("should detect resume download intent and trigger download_resume tool", async () => {
    const res = await provider.processQuery("Gostaria de baixar o currículo em PDF");
    expect(res.toolCalls?.length).toBeGreaterThan(0);
    expect(res.toolCalls?.[0].name).toBe("download_resume");
    expect(res.suggestedResource).toBe("resume-download");
  });

  it("should detect language switch intent and trigger switch_language tool", async () => {
    const res = await provider.processQuery("Quero mudar o idioma para inglês");
    expect(res.toolCalls?.length).toBeGreaterThan(0);
    expect(res.toolCalls?.[0].name).toBe("switch_language");
    expect(res.toolCalls?.[0].input.locale).toBe("en-US");
  });
});
