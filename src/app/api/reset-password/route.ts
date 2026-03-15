// POST /api/auth/reset-password
// body: { token, password }
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
        }

        const record = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!record) {
            return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
        }

        if (record.expiresAt < new Date()) {
            await prisma.passwordResetToken.delete({ where: { id: record.id } });
            return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: record.userId },
                data: { passwordHash },
            }),
            prisma.passwordResetToken.delete({ where: { id: record.id } }),
        ]);

        return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });
    } catch (error) {
        console.error("[POST /api/auth/reset-password] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
