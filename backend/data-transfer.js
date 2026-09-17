import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import multer from 'multer';
import AdmZip from 'adm-zip';
import {collections} from './store.js';
const fail=message=>{throw Object.assign(new Error(message),{status:400});};
export function exportData(db,uploadDir){
 const zip=new AdmZip();zip.addFile('database.json',Buffer.from(JSON.stringify({version:1,data:db})));
 if(fs.existsSync(uploadDir))zip.addLocalFolder(uploadDir,'uploads');
 return zip.toBuffer();
}
export function inspectTransfer(buffer){
 const zip=new AdmZip(buffer),entries=zip.getEntries();
 if(entries.length>10000||entries.reduce((n,e)=>n+e.header.size,0)>256*1024*1024)fail('Gói dữ liệu quá lớn.');
 const names=new Set();for(const e of entries){const n=e.entryName;
  if(names.has(n)||n.includes('\\')||n.includes(':')||n.startsWith('/')||n.split('/').includes('..')||((e.attr>>>16)&0xf000)===0xa000)fail('Đường dẫn trong gói không hợp lệ.');
  if(n!=='database.json'&&!n.startsWith('uploads/'))fail('Gói chứa tệp ngoài phạm vi dữ liệu.');names.add(n);
 }
 const payload=JSON.parse(zip.readAsText('database.json'));
 if(payload.version!==1||!payload.data||collections.some(k=>!Array.isArray(payload.data[k]))||Object.keys(payload.data).some(k=>!collections.includes(k)))fail('Cấu trúc dữ liệu không hợp lệ.');
 for(const k of collections){const ids=new Set();for(const r of payload.data[k]){const id=r?._id||r?.token;if(typeof id!=='string'||!id||ids.has(id))fail('ID dữ liệu không hợp lệ: '+k);ids.add(id);}}
 if(!payload.data.users.some(u=>u.role==='admin'&&!u.isLocked&&u.status!=='rejected'&&/^\$2[aby]\$/.test(u.passwordHash||'')))fail('Gói cần tài khoản admin hợp lệ.');
 const usernames=new Set(),emails=new Set();for(const u of payload.data.users){if(typeof u.username!=='string'||!u.username.trim()||typeof u.passwordHash!=='string')fail('Tài khoản không hợp lệ.');const name=u.username.toLowerCase(),email=u.email?.toLowerCase();if(usernames.has(name)||(email&&emails.has(email)))fail('Tài khoản trùng tên hoặc email.');usernames.add(name);if(email)emails.add(email);}
 return {zip,data:payload.data};
}
export function registerDataTransfer(app,{auth,admin,readDb,writeDb,dataDir,uploadDir}){
 const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:64*1024*1024,files:1}});
 app.get('/api/admin/data-transfer/export',auth(),admin,async (_req,res)=>{
  res.set('Cache-Control','no-store');res.attachment('library-backup.zip');res.type('application/zip').send(exportData((await readDb()),uploadDir));
 });
 app.post('/api/admin/data-transfer/replace',auth(),admin,upload.single('archive'),async (req,res)=>{
  if(req.body.confirm!=='REPLACE_ALL_DATA'||!req.file)fail('Thiếu xác nhận thay thế toàn bộ dữ liệu.');
  const {zip,data}=inspectTransfer(req.file.buffer),old=(await readDb());
  const stamp=randomUUID(),backupDir=path.join(dataDir,'transfer-backups');fs.mkdirSync(backupDir,{recursive:true});
  fs.writeFileSync(path.join(backupDir,stamp+'.zip'),exportData(old,uploadDir));
  // Stage on the same filesystem as uploads. Preserve old files outside the
  // served directory so rollback does not depend on re-extracting a backup.
  const staging=path.join(path.dirname(uploadDir),'.transfer-new-'+stamp),previous=path.join(path.dirname(uploadDir),'.transfer-old-'+stamp);
  fs.mkdirSync(staging,{recursive:true});
  for(const e of zip.getEntries()){if(e.isDirectory||!e.entryName.startsWith('uploads/'))continue;const destination=path.resolve(staging,e.entryName.slice(8));if(!destination.startsWith(staging+path.sep))fail('Đường dẫn upload không hợp lệ.');fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,e.getData());}
  // Session/reset tokens are not migrated; password hashes remain unchanged.
  for(const k of ['resetTokens','verificationTokens','storyQuizSessions'])data[k]=[];
  for(const u of data.users){const prior=old.users.find(x=>x._id===u._id);u.tokenVersion=Math.max(u.tokenVersion||0,prior?.tokenVersion||0)+1;}
  const hadUploads=fs.existsSync(uploadDir);if(hadUploads)fs.renameSync(uploadDir,previous);
  try{fs.renameSync(staging,uploadDir);for(const k of collections)old[k]=data[k];(await writeDb(old));}catch(error){if(fs.existsSync(uploadDir))fs.renameSync(uploadDir,staging);if(hadUploads)fs.renameSync(previous,uploadDir);throw error;}
  res.set('Cache-Control','no-store').json({success:true,backupId:stamp,counts:Object.fromEntries(collections.map(k=>[k,data[k].length]))});
 });
}
