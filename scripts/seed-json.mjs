import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', 'database', 'local_db.json');

if (fs.existsSync(dbPath)) {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  console.log(`✅ Záložní in-repo databáze (database/local_db.json) je připravena (${data.skills?.length || 0} dovedností, ${data.projects?.length || 0} projektů).`);
} else {
  console.error('❌ Soubor database/local_db.json nebyl nalezen.');
  process.exit(1);
}
