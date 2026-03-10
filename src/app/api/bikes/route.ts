import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, Condition, BikeType, FrameSize } from "@prisma/client";

const TEXT = {
    en: {
        errorLoad: "Failed to load bikes.",
        errorRequired: "Title, description, price, condition, brand, bike type, frame size, and location are required.",
        errorCreate: "Failed to create listing.",
        errorUnauthorized: "Unauthorized",
    },
    it: {
        errorLoad: "Impossibile caricare le bici.",
        errorRequired: "Titolo, descrizione, prezzo, condizione, marca, tipo di bici, taglia e località sono richiesti.",
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
        const bikeType = searchParams.get("bikeType");
        const frameSize = searchParams.get("frameSize");
        const wheelSize = searchParams.get("wheelSize");
        const location = searchParams.get("location");
        const status = searchParams.get("status");

        const where: Prisma.BikeListingWhereInput = {
            isSold: status === "completed",
        };

        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { brand: { contains: q, mode: "insensitive" } },
                { model: { contains: q, mode: "insensitive" } },
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = Number(minPrice);
            if (maxPrice) where.price.lte = Number(maxPrice);
        }

        if (condition) where.condition = condition as Condition;
        if (bikeType) where.bikeType = bikeType as BikeType;
        if (frameSize) where.frameSize = frameSize as FrameSize;
        if (wheelSize) where.wheelSize = { contains: wheelSize, mode: "insensitive" };
        if (location) where.location = { contains: location, mode: "insensitive" };

        const bikes = await prisma.bikeListing.findMany({
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

        return NextResponse.json({ bikes });
    } catch (error) {
        console.error("[GET /api/bikes] Error:", error);
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

        const { 
            title, description, price, condition, brand, model, 
            bikeType, frameSize, wheelSize, location, latitude, longitude, photos 
        } = await req.json();

        if (!title || !description || !price || !condition || !brand || !bikeType || !frameSize || !location || !latitude || !longitude) {
            return NextResponse.json(
                { error: t.errorRequired },
                { status: 400 }
            );
        }

        const listing = await prisma.bikeListing.create({
            data: {
                userId: session.user.id,
                title,
                description,
                price: Number(price),
                condition: condition as Condition,
                brand,
                model: model || null,
                bikeType: bikeType as BikeType,
                frameSize: frameSize as FrameSize,
                wheelSize: wheelSize || null,
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
        console.error("[POST /api/bikes] Error:", error);
        return NextResponse.json(
            { error: t.errorCreate },
            { status: 500 }
        );
    }
}
