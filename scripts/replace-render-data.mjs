import fs from 'node:fs';
import path from 'node:path';
import dotenv from '../backend/node_modules/dotenv/lib/main.js';
import {createStore} from '../backend/store.js';
import {exportData} from '../backend/data-transfer.js';
import {createHash} from 'node:crypto';
const base='https://thu-vien-so-van-hoc.onrender.com';
const dir='artifacts/render-replacement';fs.mkdirSync(dir,{recursive:true});
let token;
async function request(route,method='GET',body){const r=await fetch(base+'/api'+route,{method,headers:{...(body instanceof FormData?{}:{'Content-Type':'application/json'}),...(token?{Authorization:'Bearer '+token}:{})},body:body instanceof FormData?body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(120000)});if(!r.ok)throw Error(`${route} HTTP ${r.status}`);return r;}
async function login(password){token=(await (await request('/auth/login','POST',{username:'admin',password})).json()).token;}
await login(process.env.RENDER_ADMIN_PASSWORD);
if(process.argv.includes('--backup-visible')){
 const data={};for(const kind of ['categories','storybooks','videos','elearnings','quizzes','admin/users','classes','teachers'])data[kind]=await(await request('/'+kind+'?limit=100')).json();
 data.classDetails=[];for(const c of data.classes.classes)data.classDetails.push(await(await request('/classes/'+c._id)).json());
 fs.writeFileSync(dir+'/before-deploy-visible-data.private.json',JSON.stringify(data));
 const urls=new Set([...JSON.stringify(data).matchAll(/\/uploads\/[^"\s\\]+/g)].map(m=>m[0]));
 for(const url of urls){const r=await fetch(base+url);if(r.ok){const file=path.join(dir,'before-deploy-files',url.slice(1));fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));}}
 console.log('Saved pre-deploy API-visible data and referenced uploads (not password hashes).');process.exit(0);
}
// Require the full backup endpoint before performing the replacement.
fs.writeFileSync(dir+'/before-replace.private.zip',Buffer.from(await(await request('/admin/data-transfer/export')).arrayBuffer()));
const s=createStore('backend/data'),data=s.readDb();s.close();const archive=exportData(data,path.resolve('backend/uploads'));
fs.writeFileSync(dir+'/local-snapshot.private.zip',archive);
const form=new FormData();form.set('confirm','REPLACE_ALL_DATA');form.set('archive',new Blob([archive]),'local.zip');
const result=await(await request('/admin/data-transfer/replace','POST',form)).json();fs.writeFileSync(dir+'/result.json',JSON.stringify(result,null,2));console.log('Replacement:',result.counts);
token=undefined;dotenv.config({path:'backend/.env',quiet:true});dotenv.config({path:'.env',quiet:true});await login(process.env.ADMIN_PASSWORD);
const backup=Buffer.from(await(await request('/admin/data-transfer/export')).arrayBuffer());fs.writeFileSync(dir+'/verified-render.private.zip',backup);
const {inspectTransfer}=await import('../backend/data-transfer.js');const actual=inspectTransfer(backup);
for(const k of Object.keys(data)){
 if(['resetTokens','verificationTokens','storyQuizSessions'].includes(k))continue;
 const clean=rows=>rows.map(r=>{const copy=structuredClone(r);if(k==='users')delete copy.tokenVersion;return copy;}).sort((a,b)=>String(a._id||a.token).localeCompare(String(b._id||b.token)));
 if(JSON.stringify(clean(data[k]))!==JSON.stringify(clean(actual.data[k])))throw Error('Data differs after replacement: '+k);
}
const {zip}=inspectTransfer(archive);for(const entry of zip.getEntries().filter(e=>!e.isDirectory&&e.entryName.startsWith('uploads/'))){const got=actual.zip.getEntry(entry.entryName);if(!got||createHash('sha256').update(got.getData()).digest('hex')!==createHash('sha256').update(entry.getData()).digest('hex'))throw Error('Upload differs: '+entry.entryName);}
console.log('VERIFIED: all business collections and upload files match local; hashes preserved, old sessions revoked.');
