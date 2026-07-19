import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "TMQS <onboarding@resend.dev>";

let client: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export async function sendApplicationConfirmation(opts: {
  name: string;
  email: string;
}) {
  const resend = getClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skipping confirmation");
    return { skipped: true as const };
  }

  const firstName = opts.name.trim().split(/\s+/)[0] || "there";

  const subject = "Your TMQS application is in";

  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for applying to the Tec Monterrey Quant Society (TMQS).",
    "We've received your application and the founding team will review it soon.",
    "",
    "If you're a strong fit we'll reach out from this address with next steps.",
    "You'll hear from us as the founding cohort dates get closer.",
    "",
    "In the meantime, feel free to follow us on Instagram @tmqs_qro",
    "or reply to this email if you have any questions.",
    "",
    "TMQS",
    "Tec de Monterrey Campus Querétaro",
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #0f172a; max-width: 520px; line-height: 1.6;">
      <p style="margin:0 0 20px;font-size:15px;">Hi ${escapeHtml(firstName)},</p>

      <p style="margin:0 0 16px;font-size:15px;">
        Thanks for applying to the <strong>Tec Monterrey Quant Society</strong> (TMQS).
        We've received your application and the founding team will review it soon.
      </p>

      <p style="margin:0 0 16px;font-size:15px;">
        If you're a strong fit we'll reach out from this address with next steps.
        You'll hear from us as the founding cohort dates get closer.
      </p>

      <p style="margin:0 0 28px;font-size:15px;color:#475569;">
        In the meantime, follow us on Instagram
        <a href="https://www.instagram.com/tmqs_qro/" style="color:#0039a6;text-decoration:none;">@tmqs_qro</a>
        or reply to this email with any questions.
      </p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 16px;" />
      <p style="margin:0;font-size:12px;color:#94a3b8;font-family:ui-monospace,Menlo,monospace;">
        <span style="color:#0039a6;">TM</span>QS · Tec de Monterrey Campus Querétaro, Est. 2026
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.email,
      subject,
      text,
      html,
    });
    if (error) {
      console.error("[email] resend error", error);
      return { ok: false as const, error };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("[email] send threw", err);
    return { ok: false as const, error: err };
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
