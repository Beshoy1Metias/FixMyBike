// POST /api/auth/forgot-password
// body: { email }
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const lang = (req.headers.get("accept-language")?.startsWith("it") ? "it" : "en") as "en" | "it";
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Always return success so we don't leak whether the email exists
        if (user) {
            // Remove any existing reset tokens for this user first
            await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

            const token = randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

            await prisma.passwordResetToken.create({
                data: { userId: user.id, token, expiresAt },
            });

            sendPasswordResetEmail(email, user.name ?? "there", token, lang).catch((err) =>
                console.error("[forgot-password] sendPasswordResetEmail error:", err)
            );
        }

        return NextResponse.json(
            { message: "If that email is registered, you'll receive a reset link shortly." },
            { status: 200 }
        );
    } catch (error) {
        console.error("[POST /api/auth/forgot-password] Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
