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
            const newUrls: string[] = [];

            for (const file of filesArray) {
                const res = await fetch("/api/upload-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fileName: file.name,
                        fileType: file.type,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to get upload URL.");
                }

                await fetch(data.uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                if (data.fileUrl) {
                    newUrls.push(data.fileUrl);
                }
            }

            const allUrls = [...urls, ...newUrls];
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
        <div className="form-group">
            <label className="form-label">{label}</label>
            <input
                type="file"
                accept="image/*"
                multiple={maxImages > 1}
                onChange={handleFiles}
                disabled={uploading || urls.length >= maxImages}
            />
            {error && <div className="form-error">{error}</div>}
            {urls.length > 0 && (
                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginTop: "var(--space-2)" }}>
                    {urls.map((url) => (
                        <div
                            key={url}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: "var(--radius)",
                                overflow: "hidden",
                                border: "1px solid var(--border)",
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

