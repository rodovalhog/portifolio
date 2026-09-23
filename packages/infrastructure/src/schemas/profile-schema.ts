import { z } from "zod";
import { DataVisibility } from "@portfolio/domain";

export const LocalizedTextSchema = z.object({
  "pt-BR": z.string(),
  "en-US": z.string(),
});

export const DataVisibilitySchema = z.nativeEnum(DataVisibility);

export const DateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

export const ExperienceCaseSchema = z.object({
  title: LocalizedTextSchema,
  problem: LocalizedTextSchema,
  decision: LocalizedTextSchema,
  implementation: LocalizedTextSchema,
  impact: LocalizedTextSchema,
  metrics: z.array(z.string()).optional(),
  technologies: z.array(z.string()),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: LocalizedTextSchema,
  location: LocalizedTextSchema,
  type: z.enum(["full-time", "contract", "consulting"]),
  period: DateRangeSchema,
  summary: LocalizedTextSchema,
  engineeringCases: z.array(ExperienceCaseSchema),
  technologies: z.array(z.string()),
  skills: z.array(z.string()),
  visibility: DataVisibilitySchema,
});

export const ProjectMetricSchema = z.object({
  label: LocalizedTextSchema,
  value: z.string(),
  change: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: LocalizedTextSchema,
  tagline: LocalizedTextSchema,
  featured: z.boolean(),
  order: z.number(),
  period: z.string(),
  context: LocalizedTextSchema,
  problem: LocalizedTextSchema,
  constraints: LocalizedTextSchema.optional(),
  optionsConsidered: LocalizedTextSchema.optional(),
  decision: LocalizedTextSchema,
  tradeoffs: LocalizedTextSchema.optional(),
  solution: LocalizedTextSchema,
  implementation: LocalizedTextSchema,
  impact: LocalizedTextSchema,
  lessonsLearned: LocalizedTextSchema.optional(),
  metrics: z.array(ProjectMetricSchema),
  technologies: z.array(z.string()),
  skills: z.array(z.string()),
  links: z
    .object({
      github: z.string().optional(),
      live: z.string().optional(),
      caseStudy: z.string().optional(),
    })
    .optional(),
  visibility: DataVisibilitySchema,
});

export const SkillCategorySchema = z.enum([
  "frontend",
  "architecture",
  "ai",
  "backend",
  "performance",
  "testing",
  "devops",
  "cloud",
]);

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: SkillCategorySchema,
  level: z.enum(["expert", "advanced", "proficient"]),
  highlight: z.boolean().optional(),
  description: LocalizedTextSchema,
  yearsOfExperience: z.number(),
  tags: z.array(z.string()),
  relatedProjectIds: z.array(z.string()).optional(),
  relatedExperienceIds: z.array(z.string()).optional(),
  visibility: DataVisibilitySchema,
});

export const PersonalInformationSchema = z.object({
  name: z.string(),
  headline: LocalizedTextSchema,
  bio: LocalizedTextSchema,
  location: LocalizedTextSchema,
  email: z.string().email(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  availability: LocalizedTextSchema,
  visibility: DataVisibilitySchema,
});

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: LocalizedTextSchema,
  fieldOfStudy: LocalizedTextSchema,
  startDate: z.string(),
  endDate: z.string().optional(),
  visibility: DataVisibilitySchema,
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  credentialUrl: z.string().optional(),
  visibility: DataVisibilitySchema,
});

export const AchievementSchema = z.object({
  id: z.string(),
  title: LocalizedTextSchema,
  description: LocalizedTextSchema,
  date: z.string(),
  metrics: z.string().optional(),
  visibility: DataVisibilitySchema,
});

export const LanguageSchema = z.object({
  code: z.string(),
  name: LocalizedTextSchema,
  proficiency: LocalizedTextSchema,
  visibility: DataVisibilitySchema,
});

export const ProfessionalLinksSchema = z.object({
  github: z.string().url(),
  linkedin: z.string().url(),
  email: z.string().email(),
  website: z.string().url().optional(),
  twitter: z.string().optional(),
});

export const ResumeVersionSchema = z.object({
  id: z.string(),
  version: z.string(),
  locale: z.enum(["pt-BR", "en-US"]),
  targetRole: z.string(),
  updatedAt: z.string(),
  fileUrl: z.string().optional(),
});

export const ProfessionalProfileSchema = z.object({
  id: z.string(),
  version: z.string(),
  personal: PersonalInformationSchema,
  summary: LocalizedTextSchema,
  engineeringPhilosophy: z.array(LocalizedTextSchema),
  experiences: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(SkillSchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  achievements: z.array(AchievementSchema),
  languages: z.array(LanguageSchema),
  links: ProfessionalLinksSchema,
  resumes: z.array(ResumeVersionSchema),
});
