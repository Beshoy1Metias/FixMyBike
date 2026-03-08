import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const { name, email, subject, message } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required." },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                userId: session?.user?.id ?? null,
                name: session?.user?.name ?? name,
                email: session?.user?.email ?? email,
                subject,
                message,
            },
        });

        return NextResponse.json({ feedback }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/feedback] Error:", error);
        return NextResponse.json(
            { error: "Failed to send feedback." },
            { status: 500 }
        );
    }
}
