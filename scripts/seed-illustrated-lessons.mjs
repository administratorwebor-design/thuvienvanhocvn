import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createStore} from '../backend/store.js';
const rows=JSON.parse(fs.readFileSync(new URL('../docs/illustrated-lessons.json',import.meta.url),'utf8'));
const store=createStore(process.env.DATA_DIR||fileURLToPath(new URL('../backend/data',import.meta.url)));
const db=store.readDb(),stamp=new Date().toISOString();
if(!db.categories.some(c=>c._id==='demo-kntt-6'))db.categories.push({_id:'demo-kntt-6',name:'Ngữ văn 6 · Kết nối tri thức',isActive:true,createdAt:stamp,updatedAt:stamp});
for(const row of rows)if(!db.elearnings.some(e=>e._id===row._id))db.elearnings.push({...row,createdAt:stamp,updatedAt:stamp});
store.writeDb(db);store.close();console.log('Added five illustrated lessons; existing materials preserved.');
