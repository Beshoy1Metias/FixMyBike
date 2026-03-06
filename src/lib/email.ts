import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailParams {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailParams) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn("SENDGRID_API_KEY is not set. Mocking email delivery.");
        console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
        console.log(`[Email Mock] Text: ${text}`);
        return true;
    }

    try {
        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL || "notifications@fixmybike.com", // Verify this sender in SendGrid
            subject,
            text,
            html: html || text.replace(/\n/g, "<br>"),
        };
        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error("Error sending email via SendGrid:", error);
        return false;
    }
};
