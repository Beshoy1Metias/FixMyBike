import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard/"],
        },
        sitemap: "https://fixmybike.com/sitemap.xml",
    };
}
