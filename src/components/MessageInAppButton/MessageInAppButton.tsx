"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider/LanguageProvider";

interface MessageInAppButtonProps {
    receiverId: string;
}

export default function MessageInAppButton({ receiverId }: MessageInAppButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { language } = useLanguage();
    const [loading, setLoading] = useState(false);

    const label = language === "it" ? "💬 Messaggia in app" : "💬 Message in app";

    const handleClick = async () => {
        if (status === "loading") return;

        if (!session?.user?.id) {
            const callbackUrl = encodeURIComponent(pathname || "/");
            router.push(`/auth/login?callbackUrl=${callbackUrl}`);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/conversations/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otherUserId: receiverId }),
            });

            const data = await res.json();
            if (!res.ok || !data.conversationId) {
                console.error("Failed to start conversation", data);
                return;
            }

            router.push(`/messages/${data.conversationId}`);
        } catch (err) {
            console.error("Failed to start conversation", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleClick}
            disabled={loading}
        >
            {loading ? <span className="spinner" /> : label}
        </button>
    );
}

