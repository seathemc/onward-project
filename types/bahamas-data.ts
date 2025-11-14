export interface GDPData {
  year: number;
  quarter?: string;
  gdp: number; // in millions BSD
  gdpGrowthRate: number; // percentage
  gdpPerCapita: number; // in BSD
  sectors: {
    tourism: number;
    financial: number;
    construction: number;
    agriculture: number;
    other: number;
  };
}

export interface BudgetData {
  year: number;
  fiscalYear: string; // e.g., "2024/2025"
  revenue: {
    total: number; // in millions BSD
    tax: number;
    nonTax: number;
    grants: number;
  };
  expenditure: {
    total: number; // in millions BSD
    recurrent: number;
    capital: number;
  };
  balance: number; // surplus/deficit
  debt: {
    total: number;
    external: number;
    domestic: number;
    debtToGDP: number; // percentage
  };
}

export interface BudgetCategory {
  id: string;
  category: string;
  ministry: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: 'on-track' | 'over-budget' | 'under-utilized';
}

export interface YearComparison {
  metric: string;
  previousYear: number;
  currentYear: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}
