import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client, getPublicFileUrl } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const missingEnv: string[] = [];
    if (!process.env.S3_REGION) missingEnv.push("S3_REGION");
    if (!process.env.S3_BUCKET_NAME) missingEnv.push("S3_BUCKET_NAME");
    if (!process.env.S3_ACCESS_KEY_ID) missingEnv.push("S3_ACCESS_KEY_ID");
    if (!process.env.S3_SECRET_ACCESS_KEY) missingEnv.push("S3_SECRET_ACCESS_KEY");

    const s3 = getS3Client();
    const bucket = process.env.S3_BUCKET_NAME;

    if (!s3 || !bucket) {
        return NextResponse.json(
            {
                error: "Storage is not configured on the server.",
                missingEnv,
            },
            { status: 500 }
        );
    }

    try {
        const { fileName, fileType } = await req.json();

        if (!fileName || !fileType) {
            return NextResponse.json(
                { error: "fileName and fileType are required." },
                { status: 400 }
            );
        }

        const extension = fileName.split(".").pop();
        const key = `user-uploads/${session.user.id}/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
        const fileUrl = getPublicFileUrl(key);

        return NextResponse.json({ uploadUrl, fileUrl, key });
    } catch (error) {
        console.error("[POST /api/upload-url] Error:", error);
        return NextResponse.json(
            { error: "Failed to create upload URL." },
            { status: 500 }
        );
    }
}

