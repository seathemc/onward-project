import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { GDPData } from "@/types/bahamas-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null;

  // Get the latest version id for GDP
  const { data: version, error: vErr } = await supabaseAdmin
    .from("data_versions")
    .select("id, last_updated_at, fetched_at, source")
    .eq("data_type", "gdp")
    .eq("status", "success")
    .order("last_updated_at", { ascending: false })
    .limit(1)
    .single();

  if (vErr || !version) {
    return NextResponse.json({ error: "No GDP data available" }, { status: 404 });
  }

  let query = supabaseAdmin
    .from("gdp_snapshots")
    .select("*")
    .eq("snapshot_version_id", version.id)
    .order("year", { ascending: true })
    .order("quarter", { ascending: true });

  if (year) query = query.eq("year", year);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const gdpData: GDPData[] = (data ?? []).map((row) => ({
    year: row.year,
    quarter: row.quarter,
    gdp: row.gdp,
    gdpGrowthRate: row.gdp_growth_rate ?? 0,
    gdpPerCapita: row.gdp_per_capita ?? 0,
    sectors: {
      tourism: row.tourism ?? 0,
      financial: row.financial ?? 0,
      construction: row.construction ?? 0,
      agriculture: row.agriculture ?? 0,
      other: row.other ?? 0,
    },
  }));

  return NextResponse.json({
    data: gdpData,
    meta: {
      lastUpdated: version.last_updated_at,
      fetchedAt: version.fetched_at,
      source: version.source,
      recordCount: gdpData.length,
    },
  });
}
