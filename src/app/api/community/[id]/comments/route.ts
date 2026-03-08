import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content } = await req.json();

        if (!content) {
            return NextResponse.json(
                { error: "Comment content is required." },
                { status: 400 }
            );
        }

        const comment = await prisma.forumComment.create({
            data: {
                postId: params.id,
                userId: session.user.id,
                content,
            },
            include: {
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/community/[id]/comments] Error:", error);
        return NextResponse.json(
            { error: "Failed to post comment." },
            { status: 500 }
        );
    }
}
