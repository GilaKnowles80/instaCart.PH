import { runMigrations } from './config/migrate.js';

export async function setupDatabase() {
  await runMigrations();
}