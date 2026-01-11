/**
 * Custom database error class
 */
class DBError extends Error {
    constructor(message, code, detail, originalError) {
        super(message);
        this.name = 'DBError';
        this.code = code;
        this.detail = detail;
        this.originalError = originalError;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * PostgreSQL error code mappings
 */
const ERROR_CODES = {
    '23505': 'Unique constraint violation',
    '23503': 'Foreign key constraint violation',
    '23502': 'Not null constraint violation',
    '23514': 'Check constraint violation',
    '42P01': 'Undefined table',
    '42703': 'Undefined column',
    '42883': 'Undefined function',
    '42P07': 'Duplicate table',
    '42701': 'Duplicate column',
    '22P02': 'Invalid text representation',
    '22003': 'Numeric value out of range',
    '08006': 'Connection failure',
    '08003': 'Connection does not exist',
    '08000': 'Connection exception',
    '53300': 'Too many connections',
};

/**
 * Normalize PostgreSQL errors into consistent DBError instances
 * @param {Error} error - Original error from PostgreSQL
 * @returns {DBError} Normalized database error
 */
function normalizeError(error) {
    // If it's already a DBError, return as-is
    if (error instanceof DBError) {
        return error;
    }

    // PostgreSQL errors have a 'code' property
    const code = error.code || 'UNKNOWN';
    const detail = error.detail || '';

    // Get human-readable message for known error codes
    let message = ERROR_CODES[code] || 'Database error occurred';

    // Append detail if available
    if (detail) {
        message += `: ${detail}`;
    } else if (error.message) {
        message += `: ${error.message}`;
    }

    return new DBError(message, code, detail, error);
}

module.exports = {
    DBError,
    normalizeError,
};
