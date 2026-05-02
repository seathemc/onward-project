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

    const sum = (rows: { gdp: number }[]) => rows.reduce((acc, r) => acc + (r.gdp ?? 0), 0);
    const avgPerCapita = (rows: { gdp_per_capita: number }[]) =>
      rows.length ? Math.round(rows.reduce((a, r) => a + (r.gdp_per_capita ?? 0), 0) / rows.length) : 0;
    const sumField = (rows: Record<string, number>[], field: string) =>
      rows.reduce((a, r) => a + (r[field] ?? 0), 0);

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
      compare("Total Revenue", prevBudget?.revenue_total ?? 0, currBudget?.revenue_total ?? 0),
      compare("Total Expenditure", prevBudget?.expenditure_total ?? 0, currBudget?.expenditure_total ?? 0),
      compare("Budget Balance", prevBudget?.balance ?? 0, currBudget?.balance ?? 0),
      compare("Debt-to-GDP Ratio (%)", prevBudget?.debt_to_gdp ?? 0, currBudget?.debt_to_gdp ?? 0, true),
      compare("National Debt", prevBudget?.debt_total ?? 0, currBudget?.debt_total ?? 0, true),
      compare("Tax Revenue", prevBudget?.revenue_tax ?? 0, currBudget?.revenue_tax ?? 0),
      compare("Capital Expenditure", prevBudget?.expenditure_capital ?? 0, currBudget?.expenditure_capital ?? 0),
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
