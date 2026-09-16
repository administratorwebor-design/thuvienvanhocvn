import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import AdmZip from '../backend/node_modules/adm-zip/adm-zip.js';
import {startTestServer} from './support.mjs';
import {createStore} from '../backend/store.js';
import {exportData,inspectTransfer} from '../backend/data-transfer.js';
test('Admin full replacement: backup, file replacement, account hashes, token revocation and validation',async()=>{
 const s=await startTestServer();const store=createStore(s.env.DATA_DIR);
 try{
  const db=store.readDb(),admin=db.users.find(u=>u.role==='admin'),hash=admin.passwordHash;
  fs.writeFileSync(path.join(s.env.UPLOAD_DIR,'old.txt'),'old');
  const archive=new AdmZip(exportData(db,s.env.UPLOAD_DIR));archive.deleteFile('uploads/old.txt');archive.addFile('uploads/new.txt',Buffer.from('new'));
  db.classes.push({_id:'imported-class',name:'6A',teacherId:admin._id});archive.updateFile('database.json',Buffer.from(JSON.stringify({version:1,data:db})));
  const post=async(token,confirm=true)=>{const form=new FormData();form.set('archive',new Blob([archive.toBuffer()]),'data.zip');if(confirm)form.set('confirm','REPLACE_ALL_DATA');return s.request('POST','/admin/data-transfer/replace',form,token);};
  assert.equal((await post()).status,401);
  await s.request('POST','/auth/register',{username:'transfer-student',fullName:'Student',password:'StudentTest!2026'});
  const student=(await s.request('POST','/auth/login',{username:'transfer-student',password:'StudentTest!2026'})).data;
  assert.equal((await post(student.token)).status,403);assert.equal((await post(s.adminToken,false)).status,400);
  assert.equal((await post(s.adminToken)).status,200);
  const after=store.readDb();assert.equal(after.users.find(u=>u._id===admin._id).passwordHash,hash);assert.ok(after.classes.some(c=>c._id==='imported-class'));assert.ok(!after.users.some(u=>u.username==='transfer-student'));
  assert.equal(fs.readFileSync(path.join(s.env.UPLOAD_DIR,'new.txt'),'utf8'),'new');assert.ok(!fs.existsSync(path.join(s.env.UPLOAD_DIR,'old.txt')));
  const backups=fs.readdirSync(path.join(s.env.DATA_DIR,'transfer-backups'));assert.equal(backups.length,1);assert.equal(new AdmZip(path.join(s.env.DATA_DIR,'transfer-backups',backups[0])).readAsText('uploads/old.txt'),'old');
  assert.equal((await s.request('GET','/admin/users',undefined,s.adminToken)).status,401);
  const malformed=new AdmZip();malformed.addFile('database.json',Buffer.from('{}'));assert.throws(()=>inspectTransfer(malformed.toBuffer()));
 }finally{store.close();await s.stop();}
});
