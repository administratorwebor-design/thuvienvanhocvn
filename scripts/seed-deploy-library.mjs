import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createStore} from '../backend/store.js';
const snapshot=JSON.parse(fs.readFileSync(new URL('../docs/demo-library.json',import.meta.url),'utf8'));
const store=createStore(process.env.DATA_DIR||fileURLToPath(new URL('../backend/data',import.meta.url))),db=store.readDb(),stamp=new Date().toISOString();
const retired=JSON.parse(fs.readFileSync(new URL('../docs/curated-videos.json',import.meta.url),'utf8')).retiredIds;
for(const row of db.videos)if(retired.includes(row._id)&&row.isActive!==false){row.isActive=false;row.updatedAt=stamp;}
for(const key of ['categories','banners','storybooks','videos','elearnings','quizzes'])for(const row of snapshot[key])if(!db[key].some(x=>x._id===row._id))db[key].push({...row,isActive:true,createdAt:stamp,updatedAt:stamp,viewCount:0});
store.writeDb(db);store.close();console.log('Current public library snapshot loaded; no local accounts or results imported.');
