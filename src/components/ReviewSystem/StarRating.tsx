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
        sm: 14,
        md: 20,
        lg: 28
    };

    const currentSize = sizes[size];

    const StarIcon = ({ fill, percentage = 100 }: { fill: boolean, percentage?: number }) => (
        <svg 
            width={currentSize} 
            height={currentSize} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            <defs>
                <linearGradient id={`starGradient-${percentage}`}>
                    <stop offset={`${percentage}%`} stopColor="var(--color-accent)" />
                    <stop offset={`${percentage}%`} stopColor="var(--surface-2)" />
                </linearGradient>
            </defs>
            <path 
                d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                fill={fill ? (percentage < 100 ? `url(#starGradient-${percentage})` : "var(--color-accent)") : "var(--surface-2)"}
            />
        </svg>
    );

    return (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;
                
                // For readonly mode, we support partial stars (e.g. 4.5)
                let fillPercentage = 0;
                if (readonly) {
                    if (rating >= starValue) fillPercentage = 100;
                    else if (rating > starValue - 1) fillPercentage = (rating - (starValue - 1)) * 100;
                } else {
                    if ((hover || rating) >= starValue) fillPercentage = 100;
                }

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
                            transition: "transform 0.1s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: !readonly && hover === starValue ? "scale(1.15)" : "scale(1)"
                        }}
                    >
                        <StarIcon fill={fillPercentage > 0} percentage={fillPercentage} />
                    </button>
                );
            })}
        </div>
    );
}
