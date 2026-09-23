import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email/resend-client";

const ContactRequestSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  email: z.string().trim().email("E-mail inválido"),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(1, "Mensagem é obrigatória"),
  website_hp: z.string().optional(),
});

export async function GET() {
  const isConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0
  );

  return NextResponse.json({
    configured: isConfigured,
    provider: "resend",
    destination: process.env.CONTACT_EMAIL_TO || "rodovalhogdeveloper@gmail.com",
    sender: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ContactRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados de formulário inválidos.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, website_hp } = parsed.data;

    // Honeypot check: If filled, bot submitted
    if (website_hp && website_hp.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "Mensagem enviada com sucesso!",
      });
    }

    const resendResult = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    if (resendResult.error) {
      console.error("[Resend Error]:", resendResult.error);
      return NextResponse.json(
        {
          success: false,
          error: resendResult.error.message || "Erro ao disparar e-mail via Resend.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mensagem enviada com sucesso!",
      data: resendResult.data,
    });
  } catch (error) {
    console.error("[API /contact Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao processar o envio.",
      },
      { status: 500 }
    );
  }
}
