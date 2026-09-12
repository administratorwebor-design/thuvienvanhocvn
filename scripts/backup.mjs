import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import AdmZip from '../backend/node_modules/adm-zip/adm-zip.js';
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const directory = path.resolve('artifacts/backups', stamp);
fs.mkdirSync(directory, { recursive: true });
const zip = new AdmZip();
for (const file of ['render.yaml', '.node-version']) if (fs.existsSync(file)) zip.addLocalFile(file);
if (fs.existsSync('.github')) zip.addLocalFolder('.github', '.github');
for (const folder of ['frontend', 'scripts', 'tests', 'docs']) if (fs.existsSync(folder)) zip.addLocalFolder(folder, folder);
for (const file of ['package.json', 'package-lock.json', 'README.md', 'RESTORATION.md', '.env.example', '.gitignore', 'favicon.svg', 'static-spa-server.mjs']) if (fs.existsSync(file)) zip.addLocalFile(file);
for (const file of fs.readdirSync('backend')) if (/\.(js|mjs|json|md)$/.test(file) && fs.statSync(path.join('backend', file)).isFile()) zip.addLocalFile(path.join('backend', file), 'backend');
zip.writeZip(path.join(directory, 'source.zip'));
const dataDir = process.env.DATA_DIR || 'backend/data';
const database = path.join(dataDir, 'library.sqlite');
if (fs.existsSync(database)) {
  const db = new DatabaseSync(database); db.prepare('VACUUM INTO ?').run(path.join(directory, 'library.sqlite')); db.close();
}
const uploads = process.env.UPLOAD_DIR || 'backend/uploads';
if (fs.existsSync(uploads)) fs.cpSync(uploads, path.join(directory, 'uploads'), { recursive: true });
fs.writeFileSync(path.join(directory, 'RESTORE.txt'), 'Extract source.zip into a new folder. Install root and backend dependencies, restore library.sqlite into backend/data and uploads into backend/uploads. Configure .env again (secrets are deliberately excluded), then npm run build and npm start. Backups contain personal data; keep this folder private.\n');
console.log(`Backup created: ${directory}`);
