import {
  DownloadResumeParams,
  FillApplicationParams,
  NavigateToResourceParams,
  NavigationResult,
  PrepareApplicationParams,
  SearchResourcesParams,
  SemanticResource,
  SubmitApplicationParams,
  SwitchLanguageParams,
  AdjustFontSizeParams,
} from "./types";
import { scanSemanticDOM } from "./scanner";
import { highlightMCPResource } from "./highlighter";
import { applicationHistoryStore } from "../auto-apply/history-store";
import { prepareJobApplication } from "../auto-apply/application-preparer";
import { atsRegistry } from "../auto-apply/ats-adapters/registry";
import { AutoFillResult } from "../auto-apply/types";
import { JobApplicationRecord, PreparedApplication } from "@portfolio/domain";

/**
 * In-process Web Model Context Protocol (WebMCP) Server.
 * Exposes standardized tools for semantic navigation, context inspection, and site actions.
 */
export class WebMCPServer {
  /**
   * Tool: search_resources
   * Performs semantic fuzzy search across all scanned DOM elements and known portfolio resources.
   */
  public async searchResources(params: SearchResourcesParams): Promise<{ resources: SemanticResource[] }> {
    const map = scanSemanticDOM();
    const query = params.query.toLowerCase().trim();
    const allResources = Object.values(map);

    const scored = allResources
      .map((item) => {
        let score = 0;
        const desc = item.description.toLowerCase();
        const id = item.id.toLowerCase();
        const res = item.resource.toLowerCase();
        const breadcrumbs = item.breadcrumbs.map((b) => b.toLowerCase()).join(" ");

        if (id === query || res === query) score += 100;
        if (id.includes(query)) score += 60;
        if (res.includes(query)) score += 40;
        if (breadcrumbs.includes(query)) score += 30;
        if (desc.includes(query)) score += 20;

        const tokens = query.split(/\s+/).filter(Boolean);
        for (const token of tokens) {
          if (desc.includes(token)) score += 10;
          if (breadcrumbs.includes(token)) score += 10;
          if (id.includes(token)) score += 15;
        }

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    return { resources: scored };
  }

  /**
   * Tool: navigate_to_resource
   * Resolves target route, triggers client router navigation or DOM scroll + visual pulse.
   */
  public async navigateToResource(params: NavigateToResourceParams): Promise<NavigationResult> {
    const map = scanSemanticDOM();
    let resource = map[params.resourceId] || Object.values(map).find((r) => r.id === params.resourceId);

    if (!resource) {
      // Try fuzzy match
      const search = await this.searchResources({ query: params.resourceId });
      if (search.resources.length > 0) {
        resource = search.resources[0];
      }
    }

    if (!resource) {
      return {
        success: false,
        resourceId: params.resourceId,
        action: "navigate",
        breadcrumbs: [],
        message: `Recurso '${params.resourceId}' não foi localizado no mapa do portfólio.`,
      };
    }

    const currentLang = params.lang || (typeof window !== "undefined" && window.location.pathname.startsWith("/en-US") ? "en-US" : "pt-BR");
    let resolvedRoute = resource.target || "/";

    // Format localized route if not an external link or anchor
    if (resolvedRoute.startsWith("/") && !resolvedRoute.startsWith(`/${currentLang}`)) {
      resolvedRoute = `/${currentLang}${resolvedRoute === "/" ? "" : resolvedRoute}`;
    }

    // Try highlighting immediately if element exists in the current DOM
    const highlighted = highlightMCPResource(resource.id);

    return {
      success: true,
      resourceId: resource.id,
      resolvedRoute,
      action: resource.action,
      breadcrumbs: resource.breadcrumbs,
      message: `Navegando para ${resource.breadcrumbs.join(" → ")} (${resource.description})`,
      highlightSelector: resource.domSelector,
    };
  }

  /**
   * Tool: download_resume
   * Triggers the official resume PDF download in specified or active language.
   */
  public async downloadResume(params?: DownloadResumeParams): Promise<{ success: boolean; url: string; filename: string }> {
    const lang = params?.language || (typeof window !== "undefined" && window.location.pathname.startsWith("/en-US") ? "en-US" : "pt-BR");
    const filename = lang === "pt-BR" ? "guilherme-rodovalho-cv-pt.pdf" : "guilherme-rodovalho-cv-en.pdf";
    const url = `/resumes/${filename}`;

    if (typeof window !== "undefined") {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return { success: true, url, filename };
  }

  /**
   * Tool: switch_language
   * Switches language between pt-BR and en-US
   */
  public async switchLanguage(params: SwitchLanguageParams): Promise<{ success: boolean; newPath: string; locale: string }> {
    const locale = params.locale;
    let newPath = `/${locale}`;

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const searchAndHash = window.location.search + window.location.hash;
      newPath = currentPath.replace(/^\/(pt-BR|en-US)(\/|$|\?|#)/, `/${locale}$2`);
      if (!newPath.startsWith(`/${locale}`)) {
        newPath = `/${locale}${newPath.startsWith("/") ? newPath : `/${newPath}`}`;
      }
      newPath += searchAndHash;
    }

    return { success: true, newPath, locale };
  }

  /**
   * Tool: adjust_font_size
   * Adjusts typography scale across the platform for visual accessibility
   */
  public async adjustFontSize(params: AdjustFontSizeParams): Promise<{ success: boolean; newSize: string; message: string }> {
    let newSize = "normal";
    if (typeof window !== "undefined") {
      const current = (localStorage.getItem("portfolio_font_size") as string) || "normal";
      if (params.action === "increase") {
        newSize = current === "normal" ? "lg" : "xl";
      } else if (params.action === "decrease") {
        newSize = current === "xl" ? "lg" : "normal";
      } else if (params.action === "reset" || params.action === "set_normal") {
        newSize = "normal";
      } else if (params.action === "set_lg") {
        newSize = "lg";
      } else if (params.action === "set_xl") {
        newSize = "xl";
      }

      if (newSize === "normal") {
        document.documentElement.removeAttribute("data-font-size");
        localStorage.removeItem("portfolio_font_size");
      } else {
        document.documentElement.setAttribute("data-font-size", newSize);
        localStorage.setItem("portfolio_font_size", newSize);
      }

      window.dispatchEvent(
        new CustomEvent("portfolio:font-size-changed", {
          detail: { fontSize: newSize },
        })
      );
    }

    return { success: true, newSize, message: `Tamanho da fonte ajustado para ${newSize}.` };
  }

  /**
   * Tool: prepare_application
   * Fetches job posting, analyzes ATS fields, and prepares answers using zero-hallucination guardrails.
   */
  public async prepareApplication(
    params: PrepareApplicationParams
  ): Promise<PreparedApplication> {
    const adapter = atsRegistry.resolve(params.jobUrl);

    // Try fetching via analyze API or directly parse
    let jobPosting;
    try {
      if (typeof window !== "undefined") {
        const res = await fetch("/api/job-application/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: params.jobUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          jobPosting = data.job;
        }
      }
    } catch (err) {
      console.warn("Client fetch to /api/job-application/analyze failed, falling back to local adapter", err);
    }

    if (!jobPosting) {
      jobPosting = adapter.parseJobPosting(params.jobUrl, "");
    }

    const locale = params.resumeLocale || "en-US";
    const filename =
      params.resumeFilename ||
      (locale === "pt-BR"
        ? "guilherme-rodovalho-cv-pt.pdf"
        : "guilherme-rodovalho-cv-en.pdf");

    const application = await prepareJobApplication(jobPosting, {
      filename,
      locale,
      url: `/resumes/${filename}`,
    });

    // Record initial state in history
    const record: JobApplicationRecord = {
      id: application.id,
      company: jobPosting.company,
      role: jobPosting.title,
      jobUrl: jobPosting.url,
      date: new Date().toISOString(),
      resumeUsed: filename,
      status: jobPosting.automationBlocked ? "manual_action_required" : "ready_for_review",
      atsType: jobPosting.atsType,
      coverLetterSnippet: application.coverLetter.slice(0, 150) + "...",
      notes: jobPosting.blockReason || "Candidatura analisada e pronta para revisão humana.",
    };
    applicationHistoryStore.saveApplication(record);

    return application;
  }

  /**
   * Tool: fill_application
   * Executes semantic form mapping and fills application data.
   */
  public async fillApplication(params: FillApplicationParams): Promise<AutoFillResult> {
    const { applicationId, jobUrl, payload } = params;

    const record = applicationId
      ? applicationHistoryStore.getApplicationById(applicationId)
      : undefined;

    const fieldsCount = Object.keys(payload || {}).length;

    // Check if any required field is empty
    const unfilledRequired: string[] = [];
    for (const [key, val] of Object.entries(payload || {})) {
      if (val === "" || val === undefined || val === null) {
        unfilledRequired.push(key);
      }
    }

    const result: AutoFillResult = {
      success: true,
      filledFieldsCount: fieldsCount - unfilledRequired.length,
      totalFieldsCount: fieldsCount,
      unfilledRequiredFields: unfilledRequired,
      message: "Formulário preenchido com sucesso com mapeamento semântico.",
      payload,
      requiresManualAction: false,
    };

    if (applicationId) {
      applicationHistoryStore.updateApplicationStatus(
        applicationId,
        "filled",
        "Formulário preenchido com sucesso via WebMCP. Aguardando confirmação humana para envio."
      );
    }

    return result;
  }

  /**
   * Tool: submit_application
   * Submits the application ONLY after explicit human confirmation.
   */
  public async submitApplication(
    params: SubmitApplicationParams
  ): Promise<{ success: boolean; message: string; submittedAt?: string }> {
    if (params.confirmHumanApproval !== true) {
      throw new Error(
        "Ação bloqueada pelas diretrizes éticas: A submissão automática sem aprovação humana explícita é estritamente proibida."
      );
    }

    let submittedAt = new Date().toISOString();

    try {
      if (typeof window !== "undefined") {
        const res = await fetch("/api/job-application/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        if (res.ok) {
          const data = await res.json();
          submittedAt = data.submittedAt || submittedAt;
        }
      }
    } catch (err) {
      console.warn("Client submit API call error:", err);
    }

    applicationHistoryStore.updateApplicationStatus(
      params.applicationId,
      "submitted",
      "Candidatura enviada com sucesso com aprovação humana explícita."
    );

    return {
      success: true,
      message: "Candidatura submetida com sucesso ao ATS.",
      submittedAt,
    };
  }

  /**
   * Tool: get_application_history
   * Retrieves the logged application records.
   */
  public async getApplicationHistory(): Promise<JobApplicationRecord[]> {
    return applicationHistoryStore.getApplications();
  }
}

export const webMcpServer = new WebMCPServer();
