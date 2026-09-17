import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {once} from 'node:events';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import dotenv from '../backend/node_modules/dotenv/lib/main.js';
import {createStore} from '../backend/store.js';
dotenv.config({quiet:true});
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'render-supabase-')),probe=http.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(r=>probe.close(r));
const child=spawn(process.execPath,['scripts/render-start.mjs'],{env:{...process.env,JWT_SECRET:randomBytes(48).toString('hex'),LOAD_ENV:'false',NODE_ENV:'production',DATABASE_DRIVER:'supabase',REQUIRE_EXISTING_DATA:'true',SEED_DEMO:'false',PORT:String(port),DATA_DIR:path.join(temp,'data'),UPLOAD_DIR:path.join(temp,'uploads')},stdio:['ignore','pipe','pipe']});
let logs='';child.stdout.on('data',b=>logs+=b);child.stderr.on('data',b=>logs+=b);
const base=`http://127.0.0.1:${port}`;
try{
 let ready=false;for(let i=0;i<60;i++){try{const r=await fetch(base+'/api/health');if(r.ok){assert.equal((await r.json()).storage,'supabase');ready=true;break;}}catch{}if(child.exitCode!==null)break;await new Promise(r=>setTimeout(r,500));}assert(ready,'Clean deployment did not start: '+logs);
 const local=createStore('backend/data'),db=local.readDb();local.close();
 for(const kind of ['videos','elearnings','storybooks']){const r=await fetch(base+'/api/'+kind);assert.equal(r.status,200);}
 const urls=new Set();const walk=value=>{if(typeof value==='string'&&/^\/(uploads|reference)\//.test(value))urls.add(value);else if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')Object.values(value).forEach(walk);};walk(db);
 const missing=[];for(const url of urls){const r=await fetch(base+url,{method:'HEAD'});if(!r.ok)missing.push({url,status:r.status});}assert.deepEqual(missing,[],'Missing course/upload assets');
 for(const file of fs.readdirSync('backend/uploads')){if(!fs.statSync(path.join('backend/uploads',file)).isFile())continue;assert.deepEqual(fs.readFileSync(path.join(temp,'uploads',file)),fs.readFileSync(path.join('backend/uploads',file)));}
 assert(!fs.existsSync(path.join(temp,'data','library.sqlite')));
 console.log(`PASS clean Render simulation: live Supabase health, public library, ${urls.size} referenced assets, restored uploads equal local, no SQLite created.`);
}finally{if(child.exitCode===null){child.kill();await once(child,'exit');}}
