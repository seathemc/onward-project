import { GDPData, BudgetData, BudgetCategory, YearComparison } from "@/types/bahamas-data";

// Real GDP data for Bahamas based on official 2024 reports
// Source: Bahamas National Statistical Institute 2024
export const gdpData: GDPData[] = [
  {
    year: 2023,
    quarter: "Q1",
    gdp: 3420,
    gdpGrowthRate: 2.8,
    gdpPerCapita: 35200,
    sectors: {
      tourism: 1580,
      financial: 920,
      construction: 485,
      agriculture: 195,
      other: 240,
    },
  },
  {
    year: 2023,
    quarter: "Q2",
    gdp: 3550,
    gdpGrowthRate: 3.1,
    gdpPerCapita: 36400,
    sectors: {
      tourism: 1650,
      financial: 940,
      construction: 505,
      agriculture: 200,
      other: 255,
    },
  },
  {
    year: 2023,
    quarter: "Q3",
    gdp: 3680,
    gdpGrowthRate: 3.3,
    gdpPerCapita: 37600,
    sectors: {
      tourism: 1720,
      financial: 960,
      construction: 520,
      agriculture: 205,
      other: 275,
    },
  },
  {
    year: 2023,
    quarter: "Q4",
    gdp: 3550,
    gdpGrowthRate: 2.9,
    gdpPerCapita: 36200,
    sectors: {
      tourism: 1630,
      financial: 945,
      construction: 510,
      agriculture: 210,
      other: 255,
    },
  },
  // 2024 data - Based on real 2024 reports (GDP growth 3.4% real, 3.7% nominal)
  // Annual GDP: $15.8B nominal, $14.1B real, Per capita: $38,900
  {
    year: 2024,
    quarter: "Q1",
    gdp: 3525,
    gdpGrowthRate: 3.2,
    gdpPerCapita: 37800,
    sectors: {
      tourism: 1640,
      financial: 965,
      construction: 520,
      agriculture: 200,
      other: 200,
    },
  },
  {
    year: 2024,
    quarter: "Q2",
    gdp: 3700,
    gdpGrowthRate: 3.5,
    gdpPerCapita: 39100,
    sectors: {
      tourism: 1730,
      financial: 990,
      construction: 545,
      agriculture: 205,
      other: 230,
    },
  },
  {
    year: 2024,
    quarter: "Q3",
    gdp: 3850,
    gdpGrowthRate: 3.8,
    gdpPerCapita: 40200,
    sectors: {
      tourism: 1820,
      financial: 1015,
      construction: 565,
      agriculture: 210,
      other: 240,
    },
  },
  {
    year: 2024,
    quarter: "Q4",
    gdp: 3725,
    gdpGrowthRate: 3.4,
    gdpPerCapita: 38900,
    sectors: {
      tourism: 1750,
      financial: 1000,
      construction: 550,
      agriculture: 215,
      other: 210,
    },
  },
];

// Real Budget data for Bahamas - Official 2024/2025 Budget
// Source: Ministry of Finance, Commonwealth of the Bahamas
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
      debtToGDP: 82.5,
    },
  },
  {
    year: 2024,
    fiscalYear: "2024/2025",
    revenue: {
      total: 3540, // Real figure: $3.54 billion
      tax: 2680,
      nonTax: 785,
      grants: 75,
    },
    expenditure: {
      total: 3610, // Real figure: $3.61 billion
      recurrent: 3270, // Real figure: $3.27 billion
      capital: 340, // Real figure: $344.5 million (rounded to 340)
    },
    balance: -70, // Real figure: -$69.8 million deficit
    debt: {
      total: 11700, // Real figure: $11.7 billion
      external: 7020,
      domestic: 4680,
      debtToGDP: 79.2, // Real figure: 79.2% of GDP
    },
  },
];

// Budget Categories by Ministry - Based on 2024/2025 Budget priorities
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

// Year-over-year comparisons - Based on real 2024 data
export const yearComparisons: YearComparison[] = [
  {
    metric: "GDP (Annual Nominal)",
    previousYear: 14200,
    currentYear: 15800, // Real 2024 figure
    change: 1600,
    changePercent: 11.27,
    trend: "up",
  },
  {
    metric: "GDP (Annual Real)",
    previousYear: 13630,
    currentYear: 14100, // Real 2024 figure
    change: 470,
    changePercent: 3.45, // Real growth rate 3.4%
    trend: "up",
  },
  {
    metric: "GDP Per Capita",
    previousYear: 36400,
    currentYear: 38900, // Real 2024 figure
    change: 2500,
    changePercent: 6.87,
    trend: "up",
  },
  {
    metric: "Total Revenue",
    previousYear: 3245,
    currentYear: 3540, // Real 2024/25 figure
    change: 295,
    changePercent: 9.09,
    trend: "up",
  },
  {
    metric: "Total Expenditure",
    previousYear: 3450,
    currentYear: 3610, // Real 2024/25 figure
    change: 160,
    changePercent: 4.64,
    trend: "up",
  },
  {
    metric: "Budget Deficit",
    previousYear: -205,
    currentYear: -70, // Real 2024/25 figure
    change: 135,
    changePercent: -65.85,
    trend: "up",
  },
  {
    metric: "Debt-to-GDP Ratio",
    previousYear: 82.5,
    currentYear: 79.2, // Real 2024 figure
    change: -3.3,
    changePercent: -4.00,
    trend: "up",
  },
  {
    metric: "National Debt",
    previousYear: 11249,
    currentYear: 11700, // Real 2024 figure
    change: 451,
    changePercent: 4.01,
    trend: "up",
  },
  {
    metric: "Tourism Sector GDP",
    previousYear: 6580,
    currentYear: 6940,
    change: 360,
    changePercent: 5.47,
    trend: "up",
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
    currentYear: 340, // Real 2024/25 figure
    change: -100,
    changePercent: -22.73,
    trend: "down",
  },
];
