import pg from 'pg';

const { Pool } = pg;

let pool;

export const initPool = (connectionString) => {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000,
  });

  pool.on('connect', () => {
    console.log('✅ Connected to Supabase PostgreSQL');
  });

  pool.on('error', (err) => {
    console.error('❌ Database connection error:', err.message);
    process.exit(-1);
  });

  return pool;
};

export const query = (text, params) => {
  if (!pool) throw new Error('Pool not initialized. Call initPool first.');
  return pool.query(text, params);
};

export default () => pool;
