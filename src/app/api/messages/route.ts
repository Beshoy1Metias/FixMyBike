import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

// GET /api/messages?conversationId=...
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) return NextResponse.json({ error: "conversationId required" }, { status: 400 });

        // Ensure user is part of the conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation || (conversation.participant1Id !== session.user.id && conversation.participant2Id !== session.user.id)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { id: true, name: true, image: true } } }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("[GET /api/messages]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// POST /api/messages
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { text, receiverId, conversationId } = body;

        if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

        let convId = conversationId;

        // If no conversationId is provided, find or create one between sender and receiver
        if (!convId && receiverId) {
            const existingConv = await prisma.conversation.findFirst({
                where: {
                    OR: [
                        { participant1Id: session.user.id, participant2Id: receiverId },
                        { participant1Id: receiverId, participant2Id: session.user.id }
                    ]
                }
            });

            if (existingConv) {
                convId = existingConv.id;
            } else {
                const newConv = await prisma.conversation.create({
                    data: {
                        participant1Id: session.user.id,
                        participant2Id: receiverId
                    }
                });
                convId = newConv.id;
            }
        }

        if (!convId) return NextResponse.json({ error: "Conversation or Receiver ID required" }, { status: 400 });

        const newMessage = await prisma.message.create({
            data: {
                text,
                senderId: session.user.id,
                conversationId: convId,
            },
            include: { sender: { select: { id: true, name: true, image: true } } }
        });

        await prisma.conversation.update({
            where: { id: convId },
            data: { updatedAt: new Date() }
        });

        // Trigger pusher event
        await pusherServer.trigger(`conversation-${convId}`, "new-message", newMessage);

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error("[POST /api/messages]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
