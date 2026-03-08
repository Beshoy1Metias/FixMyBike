import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailParams {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailParams) => {
    // Skip real sending for now as requested
    console.log(`[Email System Paused] To: ${to} | Subject: ${subject}`);
    return true;
};
