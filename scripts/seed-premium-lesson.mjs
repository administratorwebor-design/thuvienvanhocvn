import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createStore} from '../backend/store.js';
const row={_id:'premium-gio-lanh-dau-mua',title:'Gió lạnh đầu mùa · Một chiếc áo, một tấm lòng',category:'demo-kntt-6',description:'Bài mẫu hoàn chỉnh: 9 chặng học, video định hướng, sơ đồ sự việc, khám phá nhân vật, 5 câu đọc hiểu có phản hồi và đoạn viết vận dụng. Lưu tiến độ, ghi chép và tải bài viết.',url:'/reference/gio-lanh-elearning/index.html',storyPath:'/reference/gio-lanh-elearning/index.html',thumbnail:'/reference/gio-lanh-elearning/cover.jpg',source:'Thạch Lam · Ngữ văn 6, tập một, Kết nối tri thức với cuộc sống. Video: Trang Sách Lên Hình.',order:-100,isActive:true,viewCount:0};
const store=createStore(process.env.DATA_DIR||fileURLToPath(new URL('../backend/data',import.meta.url)));
try{const db=store.readDb(),stamp=new Date().toISOString();if(!db.categories.some(c=>c._id===row.category))db.categories.push({_id:row.category,name:'Ngữ văn 6 · Kết nối tri thức',isActive:true});if(!db.elearnings.some(e=>e._id===row._id))db.elearnings.push({...row,createdAt:stamp,updatedAt:stamp});store.writeDb(db);}finally{store.close();}
const file=new URL('../docs/demo-library.json',import.meta.url),snapshot=JSON.parse(fs.readFileSync(file,'utf8'));if(!snapshot.elearnings.some(e=>e._id===row._id)){snapshot.elearnings.push(row);fs.writeFileSync(file,JSON.stringify(snapshot,null,2)+'\n');}
console.log('Premium Gió lạnh đầu mùa lesson added.');
