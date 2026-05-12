import { NextRequest, NextResponse } from "next/server";
import { getOne, getMany } from "@/lib/db";
import { YearComparison } from "@/types/bahamas-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fromYear = searchParams.get("from") ? parseInt(searchParams.get("from")!) : null;
  const toYear = searchParams.get("to") ? parseInt(searchParams.get("to")!) : null;

  try {
    const gdpVersion = await getOne<{ id: number }>(
      `SELECT id FROM data_versions WHERE data_type = 'gdp' AND status = 'success' ORDER BY last_updated_at DESC LIMIT 1`
    );
    const budgetVersion = await getOne<{ id: number }>(
      `SELECT id FROM data_versions WHERE data_type = 'budget' AND status = 'success' ORDER BY last_updated_at DESC LIMIT 1`
    );

    if (!gdpVersion || !budgetVersion) {
      return NextResponse.json({ error: "Insufficient data for comparisons" }, { status: 404 });
    }

    // Get available years
    const gdpYears = await getMany<{ year: number }>(
      `SELECT DISTINCT year FROM gdp_snapshots WHERE snapshot_version_id = $1 ORDER BY year DESC LIMIT 8`,
      [gdpVersion.id]
    );

    const availableYears = [...new Set(gdpYears.map((r) => r.year))].sort();
    const prevYear = fromYear ?? availableYears[availableYears.length - 2];
    const currYear = toYear ?? availableYears[availableYears.length - 1];

    if (!prevYear || !currYear) {
      return NextResponse.json({ error: "Not enough years of data" }, { status: 404 });
    }

    // Fetch data
    const prevGdpRows = await getMany<any>(
      `SELECT gdp, gdp_per_capita, tourism, financial, construction, agriculture, other FROM gdp_snapshots WHERE snapshot_version_id = $1 AND year = $2`,
      [gdpVersion.id, prevYear]
    );
    const currGdpRows = await getMany<any>(
      `SELECT gdp, gdp_per_capita, tourism, financial, construction, agriculture, other FROM gdp_snapshots WHERE snapshot_version_id = $1 AND year = $2`,
      [gdpVersion.id, currYear]
    );
    const prevBudget = await getOne<any>(
      `SELECT * FROM budget_snapshots WHERE snapshot_version_id = $1 AND year = $2`,
      [budgetVersion.id, prevYear]
    );
    const currBudget = await getOne<any>(
      `SELECT * FROM budget_snapshots WHERE snapshot_version_id = $1 AND year = $2`,
      [budgetVersion.id, currYear]
    );

    const num = (v: unknown) => v === null || v === undefined ? 0 : Number(v);
    const sum = (rows: any[]) => rows.reduce((acc, r) => acc + num(r.gdp), 0);
    const avgPerCapita = (rows: any[]) =>
      rows.length ? Math.round(rows.reduce((a, r) => a + num(r.gdp_per_capita), 0) / rows.length) : 0;
    const sumField = (rows: any[], field: string) =>
      rows.reduce((a, r) => a + num(r[field]), 0);

    const prevGDP = sum(prevGdpRows);
    const currGDP = sum(currGdpRows);
    const prevPerCapita = avgPerCapita(prevGdpRows);
    const currPerCapita = avgPerCapita(currGdpRows);
    const prevTourism = sumField(prevGdpRows, "tourism");
    const currTourism = sumField(currGdpRows, "tourism");

    function compare(metric: string, prev: number, curr: number, invertTrend = false): YearComparison {
      const change = curr - prev;
      const changePercent = prev !== 0 ? parseFloat(((change / Math.abs(prev)) * 100).toFixed(2)) : 0;
      const naturallyUp = change > 0;
      const trend: YearComparison["trend"] =
        change === 0 ? "stable" : invertTrend ? (!naturallyUp ? "up" : "down") : naturallyUp ? "up" : "down";
      return { metric, previousYear: prev, currentYear: curr, change, changePercent, trend };
    }

    const comparisons: YearComparison[] = [
      compare("GDP (Annual Nominal)", prevGDP, currGDP),
      compare("GDP Per Capita", prevPerCapita, currPerCapita),
      compare("Total Revenue", num(prevBudget?.revenue_total), num(currBudget?.revenue_total)),
      compare("Total Expenditure", num(prevBudget?.expenditure_total), num(currBudget?.expenditure_total)),
      compare("Budget Balance", num(prevBudget?.balance), num(currBudget?.balance)),
      compare("Debt-to-GDP Ratio (%)", num(prevBudget?.debt_to_gdp), num(currBudget?.debt_to_gdp), true),
      compare("National Debt", num(prevBudget?.debt_total), num(currBudget?.debt_total), true),
      compare("Tax Revenue", num(prevBudget?.revenue_tax), num(currBudget?.revenue_tax)),
      compare("Capital Expenditure", num(prevBudget?.expenditure_capital), num(currBudget?.expenditure_capital)),
      compare("Tourism Sector GDP", prevTourism, currTourism),
    ];

    return NextResponse.json({
      data: comparisons,
      meta: {
        fromYear: prevYear,
        toYear: currYear,
        recordCount: comparisons.length,
      },
    });
  } catch (error) {
    console.error("Comparisons API error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
