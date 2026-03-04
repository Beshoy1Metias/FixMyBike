import { S3Client } from "@aws-sdk/client-s3";

let s3Client: S3Client | null = null;

export function getS3Client() {
    if (!process.env.S3_REGION || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
        return null;
    }

    if (!s3Client) {
        const endpoint = process.env.S3_ENDPOINT;

        s3Client = new S3Client({
            region: process.env.S3_REGION,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
            // For non-AWS endpoints like Cloudflare R2 we MUST use
            // path-style URLs to avoid TLS hostname mismatch.
            ...(endpoint
                ? {
                      endpoint,
                      forcePathStyle: true,
                  }
                : {}),
        });
    }

    return s3Client;
}

export function getPublicFileUrl(key: string) {
    const bucket = process.env.S3_BUCKET_NAME;
    const region = process.env.S3_REGION;
    const endpoint = process.env.S3_PUBLIC_BASE_URL || process.env.S3_ENDPOINT;

    if (!bucket) return null;

    if (endpoint) {
        // Generic S3-compatible or custom domain, e.g. https://cdn.example.com or https://account.r2.cloudflarestorage.com
        return `${endpoint.replace(/\/$/, "")}/${bucket}/${key}`;
    }

    if (!region) return null;

    // Default AWS S3 pattern
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}


