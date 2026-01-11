/**
 * pg-query-toolkit
 * A lightweight PostgreSQL toolkit for Node.js
 * 
 * Provides utilities for:
 * - Database connection pooling
 * - Transaction management
 * - Pagination
 * - Error handling
 * - Query logging
 */

const { pool, query } = require('./db');
const { withTransaction } = require('./transaction');
const { paginate } = require('./pagination');
const { DBError, normalizeError } = require('./errors');
const { logQuery } = require('./logger');

module.exports = {
    // Database connection
    pool,
    query,

    // Transaction management
    withTransaction,

    // Pagination
    paginate,

    // Error handling
    DBError,
    normalizeError,

    // Logging
    logQuery,
};
