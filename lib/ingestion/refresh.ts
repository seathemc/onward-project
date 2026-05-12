import { supabaseAdmin } from "@/lib/supabase";
import { fetchWorldBankData, distributeQuarterly, estimateSectors } from "./world-bank";
import { fetchIMFData } from "./imf";

export interface RefreshResult {
  success: boolean;
  message: string;
  updatedAt: string;
  sources: {
    worldBank: boolean;
    imf: boolean;
  };
  yearsIngested?: number[];
  error?: string;
}

export async function refreshAllData(): Promise<RefreshResult> {
  const sources = { worldBank: false, imf: false };
  const updatedAt = new Date().toISOString();
  const yearsIngested: number[] = [];

  try {
    // Fetch from both sources in parallel
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

    // GDP ingestion — World Bank annual → quarterly snapshots
    if (wb) {
      const years = Object.keys(wb.gdpAnnual)
        .map(Number)
        .filter((y) => y >= 2015)
        .sort();

      for (const year of years) {
        const annualGDPusd = wb.gdpAnnual[year];
        const annualGDPmBSD = Math.round(annualGDPusd / 1_000_000); // USD → M BSD (pegged 1:1)
        const quarters = distributeQuarterly(annualGDPmBSD);
        const pop = wb.population[year] ?? 408_000;
        const growth = wb.gdpGrowth?.[year] ?? imf?.gdpGrowth?.[year] ?? null;

        // Create a version record
        const { data: version, error: vErr } = await supabaseAdmin
          .from("data_versions")
          .upsert(
            {
              data_type: "gdp",
              last_updated_at: updatedAt,
              fetched_at: updatedAt,
              source: "world_bank",
              status: "success",
            },
            { onConflict: "data_type" }
          )
          .select()
          .single();

        if (vErr || !version) continue;

        const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
        for (let q = 0; q < 4; q++) {
          const gdp = quarters[q];
          const sectors = estimateSectors(gdp);
          await supabaseAdmin.from("gdp_snapshots").upsert(
            {
              snapshot_version_id: version.id,
              year,
              quarter: quarterLabels[q],
              gdp,
              gdp_growth_rate: growth,
              gdp_per_capita: Math.round(annualGDPusd / pop),
              ...sectors,
              fetched_at: updatedAt,
            },
            { onConflict: "snapshot_version_id,year,quarter" }
          );
        }
        yearsIngested.push(year);
      }
    }

    // Budget ingestion — from IMF government balance and debt data
    if (imf) {
      const debtData = imf.debtToGDP;
      const govBalData = imf.govBalance;

      const years = Object.keys(debtData)
        .map(Number)
        .filter((y) => y >= 2015 && y <= new Date().getFullYear())
        .sort();

      if (years.length > 0) {
        const { data: version, error: vErr } = await supabaseAdmin
          .from("data_versions")
          .upsert(
            {
              data_type: "budget",
              last_updated_at: updatedAt,
              fetched_at: updatedAt,
              source: "imf",
              status: "success",
            },
            { onConflict: "data_type" }
          )
          .select()
          .single();

        if (!vErr && version) {
          for (const year of years) {
            const debtToGDP = debtData[year];
            const govBalPct = govBalData[year] ?? null;
            const gdpMBSD = wb
              ? Math.round((wb.gdpAnnual[year] ?? 0) / 1_000_000)
              : null;

            if (!gdpMBSD || !debtToGDP) continue;

            const debtTotal = Math.round((debtToGDP / 100) * gdpMBSD);
            const balance = govBalPct ? Math.round((govBalPct / 100) * gdpMBSD) : null;
            const revenueTotal = balance !== null ? Math.round(gdpMBSD * 0.225) : null;
            const expenditureTotal = balance !== null && revenueTotal !== null
              ? revenueTotal - balance
              : null;

            await supabaseAdmin.from("budget_snapshots").upsert(
              {
                snapshot_version_id: version.id,
                year,
                fiscal_year: `${year}/${year + 1}`,
                revenue_total: revenueTotal,
                revenue_tax: revenueTotal ? Math.round(revenueTotal * 0.757) : null,
                revenue_non_tax: revenueTotal ? Math.round(revenueTotal * 0.221) : null,
                revenue_grants: revenueTotal ? Math.round(revenueTotal * 0.022) : null,
                expenditure_total: expenditureTotal,
                expenditure_recurrent: expenditureTotal ? Math.round(expenditureTotal * 0.903) : null,
                expenditure_capital: expenditureTotal ? Math.round(expenditureTotal * 0.097) : null,
                balance,
                debt_total: debtTotal,
                debt_external: Math.round(debtTotal * 0.60),
                debt_domestic: Math.round(debtTotal * 0.40),
                debt_to_gdp: debtToGDP,
                fetched_at: updatedAt,
              },
              { onConflict: "snapshot_version_id,year" }
            );
          }
        }
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
    await supabaseAdmin.from("data_versions").upsert(
      { data_type: "gdp", status: "failed", fetched_at: updatedAt },
      { onConflict: "data_type" }
    );
    return {
      success: false,
      message: "Refresh failed",
      updatedAt,
      sources,
      error,
    };
  }
}
