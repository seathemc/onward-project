import { ForecastAssumptions } from "./model";

/**
 * Political party economic scenarios based on PLP and FNM 2026 campaign platforms
 */

export const POLITICAL_SCENARIOS = {
  // Current PLP government platform - Blueprint for Progress
  plpBlueprint: (): ForecastAssumptions => ({
    baseName: "PLP Blueprint for Progress",
    baseYear: 2024,
    projectYears: 40,
    gdpGrowthRate: 2.8, // Moderate growth with fiscal consolidation
    tourismGrowthRate: 2.2, // Steady tourism recovery
    populationGrowthRate: 0.5,
    inflationRate: 2.0,
    tourismShareOfGDP: 0.33,
    financialShareOfGDP: 0.26,
    constructionShareOfGDP: 0.10,
    debtToGDPRatio: 0.65, // Focus on debt reduction (down from 10% deficit in 2020)
    debtReductionRate: 1.5, // Strong fiscal consolidation
    educationSpendingShare: 0.045, // Education transformation priority
    infrastructureSpendingShare: 0.035, // Island development
    climateInvestmentShare: 0.025, // Climate resilience
    techSectorGrowthMultiplier: 1.15, // Digital government transformation
  }),

  // FNM opposition platform - A Better Bahamas for All
  fnmBetterBahamas: (): ForecastAssumptions => ({
    baseName: "FNM Better Bahamas for All",
    baseYear: 2024,
    projectYears: 40,
    gdpGrowthRate: 3.2, // Higher growth from business investment and tax cuts
    tourismGrowthRate: 2.8, // More aggressive tourism expansion
    populationGrowthRate: 0.5,
    inflationRate: 2.5, // Slight inflation from stimulus
    tourismShareOfGDP: 0.33,
    financialShareOfGDP: 0.26,
    constructionShareOfGDP: 0.12, // More construction from business investment
    debtToGDPRatio: 0.70, // Higher debt from tax cuts and spending
    debtReductionRate: 0.5, // Slower debt reduction with deficit spending
    educationSpendingShare: 0.05, // Early years education investment
    infrastructureSpendingShare: 0.04, // Infrastructure for entrepreneurs
    climateInvestmentShare: 0.02, // Standard climate spending
    techSectorGrowthMultiplier: 1.1, // Tech growth from entrepreneurship program
  }),

  // Balanced coalition scenario combining both approaches
  coalitionConsensus: (): ForecastAssumptions => ({
    baseName: "Coalition Consensus",
    baseYear: 2024,
    projectYears: 40,
    gdpGrowthRate: 3.0, // Balanced growth
    tourismGrowthRate: 2.5, // Balanced tourism growth
    populationGrowthRate: 0.5,
    inflationRate: 2.1,
    tourismShareOfGDP: 0.33,
    financialShareOfGDP: 0.26,
    constructionShareOfGDP: 0.11, // Moderate construction growth
    debtToGDPRatio: 0.65, // Target balanced budget
    debtReductionRate: 1.0, // Steady debt reduction
    educationSpendingShare: 0.045, // Education focus
    infrastructureSpendingShare: 0.035, // Balanced infrastructure
    climateInvestmentShare: 0.025, // Climate investment
    techSectorGrowthMultiplier: 1.12, // Tech growth
  }),
};

/**
 * Scenario descriptions with policy details
 */
export const SCENARIO_DETAILS = {
  plpBlueprint: {
    title: "PLP Blueprint for Progress",
    shortDescription: "Fiscal consolidation with quality healthcare and digital transformation",
    policies: [
      "Debt reduction from 1.3% deficit (2024) - continued fiscal consolidation",
      "Healthcare expansion with 24-hour mental health services",
      "Digital government integration (MyGateway platform)",
      "Education system transformation",
      "Island development focused on Family Islands",
      "Moody's positive sovereign outlook achievement",
    ],
    economicFocus: "Macroeconomic stability and quality of life improvements",
    riskFactors: [
      "Slower near-term growth from fiscal restraint",
      "Dependent on continued commodity prices and tourism recovery",
    ],
    strengths: [
      "Strongest debt sustainability path",
      "Improved sovereign rating = lower borrowing costs",
      "Sustainable long-term growth model",
      "Quality healthcare reduces population outmigration",
    ],
  },

  fnmBetterBahamas: {
    title: "FNM Better Bahamas for All",
    shortDescription: "Business-focused growth through tax cuts and entrepreneurship investment",
    policies: [
      "VAT and duty removal on healthy foods and essential medicines",
      "$100M entrepreneurship investment fund",
      "Tax cuts for ordinary people",
      "Healthcare expansion: 100 new doctors + 200 new nurses",
      "$200/month child support for first 2 years",
      "Crime reduction (10-Point Crime Plan)",
      "Freedom of Information Act implementation",
    ],
    economicFocus: "Rapid business expansion and private sector growth",
    riskFactors: [
      "Higher debt accumulation from tax cuts",
      "Inflation risk from stimulus measures",
      "Sustainability questions on spending programs",
    ],
    strengths: [
      "Higher near-term GDP growth (3.2%)",
      "Direct business incentives attract entrepreneurs",
      "Improved living standards through immediate assistance",
      "Lower cost of living from VAT/duty reductions",
    ],
  },

  coalitionConsensus: {
    title: "Coalition Consensus",
    shortDescription: "Balanced approach combining fiscal responsibility with growth incentives",
    policies: [
      "Balanced fiscal approach (neither aggressive cuts nor large deficits)",
      "Healthcare improvements with measured expansion",
      "Business support with fiscal constraints",
      "Education and infrastructure investment",
      "Gradual debt reduction",
      "Climate resilience and digital transformation",
    ],
    economicFocus: "Sustainable growth with managed public investment",
    riskFactors: [
      "May lack boldness to address structural challenges",
      "Compromise could reduce effectiveness of individual policies",
    ],
    strengths: [
      "Lowest economic volatility",
      "Balanced debt trajectory",
      "Maintains investor confidence",
      "Combines growth with stability",
    ],
  },
};
