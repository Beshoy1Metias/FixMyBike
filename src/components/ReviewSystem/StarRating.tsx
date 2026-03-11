"use client";

import { useState } from "react";

interface StarRatingProps {
    rating: number;
    max?: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
}

export default function StarRating({ 
    rating, 
    max = 5, 
    onRatingChange, 
    readonly = false,
    size = "md"
}: StarRatingProps) {
    const [hover, setHover] = useState(0);

    const sizes = {
        sm: "1rem",
        md: "1.25rem",
        lg: "1.75rem"
    };

    return (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;
                const isActive = (hover || rating) >= starValue;

                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => !readonly && onRatingChange?.(starValue)}
                        onMouseEnter={() => !readonly && setHover(starValue)}
                        onMouseLeave={() => !readonly && setHover(0)}
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: readonly ? "default" : "pointer",
                            fontSize: sizes[size],
                            color: isActive ? "var(--color-accent)" : "var(--surface-2)",
                            transition: "color 0.2s ease, transform 0.1s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: !readonly && hover === starValue ? "scale(1.2)" : "scale(1)"
                        }}
                    >
                        {isActive ? "★" : "☆"}
                    </button>
                );
            })}
        </div>
    );
}
