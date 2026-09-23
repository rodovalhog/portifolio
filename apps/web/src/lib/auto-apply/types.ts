import {
  ApplicationFormField,
  JobPostingAnalysis,
  PreparedApplication,
} from "@portfolio/domain";

export interface AutoFillResult {
  success: boolean;
  filledFieldsCount: number;
  totalFieldsCount: number;
  unfilledRequiredFields: string[];
  message: string;
  payload: Record<string, unknown>;
  requiresManualAction: boolean;
  blockReason?: string;
}

export interface ATSAdapter {
  readonly name: string;
  readonly atsType: JobPostingAnalysis["atsType"];

  /**
   * Checks if this adapter handles the given URL or HTML signature
   */
  detect(url: string, html?: string): boolean;

  /**
   * Parses job posting details, requirements, and application form fields from HTML
   */
  parseJobPosting(url: string, html: string): JobPostingAnalysis;

  /**
   * Maps prepared application values into the specific form field names
   */
  generateFormPayload(
    application: PreparedApplication
  ): Record<string, unknown>;
}
