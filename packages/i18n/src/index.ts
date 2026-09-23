import { SupportedLocale, TranslationSchema } from "./types.js";
import { ptBR } from "./messages/pt-BR.js";
import { enUS } from "./messages/en-US.js";

export * from "./types.js";
export { ptBR } from "./messages/pt-BR.js";
export { enUS } from "./messages/en-US.js";
export { validateParity } from "./scripts/check-parity.js";

const dictionaries: Record<SupportedLocale, TranslationSchema> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

export function getTranslations(locale: SupportedLocale): TranslationSchema {
  return dictionaries[locale] ?? dictionaries["pt-BR"];
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return locale === "pt-BR" || locale === "en-US";
}
