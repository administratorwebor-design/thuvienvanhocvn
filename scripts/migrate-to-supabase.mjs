import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import dotenv from '../backend/node_modules/dotenv/lib/main.js';
import {createStore,collections} from '../backend/store.js';
import {createPostgresStore} from '../backend/postgres-store.js';
import {exportData} from '../backend/data-transfer.js';
dotenv.config({quiet:true});
const uploadDir=path.resolve(process.env.UPLOAD_DIR||'backend/uploads'),local=createStore(process.env.DATA_DIR||'backend/data');
const source=local.readDb();local.close();
const directory=path.resolve('artifacts/backups',`supabase-migration-${new Date().toISOString().replace(/[:.]/g,'-')}`);
fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'local-before-migration.zip'),exportData(source,uploadDir));
const remote=await createPostgresStore({uploadDir});
const sorted=db=>Object.fromEntries(collections.map(k=>[k,[...db[k]].sort((a,b)=>(a._id||a.token).localeCompare(b._id||b.token))]));
try{
 const target=await remote.readDb(),hasData=collections.some(k=>target[k].length);
 if(hasData){assert.deepEqual(sorted(target),sorted(source),'Supabase already contains different data. Refusing to overwrite.');}
 else {for(const key of collections)target[key]=source[key];await remote.writeDb(target);}
 await remote.persistUploads();
 assert.deepEqual(sorted(await remote.readDb()),sorted(source));
 const assets=(await remote.pool.query('SELECT name,hash FROM literature_app.assets ORDER BY name')).rows;
 for(const {name,hash}of assets)assert.equal(createHash('sha256').update(fs.readFileSync(path.join(uploadDir,name))).digest('hex'),hash);
 const summary={verifiedAt:new Date().toISOString(),counts:Object.fromEntries(collections.map(k=>[k,source[k].length])),uploads:assets.length,backup:directory};
 fs.writeFileSync(path.join(directory,'verification.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
}finally{await remote.close();}
