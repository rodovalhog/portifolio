import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isEn = searchParams.get("locale") === "en-US";
  const filename = isEn ? "guilherme-rodovalho-resume.pdf" : "guilherme-rodovalho-curriculo.pdf";

  const filePath = path.resolve(process.cwd(), "public/resumes", filename);

  try {
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    return new NextResponse("PDF not found", { status: 404 });
  }
}
