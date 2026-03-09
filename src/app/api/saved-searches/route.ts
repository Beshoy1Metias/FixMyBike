import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { query, category, bikeType, partCategory, minPrice, maxPrice } = await req.json();

        // Basic validation
        if (!query && !category && !bikeType && !partCategory) {
            return NextResponse.json({ error: "Please provide some search criteria to save." }, { status: 400 });
        }

        const savedSearch = await prisma.savedSearch.create({
            data: {
                userId: session.user.id,
                query: query || null,
                category: category || null,
                bikeType: bikeType || null,
                partCategory: partCategory || null,
                minPrice: minPrice ? Number(minPrice) : null,
                maxPrice: maxPrice ? Number(maxPrice) : null,
            },
        });

        return NextResponse.json({ savedSearch }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/saved-searches]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searches = await prisma.savedSearch.findMany({
            where: { userId: session.user.id, isActive: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ searches }, { status: 200 });
    } catch (error) {
        console.error("[GET /api/saved-searches]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Technically, a soft delete by marking it inactive is better, but let's hard delete for simplicity here
        await prisma.savedSearch.delete({
            where: { id, userId: session.user.id }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("[DELETE /api/saved-searches]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
