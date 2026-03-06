import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailParams {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailParams) => {
    if (!resend) {
        console.warn("RESEND_API_KEY is not set. Mocking email delivery.");
        console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
        console.log(`[Email Mock] Text: ${text}`);
        return true;
    }

    try {
        const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "FixMyBike Padova <no-reply@fixmybike.com>",
            to,
            subject,
            text,
            html: html || text.replace(/\n/g, "<br>"),
        });

        if (error) {
            console.error("Error sending email via Resend:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error sending email via Resend:", error);
        return false;
    }
};
