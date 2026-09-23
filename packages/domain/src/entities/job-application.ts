export type ATSType = "factorial" | "ashby" | "greenhouse" | "lever" | "workday" | "generic";

export type ApplicationStatus =
  | "analyzing"
  | "ready_for_review"
  | "filled"
  | "submitted"
  | "failed"
  | "manual_action_required";

export type FieldSemanticType =
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "phone"
  | "phonePrefix"
  | "personalUrl"
  | "linkedin"
  | "github"
  | "portfolio"
  | "coverLetter"
  | "resume"
  | "photo"
  | "customQuestion"
  | "consent"
  | "unknown";

export interface ApplicationFormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "checkbox" | "radio" | "textarea" | "file";
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  semanticType: FieldSemanticType;
  defaultValue?: string;
  helpText?: string;
}

export interface JobPostingAnalysis {
  url: string;
  company: string;
  title: string;
  location?: string;
  type?: string;
  workplaceType?: "remote" | "hybrid" | "on-site";
  atsType: ATSType;
  description: string;
  requirements: string[];
  skills: string[];
  fields: ApplicationFormField[];
  hasCaptcha: boolean;
  requiresAuth: boolean;
  automationBlocked: boolean;
  blockReason?: string;
}

export interface PreparedAnswer {
  fieldId: string;
  fieldName: string;
  label: string;
  semanticType: FieldSemanticType;
  value: string | string[] | boolean;
  needsReview: boolean;
  needsReviewReason?: string;
  confidence: number; // 0 - 1
  sourceProvenance: string; // e.g. "profile.json:personal.name" or "profile.json:experiences"
}

export interface PreparedApplication {
  id: string;
  jobPosting: JobPostingAnalysis;
  selectedResume: {
    filename: string;
    locale: "pt-BR" | "en-US";
    url: string;
  };
  answers: PreparedAnswer[];
  coverLetter: string;
  status: ApplicationStatus;
  createdAt: string;
  approvedByHuman: boolean;
  approvedAt?: string;
}

export interface JobApplicationRecord {
  id: string;
  company: string;
  role: string;
  jobUrl: string;
  date: string;
  resumeUsed: string;
  status: ApplicationStatus;
  coverLetterSnippet?: string;
  notes?: string;
  atsType: ATSType;
}
