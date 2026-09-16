import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createStore} from '../backend/store.js';
import {videoLink} from '../shared/video-links.js';
const topics=JSON.parse(fs.readFileSync(new URL('../docs/user-topic-videos.json',import.meta.url),'utf8'));
const category={_id:'user-literature-videos',name:'Video theo chủ đề văn học',isActive:true,order:9};
const rows=topics.map((v,i)=>{const link=videoLink(`https://youtu.be/${v.id}`,'youtube');return {_id:`user-topic-${v.key}`,title:v.title,author:v.author,description:v.description,category:category._id,url:link.url,sourceUrl:link.url,thumbnail:link.thumbnail,isActive:true,order:-30+i,viewCount:0};});
const store=createStore(process.env.DATA_DIR||fileURLToPath(new URL('../backend/data',import.meta.url)));
try{const db=store.readDb(),stamp=new Date().toISOString();
if(!db.categories.some(c=>c._id===category._id))db.categories.push({...category,createdAt:stamp,updatedAt:stamp});
for(const row of rows){const existing=db.videos.find(v=>v._id===row._id);if(existing)Object.assign(existing,{...row,viewCount:existing.viewCount,updatedAt:stamp});else db.videos.push({...row,createdAt:stamp,updatedAt:stamp});}
store.writeDb(db);
}finally{store.close();}
if(process.argv.includes('--snapshot')){
const file=new URL('../docs/demo-library.json',import.meta.url),db=JSON.parse(fs.readFileSync(file,'utf8'));
if(!db.categories.some(c=>c._id===category._id))db.categories.push(category);
for(const row of rows){const i=db.videos.findIndex(v=>v._id===row._id);if(i<0)db.videos.push(row);else db.videos[i]=row;}
fs.writeFileSync(file,JSON.stringify(db,null,2)+'\n');
}
console.log('Saved seven user-selected topic videos. Topics without URLs skipped.');
