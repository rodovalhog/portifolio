import { LocalizedText } from "../values/localized-text.js";
import { DataVisibility } from "../values/visibility.js";
import { Experience } from "./experience.js";
import { Project } from "./project.js";
import { Skill } from "./skill.js";

export interface PersonalInformation {
  name: string;
  headline: LocalizedText;
  bio: LocalizedText;
  location: LocalizedText;
  email: string;
  phone?: string;
  avatarUrl?: string;
  availability: LocalizedText;
  visibility: DataVisibility;
}

export interface Education {
  id: string;
  institution: string;
  degree: LocalizedText;
  fieldOfStudy: LocalizedText;
  startDate: string;
  endDate?: string;
  visibility: DataVisibility;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  visibility: DataVisibility;
}

export interface Achievement {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  date: string;
  metrics?: string;
  visibility: DataVisibility;
}

export interface Language {
  code: string;
  name: LocalizedText;
  proficiency: LocalizedText;
  visibility: DataVisibility;
}

export interface ProfessionalLinks {
  github: string;
  linkedin: string;
  email: string;
  website?: string;
  twitter?: string;
}

export interface ResumeVersion {
  id: string;
  version: string;
  locale: "pt-BR" | "en-US";
  targetRole: string; // e.g. "Staff Frontend Engineer", "Software Architect"
  updatedAt: string;
  fileUrl?: string;
}

export interface ProfessionalProfile {
  id: string;
  version: string;
  personal: PersonalInformation;
  summary: LocalizedText;
  engineeringPhilosophy: LocalizedText[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
  links: ProfessionalLinks;
  resumes: ResumeVersion[];
}
