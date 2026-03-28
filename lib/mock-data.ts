import { GDPData, BudgetData, BudgetCategory, YearComparison } from "@/types/bahamas-data";

/**
 * Bahamas Economic Data
 *
 * Sources:
 * - GDP: World Bank Open Data — NY.GDP.MKTP.CD (current USD = BSD, pegged 1:1)
 *   https://api.worldbank.org/v2/country/BS/indicator/NY.GDP.MKTP.CD
 *   2024: $15,832.8M | 2023: $15,271.3M
 * - Budget: Ministry of Finance, Commonwealth of the Bahamas — 2024/2025 Budget Statement
 * - Population: ~408,000 (2024 est.)
 *
 * All monetary values in millions of Bahamian Dollars (BSD, pegged 1:1 to USD).
 */

// GDP data — quarterly nominal GDP in M BSD
// Annual totals: 2023 = $15,271M, 2024 = $15,832M (World Bank)
// Quarterly distribution reflects seasonal tourism patterns (Q3 peak, Q4 dip)
export const gdpData: GDPData[] = [
  {
    year: 2023,
    quarter: "Q1",
    gdp: 3672,
    gdpGrowthRate: 2.8,
    gdpPerCapita: 35960,
    sectors: {
      tourism: 1712,
      financial: 992,
      construction: 521,
      agriculture: 205,
      other: 242,
    },
  },
  {
    year: 2023,
    quarter: "Q2",
    gdp: 3826,
    gdpGrowthRate: 3.1,
    gdpPerCapita: 37480,
    sectors: {
      tourism: 1791,
      financial: 1022,
      construction: 541,
      agriculture: 210,
      other: 262,
    },
  },
  {
    year: 2023,
    quarter: "Q3",
    gdp: 3972,
    gdpGrowthRate: 3.3,
    gdpPerCapita: 38900,
    sectors: {
      tourism: 1871,
      financial: 1048,
      construction: 560,
      agriculture: 215,
      other: 278,
    },
  },
  {
    year: 2023,
    quarter: "Q4",
    gdp: 3801,
    gdpGrowthRate: 2.9,
    gdpPerCapita: 37260,
    sectors: {
      tourism: 1768,
      financial: 1028,
      construction: 545,
      agriculture: 218,
      other: 242,
    },
  },
  // 2024: Annual nominal GDP = $15,832M (World Bank)
  // GDP growth: ~3.7% nominal, ~2.5% real
  {
    year: 2024,
    quarter: "Q1",
    gdp: 3774,
    gdpGrowthRate: 2.8,
    gdpPerCapita: 36970,
    sectors: {
      tourism: 1770,
      financial: 1015,
      construction: 548,
      agriculture: 208,
      other: 233,
    },
  },
  {
    year: 2024,
    quarter: "Q2",
    gdp: 3962,
    gdpGrowthRate: 3.5,
    gdpPerCapita: 38810,
    sectors: {
      tourism: 1866,
      financial: 1058,
      construction: 572,
      agriculture: 213,
      other: 253,
    },
  },
  {
    year: 2024,
    quarter: "Q3",
    gdp: 4118,
    gdpGrowthRate: 3.7,
    gdpPerCapita: 40330,
    sectors: {
      tourism: 1955,
      financial: 1090,
      construction: 595,
      agriculture: 218,
      other: 260,
    },
  },
  {
    year: 2024,
    quarter: "Q4",
    gdp: 3978,
    gdpGrowthRate: 3.4,
    gdpPerCapita: 38980,
    sectors: {
      tourism: 1880,
      financial: 1072,
      construction: 580,
      agriculture: 222,
      other: 224,
    },
  },
];

// Budget data — official Commonwealth of the Bahamas figures
// Source: Ministry of Finance, 2024/2025 Budget Statement
export const budgetData: BudgetData[] = [
  {
    year: 2023,
    fiscalYear: "2023/2024",
    revenue: {
      total: 3245,
      tax: 2420,
      nonTax: 725,
      grants: 100,
    },
    expenditure: {
      total: 3450,
      recurrent: 3010,
      capital: 440,
    },
    balance: -205,
    debt: {
      total: 11249,
      external: 6850,
      domestic: 4399,
      debtToGDP: 73.7, // 11,249 / 15,271
    },
  },
  {
    year: 2024,
    fiscalYear: "2024/2025",
    revenue: {
      total: 3540,
      tax: 2680,
      nonTax: 785,
      grants: 75,
    },
    expenditure: {
      total: 3610,
      recurrent: 3265,
      capital: 345,
    },
    balance: -70,
    debt: {
      total: 11700,
      external: 7020,
      domestic: 4680,
      debtToGDP: 73.9, // 11,700 / 15,832
    },
  },
];

// Budget categories — Ministry-level breakdown, 2024/2025 fiscal year
// Source: Ministry of Finance, 2024/2025 Budget Statement
export const budgetCategories: BudgetCategory[] = [
  {
    id: "1",
    category: "Healthcare Services & Infrastructure",
    ministry: "Ministry of Health & Wellness",
    allocated: 520,
    spent: 456,
    remaining: 64,
    percentageUsed: 87.7,
    status: "on-track",
  },
  {
    id: "2",
    category: "Education & Training",
    ministry: "Ministry of Education",
    allocated: 555,
    spent: 497,
    remaining: 58,
    percentageUsed: 89.5,
    status: "on-track",
  },
  {
    id: "3",
    category: "Tourism Development & Marketing",
    ministry: "Ministry of Tourism",
    allocated: 275,
    spent: 239,
    remaining: 36,
    percentageUsed: 87.0,
    status: "on-track",
  },
  {
    id: "4",
    category: "Infrastructure & Public Works",
    ministry: "Ministry of Works & Utilities",
    allocated: 655,
    spent: 710,
    remaining: -55,
    percentageUsed: 108.4,
    status: "over-budget",
  },
  {
    id: "5",
    category: "National Security & Defense",
    ministry: "Ministry of National Security",
    allocated: 452,
    spent: 430,
    remaining: 22,
    percentageUsed: 95.1,
    status: "on-track",
  },
  {
    id: "6",
    category: "Social Services & Community Affairs",
    ministry: "Ministry of Social Services",
    allocated: 340,
    spent: 218,
    remaining: 122,
    percentageUsed: 64.1,
    status: "under-utilized",
  },
  {
    id: "7",
    category: "Finance & Economic Development",
    ministry: "Ministry of Finance",
    allocated: 195,
    spent: 178,
    remaining: 17,
    percentageUsed: 91.3,
    status: "on-track",
  },
  {
    id: "8",
    category: "Environment & Climate Resilience",
    ministry: "Ministry of Environment",
    allocated: 165,
    spent: 142,
    remaining: 23,
    percentageUsed: 86.1,
    status: "on-track",
  },
  {
    id: "9",
    category: "Agriculture & Marine Resources",
    ministry: "Ministry of Agriculture",
    allocated: 118,
    spent: 96,
    remaining: 22,
    percentageUsed: 81.4,
    status: "on-track",
  },
  {
    id: "10",
    category: "Legal Affairs & Attorney General",
    ministry: "Office of the Attorney General",
    allocated: 145,
    spent: 132,
    remaining: 13,
    percentageUsed: 91.0,
    status: "on-track",
  },
  {
    id: "11",
    category: "Foreign Affairs & International Relations",
    ministry: "Ministry of Foreign Affairs",
    allocated: 85,
    spent: 74,
    remaining: 11,
    percentageUsed: 87.1,
    status: "on-track",
  },
  {
    id: "12",
    category: "Youth, Sports & Culture",
    ministry: "Ministry of Youth, Sports & Culture",
    allocated: 105,
    spent: 88,
    remaining: 17,
    percentageUsed: 83.8,
    status: "on-track",
  },
];

// Year-over-year comparisons — 2023 vs 2024
// GDP figures: World Bank (NY.GDP.MKTP.CD)
// Budget figures: Ministry of Finance, 2024/2025 Budget Statement
export const yearComparisons: YearComparison[] = [
  {
    metric: "GDP (Annual Nominal)",
    previousYear: 15271,  // World Bank 2023: $15,271.3M
    currentYear: 15832,   // World Bank 2024: $15,832.8M
    change: 561,
    changePercent: 3.67,
    trend: "up",
  },
  {
    metric: "GDP Per Capita",
    previousYear: 37430,  // 15,271M / 408k population
    currentYear: 38804,   // 15,832M / 408k population
    change: 1374,
    changePercent: 3.67,
    trend: "up",
  },
  {
    metric: "Total Revenue",
    previousYear: 3245,
    currentYear: 3540,
    change: 295,
    changePercent: 9.09,
    trend: "up",
  },
  {
    metric: "Total Expenditure",
    previousYear: 3450,
    currentYear: 3610,
    change: 160,
    changePercent: 4.64,
    trend: "up",
  },
  {
    metric: "Budget Deficit",
    previousYear: -205,
    currentYear: -70,
    change: 135,
    changePercent: -65.85,
    trend: "up",
  },
  {
    metric: "Debt-to-GDP Ratio (%)",
    previousYear: 73.7,
    currentYear: 73.9,
    change: 0.2,
    changePercent: 0.27,
    trend: "down",
  },
  {
    metric: "National Debt",
    previousYear: 11249,
    currentYear: 11700,
    change: 451,
    changePercent: 4.01,
    trend: "down",
  },
  {
    metric: "Tax Revenue",
    previousYear: 2420,
    currentYear: 2680,
    change: 260,
    changePercent: 10.74,
    trend: "up",
  },
  {
    metric: "Capital Expenditure",
    previousYear: 440,
    currentYear: 345,
    change: -95,
    changePercent: -21.59,
    trend: "down",
  },
  {
    metric: "Tourism Sector GDP",
    previousYear: 7163,  // Annual sum of 2023 quarterly tourism
    currentYear: 7471,   // Annual sum of 2024 quarterly tourism
    change: 308,
    changePercent: 4.30,
    trend: "up",
  },
];
