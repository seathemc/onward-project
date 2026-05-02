import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { YearComparison } from "@/types/bahamas-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fromYear = searchParams.get("from") ? parseInt(searchParams.get("from")!) : null;
  const toYear = searchParams.get("to") ? parseInt(searchParams.get("to")!) : null;

  // Get latest version IDs
  const [gdpVersionRes, budgetVersionRes] = await Promise.all([
    supabaseAdmin
      .from("data_versions")
      .select("id")
      .eq("data_type", "gdp")
      .eq("status", "success")
      .order("last_updated_at", { ascending: false })
      .limit(1)
      .single(),
    supabaseAdmin
      .from("data_versions")
      .select("id")
      .eq("data_type", "budget")
      .eq("status", "success")
      .order("last_updated_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const gdpVersionId = gdpVersionRes.data?.id;
  const budgetVersionId = budgetVersionRes.data?.id;

  if (!gdpVersionId || !budgetVersionId) {
    return NextResponse.json({ error: "Insufficient data for comparisons" }, { status: 404 });
  }

  // Determine the two years to compare
  const { data: gdpYears } = await supabaseAdmin
    .from("gdp_snapshots")
    .select("year")
    .eq("snapshot_version_id", gdpVersionId)
    .order("year", { ascending: false })
    .limit(8); // last 2 years = 8 quarters

  const availableYears = [...new Set((gdpYears ?? []).map((r) => r.year))].sort();
  const prevYear = fromYear ?? availableYears[availableYears.length - 2];
  const currYear = toYear ?? availableYears[availableYears.length - 1];

  if (!prevYear || !currYear) {
    return NextResponse.json({ error: "Not enough years of data" }, { status: 404 });
  }

  // Fetch GDP (sum quarters for annual totals)
  const [prevGdpRows, currGdpRows, prevBudget, currBudget] = await Promise.all([
    supabaseAdmin
      .from("gdp_snapshots")
      .select("gdp, gdp_per_capita, tourism, financial, construction, agriculture, other")
      .eq("snapshot_version_id", gdpVersionId)
      .eq("year", prevYear),
    supabaseAdmin
      .from("gdp_snapshots")
      .select("gdp, gdp_per_capita, tourism, financial, construction, agriculture, other")
      .eq("snapshot_version_id", gdpVersionId)
      .eq("year", currYear),
    supabaseAdmin
      .from("budget_snapshots")
      .select("*")
      .eq("snapshot_version_id", budgetVersionId)
      .eq("year", prevYear)
      .single(),
    supabaseAdmin
      .from("budget_snapshots")
      .select("*")
      .eq("snapshot_version_id", budgetVersionId)
      .eq("year", currYear)
      .single(),
  ]);

  const sum = (rows: { gdp: number }[]) => rows.reduce((acc, r) => acc + (r.gdp ?? 0), 0);
  const avgPerCapita = (rows: { gdp_per_capita: number }[]) =>
    rows.length ? Math.round(rows.reduce((a, r) => a + (r.gdp_per_capita ?? 0), 0) / rows.length) : 0;
  const sumField = (rows: Record<string, number>[], field: string) =>
    rows.reduce((a, r) => a + (r[field] ?? 0), 0);

  const prevGDP = sum(prevGdpRows.data ?? []);
  const currGDP = sum(currGdpRows.data ?? []);
  const prevPerCapita = avgPerCapita(prevGdpRows.data ?? []);
  const currPerCapita = avgPerCapita(currGdpRows.data ?? []);
  const prevTourism = sumField(prevGdpRows.data ?? [], "tourism");
  const currTourism = sumField(currGdpRows.data ?? [], "tourism");

  const prev = prevBudget.data;
  const curr = currBudget.data;

  function compare(metric: string, prev: number, curr: number, invertTrend = false): YearComparison {
    const change = curr - prev;
    const changePercent = prev !== 0 ? parseFloat(((change / Math.abs(prev)) * 100).toFixed(2)) : 0;
    const naturallyUp = change > 0;
    const trend: YearComparison["trend"] = change === 0 ? "stable" : (invertTrend ? !naturallyUp : naturallyUp) ? "up" : "down";
    return { metric, previousYear: prev, currentYear: curr, change, changePercent, trend };
  }

  const comparisons: YearComparison[] = [
    compare("GDP (Annual Nominal)", prevGDP, currGDP),
    compare("GDP Per Capita", prevPerCapita, currPerCapita),
    compare("Total Revenue", prev?.revenue_total ?? 0, curr?.revenue_total ?? 0),
    compare("Total Expenditure", prev?.expenditure_total ?? 0, curr?.expenditure_total ?? 0),
    compare("Budget Balance", prev?.balance ?? 0, curr?.balance ?? 0),
    compare("Debt-to-GDP Ratio (%)", prev?.debt_to_gdp ?? 0, curr?.debt_to_gdp ?? 0, true),
    compare("National Debt", prev?.debt_total ?? 0, curr?.debt_total ?? 0, true),
    compare("Tax Revenue", prev?.revenue_tax ?? 0, curr?.revenue_tax ?? 0),
    compare("Capital Expenditure", prev?.expenditure_capital ?? 0, curr?.expenditure_capital ?? 0),
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
}
