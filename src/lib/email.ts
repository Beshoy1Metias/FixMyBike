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
        headline: "So glad you're here",
        bodyParagraphs: (firstName: string) => [
            `Hey ${firstName},`,
            `I'm Beshoy, the founder of Fix My Bike — and I just wanted to personally say: welcome, and thank you.`,
            `When I moved to Padova from Egypt to study, I noticed how this city runs on bikes. Finding one, fixing one, or selling one shouldn't be this complicated. So I built the place I always wished existed.`,
            `You're now part of that. Whether you're here to buy, sell, or get your bike fixed — I hope Fix My Bike makes your life a little easier.`,
            `One thing I genuinely mean: if you find anything broken, confusing, or missing — or if you just have an idea you think would make this better — please reach out to me directly at <a href="mailto:fixmybike@fix-my-bike.it" style="color:#FF5C28;text-decoration:none;">fixmybike@fix-my-bike.it</a>. I read every message. This is still early, and the people who use it are the ones who shape it.`,
            `Welcome aboard. 🚲`,
        ],
        cta: "Explore Fix My Bike",
        footerLines: ["With gratitude,", "Beshoy", "Founder, Fix My Bike"],
    },
    it: {
        subject: "Benvenuto su Fix My Bike! 🚲",
        headline: "Felice che tu sia qui",
        bodyParagraphs: (firstName: string) => [
            `Ciao ${firstName},`,
            `Sono Beshoy, il fondatore di Fix My Bike — e volevo dirti personalmente: benvenuto, e grazie.`,
            `Quando mi sono trasferito dall'Egitto a Padova per studiare, ho capito subito quanto questa città viva di bici. Trovarne una, ripararla, o venderla non dovrebbe essere così complicato. Così ho creato il posto che avrei sempre voluto avere.`,
            `Ora fai parte di tutto questo. Che tu sia qui per comprare, vendere o far riparare la tua bici — spero che Fix My Bike ti renda la vita un po' più semplice.`,
            `Una cosa che dico sul serio: se trovi qualcosa che non funziona, che non è chiaro, o che manca — o se hai un'idea che secondo te migliorebbe la piattaforma — scrivimi direttamente a <a href="mailto:fixmybike@fix-my-bike.it" style="color:#FF5C28;text-decoration:none;">fixmybike@fix-my-bike.it</a>. Leggo ogni messaggio. Siamo ancora agli inizi, e sono le persone che la usano a darle forma.`,
            `Benvenuto a bordo. 🚲`,
        ],
        cta: "Esplora Fix My Bike",
        footerLines: ["Con gratitudine,", "Beshoy", "Founder, Fix My Bike"],
    },
} as const;

function welcomeHtml(name: string, lang: "en" | "it"): string {
    const t = WELCOME[lang];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fix-my-bike-umber.vercel.app";
    const logoUrl = `${appUrl}/logo.png`;

    // First name only for the greeting
    const firstName = name.split(" ")[0] || name;

    const paragraphs = t.bodyParagraphs(firstName)
        .map((p, i) =>
            `<p style="margin:0 0 ${i === 0 ? "20px" : "16px"};font-size:16px;line-height:1.75;color:#A0A6B3;${i === 0 ? "font-weight:600;color:#FFFFFF;" : ""}">${p}</p>`
        )
        .join("\n");

    const footerLines = t.footerLines.join("<br>");

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.subject}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0D0D0F;font-family:'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0D0F;padding:48px 0;">
    <tr>
      <td align="center" style="padding:0 16px;">

        <!-- Email card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#161618;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#1A1A1C 0%,#0D0D0F 100%);padding:36px 48px;text-align:center;border-bottom:2px solid #FF5C28;">
              <img src="${logoUrl}" alt="Fix My Bike" width="160" height="auto"
                   style="display:block;margin:0 auto;max-width:160px;height:auto;" />
            </td>
          </tr>

          <!-- ── EYEBROW ── -->
          <tr>
            <td style="padding:36px 48px 0;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#FF5C28;text-transform:uppercase;letter-spacing:0.12em;">New member</p>
              <h1 style="margin:0 0 24px;font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.03em;line-height:1.2;">${t.headline}</h1>
              <!-- Orange accent rule -->
              <div style="width:40px;height:3px;background:linear-gradient(90deg,#FF5C28,#FFB800);border-radius:99px;margin-bottom:28px;"></div>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:0 48px 32px;">
              ${paragraphs}
            </td>
          </tr>

          <!-- ── CTA ── -->
          <tr>
            <td style="padding:0 48px 40px;">
              <a href="${appUrl}"
                 style="display:inline-block;background:linear-gradient(135deg,#FF5C28,#E04B1A);color:#ffffff;text-decoration:none;padding:15px 32px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.01em;box-shadow:0 4px 20px rgba(255,92,40,0.4);">
                ${t.cta} &rarr;
              </a>
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:28px 48px 36px;">
              <p style="margin:0 0 20px;font-size:14px;line-height:1.8;color:#666A75;">
                ${footerLines}
              </p>
              <p style="margin:0;font-size:12px;color:#3D3D42;">
                You received this email because you created a Fix My Bike account.
                &nbsp;&middot;&nbsp;
                <a href="${appUrl}" style="color:#FF5C28;text-decoration:none;">fixmybike.com</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email card -->

      </td>
    </tr>
  </table>
  <!-- /Outer wrapper -->

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
