import prisma from "@/lib/prisma";

export const metadata = {
    title: "Admin Dashboard",
};

async function getStats() {
    const [userCount, bikeCount, partCount, mechanicCount, wantedCount] = await Promise.all([
        prisma.user.count(),
        prisma.bikeListing.count(),
        prisma.partListing.count(),
        prisma.mechanicProfile.count(),
        prisma.wantedPost.count(),
    ]);

    return {
        userCount,
        bikeCount,
        partCount,
        mechanicCount,
        wantedCount,
    };
}

export default async function AdminPage() {
    const stats = await getStats();

    return (
        <div className="section">
            <div className="container">
                <div className="page-header" style={{ textAlign: "left", paddingTop: "var(--space-8)" }}>
                    <span className="page-header__eyebrow">Admin</span>
                    <h1 className="text-heading-1">Dashboard</h1>
                </div>

                <div className="grid-3" style={{ marginBottom: "var(--space-12)" }}>
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-heading-3">Users</h3>
                            <p className="text-display">{stats.userCount}</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-heading-3">Mechanics</h3>
                            <p className="text-display">{stats.mechanicCount}</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-heading-3">Wanted Posts</h3>
                            <p className="text-display">{stats.wantedCount}</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-heading-2" style={{ marginBottom: "var(--space-6)" }}>Listings</h2>
                <div className="grid-2">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-heading-3">Bikes</h3>
                            <p className="text-display">{stats.bikeCount}</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-heading-3">Parts</h3>
                            <p className="text-display">{stats.partCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
