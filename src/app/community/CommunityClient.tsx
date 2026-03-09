"use client";

import { useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/Animations/FadeIn";
import StaggerContainer from "@/components/Animations/StaggerContainer";
import styles from "./community.module.css";

interface ForumPost {
    id: string;
    title: string;
    category: string | null;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
    };
    _count: {
        comments: number;
    };
}

interface CommunityClientProps {
    initialPosts: ForumPost[];
    lang: "en" | "it";
}

const CATEGORIES = {
    en: [
        { key: "", label: "All Topics" },
        { key: "GENERAL", label: "General" },
        { key: "APP_FEEDBACK", label: "App Feedback" },
        { key: "BIKE_TALK", label: "Bike Talk" },
    ],
    it: [
        { key: "", label: "Tutti i temi" },
        { key: "GENERAL", label: "Generale" },
        { key: "APP_FEEDBACK", label: "Feedback App" },
        { key: "BIKE_TALK", label: "Parliamo di Bici" },
    ],
};

const UI_TEXT = {
    en: {
        categories: "Categories",
        rulesTitle: "Community Rules",
        rulesBody: "Be respectful, stay on topic, and help each other out!",
        latest: "Latest Discussions",
        newDiscussion: "+ New Discussion",
        by: "By",
        comments: "comments",
        noPosts: "No discussions found in this category.",
        anonymous: "User",
    },
    it: {
        categories: "Categorie",
        rulesTitle: "Regole della Community",
        rulesBody: "Sii rispettoso, rimani in tema e aiutiamoci a vicenda!",
        latest: "Ultime Discussioni",
        newDiscussion: "+ Nuova Discussione",
        by: "Di",
        comments: "commenti",
        noPosts: "Nessuna discussione trovata in questa categoria.",
        anonymous: "Utente",
    },
};

function formatTime(date: Date, lang: "en" | "it") {
    return new Date(date).toLocaleDateString(lang === "it" ? "it-IT" : "en-US");
}

export default function CommunityClient({ initialPosts, lang }: CommunityClientProps) {
    const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const t = UI_TEXT[lang];

    const fetchPosts = async (cat: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/community${cat ? `?category=${cat}` : ""}`);
            const data = await res.json();
            if (data.posts) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        fetchPosts(cat);
    };

    const getCategoryLabel = (key: string | null) => {
        if (!key) return "";
        const found = CATEGORIES[lang].find(c => c.key === key);
        return found ? found.label : key;
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h3 className={styles.sidebarTitle}>{t.categories}</h3>
                <div className={styles.categoryList}>
                    {CATEGORIES[lang].map((cat) => (
                        <button
                            key={cat.key}
                            className={`${styles.categoryBtn} ${category === cat.key ? styles.active : ""}`}
                            onClick={() => handleCategoryChange(cat.key)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                
                <div className={styles.sidebarBox}>
                    <h4>{t.rulesTitle}</h4>
                    <p>{t.rulesBody}</p>
                </div>
            </div>

            <div className={styles.main}>
                <div className={styles.header}>
                    <h2 className="text-heading-2">{t.latest}</h2>
                    <Link href="/community/new" className="btn btn-primary btn-sm">
                        {t.newDiscussion}
                    </Link>
                </div>

                <StaggerContainer className={styles.postList} stagger={0.05}>
                    {loading ? (
                        <div className="empty-state"><span className="spinner" /></div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <FadeIn key={post.id}>
                                <Link href={`/community/${post.id}`} className={styles.postCard}>
                                    <div className={styles.postAvatar}>
                                        {(post.user.name || "U").charAt(0)}
                                    </div>
                                    <div className={styles.postContent}>
                                        <div className={styles.postTop}>
                                            <span className={styles.postCategory}>{getCategoryLabel(post.category)}</span>
                                            <span className={styles.postDate}>{formatTime(post.createdAt, lang)}</span>
                                        </div>
                                        <h3 className={styles.postTitle}>{post.title}</h3>
                                        <div className={styles.postFooter}>
                                            <span>{t.by} {post.user.name || t.anonymous}</span>
                                            <span className={styles.commentCount}>💬 {post._count.comments} {t.comments}</span>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>{t.noPosts}</p>
                        </div>
                    )}
                </StaggerContainer>
            </div>
        </div>
    );
}
