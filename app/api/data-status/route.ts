import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("data_versions")
    .select("data_type, last_updated_at, fetched_at, source, status")
    .order("last_updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Pivot by data_type for easy consumption
  const statusMap: Record<string, { lastUpdated: string; source: string; status: string }> = {};
  for (const row of data ?? []) {
    if (!statusMap[row.data_type]) {
      statusMap[row.data_type] = {
        lastUpdated: row.last_updated_at,
        source: row.source,
        status: row.status,
      };
    }
  }

  // Check staleness — warn if any dataset is > 7 days old
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
}
