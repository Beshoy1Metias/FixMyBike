import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const { name, email, subject, message } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required." },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                userId: session?.user?.id ?? null,
                name: session?.user?.name ?? name,
                email: session?.user?.email ?? email,
                subject,
                message,
            },
        });

        // Send email to admin(s)
        const adminUsers = await prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { email: true }
        });

        const adminEmails = adminUsers.map(u => u.email).filter(Boolean);
        
        // If no admins in DB, check env
        if (adminEmails.length === 0 && process.env.ADMIN_EMAIL) {
            adminEmails.push(process.env.ADMIN_EMAIL);
        }

        if (adminEmails.length > 0) {
            const senderName = session?.user?.name ?? name ?? "Anonymous";
            const senderEmail = session?.user?.email ?? email ?? "No email provided";
            
            const emailText = [
                `You received new feedback on FixMyBike.`,
                ``,
                `From: ${senderName} <${senderEmail}>`,
                `Subject: ${subject || "General Feedback"}`,
                ``,
                message,
                ``,
                `---`,
                `This message was sent via the Contact the Owner form.`
            ].join("\n");

            // Send to each admin (or use one send with multiple BCC/To if lib supports it)
            for (const toEmail of adminEmails) {
                void sendEmail({
                    to: toEmail,
                    subject: `[FixMyBike Feedback] ${subject || "New Message"}`,
                    text: emailText
                });
            }
        } else {
            console.warn("[POST /api/feedback] No admin email found to send feedback to.");
        }

        return NextResponse.json({ feedback }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/feedback] Error:", error);
        return NextResponse.json(
            { error: "Failed to send feedback." },
            { status: 500 }
        );
    }
}
