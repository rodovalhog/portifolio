import { LocalizedText } from "../values/localized-text.js";
import { DateRange } from "../values/date-range.js";
import { DataVisibility } from "../values/visibility.js";

export interface ExperienceCase {
  title: LocalizedText;
  problem: LocalizedText;
  decision: LocalizedText;
  implementation: LocalizedText;
  impact: LocalizedText;
  metrics?: string[];
  technologies: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: LocalizedText;
  location: LocalizedText;
  type: "full-time" | "contract" | "consulting";
  period: DateRange;
  summary: LocalizedText;
  highlights?: LocalizedText[];
  engineeringCases: ExperienceCase[];
  technologies: string[];
  skills: string[];
  visibility: DataVisibility;
}
