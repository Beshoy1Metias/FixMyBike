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

    // R2 public bucket URL: https://pub-xxx.r2.dev/<key>  (no bucket name in path)
    const r2PublicUrl = process.env.R2_PUBLIC_URL;

    // Legacy: custom domain or S3_PUBLIC_BASE_URL that includes bucket name in path
    const legacyPublic = process.env.S3_PUBLIC_BASE_URL;

    if (!bucket) return null;

    if (r2PublicUrl) {
        return `${r2PublicUrl.replace(/\/$/, "")}/${key}`;
    }

    if (legacyPublic) {
        return `${legacyPublic.replace(/\/$/, "")}/${bucket}/${key}`;
    }

    if (!region) return null;

    // Default AWS S3 pattern
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}


