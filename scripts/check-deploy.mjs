import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
let bytes=0;
for(const file of new Set(files)){
 const size=fs.statSync(file).size;bytes+=size;
 assert.ok(size<50*1024*1024,`Oversized Git file: ${file}`);
 assert.ok(!/(^|\/)(node_modules|artifacts|data|uploads)\/|(^|\/)\.env$|\.(sqlite|pdf|mp4)$/.test(file),`Private/large file included: ${file}`);
 if(/\.(js|mjs|json|md|html|ya?ml|py|txt)$/.test(file)){
   const text=fs.readFileSync(file,'utf8');
   assert.ok(!/AIza[0-9A-Za-z_-]{35}|gh[pousr]_[0-9A-Za-z]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text),`Possible embedded credential: ${file}`);
 }
}
for(const file of ['dist/index.html','dist/assets/app.js','dist/reference/reader.js','dist/reference/ba-luoi-riu.html','dist/reference/may-va-song/poster.png'])assert.ok(fs.existsSync(file),`Missing build asset: ${file}`);
console.log(`PASS Git candidates: ${new Set(files).size} files, ${(bytes/1024/1024).toFixed(1)} MiB. No oversized files or recognized credential patterns. Build entry points present.`);
