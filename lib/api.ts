import { GDPData, BudgetData, BudgetCategory, YearComparison } from "@/types/bahamas-data";
import { gdpData, budgetData, budgetCategories, yearComparisons } from "./mock-data";

const IS_SERVER = typeof window === "undefined";

// Use absolute URL on server, relative on client
function apiBase() {
  if (IS_SERVER) {
    const url = process.env.NEXT_PUBLIC_API_URL ?? process.env.VERCEL_URL;
    if (url) return url.startsWith("http") ? url : `https://${url}`;
    return "http://localhost:3000";
  }
  return "";
}

async function apiFetch<T>(path: string): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

function isSuppressed(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

// ----------------------------------------------------------------
// GDP
// ----------------------------------------------------------------
export async function fetchGDPData(year?: number): Promise<GDPData[]> {
  if (isSuppressed()) {
    await delay(300);
    return year ? gdpData.filter((d) => d.year === year) : gdpData;
  }
  const path = year ? `/api/gdp?year=${year}` : "/api/gdp";
  try {
    const { data } = await apiFetch<GDPData[]>(path);
    return data;
  } catch {
    return year ? gdpData.filter((d) => d.year === year) : gdpData;
  }
}

// ----------------------------------------------------------------
// Budget
// ----------------------------------------------------------------
export async function fetchBudgetData(year?: number): Promise<BudgetData[]> {
  if (isSuppressed()) {
    await delay(300);
    return year ? budgetData.filter((d) => d.year === year) : budgetData;
  }
  const path = year ? `/api/budget?year=${year}` : "/api/budget";
  try {
    const { data } = await apiFetch<BudgetData[]>(path);
    return data;
  } catch {
    return year ? budgetData.filter((d) => d.year === year) : budgetData;
  }
}

// ----------------------------------------------------------------
// Budget categories
// ----------------------------------------------------------------
export async function fetchBudgetCategories(): Promise<BudgetCategory[]> {
  if (isSuppressed()) {
    await delay(300);
    return budgetCategories;
  }
  try {
    const { data } = await apiFetch<BudgetCategory[]>("/api/budget/categories");
    return data;
  } catch {
    return budgetCategories;
  }
}

// ----------------------------------------------------------------
// Year-over-year comparisons
// ----------------------------------------------------------------
export async function fetchYearComparisons(fromYear: number, toYear: number): Promise<YearComparison[]> {
  if (isSuppressed()) {
    await delay(300);
    return yearComparisons;
  }
  try {
    const { data } = await apiFetch<YearComparison[]>(`/api/comparisons?from=${fromYear}&to=${toYear}`);
    return data;
  } catch {
    return yearComparisons;
  }
}

// ----------------------------------------------------------------
// Data freshness status
// ----------------------------------------------------------------
export interface DataStatus {
  datasets: Record<string, { lastUpdated: string; source: string; status: string }>;
  staleness: Record<string, boolean>;
  serverTime: string;
}

export async function fetchDataStatus(): Promise<DataStatus | null> {
  if (isSuppressed()) return null;
  try {
    return await apiFetch<DataStatus>("/api/data-status").then((r) => r as unknown as DataStatus);
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------
// CSV export (same as before, no change)
// ----------------------------------------------------------------
export async function exportToCSV(dataType: "gdp" | "budget" | "categories"): Promise<Blob> {
  let csvContent = "";

  switch (dataType) {
    case "gdp": {
      const rows = await fetchGDPData();
      csvContent = "Year,Quarter,GDP (M BSD),Growth Rate (%),GDP Per Capita\n";
      rows.forEach((r) => {
        csvContent += `${r.year},${r.quarter},${r.gdp},${r.gdpGrowthRate},${r.gdpPerCapita}\n`;
      });
      break;
    }
    case "budget": {
      const rows = await fetchBudgetData();
      csvContent = "Year,Fiscal Year,Revenue,Expenditure,Balance,Debt\n";
      rows.forEach((r) => {
        csvContent += `${r.year},${r.fiscalYear},${r.revenue.total},${r.expenditure.total},${r.balance},${r.debt.total}\n`;
      });
      break;
    }
    case "categories": {
      const rows = await fetchBudgetCategories();
      csvContent = "Ministry,Category,Allocated,Spent,Remaining,% Used,Status\n";
      rows.forEach((r) => {
        csvContent += `${r.ministry},${r.category},${r.allocated},${r.spent},${r.remaining},${r.percentageUsed},${r.status}\n`;
      });
      break;
    }
  }

  return new Blob([csvContent], { type: "text/csv" });
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
