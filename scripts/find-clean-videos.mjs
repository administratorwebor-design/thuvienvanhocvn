import {chromium} from 'playwright';
import fs from 'node:fs';
const dir='artifacts/clean-videos';fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const results=[];
try {for(const query of (process.argv.length>2?process.argv.slice(2):['Hang En cave cinematic','Co To island cinematic Vietnam','Vietnam bamboo forest nature','Mây và sóng hoạt hình','Gió lạnh đầu mùa hoạt hình'])){
 const p=await b.newPage();await p.goto('https://www.youtube.com/results?search_query='+encodeURIComponent(query),{waitUntil:'domcontentloaded',timeout:60000});await p.waitForFunction(()=>window.ytInitialData,{timeout:30000});
 const rows=await p.evaluate(()=>{const out=[];function walk(v){if(!v||typeof v!=='object')return;if(v.videoRenderer){const r=v.videoRenderer;out.push({id:r.videoId,title:r.title?.runs?.map(x=>x.text).join(''),author:r.ownerText?.runs?.map(x=>x.text).join(''),duration:r.lengthText?.simpleText});}for(const x of Object.values(v))if(typeof x==='object')walk(x);}walk(window.ytInitialData);return out;});results.push({query,rows:rows.slice(0,10)});console.log(JSON.stringify(results.at(-1)));await p.close();
 }fs.writeFileSync(dir+'/search.json',JSON.stringify(results,null,2));}finally{await b.close();}
