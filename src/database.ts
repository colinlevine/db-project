import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseHost = process.env.SUPABASE_HOST;
const supabaseProjectRef = process.env.SUPABASE_PROJECT_REF;
const supabasePassword = process.env.SUPABASE_PASSWORD;

if (!supabaseHost || !supabasePassword || !supabaseProjectRef) {
  throw new Error('SUPABASE_HOST, SUPABASE_PROJECT_REF, and SUPABASE_PASSWORD environment variables must be set');
}

// Use session pooler for IPv4 compatibility (WSL2)
export const pool = new Pool({
  host: supabaseHost,
  port: 5432,
  database: 'postgres',
  user: `postgres.${supabaseProjectRef}`,
  password: supabasePassword,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

// Handle pool errors to prevent crashes
pool.on('error', (err) => {
  console.error('Unexpected database pool error (non-fatal):', err.message);
  // Don't crash the process - just log the error
});

// Test database connection
export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('✓ Database connected successfully (Supabase/PostgreSQL)');
    client.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
}
