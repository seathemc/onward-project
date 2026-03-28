# Bahamas Economic Intelligence Dashboard

Investor-facing macro dashboard for the Commonwealth of the Bahamas. Real GDP, budget, and fiscal data — structured for capital deployment decisions.

## What it does

Surfaces key economic indicators for the Bahamas in a clean, readable format:

- **GDP trends** — quarterly nominal GDP (2023–2024), sectoral breakdown (tourism, financial services, construction, agriculture)
- **Budget & fiscal position** — revenue, expenditure, deficit, and debt figures from the Ministry of Finance
- **Year-over-year comparisons** — 2023 vs 2024 across all major metrics
- **Economic scenarios** — 7 forward projections through 2055, modelling different development paths

## Data sources

All figures are sourced from official publications:

| Dataset | Source |
|---|---|
| GDP (nominal, annual) | [World Bank Open Data — NY.GDP.MKTP.CD](https://api.worldbank.org/v2/country/BS/indicator/NY.GDP.MKTP.CD) |
| Budget & expenditure | Ministry of Finance, 2024/2025 Budget Statement |
| Sectoral estimates | World Bank, IMF World Economic Outlook |

Monetary values in millions of Bahamian Dollars (BSD, pegged 1:1 to USD).

**Key figures (2024):**
- GDP: $15.83B
- GDP per capita: ~$38,800
- Budget revenue: $3.54B
- Budget deficit: -$70M
- National debt: $11.7B (73.9% of GDP)

## Stack

- Next.js 14 (App Router)
- TypeScript
- shadcn/ui + Tailwind CSS
- Recharts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API integration

`lib/api.ts` has a `USE_REAL_API` flag (currently `false`). Set to `true` and configure `NEXT_PUBLIC_API_URL` to connect live endpoints:

```
GET /api/gdp?year=2024
GET /api/budget?year=2024
GET /api/budget/categories?year=2024
GET /api/comparisons?from=2023&to=2024
```

Data layer is in `lib/mock-data.ts` — hardcoded real figures until live endpoints are available.

## Deploy

Deployable to Vercel. No backend required in mock mode.
