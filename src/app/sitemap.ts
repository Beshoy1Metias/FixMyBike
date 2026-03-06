import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://fixmybike.com";

    // Fetch dynamic routes
    const bikes = await prisma.bikeListing.findMany({ select: { id: true, updatedAt: true } });
    const parts = await prisma.partListing.findMany({ select: { id: true, updatedAt: true } });
    const mechanics = await prisma.mechanicProfile.findMany({ select: { id: true, updatedAt: true } });
    const wanteds = await prisma.wantedPost.findMany({ select: { id: true, updatedAt: true } });

    const bikeUrls = bikes.map((bike) => ({
        url: `${baseUrl}/bikes/${bike.id}`,
        lastModified: bike.updatedAt,
    }));

    const partUrls = parts.map((part) => ({
        url: `${baseUrl}/parts/${part.id}`,
        lastModified: part.updatedAt,
    }));

    const mechanicUrls = mechanics.map((mech) => ({
        url: `${baseUrl}/mechanics/${mech.id}`,
        lastModified: mech.updatedAt,
    }));

    const wantedUrls = wanteds.map((w) => ({
        url: `${baseUrl}/wanted/${w.id}`,
        lastModified: w.updatedAt,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/bikes`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/parts`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/mechanics`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/wanted`,
            lastModified: new Date(),
        },
        ...bikeUrls,
        ...partUrls,
        ...mechanicUrls,
        ...wantedUrls,
    ];
}
