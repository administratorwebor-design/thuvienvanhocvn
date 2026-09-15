import {chromium} from 'playwright';import fs from 'node:fs';
const dir='artifacts/clean-videos',ids=process.argv.slice(2);fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',args:['--autoplay-policy=no-user-gesture-required']});
const reports=[];
try{for(const id of ids){const p=await b.newPage({viewport:{width:1000,height:620}});const report={id};try{
const meta=await fetch('https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)+'&format=json').then(r=>r.json());report.title=meta.title;report.author=meta.author_name;
await p.goto('http://127.0.0.1:4000');await p.setContent(`<iframe width="960" height="540" src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe>`);const f=p.frameLocator('iframe');await f.locator('video').waitFor({timeout:25000});await f.locator('video').evaluate(v=>{v.muted=true;v.play().catch(()=>{});});await p.waitForTimeout(3500);
report.duration=await f.locator('video').evaluate(v=>v.duration);if(!Number.isFinite(report.duration))throw Error('Playback unavailable');report.samples=[];
for(const fraction of [.08,.3,.55,.8,.96]){await f.locator('video').evaluate((v,t)=>{v.currentTime=t;},report.duration*fraction);await f.locator('video').evaluate(v=>new Promise((resolve,reject)=>{const deadline=Date.now()+25000;const check=()=>{if(!v.seeking&&v.readyState>=3)return resolve();if(Date.now()>deadline)return reject(Error('Seek buffering timeout'));setTimeout(check,200);};check();}));await p.mouse.move(990,600);await p.waitForTimeout(5500);const path=`${dir}/${id}-${Math.round(fraction*100)}.png`;await f.locator('video').screenshot({path});report.samples.push(path);}
report.playback=await f.locator('video').evaluate(v=>({currentTime:v.currentTime,paused:v.paused,readyState:v.readyState}));console.log(JSON.stringify(report));
}catch(e){report.error=e.message;console.log(JSON.stringify(report));}reports.push(report);await p.close();}
fs.writeFileSync(dir+'/checks-'+ids[0]+'.json',JSON.stringify(reports,null,2));
const sheet=await b.newPage({viewport:{width:1000,height:800}});await sheet.setContent('<body style="margin:0;background:#eee;font:14px Arial">'+reports.map(r=>`<h3>${r.id}: ${r.title||r.error}</h3><div style="display:flex;flex-wrap:wrap">${(r.samples||[]).map((p,i)=>`<div style="width:33.33%"><div>${[8,30,55,80,96][i]}%</div><img style="width:100%" src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}"></div>`).join('')}</div>`).join('')+'</body>');await sheet.screenshot({path:dir+'/sheet-'+ids[0]+'.png',fullPage:true});
}finally{await b.close();}
