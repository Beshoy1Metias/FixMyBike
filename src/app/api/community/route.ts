import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const where: any = {};
        if (category) {
            where.category = category;
        }

        const posts = await prisma.forumPost.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, image: true },
                },
                _count: {
                    select: { comments: true },
                },
            },
            take: 50,
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("[GET /api/community] Error:", error);
        return NextResponse.json(
            { error: "Failed to load posts." },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, category } = await req.json();

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required." },
                { status: 400 }
            );
        }

        const post = await prisma.forumPost.create({
            data: {
                userId: session.user.id,
                title,
                content,
                category: category || "GENERAL",
            },
        });

        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/community] Error:", error);
        return NextResponse.json(
            { error: "Failed to create post." },
            { status: 500 }
        );
    }
}
