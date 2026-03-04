import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const mechanics = await prisma.mechanicProfile.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
            take: 40,
        });

        return NextResponse.json({ mechanics });
    } catch (error) {
        console.error("[GET /api/mechanics] Error:", error);
        return NextResponse.json(
            { error: "Failed to load mechanics." },
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

        const { bio, location, phoneNumber, skillLevel, hourlyRate, skills, isAvailable } = await req.json();

        if (!location) {
            return NextResponse.json(
                { error: "Location is required." },
                { status: 400 }
            );
        }

        const profile = await prisma.mechanicProfile.upsert({
            where: { userId: session.user.id },
            update: {
                bio,
                location,
                phoneNumber,
                skillLevel: skillLevel || undefined,
                hourlyRate: hourlyRate ? Number(hourlyRate) : null,
                skills,
                isAvailable: typeof isAvailable === "boolean" ? isAvailable : undefined,
            },
            create: {
                userId: session.user.id,
                bio,
                location,
                phoneNumber,
                skillLevel: skillLevel || undefined,
                hourlyRate: hourlyRate ? Number(hourlyRate) : null,
                skills,
                isAvailable: typeof isAvailable === "boolean" ? isAvailable : true,
            },
        });

        return NextResponse.json({ profile }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/mechanics] Error:", error);
        return NextResponse.json(
            { error: "Failed to save mechanic profile." },
            { status: 500 }
        );
    }
}

