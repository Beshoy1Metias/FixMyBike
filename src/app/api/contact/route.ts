import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const {
            toUserId,
            subject,
            message,
            partListingId,
            bikeListingId,
            mechanicProfileId,
            wantedPostId,
            email,
            name,
        } = await req.json();

        if (!toUserId || !message) {
            return NextResponse.json(
                { error: "toUserId and message are required." },
                { status: 400 }
            );
        }

        const toUser = await prisma.user.findUnique({
            where: { id: toUserId },
            select: { id: true, email: true, name: true },
        });

        if (!toUser || !toUser.email) {
            return NextResponse.json(
                { error: "Recipient not found." },
                { status: 404 }
            );
        }

        const fromUserId = session?.user?.id ?? null;

        const contact = await prisma.contactMessage.create({
            data: {
                fromUserId,
                toUserId,
                email: fromUserId ? null : email,
                name: fromUserId ? session?.user?.name ?? null : name,
                subject,
                message,
                partListingId,
                bikeListingId,
                mechanicProfileId,
                wantedPostId,
            },
        });

        // Fire-and-forget email sending
        const listingLabel = partListingId
            ? "Part listing"
            : bikeListingId
                ? "Bike listing"
                : mechanicProfileId
                    ? "Mechanic profile"
                    : wantedPostId
                        ? "Wanted post"
                        : "Listing";

        const emailText = [
            `You received a new message on FixMyBike.`,
            ``,
            `From: ${fromUserId
                ? `${session?.user?.name || "FixMyBike user"} <${session?.user?.email || "hidden"}>`
                : `${name || "Interested buyer"} <${email || "no email provided"}>`
            }`,
            `Regarding: ${listingLabel}`,
            subject ? `Subject: ${subject}` : null,
            ``,
            message,
            ``,
            `You can reply directly to this email address if it was provided.`,
        ]
            .filter(Boolean)
            .join("\n");

        // Don't block API on email failure
        void sendEmail({
            to: toUser.email,
            subject: subject || "New message on FixMyBike",
            text: emailText
        });

        return NextResponse.json({ contact }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/contact] Error:", error);
        return NextResponse.json(
            { error: "Failed to send message." },
            { status: 500 }
        );
    }
}

