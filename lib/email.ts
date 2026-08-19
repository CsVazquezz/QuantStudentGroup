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
    const { data, error } = await resend.emails.send({
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
    return { ok: true as const, id: data?.id };
  } catch (err) {
    console.error("[email] send threw", err);
    return { ok: false as const, error: err };
  }
}

export async function sendAcceptanceEmail(opts: {
  name: string;
  email: string;
}) {
  const resend = getClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skipping acceptance email");
    return { skipped: true as const };
  }

  const firstName = opts.name.trim().split(/\s+/)[0] || "there";
  // Routed through our own domain (redirects to the real invite link server-side)
  // so the link's domain matches the sending domain — avoids spam-filter flags
  // for cross-domain links.
  const whatsappUrl = "https://tecmonterreyquantsociety.com/whatsapp";
  const instagramUrl = "https://www.instagram.com/tmqs_qro/";

  const subject = "You're in — welcome to TMQS";

  const text = [
    `Hi ${firstName},`,
    "",
    "Congratulations, you've been accepted into the founding cohort of the",
    "Tec Monterrey Quant Society (TMQS).",
    "",
    "Join the community WhatsApp group, that's where we'll share updates",
    "and coordinate before the first session.",
    whatsappUrl,
    "",
    "You can also follow us on Instagram @tmqs_qro",
    instagramUrl,
    "",
    "Reply to this email if you have any questions.",
    "",
    "Welcome aboard,",
    "TMQS",
    "Tec de Monterrey Campus Querétaro",
  ].join("\n");

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #0f172a; max-width: 520px; line-height: 1.6;">
      <p style="margin:0 0 20px;font-size:15px;">Hi ${escapeHtml(firstName)},</p>

      <p style="margin:0 0 24px;font-size:15px;">
        Congratulations, you've been accepted into the founding cohort of the
        <strong>Tec Monterrey Quant Society</strong> (TMQS).
      </p>

      <p style="margin:0 0 12px;font-size:15px;">
        Join the community WhatsApp group, that's where we'll share updates and
        coordinate before the first session.
      </p>

      <p style="margin:0 0 28px;">
        <a href="${whatsappUrl}" style="display:inline-block;background:#0039a6;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;padding:10px 20px;border-radius:999px;">
          Join the WhatsApp group
        </a>
      </p>

      <p style="margin:0 0 28px;font-size:15px;color:#475569;">
        You can also follow us on Instagram
        <a href="${instagramUrl}" style="color:#0039a6;text-decoration:none;">@tmqs_qro</a>
        or reply to this email with any questions.
      </p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 16px;" />
      <p style="margin:0;font-size:12px;color:#94a3b8;font-family:ui-monospace,Menlo,monospace;">
        <span style="color:#0039a6;">TM</span>QS · Tec de Monterrey Campus Querétaro, Est. 2026
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
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
    return { ok: true as const, id: data?.id };
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
