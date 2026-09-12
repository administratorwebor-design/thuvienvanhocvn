import {createStore} from '../backend/store.js';
import {fileURLToPath} from 'node:url';
const store=createStore(process.env.DATA_DIR||fileURLToPath(new URL('../backend/data',import.meta.url)));
const db=store.readDb(),id='demo-lesson-may-va-song',stamp=new Date().toISOString();
if(!db.elearnings.some(x=>x._id===id))db.elearnings.push({_id:id,title:'Mây và sóng – Một thế giới bên mẹ',category:'demo-kntt-6',description:'7 slide có hình minh họa riêng, phối màu và bố cục đa dạng, lời đọc tiếng Việt; 4 câu luyện tập và hoạt động viết về người thân.',url:'/reference/may-va-song/lesson.html',storyPath:'/reference/may-va-song/lesson.html',thumbnail:'/reference/may-va-song/poster.png',source:'Ngữ văn 6, tập một, Kết nối tri thức với cuộc sống, trang 44–46.',isActive:true,order:-8,viewCount:0,createdAt:stamp,updatedAt:stamp});
store.writeDb(db);store.close();console.log('Added May va song lesson; existing lessons preserved.');
