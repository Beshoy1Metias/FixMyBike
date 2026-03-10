import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, Condition, PartCategory } from "@prisma/client";

const TEXT = {
    en: {
        errorLoad: "Failed to load parts.",
        errorRequired: "Title, description, price, condition, category, and location are required.",
        errorCreate: "Failed to create listing.",
        errorUnauthorized: "Unauthorized",
    },
    it: {
        errorLoad: "Impossibile caricare i ricambi.",
        errorRequired: "Titolo, descrizione, prezzo, condizione, categoria e località sono richiesti.",
        errorCreate: "Impossibile creare l'annuncio.",
        errorUnauthorized: "Non autorizzato",
    }
} as const;

export async function GET(req: NextRequest) {
    const lang = (req.headers.get("accept-language")?.startsWith("it") ? "it" : "en") as "en" | "it";
    const t = TEXT[lang];
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const condition = searchParams.get("condition");
        const category = searchParams.get("category");
        const location = searchParams.get("location");
        const status = searchParams.get("status");

        const where: Prisma.PartListingWhereInput = {
            isSold: status === "completed",
        };

        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { brand: { contains: q, mode: "insensitive" } },
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }

        if (condition) where.condition = condition as Condition;
        if (category) where.category = category as PartCategory;
        if (location) where.location = { contains: location, mode: "insensitive" };

        const parts = await prisma.partListing.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                photos: {
                    orderBy: { isPrimary: "desc" },
                },
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
            take: 50,
        });

        return NextResponse.json({ parts });
    } catch (error) {
        console.error("[GET /api/parts] Error:", error);
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

        const { title, description, price, condition, brand, category, location, latitude, longitude, photos } = await req.json();

        if (!title || !description || !price || !condition || !category || !location || !latitude || !longitude) {
            return NextResponse.json(
                { error: t.errorRequired },
                { status: 400 }
            );
        }

        const listing = await prisma.partListing.create({
            data: {
                userId: session.user.id,
                title,
                description,
                price: Number(price),
                condition: condition as Condition,
                brand: brand || null,
                category: category as PartCategory,
                location,
                latitude: Number(latitude),
                longitude: Number(longitude),
                photos: {
                    create: photos.map((url: string, index: number) => ({
                        url,
                        isPrimary: index === 0,
                    })),
                },
            },
        });

        return NextResponse.json({ listing }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/parts] Error:", error);
        return NextResponse.json(
            { error: t.errorCreate },
            { status: 500 }
        );
    }
}
