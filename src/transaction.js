const { pool } = require('./db');

/**
 * Execute a callback function within a database transaction
 * Automatically commits on success or rolls back on error
 * @param {Function} callback - Async function that receives a client and performs database operations
 * @returns {Promise<any>} Result of the callback function
 */
async function withTransaction(callback) {
    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        // Execute user callback with the client
        const result = await callback(client);

        // Commit transaction on success
        await client.query('COMMIT');

        return result;
    } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');

        // Re-throw the error for the caller to handle
        throw error;
    } finally {
        // Always release the client back to the pool
        client.release();
    }
}

module.exports = {
    withTransaction,
};
