import { neon } from '@neondatabase/serverless';

let DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL || !DATABASE_URL.startsWith('postgresql://')) {
  DATABASE_URL = 'postgresql://neondb_owner:npg_DwF0P8msSGrl@ep-divine-wildflower-a1smbssh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
}

export const sql = neon(DATABASE_URL);

export const connectDatabase = async (): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables.');
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
