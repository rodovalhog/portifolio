import path from "node:path";
import { describe, it, expect } from "vitest";
import { FileProfileRepository } from "../src/index";

describe("Infrastructure: FileProfileRepository", () => {
  const contentPath = path.resolve(__dirname, "../../../content/profile.json");
  const repo = new FileProfileRepository(contentPath);

  it("should successfully load and validate profile from JSON", async () => {
    const profile = await repo.getProfile();
    expect(profile.id).toBe("guilherme-rodovalho");
    expect(profile.personal.name).toBe("Guilherme Rodovalho");
    expect(profile.experiences.length).toBeGreaterThan(0);
    expect(profile.projects.length).toBeGreaterThan(0);
    expect(profile.skills.length).toBeGreaterThan(0);
  });

  it("should return sorted projects", async () => {
    const projects = await repo.getProjects();
    expect(projects[0].order).toBeLessThanOrEqual(projects[1]?.order ?? 100);
  });

  it("should find project by valid slug", async () => {
    const project = await repo.getProjectBySlug("high-scale-search-architecture");
    expect(project).not.toBeNull();
    expect(project?.slug).toBe("high-scale-search-architecture");
  });

  it("should return null for non-existing project slug", async () => {
    const project = await repo.getProjectBySlug("non-existing-slug");
    expect(project).toBeNull();
  });

  it("should filter skills by category when requested", async () => {
    const frontendSkills = await repo.getSkills({ category: "frontend" });
    expect(frontendSkills.every((s) => s.category === "frontend")).toBe(true);
  });
});
