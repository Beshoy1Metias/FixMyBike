import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import CommunityClient from "./CommunityClient";

export const metadata: Metadata = {
    title: "Community Forum | FixMyBike",
    description: "Discuss bikes, share app feedback, and connect with other cyclists in our community space.",
};

export default async function CommunityPage() {
    const posts = await prisma.forumPost.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
            _count: {
                select: { comments: true },
            },
        },
        take: 50,
    });

    return (
        <div className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left" }}>
                    <span className="page-header__eyebrow">💬 Community Space</span>
                    <h1 className="text-heading-1">Bike Talk & Feedback</h1>
                    <p className="text-body-lg" style={{ maxWidth: 600 }}>
                        Welcome to the community! Share your thoughts on the app, ask for bike advice, or just chat with fellow riders.
                    </p>
                </div>

                <CommunityClient initialPosts={posts} />
            </div>
        </div>
    );
}
