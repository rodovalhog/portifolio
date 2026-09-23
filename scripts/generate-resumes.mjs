import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profilePath = path.resolve(__dirname, "../content/profile.json");
const outputDir = path.resolve(__dirname, "../apps/web/public/resumes");

function wrapText(text, maxWidth, font, fontSize) {
  if (!text) return [];
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Clean any characters unsupported by WinAnsi / Latin-1 if present
function sanitize(str) {
  if (!str) return "";
  return str
    .replace(/[–—]/g, "-")
    .replace(/[•]/g, "*")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

async function createResumePDF(profile, locale) {
  const isPt = locale === "pt-BR";
  const doc = await PDFDocument.create();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const colorPrimary = rgb(0.06, 0.08, 0.12);
  const colorAccent = rgb(0.04, 0.52, 0.38);
  const colorText = rgb(0.18, 0.20, 0.24);
  const colorMuted = rgb(0.42, 0.45, 0.5);
  const colorBorder = rgb(0.85, 0.87, 0.9);

  function checkPageBreak(requiredSpace) {
    if (y - requiredSpace < margin + 25) {
      page = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  function drawSectionHeader(title) {
    checkPageBreak(30);
    y -= 8;
    page.drawText(title.toUpperCase(), {
      x: margin,
      y,
      size: 9.5,
      font: fontBold,
      color: colorAccent,
    });
    y -= 4;
    page.drawLine({
      start: { x: margin, y },
      end: { x: margin + contentWidth, y },
      thickness: 0.75,
      color: colorBorder,
    });
    y -= 10;
  }

  // --- HEADER ---
  page.drawText(profile.personal.name, {
    x: margin,
    y,
    size: 19,
    font: fontBold,
    color: colorPrimary,
  });
  y -= 15;

  const headline = sanitize(profile.personal.headline[locale] || profile.personal.headline["pt-BR"]);
  page.drawText(headline, {
    x: margin,
    y,
    size: 10,
    font: fontBold,
    color: colorAccent,
  });
  y -= 13;

  const location = sanitize(profile.personal.location[locale]);
  const phoneText = profile.personal.phone ? `${profile.personal.phone} | ` : "";
  const contacts = `${location} | ${phoneText}${profile.personal.email} | linkedin.com/in/guilherme-rodovalho | github.com/rodovalhog`;
  page.drawText(contacts, {
    x: margin,
    y,
    size: 8,
    font: fontRegular,
    color: colorMuted,
  });
  y -= 10;

  // --- PROFESSIONAL SUMMARY ---
  drawSectionHeader(isPt ? "Resumo Profissional" : "Professional Summary");
  const summaryText = sanitize(profile.summary[locale] || profile.summary["pt-BR"]);
  const summaryLines = wrapText(summaryText, contentWidth, fontRegular, 8.5);
  for (const line of summaryLines) {
    checkPageBreak(11);
    page.drawText(line, {
      x: margin,
      y,
      size: 8.5,
      font: fontRegular,
      color: colorText,
    });
    y -= 11;
  }
  y -= 2;

  // --- CORE SKILLS ---
  drawSectionHeader(isPt ? "Principais Competências Técnicas" : "Core Technical Competencies");
  const skills = profile.skills || [];
  for (const sk of skills) {
    checkPageBreak(12);
    const catName = sanitize(sk.name);
    const catTags = sanitize(sk.tags.join(", "));
    const line = `* ${catName}: ${catTags}`;
    const wrapped = wrapText(line, contentWidth, fontRegular, 8);
    for (let i = 0; i < wrapped.length; i++) {
      checkPageBreak(10);
      page.drawText(wrapped[i], {
        x: i === 0 ? margin + 4 : margin + 12,
        y,
        size: 8,
        font: fontRegular,
        color: colorText,
      });
      y -= 10.5;
    }
  }
  y -= 2;

  // --- EXPERIENCE ---
  drawSectionHeader(isPt ? "Experiência Profissional" : "Professional Experience");
  for (const exp of profile.experiences) {
    checkPageBreak(40);
    const role = sanitize(exp.role[locale] || exp.role["pt-BR"]);
    const period = exp.period.isCurrent
      ? `${exp.period.startDate} - ${isPt ? "Presente" : "Present"}`
      : `${exp.period.startDate} - ${exp.period.endDate}`;

    page.drawText(role, {
      x: margin,
      y,
      size: 9.5,
      font: fontBold,
      color: colorPrimary,
    });

    const periodWidth = fontRegular.widthOfTextAtSize(period, 8);
    page.drawText(period, {
      x: margin + contentWidth - periodWidth,
      y,
      size: 8,
      font: fontRegular,
      color: colorMuted,
    });
    y -= 11;

    const companyInfo = `${exp.company} - ${sanitize(exp.location[locale] || exp.location["pt-BR"])}`;
    page.drawText(companyInfo, {
      x: margin,
      y,
      size: 8.5,
      font: fontOblique,
      color: colorAccent,
    });
    y -= 10;

    const expSummary = sanitize(exp.summary[locale] || exp.summary["pt-BR"]);
    const expLines = wrapText(expSummary, contentWidth, fontRegular, 8.2);
    for (const l of expLines) {
      checkPageBreak(10.5);
      page.drawText(l, {
        x: margin,
        y,
        size: 8.2,
        font: fontRegular,
        color: colorText,
      });
      y -= 10.5;
    }

    // Highlights / Bullet points
    if (exp.highlights && exp.highlights.length > 0) {
      y -= 2;
      for (const h of exp.highlights) {
        const bulletText = sanitize(h[locale] || h["pt-BR"] || "");
        const bulletLines = wrapText(bulletText, contentWidth - 14, fontRegular, 8);
        for (let i = 0; i < bulletLines.length; i++) {
          checkPageBreak(10);
          if (i === 0) {
            page.drawText("*", {
              x: margin + 4,
              y,
              size: 8,
              font: fontBold,
              color: colorAccent,
            });
          }
          page.drawText(bulletLines[i], {
            x: margin + 12,
            y,
            size: 8,
            font: fontRegular,
            color: colorText,
          });
          y -= 10;
        }
      }
    }

    // Tech line
    if (exp.technologies && exp.technologies.length > 0) {
      checkPageBreak(10);
      const techText = sanitize(`Skills / Tech: ${exp.technologies.join(", ")}`);
      const techLines = wrapText(techText, contentWidth - 12, fontOblique, 7.5);
      for (const tl of techLines) {
        checkPageBreak(9.5);
        page.drawText(tl, {
          x: margin + 12,
          y,
          size: 7.5,
          font: fontOblique,
          color: colorMuted,
        });
        y -= 9.5;
      }
    }

    y -= 6;
  }

  // --- EDUCATION ---
  drawSectionHeader(isPt ? "Formação Acadêmica" : "Education");
  for (const edu of profile.education) {
    checkPageBreak(25);
    const degree = sanitize(edu.degree[locale] || edu.degree["pt-BR"]);
    const eduPeriod = `${edu.startDate} - ${edu.endDate || (isPt ? "Presente" : "Present")}`;

    page.drawText(`${edu.institution} - ${degree}`, {
      x: margin,
      y,
      size: 8.5,
      font: fontBold,
      color: colorPrimary,
    });

    const pWidth = fontRegular.widthOfTextAtSize(eduPeriod, 8);
    page.drawText(eduPeriod, {
      x: margin + contentWidth - pWidth,
      y,
      size: 8,
      font: fontRegular,
      color: colorMuted,
    });
    y -= 11;

    if (edu.fieldOfStudy) {
      const field = sanitize(edu.fieldOfStudy[locale] || edu.fieldOfStudy["pt-BR"]);
      page.drawText(field, {
        x: margin,
        y,
        size: 8,
        font: fontOblique,
        color: colorMuted,
      });
      y -= 11;
    }
  }

  // --- LANGUAGES ---
  drawSectionHeader(isPt ? "Idiomas" : "Languages");
  for (const lang of profile.languages) {
    checkPageBreak(12);
    const lName = sanitize(lang.name[locale] || lang.name["pt-BR"]);
    const lProf = sanitize(lang.proficiency[locale] || lang.proficiency["pt-BR"]);
    page.drawText(`* ${lName}: ${lProf}`, {
      x: margin + 4,
      y,
      size: 8,
      font: fontRegular,
      color: colorText,
    });
    y -= 11;
  }

  // --- PAGE NUMBERING ---
  const pages = doc.getPages();
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    const pageNumText = isPt ? `Página ${idx + 1} de ${totalPages}` : `Page ${idx + 1} of ${totalPages}`;
    const numWidth = fontRegular.widthOfTextAtSize(pageNumText, 7.5);
    p.drawText(pageNumText, {
      x: pageWidth - margin - numWidth,
      y: 18,
      size: 7.5,
      font: fontRegular,
      color: colorMuted,
    });
    p.drawText("Guilherme Rodovalho - Curriculum Vitae", {
      x: margin,
      y: 18,
      size: 7.5,
      font: fontRegular,
      color: colorMuted,
    });
  });

  return await doc.save();
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const ptPath = path.join(outputDir, "guilherme-rodovalho-cv-pt.pdf");
  const enPath = path.join(outputDir, "guilherme-rodovalho-cv-en.pdf");

  const content = await fs.readFile(profilePath, "utf-8");
  const profile = JSON.parse(content);

  console.log("Generating pt-BR resume PDF from content/profile.json...");
  const ptBytes = await createResumePDF(profile, "pt-BR");
  await fs.writeFile(ptPath, ptBytes);
  console.log(`Saved: ${ptPath} (${ptBytes.length} bytes)`);

  console.log("Generating en-US resume PDF from content/profile.json...");
  const enBytes = await createResumePDF(profile, "en-US");
  await fs.writeFile(enPath, enBytes);
  console.log(`Saved: ${enPath} (${enBytes.length} bytes)`);

  console.log("✅ PDF Resume generation completed successfully!");
}

main().catch((err) => {
  console.error("Error generating resume PDFs:", err);
  process.exit(1);
});
