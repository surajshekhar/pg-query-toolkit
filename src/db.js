const { Pool } = require('pg');

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Connection pool configuration
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Execute a query using a client from the pool
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log query if logging is enabled
    if (process.env.ENABLE_QUERY_LOGGING === 'true') {
      const { logQuery } = require('./logger');
      logQuery(text, params, duration);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('Query error:', {
      text,
      params,
      duration,
      error: error.message,
    });
    throw error;
  }
}

module.exports = {
  pool,
  query,
};
