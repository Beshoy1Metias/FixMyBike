// GET /api/auth/verify-email?token=...
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Token is required." }, { status: 400 });
    }

    try {
        const record = await prisma.emailVerificationToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!record) {
            return NextResponse.json({ error: "Invalid or expired verification link." }, { status: 400 });
        }

        if (record.expiresAt < new Date()) {
            // Clean up expired token
            await prisma.emailVerificationToken.delete({ where: { id: record.id } });
            return NextResponse.json({ error: "This verification link has expired. Please request a new one." }, { status: 400 });
        }

        // Mark user as verified and delete the token in a transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: record.userId },
                data: { emailVerified: new Date() },
            }),
            prisma.emailVerificationToken.delete({ where: { id: record.id } }),
        ]);

        return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });
    } catch (error) {
        console.error("[GET /api/auth/verify-email] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
