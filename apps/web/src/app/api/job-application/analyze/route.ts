import { NextRequest, NextResponse } from "next/server";
import { atsRegistry } from "@/lib/auto-apply/ats-adapters/registry";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return NextResponse.json(
        { error: "URL da vaga inválida ou não informada." },
        { status: 400 }
      );
    }

    let html = "";
    let isBlocked = false;
    let blockReason = "";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 403 || res.status === 429) {
        isBlocked = true;
        blockReason = `Acesso bloqueado pelo servidor (${res.status}). Ação manual necessária para continuar.`;
      } else {
        html = await res.text();
      }
    } catch (fetchErr) {
      console.warn("[AutoApply Analyze] Fetch error or timeout:", fetchErr);
      // If direct fetch fails (e.g. localhost environment or network sandbox), we still continue with empty html
      // and let the adapter parse from URL structure and standard schemas.
    }

    // Check for CAPTCHA or Cloudflare Turnstile signatures
    if (
      html.includes("cf-turnstile") ||
      html.includes("g-recaptcha") ||
      html.includes("hcaptcha") ||
      html.includes("challenge-running") ||
      html.includes("Just a moment...")
    ) {
      isBlocked = true;
      blockReason = "Proteção anti-bot ou CAPTCHA detectado no formulário. Ação manual necessária para continuar.";
    }

    const adapter = atsRegistry.resolve(url, html);
    const analysis = adapter.parseJobPosting(url, html);

    if (isBlocked) {
      analysis.hasCaptcha = true;
      analysis.automationBlocked = true;
      analysis.blockReason = blockReason;
    }

    return NextResponse.json({
      success: true,
      adapter: adapter.name,
      job: analysis,
    });
  } catch (error) {
    console.error("[API /api/job-application/analyze Error]:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Falha interna ao analisar a vaga.",
      },
      { status: 500 }
    );
  }
}
