/**
 * Seed script — pushes initial data from mock-data.ts and forecast-scenarios.ts into Supabase.
 * Run once after deploying the schema:
 *   npx tsx scripts/seed.ts
 */
import { createClient } from "@supabase/supabase-js";
import { gdpData, budgetData, budgetCategories } from "../lib/mock-data";
import { forecastScenarios } from "../lib/forecast-scenarios";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function seedGDP() {
  const now = new Date().toISOString();

  const { data: version, error } = await db
    .from("data_versions")
    .upsert(
      { data_type: "gdp", last_updated_at: now, fetched_at: now, source: "seed", status: "success" },
      { onConflict: "data_type" }
    )
    .select()
    .single();

  if (error || !version) throw new Error(`version upsert failed: ${error?.message}`);

  for (const row of gdpData) {
    await db.from("gdp_snapshots").upsert(
      {
        snapshot_version_id: version.id,
        year: row.year,
        quarter: row.quarter,
        gdp: row.gdp,
        gdp_growth_rate: row.gdpGrowthRate,
        gdp_per_capita: row.gdpPerCapita,
        tourism: row.sectors.tourism,
        financial: row.sectors.financial,
        construction: row.sectors.construction,
        agriculture: row.sectors.agriculture,
        other: row.sectors.other,
        fetched_at: now,
      },
      { onConflict: "snapshot_version_id,year,quarter" }
    );
  }
  console.log(`✓ Seeded ${gdpData.length} GDP quarters`);
}

async function seedBudget() {
  const now = new Date().toISOString();

  const { data: version, error } = await db
    .from("data_versions")
    .upsert(
      { data_type: "budget", last_updated_at: now, fetched_at: now, source: "seed", status: "success" },
      { onConflict: "data_type" }
    )
    .select()
    .single();

  if (error || !version) throw new Error(`version upsert failed: ${error?.message}`);

  for (const row of budgetData) {
    await db.from("budget_snapshots").upsert(
      {
        snapshot_version_id: version.id,
        year: row.year,
        fiscal_year: row.fiscalYear,
        revenue_total: row.revenue.total,
        revenue_tax: row.revenue.tax,
        revenue_non_tax: row.revenue.nonTax,
        revenue_grants: row.revenue.grants,
        expenditure_total: row.expenditure.total,
        expenditure_recurrent: row.expenditure.recurrent,
        expenditure_capital: row.expenditure.capital,
        balance: row.balance,
        debt_total: row.debt.total,
        debt_external: row.debt.external,
        debt_domestic: row.debt.domestic,
        debt_to_gdp: row.debt.debtToGDP,
        fetched_at: now,
      },
      { onConflict: "snapshot_version_id,year" }
    );
  }
  console.log(`✓ Seeded ${budgetData.length} budget years`);
}

async function seedCategories() {
  const now = new Date().toISOString();

  const { data: version, error } = await db
    .from("data_versions")
    .upsert(
      {
        data_type: "budget_categories",
        last_updated_at: now,
        fetched_at: now,
        source: "seed",
        status: "success",
      },
      { onConflict: "data_type" }
    )
    .select()
    .single();

  if (error || !version) throw new Error(`version upsert failed: ${error?.message}`);

  for (const row of budgetCategories) {
    await db.from("budget_categories_snapshots").upsert(
      {
        snapshot_version_id: version.id,
        category_id: row.id,
        category_name: row.category,
        ministry: row.ministry,
        allocated: row.allocated,
        spent: row.spent,
        remaining: row.remaining,
        percentage_used: row.percentageUsed,
        status: row.status,
        fetched_at: now,
      },
      { onConflict: "snapshot_version_id,category_id" }
    );
  }
  console.log(`✓ Seeded ${budgetCategories.length} budget categories`);
}

async function seedForecasts() {
  for (const scenario of forecastScenarios) {
    for (const proj of scenario.projections) {
      await db.from("forecast_scenarios").upsert(
        {
          scenario_name: scenario.id,
          year: proj.year,
          scenario_type: scenario.category,
          gdp_projection: proj.gdp,
          growth_rate: null,
          description: scenario.name,
        },
        { onConflict: "scenario_name,year" }
      );
    }
  }
  console.log(`✓ Seeded ${forecastScenarios.length} forecast scenarios`);
}

async function main() {
  console.log("Seeding Supabase...");
  await seedGDP();
  await seedBudget();
  await seedCategories();
  await seedForecasts();
  console.log("\nDone. Run /api/refresh to pull live data from World Bank + IMF.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
