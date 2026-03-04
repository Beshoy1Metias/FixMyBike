import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const bikes = await prisma.bikeListing.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                photos: {
                    orderBy: { isPrimary: "desc" },
                },
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
            take: 40,
        });

        return NextResponse.json({ bikes });
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

