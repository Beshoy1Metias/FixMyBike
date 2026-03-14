"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    stagger?: number;
    delay?: number;
    viewportMargin?: string;
    once?: boolean;
}

export default function StaggerContainer({
    children,
    stagger = 0.1,
    delay = 0,
    viewportMargin = "-50px",
    once = true,
    className,
    ...props
}: StaggerContainerProps) {
    const variants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
                when: "beforeChildren",
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: viewportMargin }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
