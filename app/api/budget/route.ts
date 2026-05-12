import { NextRequest, NextResponse } from "next/server";
import { getOne, getMany } from "@/lib/db";
import { BudgetData } from "@/types/bahamas-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : null;

  try {
    const version = await getOne<{ id: number; last_updated_at: string; fetched_at: string; source: string }>(
      `SELECT id, last_updated_at, fetched_at, source FROM data_versions
       WHERE data_type = 'budget' AND status = 'success'
       ORDER BY last_updated_at DESC LIMIT 1`
    );

    if (!version) {
      return NextResponse.json({ error: "No budget data available" }, { status: 404 });
    }

    let sql = `SELECT * FROM budget_snapshots WHERE snapshot_version_id = $1`;
    const params: unknown[] = [version.id];

    if (year) {
      sql += ` AND year = $2`;
      params.push(year);
    }

    sql += ` ORDER BY year ASC`;

    const rows = await getMany<any>(sql, params);

    const num = (v: unknown) => v === null || v === undefined ? 0 : Number(v);
    const budgetData: BudgetData[] = rows.map((row) => ({
      year: num(row.year),
      fiscalYear: row.fiscal_year,
      revenue: {
        total: num(row.revenue_total),
        tax: num(row.revenue_tax),
        nonTax: num(row.revenue_non_tax),
        grants: num(row.revenue_grants),
      },
      expenditure: {
        total: num(row.expenditure_total),
        recurrent: num(row.expenditure_recurrent),
        capital: num(row.expenditure_capital),
      },
      balance: num(row.balance),
      debt: {
        total: num(row.debt_total),
        external: num(row.debt_external),
        domestic: num(row.debt_domestic),
        debtToGDP: num(row.debt_to_gdp),
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
  } catch (error) {
    console.error("Budget API error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
