import { describe, it, expect, beforeEach } from "vitest";
import { FactorialAdapter } from "../ats-adapters/factorial-adapter";
import { GenericATSAdapter } from "../ats-adapters/generic-adapter";
import { atsRegistry } from "../ats-adapters/registry";
import { prepareJobApplication } from "../application-preparer";
import { applicationHistoryStore } from "../history-store";
import { WebMCPServer } from "../../mcp/server";
import { WebMCPClient } from "../../mcp/client";

describe("ATS Adapters & Registry", () => {
  const factorialUrl =
    "https://xfarm.factorialhr.com/apply/brazil-senior-front-end-developer-309222?utm_source=linkedin.com";
  const genericUrl = "https://jobs.example.com/apply/senior-engineer";

  it("should resolve FactorialAdapter for xFarm Factorial HR URL", () => {
    const adapter = atsRegistry.resolve(factorialUrl);
    expect(adapter).toBeInstanceOf(FactorialAdapter);
    expect(adapter.name).toBe("Factorial HR");
    expect(adapter.atsType).toBe("factorial");
  });

  it("should resolve GenericATSAdapter for unknown job board URLs", () => {
    const adapter = atsRegistry.resolve(genericUrl);
    expect(adapter).toBeInstanceOf(GenericATSAdapter);
    expect(adapter.name).toBe("Generic ATS Adapter");
    expect(adapter.atsType).toBe("generic");
  });

  it("should extract job details and specific questions in FactorialAdapter", () => {
    const adapter = new FactorialAdapter();
    const analysis = adapter.parseJobPosting(factorialUrl, "");

    expect(analysis.company).toContain("xFarm");
    expect(analysis.title).toContain("Senior Front End Developer");
    expect(analysis.atsType).toBe("factorial");
    expect(analysis.fields.length).toBeGreaterThan(5);

    // Custom questions identified
    const motivationQuestion = analysis.fields.find((f) => f.name === "aq_445324");
    expect(motivationQuestion).toBeDefined();

    const englishQuestion = analysis.fields.find((f) => f.name === "aq_445325[]");
    expect(englishQuestion).toBeDefined();

    const aiToolsQuestion = analysis.fields.find((f) => f.name === "aq_445326[]");
    expect(aiToolsQuestion).toBeDefined();
  });

  it("should perform semantic mapping on generic HTML forms", () => {
    const adapter = new GenericATSAdapter();
    const sampleHtml = `
      <form>
        <input name="first_name" type="text" />
        <input name="user_email" type="email" />
        <input name="curriculum_vitae" type="file" />
        <textarea name="motivation_letter"></textarea>
      </form>
    `;
    const analysis = adapter.parseJobPosting(genericUrl, sampleHtml);
    expect(analysis.fields.length).toBe(4);

    const fName = analysis.fields.find((f) => f.name === "first_name");
    expect(fName?.semanticType).toBe("firstName");

    const email = analysis.fields.find((f) => f.name === "user_email");
    expect(email?.semanticType).toBe("email");

    const resume = analysis.fields.find((f) => f.name === "curriculum_vitae");
    expect(resume?.semanticType).toBe("resume");

    const cover = analysis.fields.find((f) => f.name === "motivation_letter");
    expect(cover?.semanticType).toBe("coverLetter");
  });
});

describe("AI Application Preparer & Zero-Hallucination Guardrails", () => {
  const factorialUrl =
    "https://xfarm.factorialhr.com/apply/brazil-senior-front-end-developer-309222?utm_source=linkedin.com";
  const adapter = new FactorialAdapter();
  const job = adapter.parseJobPosting(factorialUrl, "");

  it("should generate evidence-backed cover letter with Casas Bahia Staff and 150k rpm metrics", async () => {
    const app = await prepareJobApplication(job, {
      filename: "guilherme-rodovalho-cv-en.pdf",
      locale: "en-US",
      url: "/resumes/guilherme-rodovalho-cv-en.pdf",
    });

    expect(app.coverLetter).toContain("Casas Bahia");
    expect(app.coverLetter).toContain("150,000 requests per minute");
    expect(app.coverLetter).toContain("LCP from 4.2s to 1.4s");
    expect(app.coverLetter).toContain("Guilherme Rodovalho");
    expect(app.status).toBe("ready_for_review");
    expect(app.approvedByHuman).toBe(false);
  });

  it("should answer English question and AI tools question based on candidate profile", async () => {
    const app = await prepareJobApplication(job, {
      filename: "guilherme-rodovalho-cv-en.pdf",
      locale: "en-US",
      url: "/resumes/guilherme-rodovalho-cv-en.pdf",
    });

    const englishAnswer = app.answers.find((a) => a.fieldName === "aq_445325[]");
    expect(englishAnswer).toBeDefined();
    expect(englishAnswer?.needsReview).toBe(false);
    expect(englishAnswer?.confidence).toBe(1.0);

    const aiToolsAnswer = app.answers.find((a) => a.fieldName === "aq_445326[]");
    expect(aiToolsAnswer).toBeDefined();
    expect(aiToolsAnswer?.needsReview).toBe(false);
  });

  it("STRICT ZERO-HALLUCINATION: Should flag unknown fields with needsReview = true and not hallucinate", async () => {
    // Add a custom question requesting data not in profile (e.g. salary expectation)
    const customJob = {
      ...job,
      fields: [
        ...job.fields,
        {
          id: "field-salary",
          name: "salary_expectation",
          label: "What is your target monthly salary in USD?",
          type: "text" as const,
          required: true,
          semanticType: "customQuestion" as const,
        },
      ],
    };

    const app = await prepareJobApplication(customJob, {
      filename: "guilherme-rodovalho-cv-en.pdf",
      locale: "en-US",
      url: "/resumes/guilherme-rodovalho-cv-en.pdf",
    });

    const salaryAnswer = app.answers.find((a) => a.fieldId === "field-salary");
    expect(salaryAnswer).toBeDefined();
    expect(salaryAnswer?.needsReview).toBe(true);
    expect(salaryAnswer?.value).toBe(""); // Did not invent a number!
    expect(salaryAnswer?.needsReviewReason).toContain("Pretensão salarial requer validação");
  });
});

describe("Human-in-the-Loop & WebMCP Security Guardrails", () => {
  const server = new WebMCPServer();
  const client = new WebMCPClient();

  it("should reject submitApplication if confirmHumanApproval is false", async () => {
    await expect(
      server.submitApplication({
        applicationId: "test-app-1",
        confirmHumanApproval: false,
      })
    ).rejects.toThrow(/Ação bloqueada pelas diretrizes éticas/);
  });

  it("should accept submitApplication when confirmHumanApproval is explicitly true", async () => {
    const res = await server.submitApplication({
      applicationId: "test-app-2",
      confirmHumanApproval: true,
      jobUrl: "https://xfarm.factorialhr.com/apply/test",
    });

    expect(res.success).toBe(true);
    expect(res.message).toContain("sucesso");
  });

  it("should record application states accurately in history store", () => {
    const testRecord = {
      id: "history-unit-test-1",
      company: "xFarm Technologies SA",
      role: "Senior Front End Developer",
      jobUrl: "https://xfarm.factorialhr.com/apply/test",
      date: new Date().toISOString(),
      resumeUsed: "Guilherme_Rodovalho_CV_en.pdf",
      status: "ready_for_review" as const,
      atsType: "factorial" as const,
    };

    applicationHistoryStore.saveApplication(testRecord);
    let found = applicationHistoryStore.getApplicationById("history-unit-test-1");
    expect(found).toBeDefined();
    expect(found?.status).toBe("ready_for_review");

    applicationHistoryStore.updateApplicationStatus("history-unit-test-1", "submitted");
    found = applicationHistoryStore.getApplicationById("history-unit-test-1");
    expect(found?.status).toBe("submitted");
  });

  it("client executeTool should invoke auto-apply tools smoothly", async () => {
    const history = (await client.executeTool(
      "get_application_history",
      {}
    )) as unknown[];
    expect(Array.isArray(history)).toBe(true);
  });
});
