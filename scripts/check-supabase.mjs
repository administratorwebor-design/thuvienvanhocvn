import pg from '../backend/node_modules/pg/lib/index.js';
import dotenv from '../backend/node_modules/dotenv/lib/main.js';
import fs from 'node:fs';
dotenv.config({path:new URL('../.env',import.meta.url),quiet:true});
if(!process.env.SUPABASE_DATABASE_URL)throw new Error('Missing SUPABASE_DATABASE_URL');
const caPath=process.env.SUPABASE_CA_CERT_PATH;
const connection=new URL(process.env.SUPABASE_DATABASE_URL);
// Keep URI SSL options from overriding certificate verification.
for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])connection.searchParams.delete(key);
const client=new pg.Client({connectionString:connection.toString(),ssl:{rejectUnauthorized:true,...(caPath?{ca:fs.readFileSync(caPath,'utf8')}:{})},connectionTimeoutMillis:15000});
try {
  await client.connect();
  const result=await client.query('SELECT current_database() AS database, current_user AS role');
  console.log(JSON.stringify({connected:true,...result.rows[0]}));
} catch(error) {
  console.error(JSON.stringify({connected:false,code:error.code||'CONNECTION_FAILED'}));
  if(error.code==='SELF_SIGNED_CERT_IN_CHAIN')console.error('Download the project CA certificate from Supabase Database settings and set SUPABASE_CA_CERT_PATH in .env.');
  process.exitCode=1;
} finally { await client.end(); }
