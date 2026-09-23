import { NextRequest, NextResponse } from "next/server";
import { callGeminiWithTools } from "@/lib/ai/gemini-client";

export async function GET() {
  const isConfigured = Boolean(
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0
  );
  return NextResponse.json({
    configured: isConfigured,
    model: "gemini-3.8-flash",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { message, model } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY não encontrada ou vazia no servidor. Abra apps/web/.env.local e insira sua chave do Google AI Studio após 'GEMINI_API_KEY='.",
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Mensagem inválida." },
        { status: 400 }
      );
    }

    const response = await callGeminiWithTools(
      apiKey,
      message,
      model || "gemini-3.8-flash"
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API /chat Error]:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno no processamento da IA",
      },
      { status: 500 }
    );
  }
}
