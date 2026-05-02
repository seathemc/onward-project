export interface ForecastAssumptions {
  baseName: string;
  baseYear: number;
  projectYears: number;
  gdpGrowthRate: number; // annual % growth
  tourismGrowthRate: number; // annual % growth
  populationGrowthRate: number; // annual % growth
  inflationRate: number; // annual %
  tourismShareOfGDP: number; // 0-1, currently ~0.33
  financialShareOfGDP: number; // ~0.26
  constructionShareOfGDP: number; // ~0.10
  debtToGDPRatio: number; // starting debt/GDP
  debtReductionRate: number; // annual % reduction in debt/GDP
  educationSpendingShare: number; // % of GDP
  infrastructureSpendingShare: number; // % of GDP
  climateInvestmentShare: number; // % of GDP
  techSectorGrowthMultiplier: number; // multiplier on base growth
}

export interface YearProjection {
  year: number;
  gdpNominal: number; // in millions BSD
  gdpReal: number; // constant 2015 USD
  gdpGrowthRate: number; // %
  population: number;
  gdpPerCapita: number;
  sectors: {
    tourism: number;
    financial: number;
    construction: number;
    agriculture: number;
    other: number;
  };
  debt: number;
  debtToGDPRatio: number;
  spending: {
    education: number;
    infrastructure: number;
    climate: number;
    other: number;
  };
  unemploymentRate: number; // estimated
}

export interface ForecastScenario {
  id: string;
  assumptions: ForecastAssumptions;
  projections: YearProjection[];
  sensitivity: SensitivityAnalysis;
}

export interface SensitivityAnalysis {
  mostImpactful: Array<{
    variable: string;
    impactOnFinalGDP: number; // % change per 1% change in variable
    impactOnDebt: number; // % change in debt/GDP
  }>;
}

const DEFAULT_ASSUMPTIONS: ForecastAssumptions = {
  baseName: "Conservative",
  baseYear: 2024,
  projectYears: 40,
  gdpGrowthRate: 2.5,
  tourismGrowthRate: 2.0,
  populationGrowthRate: 0.5,
  inflationRate: 2.0,
  tourismShareOfGDP: 0.33,
  financialShareOfGDP: 0.26,
  constructionShareOfGDP: 0.10,
  debtToGDPRatio: 0.65,
  debtReductionRate: 1.0,
  educationSpendingShare: 0.04,
  infrastructureSpendingShare: 0.03,
  climateInvestmentShare: 0.02,
  techSectorGrowthMultiplier: 1.0,
};

export class EconomicForecastModel {
  private baseYear = 2024;
  private baseGDP = 14100; // millions BSD, from 2024 data
  private basePopulation = 405000;
  private baseDebt = 9165; // ~65% of GDP

  constructor() {}

  generateForecast(
    assumptions: Partial<ForecastAssumptions> = {}
  ): ForecastScenario {
    const finalAssumptions: ForecastAssumptions = {
      ...DEFAULT_ASSUMPTIONS,
      ...assumptions,
    };

    const projections: YearProjection[] = [];
    let currentGDP = this.baseGDP;
    let currentPopulation = this.basePopulation;
    let currentDebt = this.baseDebt;
    let currentDebtRatio = finalAssumptions.debtToGDPRatio;

    for (let i = 0; i <= finalAssumptions.projectYears; i++) {
      const year = finalAssumptions.baseYear + i;

      // GDP projection with tech multiplier
      const techBoost =
        (finalAssumptions.techSectorGrowthMultiplier - 1) * 0.005; // subtle effect
      const annualGrowthRate = finalAssumptions.gdpGrowthRate + techBoost;
      currentGDP = currentGDP * (1 + annualGrowthRate / 100);

      // Population growth
      currentPopulation =
        currentPopulation *
        (1 + finalAssumptions.populationGrowthRate / 100);

      // Debt dynamics: reduction through growth and primary surplus
      const primarySurplus = finalAssumptions.debtReductionRate / 100;
      const interestRate = currentDebtRatio * 0.04; // 4% of debt/GDP
      currentDebtRatio =
        currentDebtRatio *
          (1 + (annualGrowthRate - finalAssumptions.inflationRate) / 100) +
        interestRate -
        primarySurplus;
      currentDebtRatio = Math.max(0, currentDebtRatio);
      currentDebt = (currentDebtRatio * currentGDP) / 100;

      // Sector breakdown (with tourism growth premium)
      const tourismMultiplier =
        1 + (finalAssumptions.tourismGrowthRate - annualGrowthRate) / 100;
      const tourism = currentGDP * finalAssumptions.tourismShareOfGDP * tourismMultiplier;
      const financial = currentGDP * finalAssumptions.financialShareOfGDP;
      const construction = currentGDP * finalAssumptions.constructionShareOfGDP;
      const agriculture = currentGDP * 0.04; // fixed
      const other =
        currentGDP -
        tourism -
        financial -
        construction -
        agriculture;

      // Government spending as share of GDP
      const education = currentGDP * finalAssumptions.educationSpendingShare;
      const infrastructure =
        currentGDP * finalAssumptions.infrastructureSpendingShare;
      const climate = currentGDP * finalAssumptions.climateInvestmentShare;
      const otherSpending =
        currentGDP * 0.15 -
        education -
        infrastructure -
        climate;

      // Unemployment rate: decreases with growth above 2.5%, increases with contraction
      const baseUnemployment = 10;
      const growthEffect =
        (annualGrowthRate - 2.5) * 0.5; // -0.5% unemployment per 1% growth above 2.5%
      const unemploymentRate = Math.max(5, baseUnemployment - growthEffect);

      projections.push({
        year,
        gdpNominal: Math.round(currentGDP),
        gdpReal: Math.round(
          currentGDP / Math.pow(1 + finalAssumptions.inflationRate / 100, i)
        ),
        gdpGrowthRate: annualGrowthRate,
        population: Math.round(currentPopulation),
        gdpPerCapita: Math.round(currentGDP / (currentPopulation / 1000000)),
        sectors: {
          tourism: Math.round(tourism),
          financial: Math.round(financial),
          construction: Math.round(construction),
          agriculture: Math.round(agriculture),
          other: Math.round(other),
        },
        debt: Math.round(currentDebt),
        debtToGDPRatio: Number(currentDebtRatio.toFixed(2)),
        spending: {
          education: Math.round(education),
          infrastructure: Math.round(infrastructure),
          climate: Math.round(climate),
          other: Math.round(otherSpending),
        },
        unemploymentRate: Number(unemploymentRate.toFixed(1)),
      });
    }

    const sensitivity = this.calculateSensitivity(
      finalAssumptions,
      projections
    );

    return {
      id: this.generateScenarioId(finalAssumptions.baseName),
      assumptions: finalAssumptions,
      projections,
      sensitivity,
    };
  }

  private calculateSensitivity(
    assumptions: ForecastAssumptions,
    baseProjections: YearProjection[]
  ): SensitivityAnalysis {
    // Simplified sensitivity: estimate elasticity based on economic theory
    // rather than re-running full forecasts (which causes recursion)

    const variables = [
      {
        name: "GDP Growth Rate",
        baseElasticity: 1.2, // 1% higher growth → 1.2% higher final GDP
        debtElasticity: -0.8, // lower debt
      },
      {
        name: "Tourism Growth",
        baseElasticity: 0.33, // tourism is 33% of GDP
        debtElasticity: -0.3,
      },
      {
        name: "Debt Reduction",
        baseElasticity: -0.15, // debt reduction doesn't directly increase GDP much
        debtElasticity: -1.0, // but it does reduce debt/GDP
      },
      {
        name: "Education Spending",
        baseElasticity: 0.5, // education has medium-term growth impact
        debtElasticity: 0.2, // increases debt in short term
      },
    ];

    const sensitivity: SensitivityAnalysis = {
      mostImpactful: variables
        .map((v) => ({
          variable: v.name,
          impactOnFinalGDP: v.baseElasticity,
          impactOnDebt: v.debtElasticity,
        }))
        .sort(
          (a, b) =>
            Math.abs(b.impactOnFinalGDP) - Math.abs(a.impactOnFinalGDP)
        ),
    };

    return sensitivity;
  }

  private generateScenarioId(baseName: string): string {
    return `scenario_${baseName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
  }

  // Pre-built scenarios
  static SCENARIOS = {
    conservative: (): ForecastAssumptions => ({
      ...DEFAULT_ASSUMPTIONS,
      baseName: "Conservative",
      gdpGrowthRate: 2.0,
      tourismGrowthRate: 1.5,
      debtReductionRate: 0.8,
    }),
    moderate: (): ForecastAssumptions => ({
      ...DEFAULT_ASSUMPTIONS,
      baseName: "Moderate",
      gdpGrowthRate: 3.0,
      tourismGrowthRate: 2.5,
      debtReductionRate: 1.2,
      techSectorGrowthMultiplier: 1.1,
    }),
    optimistic: (): ForecastAssumptions => ({
      ...DEFAULT_ASSUMPTIONS,
      baseName: "Optimistic",
      gdpGrowthRate: 3.5,
      tourismGrowthRate: 3.5,
      debtReductionRate: 1.5,
      educationSpendingShare: 0.05,
      infrastructureSpendingShare: 0.04,
      techSectorGrowthMultiplier: 1.2,
    }),
  };
}
