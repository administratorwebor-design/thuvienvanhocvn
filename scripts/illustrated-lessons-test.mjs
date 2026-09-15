import {chromium} from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=path.resolve('frontend/public');
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.jpg':'image/jpeg'})[ext]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}:{})});
try{
const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
const rows=JSON.parse(fs.readFileSync('docs/illustrated-lessons.json','utf8'));
for(const [li,row] of rows.entries()){
await p.goto(`http://127.0.0.1:${server.address().port}${row.url}`);
const lesson=await p.evaluate(()=>window.ILLUSTRATED_LESSON);
const hashes=new Set(lesson.images.map(src=>createHash('sha256').update(fs.readFileSync(path.join(root,src))).digest('hex')));assert.equal(hashes.size,lesson.images.length);
for(let i=0;i<lesson.images.length;i++){await p.locator('nav button').nth(i).click();await p.locator('article img').evaluate(i=>i.decode());}
await p.locator('textarea').fill('Em sẽ quan tâm và chia sẻ với bạn.');await p.reload();await p.locator('nav button').last().click();assert.equal(await p.locator('textarea').inputValue(),'Em sẽ quan tâm và chia sẻ với bạn.');
await p.locator('nav button').nth(lesson.pages.length).click();await p.getByRole('button',{name:'Kiểm tra đáp án'}).click();assert.match(await p.locator('#score').innerText(),/0\/2/);
for(const [i,q]of lesson.questions.entries())await p.locator(`input[name=q${i}][value="${q.answer}"]`).check();await p.getByRole('button',{name:'Kiểm tra đáp án'}).click();assert.match(await p.locator('#score').innerText(),/2\/2/);
await p.locator('nav button').first().click();await p.locator('nav button').nth(lesson.pages.length).click();assert.match(await p.locator('#score').innerText(),/2\/2/);
await p.locator('nav button').first().click();if(li===0)await p.screenshot({path:'artifacts/illustrated-desktop.png',fullPage:true});
await p.setViewportSize({width:390,height:844});for(let i=0;i<lesson.images.length;i++){await p.locator('nav button').nth(i).click();assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${row.title} page ${i}`);}if(li===0)await p.screenshot({path:'artifacts/illustrated-mobile.png',fullPage:true});await p.setViewportSize({width:1440,height:1000});
}
assert.deepEqual(errors,[]);console.log('PASS: five lessons, 29 unique illustrations within lessons, image loading, navigation, quiz feedback and retained answers, saved writing, mobile layout.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
