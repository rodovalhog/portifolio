import { describe, it, expect } from "vitest";
import { getTranslations } from "../src/index";
import { validateParity } from "../src/scripts/check-parity";

describe("i18n: Dictionary parity and translation lookup", () => {
  it("should have 100% key parity between pt-BR and en-US", () => {
    expect(validateParity()).toBe(true);
  });

  it("should retrieve valid translation schema for pt-BR", () => {
    const t = getTranslations("pt-BR");
    expect(t.common.name).toBe("Guilherme Rodovalho");
    expect(t.navigation.home).toBe("Início");
  });

  it("should retrieve valid translation schema for en-US", () => {
    const t = getTranslations("en-US");
    expect(t.common.name).toBe("Guilherme Rodovalho");
    expect(t.navigation.home).toBe("Home");
  });
});
