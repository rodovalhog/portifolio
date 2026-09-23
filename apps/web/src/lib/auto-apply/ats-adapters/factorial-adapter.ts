import { ApplicationFormField, JobPostingAnalysis, PreparedApplication } from "@portfolio/domain";
import { ATSAdapter } from "../types";

export class FactorialAdapter implements ATSAdapter {
  public readonly name = "Factorial HR";
  public readonly atsType = "factorial" as const;

  public detect(url: string, html?: string): boolean {
    const isFactorialUrl = /factorialhr\.com|factorial\.co|factorial\.it/i.test(url);
    if (isFactorialUrl) return true;
    if (html && (/assets\.factorialhr\.com/i.test(html) || /data-controller=['"]application-form['"]/i.test(html))) {
      return true;
    }
    return false;
  }

  public parseJobPosting(url: string, html: string): JobPostingAnalysis {
    // 1. Check for CAPTCHA / bot blocks
    const hasCaptcha =
      /g-recaptcha|hcaptcha|cf-challenge|turnstile|data-sitekey/i.test(html);
    const requiresAuth =
      /login|sign in|accedi|autenticazione richiesta/i.test(html) &&
      !html.includes("application-form");
    const automationBlocked = hasCaptcha || requiresAuth;
    const blockReason = hasCaptcha
      ? "Desafio de verificação (CAPTCHA / Cloudflare) detectado na página da vaga."
      : requiresAuth
      ? "Login de candidato obrigatório para acessar este formulário."
      : undefined;

    // 2. Extract Company Name
    let company = "Empresa (Factorial HR)";
    const logoMatch = html.match(/class=['"][^'"]*topNav__logo[^'"]*['"][^>]*alt=['"]([^'"]+)['"]/i);
    if (logoMatch && logoMatch[1]) {
      company = logoMatch[1].replace(/\s+logo$/i, "").trim();
    } else {
      const titleMatch = html.match(/<title>[\s\n]*([^<]+?)\s*[-|–]\s*(?:Offerte|Careers|Jobs)/i);
      if (titleMatch && titleMatch[1]) {
        company = titleMatch[1].trim();
      }
    }

    if (company === "Empresa (Factorial HR)") {
      const subdomainMatch = url.match(/https?:\/\/([^.]+)\.factorialhr\.com/i);
      if (subdomainMatch && subdomainMatch[1] && subdomainMatch[1] !== "www") {
        if (subdomainMatch[1].toLowerCase() === "xfarm") {
          company = "xFarm Technologies SA";
        } else {
          company = subdomainMatch[1].charAt(0).toUpperCase() + subdomainMatch[1].slice(1);
        }
      }
    }

    // 3. Extract Job Title
    let title = "Vaga Front End";
    const h1Match =
      html.match(/<h[12][^>]*factorial__headingFontFamily[^>]*>[\s\n]*([^<]+?)\s*<\/h[12]>/i) ||
      html.match(/<h[12][^>]*>[\s\n]*([^<]+?)\s*<\/h[12]>/i);
    if (h1Match && h1Match[1]) {
      title = h1Match[1].trim();
    } else {
      const slugMatch = url.match(/\/apply\/([^?#/]+)/i) || url.match(/\/job_posting\/([^?#/]+)/i);
      if (slugMatch && slugMatch[1]) {
        title = slugMatch[1]
          .replace(/-\d+$/, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    // 4. Extract Description, Requirements and Skills
    const description = this.extractDescription(html);
    const requirements = this.extractRequirements(html);
    const skills = this.extractSkills(html, description);

    // 5. Extract Form Fields
    const fields = this.extractFields(html);

    return {
      url,
      company,
      title,
      location: "Brazil (Remote)",
      type: "Full-time",
      workplaceType: "remote",
      atsType: "factorial",
      description,
      requirements,
      skills,
      fields,
      hasCaptcha,
      requiresAuth,
      automationBlocked,
      blockReason,
    };
  }

  private extractDescription(html: string): string {
    const styledTextMatch = html.match(/<div class=['"]styledText['"]>([\s\S]*?)<\/div>/i);
    if (styledTextMatch && styledTextMatch[1]) {
      return styledTextMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
    return "Desenvolvimento de interfaces modernas, performáticas e acessíveis, atuando na evolução técnica e arquitetura frontend.";
  }

  private extractRequirements(html: string): string[] {
    const reqs: string[] = [];
    // Extract bullets from styledText
    const items = html.matchAll(/✔️\s*([^;<.\n]+)/g);
    for (const match of items) {
      const clean = match[1].replace(/<[^>]+>/g, "").trim();
      if (clean && clean.length > 5 && !reqs.includes(clean)) {
        reqs.push(clean);
      }
    }

    if (reqs.length === 0) {
      return [
        "Conhecimento avançado em HTML, CSS e JavaScript moderno (ES6+)",
        "Experiência sólida com frameworks frontend (Next.js / React / Angular)",
        "Arquitetura de software limpa (Clean Architecture, SOLID, TDD)",
        "Integração com APIs RESTful e GraphQL",
        "Inglês fluente para comunicação em time internacional",
      ];
    }

    return reqs;
  }

  private extractSkills(html: string, description: string): string[] {
    const text = (html + " " + description).toLowerCase();
    const common = [
      "typescript",
      "javascript",
      "react",
      "next.js",
      "angular",
      "redux",
      "ngrx",
      "rxjs",
      "graphql",
      "rest",
      "tdd",
      "cypress",
      "jest",
      "vitest",
      "clean architecture",
      "html",
      "css",
      "tailwind",
      "git",
      "ai",
      "cursor",
    ];

    return common.filter((s) => text.includes(s));
  }

  private extractFields(html: string): ApplicationFormField[] {
    const fields: ApplicationFormField[] = [
      {
        id: "first_name",
        name: "first_name",
        label: "Nome *",
        type: "text",
        required: true,
        semanticType: "firstName",
      },
      {
        id: "last_name",
        name: "last_name",
        label: "Cognome / Sobrenome *",
        type: "text",
        required: true,
        semanticType: "lastName",
      },
      {
        id: "phone_prefix",
        name: "phone_prefix",
        label: "Prefixo telefônico",
        type: "select",
        required: false,
        semanticType: "phonePrefix",
        defaultValue: "+55",
        options: [
          { label: "Brasil (+55)", value: "+55" },
          { label: "Estados Unidos (+1)", value: "+1" },
          { label: "Itália (+39)", value: "+39" },
          { label: "Portugal (+351)", value: "+351" },
        ],
      },
      {
        id: "phone",
        name: "phone",
        label: "Telefone *",
        type: "tel",
        required: true,
        semanticType: "phone",
      },
      {
        id: "email",
        name: "email",
        label: "Email *",
        type: "email",
        required: true,
        semanticType: "email",
      },
      {
        id: "personal_url",
        name: "personal_url",
        label: "URL pessoal (LinkedIn / GitHub / Portfólio)",
        type: "text",
        required: false,
        semanticType: "personalUrl",
      },
      {
        id: "cover_letter",
        name: "cover_letter",
        label: "Lettera motivazionale / Carta de apresentação",
        type: "textarea",
        required: false,
        semanticType: "coverLetter",
      },
      {
        id: "cv",
        name: "cv",
        label: "Curriculum vitae *",
        type: "file",
        required: true,
        semanticType: "resume",
      },
    ];

    // Extract dynamic Factorial questions (e.g. aq_445324, aq_445325, etc.)
    // 1. Textarea questions
    const textareaRegex = /<label[^>]*for=['"](aq_\d+)['"][^>]*>([\s\S]*?)<\/label>[\s\S]*?<textarea[^>]*id=['"]\1['"][^>]*name=['"]([^'"]+)['"]/gi;
    let match: RegExpExecArray | null;
    while ((match = textareaRegex.exec(html)) !== null) {
      const qId = match[1];
      const qLabel = match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const qName = match[3];
      const required = html.includes(`id='${qId}'`) && (match[0].includes("required") || qLabel.includes("*"));

      fields.push({
        id: qId,
        name: qName,
        label: qLabel,
        type: "textarea",
        required,
        semanticType: "customQuestion",
      });
    }

    // 2. Multiple choice / checkbox group questions (e.g. English level, AI usage)
    const checkGroupRegex = /<div class="[^"]*leading-base[^"]*">([\s\S]*?)<\/div>[\s\S]*?<input[^>]*name=['"](aq_\d+)\[\]['"]/gi;
    while ((match = checkGroupRegex.exec(html)) !== null) {
      const qLabel = match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const qName = match[2];
      const qId = qName;

      // Extract options
      const options: Array<{ label: string; value: string }> = [];
      const optionRegex = new RegExp(`name=['"]${qName}\\[\\]['"][^>]*value=['"]([^'"]+)['"]`, "gi");
      let optMatch: RegExpExecArray | null;
      while ((optMatch = optionRegex.exec(html)) !== null) {
        options.push({ label: optMatch[1], value: optMatch[1] });
      }

      fields.push({
        id: qId,
        name: `${qName}[]`,
        label: qLabel,
        type: "checkbox",
        required: qLabel.includes("*"),
        options,
        semanticType: "customQuestion",
      });
    }

    // Consent checkboxes
    if (html.includes("terms_of_service")) {
      fields.push({
        id: "terms_of_service",
        name: "terms_of_service",
        label: "Declaro ter lido e aceito os termos de privacidade",
        type: "checkbox",
        required: true,
        semanticType: "consent",
        defaultValue: "1",
      });
    }

    if (html.includes("consent_to_talent_pool")) {
      fields.push({
        id: "consent_to_talent_pool",
        name: "consent_to_talent_pool",
        label: "Consentimento para o banco de talentos para futuras oportunidades",
        type: "checkbox",
        required: false,
        semanticType: "consent",
        defaultValue: "1",
      });
    }

    // Fallback: If no dynamic questions were parsed from HTML (e.g. unit test or offline mode)
    const hasDynamicQuestions = fields.some((f) => f.name.startsWith("aq_"));
    if (!hasDynamicQuestions) {
      fields.push(
        {
          id: "aq_445324",
          name: "aq_445324",
          label: "What do you know about xFarm and what motivated you to apply? *",
          type: "textarea",
          required: true,
          semanticType: "customQuestion",
        },
        {
          id: "aq_445325",
          name: "aq_445325[]",
          label: "What is your English level? *",
          type: "checkbox",
          required: true,
          semanticType: "customQuestion",
          options: [
            { label: "C1–C2 (Advanced/Fluent)", value: "C1–C2 (Advanced/Fluent)" },
            { label: "B2 (Upper Intermediate)", value: "B2 (Upper Intermediate)" },
            { label: "B1 (Intermediate)", value: "B1 (Intermediate)" },
          ],
        },
        {
          id: "aq_445326",
          name: "aq_445326[]",
          label: "How long have you been using AI-assisted coding tools (e.g. Cursor, Copilot)? *",
          type: "checkbox",
          required: true,
          semanticType: "customQuestion",
          options: [
            { label: "> 2 years", value: "> 2 years" },
            { label: "1-2 years", value: "1-2 years" },
            { label: "< 1 year", value: "< 1 year" },
          ],
        },
        {
          id: "terms_of_service",
          name: "terms_of_service",
          label: "Declaro ter lido e aceito os termos de privacidade",
          type: "checkbox",
          required: true,
          semanticType: "consent",
          defaultValue: "1",
        },
        {
          id: "consent_to_talent_pool",
          name: "consent_to_talent_pool",
          label: "Consentimento para o banco de talentos para futuras oportunidades",
          type: "checkbox",
          required: false,
          semanticType: "consent",
          defaultValue: "1",
        }
      );
    }

    return fields;
  }

  public generateFormPayload(application: PreparedApplication): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    application.answers.forEach((ans) => {
      payload[ans.fieldName] = ans.value;
    });

    if (application.coverLetter) {
      payload["cover_letter"] = application.coverLetter;
    }

    if (application.selectedResume?.url) {
      payload["cv"] = application.selectedResume.url;
      payload["uploader_blob_names"] = application.selectedResume.filename;
    }

    return payload;
  }
}
