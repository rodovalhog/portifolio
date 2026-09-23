import { webMcpServer } from "./server";
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
} from "./types";
import { JobApplicationRecord, PreparedApplication } from "@portfolio/domain";
import { AutoFillResult } from "../auto-apply/types";

/**
 * WebMCP Client
 * Provides an idiomatic interface for AI agents to invoke tools on the WebMCP Server.
 */
export class WebMCPClient {
  public async searchResources(query: string): Promise<SemanticResource[]> {
    const res = await webMcpServer.searchResources({ query });
    return res.resources;
  }

  public async navigateToResource(resourceId: string, lang?: string): Promise<NavigationResult> {
    return await webMcpServer.navigateToResource({ resourceId, lang });
  }

  public async downloadResume(language?: "pt-BR" | "en-US"): Promise<{ success: boolean; url: string; filename: string }> {
    return await webMcpServer.downloadResume({ language });
  }

  public async switchLanguage(locale: "pt-BR" | "en-US"): Promise<{ success: boolean; newPath: string; locale: string }> {
    return await webMcpServer.switchLanguage({ locale });
  }

  public async adjustFontSize(action: "increase" | "decrease" | "reset" | "set_normal" | "set_lg" | "set_xl"): Promise<{ success: boolean; newSize: string; message: string }> {
    return await webMcpServer.adjustFontSize({ action });
  }

  public async prepareApplication(params: PrepareApplicationParams): Promise<PreparedApplication> {
    return await webMcpServer.prepareApplication(params);
  }

  public async fillApplication(params: FillApplicationParams): Promise<AutoFillResult> {
    return await webMcpServer.fillApplication(params);
  }

  public async submitApplication(params: SubmitApplicationParams): Promise<{ success: boolean; message: string; submittedAt?: string }> {
    return await webMcpServer.submitApplication(params);
  }

  public async getApplicationHistory(): Promise<JobApplicationRecord[]> {
    return await webMcpServer.getApplicationHistory();
  }

  /**
   * Executes a tool invocation dynamically by name and JSON arguments
   */
  public async executeTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<unknown> {
    switch (name) {
      case "navigate_to_resource":
        return await this.navigateToResource(
          (args.resourceId as string) || (args.target as string) || "home",
          args.lang as string
        );
      case "search_resources":
        return await this.searchResources((args.query as string) || "");
      case "download_resume":
        return await this.downloadResume(args.language as "pt-BR" | "en-US");
      case "switch_language":
        return await this.switchLanguage((args.locale as "pt-BR" | "en-US") || "pt-BR");
      case "adjust_font_size":
        return await this.adjustFontSize(
          (args.action as "increase" | "decrease" | "reset" | "set_normal" | "set_lg" | "set_xl") || "increase"
        );
      case "prepare_application":
        return await this.prepareApplication({
          jobUrl: args.jobUrl as string,
          resumeFilename: args.resumeFilename as string,
          resumeLocale: args.resumeLocale as "pt-BR" | "en-US",
        });
      case "fill_application":
        return await this.fillApplication({
          applicationId: args.applicationId as string,
          jobUrl: args.jobUrl as string,
          payload: (args.payload as Record<string, unknown>) || {},
        });
      case "submit_application":
        return await this.submitApplication({
          applicationId: args.applicationId as string,
          confirmHumanApproval: Boolean(args.confirmHumanApproval),
          jobUrl: args.jobUrl as string,
          payload: args.payload as Record<string, unknown>,
        });
      case "get_application_history":
        return await this.getApplicationHistory();
      default:
        throw new Error(`Ferramenta WebMCP desconhecida: ${name}`);
    }
  }
}

export const webMcpClient = new WebMCPClient();
