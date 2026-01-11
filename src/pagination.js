/**
 * Paginate query results with metadata
 * @param {Object} client - PostgreSQL client (from pool or transaction)
 * @param {string} baseQuery - Base SQL query without LIMIT/OFFSET
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Number of records per page
 * @param {Array} params - Query parameters for the base query
 * @returns {Promise<Object>} Paginated results with metadata
 */
async function paginate(client, baseQuery, page = 1, pageSize = 10, params = []) {
    // Validate inputs
    const currentPage = Math.max(1, parseInt(page, 10));
    const limit = Math.max(1, parseInt(pageSize, 10));
    const offset = (currentPage - 1) * limit;

    // Build count query - extract FROM clause and WHERE conditions
    // This is a simple implementation; for complex queries, you might need a more sophisticated parser
    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS count_query`;

    // Build data query with pagination
    const dataQuery = `${baseQuery} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    try {
        // Execute both queries in parallel for better performance
        const [countResult, dataResult] = await Promise.all([
            client.query(countQuery, params),
            client.query(dataQuery, [...params, limit, offset]),
        ]);

        const totalRecords = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            data: dataResult.rows,
            pagination: {
                page: currentPage,
                pageSize: limit,
                totalRecords,
                totalPages,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1,
            },
        };
    } catch (error) {
        console.error('Pagination error:', {
            baseQuery,
            page: currentPage,
            pageSize: limit,
            error: error.message,
        });
        throw error;
    }
}

module.exports = {
    paginate,
};
