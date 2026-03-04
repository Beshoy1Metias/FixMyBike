import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client, getPublicFileUrl } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const s3 = getS3Client();
    const bucket = process.env.S3_BUCKET_NAME;
    if (!s3 || !bucket) {
        return NextResponse.json(
            { error: "Storage is not configured on the server." },
            { status: 500 }
        );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
        return NextResponse.json(
            { error: "No file uploaded." },
            { status: 400 }
        );
    }

    const anyFile = file as any;
    const originalName: string = anyFile.name || "upload";
    const extension = originalName.includes(".")
        ? originalName.split(".").pop()
        : "jpg";

    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    const key = `user-uploads/${session.user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: (file as any).type || "application/octet-stream",
        ACL: "public-read",
    });

    await s3.send(command);
    const fileUrl = getPublicFileUrl(key);

    return NextResponse.json({ url: fileUrl, key });
}

