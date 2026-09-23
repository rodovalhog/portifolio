/**
 * Access levels for portfolio resources and actions
 */
export type AccessLevel = "public" | "recruiter" | "engineer" | "admin";

/**
 * Valid action verbs for WebMCP elements
 */
export type MCPActionType =
  | "navigate"
  | "open"
  | "view"
  | "execute"
  | "download"
  | "filter"
  | "switch_language"
  | "adjust_font_size";

/**
 * Semantic Resource representation extracted from DOM or catalogue
 */
export interface SemanticResource {
  id: string;
  resource: string;
  resourceId?: string;
  action: MCPActionType;
  description: string;
  target?: string;
  context?: Record<string, unknown> | string;
  access: AccessLevel;
  parent?: string;
  breadcrumbs: string[];
  domSelector?: string;
}

/**
 * Map of scanned resources indexed by unique semantic ID
 */
export type SemanticResourceMap = Record<string, SemanticResource>;

/**
 * Tree node for the WebMCP Resource Inspector
 */
export interface SemanticTreeNode {
  id: string;
  resource: string;
  name: string;
  description: string;
  action: MCPActionType;
  target?: string;
  access: AccessLevel;
  children: SemanticTreeNode[];
}

/**
 * Tool Parameters & Payloads
 */
export interface SearchResourcesParams {
  query: string;
  role?: AccessLevel;
}

export interface NavigateToResourceParams {
  resourceId: string;
  resourceContext?: Record<string, unknown>;
  lang?: string;
}

export interface DownloadResumeParams {
  language?: "pt-BR" | "en-US";
}

export interface SwitchLanguageParams {
  locale: "pt-BR" | "en-US";
}

export interface AdjustFontSizeParams {
  action: "increase" | "decrease" | "reset" | "set_normal" | "set_lg" | "set_xl";
}

export interface FilterProjectsParams {
  tag?: string;
}

export interface PrepareApplicationParams {
  jobUrl: string;
  resumeFilename?: string;
  resumeLocale?: "pt-BR" | "en-US";
}

export interface FillApplicationParams {
  applicationId?: string;
  jobUrl: string;
  payload: Record<string, unknown>;
}

export interface SubmitApplicationParams {
  applicationId: string;
  confirmHumanApproval: boolean;
  jobUrl?: string;
  payload?: Record<string, unknown>;
}

export interface NavigationResult {
  success: boolean;
  resourceId: string;
  resolvedRoute?: string;
  action: MCPActionType;
  breadcrumbs: string[];
  message: string;
  highlightSelector?: string;
}

/**
 * Telemetry & Observability Events
 */
export type TelemetryEventType =
  | "ai.mcp.tool_called"
  | "ai.mcp.navigation_executed"
  | "ai.mcp.resource_highlighted"
  | "ai.mcp.action_executed"
  | "ai.mcp.error";

export interface TelemetryEvent {
  id: string;
  event: TelemetryEventType;
  timestamp: number;
  toolName?: string;
  resourceId?: string;
  durationMs: number;
  provider: string;
  metadata?: Record<string, unknown>;
}

/**
 * Chat Message Types
 */
export interface AIChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  navigationCard?: {
    title: string;
    resourceId: string;
    breadcrumbs: string[];
    actionLabel: string;
    targetRoute: string;
  };
  toolCalls?: Array<{
    name: string;
    input: Record<string, unknown>;
    output?: unknown;
  }>;
}
