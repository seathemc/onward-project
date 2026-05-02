import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { BudgetData } from "@/types/bahamas-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null;

  const { data: version, error: vErr } = await supabaseAdmin
    .from("data_versions")
    .select("id, last_updated_at, fetched_at, source")
    .eq("data_type", "budget")
    .eq("status", "success")
    .order("last_updated_at", { ascending: false })
    .limit(1)
    .single();

  if (vErr || !version) {
    return NextResponse.json({ error: "No budget data available" }, { status: 404 });
  }

  let query = supabaseAdmin
    .from("budget_snapshots")
    .select("*")
    .eq("snapshot_version_id", version.id)
    .order("year", { ascending: true });

  if (year) query = query.eq("year", year);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const budgetData: BudgetData[] = (data ?? []).map((row) => ({
    year: row.year,
    fiscalYear: row.fiscal_year,
    revenue: {
      total: row.revenue_total ?? 0,
      tax: row.revenue_tax ?? 0,
      nonTax: row.revenue_non_tax ?? 0,
      grants: row.revenue_grants ?? 0,
    },
    expenditure: {
      total: row.expenditure_total ?? 0,
      recurrent: row.expenditure_recurrent ?? 0,
      capital: row.expenditure_capital ?? 0,
    },
    balance: row.balance ?? 0,
    debt: {
      total: row.debt_total ?? 0,
      external: row.debt_external ?? 0,
      domestic: row.debt_domestic ?? 0,
      debtToGDP: row.debt_to_gdp ?? 0,
    },
  }));

  return NextResponse.json({
    data: budgetData,
    meta: {
      lastUpdated: version.last_updated_at,
      fetchedAt: version.fetched_at,
      source: version.source,
      recordCount: budgetData.length,
    },
  });
}
