import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "Fix My Bike <noreply@fix-my-bike.it>";

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

// ─── Shared email shell ───────────────────────────────────────────────────────
// Light-mode first, with media query for dark mode.
// Tested against Gmail (web/iOS/Android), Apple Mail, Outlook.

function emailShell({
  lang,
  title,
  eyebrow,
  headline,
  bodyHtml,
  ctaHref,
  ctaLabel,
  footerHtml,
}: {
  lang: "en" | "it";
  title: string;
  eyebrow: string;
  headline: string;
  bodyHtml: string;
  ctaHref: string;
  ctaLabel: string;
  footerHtml: string;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fix-my-bike.it";
  const logoUrl = `${appUrl}/logo.png`;

  return `<!DOCTYPE html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

    /* Base (light mode) */
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .email-wrapper { background-color: #f4f4f5; padding: 40px 0; }
    .email-card { background-color: #ffffff; border-radius: 12px; overflow: hidden; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; }
    .email-header { background: linear-gradient(135deg, #1a1a1c 0%, #0d0d0f 100%); padding: 32px 48px; text-align: center; border-bottom: 3px solid #FF5C28; }
    .email-body { padding: 40px 48px 32px; }
    .eyebrow { font-size: 11px; font-weight: 700; color: #FF5C28; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 10px; }
    .headline { font-size: 24px; font-weight: 800; color: #111111; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 20px; }
    .accent-rule { width: 36px; height: 3px; background: linear-gradient(90deg, #FF5C28, #FFB800); border-radius: 99px; margin-bottom: 24px; }
    .body-text { font-size: 15px; line-height: 1.75; color: #444444; margin: 0 0 14px; }
    .body-text-lead { font-size: 16px; font-weight: 600; color: #111111; margin: 0 0 16px; }
    .cta-wrap { padding: 8px 48px 36px; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #FF5C28, #E04B1A); color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 15px; font-weight: 700; letter-spacing: 0.01em; }
    .divider { height: 1px; background-color: #e4e4e7; margin: 0 48px; }
    .email-footer { padding: 24px 48px 32px; }
    .footer-text { font-size: 13px; line-height: 1.7; color: #888888; margin: 0 0 12px; }
    .footer-legal { font-size: 11px; color: #aaaaaa; margin: 0; }
    .footer-legal a { color: #FF5C28; text-decoration: none; }

    /* Dark mode — Apple Mail, iOS Mail */
    @media (prefers-color-scheme: dark) {
      .email-wrapper { background-color: #0d0d0f !important; }
      .email-card { background-color: #1a1a1c !important; border-color: rgba(255,255,255,0.08) !important; }
      .headline { color: #f1f1f1 !important; }
      .body-text { color: #a0a6b3 !important; }
      .body-text-lead { color: #ffffff !important; }
      .divider { background-color: rgba(255,255,255,0.08) !important; }
      .footer-text { color: #666a75 !important; }
      .footer-legal { color: #444 !important; }
    }

    /* Responsive */
    @media (max-width: 620px) {
      .email-body, .cta-wrap, .email-footer, .divider { padding-left: 24px !important; padding-right: 24px !important; }
      .email-header { padding-left: 24px !important; padding-right: 24px !important; }
      .headline { font-size: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">

      <!-- Header -->
      <div class="email-header">
        <img src="${logoUrl}" alt="Fix My Bike" width="140" style="display:block;margin:0 auto;max-width:140px;height:auto;" />
      </div>

      <!-- Body -->
      <div class="email-body">
        <p class="eyebrow">${eyebrow}</p>
        <h1 class="headline">${headline}</h1>
        <div class="accent-rule"></div>
        ${bodyHtml}
      </div>

      <!-- CTA -->
      <div class="cta-wrap">
        <a href="${ctaHref}" class="cta-btn" target="_blank">${ctaLabel} &rarr;</a>
      </div>

      <div class="divider"></div>

      <!-- Footer -->
      <div class="email-footer">
        <p class="footer-text">${footerHtml}</p>
        <p class="footer-legal">
          &copy; Fix My Bike &nbsp;&middot;&nbsp;
          <a href="${appUrl}">fix-my-bike.it</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

// ─── Welcome email ────────────────────────────────────────────────────────────

const WELCOME = {
  en: {
    subject: "Welcome to Fix My Bike! 🚲",
    eyebrow: "New member",
    headline: (firstName: string) => `So glad you're here, ${firstName}.`,
    body: (firstName: string) => `
      <p class="body-text-lead">Hey ${firstName},</p>
      <p class="body-text">I'm Beshoy, the founder of Fix My Bike — and I just wanted to personally say: welcome, and thank you.</p>
      <p class="body-text">When I moved to Padova from Egypt to study, I noticed how this city runs on bikes. Finding one, fixing one, or selling one shouldn't be this complicated. So I built the place I always wished existed.</p>
      <p class="body-text">You're now part of that. Whether you're here to buy, sell, or get your bike fixed — I hope Fix My Bike makes your life a little easier.</p>
      <p class="body-text">If you find anything broken, confusing, or missing — or just have an idea — please reach out directly at <a href="mailto:beshoybassem1@gmail.com" style="color:#FF5C28;text-decoration:none;">beshoybassem1@gmail.com</a>. I read every message.</p>
      <p class="body-text">Welcome aboard. 🚲</p>
    `,
    cta: "Explore Fix My Bike",
    footer: "With gratitude,<br/>Beshoy<br/>Founder, Fix My Bike",
  },
  it: {
    subject: "Benvenuto su Fix My Bike! 🚲",
    eyebrow: "Nuovo membro",
    headline: (firstName: string) => `Felice che tu sia qui, ${firstName}.`,
    body: (firstName: string) => `
      <p class="body-text-lead">Ciao ${firstName},</p>
      <p class="body-text">Sono Beshoy, il fondatore di Fix My Bike — e volevo dirti personalmente: benvenuto, e grazie.</p>
      <p class="body-text">Quando mi sono trasferito dall'Egitto a Padova per studiare, ho capito subito quanto questa città viva di bici. Trovarne una, ripararla, o venderla non dovrebbe essere così complicato. Così ho creato il posto che avrei sempre voluto avere.</p>
      <p class="body-text">Ora fai parte di tutto questo. Che tu sia qui per comprare, vendere o far riparare la tua bici — spero che Fix My Bike ti renda la vita un po' più semplice.</p>
      <p class="body-text">Se trovi qualcosa che non funziona, che non è chiaro, o se hai un'idea — scrivimi a <a href="mailto:beshoybassem1@gmail.com" style="color:#FF5C28;text-decoration:none;">beshoybassem1@gmail.com</a>. Leggo ogni messaggio.</p>
      <p class="body-text">Benvenuto a bordo. 🚲</p>
    `,
    cta: "Esplora Fix My Bike",
    footer: "Con gratitudine,<br/>Beshoy<br/>Fondatore, Fix My Bike",
  },
} as const;

export async function sendWelcomeEmail(to: string, name: string, lang: "en" | "it" = "en") {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fix-my-bike.it";
  const t = WELCOME[lang];
  const firstName = name.split(" ")[0] || name;

  const result = await sendEmail({
    to,
    subject: t.subject,
    html: emailShell({
      lang,
      title: t.subject,
      eyebrow: t.eyebrow,
      headline: t.headline(firstName),
      bodyHtml: t.body(firstName),
      ctaHref: appUrl,
      ctaLabel: t.cta,
      footerHtml: t.footer,
    }),
  });

  if (!result.success) {
    console.error("[sendWelcomeEmail] Failed to send to", to, result.error);
  } else {
    console.log("[sendWelcomeEmail] Sent to", to);
  }

  return result;
}

// ─── Email Verification ───────────────────────────────────────────────────────

const VERIFY = {
  en: {
    subject: "Verify your email — Fix My Bike",
    eyebrow: "Action required",
    headline: "Verify your email address",
    body: (firstName: string) => `
      <p class="body-text-lead">Hey ${firstName}, thanks for joining Fix My Bike!</p>
      <p class="body-text">Please verify your email address to activate your account. This link expires in <strong>1 hour</strong>.</p>
      <p class="body-text">If you didn't create an account, you can safely ignore this email.</p>
    `,
    cta: "Verify Email Address",
    footer: "This link expires in 1 hour and can only be used once.",
  },
  it: {
    subject: "Verifica la tua email — Fix My Bike",
    eyebrow: "Azione richiesta",
    headline: "Verifica il tuo indirizzo email",
    body: (firstName: string) => `
      <p class="body-text-lead">Ciao ${firstName}, grazie per esserti iscritto a Fix My Bike!</p>
      <p class="body-text">Verifica il tuo indirizzo email per attivare il tuo account. Il link scade tra <strong>1 ora</strong>.</p>
      <p class="body-text">Se non hai creato un account, puoi ignorare questa email.</p>
    `,
    cta: "Verifica Email",
    footer: "Il link scade tra 1 ora e può essere utilizzato una sola volta.",
  },
} as const;

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string,
  lang: "en" | "it" = "en"
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fix-my-bike.it";
  const verifyUrl = `${appUrl}/auth/verify-email?token=${token}`;
  const t = VERIFY[lang];
  const firstName = name.split(" ")[0] || name;

  const result = await sendEmail({
    to,
    subject: t.subject,
    html: emailShell({
      lang,
      title: t.subject,
      eyebrow: t.eyebrow,
      headline: t.headline,
      bodyHtml: t.body(firstName),
      ctaHref: verifyUrl,
      ctaLabel: t.cta,
      footerHtml: t.footer,
    }),
  });

  if (!result.success) {
    console.error("[sendVerificationEmail] Failed to send to", to, result.error);
  } else {
    console.log("[sendVerificationEmail] Sent to", to);
  }

  return result;
}

// ─── Password Reset ───────────────────────────────────────────────────────────

const RESET = {
  en: {
    subject: "Reset your password — Fix My Bike",
    eyebrow: "Password reset",
    headline: "Reset your password",
    body: (firstName: string) => `
      <p class="body-text-lead">Hey ${firstName}, we received a request to reset your password.</p>
      <p class="body-text">Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
      <p class="body-text">If you didn't request this, no action is needed — your account is safe.</p>
    `,
    cta: "Reset Password",
    footer: "This link expires in 1 hour and can only be used once. If you didn't request a reset, ignore this email.",
  },
  it: {
    subject: "Reimposta la tua password — Fix My Bike",
    eyebrow: "Reimposta password",
    headline: "Reimposta la tua password",
    body: (firstName: string) => `
      <p class="body-text-lead">Ciao ${firstName}, abbiamo ricevuto una richiesta di reimpostazione della password.</p>
      <p class="body-text">Clicca il pulsante qui sotto per scegliere una nuova password. Il link scade tra <strong>1 ora</strong>.</p>
      <p class="body-text">Se non hai richiesto il reset, non è necessaria alcuna azione — il tuo account è al sicuro.</p>
    `,
    cta: "Reimposta Password",
    footer: "Il link scade tra 1 ora e può essere utilizzato una sola volta. Se non hai richiesto il reset, ignora questa email.",
  },
} as const;

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string,
  lang: "en" | "it" = "en"
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fix-my-bike.it";
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;
  const t = RESET[lang];
  const firstName = name.split(" ")[0] || name;

  const result = await sendEmail({
    to,
    subject: t.subject,
    html: emailShell({
      lang,
      title: t.subject,
      eyebrow: t.eyebrow,
      headline: t.headline,
      bodyHtml: t.body(firstName),
      ctaHref: resetUrl,
      ctaLabel: t.cta,
      footerHtml: t.footer,
    }),
  });

  if (!result.success) {
    console.error("[sendPasswordResetEmail] Failed to send to", to, result.error);
  } else {
    console.log("[sendPasswordResetEmail] Sent to", to);
  }

  return result;
}
