import { Pool } from '@neondatabase/serverless';

// Core database pooling configured for serverless lifecycles
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});