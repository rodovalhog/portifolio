import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { applicationId, confirmHumanApproval, payload, jobUrl } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "ID da candidatura não informado." },
        { status: 400 }
      );
    }

    // STRICT HUMAN-IN-THE-LOOP GUARDRAIL
    if (confirmHumanApproval !== true) {
      return NextResponse.json(
        {
          error:
            "Submissão bloqueada pelas diretrizes éticas e de segurança: Nenhuma candidatura pode ser enviada sem confirmação humana explícita.",
        },
        { status: 403 }
      );
    }

    // In a live system with direct ATS API or headless browser session,
    // the submit action posts to the target form endpoint.
    // For browser WebMCP execution, the browser handles the form submit button click
    // or this endpoint confirms the transaction audit log.
    const submittedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      applicationId,
      jobUrl,
      submittedAt,
      message: "Candidatura submetida com sucesso após aprovação humana.",
      payloadCount: payload ? Object.keys(payload).length : 0,
    });
  } catch (error) {
    console.error("[API /api/job-application/submit Error]:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Falha ao processar o envio da candidatura.",
      },
      { status: 500 }
    );
  }
}
