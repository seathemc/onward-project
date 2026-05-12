import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres@localhost:5432/onward",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}

export async function getOne<T = any>(text: string, params?: unknown[]): Promise<T | null> {
  const result = await query(text, params);
  return (result.rows[0] as T) ?? null;
}

export async function getMany<T = any>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await query(text, params);
  return result.rows as T[];
}
