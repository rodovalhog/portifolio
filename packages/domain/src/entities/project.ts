import { LocalizedText } from "../values/localized-text.js";
import { DataVisibility } from "../values/visibility.js";

export interface ProjectMetric {
  label: LocalizedText;
  value: string;
  change?: string; // e.g. "-45% LCP"
}

export interface ArchitectureDetail {
  diagramType?: "flow" | "architecture" | "sequence";
  components: Array<{
    name: string;
    responsibility: LocalizedText;
    whyExists: LocalizedText;
    tradeoffs: LocalizedText;
  }>;
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedText;
  tagline: LocalizedText;
  featured: boolean;
  order: number;
  period: string; // e.g. "2023 - 2024"

  context: LocalizedText;
  problem: LocalizedText;
  constraints?: LocalizedText;
  optionsConsidered?: LocalizedText;
  decision: LocalizedText;
  tradeoffs?: LocalizedText;
  solution: LocalizedText;
  implementation: LocalizedText;
  impact: LocalizedText;
  lessonsLearned?: LocalizedText;

  metrics: ProjectMetric[];
  technologies: string[];
  skills: string[];
  links?: {
    github?: string;
    live?: string;
    caseStudy?: string;
  };
  architecture?: ArchitectureDetail;
  visibility: DataVisibility;
}
