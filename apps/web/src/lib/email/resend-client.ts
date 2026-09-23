import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "";

export const resend = new Resend(apiKey || "placeholder_key_for_build");

export interface SendContactEmailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactEmail(params: SendContactEmailParams) {
  const to = process.env.CONTACT_EMAIL_TO || "rodovalhogdeveloper@gmail.com";
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const emailSubject = params.subject
    ? `[Portfólio] ${params.subject}`
    : `[Portfólio] Nova mensagem de ${params.name}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px; }
          .header { border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: 700; color: #10b981; margin: 0 0 8px 0; }
          .subtitle { font-size: 13px; color: #a1a1aa; margin: 0; }
          .field { margin-bottom: 16px; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; font-family: monospace; margin-bottom: 4px; }
          .value { font-size: 14px; color: #f4f4f5; }
          .message-box { background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap; }
          .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #27272a; font-size: 12px; color: #71717a; text-align: center; }
          .reply-btn { display: inline-block; background-color: #059669; color: #ffffff !important; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">📬 Nova Mensagem de Contato</h1>
            <p class="subtitle">Enviada através do portfólio oficial de Guilherme Rodovalho</p>
          </div>
          
          <div class="field">
            <div class="label">Remetente</div>
            <div class="value"><strong>${escapeHtml(params.name)}</strong> (&lt;${escapeHtml(params.email)}&gt;)</div>
          </div>

          ${params.subject
      ? `
          <div class="field">
            <div class="label">Assunto</div>
            <div class="value">${escapeHtml(params.subject)}</div>
          </div>
          `
      : ""
    }

          <div class="field">
            <div class="label">Mensagem</div>
            <div class="message-box">${escapeHtml(params.message)}</div>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${escapeHtml(params.email)}?subject=Re:%20${encodeURIComponent(emailSubject)}" class="reply-btn">
              Responder a ${escapeHtml(params.name)}
            </a>
          </div>

          <div class="footer">
            Enviado em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} via Resend.
          </div>
        </div>
      </body>
    </html>
  `;

  if (!apiKey || apiKey === "placeholder_key_for_build") {
    console.warn("RESEND_API_KEY não configurada. Simulando envio de e-mail.");
    return {
      data: { id: "simulated-" + Date.now() },
      error: null,
    };
  }

  return await resend.emails.send({
    from,
    to,
    replyTo: params.email,
    subject: emailSubject,
    html,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
