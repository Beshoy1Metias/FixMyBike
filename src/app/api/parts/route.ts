import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const parts = await prisma.partListing.findMany({
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

        return NextResponse.json({ parts });
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

