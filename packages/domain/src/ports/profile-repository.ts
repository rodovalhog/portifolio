import { ProfessionalProfile } from "../entities/profile.js";
import { Project } from "../entities/project.js";
import { Experience } from "../entities/experience.js";
import { Skill, SkillCategory } from "../entities/skill.js";

export interface ProfileFilterOptions {
  includePrivate?: boolean;
  category?: SkillCategory;
}

export interface ProfileRepository {
  getProfile(options?: ProfileFilterOptions): Promise<ProfessionalProfile>;
  getProjects(options?: ProfileFilterOptions): Promise<Project[]>;
  getProjectBySlug(slug: string, options?: ProfileFilterOptions): Promise<Project | null>;
  getExperiences(options?: ProfileFilterOptions): Promise<Experience[]>;
  getSkills(options?: ProfileFilterOptions): Promise<Skill[]>;
}
