import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { participant1Id: session.user.id },
                    { participant2Id: session.user.id }
                ]
            },
            include: {
                participant1: { select: { id: true, name: true, image: true } },
                participant2: { select: { id: true, name: true, image: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("[GET /api/conversations]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
