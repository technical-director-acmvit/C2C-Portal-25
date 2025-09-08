// Seed whitelist entries from a CSV file into Postgres.
// Usage: node script.js path/to/file.csv

const fs = require('fs');
const { Pool } = require('pg');

// load .env if present
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed or .env absent; that's fine
}

const DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URL || process.env.DATABASE;
const TABLE_NAME = process.env.TABLE_NAME || 'whitelists'; // change if your table name differs

if (!DATABASE_URL) {
  console.error('DATABASE_URL (or DB_URL) is not set in env.');
  process.exit(1);
}

const csvPath = process.argv[2] || 'whitelist.csv';

function isValidEmail(email) {
  // simple RFC-like validation
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // skip header lines that contain 'email'
    if (i === 0 && /\bemail\b/i.test(line)) continue;

    // support simple csv: email,internal  OR just email per line
    const parts = line.split(',').map(p => p.trim());
    const email = parts[0];
    const internal = parts[1] ? /^(1|true|yes)$/i.test(parts[1]) : false;
    if (!isValidEmail(email)) {
      console.warn(`Skipping invalid email on line ${i + 1}: ${email}`);
      continue;
    }
    rows.push({ email, internal });
  }
  return rows;
}

(async () => {
  try {
    const raw = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCsv(raw);
    if (!rows.length) {
      console.log('No valid rows found in CSV.');
      process.exit(0);
    }

    const pool = new Pool({ connectionString: DATABASE_URL });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertQuery = `INSERT INTO ${TABLE_NAME} (email, internal, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) ON CONFLICT (email) DO UPDATE SET internal = EXCLUDED.internal, updated_at = NOW()`;

      for (const r of rows) {
        try {
          await client.query(insertQuery, [r.email, r.internal]);
          console.log(`Upserted: ${r.email} (internal=${r.internal})`);
        } catch (err) {
          // if table doesn't exist, surface a helpful message
          if (err.code === '42P01') {
            throw new Error(`Table "${TABLE_NAME}" does not exist in the database. Set TABLE_NAME env var or create the table.`);
          }
          console.error(`Failed to upsert ${r.email}:`, err.message || err);
        }
      }

      await client.query('COMMIT');
      console.log(`Done. Processed ${rows.length} rows.`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Transaction failed:', err.message || err);
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();