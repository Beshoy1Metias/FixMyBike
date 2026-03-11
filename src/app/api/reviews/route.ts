import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const targetId = searchParams.get("targetId");
        const mechanicId = searchParams.get("mechanicId");

        if (!targetId && !mechanicId) {
            return NextResponse.json({ error: "targetId or mechanicId is required" }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: {
                ...(targetId && { targetId }),
                ...(mechanicId && { mechanicId }),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("[GET /api/reviews] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { targetId, mechanicId, rating, comment } = await req.json();

        if (!targetId || !rating) {
            return NextResponse.json({ error: "targetId and rating are required" }, { status: 400 });
        }

        if (targetId === session.user.id) {
            return NextResponse.json({ error: "You cannot review yourself" }, { status: 400 });
        }

        // Check if user already reviewed this target
        const existingReview = await prisma.review.findFirst({
            where: {
                authorId: session.user.id,
                targetId,
                ...(mechanicId && { mechanicId }),
            },
        });

        if (existingReview) {
            // Update existing review
            const updatedReview = await prisma.review.update({
                where: { id: existingReview.id },
                data: {
                    rating: Number(rating),
                    comment,
                },
            });
            return NextResponse.json({ review: updatedReview, updated: true });
        }

        const review = await prisma.review.create({
            data: {
                authorId: session.user.id,
                targetId,
                mechanicId,
                rating: Number(rating),
                comment,
            },
        });

        return NextResponse.json({ review, updated: false });
    } catch (error) {
        console.error("[POST /api/reviews] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
