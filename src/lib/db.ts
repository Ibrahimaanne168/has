import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL || "";

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
});

/**
 * Exécute une requête SQL paramétrée et retourne les lignes typées
 */
export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (error) {
    console.error("Database query error:", error, "Query:", text, "Params:", params);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Exécute une requête et retourne la première ligne
 */
export async function queryOne<T = any>(text: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}
