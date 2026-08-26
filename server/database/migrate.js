import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from '../src/config/db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

try {
  db.exec(schema);
  console.log('Database migration completed successfully.');
} catch (error) {
  console.error('Database migration failed:', error.message);

  process.exitCode = 1;
} finally {
  db.close();
}
