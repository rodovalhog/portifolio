import { z } from "zod";

export const AccessLevelSchema = z.enum([
  "public",
  "recruiter",
  "engineer",
  "admin",
]);

export const MCPActionTypeSchema = z.enum([
  "navigate",
  "open",
  "view",
  "execute",
  "download",
  "filter",
  "switch_language",
  "adjust_font_size",
  "set_theme",
  "toggle_theme",
]);

export const SemanticResourceSchema = z.object({
  id: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  action: MCPActionTypeSchema,
  description: z.string(),
  target: z.string().optional(),
  context: z.union([z.record(z.string(), z.unknown()), z.string()]).optional(),
  access: AccessLevelSchema,
  parent: z.string().optional(),
  breadcrumbs: z.array(z.string()),
  domSelector: z.string().optional(),
});

export const SearchResourcesSchema = z.object({
  query: z.string().min(1),
  role: AccessLevelSchema.optional().default("public"),
});

export const NavigateToResourceSchema = z.object({
  resourceId: z.string().min(1),
  resourceContext: z.record(z.string(), z.unknown()).optional(),
  lang: z.string().optional(),
});

export const DownloadResumeSchema = z.object({
  language: z.enum(["pt-BR", "en-US"]).optional(),
});

export const SwitchLanguageSchema = z.object({
  locale: z.enum(["pt-BR", "en-US"]),
});

export const AdjustFontSizeSchema = z.object({
  action: z.enum(["increase", "decrease", "reset", "set_normal", "set_lg", "set_xl"]),
});

export const FilterProjectsSchema = z.object({
  tag: z.string().optional(),
});

export const SetThemeSchema = z.object({
  theme: z.enum(["dark", "light", "toggle"]).optional(),
});
