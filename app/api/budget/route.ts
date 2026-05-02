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

    let sql = `SELECT * FROM budget_snapshots WHERE snapshot_version_id = $1 ORDER BY year ASC`;
    const params: unknown[] = [version.id];

    if (year) {
      sql += ` AND year = $2`;
      params.push(year);
    }

    const rows = await getMany<any>(sql, params);

    const budgetData: BudgetData[] = rows.map((row) => ({
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
  } catch (error) {
    console.error("Budget API error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
