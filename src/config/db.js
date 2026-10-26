const { Pool } = require('pg');
require('dotenv').config();

/**
 * PostgreSQL Connection Pool
 *
 * Why a Pool instead of a single Client?
 * - A single Client handles only one query at a time.
 * - In a web server, multiple users can send requests concurrently.
 * - Pool manages a set of reusable connections. When a query is called,
 *   Pool assigns an idle client, executes the SQL, and releases it back to the pool.
 */
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Event listener: Logs when a new client connects to the database
pool.on('connect', () => {
  console.log(' Connected to PostgreSQL database');
});

// Event listener: Catches unexpected errors on idle pool clients
pool.on('error', (err) => {
  console.error(' Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

/**
 * Exported query helper function:
 * Allows us to run queries anywhere like:
 * const { rows } = await query('SELECT * FROM books WHERE id = $1', [id]);
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
