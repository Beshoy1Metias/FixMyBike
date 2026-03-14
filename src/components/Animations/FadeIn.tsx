"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    scale?: number;
    viewportMargin?: string;
}

export default function FadeIn({
    children,
    delay = 0,
    duration = 0.6,
    direction = "up",
    distance = 30,
    scale = 1,
    viewportMargin = "-50px",
    className,
    ...props
}: FadeInProps) {
    const variants: Variants = {
        hidden: {
            opacity: 0,
            x: direction === "left" ? distance : direction === "right" ? -distance : 0,
            y: direction === "up" ? distance : direction === "down" ? -distance : 0,
            scale: scale !== 1 ? scale : 1,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Custom smooth ease
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: viewportMargin }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
