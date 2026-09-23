import { LocalizedText } from "../values/localized-text.js";
import { DataVisibility } from "../values/visibility.js";

export type SkillCategory =
  | "frontend"
  | "architecture"
  | "ai"
  | "backend"
  | "performance"
  | "testing"
  | "devops"
  | "cloud";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: "expert" | "advanced" | "proficient";
  highlight?: boolean;
  description: LocalizedText;
  yearsOfExperience: number;
  tags: string[];
  relatedProjectIds?: string[];
  relatedExperienceIds?: string[];
  visibility: DataVisibility;
}
