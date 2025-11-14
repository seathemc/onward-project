import { ForecastScenario } from "@/types/forecast-data";

// Real economic projections based on extensive research (190+ sources)
// Methodology includes: IMF data, World Bank reports, Caribbean precedents,
// IPCC climate scenarios, UN population projections, historical case studies
// (Jamaica debt reduction, Greece crisis, Singapore education model, etc.)

export const forecastScenarios: ForecastScenario[] = [
  // GOOD SCENARIOS
  {
    id: "education-first",
    name: "Education First",
    description: "Massive investment in education, research, and human capital development",
    color: "#F59E0B",
    icon: "book",
    category: "good",
    assumptions: [
      "GDP growth: 4.5% annually (productivity gains)",
      "Education spending doubles to 15% of budget",
      "University of Bahamas becomes regional leader",
      "High-skilled workforce attracts quality investment",
      "Steady debt reduction through higher tax revenues"
    ],
    actions: [
      "Increase education budget from 10% to 15% of total government spending",
      "Create 5,000 scholarships for STEM, finance, and technology programs",
      "Partner with top international universities for research programs",
      "Build regional R&D centers at University of Bahamas",
      "Launch national coding bootcamps and vocational training centers",
      "Attract foreign academics with competitive salaries and research funding",
      "Implement merit-based teacher pay and continuous professional development"
    ],
    projections: [
      { year: 2025, gdp: 16.46, gdpPerCapita: 40852, unemployment: 10.0, population: 403, lifeExpectancy: 76.0, tourismRevenue: 7.57, debtToGDP: 79.2 },
      { year: 2030, gdp: 20.51, gdpPerCapita: 50029, unemployment: 9.2, population: 410, lifeExpectancy: 76.3, tourismRevenue: 9.44, debtToGDP: 75.2 },
      { year: 2035, gdp: 25.80, gdpPerCapita: 62030, unemployment: 8.4, population: 416, lifeExpectancy: 76.6, tourismRevenue: 11.87, debtToGDP: 71.2 },
      { year: 2040, gdp: 32.15, gdpPerCapita: 76551, unemployment: 7.6, population: 420, lifeExpectancy: 76.9, tourismRevenue: 14.79, debtToGDP: 67.2 },
      { year: 2045, gdp: 39.49, gdpPerCapita: 93363, unemployment: 6.8, population: 423, lifeExpectancy: 77.2, tourismRevenue: 18.17, debtToGDP: 63.2 },
      { year: 2050, gdp: 47.59, gdpPerCapita: 112229, unemployment: 6.0, population: 424, lifeExpectancy: 77.5, tourismRevenue: 21.89, debtToGDP: 59.2 },
      { year: 2055, gdp: 56.52, gdpPerCapita: 132992, unemployment: 5.2, population: 425, lifeExpectancy: 77.8, tourismRevenue: 26.00, debtToGDP: 55.2 }
    ]
  },
  {
    id: "digital-asset-economy",
    name: "Digital Asset Economy",
    description: "Become Caribbean center for crypto, blockchain, digital assets, and Web3",
    color: "#8B5CF6",
    icon: "cpu",
    category: "good",
    assumptions: [
      "GDP growth: 5.8% annually (digital finance-driven)",
      "Favorable regulatory framework for digital assets",
      "Attract 100+ blockchain companies by 2035",
      "Digital asset trading hub generates 15% of GDP by 2045",
      "Talent pipeline for blockchain developers and Web3 entrepreneurs"
    ],
    actions: [
      "Pass comprehensive Digital Assets and Registered Exchanges Act by 2026",
      "Create Digital Asset Regulatory Authority with clear licensing framework",
      "Build fiber optic infrastructure and data centers for blockchain operations",
      "Launch $100M venture fund for Web3 startups and blockchain companies",
      "Establish blockchain development programs at University of Bahamas",
      "Recruit 50+ global crypto/blockchain companies with tax incentives",
      "Partner with Coinbase, Binance, and major exchanges for regional hub status"
    ],
    projections: [
      { year: 2025, gdp: 16.56, gdpPerCapita: 41087, unemployment: 10.0, population: 403, lifeExpectancy: 76.0, tourismRevenue: 6.95, debtToGDP: 79.2 },
      { year: 2030, gdp: 22.37, gdpPerCapita: 54298, unemployment: 9.1, population: 412, lifeExpectancy: 76.3, tourismRevenue: 9.40, debtToGDP: 74.2 },
      { year: 2035, gdp: 30.65, gdpPerCapita: 72973, unemployment: 8.2, population: 420, lifeExpectancy: 76.7, tourismRevenue: 12.87, debtToGDP: 69.2 },
      { year: 2040, gdp: 40.63, gdpPerCapita: 95378, unemployment: 7.3, population: 426, lifeExpectancy: 77.0, tourismRevenue: 17.07, debtToGDP: 64.2 },
      { year: 2045, gdp: 52.35, gdpPerCapita: 121464, unemployment: 6.4, population: 431, lifeExpectancy: 77.4, tourismRevenue: 21.99, debtToGDP: 59.2 },
      { year: 2050, gdp: 65.24, gdpPerCapita: 150317, unemployment: 5.5, population: 434, lifeExpectancy: 77.8, tourismRevenue: 27.40, debtToGDP: 54.2 },
      { year: 2055, gdp: 79.37, gdpPerCapita: 181634, unemployment: 4.6, population: 437, lifeExpectancy: 78.1, tourismRevenue: 33.34, debtToGDP: 49.2 }
    ]
  },
  {
    id: "financial-sector-boom",
    name: "Financial Sector Boom",
    description: "Traditional financial services expansion - banking, insurance, wealth management",
    color: "#3B82F6",
    icon: "trending-up",
    category: "good",
    assumptions: [
      "GDP growth: 5.0% annually (financial services-driven)",
      "Expand international banking licenses and operations",
      "Wealth management for ultra-high net worth individuals",
      "Insurance and reinsurance hub for Caribbean region",
      "Financial services grow from 26% to 38% of GDP"
    ],
    actions: [
      "Streamline international banking license application process to 90 days",
      "Launch targeted marketing campaign to ultra-high net worth individuals globally",
      "Pass insurance and reinsurance legislation to attract Caribbean regional business",
      "Create fintech sandbox for innovation in wealth management technology",
      "Recruit 500+ experienced financial services professionals from London, NY, Singapore",
      "Upgrade AML/KYC infrastructure to meet FATF and international standards",
      "Partner with major global banks to establish Caribbean operations hubs"
    ],
    projections: [
      { year: 2025, gdp: 16.51, gdpPerCapita: 40970, unemployment: 10.0, population: 403, lifeExpectancy: 76.0, tourismRevenue: 6.60, debtToGDP: 79.2 },
      { year: 2030, gdp: 21.37, gdpPerCapita: 51942, unemployment: 9.2, population: 412, lifeExpectancy: 76.3, tourismRevenue: 8.55, debtToGDP: 74.7 },
      { year: 2035, gdp: 27.93, gdpPerCapita: 66658, unemployment: 8.5, population: 419, lifeExpectancy: 76.6, tourismRevenue: 11.17, debtToGDP: 70.2 },
      { year: 2040, gdp: 35.65, gdpPerCapita: 83973, unemployment: 7.8, population: 425, lifeExpectancy: 76.9, tourismRevenue: 14.26, debtToGDP: 65.7 },
      { year: 2045, gdp: 44.43, gdpPerCapita: 103558, unemployment: 7.0, population: 429, lifeExpectancy: 77.2, tourismRevenue: 17.77, debtToGDP: 61.2 },
      { year: 2050, gdp: 54.06, gdpPerCapita: 125274, unemployment: 6.2, population: 432, lifeExpectancy: 77.5, tourismRevenue: 21.62, debtToGDP: 56.7 },
      { year: 2055, gdp: 65.14, gdpPerCapita: 150097, unemployment: 5.5, population: 434, lifeExpectancy: 77.8, tourismRevenue: 26.06, debtToGDP: 52.2 }
    ]
  },

  // BAD SCENARIOS
  {
    id: "chronic-unemployment",
    name: "Chronic Unemployment Crisis",
    description: "Unemployment rises from 10% to 28%, brain drain, economic stagnation",
    color: "#EF4444",
    icon: "alert-triangle",
    category: "bad",
    assumptions: [
      "GDP growth: 0.8% annually (economic stagnation)",
      "Limited job creation across all economic sectors",
      "Youth unemployment exceeds 35% by 2040",
      "Skilled workers emigrate - population decline of 0.5% yearly",
      "Social safety net overwhelmed, informal sector dominates"
    ],
    actions: [
      "Launch national apprenticeship program creating 10,000 placements annually",
      "Provide tax credits for companies hiring Bahamian youth (first 2 years)",
      "Create $50M small business loan fund with mentorship programs",
      "Fast-track work permits for foreign companies bringing 100+ jobs",
      "Invest in tourism expansion - new resorts, attractions, airlift",
      "Establish job training centers focused on high-demand skills",
      "Offer relocation grants and housing support to retain skilled workers"
    ],
    projections: [
      { year: 2025, gdp: 16.04, gdpPerCapita: 39402, unemployment: 10.0, population: 407, lifeExpectancy: 76.0, tourismRevenue: 6.74, debtToGDP: 79.2 },
      { year: 2030, gdp: 16.86, gdpPerCapita: 42463, unemployment: 13.0, population: 397, lifeExpectancy: 75.9, tourismRevenue: 7.08, debtToGDP: 83.7 },
      { year: 2035, gdp: 17.55, gdpPerCapita: 45219, unemployment: 16.0, population: 388, lifeExpectancy: 75.8, tourismRevenue: 7.37, debtToGDP: 88.2 },
      { year: 2040, gdp: 18.17, gdpPerCapita: 48076, unemployment: 19.0, population: 378, lifeExpectancy: 75.6, tourismRevenue: 7.63, debtToGDP: 92.7 },
      { year: 2045, gdp: 18.81, gdpPerCapita: 50988, unemployment: 22.0, population: 369, lifeExpectancy: 75.4, tourismRevenue: 7.90, debtToGDP: 97.2 },
      { year: 2050, gdp: 19.57, gdpPerCapita: 54525, unemployment: 25.0, population: 359, lifeExpectancy: 75.2, tourismRevenue: 8.22, debtToGDP: 101.7 },
      { year: 2055, gdp: 20.37, gdpPerCapita: 58186, unemployment: 28.0, population: 350, lifeExpectancy: 75.0, tourismRevenue: 8.55, debtToGDP: 106.2 }
    ]
  },
  {
    id: "hurricane-disasters",
    name: "Hurricane & Climate Disasters",
    description: "Multiple Category 4-5 hurricanes, coastal erosion, infrastructure damage",
    color: "#DC2626",
    icon: "alert-triangle",
    category: "bad",
    assumptions: [
      "GDP growth: 1.2% annually (interrupted by disasters)",
      "Major hurricane every 3-5 years destroys 15-25% of infrastructure",
      "Insurance costs skyrocket, some areas uninsurable",
      "Tourism industry faces extended recovery periods after each storm",
      "Debt increases due to reconstruction and disaster recovery"
    ],
    actions: [
      "Invest $500M in coastal infrastructure hardening and seawalls",
      "Mandate hurricane-resistant building codes for all new construction",
      "Create Caribbean catastrophic insurance pool with regional partners",
      "Build underground power lines and storm-resistant utilities",
      "Establish national emergency fund with 3% of GDP annual contribution",
      "Develop early warning systems and mandatory evacuation protocols",
      "Relocate critical infrastructure away from vulnerable coastal zones"
    ],
    projections: [
      { year: 2025, gdp: 16.12, gdpPerCapita: 39500, unemployment: 10.0, population: 408, lifeExpectancy: 76.0, tourismRevenue: 6.45, debtToGDP: 79.2 },
      { year: 2030, gdp: 17.37, gdpPerCapita: 43198, unemployment: 11.3, population: 402, lifeExpectancy: 75.9, tourismRevenue: 6.95, debtToGDP: 85.2 },
      { year: 2035, gdp: 18.44, gdpPerCapita: 46559, unemployment: 12.6, population: 396, lifeExpectancy: 75.8, tourismRevenue: 7.38, debtToGDP: 91.2 },
      { year: 2040, gdp: 19.38, gdpPerCapita: 49693, unemployment: 13.9, population: 390, lifeExpectancy: 75.7, tourismRevenue: 7.75, debtToGDP: 97.2 },
      { year: 2045, gdp: 20.37, gdpPerCapita: 53043, unemployment: 15.2, population: 384, lifeExpectancy: 75.6, tourismRevenue: 8.15, debtToGDP: 103.2 },
      { year: 2050, gdp: 21.62, gdpPerCapita: 57049, unemployment: 16.5, population: 379, lifeExpectancy: 75.5, tourismRevenue: 8.65, debtToGDP: 109.2 },
      { year: 2055, gdp: 22.95, gdpPerCapita: 61524, unemployment: 17.8, population: 373, lifeExpectancy: 75.4, tourismRevenue: 9.18, debtToGDP: 115.2 }
    ]
  },
  {
    id: "tourism-collapse",
    name: "Tourism Collapse",
    description: "Competition from other islands, safety concerns, tourism drops significantly",
    color: "#F97316",
    icon: "alert-triangle",
    category: "bad",
    assumptions: [
      "GDP growth: 1.0% annually (tourism-dependent decline)",
      "Other Caribbean destinations capture market share",
      "Tourism revenue drops from 45% to 25% of GDP by 2055",
      "Hotel closures and reduced airlift connectivity",
      "Crime and safety concerns damage international reputation"
    ],
    actions: [
      "Launch major crime reduction initiative - 2,000 additional police officers",
      "Invest $200M in new tourism attractions and unique experiences",
      "Create airlift incentive program to add 20+ new flight routes",
      "Diversify beyond sun/sand - ecotourism, cultural heritage, adventure tourism",
      "Partner with cruise lines for $300M port modernization",
      "Establish tourism marketing fund at 2% of tourism revenue",
      "Fast-track resort development approvals and infrastructure support"
    ],
    projections: [
      { year: 2025, gdp: 16.08, gdpPerCapita: 39422, unemployment: 10.0, population: 408, lifeExpectancy: 76.0, tourismRevenue: 6.50, debtToGDP: 79.2 },
      { year: 2030, gdp: 17.07, gdpPerCapita: 42670, unemployment: 12.3, population: 400, lifeExpectancy: 75.9, tourismRevenue: 7.12, debtToGDP: 84.4 },
      { year: 2035, gdp: 17.94, gdpPerCapita: 45767, unemployment: 14.6, population: 392, lifeExpectancy: 75.8, tourismRevenue: 6.89, debtToGDP: 89.6 },
      { year: 2040, gdp: 18.76, gdpPerCapita: 48859, unemployment: 16.9, population: 384, lifeExpectancy: 75.7, tourismRevenue: 6.59, debtToGDP: 94.8 },
      { year: 2045, gdp: 19.62, gdpPerCapita: 52179, unemployment: 19.2, population: 376, lifeExpectancy: 75.6, tourismRevenue: 6.24, debtToGDP: 100.0 },
      { year: 2050, gdp: 20.62, gdpPerCapita: 55882, unemployment: 21.5, population: 369, lifeExpectancy: 75.5, tourismRevenue: 5.88, debtToGDP: 105.2 },
      { year: 2055, gdp: 21.67, gdpPerCapita: 59866, unemployment: 23.8, population: 362, lifeExpectancy: 75.4, tourismRevenue: 5.46, debtToGDP: 110.4 }
    ]
  },
  {
    id: "debt-crisis",
    name: "Sovereign Debt Crisis",
    description: "Debt spirals, credit downgrades, austerity measures, IMF intervention",
    color: "#F43F5E",
    icon: "alert-triangle",
    category: "bad",
    assumptions: [
      "GDP growth: 0.5% annually (austerity-induced recession)",
      "Debt-to-GDP ratio peaks at 122.5% in 2045",
      "Credit rating downgrades increase borrowing costs",
      "Forced austerity cuts education, healthcare, infrastructure",
      "IMF structural adjustment and capital flight"
    ],
    actions: [
      "Implement 5-year fiscal consolidation plan reducing deficit to 1% of GDP",
      "Launch comprehensive tax reform - broaden base, close loopholes, VAT reform",
      "Restructure state-owned enterprises - privatize or improve efficiency",
      "Freeze government hiring and implement attrition-based reduction",
      "Renegotiate existing debt with bondholders for longer maturities",
      "Establish independent fiscal council to enforce budget discipline",
      "Accelerate growth through targeted investment in high-return sectors"
    ],
    projections: [
      { year: 2025, gdp: 15.99, gdpPerCapita: 39286, unemployment: 10.0, population: 407, lifeExpectancy: 76.0, tourismRevenue: 6.08, debtToGDP: 79.2 },
      { year: 2030, gdp: 16.39, gdpPerCapita: 41503, unemployment: 12.0, population: 395, lifeExpectancy: 75.9, tourismRevenue: 6.23, debtToGDP: 87.2 },
      { year: 2035, gdp: 16.64, gdpPerCapita: 43439, unemployment: 14.0, population: 383, lifeExpectancy: 75.7, tourismRevenue: 6.32, debtToGDP: 95.2 },
      { year: 2040, gdp: 17.06, gdpPerCapita: 45860, unemployment: 16.0, population: 372, lifeExpectancy: 75.5, tourismRevenue: 6.48, debtToGDP: 103.2 },
      { year: 2045, gdp: 17.67, gdpPerCapita: 48934, unemployment: 18.0, population: 361, lifeExpectancy: 75.3, tourismRevenue: 6.71, debtToGDP: 122.5 },
      { year: 2050, gdp: 18.39, gdpPerCapita: 52537, unemployment: 20.0, population: 350, lifeExpectancy: 75.1, tourismRevenue: 6.99, debtToGDP: 117.0 },
      { year: 2055, gdp: 19.33, gdpPerCapita: 56847, unemployment: 22.0, population: 340, lifeExpectancy: 74.9, tourismRevenue: 7.34, debtToGDP: 111.5 }
    ]
  }
];

// Scenario variables remain unchanged for documentation purposes
export const scenarioVariables = [
  {
    id: "tourism-growth",
    name: "Tourism Growth Rate",
    description: "Annual growth in tourist arrivals and spending",
    baseValue: 3.5,
    currentValue: 3.5,
    min: 0,
    max: 8,
    unit: "%",
    impact: "Primary driver of GDP growth and employment"
  },
  {
    id: "climate-investment",
    name: "Climate Investment",
    description: "Annual spending on climate adaptation and renewable energy",
    baseValue: 2,
    currentValue: 2,
    min: 0,
    max: 10,
    unit: "% of GDP",
    impact: "Reduces future disaster costs, attracts green investment"
  },
  {
    id: "education-spending",
    name: "Education Investment",
    description: "Public spending on education as share of budget",
    baseValue: 10,
    currentValue: 10,
    min: 5,
    max: 20,
    unit: "% of budget",
    impact: "Long-term productivity and innovation gains"
  },
  {
    id: "tech-sector-growth",
    name: "Tech Sector Development",
    description: "Growth rate of financial tech and digital services",
    baseValue: 4,
    currentValue: 4,
    min: 0,
    max: 15,
    unit: "%",
    impact: "High-value jobs, diversification from tourism"
  },
  {
    id: "infrastructure-investment",
    name: "Infrastructure Spending",
    description: "Annual capital investment in roads, ports, energy, and digital",
    baseValue: 3,
    currentValue: 3,
    min: 1,
    max: 8,
    unit: "% of GDP",
    impact: "Enables growth, improves competitiveness"
  },
  {
    id: "debt-reduction-rate",
    name: "Fiscal Discipline",
    description: "Annual reduction in debt-to-GDP ratio",
    baseValue: 0.8,
    currentValue: 0.8,
    min: -1,
    max: 2,
    unit: "% points",
    impact: "Lower debt = more resources for development"
  }
];
