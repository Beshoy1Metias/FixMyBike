"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MechanicStatusBtnProps {
    id: string;
    isAvailable: boolean;
    labelAvailable: string;
    labelBusy: string;
}

export default function MechanicStatusBtn({ id, isAvailable, labelAvailable, labelBusy }: MechanicStatusBtnProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/listings/status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    type: "mechanic",
                    status: !isAvailable
                })
            });

            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to update mechanic status", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            className={`btn btn-sm ${isAvailable ? "btn-outline-error" : "btn-outline-success"}`}
            onClick={handleToggle}
            disabled={loading}
            style={{ minWidth: "140px" }}
        >
            {loading ? "..." : (isAvailable ? labelBusy : labelAvailable)}
        </button>
    );
}
