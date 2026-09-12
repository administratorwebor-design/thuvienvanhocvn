import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {once} from 'node:events';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'render-demo-'));
const probe=http.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(r=>probe.close(r));
const base=`http://127.0.0.1:${port}`;
const env={...process.env,LOAD_ENV:'false',NODE_ENV:'production',PORT:String(port),DATA_DIR:path.join(directory,'data'),UPLOAD_DIR:path.join(directory,'uploads'),JWT_SECRET:'isolated-production-smoke-secret-32-chars',ADMIN_USERNAME:'admin',ADMIN_PASSWORD:'RenderSmoke!2026',SEED_DEMO:'true',RENDER_EXTERNAL_URL:base,APP_URL:'',FRONTEND_ORIGIN:'',GEMINI_API_KEY:''};
let child;
async function stop(){if(child&&child.exitCode===null){child.kill();await once(child,'exit');}}
async function start(){
 child=spawn(process.execPath,['scripts/render-start.mjs'],{env,stdio:['ignore','pipe','pipe']});let logs='';child.stdout.on('data',b=>logs+=b);child.stderr.on('data',b=>logs+=b);
 for(let i=0;i<150;i++){if(child.exitCode!==null)throw Error(logs);try{if((await fetch(base+'/api/health')).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('Startup timeout: '+logs);
}
try{
 await start();
 for(const [key,count] of Object.entries({storybooks:1,videos:2,elearnings:3,quizzes:20})){
  const response=await fetch(base+'/api/'+key);const data=await response.json();assert.equal(data[key].length,count,key);
  for(const row of data[key])for(const field of ['thumbnail','url','storyPath'])if(row[field]?.startsWith('/'))assert.equal((await fetch(base+row[field])).status,200,`${key}: ${row[field]}`);
 }
 assert.equal((await fetch(base+'/elearning/demo-lesson-may-va-song')).status,200);
 const cors=await fetch(base+'/api/health',{headers:{Origin:base}});assert.equal(cors.headers.get('access-control-allow-origin'),base);
 const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'admin',password:env.ADMIN_PASSWORD})});assert.equal(login.status,200);
 const marker=fs.readFileSync(path.join(env.DATA_DIR,'demo-bootstrap-v1.done'),'utf8');
 const registration=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'customer-test',email:'customer@example.test',password:'CustomerTest!2026'})});assert.equal(registration.status,201);
 const customer=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'customer-test',password:'CustomerTest!2026'})});assert.equal(customer.status,200);
 await stop();await start();assert.equal(fs.readFileSync(path.join(env.DATA_DIR,'demo-bootstrap-v1.done'),'utf8'),marker);
 assert.equal((await(await fetch(base+'/api/quizzes')).json()).quizzes.length,20);
 console.log('PASS clean production bootstrap, all demo counts/local URLs, admin login, origin, SPA routing and restart without reseeding.');
}finally{await stop();}
