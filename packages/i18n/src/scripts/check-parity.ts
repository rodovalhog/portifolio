import { ptBR } from "../messages/pt-BR.js";
import { enUS } from "../messages/en-US.js";

function getKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getKeys(value as Record<string, unknown>, fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

export function validateParity(): boolean {
  const ptKeys = getKeys(ptBR as unknown as Record<string, unknown>);
  const enKeys = getKeys(enUS as unknown as Record<string, unknown>);

  const ptSet = new Set(ptKeys);
  const enSet = new Set(enKeys);

  const missingInEn = ptKeys.filter((k) => !enSet.has(k));
  const missingInPt = enKeys.filter((k) => !ptSet.has(k));

  if (missingInEn.length > 0) {
    console.error("❌ Keys present in pt-BR but missing in en-US:", missingInEn);
  }
  if (missingInPt.length > 0) {
    console.error("❌ Keys present in en-US but missing in pt-BR:", missingInPt);
  }

  if (missingInEn.length === 0 && missingInPt.length === 0) {
    console.log(`✅ i18n Parity Check PASSED: ${ptKeys.length} keys validated across all locales.`);
    return true;
  }

  return false;
}

if (process.argv[1]?.endsWith("check-parity.js") || process.argv[1]?.endsWith("check-parity.ts")) {
  const passed = validateParity();
  if (!passed) {
    process.exit(1);
  }
}
