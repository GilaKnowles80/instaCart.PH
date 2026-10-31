import { neon } from '@neondatabase/serverless';

let DATABASE_URL = process.env.DATABASE_URL;

// Fallback: if env var is empty or invalid, use the known working URL
if (!DATABASE_URL || !DATABASE_URL.startsWith('postgresql://')) {
  DATABASE_URL = 'postgresql://neondb_owner:npg_DwF0P8msSGrl@ep-divine-wildflower-a1smbssh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
}

/**
 * Neon serverless SQL client.
 * Usage: const result = await sql`SELECT * FROM users`;
 */
export const sql = neon(DATABASE_URL);

/**
 * Test the database connection by running a simple query.
 * Throws if the connection fails.
 */
export const connectDatabase = async (): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not defined in environment variables. Please check your .env file.'
    );
  }
  try {
    const result = await sql`SELECT 1 AS connected`;
    if (result[0]?.connected === 1) {
      console.log('✅ Neon PostgreSQL database connected successfully.');
    } else {
      throw new Error('Unexpected response from database health check.');
    }
  } catch (error) {
    console.error('❌ Neon PostgreSQL database connection failed:', error);
    process.exit(1);
  }
};

/**
 * Helper to safely execute a parameterized query and return the first row or null.
 * Uses neon's tagged template for safe parameter interpolation.
 */
export const queryOne = async <T = any>(
  strings: TemplateStringsArray,
  ...params: unknown[]
): Promise<T | null> => {
  const result = await sql(strings, ...params);
  return (result[0] as T) || null;
};

/**
 * Helper to safely execute a parameterized query and return all rows.
 */
export const queryMany = async <T = any>(
  strings: TemplateStringsArray,
  ...params: unknown[]
): Promise<T[]> => {
  const result = await sql(strings, ...params);
  return result as unknown as T[];
};

export default { sql, connectDatabase, queryOne, queryMany };