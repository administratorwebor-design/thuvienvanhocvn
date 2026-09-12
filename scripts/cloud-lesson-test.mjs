import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
 const p=await b.newPage({viewport:{width:1400,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:4000/reference/may-va-song/lesson.html');
 const images=new Set(),themes=new Set();
 for(let i=0;i<7;i++){
   await p.locator(`nav button[data-slide="${i}"]`).click();
   await p.locator('article img').evaluate(img=>img.decode());
   images.add(await p.locator('article img').getAttribute('src'));themes.add(await p.locator('article').getAttribute('class'));
   await p.screenshot({path:`artifacts/cloud-slide-${i+1}.png`});
 }
 assert.equal(images.size,7);assert.equal(themes.size,7);
 await p.locator('textarea').fill('Em muốn cùng mẹ đọc sách.');
 await p.reload();await p.locator('[data-slide="6"]').click();assert.equal(await p.locator('textarea').inputValue(),'Em muốn cùng mẹ đọc sách.');
 await p.locator('[data-slide="7"]').click();
 for(const [i,a] of [0,1,2,0].entries())await p.locator(`input[name=q${i}][value="${a}"]`).check();
 await p.locator('.check').click();assert.match(await p.locator('#score').innerText(),/4\/4/);
 await p.setViewportSize({width:390,height:844});
 for(let i=0;i<8;i++){await p.locator(`[data-slide="${i}"]`).click();assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Mobile slide ${i}`);}
 assert.deepEqual(errors,[]);
 for(let i=1;i<=7;i++)assert.ok(fs.statSync(`frontend/public/reference/may-va-song/audio-${i}.mp3`).size>10000);
 console.log('PASS seven unique illustrations/layouts, navigation, saved writing, quiz 4/4, mobile eight slides, seven audio files.');
}finally{await b.close();}
