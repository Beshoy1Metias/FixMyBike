"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    stagger?: number;
    delay?: number;
}

export default function StaggerContainer({
    children,
    stagger = 0.1,
    delay = 0,
    className,
    ...props
}: StaggerContainerProps) {
    const variants: Variants = {
        visible: {
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
