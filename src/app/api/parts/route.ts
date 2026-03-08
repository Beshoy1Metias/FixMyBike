import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const condition = searchParams.get("condition");
        const category = searchParams.get("category");
        const location = searchParams.get("location");

        const where: any = {
            isSold: false,
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

        if (condition) where.condition = condition;
        if (category) where.category = category;
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

        const mappedParts = parts.map(part => ({
            ...part,
            latitude: part.latitude,
            longitude: part.longitude
        }));

        return NextResponse.json({ parts: mappedParts });
    } catch (error) {
        console.error("[GET /api/parts] Error:", error);
        return NextResponse.json(
            { error: "Failed to load parts." },
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

        const {
            title,
            description,
            price,
            condition,
            category,
            brand,
            location,
            latitude,
            longitude,
            photoUrls,
        } = await req.json();

        if (!title || !description || !price || !condition || !category || !location) {
            return NextResponse.json(
                { error: "Title, description, price, condition, category, and location are required." },
                { status: 400 }
            );
        }

        const listing = await prisma.partListing.create({
            data: {
                userId: session.user.id,
                title,
                description,
                price: Number(price),
                condition,
                category,
                brand,
                location,
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
                photos: photoUrls && Array.isArray(photoUrls)
                    ? {
                          create: photoUrls.map((url: string, index: number) => ({
                              url,
                              isPrimary: index === 0,
                          })),
                      }
                    : undefined,
            },
            include: {
                photos: true,
            },
        });

        return NextResponse.json({ listing }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/parts] Error:", error);
        return NextResponse.json(
            { error: "Failed to create listing." },
            { status: 500 }
        );
    }
}

