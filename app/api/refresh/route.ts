import { NextRequest, NextResponse } from "next/server";
import { getMany, query } from "@/lib/db";
import { fetchWorldBankData, distributeQuarterly, estimateSectors } from "@/lib/ingestion/world-bank";
import { fetchIMFData } from "@/lib/ingestion/imf";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REFRESH_SECRET = process.env.REFRESH_SECRET;

async function refreshAllData() {
  const sources = { worldBank: false, imf: false };
  const updatedAt = new Date().toISOString();
  const yearsIngested: number[] = [];

  try {
    const [wbData, imfData] = await Promise.allSettled([
      fetchWorldBankData(),
      fetchIMFData(),
    ]);

    const wb = wbData.status === "fulfilled" ? wbData.value : null;
    const imf = imfData.status === "fulfilled" ? imfData.value : null;

    if (wb) sources.worldBank = true;
    if (imf) sources.imf = true;

    if (!wb && !imf) {
      throw new Error("All upstream data sources failed");
    }

    // GDP ingestion
    if (wb) {
      const years = Object.keys(wb.gdpAnnual)
        .map(Number)
        .filter((y) => y >= 2015)
        .sort();

      for (const year of years) {
        const annualGDPusd = wb.gdpAnnual[year];
        const annualGDPmBSD = Math.round(annualGDPusd / 1_000_000);
        const quarters = distributeQuarterly(annualGDPmBSD);
        const pop = wb.population[year] ?? 408_000;
        const growth = wb.gdpGrowth?.[year] ?? imf?.gdpGrowth?.[year] ?? null;

        // Create/update version
        const versionRes = await query(
          `INSERT INTO data_versions (data_type, last_updated_at, fetched_at, source, status)
           VALUES ('gdp', $1, $2, 'world_bank', 'success')
           ON CONFLICT (data_type) DO UPDATE SET last_updated_at = $1, fetched_at = $2
           RETURNING id`,
          [updatedAt, updatedAt]
        );

        const versionId = versionRes.rows[0].id;

        const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
        for (let q = 0; q < 4; q++) {
          const gdp = quarters[q];
          const sectors = estimateSectors(gdp);
          await query(
            `INSERT INTO gdp_snapshots
             (snapshot_version_id, year, quarter, gdp, gdp_growth_rate, gdp_per_capita, tourism, financial, construction, agriculture, other, fetched_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (snapshot_version_id, year, quarter) DO UPDATE SET gdp = $4, gdp_growth_rate = $5, gdp_per_capita = $6`,
            [
              versionId,
              year,
              quarterLabels[q],
              gdp,
              growth,
              Math.round(annualGDPusd / pop),
              sectors.tourism,
              sectors.financial,
              sectors.construction,
              sectors.agriculture,
              sectors.other,
              updatedAt,
            ]
          );
        }
        yearsIngested.push(year);
      }
    }

    return {
      success: true,
      message: `Refreshed data from ${Object.values(sources).filter(Boolean).length} source(s)`,
      updatedAt,
      sources,
      yearsIngested,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      message: "Refresh failed",
      updatedAt,
      sources,
      error,
    };
  }
}

export async function POST(req: NextRequest) {
  if (REFRESH_SECRET) {
    const auth = req.headers.get("authorization") ?? "";
    const token = auth.replace("Bearer ", "").trim();
    if (token !== REFRESH_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await refreshAllData();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (REFRESH_SECRET && secret !== REFRESH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await refreshAllData();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
