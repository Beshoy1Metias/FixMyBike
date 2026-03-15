"use client";

import { useState, ChangeEvent } from "react";

interface ImageUploaderProps {
    label?: string;
    maxImages?: number;
    onChange: (urls: string[]) => void;
}

export default function ImageUploader({ label = "Photos", maxImages = 4, onChange }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [urls, setUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setError(null);
        const filesArray = Array.from(files).slice(0, maxImages - urls.length);

        try {
            setUploading(true);

            const uploadPromises = filesArray.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Upload failed.");
                return data.url;
            });

            const results = await Promise.allSettled(uploadPromises);
            
            const successfulUrls = results
                .filter((r): r is PromiseFulfilledResult<string> => r.status === "fulfilled" && !!r.value)
                .map(r => r.value);

            if (results.some(r => r.status === "rejected")) {
                setError("Some images failed to upload.");
            }

            const allUrls = [...urls, ...successfulUrls];
            setUrls(allUrls);
            onChange(allUrls);
        } catch (err) {
            console.error(err);
            setError("Failed to upload image(s).");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="form-group" style={{ background: "var(--surface-2)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                <label className="form-label" style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 0 }}>
                    {label} <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>({urls.length}/{maxImages})</span>
                </label>
            </div>
            
            {urls.length < maxImages && (
                <div style={{ position: "relative", marginTop: "var(--space-2)" }}>
                    <input
                        type="file"
                        accept="image/*"
                        multiple={maxImages > 1}
                        onChange={handleFiles}
                        disabled={uploading}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer",
                            zIndex: 10
                        }}
                    />
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "var(--space-4)",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        color: uploading ? "var(--text-tertiary)" : "var(--color-primary)",
                        fontWeight: 500,
                        transition: "var(--transition)",
                    }}>
                        {uploading ? (
                            <>
                                <span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: "1.2rem" }}>+</span> Add Photos
                            </>
                        )}
                    </div>
                </div>
            )}
            
            {error && <div className="form-error" style={{ marginTop: "8px" }}>{error}</div>}
            
            {urls.length > 0 && (
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-4)" }}>
                    {urls.map((url) => (
                        <div
                            key={url}
                            style={{
                                position: "relative",
                                width: "calc(33.333% - 8px)",
                                aspectRatio: "1 / 1",
                                minWidth: 80,
                                borderRadius: "var(--radius-md)",
                                overflow: "hidden",
                                border: "1px solid var(--border)",
                                background: "var(--surface)"
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

