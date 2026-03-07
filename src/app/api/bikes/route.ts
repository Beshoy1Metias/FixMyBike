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
        const bikeType = searchParams.get("bikeType");
        const frameSize = searchParams.get("frameSize");
        const wheelSize = searchParams.get("wheelSize");
        const location = searchParams.get("location");

        const where: any = {
            isSold: false,
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

        if (condition) where.condition = condition;
        if (bikeType) where.bikeType = bikeType;
        if (frameSize) where.frameSize = frameSize;
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

        // Add proper typing for response
        const mappedBikes = bikes.map(bike => ({
            ...bike,
            latitude: bike.latitude,
            longitude: bike.longitude
        }));

        return NextResponse.json({ bikes: mappedBikes });
    } catch (error) {
        console.error("[GET /api/bikes] Error:", error);
        return NextResponse.json(
            { error: "Failed to load bikes." },
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
            brand,
            model,
            year,
            bikeType,
            frameSize,
            wheelSize,
            color,
            location,
            latitude,
            longitude,
            photoUrls,
        } = await req.json();

        if (!title || !description || !price || !condition || !brand || !bikeType || !frameSize || !location) {
            return NextResponse.json(
                { error: "Title, description, price, condition, brand, bike type, frame size, and location are required." },
                { status: 400 }
            );
        }

        const listing = await prisma.bikeListing.create({
            data: {
                userId: session.user.id,
                title,
                description,
                price: Number(price),
                condition,
                brand,
                model,
                year: year ? Number(year) : null,
                bikeType,
                frameSize,
                wheelSize,
                color,
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
        console.error("[POST /api/bikes] Error:", error);
        return NextResponse.json(
            { error: "Failed to create listing." },
            { status: 500 }
        );
    }
}

