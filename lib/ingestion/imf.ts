// IMF World Economic Outlook API
// Provides forecasts, unemployment, inflation, current account data

const IMF_BASE = "https://www.imf.org/external/datamapper/api/v1";

export interface IMFSeriesData {
  [year: string]: number | null;
}

export interface IMFIndicatorResponse {
  values: {
    [indicator: string]: {
      [country: string]: IMFSeriesData;
    };
  };
}

async function fetchIMFIndicator(
  indicator: string,
  country = "BHS"
): Promise<IMFSeriesData> {
  const url = `${IMF_BASE}/indicator/${indicator}?countries=${country}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 0 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`IMF API error: ${res.status}`);
    const json: IMFIndicatorResponse = await res.json();
    return json?.values?.[indicator]?.[country] ?? {};
  } catch {
    return {};
  }
}

export interface IMFSnapshot {
  fetchedAt: string;
  gdpCurrentUSD: IMFSeriesData;       // NGDPD — nominal GDP, USD billions
  gdpGrowth: IMFSeriesData;           // NGDP_RPCH — real GDP growth %
  inflation: IMFSeriesData;           // PCPIPCH — inflation %
  unemployment: IMFSeriesData;        // LUR — unemployment rate %
  currentAccount: IMFSeriesData;      // BCA_NGDPD — current account % of GDP
  debtToGDP: IMFSeriesData;           // GGXWDG_NGDP — gross debt % of GDP
  govBalance: IMFSeriesData;          // GGXCNL_NGDP — gov net lending/borrowing % of GDP
}

export async function fetchIMFData(): Promise<IMFSnapshot> {
  const [gdpUSD, gdpGrowth, inflation, unemployment, currentAccount, debt, govBalance] =
    await Promise.all([
      fetchIMFIndicator("NGDPD"),
      fetchIMFIndicator("NGDP_RPCH"),
      fetchIMFIndicator("PCPIPCH"),
      fetchIMFIndicator("LUR"),
      fetchIMFIndicator("BCA_NGDPD"),
      fetchIMFIndicator("GGXWDG_NGDP"),
      fetchIMFIndicator("GGXCNL_NGDP"),
    ]);

  return {
    fetchedAt: new Date().toISOString(),
    gdpCurrentUSD: gdpUSD,
    gdpGrowth,
    inflation,
    unemployment,
    currentAccount,
    debtToGDP: debt,
    govBalance,
  };
}
