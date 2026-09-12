import fs from 'node:fs';
import {createStore} from '../backend/store.js';
const store=createStore('backend/data');const db=store.readDb();store.close();
// Export public teaching content only; never users, attempts, results or AI settings.
const allowed=['_id','title','name','description','category','author','type','url','storyPath','fileUrl','thumbnail','imageUrl','linkUrl','order','duration','source','sourceUrl','aiText','chatEnabled','questions','totalPoints','independent','assessmentBank','color','icon'];
const snapshot={};
for(const key of ['categories','banners','storybooks','videos','elearnings','quizzes'])snapshot[key]=db[key].filter(x=>x.isActive!==false).map(x=>Object.fromEntries(allowed.filter(k=>x[k]!==undefined).map(k=>[k,x[k]])));
const text=JSON.stringify(snapshot,null,2);
if(text.includes('/uploads/'))throw Error('Snapshot references local uploads. Package referenced public assets before exporting.');
fs.writeFileSync('docs/demo-library.json',text+'\n');
console.log(Object.fromEntries(Object.entries(snapshot).map(([k,v])=>[k,v.length])));
