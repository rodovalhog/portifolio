import fs from "node:fs/promises";
import path from "node:path";
import {
  ProfileRepository,
  ProfileFilterOptions,
  ProfessionalProfile,
  Project,
  Experience,
  Skill,
  DataVisibility,
  ProfileNotFoundError,
  ProjectNotFoundError,
} from "@portfolio/domain";
import { ProfessionalProfileSchema } from "../schemas/profile-schema.js";

export class FileProfileRepository implements ProfileRepository {
  private cachedProfile: ProfessionalProfile | null = null;
  private readonly filePath: string;

  constructor(customFilePath?: string) {
    this.filePath =
      customFilePath ??
      path.resolve(process.cwd(), "../../content/profile.json");
  }

  private async loadRaw(): Promise<ProfessionalProfile> {
    if (this.cachedProfile) {
      return this.cachedProfile;
    }

    let fileContent: string;
    try {
      fileContent = await fs.readFile(this.filePath, "utf-8");
    } catch {
      // Fallback try resolving from workspace root if running from apps/web
      try {
        const fallbackPath = path.resolve(process.cwd(), "content/profile.json");
        fileContent = await fs.readFile(fallbackPath, "utf-8");
      } catch (err) {
        throw new ProfileNotFoundError(`File not found at ${this.filePath} or fallback.`);
      }
    }

    const parsedJson = JSON.parse(fileContent);
    const validated = ProfessionalProfileSchema.parse(parsedJson);
    this.cachedProfile = validated as ProfessionalProfile;
    return this.cachedProfile;
  }

  private filterByVisibility<T extends { visibility: DataVisibility }>(
    items: T[],
    includePrivate?: boolean
  ): T[] {
    if (includePrivate) {
      return items;
    }
    return items.filter((item) => item.visibility === DataVisibility.PUBLIC);
  }

  public async getProfile(options?: ProfileFilterOptions): Promise<ProfessionalProfile> {
    const raw = await this.loadRaw();
    const includePrivate = options?.includePrivate ?? false;

    return {
      ...raw,
      experiences: this.filterByVisibility(raw.experiences, includePrivate),
      projects: this.filterByVisibility(raw.projects, includePrivate),
      skills: this.filterByVisibility(raw.skills, includePrivate),
      education: this.filterByVisibility(raw.education, includePrivate),
      certifications: this.filterByVisibility(raw.certifications, includePrivate),
      achievements: this.filterByVisibility(raw.achievements, includePrivate),
      languages: this.filterByVisibility(raw.languages, includePrivate),
    };
  }

  public async getProjects(options?: ProfileFilterOptions): Promise<Project[]> {
    const profile = await this.getProfile(options);
    return profile.projects.sort((a, b) => a.order - b.order);
  }

  public async getProjectBySlug(
    slug: string,
    options?: ProfileFilterOptions
  ): Promise<Project | null> {
    const projects = await this.getProjects(options);
    const found = projects.find((p) => p.slug === slug);
    return found ?? null;
  }

  public async getExperiences(options?: ProfileFilterOptions): Promise<Experience[]> {
    const profile = await this.getProfile(options);
    return profile.experiences;
  }

  public async getSkills(options?: ProfileFilterOptions): Promise<Skill[]> {
    const profile = await this.getProfile(options);
    if (options?.category) {
      return profile.skills.filter((s) => s.category === options.category);
    }
    return profile.skills;
  }
}
