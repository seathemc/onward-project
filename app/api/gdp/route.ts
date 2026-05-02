import { NextRequest, NextResponse } from "next/server";
import { getOne, getMany } from "@/lib/db";
import { GDPData } from "@/types/bahamas-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null;

  try {
    // Get latest version
    const version = await getOne<{ id: number; last_updated_at: string; fetched_at: string; source: string }>(
      `SELECT id, last_updated_at, fetched_at, source FROM data_versions
       WHERE data_type = 'gdp' AND status = 'success'
       ORDER BY last_updated_at DESC LIMIT 1`
    );

    if (!version) {
      return NextResponse.json({ error: "No GDP data available" }, { status: 404 });
    }

    let sql = `SELECT * FROM gdp_snapshots WHERE snapshot_version_id = $1 ORDER BY year ASC, quarter ASC`;
    const params: unknown[] = [version.id];

    if (year) {
      sql += ` AND year = $2`;
      params.push(year);
    }

    const rows = await getMany<any>(sql, params);

    const gdpData: GDPData[] = rows.map((row) => ({
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
  } catch (error) {
    console.error("GDP API error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
