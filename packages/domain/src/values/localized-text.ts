export type SupportedLocale = "pt-BR" | "en-US";

export interface LocalizedText {
  "pt-BR": string;
  "en-US": string;
}

export function getLocalized(text: LocalizedText, locale: SupportedLocale): string {
  return text[locale] ?? text["pt-BR"] ?? "";
}
