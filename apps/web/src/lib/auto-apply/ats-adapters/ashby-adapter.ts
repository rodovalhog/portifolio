import {
  ApplicationFormField,
  JobPostingAnalysis,
  PreparedApplication,
} from "@portfolio/domain";
import { ATSAdapter } from "../types";

export class AshbyAdapter implements ATSAdapter {
  public readonly name = "Ashby HQ";
  public readonly atsType = "ashby" as const;

  public detect(url: string, html?: string): boolean {
    const isAshbyUrl = /ashbyhq\.com|ashbyprd\.com/i.test(url);
    if (isAshbyUrl) return true;
    if (html && (/cdn\.ashbyprd\.com/i.test(html) || /ashby/i.test(html))) {
      return true;
    }
    return false;
  }

  public parseJobPosting(url: string, html: string): JobPostingAnalysis {
    let title = "Senior Frontend Engineer";
    let company = "Empresa Contratante (Ashby)";
    let description = "Oportunidade de engenharia de software na plataforma Ashby HQ.";
    const requirements: string[] = [
      "5+ years of professional experience in frontend or full-stack engineering",
      "Expert-level knowledge of TypeScript, and modern JavaScript/HTML/CSS",
      "Deep understanding of frontend architecture, state management, and API integration",
      "Experience with frontend performance optimization and web vitals",
    ];
    const skills: string[] = [
      "typescript",
      "javascript",
      "react",
      "next.js",
      "clean architecture",
      "web performance",
    ];

    // 1. Try extracting from Schema.org JobPosting JSON-LD
    const jsonLdMatch = html.match(
      /<script[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/i
    );
    if (jsonLdMatch && jsonLdMatch[1]) {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        if (parsed["@type"] === "JobPosting") {
          if (parsed.title) title = parsed.title;
          if (parsed.hiringOrganization?.name) {
            company = parsed.hiringOrganization.name;
          }
          if (parsed.description) {
            description = parsed.description
              .replace(/<[^>]+>/g, " ")
              .replace(/\s+/g, " ")
              .trim();
          }
        }
      } catch (e) {
        console.warn("[AshbyAdapter] Error parsing JSON-LD:", e);
      }
    }

    // 2. If company still default, extract organization slug from URL
    // e.g. https://jobs.ashbyhq.com/canals/b652f476-... -> "Canals"
    if (company === "Empresa Contratante (Ashby)") {
      const slugMatch = url.match(/jobs\.ashbyhq\.com\/([^/?#]+)/i);
      if (slugMatch && slugMatch[1]) {
        const raw = slugMatch[1];
        company = raw.charAt(0).toUpperCase() + raw.slice(1);
      }
    }

    // 3. Extract title from HTML <title> if not found in JSON-LD
    if (title === "Senior Frontend Engineer" && html.includes("<title>")) {
      const titleMatch = html.match(/<title>[\s\n]*([^<]+?)\s*<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].split("@")[0].split("-")[0].trim();
      }
    }

    // 4. Form fields for Ashby applications
    const fields: ApplicationFormField[] = [
      {
        id: "name",
        name: "name",
        label: "Full Name *",
        type: "text",
        required: true,
        semanticType: "fullName",
      },
      {
        id: "email",
        name: "email",
        label: "Email Address *",
        type: "email",
        required: true,
        semanticType: "email",
      },
      {
        id: "phone",
        name: "phone",
        label: "Phone Number *",
        type: "tel",
        required: true,
        semanticType: "phone",
        defaultValue: "+55 (34) 99161-9467",
      },
      {
        id: "resume",
        name: "resume",
        label: "Resume / CV *",
        type: "file",
        required: true,
        semanticType: "resume",
      },
      {
        id: "linkedin",
        name: "linkedin",
        label: "LinkedIn Profile URL",
        type: "text",
        required: false,
        semanticType: "personalUrl",
      },
      {
        id: "github",
        name: "github",
        label: "GitHub Profile URL",
        type: "text",
        required: false,
        semanticType: "github",
      },
      {
        id: "cover_letter",
        name: "cover_letter",
        label: "Cover Letter / Additional Information",
        type: "textarea",
        required: false,
        semanticType: "coverLetter",
      },
    ];

    return {
      url,
      company,
      title,
      location: "Remote",
      type: "Full-time",
      workplaceType: "remote",
      atsType: "ashby",
      description,
      requirements,
      skills,
      fields,
      hasCaptcha: false,
      requiresAuth: false,
      automationBlocked: false,
    };
  }

  public generateFormPayload(
    application: PreparedApplication
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    application.answers.forEach((ans) => {
      payload[ans.fieldName] = ans.value;
    });
    if (application.coverLetter) {
      payload["cover_letter"] = application.coverLetter;
    }
    if (application.selectedResume?.filename) {
      payload["resume"] = application.selectedResume.filename;
    }
    return payload;
  }
}
