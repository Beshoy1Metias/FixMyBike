"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

interface NotificationToastProps {
    message: string;
    senderName: string;
    conversationId: string;
    onClose: () => void;
}

export default function NotificationToast({ message, senderName, conversationId, onClose }: NotificationToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
                position: "fixed",
                top: "var(--navbar-height)",
                right: "var(--space-4)",
                zIndex: 1100,
                width: "320px",
                background: "var(--surface)",
                border: "1px solid var(--color-primary)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                boxShadow: "var(--shadow-lg)",
                cursor: "pointer",
            }}
        >
            <Link href={`/messages/${conversationId}`} onClick={onClose} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-1)" }}>
                    <strong style={{ fontSize: "0.9rem", color: "var(--color-primary)" }}>New Message</strong>
                    <button onClick={(e) => { e.preventDefault(); onClose(); }} style={{ background: "none", border: "none", color: "var(--text-tertiary)", fontSize: "1.2rem", padding: 0, lineHeight: 1 }}>×</button>
                </div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "2px" }}>{senderName}</div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {message}
                </p>
            </Link>
        </motion.div>
    );
}
