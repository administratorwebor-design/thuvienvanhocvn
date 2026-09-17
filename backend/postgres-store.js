import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {collections} from './store.js';

export function postgresConfig(env=process.env){
  if(!env.SUPABASE_DATABASE_URL)throw new Error('SUPABASE_DATABASE_URL is required for Supabase storage.');
  const uri=new URL(env.SUPABASE_DATABASE_URL);
  for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])uri.searchParams.delete(key);
  const cert=env.SUPABASE_CA_CERT_PATH||new URL('./certs/prod-ca-2021.crt',import.meta.url);
  return {connectionString:uri.toString(),ssl:{rejectUnauthorized:true,ca:fs.readFileSync(cert,'utf8')},max:5,connectionTimeoutMillis:15000,idleTimeoutMillis:30000,statement_timeout:60000};
}
export async function createPostgresStore({env=process.env,uploadDir,schema=env.SUPABASE_SCHEMA||'literature_app'}={}){
  if(!/^[a-z][a-z0-9_]{0,62}$/.test(schema))throw new Error('Invalid database schema');
  const pool=new pg.Pool(postgresConfig(env));
  pool.on('error',error=>console.error('Supabase pool error:',error.code||'CONNECTION_ERROR'));
  const table=`"${schema}".records`,assets=`"${schema}".assets`;
  try{await pool.query(`
    CREATE SCHEMA IF NOT EXISTS "${schema}";
    REVOKE ALL ON SCHEMA "${schema}" FROM PUBLIC, anon, authenticated;
    CREATE TABLE IF NOT EXISTS ${table} (
      collection text NOT NULL, id text NOT NULL, payload text NOT NULL CHECK(jsonb_typeof(payload::jsonb)='object'),
      ordinal bigserial NOT NULL, PRIMARY KEY(collection,id));
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON ${table} (lower(payload::jsonb->>'username')) WHERE collection='users';
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON ${table} (lower(payload::jsonb->>'email')) WHERE collection='users' AND coalesce(payload::jsonb->>'email','')<>'';
    CREATE TABLE IF NOT EXISTS ${assets} (name text PRIMARY KEY, hash text NOT NULL, bytes bytea NOT NULL);
    ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
    ALTER TABLE ${assets} ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON ALL TABLES IN SCHEMA "${schema}" FROM PUBLIC, anon, authenticated;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA "${schema}" FROM PUBLIC, anon, authenticated;
  `);}catch(error){await pool.end();throw error;}
  const snapshots=new WeakMap(),keyOf=row=>row._id||row.token;
  const blank=()=>Object.fromEntries(collections.map(k=>[k,[]]));
  const conflict=()=>Object.assign(new Error('Dữ liệu vừa được thay đổi. Vui lòng tải lại và thử lại.'),{status:409});
  async function readDb(){
    const db=blank(),result=await pool.query(`SELECT collection,payload FROM ${table} ORDER BY ordinal`);
    for(const row of result.rows)if(db[row.collection])db[row.collection].push(JSON.parse(row.payload));
    snapshots.set(db,structuredClone(db));return db;
  }
  function localFiles(directory=uploadDir,prefix=''){
    if(!directory||!fs.existsSync(directory))return [];
    return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
      if(entry.isSymbolicLink())throw new Error('Symlink not permitted in uploads');
      const name=prefix+entry.name,file=path.join(directory,entry.name);
      return entry.isDirectory()?localFiles(file,name+'/'):[{name,file}];
    });
  }
  const knownFiles=new Map();
  async function persistUploads(client=pool){
    const persisted=[];
    for(const {name,file}of localFiles()){
      const stat=fs.statSync(file),fingerprint=`${stat.size}:${stat.mtimeMs}`;
      if(knownFiles.get(name)===fingerprint)continue;
      // Current uploads are small documents; large video files should use external links.
      if(stat.size>50*1024*1024)throw Object.assign(new Error('Tệp tối đa 50 MB khi lưu trên Supabase. Video lớn hãy dùng YouTube hoặc Drive.'),{status:413});
      const bytes=fs.readFileSync(file),hash=createHash('sha256').update(bytes).digest('hex');
      await client.query(`INSERT INTO ${assets}(name,hash,bytes) VALUES($1,$2,$3) ON CONFLICT(name) DO UPDATE SET hash=excluded.hash,bytes=excluded.bytes WHERE ${assets}.hash<>excluded.hash`,[name,hash,bytes]);
      persisted.push([name,fingerprint]);
    }
    if(client===pool)for(const [name,fingerprint]of persisted)knownFiles.set(name,fingerprint);
    return persisted;
  }
  async function writeDb(db){
    const base=snapshots.get(db);if(!base)throw new Error('Database write requires a read snapshot');
    const client=await pool.connect();
    try{
      await client.query('BEGIN');
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))",[schema]);
      const persisted=await persistUploads(client);
      for(const collection of collections){
        const old=new Map(base[collection].map(row=>[keyOf(row),JSON.stringify(row)])),next=new Map(db[collection].map(row=>[keyOf(row),JSON.stringify(row)]));
        for(const id of new Set([...old.keys(),...next.keys()])){
          if(old.get(id)===next.get(id))continue;
          const current=await client.query(`SELECT payload FROM ${table} WHERE collection=$1 AND id=$2`,[collection,id]);
          if(current.rows[0]?.payload!==old.get(id))throw conflict();
          if(next.has(id))await client.query(`INSERT INTO ${table}(collection,id,payload) VALUES($1,$2,$3) ON CONFLICT(collection,id) DO UPDATE SET payload=excluded.payload`,[collection,id,next.get(id)]);
          else await client.query(`DELETE FROM ${table} WHERE collection=$1 AND id=$2`,[collection,id]);
        }
      }
      await client.query('COMMIT');snapshots.set(db,structuredClone(db));for(const [name,fingerprint]of persisted)knownFiles.set(name,fingerprint);
    }catch(error){await client.query('ROLLBACK');if(error.code==='23505')throw Object.assign(new Error('Tên đăng nhập hoặc email đã được sử dụng.'),{status:409});throw error;}
    finally{client.release();}
  }
  async function restoreUploads(){
    if(!uploadDir)return;
    fs.mkdirSync(uploadDir,{recursive:true});
    const names=(await pool.query(`SELECT name,hash FROM ${assets} ORDER BY name`)).rows;
    for(const {name,hash}of names){
      const file=path.resolve(uploadDir,name),root=path.resolve(uploadDir)+path.sep;
      if(!file.startsWith(root)||name.includes('\\')||name.split('/').some(p=>p.startsWith('.')))throw new Error('Invalid persisted upload path');
      if(!fs.existsSync(file)||createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==hash){
        const {rows}=await pool.query(`SELECT bytes FROM ${assets} WHERE name=$1`,[name]);
        if(createHash('sha256').update(rows[0].bytes).digest('hex')!==hash)throw new Error('Upload checksum mismatch');
        fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,rows[0].bytes);
      }
      const stat=fs.statSync(file);knownFiles.set(name,`${stat.size}:${stat.mtimeMs}`);
    }
  }
  return {readDb,writeDb,persistUploads,restoreUploads,close:()=>pool.end(),pool,schema};
}
