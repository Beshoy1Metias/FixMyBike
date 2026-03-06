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

        const body = await req.json();
        const { targetId, mechanicId, rating, comment } = body;

        if (!targetId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid review parameters." }, { status: 400 });
        }

        // Prevent self-review
        if (session.user.id === targetId) {
            return NextResponse.json({ error: "Cannot review yourself." }, { status: 400 });
        }

        // Verify that target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: targetId }
        });

        if (!targetUser) {
            return NextResponse.json({ error: "Target user not found." }, { status: 404 });
        }

        const review = await prisma.review.create({
            data: {
                authorId: session.user.id,
                targetId,
                mechanicId: mechanicId || null,
                rating: Number(rating),
                comment: comment || null,
            },
        });

        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/reviews]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
