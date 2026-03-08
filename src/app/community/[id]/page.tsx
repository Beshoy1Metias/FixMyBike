import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PostClient from "./PostClient";

export default async function ForumPostPage({ params }: { params: { id: string } }) {
    const post = await prisma.forumPost.findUnique({
        where: { id: params.id },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
            comments: {
                orderBy: { createdAt: "asc" },
                include: {
                    user: {
                        select: { id: true, name: true, image: true },
                    },
                },
            },
        },
    });

    if (!post) {
        notFound();
    }

    return <PostClient post={post} />;
}
