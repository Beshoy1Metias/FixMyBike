import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ error: "Service currently disabled" }, { status: 503 });
}
