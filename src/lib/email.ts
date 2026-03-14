import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "Fix My Bike <noreply@fixmybike.com>";

// ─── Generic send ────────────────────────────────────────────────────────────

export const sendEmail = async ({
    to,
    subject,
    html,
    text,
}: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}) => {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM,
            to,
            subject,
            html: html ?? text ?? "",
        });

        if (error) {
            console.error("[sendEmail] Resend error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("[sendEmail] Unexpected error:", err);
        return { success: false, error: err };
    }
};

// ─── Welcome email ────────────────────────────────────────────────────────────

const WELCOME = {
    en: {
        subject: "Welcome to Fix My Bike! 🚲",
        headline: "Welcome aboard",
        body: "Thanks for joining Fix My Bike! You can now buy, sell and repair bikes all in one place.",
        cta: "Go to Fix My Bike",
        footer: "Happy riding! The Fix My Bike team",
    },
    it: {
        subject: "Benvenuto su Fix My Bike! 🚲",
        headline: "Benvenuto a bordo",
        body: "Grazie per esserti unito a Fix My Bike! Ora puoi comprare, vendere e riparare bici in un unico posto.",
        cta: "Vai a Fix My Bike",
        footer: "Buona pedalata! Il team di Fix My Bike",
    },
} as const;

function welcomeHtml(name: string, lang: "en" | "it"): string {
    const t = WELCOME[lang];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fix-my-bike-umber.vercel.app";

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:32px 40px;text-align:center;">
              <span style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                🚲 Fix My Bike
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a2e;">${t.headline}, ${name}!</h1>
              <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#4b5563;">${t.body}</p>
              <a href="${appUrl}"
                 style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;">
                ${t.cta} →
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">${t.footer}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(to: string, name: string, lang: "en" | "it" = "en") {
    const t = WELCOME[lang];

    const result = await sendEmail({
        to,
        subject: t.subject,
        html: welcomeHtml(name, lang),
    });

    if (!result.success) {
        console.error("[sendWelcomeEmail] Failed to send to", to, result.error);
    } else {
        console.log("[sendWelcomeEmail] Sent to", to);
    }

    return result;
}
