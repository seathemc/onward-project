import { NextRequest, NextResponse } from "next/server";
import { refreshAllData } from "@/lib/ingestion/refresh";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // allow up to 60s for upstream API calls

const REFRESH_SECRET = process.env.REFRESH_SECRET;

export async function POST(req: NextRequest) {
  // Simple secret check — attach Authorization: Bearer <REFRESH_SECRET> header
  if (REFRESH_SECRET) {
    const auth = req.headers.get("authorization") ?? "";
    const token = auth.replace("Bearer ", "").trim();
    if (token !== REFRESH_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await refreshAllData();

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

// Allow GET for cron jobs (e.g. Vercel Cron, uptime bots)
export async function GET(req: NextRequest) {
  // Cron jobs often use a secret in the query string
  const secret = req.nextUrl.searchParams.get("secret");
  if (REFRESH_SECRET && secret !== REFRESH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await refreshAllData();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
