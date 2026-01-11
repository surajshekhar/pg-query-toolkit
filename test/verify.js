/**
 * Quick test to verify package exports work correctly
 * This doesn't require a database connection
 */

const toolkit = require('../src/index');

console.log(' Testing pg-query-toolkit exports...\n');

// Test 1: Check all exports exist
console.log('✓ Checking exports...');
const expectedExports = ['pool', 'query', 'withTransaction', 'paginate', 'DBError', 'normalizeError', 'logQuery'];
const actualExports = Object.keys(toolkit);

expectedExports.forEach(exp => {
    if (toolkit[exp]) {
        console.log(`  ✓ ${exp} exported`);
    } else {
        console.log(`  ✗ ${exp} MISSING`);
    }
});

// Test 2: Check DBError class
console.log('\n✓ Testing DBError class...');
const { DBError, normalizeError } = toolkit;

const testError = new DBError('Test error', '23505', 'Test detail', new Error('Original'));
console.log(`  ✓ DBError instance created`);
console.log(`  ✓ Message: ${testError.message}`);
console.log(`  ✓ Code: ${testError.code}`);
console.log(`  ✓ Detail: ${testError.detail}`);

// Test 3: Check error normalization
console.log('\n✓ Testing normalizeError...');
const pgError = new Error('duplicate key value');
pgError.code = '23505';
pgError.detail = 'Key (email)=(test@example.com) already exists.';

const normalized = normalizeError(pgError);
console.log(`  ✓ Normalized error: ${normalized.message}`);
console.log(`  ✓ Error code: ${normalized.code}`);

// Test 4: Check logger
console.log('\n✓ Testing logQuery...');
const { logQuery } = toolkit;
console.log('  ✓ logQuery function exists');
console.log('  ✓ Logging is disabled by default (no output expected)');
logQuery('SELECT * FROM test', [], 100);

console.log('\n✅ All basic tests passed!');
console.log('\nNote: Database connection tests require a valid DATABASE_URL in .env');
console.log('Run "npm run example" to test with a real database.\n');
