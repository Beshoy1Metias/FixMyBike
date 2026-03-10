import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, type, status } = await req.json();

        if (!id || !type || status === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let updatedListing;

        if (type === "bike") {
            const bike = await prisma.bikeListing.findUnique({ where: { id } });
            if (!bike || bike.userId !== session.user.id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            updatedListing = await prisma.bikeListing.update({
                where: { id },
                data: { isSold: status }
            });
        } else if (type === "part") {
            const part = await prisma.partListing.findUnique({ where: { id } });
            if (!part || part.userId !== session.user.id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            updatedListing = await prisma.partListing.update({
                where: { id },
                data: { isSold: status }
            });
        } else if (type === "wanted") {
            const post = await prisma.wantedPost.findUnique({ where: { id } });
            if (!post || post.userId !== session.user.id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            updatedListing = await prisma.wantedPost.update({
                where: { id },
                data: { isFulfilled: status }
            });
        } else if (type === "mechanic") {
            const profile = await prisma.mechanicProfile.findUnique({ where: { id } });
            if (!profile || profile.userId !== session.user.id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            updatedListing = await prisma.mechanicProfile.update({
                where: { id },
                data: { isAvailable: status }
            });
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json({ listing: updatedListing });
    } catch (error) {
        console.error("[PATCH /api/listings/status] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
