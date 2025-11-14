export interface ForecastScenario {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  category: "good" | "bad";
  assumptions: string[];
  actions: string[]; // For good: what to do to achieve; for bad: what to do to prevent
  projections: YearProjection[];
}

export interface YearProjection {
  year: number;
  gdp: number; // billions BSD
  gdpPerCapita: number; // BSD
  unemployment: number; // percentage
  population: number; // thousands
  lifeExpectancy: number; // years
  tourismRevenue: number; // billions BSD
  debtToGDP: number; // percentage
}

export interface ScenarioVariable {
  id: string;
  name: string;
  description: string;
  baseValue: number;
  currentValue: number;
  min: number;
  max: number;
  unit: string;
  impact: string;
}
