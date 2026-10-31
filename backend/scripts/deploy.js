#!/usr/bin/env node
/**
 * instaCart.PH Production Deployment Script
 * 
 * This script helps prepare the backend for production deployment.
 * It checks environment variables, runs database migrations, and verifies connectivity.
 */

import { checkDatabase, runMigrations } from '../src/config/migrate.js';
import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'PAYPAL_ENVIRONMENT',
  'PAYPAL_MERCHANT_EMAIL',
];

async function main() {
  console.log('🚀 instaCart.PH Production Deployment Prep\n');

  // 1. Check required environment variables
  console.log('📋 Checking required environment variables...');
  const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((v) => console.error(`   - ${v}`));
    console.error('\nPlease copy .env.example to .env and fill in all values.');
    process.exit(1);
  }
  console.log('✅ All required environment variables are set.\n');

  // 2. Check database connection
  console.log('🔌 Checking database connection...');
  const dbConnected = await checkDatabase();
  if (!dbConnected) {
    console.error('❌ Cannot connect to Neon database. Please check your DATABASE_URL.');
    process.exit(1);
  }
  console.log('✅ Database connection successful.\n');

  // 3. Run migrations
  console.log('📦 Running database migrations...');
  await runMigrations();

  console.log('\n✅ Deployment preparation complete!');
  console.log('\nNext steps:');
  console.log('  1. Build the backend: npm run build');
  console.log('  2. Deploy to your platform (Vercel, Railway, etc.)');
  console.log('  3. Build the frontend: cd ../frontend && npm run build');
  console.log('  4. Configure your custom domain and SSL');
}

main().catch((err) => {
  console.error('❌ Deployment prep failed:', err.message);
  process.exit(1);
});