import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { otherUserId } = await req.json();

        if (!otherUserId || typeof otherUserId !== "string") {
            return NextResponse.json({ error: "otherUserId is required." }, { status: 400 });
        }

        if (otherUserId === session.user.id) {
            return NextResponse.json({ error: "Cannot start a conversation with yourself." }, { status: 400 });
        }

        const existing = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { participant1Id: session.user.id, participant2Id: otherUserId },
                    { participant1Id: otherUserId, participant2Id: session.user.id },
                ],
            },
        });

        const conversation =
            existing ??
            (await prisma.conversation.create({
                data: {
                    participant1Id: session.user.id,
                    participant2Id: otherUserId,
                },
            }));

        return NextResponse.json({ conversationId: conversation.id });
    } catch (error) {
        console.error("[POST /api/conversations/start]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

