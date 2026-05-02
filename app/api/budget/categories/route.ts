import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { BudgetCategory } from "@/types/bahamas-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data: version, error: vErr } = await supabaseAdmin
    .from("data_versions")
    .select("id, last_updated_at, fetched_at, source")
    .eq("data_type", "budget_categories")
    .eq("status", "success")
    .order("last_updated_at", { ascending: false })
    .limit(1)
    .single();

  if (vErr || !version) {
    return NextResponse.json({ error: "No budget category data available" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("budget_categories_snapshots")
    .select("*")
    .eq("snapshot_version_id", version.id)
    .order("allocated", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const categories: BudgetCategory[] = (data ?? []).map((row) => ({
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
}
