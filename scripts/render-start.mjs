import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
process.env.APP_URL ||= process.env.RENDER_EXTERNAL_URL || '';
process.env.FRONTEND_ORIGIN ||= process.env.APP_URL;
process.env.DATA_DIR ||= path.join(root,'backend/data');
process.env.UPLOAD_DIR ||= path.join(root,'backend/uploads');
if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<32)throw Error('Set JWT_SECRET to at least 32 characters.');
const marker=path.join(process.env.DATA_DIR,'demo-bootstrap-v1.done');
if(process.env.DATABASE_DRIVER!=='supabase'&&process.env.SEED_DEMO==='true'&&!fs.existsSync(marker)){
  for(const args of [
    ['backend/server.js','--seed-only'],
    ['scripts/seed-deploy-library.mjs']
  ]){
    const child=spawnSync(process.execPath,args,{cwd:root,env:process.env,stdio:'inherit'});
    if(child.error)throw child.error;
    if(child.status!==0)throw Error(`Bootstrap failed: ${args[0]}`);
  }
  fs.writeFileSync(marker,new Date().toISOString());
}
await import('../backend/server.js');
