import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ count: 0 });
        }

        const count = await prisma.message.count({
            where: {
                isRead: false,
                senderId: { not: session.user.id },
                conversation: {
                    OR: [
                        { participant1Id: session.user.id },
                        { participant2Id: session.user.id }
                    ]
                }
            }
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error("[GET /api/messages/unread-count]", error);
        return NextResponse.json({ count: 0 });
    }
}
