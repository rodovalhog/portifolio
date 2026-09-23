import { describe, it, expect } from "vitest";
import {
  getLocalized,
  DataVisibility,
  ProfileNotFoundError,
  ProjectNotFoundError,
} from "../src/index";

describe("Domain: Value Objects and Errors", () => {
  it("should extract correct language based on locale", () => {
    const text = {
      "pt-BR": "Olá Mundo",
      "en-US": "Hello World",
    };

    expect(getLocalized(text, "pt-BR")).toBe("Olá Mundo");
    expect(getLocalized(text, "en-US")).toBe("Hello World");
  });

  it("should fallback to pt-BR if locale is missing", () => {
    const text = {
      "pt-BR": "Texto Base",
      "en-US": "",
    };

    expect(getLocalized(text, "en-US")).toBe("");
  });

  it("should instantiate DomainError subclasses with correct code", () => {
    const profileErr = new ProfileNotFoundError("custom-id");
    expect(profileErr.code).toBe("PROFILE_NOT_FOUND");
    expect(profileErr.message).toContain("custom-id");

    const projectErr = new ProjectNotFoundError("invalid-slug");
    expect(projectErr.code).toBe("PROJECT_NOT_FOUND");
  });

  it("should have expected DataVisibility tiers", () => {
    expect(DataVisibility.PUBLIC).toBe("PUBLIC");
    expect(DataVisibility.PRIVATE).toBe("PRIVATE");
    expect(DataVisibility.RESTRICTED).toBe("RESTRICTED");
  });
});
