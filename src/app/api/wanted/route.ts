import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, BikeType, FrameSize } from "@prisma/client";

const TEXT = {
    en: {
        errorLoad: "Failed to load wanted posts.",
        errorRequired: "Title, description, and location are required.",
        errorCreate: "Failed to create wanted post.",
        errorUnauthorized: "Unauthorized",
    },
    it: {
        errorLoad: "Impossibile caricare le richieste.",
        errorRequired: "Titolo, descrizione e località sono richiesti.",
        errorCreate: "Impossibile creare la richiesta.",
        errorUnauthorized: "Non autorizzato",
    }
} as const;

export async function GET(req: NextRequest) {
    const lang = (req.headers.get("accept-language")?.startsWith("it") ? "it" : "en") as "en" | "it";
    const t = TEXT[lang];
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const maxBudget = searchParams.get("maxBudget");
        const bikeType = searchParams.get("bikeType");
        const frameSize = searchParams.get("frameSize");
        const location = searchParams.get("location");

        const where: Prisma.WantedPostWhereInput = {
            isFulfilled: false,
        };

        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ];
        }

        if (maxBudget) {
            where.maxBudget = { lte: Number(maxBudget) };
        }

        if (bikeType) where.bikeType = bikeType as BikeType;
        if (frameSize) where.frameSize = frameSize as FrameSize;
        if (location) where.location = { contains: location, mode: "insensitive" };

        const posts = await prisma.wantedPost.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
            take: 50,
        });

        const mappedPosts = posts.map(post => ({
            ...post,
            latitude: post.latitude,
            longitude: post.longitude
        }));

        return NextResponse.json({ posts: mappedPosts });
    } catch (error) {
        console.error("[GET /api/wanted] Error:", error);
        return NextResponse.json(
            { error: t.errorLoad },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const lang = (req.headers.get("accept-language")?.startsWith("it") ? "it" : "en") as "en" | "it";
    const t = TEXT[lang];
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: t.errorUnauthorized }, { status: 401 });
        }

        const { title, description, maxBudget, bikeType, frameSize, location, latitude, longitude } = await req.json();

        if (!title || !description || !location || !latitude || !longitude) {
            return NextResponse.json(
                { error: t.errorRequired },
                { status: 400 }
            );
        }

        const post = await prisma.wantedPost.create({
            data: {
                userId: session.user.id,
                title,
                description,
                maxBudget: maxBudget ? Number(maxBudget) : null,
                bikeType: bikeType as BikeType || null,
                frameSize: frameSize as FrameSize || null,
                location,
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
            },
        });

        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/wanted] Error:", error);
        return NextResponse.json(
            { error: t.errorCreate },
            { status: 500 }
        );
    }
}
