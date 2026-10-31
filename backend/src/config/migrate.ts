import { sql } from './database.js';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Migration runner for instaCart.PH Neon PostgreSQL database.
 * Reads schema.sql and executes it against the connected database.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, '../db', 'schema.sql');

export async function runMigrations(): Promise<void> {
  try {
    const schemaSql = readFileSync(SCHEMA_PATH, 'utf-8');

    // Split by semicolons but be careful with semicolons inside strings
    const statements = splitSqlStatements(schemaSql);

    console.log(`📦 Found ${statements.length} SQL statements to execute.`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;

      try {
        await sql.unsafe(stmt);
        console.log(`✅ Statement ${i + 1}/${statements.length} executed.`);
      } catch (err: any) {
        // Some statements (like CREATE INDEX IF NOT EXISTS) may warn but not fail
        if (err.message?.includes('already exists') || err.message?.includes('duplicate')) {
          console.log(`⚠️  Statement ${i + 1}/${statements.length} skipped (already exists).`);
        } else {
          console.error(`❌ Statement ${i + 1}/${statements.length} failed:`, err.message);
          throw err;
        }
      }
    }

    console.log('✅ All migrations completed successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Simple SQL statement splitter that respects semicolons inside quoted strings.
 */
function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inDollarQuote = false;
  let dollarTag = '';

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const next = sql[i + 1];

    if (inDollarQuote) {
      current += char;
      if (char === '$' && sql.slice(i).startsWith(`$${dollarTag}$`)) {
        inDollarQuote = false;
        current += sql.slice(i + 1, i + 1 + dollarTag.length + 1);
        i += dollarTag.length + 1;
      }
      continue;
    }

    if (char === '$' && next && /[a-zA-Z_]/.test(next)) {
      const match = sql.slice(i).match(/^\$([a-zA-Z_][a-zA-Z0-9_]*)\$/);
      if (match) {
        inDollarQuote = true;
        dollarTag = match[1];
        current += match[0];
        i += match[0].length - 1;
        continue;
      }
    }

    if (inSingleQuote) {
      current += char;
      if (char === "'" && sql[i - 1] !== '\\') {
        inSingleQuote = false;
      }
      continue;
    }

    if (inDoubleQuote) {
      current += char;
      if (char === '"' && sql[i - 1] !== '\\') {
        inDoubleQuote = false;
      }
      continue;
    }

    if (char === "'") {
      inSingleQuote = true;
      current += char;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      current += char;
      continue;
    }

    if (char === ';' && !inSingleQuote && !inDoubleQuote && !inDollarQuote) {
      statements.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements.filter((s) => s.length > 0);
}

/**
 * Check database connectivity before running migrations.
 */
export async function checkDatabase(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 AS connected`;
    return result[0]?.connected === 1;
  } catch {
    return false;
  }
}

export default { runMigrations, checkDatabase };