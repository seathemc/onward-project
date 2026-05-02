/**
 * Local seed script — uses direct PostgreSQL connection
 * npx tsx scripts/seed-local.ts
 */
import { Pool } from "pg";
import { gdpData, budgetData, budgetCategories } from "../lib/mock-data";
import { forecastScenarios } from "../lib/forecast-scenarios";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres@localhost:5432/onward",
});

async function query(sql: string, params?: unknown[]) {
  return pool.query(sql, params);
}

async function seedGDP() {
  const now = new Date().toISOString();

  const versionRes = await query(
    `INSERT INTO data_versions (data_type, last_updated_at, fetched_at, source, status)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (data_type) DO UPDATE SET last_updated_at = $2, fetched_at = $3
     RETURNING id`,
    ["gdp", now, now, "seed", "success"]
  );

  const versionId = versionRes.rows[0].id;

  for (const row of gdpData) {
    await query(
      `INSERT INTO gdp_snapshots
       (snapshot_version_id, year, quarter, gdp, gdp_growth_rate, gdp_per_capita,
        tourism, financial, construction, agriculture, other, fetched_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (snapshot_version_id, year, quarter) DO UPDATE SET
       gdp = $4, gdp_growth_rate = $5, gdp_per_capita = $6`,
      [
        versionId,
        row.year,
        row.quarter,
        row.gdp,
        row.gdpGrowthRate,
        row.gdpPerCapita,
        row.sectors.tourism,
        row.sectors.financial,
        row.sectors.construction,
        row.sectors.agriculture,
        row.sectors.other,
        now,
      ]
    );
  }
  console.log(`✓ Seeded ${gdpData.length} GDP quarters`);
}

async function seedBudget() {
  const now = new Date().toISOString();

  const versionRes = await query(
    `INSERT INTO data_versions (data_type, last_updated_at, fetched_at, source, status)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (data_type) DO UPDATE SET last_updated_at = $2, fetched_at = $3
     RETURNING id`,
    ["budget", now, now, "seed", "success"]
  );

  const versionId = versionRes.rows[0].id;

  for (const row of budgetData) {
    await query(
      `INSERT INTO budget_snapshots
       (snapshot_version_id, year, fiscal_year, revenue_total, revenue_tax, revenue_non_tax,
        revenue_grants, expenditure_total, expenditure_recurrent, expenditure_capital,
        balance, debt_total, debt_external, debt_domestic, debt_to_gdp, fetched_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       ON CONFLICT (snapshot_version_id, year) DO UPDATE SET
       revenue_total = $4, expenditure_total = $8, balance = $11`,
      [
        versionId,
        row.year,
        row.fiscalYear,
        row.revenue.total,
        row.revenue.tax,
        row.revenue.nonTax,
        row.revenue.grants,
        row.expenditure.total,
        row.expenditure.recurrent,
        row.expenditure.capital,
        row.balance,
        row.debt.total,
        row.debt.external,
        row.debt.domestic,
        row.debt.debtToGDP,
        now,
      ]
    );
  }
  console.log(`✓ Seeded ${budgetData.length} budget years`);
}

async function seedCategories() {
  const now = new Date().toISOString();

  const versionRes = await query(
    `INSERT INTO data_versions (data_type, last_updated_at, fetched_at, source, status)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (data_type) DO UPDATE SET last_updated_at = $2, fetched_at = $3
     RETURNING id`,
    ["budget_categories", now, now, "seed", "success"]
  );

  const versionId = versionRes.rows[0].id;

  for (const row of budgetCategories) {
    await query(
      `INSERT INTO budget_categories_snapshots
       (snapshot_version_id, category_id, category_name, ministry, allocated, spent,
        remaining, percentage_used, status, fetched_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (snapshot_version_id, category_id) DO UPDATE SET
       spent = $6, percentage_used = $8`,
      [
        versionId,
        row.id,
        row.category,
        row.ministry,
        row.allocated,
        row.spent,
        row.remaining,
        row.percentageUsed,
        row.status,
        now,
      ]
    );
  }
  console.log(`✓ Seeded ${budgetCategories.length} budget categories`);
}

async function seedForecasts() {
  for (const scenario of forecastScenarios) {
    for (const proj of scenario.projections) {
      await query(
        `INSERT INTO forecast_scenarios (scenario_name, year, scenario_type, gdp_projection, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (scenario_name, year) DO UPDATE SET gdp_projection = $4`,
        [scenario.id, proj.year, scenario.category, proj.gdp, scenario.name]
      );
    }
  }
  console.log(`✓ Seeded ${forecastScenarios.length} forecast scenarios`);
}

async function main() {
  console.log("Seeding local PostgreSQL...");
  await seedGDP();
  await seedBudget();
  await seedCategories();
  await seedForecasts();
  console.log("\nDone! Your database is ready.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
