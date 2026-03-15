// User registration API route
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email";

const TEXT = {
    en: {
        errorRequired: "Name, email, and password are required.",
        errorPassword: "Password must be at least 8 characters.",
        errorExists: "An account with that email already exists.",
        errorInternal: "Internal server error.",
    },
    it: {
        errorRequired: "Nome, email e password sono richiesti.",
        errorPassword: "La password deve contenere almeno 8 caratteri.",
        errorExists: "Esiste già un account con questa email.",
        errorInternal: "Errore interno del server.",
    }
} as const;

export async function POST(req: NextRequest) {
    try {
        const lang = (req.headers.get("accept-language")?.startsWith("it") ? "it" : "en") as "en" | "it";
        const t = TEXT[lang];
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: t.errorRequired },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: t.errorPassword },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: t.errorExists },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: { name, email, passwordHash },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        // Generate secure email verification token (expires in 1 hour)
        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.emailVerificationToken.create({
            data: { userId: user.id, token, expiresAt },
        });

        // Wait for emails to send before responding so Vercel doesn't kill the execution context
        try {
            await sendVerificationEmail(email, name, token, lang);
            await sendWelcomeEmail(email, name, lang);
        } catch (err) {
            console.error("[register] failed to send emails:", err);
        }

        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/auth/register] Error:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
