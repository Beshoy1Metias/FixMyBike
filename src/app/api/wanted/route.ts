import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const posts = await prisma.wantedPost.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
            take: 40,
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("[GET /api/wanted] Error:", error);
        return NextResponse.json(
            { error: "Failed to load wanted posts." },
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

        const { title, description, maxBudget, bikeType, frameSize, location } = await req.json();

        if (!title || !description || !location) {
            return NextResponse.json(
                { error: "Title, description, and location are required." },
                { status: 400 }
            );
        }

        const post = await prisma.wantedPost.create({
            data: {
                userId: session.user.id,
                title,
                description,
                maxBudget: maxBudget ? Number(maxBudget) : null,
                bikeType: bikeType || null,
                frameSize: frameSize || null,
                location,
            },
        });

        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/wanted] Error:", error);
        return NextResponse.json(
            { error: "Failed to create wanted post." },
            { status: 500 }
        );
    }
}

