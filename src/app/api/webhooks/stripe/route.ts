import { NextResponse } from "next/server";

export async function POST() {
    return new Response("Service disabled", { status: 503 });
}
