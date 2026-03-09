import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

        // Try to find an admin to send an in-app message to
        const adminUser = await prisma.user.findFirst({
            where: { role: "ADMIN" },
            select: { id: true }
        });

        if (adminUser && session?.user?.id) {
            // If sender is logged in, create/find conversation with admin
            const senderId = session.user.id;
            const receiverId = adminUser.id;

            if (senderId !== receiverId) {
                let conversation = await prisma.conversation.findFirst({
                    where: {
                        OR: [
                            { participant1Id: senderId, participant2Id: receiverId },
                            { participant1Id: receiverId, participant2Id: senderId }
                        ]
                    }
                });

                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            participant1Id: senderId,
                            participant2Id: receiverId
                        }
                    });
                }

                await prisma.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: senderId,
                        text: `[FEEDBACK: ${subject || "General"}]\n\n${message}`
                    }
                });
            }
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
