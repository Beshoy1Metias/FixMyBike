import type { Metadata } from "next";
import Link from "next/link";
import styles from "./wanted.module.css";

export const metadata: Metadata = {
    title: "Wanted: Bikes — Post Your Wishlist",
    description: "Looking to buy a bike? Post your desired specs and budget. Let sellers come to you with matching offers.",
};

const MOCK_WANTED = [
    { id: "1", title: "Looking for a Road Bike — Size M", user: "Alex P.", location: "Berlin", maxBudget: 1500, bikeType: "Road", frameSize: "M", description: "After a Shimano 105 or Ultegra spec road bike around 2020-2023. Good condition preferred. Happy to consider most brands.", postedAt: "2h ago" },
    { id: "2", title: "Wanted: XC Hardtail 29er — Size L", user: "Jess M.", location: "Lyon", maxBudget: 900, bikeType: "Mountain", frameSize: "L", description: "Looking for a hardtail 29er for XC racing. Need it to have a decent fork (RockShox or Fox) and 1x drivetrain.", postedAt: "5h ago" },
    { id: "3", title: "Looking to buy an E-Bike — City spec", user: "Daniel R.", location: "Amsterdam", maxBudget: 2500, bikeType: "E-Bike", frameSize: "M", description: "Want a city e-bike with integrated lights, rack, and fenders. Bosch motor preferred. Any good brand considered.", postedAt: "1d ago" },
    { id: "4", title: "Gravel Bike wanted — any colour, Size S", user: "Priya S.", location: "London", maxBudget: 2000, bikeType: "Gravel", frameSize: "S", description: "After an adventure/gravel bike, ideally with clearance for wide tyres. SRAM or Shimano 1x is fine. GRX preferred.", postedAt: "2d ago" },
    { id: "5", title: "Seeking Brompton or Dahon folder", user: "Lukas F.", location: "Vienna", maxBudget: 1200, bikeType: "Folding", frameSize: "One Size", description: "Need a good quality folding bike for commuting + train travel. Brompton, Dahon, or similar. Decent condition only.", postedAt: "3d ago" },
    { id: "6", title: "BMX wanted for my kid (age 10)", user: "Maria G.", location: "Madrid", maxBudget: 300, bikeType: "BMX", frameSize: "S", description: "Looking for a 20\" BMX for my 10-year-old. Just needs to be solid and well maintained. Happy to refurbish a bit.", postedAt: "4d ago" },
];

export default function WantedPage() {
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
                    {MOCK_WANTED.map((post) => (
                        <Link href={`/wanted/${post.id}`} key={post.id} className={styles.postCard}>
                            <div className={styles.postLeft}>
                                <div className={styles.postAvatar}>
                                    {post.user.charAt(0)}
                                </div>
                            </div>
                            <div className={styles.postBody}>
                                <div className={styles.postTop}>
                                    <div>
                                        <h3 className={styles.postTitle}>{post.title}</h3>
                                        <div className={styles.postMeta}>
                                            <span>👤 {post.user}</span>
                                            <span>📍 {post.location}</span>
                                            <span>🕐 {post.postedAt}</span>
                                        </div>
                                    </div>
                                    <div className={styles.postRight}>
                                        <div className={styles.postBudget}>
                                            <span className={styles.budgetLabel}>Budget</span>
                                            <span className="price-sm">up to €{post.maxBudget.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.postDesc}>{post.description}</p>
                                <div className={styles.postTags}>
                                    <span className="badge badge-primary">{post.bikeType}</span>
                                    <span className="badge badge-gray">Size {post.frameSize}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
