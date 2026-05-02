-- Data version tracking (when data was last fetched/updated)
CREATE TABLE IF NOT EXISTS data_versions (
  id BIGSERIAL PRIMARY KEY,
  data_type TEXT NOT NULL UNIQUE, -- 'gdp', 'budget', 'budget_categories'
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT, -- 'world_bank', 'ministry_finance', 'manual', etc.
  status TEXT DEFAULT 'success' -- 'success', 'pending', 'failed'
);

-- GDP snapshots - versioned quarterly data
CREATE TABLE IF NOT EXISTS gdp_snapshots (
  id BIGSERIAL PRIMARY KEY,
  snapshot_version_id BIGINT REFERENCES data_versions(id),
  year INTEGER NOT NULL,
  quarter TEXT, -- Q1, Q2, Q3, Q4
  gdp NUMERIC NOT NULL, -- millions BSD
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

-- Budget snapshots - versioned annual data
CREATE TABLE IF NOT EXISTS budget_snapshots (
  id BIGSERIAL PRIMARY KEY,
  snapshot_version_id BIGINT REFERENCES data_versions(id),
  year INTEGER NOT NULL,
  fiscal_year TEXT, -- e.g., '2024/2025'
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

-- Budget categories snapshots - versioned ministry-level data
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
  status TEXT, -- 'on-track', 'over-budget', 'under-utilized'
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT category_unique UNIQUE (snapshot_version_id, category_id)
);

-- Economic forecast scenarios (for projections)
CREATE TABLE IF NOT EXISTS forecast_scenarios (
  id BIGSERIAL PRIMARY KEY,
  scenario_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  scenario_type TEXT, -- 'good', 'bad'
  gdp_projection NUMERIC,
  growth_rate NUMERIC,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT forecast_unique UNIQUE (scenario_name, year)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_gdp_snapshots_year ON gdp_snapshots(year);
CREATE INDEX IF NOT EXISTS idx_gdp_snapshots_fetched ON gdp_snapshots(fetched_at);
CREATE INDEX IF NOT EXISTS idx_budget_snapshots_year ON budget_snapshots(year);
CREATE INDEX IF NOT EXISTS idx_budget_snapshots_fetched ON budget_snapshots(fetched_at);
CREATE INDEX IF NOT EXISTS idx_data_versions_type ON data_versions(data_type);
