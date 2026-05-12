-- ============================================================
-- Onward Project — Full Schema + Seed
-- Paste this entire file into the Supabase SQL Editor and run it.
-- ============================================================

-- Schema
CREATE TABLE IF NOT EXISTS data_versions (
  id BIGSERIAL PRIMARY KEY,
  data_type TEXT NOT NULL UNIQUE,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT,
  status TEXT DEFAULT 'success'
);

CREATE TABLE IF NOT EXISTS gdp_snapshots (
  id BIGSERIAL PRIMARY KEY,
  snapshot_version_id BIGINT REFERENCES data_versions(id),
  year INTEGER NOT NULL,
  quarter TEXT,
  gdp NUMERIC NOT NULL,
  gdp_growth_rate NUMERIC,
  gdp_per_capita NUMERIC,
  tourism NUMERIC,
  financial NUMERIC,
  construction NUMERIC,
  agriculture NUMERIC,
  other NUMERIC,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT gdp_unique UNIQUE (snapshot_version_id, year, quarter)
);

CREATE TABLE IF NOT EXISTS budget_snapshots (
  id BIGSERIAL PRIMARY KEY,
  snapshot_version_id BIGINT REFERENCES data_versions(id),
  year INTEGER NOT NULL,
  fiscal_year TEXT,
  revenue_total NUMERIC,
  revenue_tax NUMERIC,
  revenue_non_tax NUMERIC,
  revenue_grants NUMERIC,
  expenditure_total NUMERIC,
  expenditure_recurrent NUMERIC,
  expenditure_capital NUMERIC,
  balance NUMERIC,
  debt_total NUMERIC,
  debt_external NUMERIC,
  debt_domestic NUMERIC,
  debt_to_gdp NUMERIC,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT budget_unique UNIQUE (snapshot_version_id, year)
);

CREATE TABLE IF NOT EXISTS budget_categories_snapshots (
  id BIGSERIAL PRIMARY KEY,
  snapshot_version_id BIGINT REFERENCES data_versions(id),
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  ministry TEXT NOT NULL,
  allocated NUMERIC,
  spent NUMERIC,
  remaining NUMERIC,
  percentage_used NUMERIC,
  status TEXT,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT category_unique UNIQUE (snapshot_version_id, category_id)
);

CREATE TABLE IF NOT EXISTS forecast_scenarios (
  id BIGSERIAL PRIMARY KEY,
  scenario_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  scenario_type TEXT,
  gdp_projection NUMERIC,
  growth_rate NUMERIC,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT forecast_unique UNIQUE (scenario_name, year)
);

CREATE INDEX IF NOT EXISTS idx_gdp_snapshots_year ON gdp_snapshots(year);
CREATE INDEX IF NOT EXISTS idx_gdp_snapshots_fetched ON gdp_snapshots(fetched_at);
CREATE INDEX IF NOT EXISTS idx_budget_snapshots_year ON budget_snapshots(year);
CREATE INDEX IF NOT EXISTS idx_budget_snapshots_fetched ON budget_snapshots(fetched_at);
CREATE INDEX IF NOT EXISTS idx_data_versions_type ON data_versions(data_type);

-- ============================================================
-- Seed Data
-- ============================================================

-- Data versions
INSERT INTO data_versions (data_type, last_updated_at, fetched_at, source, status)
VALUES
  ('gdp', NOW(), NOW(), 'seed', 'success'),
  ('budget', NOW(), NOW(), 'seed', 'success'),
  ('budget_categories', NOW(), NOW(), 'seed', 'success')
ON CONFLICT (data_type) DO UPDATE
  SET last_updated_at = EXCLUDED.last_updated_at,
      fetched_at = EXCLUDED.fetched_at,
      source = EXCLUDED.source,
      status = EXCLUDED.status;

-- GDP snapshots (2023-2024, quarterly)
WITH gdp_ver AS (SELECT id FROM data_versions WHERE data_type = 'gdp')
INSERT INTO gdp_snapshots (snapshot_version_id, year, quarter, gdp, gdp_growth_rate, gdp_per_capita, tourism, financial, construction, agriculture, other)
SELECT gdp_ver.id, rows.year, rows.quarter, rows.gdp, rows.gdp_growth_rate, rows.gdp_per_capita,
       rows.tourism, rows.financial, rows.construction, rows.agriculture, rows.other
FROM gdp_ver, (VALUES
  (2023,'Q1',3672,2.8,35960,1712,992,521,205,242),
  (2023,'Q2',3826,3.1,37480,1791,1022,541,210,262),
  (2023,'Q3',3972,3.3,38900,1871,1048,560,215,278),
  (2023,'Q4',3801,2.9,37260,1768,1028,545,218,242),
  (2024,'Q1',3774,2.8,36970,1770,1015,548,208,233),
  (2024,'Q2',3962,3.5,38810,1866,1058,572,213,253),
  (2024,'Q3',4118,3.7,40330,1955,1090,595,218,260),
  (2024,'Q4',3978,3.4,38980,1880,1072,580,222,224)
) AS rows(year, quarter, gdp, gdp_growth_rate, gdp_per_capita, tourism, financial, construction, agriculture, other)
ON CONFLICT (snapshot_version_id, year, quarter) DO UPDATE
  SET gdp = EXCLUDED.gdp,
      gdp_growth_rate = EXCLUDED.gdp_growth_rate,
      gdp_per_capita = EXCLUDED.gdp_per_capita,
      tourism = EXCLUDED.tourism,
      financial = EXCLUDED.financial,
      construction = EXCLUDED.construction,
      agriculture = EXCLUDED.agriculture,
      other = EXCLUDED.other;

-- Budget snapshots (2023-2024)
WITH bud_ver AS (SELECT id FROM data_versions WHERE data_type = 'budget')
INSERT INTO budget_snapshots (snapshot_version_id, year, fiscal_year, revenue_total, revenue_tax, revenue_non_tax, revenue_grants,
  expenditure_total, expenditure_recurrent, expenditure_capital, balance, debt_total, debt_external, debt_domestic, debt_to_gdp)
SELECT bud_ver.id, rows.year, rows.fiscal_year, rows.revenue_total, rows.revenue_tax, rows.revenue_non_tax, rows.revenue_grants,
       rows.expenditure_total, rows.expenditure_recurrent, rows.expenditure_capital, rows.balance,
       rows.debt_total, rows.debt_external, rows.debt_domestic, rows.debt_to_gdp
FROM bud_ver, (VALUES
  (2023,'2023/2024',3245,2420,725,100,3450,3010,440,-205,11249,6850,4399,73.7),
  (2024,'2024/2025',3540,2680,785,75,3610,3265,345,-70,11700,7020,4680,73.9)
) AS rows(year, fiscal_year, revenue_total, revenue_tax, revenue_non_tax, revenue_grants,
  expenditure_total, expenditure_recurrent, expenditure_capital, balance, debt_total, debt_external, debt_domestic, debt_to_gdp)
ON CONFLICT (snapshot_version_id, year) DO UPDATE
  SET fiscal_year = EXCLUDED.fiscal_year,
      revenue_total = EXCLUDED.revenue_total,
      revenue_tax = EXCLUDED.revenue_tax,
      balance = EXCLUDED.balance,
      debt_to_gdp = EXCLUDED.debt_to_gdp;

-- Budget categories (2024/2025)
WITH cat_ver AS (SELECT id FROM data_versions WHERE data_type = 'budget_categories')
INSERT INTO budget_categories_snapshots (snapshot_version_id, category_id, category_name, ministry, allocated, spent, remaining, percentage_used, status)
SELECT cat_ver.id, rows.category_id, rows.category_name, rows.ministry, rows.allocated, rows.spent, rows.remaining, rows.percentage_used, rows.status
FROM cat_ver, (VALUES
  ('1','Healthcare Services & Infrastructure','Ministry of Health & Wellness',520,456,64,87.7,'on-track'),
  ('2','Education & Training','Ministry of Education',555,497,58,89.5,'on-track'),
  ('3','Tourism Development & Marketing','Ministry of Tourism',275,239,36,87.0,'on-track'),
  ('4','Infrastructure & Public Works','Ministry of Works & Utilities',655,710,-55,108.4,'over-budget'),
  ('5','National Security & Defense','Ministry of National Security',452,430,22,95.1,'on-track'),
  ('6','Social Services & Community Affairs','Ministry of Social Services',340,218,122,64.1,'under-utilized'),
  ('7','Finance & Economic Development','Ministry of Finance',195,178,17,91.3,'on-track'),
  ('8','Environment & Climate Resilience','Ministry of Environment',165,142,23,86.1,'on-track'),
  ('9','Agriculture & Marine Resources','Ministry of Agriculture',118,96,22,81.4,'on-track'),
  ('10','Legal Affairs & Attorney General','Office of the Attorney General',145,132,13,91.0,'on-track'),
  ('11','Foreign Affairs & International Relations','Ministry of Foreign Affairs',85,74,11,87.1,'on-track'),
  ('12','Youth, Sports & Culture','Ministry of Youth, Sports & Culture',105,88,17,83.8,'on-track')
) AS rows(category_id, category_name, ministry, allocated, spent, remaining, percentage_used, status)
ON CONFLICT (snapshot_version_id, category_id) DO UPDATE
  SET allocated = EXCLUDED.allocated,
      spent = EXCLUDED.spent,
      remaining = EXCLUDED.remaining,
      percentage_used = EXCLUDED.percentage_used,
      status = EXCLUDED.status;

-- Verify
SELECT 'data_versions' AS tbl, COUNT(*) FROM data_versions
UNION ALL SELECT 'gdp_snapshots', COUNT(*) FROM gdp_snapshots
UNION ALL SELECT 'budget_snapshots', COUNT(*) FROM budget_snapshots
UNION ALL SELECT 'budget_categories_snapshots', COUNT(*) FROM budget_categories_snapshots;
