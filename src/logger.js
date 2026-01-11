/**
 * Log query execution details
 * @param {string} query - SQL query text
 * @param {Array} params - Query parameters
 * @param {number} duration - Execution time in milliseconds
 */
function logQuery(query, params, duration) {
    // Check if logging is enabled
    if (process.env.ENABLE_QUERY_LOGGING !== 'true') {
        return;
    }

    const slowQueryThreshold = parseInt(process.env.SLOW_QUERY_THRESHOLD || '1000', 10);
    const isSlow = duration >= slowQueryThreshold;

    // Format the log message
    const timestamp = new Date().toISOString();
    const prefix = isSlow ? '🐌 SLOW QUERY' : '⚡ QUERY';

    console.log(`\n${prefix} [${timestamp}]`);
    console.log(`Duration: ${duration}ms`);
    console.log(`SQL: ${query}`);

    if (params && params.length > 0) {
        console.log(`Params: ${JSON.stringify(params)}`);
    }

    if (isSlow) {
        console.warn(`⚠️  Query exceeded slow threshold of ${slowQueryThreshold}ms`);
    }

    console.log('---');
}

module.exports = {
    logQuery,
};
