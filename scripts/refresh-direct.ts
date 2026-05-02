/**
 * Refresh live data using direct PostgreSQL (no Supabase)
 * npx tsx scripts/refresh-direct.ts
 */
import { query, getOne } from "../lib/db";
import { fetchWorldBankData, distributeQuarterly, estimateSectors } from "../lib/ingestion/world-bank";
import { fetchIMFData } from "../lib/ingestion/imf";

async function refreshAllData() {
  const sources = { worldBank: false, imf: false };
  const updatedAt = new Date().toISOString();
  const yearsIngested: number[] = [];

  try {
    console.log("Fetching World Bank data...");
    const wbData = await fetchWorldBankData();
    sources.worldBank = true;

    console.log("Fetching IMF data...");
    const imfData = await fetchIMFData();
    sources.imf = true;

    if (!wbData && !imfData) {
      throw new Error("All upstream data sources failed");
    }

    // GDP ingestion
    if (wbData) {
      const years = Object.keys(wbData.gdpAnnual)
        .map(Number)
        .filter((y) => y >= 2015)
        .sort();

      console.log(`\nIngesting GDP for years: ${years.join(", ")}`);

      for (const year of years) {
        const annualGDPusd = wbData.gdpAnnual[year];
        const annualGDPmBSD = Math.round(annualGDPusd / 1_000_000);
        const quarters = distributeQuarterly(annualGDPmBSD);
        const pop = wbData.population[year] ?? 408_000;
        const growth = wbData.gdpGrowth?.[year] ?? imfData?.gdpGrowth?.[year] ?? null;

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
        console.log(`  ✓ ${year}: $${annualGDPmBSD}M BSD ($${annualGDPusd.toFixed(0)}M USD), growth: ${growth}%`);
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

async function main() {
  console.log("🌍 Fetching live data from World Bank + IMF...\n");
  const result = await refreshAllData();

  if (result.success) {
    console.log(`\n✅ ${result.message}`);
    console.log(`   Updated at: ${result.updatedAt}`);
    console.log(`   Sources: ${Object.entries(result.sources)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ")}`);
    if (result.yearsIngested?.length) {
      console.log(`   Total years: ${result.yearsIngested.length}`);
    }
  } else {
    console.error(`\n❌ ${result.message}`);
    if (result.error) console.error(`   Error: ${result.error}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
