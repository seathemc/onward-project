/**
 * Manually trigger live data refresh from World Bank + IMF
 * npx tsx scripts/refresh-live.ts
 */
import { refreshAllData } from "../lib/ingestion/refresh";

async function main() {
  console.log("🌍 Fetching live data from World Bank + IMF...\n");
  const result = await refreshAllData();

  if (result.success) {
    console.log(`✅ ${result.message}`);
    console.log(`   Updated at: ${result.updatedAt}`);
    console.log(`   Sources: ${Object.entries(result.sources)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ")}`);
    if (result.yearsIngested?.length) {
      console.log(`   Years ingested: ${result.yearsIngested.sort().join(", ")}`);
    }
  } else {
    console.error(`❌ ${result.message}`);
    if (result.error) console.error(`   Error: ${result.error}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
