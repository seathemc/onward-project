import { NextResponse } from "next/server";
import { getMany } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getMany<any>(
      `SELECT data_type, last_updated_at, fetched_at, source, status FROM data_versions ORDER BY last_updated_at DESC`
    );

    const statusMap: Record<string, { lastUpdated: string; source: string; status: string }> = {};
    for (const row of data) {
      if (!statusMap[row.data_type]) {
        statusMap[row.data_type] = {
          lastUpdated: row.last_updated_at,
          source: row.source,
          status: row.status,
        };
      }
    }

    const now = Date.now();
    const staleness: Record<string, boolean> = {};
    for (const [type, info] of Object.entries(statusMap)) {
      const age = now - new Date(info.lastUpdated).getTime();
      staleness[type] = age > 7 * 24 * 60 * 60 * 1000;
    }

    return NextResponse.json({
      datasets: statusMap,
      staleness,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Data status error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
