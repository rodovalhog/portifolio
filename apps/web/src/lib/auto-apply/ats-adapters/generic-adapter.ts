import { ApplicationFormField, JobPostingAnalysis, PreparedApplication, FieldSemanticType } from "@portfolio/domain";
import { ATSAdapter } from "../types";

export class GenericATSAdapter implements ATSAdapter {
  public readonly name = "Generic ATS Adapter";
  public readonly atsType = "generic" as const;

  public detect(_url: string, _html?: string): boolean {
    // Acts as fallback when no specialized adapter matches
    return true;
  }

  public parseJobPosting(url: string, html: string): JobPostingAnalysis {
    const hasCaptcha = /g-recaptcha|hcaptcha|cf-challenge|turnstile|data-sitekey/i.test(html);
    const requiresAuth = /login required|acesso restrito|please sign in/i.test(html);
    const automationBlocked = hasCaptcha || requiresAuth;
    const blockReason = hasCaptcha
      ? "Mecanismo de proteção CAPTCHA detectado no formulário da vaga."
      : requiresAuth
      ? "Autenticação requerida antes de preencher a candidatura."
      : undefined;

    // Extract title
    let title = "Vaga de Engenharia de Software";
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]+>/g, "").trim().split(/[-|–]/)[0].trim();
    }

    // Extract company
    let company = "Empresa Contratante";
    const compMatch = html.match(/<meta[^>]*property=['"]og:site_name['"][^>]*content=['"]([^'"]+)['"]/i);
    if (compMatch && compMatch[1]) {
      company = compMatch[1].trim();
    }

    // Extract semantic fields
    const fields = this.extractGenericFields(html);

    return {
      url,
      company,
      title,
      location: "Remoto / Híbrido",
      type: "Tempo Integral",
      workplaceType: "remote",
      atsType: "generic",
      description: "Oportunidade de engenharia de software para atuação em projetos de alta escala e arquitetura moderna.",
      requirements: [
        "Experiência com desenvolvimento frontend ou fullstack",
        "Conhecimento de boas práticas de arquitetura e qualidade de código",
        "Capacidade de colaboração e resolução de problemas técnicos",
      ],
      skills: ["typescript", "javascript", "react", "next.js", "clean architecture"],
      fields,
      hasCaptcha,
      requiresAuth,
      automationBlocked,
      blockReason,
    };
  }

  private extractGenericFields(html: string): ApplicationFormField[] {
    const fields: ApplicationFormField[] = [];

    // Semantic patterns
    const semanticRules: Array<{ pattern: RegExp; semanticType: FieldSemanticType; type: ApplicationFormField["type"] }> = [
      { pattern: /first[_\s-]?name|given[_\s-]?name|^nome$/i, semanticType: "firstName", type: "text" },
      { pattern: /last[_\s-]?name|surname|family[_\s-]?name|sobrenome|cognome/i, semanticType: "lastName", type: "text" },
      { pattern: /full[_\s-]?name|nome[_\s-]?completo/i, semanticType: "fullName", type: "text" },
      { pattern: /email|e-mail/i, semanticType: "email", type: "email" },
      { pattern: /phone|tel|telefone|celular|mobile/i, semanticType: "phone", type: "tel" },
      { pattern: /prefix|country[_\s-]?code/i, semanticType: "phonePrefix", type: "select" },
      { pattern: /linkedin|github|portfolio|website|url[_\s-]?pessoal/i, semanticType: "personalUrl", type: "text" },
      { pattern: /cover[_\s-]?letter|carta|motivacional|message/i, semanticType: "coverLetter", type: "textarea" },
      { pattern: /resume|cv|curriculum|curriculo/i, semanticType: "resume", type: "file" },
    ];

    // Find input tags
    const inputMatches = html.matchAll(/<input[^>]*>/gi);
    for (const match of inputMatches) {
      const tag = match[0];
      const name = this.extractAttr(tag, "name");
      const id = this.extractAttr(tag, "id") || name;
      const rawType = (this.extractAttr(tag, "type") || "text").toLowerCase();
      const placeholder = this.extractAttr(tag, "placeholder") || "";
      const required = /required/i.test(tag);

      if (!name || rawType === "hidden" || rawType === "submit" || rawType === "button") continue;
      const type = (rawType as ApplicationFormField["type"]);

      let detectedSemantic: FieldSemanticType = "unknown";
      for (const rule of semanticRules) {
        if (rule.pattern.test(name) || rule.pattern.test(id) || rule.pattern.test(placeholder)) {
          detectedSemantic = rule.semanticType;
          break;
        }
      }

      fields.push({
        id: id || name,
        name,
        label: placeholder || name.replace(/[_-]/g, " "),
        type,
        required,
        semanticType: detectedSemantic,
      });
    }

    // Find textarea tags
    const textareaMatches = html.matchAll(/<textarea[^>]*>([\s\S]*?)<\/textarea>/gi);
    for (const match of textareaMatches) {
      const tag = match[0];
      const name = this.extractAttr(tag, "name");
      const id = this.extractAttr(tag, "id") || name;
      const placeholder = this.extractAttr(tag, "placeholder") || "";
      const required = /required/i.test(tag);
      if (!name) continue;

      let detectedSemantic: FieldSemanticType = "coverLetter";
      for (const rule of semanticRules) {
        if (rule.pattern.test(name) || rule.pattern.test(id) || rule.pattern.test(placeholder)) {
          detectedSemantic = rule.semanticType;
          break;
        }
      }

      fields.push({
        id: id || name,
        name,
        label: placeholder || name.replace(/[_-]/g, " "),
        type: "textarea",
        required,
        semanticType: detectedSemantic,
      });
    }

    // Default core fields if none were found
    if (fields.length === 0) {
      return [
        { id: "name", name: "name", label: "Nome completo *", type: "text", required: true, semanticType: "fullName" },
        { id: "email", name: "email", label: "Email *", type: "email", required: true, semanticType: "email" },
        { id: "phone", name: "phone", label: "Telefone *", type: "tel", required: true, semanticType: "phone" },
        { id: "resume", name: "resume", label: "Currículo *", type: "file", required: true, semanticType: "resume" },
        { id: "cover_letter", name: "cover_letter", label: "Carta de apresentação", type: "textarea", required: false, semanticType: "coverLetter" },
      ];
    }

    return fields;
  }

  private extractAttr(tag: string, attr: string): string {
    const match = tag.match(new RegExp(`${attr}=['"]([^'"]+)['"]`, "i"));
    return match ? match[1] : "";
  }

  public generateFormPayload(application: PreparedApplication): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    application.answers.forEach((ans) => {
      payload[ans.fieldName] = ans.value;
    });
    return payload;
  }
}
