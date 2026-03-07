import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./wanted.module.css";

export const metadata: Metadata = {
    title: "Wanted: Bikes — Post Your Wishlist",
    description: "Looking to buy a bike? Post your desired specs and budget. Let sellers come to you with matching offers.",
};

function formatPostedAt(date: Date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) return `${diffMinutes || 1}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

export default async function WantedPage() {
    const posts = await prisma.wantedPost.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, name: true },
            },
        },
        take: 40,
    });
    return (
        <div className="section">
            <div className="container">
                {/* Header */}
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-12)" }}>
                    <span className="page-header__eyebrow">🔍 Wanted Bikes</span>
                    <h1 className="text-heading-1">People Looking to Buy</h1>
                    <p className="text-body-lg" style={{ maxWidth: 600 }}>
                        Got a bike to sell? Browse these wanted posts and contact buyers directly if you have what they&apos;re looking for. Or post your own request and let the perfect bike come to you.
                    </p>
                </div>

                {/* Filter + Post CTA */}
                <div className={styles.filterBar}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <input className="form-input" placeholder="🔍  Search wanted posts..." />
                    </div>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">Bike Type</option>
                        <option value="ROAD">Road</option>
                        <option value="MOUNTAIN">Mountain</option>
                        <option value="GRAVEL">Gravel</option>
                        <option value="ELECTRIC">E-Bike</option>
                        <option value="FOLDING">Folding</option>
                        <option value="BMX">BMX</option>
                    </select>
                    <select className="form-select" style={{ width: 160 }}>
                        <option value="">Max Budget</option>
                        <option value="500">Under €500</option>
                        <option value="1000">Under €1,000</option>
                        <option value="2000">Under €2,000</option>
                    </select>
                    <Link href="/wanted/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                        + Post a Request
                    </Link>
                </div>

                {/* Wanted Posts List */}
                <div className={styles.postList}>
                    {posts.map((post) => (
                        <Link href={`/wanted/${post.id}`} key={post.id} className={styles.postCard}>
                            <div className={styles.postLeft}>
                                <div className={styles.postAvatar}>
                                    {(post.user.name || "B").charAt(0)}
                                </div>
                            </div>
                            <div className={styles.postBody}>
                                <div className={styles.postTop}>
                                    <div>
                                        <h3 className={styles.postTitle}>{post.title}</h3>
                                        <div className={styles.postMeta}>
                                            <span>👤 {post.user.name || "FixMyBike buyer"}</span>
                                            <span>📍 {post.location}</span>
                                            <span>🕐 {formatPostedAt(post.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.postRight}>
                                        {post.maxBudget && (
                                            <div className={styles.postBudget}>
                                                <span className={styles.budgetLabel}>Budget</span>
                                                <span className="price-sm">up to €{post.maxBudget.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className={styles.postDesc}>{post.description}</p>
                                <div className={styles.postTags}>
                                    {post.bikeType && (
                                        <span className="badge badge-primary">{post.bikeType}</span>
                                    )}
                                    {post.frameSize && (
                                        <span className="badge badge-gray">Size {post.frameSize}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
