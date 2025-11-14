import { GDPData, BudgetData, BudgetCategory, YearComparison } from "@/types/bahamas-data";
import { gdpData, budgetData, budgetCategories, yearComparisons } from "./mock-data";

// Configuration - Set USE_REAL_API to true when you have real endpoints
const USE_REAL_API = false;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.bahamas.gov.bs";

/**
 * Generic fetch wrapper for API calls
 * Handles errors and can be extended with auth headers, etc.
 */
async function apiCall<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        // Add auth headers here if needed:
        // "Authorization": `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

/**
 * Fetch GDP data
 * Real API endpoint would be: /api/gdp?year=2024
 */
export async function fetchGDPData(year?: number): Promise<GDPData[]> {
  if (USE_REAL_API) {
    const endpoint = year ? `/api/gdp?year=${year}` : "/api/gdp";
    return apiCall<GDPData[]>(endpoint);
  }

  // Mock data with simulated network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (year) {
    return gdpData.filter((data) => data.year === year);
  }

  return gdpData;
}

/**
 * Fetch budget data
 * Real API endpoint would be: /api/budget?year=2024
 */
export async function fetchBudgetData(year?: number): Promise<BudgetData[]> {
  if (USE_REAL_API) {
    const endpoint = year ? `/api/budget?year=${year}` : "/api/budget";
    return apiCall<BudgetData[]>(endpoint);
  }

  // Mock data with simulated network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (year) {
    return budgetData.filter((data) => data.year === year);
  }

  return budgetData;
}

/**
 * Fetch budget categories breakdown
 * Real API endpoint would be: /api/budget/categories?year=2024
 */
export async function fetchBudgetCategories(year?: number): Promise<BudgetCategory[]> {
  if (USE_REAL_API) {
    const endpoint = year ? `/api/budget/categories?year=${year}` : "/api/budget/categories";
    return apiCall<BudgetCategory[]>(endpoint);
  }

  // Mock data with simulated network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return budgetCategories;
}

/**
 * Fetch year-over-year comparisons
 * Real API endpoint would be: /api/comparisons?from=2023&to=2024
 */
export async function fetchYearComparisons(
  fromYear: number,
  toYear: number
): Promise<YearComparison[]> {
  if (USE_REAL_API) {
    return apiCall<YearComparison[]>(`/api/comparisons?from=${fromYear}&to=${toYear}`);
  }

  // Mock data with simulated network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return yearComparisons;
}

/**
 * Export data as CSV
 * This would typically hit an endpoint that generates a CSV file
 */
export async function exportToCSV(dataType: "gdp" | "budget" | "categories"): Promise<Blob> {
  if (USE_REAL_API) {
    const response = await fetch(`${API_BASE_URL}/api/export/${dataType}`, {
      headers: {
        "Content-Type": "text/csv",
      },
    });
    return await response.blob();
  }

  // Mock CSV generation
  let csvContent = "";

  switch (dataType) {
    case "gdp":
      csvContent = "Year,Quarter,GDP (M BSD),Growth Rate (%),GDP Per Capita\n";
      gdpData.forEach((row) => {
        csvContent += `${row.year},${row.quarter},${row.gdp},${row.gdpGrowthRate},${row.gdpPerCapita}\n`;
      });
      break;
    case "budget":
      csvContent = "Year,Fiscal Year,Revenue,Expenditure,Balance,Debt\n";
      budgetData.forEach((row) => {
        csvContent += `${row.year},${row.fiscalYear},${row.revenue.total},${row.expenditure.total},${row.balance},${row.debt.total}\n`;
      });
      break;
    case "categories":
      csvContent = "Ministry,Category,Allocated,Spent,Remaining,% Used,Status\n";
      budgetCategories.forEach((row) => {
        csvContent += `${row.ministry},${row.category},${row.allocated},${row.spent},${row.remaining},${row.percentageUsed},${row.status}\n`;
      });
      break;
  }

  return new Blob([csvContent], { type: "text/csv" });
}
