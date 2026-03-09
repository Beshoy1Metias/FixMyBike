export const sendEmail = async ({ to, subject }: { to: string; subject: string; text?: string; html?: string }) => {
    try {
        console.log(`Sending email to ${to}: ${subject}`);
        // Integration with Resend or other provider would go here
        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }
};
