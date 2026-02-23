import { NextResponse } from "next/server";

// Lightweight health/keep-alive endpoint you can hit from a Render cron job
export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

