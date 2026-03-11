"use client";

import { useState, useId } from "react";

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
    const baseId = useId();

    const sizes = {
        sm: 16,
        md: 24,
        lg: 32
    };

    const currentSize = sizes[size];

    return (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;
                const uniqueId = `${baseId}-star-${i}`;
                
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "transform 0.1s ease",
                            transform: !readonly && hover === starValue ? "scale(1.2)" : "scale(1)"
                        }}
                    >
                        <svg 
                            width={currentSize} 
                            height={currentSize} 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id={uniqueId}>
                                    <stop offset={`${fillPercentage}%`} stopColor="#F59E0B" />
                                    <stop offset={`${fillPercentage}%`} stopColor="#E5E7EB" />
                                </linearGradient>
                            </defs>
                            <path 
                                d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                                fill={`url(#${uniqueId})`}
                                stroke={fillPercentage > 0 ? "#D97706" : "#9CA3AF"}
                                strokeWidth="0.5"
                            />
                        </svg>
                    </button>
                );
            })}
        </div>
    );
}
