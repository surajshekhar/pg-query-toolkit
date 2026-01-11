# pg-query-toolkit

A lightweight, reusable PostgreSQL toolkit for Node.js that standardizes database operations, reducing boilerplate without requiring a heavy ORM.

**Solves common backend issue:**

* Repeated boilerplate for queries, transactions, and pagination
* Manual transaction management with potential for missed rollbacks
* Inconsistent error handling across database operations
* No built-in query logging for debugging

## Installation

```bash
npm install pg-query-toolkit

```

## Quick Start

### Setup Environment

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
ENABLE_QUERY_LOGGING=false
SLOW_QUERY_THRESHOLD=1000
```

### Basic Usage

```javascript
const { query, withTransaction, paginate } = require('pg-query-toolkit');

// Simple query
const users = await query('SELECT * FROM users WHERE active = $1', [true]);

// Transaction with automatic rollback on error
await withTransaction(async (client) => {
  await client.query('INSERT INTO users (name) VALUES ($1)', ['Alice']);
  await client.query('INSERT INTO orders (user_id) VALUES ($1)', [1]);
});

// Pagination with metadata
const result = await paginate(pool, 'SELECT * FROM users WHERE active = $1', 1, 10, [true]);
console.log(result.data);
console.log(result.pagination);
```

## API Reference

### `pool`

PostgreSQL connection pool instance for direct access.

### `query(text, params)`

Execute a query using the pool. Returns a Promise of query result.

### `withTransaction(callback)`

Execute operations within a transaction. Automatically commits on success or rolls back on error.

**Parameters:**

* `callback`: async function receiving a client

### `paginate(client, baseQuery, page, pageSize, params)`

Paginate query results with metadata.

**Returns:**

```js
{
  data: [...],
  pagination: { page, pageSize, totalRecords, totalPages, hasNext, hasPrev }
}
```

### `DBError`

Custom error class for database errors, with `message`, `code`, `detail`, and `originalError`.

### `normalizeError(error)`

Convert PostgreSQL errors to consistent `DBError` instances.

### `logQuery(query, params, duration)`

Logs query execution details (enabled via `ENABLE_QUERY_LOGGING=true`).

## Examples

**Transaction Example**

```javascript
await withTransaction(async (client) => {
  const user = await client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', ['Bob']);
  await client.query('INSERT INTO audit_log (action) VALUES ($1)', ['user_created']);
  return user.rows[0];
});
```

**Paginated Query Example**

```javascript
const result = await paginate(pool, 'SELECT * FROM products WHERE category = $1', 2, 20, ['electronics']);
```

**Error Handling Example**

```javascript
try {
  await query('INSERT INTO users (email) VALUES ($1)', ['duplicate@example.com']);
} catch (error) {
  const dbError = normalizeError(error);
  if (dbError.code === '23505') {
    console.log('Duplicate email');
  }
}
```

## Configuration

| Variable               | Description                           | Default  |
| ---------------------- | ------------------------------------- | -------- |
| `DATABASE_URL`         | PostgreSQL connection string          | Required |
| `ENABLE_QUERY_LOGGING` | Enable query logging (`true`/`false`) | `false`  |
| `SLOW_QUERY_THRESHOLD` | Slow query threshold in milliseconds  | `1000`   |

## Contributing

Contributions are welcome via pull requests.

## License

MIT

## Links

* [PostgreSQL Documentation](https://www.postgresql.org/docs/)
* [node-postgres (pg)](https://node-postgres.com/)

---
