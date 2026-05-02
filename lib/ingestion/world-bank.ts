// World Bank Open Data API — Bahamas (country code: BS)
// Documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/898590

const WB_BASE = "https://api.worldbank.org/v2";
const COUNTRY = "BS";
const MRV = 10; // most recent values count

export interface WorldBankRecord {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

async function fetchIndicator(indicator: string): Promise<WorldBankRecord[]> {
  const url = `${WB_BASE}/country/${COUNTRY}/indicator/${indicator}?format=json&mrv=${MRV}&per_page=50`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`World Bank API error: ${res.status} for ${indicator}`);
  const json = await res.json();
  // World Bank returns [metadata, data]
  const data: WorldBankRecord[] = json[1] ?? [];
  return data.filter((r) => r.value !== null);
}

export interface WorldBankSnapshot {
  fetchedAt: string;
  gdpAnnual: Record<number, number>;         // year -> GDP in current USD
  gdpGrowth: Record<number, number>;         // year -> % growth
  gdpPerCapita: Record<number, number>;      // year -> GDP per capita USD
  population: Record<number, number>;        // year -> total population
  tourismReceiptsUSD: Record<number, number>; // year -> tourism receipts USD
  tourismArrivals: Record<number, number>;   // year -> international arrivals
}

export async function fetchWorldBankData(): Promise<WorldBankSnapshot> {
  const [gdpRaw, growthRaw, perCapitaRaw, popRaw, tourismRaw, arrivalsRaw] = await Promise.all([
    fetchIndicator("NY.GDP.MKTP.CD"),  // GDP current USD
    fetchIndicator("NY.GDP.MKTP.KD.ZG"), // GDP growth %
    fetchIndicator("NY.GDP.PCAP.CD"),  // GDP per capita USD
    fetchIndicator("SP.POP.TOTL"),     // Population
    fetchIndicator("ST.INT.RCPT.CD"),  // Tourism receipts USD
    fetchIndicator("ST.INT.ARVL"),     // Tourism arrivals
  ]);

  const toMap = (records: WorldBankRecord[]) =>
    Object.fromEntries(records.map((r) => [parseInt(r.date), r.value as number]));

  return {
    fetchedAt: new Date().toISOString(),
    gdpAnnual: toMap(gdpRaw),
    gdpGrowth: toMap(growthRaw),
    gdpPerCapita: toMap(perCapitaRaw),
    population: toMap(popRaw),
    tourismReceiptsUSD: toMap(tourismRaw),
    tourismArrivals: toMap(arrivalsRaw),
  };
}

// Converts World Bank annual data into quarterly GDP estimates
// using Bahamas' tourism seasonality pattern (Q3 peak, Q4 dip)
export function distributeQuarterly(annualGDP: number): number[] {
  const weights = [0.237, 0.248, 0.260, 0.255]; // Q1-Q4 seasonal weights
  return weights.map((w) => Math.round(annualGDP * w));
}

// Tourism sector estimated at ~47% of GDP (World Bank, IMF WEO)
// Financial services ~26%, Construction ~10%, Agriculture ~4%, Other ~13%
export function estimateSectors(quarterlyGDP: number) {
  return {
    tourism: Math.round(quarterlyGDP * 0.47),
    financial: Math.round(quarterlyGDP * 0.26),
    construction: Math.round(quarterlyGDP * 0.10),
    agriculture: Math.round(quarterlyGDP * 0.04),
    other: Math.round(quarterlyGDP * 0.13),
  };
}
