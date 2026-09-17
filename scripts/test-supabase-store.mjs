import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import dotenv from '../backend/node_modules/dotenv/lib/main.js';
import {createPostgresStore} from '../backend/postgres-store.js';
dotenv.config({quiet:true});
const schema=`test_migration_${Date.now()}`,dir=fs.mkdtempSync(path.join(os.tmpdir(),'supabase-store-'));
const store=await createPostgresStore({schema,uploadDir:dir});let restarted;
try{
 const db=await store.readDb();db.categories.push({_id:'first',name:'Tiếng Việt'});await store.writeDb(db);
 const a=await store.readDb(),b=await store.readDb();a.categories[0].name='Updated';await store.writeDb(a);b.categories[0].name='Stale';await assert.rejects(store.writeDb(b),e=>e.status===409);
 const c=await store.readDb(),d=await store.readDb();c.categories.push({_id:'second'});d.videos.push({_id:'video'});await Promise.all([store.writeDb(c),store.writeDb(d)]);assert.equal((await store.readDb()).categories.length,2);
 const u=await store.readDb();u.users.push({_id:'u1',username:'Teacher',email:'first@example.test'});await store.writeDb(u);
 const duplicate=await store.readDb();duplicate.users.push({_id:'u2',username:'TEACHER'});duplicate.categories.push({_id:'must-rollback'});await assert.rejects(store.writeDb(duplicate),e=>e.status===409);assert(!(await store.readDb()).categories.some(r=>r._id==='must-rollback'));
 fs.mkdirSync(path.join(dir,'course'));fs.writeFileSync(path.join(dir,'course','index.html'),'Nội dung tiếng Việt');await store.writeDb(await store.readDb());
 const clean=fs.mkdtempSync(path.join(os.tmpdir(),'supabase-restore-'));restarted=await createPostgresStore({schema,uploadDir:clean});await restarted.restoreUploads();assert.equal(fs.readFileSync(path.join(clean,'course','index.html'),'utf8'),'Nội dung tiếng Việt');assert.equal((await restarted.readDb()).videos.length,1);
 const denied=await store.pool.query("SELECT has_schema_privilege('anon',$1,'USAGE') AS anon, has_schema_privilege('authenticated',$1,'USAGE') AS authenticated",[schema]);assert.deepEqual(denied.rows[0],{anon:false,authenticated:false});
 console.log('PASS Supabase: persistence, Unicode, concurrent independent writes, stale conflicts, unique users, transaction rollback, upload restoration, private schema.');
}finally{await restarted?.close();await store.pool.query(`DROP SCHEMA "${schema}" CASCADE`);await store.close();}
