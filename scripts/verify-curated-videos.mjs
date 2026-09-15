import {chromium} from 'playwright';import fs from 'node:fs';import assert from 'node:assert/strict';
const catalog=JSON.parse(fs.readFileSync('docs/curated-videos.json'));
const base='http://127.0.0.1:4000';const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/videos');
for(const v of catalog.videos)await p.getByRole('heading',{name:v.title,exact:true}).waitFor();
for(const id of catalog.retiredIds)assert.equal(await p.locator(`a[href="/video/${id}"]`).count(),0);
await p.waitForFunction(()=>[...document.querySelectorAll('main img')].every(x=>x.complete&&x.naturalWidth>0));await p.screenshot({path:'artifacts/clean-videos/library.png',fullPage:true});
for(const v of catalog.videos){await p.goto(base+'/video/demo-youtube-'+v.key);await p.getByRole('heading',{name:v.title,exact:true}).waitFor();assert.equal(await p.locator('iframe').first().getAttribute('src'),'https://www.youtube.com/embed/'+v.id);await p.getByText('Gợi ý:',{exact:false}).waitFor();console.log('PASS detail page',v.title);}
await p.goto(base+'/videos');await p.setViewportSize({width:390,height:844});await p.getByRole('heading',{name:catalog.videos[0].title,exact:true}).waitFor();assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log('PASS public catalog, thumbnails, retired links removed, detail pages and mobile layout');
}finally{await b.close();}