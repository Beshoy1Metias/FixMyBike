import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const skillLevel = searchParams.get("skillLevel");
        const minRate = searchParams.get("minRate");
        const maxRate = searchParams.get("maxRate");
        const location = searchParams.get("location");

        const where: any = {
            isAvailable: true,
        };

        if (q) {
            where.OR = [
                { bio: { contains: q, mode: "insensitive" } },
                { skills: { contains: q, mode: "insensitive" } },
                { location: { contains: q, mode: "insensitive" } },
                { user: { name: { contains: q, mode: "insensitive" } } },
            ];
        }

        if (skillLevel) where.skillLevel = skillLevel;
        
        if (minRate || maxRate) {
            where.hourlyRate = {};
            if (minRate) where.hourlyRate.gte = Number(minRate);
            if (maxRate) where.hourlyRate.lte = Number(maxRate);
        }

        if (location) {
            if (where.OR) {
                // If q is present, we already have an OR. We should probably keep location separate or combine.
                // For now, let's just add it to where directly if not already in OR
                where.location = { contains: location, mode: "insensitive" };
            } else {
                where.location = { contains: location, mode: "insensitive" };
            }
        }

        const mechanics = await prisma.mechanicProfile.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
            take: 50,
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

