// User registration API route
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

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

        // Fire-and-forget welcome email — never blocks the 201 response
        sendWelcomeEmail(email, name, lang).catch((err) =>
            console.error("[POST /api/auth/register] Welcome email error:", err)
        );

        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/auth/register] Error:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
