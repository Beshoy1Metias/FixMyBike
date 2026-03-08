import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const TEXT = {
    en: {
        errorLoad: "Failed to load mechanics.",
        errorRequired: "Location is required.",
        errorSave: "Failed to save mechanic profile.",
        errorUnauthorized: "Unauthorized",
    },
    it: {
        errorLoad: "Impossibile caricare i meccanici.",
        errorRequired: "La località è richiesta.",
        errorSave: "Impossibile salvare il profilo meccanico.",
        errorUnauthorized: "Non autorizzato",
    }
} as const;

export async function GET(req: NextRequest) {
    const lang = (req.headers.get("accept-language")?.startsWith("it") ? "it" : "en") as "en" | "it";
    const t = TEXT[lang];
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
            where.location = { contains: location, mode: "insensitive" };
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
        
        // Add proper typing for response
        const mappedMechanics = mechanics.map(mech => ({
            ...mech,
            latitude: mech.latitude,
            longitude: mech.longitude
        }));

        return NextResponse.json({ mechanics: mappedMechanics });
    } catch (error) {
        console.error("[GET /api/mechanics] Error:", error);
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

        const { bio, location, latitude, longitude, phoneNumber, skillLevel, hourlyRate, skills, isAvailable } = await req.json();

        if (!location) {
            return NextResponse.json(
                { error: t.errorRequired },
                { status: 400 }
            );
        }

        const profile = await prisma.mechanicProfile.upsert({
            where: { userId: session.user.id },
            update: {
                bio,
                location,
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
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
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
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
            { error: t.errorSave },
            { status: 500 }
        );
    }
}
