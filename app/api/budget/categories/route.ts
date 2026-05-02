import { NextResponse } from "next/server";
import { getOne, getMany } from "@/lib/db";
import { BudgetCategory } from "@/types/bahamas-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const version = await getOne<{ id: number; last_updated_at: string; fetched_at: string; source: string }>(
      `SELECT id, last_updated_at, fetched_at, source FROM data_versions
       WHERE data_type = 'budget_categories' AND status = 'success'
       ORDER BY last_updated_at DESC LIMIT 1`
    );

    if (!version) {
      return NextResponse.json({ error: "No budget category data available" }, { status: 404 });
    }

    const rows = await getMany<any>(
      `SELECT * FROM budget_categories_snapshots WHERE snapshot_version_id = $1 ORDER BY allocated DESC`,
      [version.id]
    );

    const categories: BudgetCategory[] = rows.map((row) => ({
      id: row.category_id,
      category: row.category_name,
      ministry: row.ministry,
      allocated: row.allocated ?? 0,
      spent: row.spent ?? 0,
      remaining: row.remaining ?? 0,
      percentageUsed: row.percentage_used ?? 0,
      status: row.status as BudgetCategory["status"],
    }));

    return NextResponse.json({
      data: categories,
      meta: {
        lastUpdated: version.last_updated_at,
        fetchedAt: version.fetched_at,
        source: version.source,
        recordCount: categories.length,
      },
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
