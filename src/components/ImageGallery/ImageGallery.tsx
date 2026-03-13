"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

interface Photo {
    id: string;
    url: string;
}

interface ImageGalleryProps {
    photos: Photo[];
}

export default function ImageGallery({ photos }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Lock scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    if (!photos || photos.length === 0) {
        return (
            <div className={styles.mainImageContainer}>
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>
                    No Image
                </div>
            </div>
        );
    }

    return (
        <div className={styles.galleryContainer}>
            {/* Main Image View */}
            <div 
                className={styles.mainImageContainer} 
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={photos[currentIndex].url}
                    alt={`Product image ${currentIndex + 1}`}
                    fill
                    className={styles.mainImage}
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                />
            </div>

            {/* Thumbnail Grid */}
            {photos.length > 1 && (
                <div className={styles.thumbnailGrid}>
                    {photos.map((photo, index) => (
                        <div
                            key={photo.id}
                            className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ""}`}
                            onClick={() => setCurrentIndex(index)}
                            style={{ position: "relative" }}
                        >
                            <Image 
                                src={photo.url} 
                                alt={`Thumbnail ${index + 1}`} 
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="100px"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Fullscreen Lightbox */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.overlay}
                        onClick={() => setIsOpen(false)}
                    >
                        <button 
                            className={styles.closeButton} 
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className={styles.lightboxContent}>
                            {photos.length > 1 && (
                                <button className={`${styles.navButton} ${styles.prevButton}`} onClick={handlePrev}>
                                    ‹
                                </button>
                            )}

                            <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{ width: "100%", height: "90vh", position: "relative" }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={(_, info) => {
                                        if (info.offset.x > 50) handlePrev();
                                        else if (info.offset.x < -50) handleNext();
                                    }}
                                >
                                    <Image
                                        src={photos[currentIndex].url}
                                        alt={`Enlarged view ${currentIndex + 1}`}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        sizes="100vw"
                                        priority
                                    />
                                </motion.div>
                            </div>

                            {photos.length > 1 && (
                                <button className={`${styles.navButton} ${styles.nextButton}`} onClick={handleNext}>
                                    ›
                                </button>
                            )}
                            
                            <div className={styles.counter}>
                                {currentIndex + 1} / {photos.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
