import { createStore } from '../backend/store.js';
import { fileURLToPath } from 'node:url';
const store=createStore(process.env.DATA_DIR || fileURLToPath(new URL('../backend/data/',import.meta.url)));
const db=store.readDb();
const stamp=new Date().toISOString();
const category='demo-ai-literature';
if(!db.categories.some(c=>c._id===category))db.categories.push({_id:category,name:'Hoạt hình văn học',isActive:true,createdAt:stamp,updatedAt:stamp,order:10});
const videos=[
  {id:'WBqijL_58-w',key:'de-men',title:'Bài học đường đời đầu tiên – Hoạt hình AI',author:'Tập Làm Phim Hoạt Hình A.I',duration:155,description:'Video kể chuyện về Dế Mèn, gợi mở bài học về sự kiêu căng và trách nhiệm với người khác. Xem kết hợp với văn bản Bài học đường đời đầu tiên trong Ngữ văn 6.\nCâu hỏi sau khi xem: Hành động của Dế Mèn gây ra hậu quả gì? Em rút ra bài học nào?'},
  {id:'RPfJd-tyysI',key:'ban-diem',title:'Cô bé bán diêm – Kể chuyện cùng AI',author:'Học AI Cùng Thảo',duration:101,description:'Video minh họa câu chuyện Cô bé bán diêm, dùng khởi động hoạt động đọc hiểu về lòng nhân ái và sự sẻ chia.\nCâu hỏi sau khi xem: Em có cảm xúc gì trước hoàn cảnh của cô bé? Chúng ta có thể làm gì để giúp những người gặp khó khăn?'}
];
for(const v of videos){
  const id='demo-youtube-'+v.key;
  if(db.videos.some(row=>row._id===id))continue;
  db.videos.push({_id:id,title:v.title,author:v.author,duration:v.duration,category,url:`https://www.youtube.com/watch?v=${v.id}`,thumbnail:`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,description:v.description+`\n\nNguồn: ${v.author} (YouTube). Video được tác giả giới thiệu là sử dụng AI; là tư liệu tham khảo minh họa, không phải bản đọc nguyên văn sách.`,sourceUrl:`https://www.youtube.com/watch?v=${v.id}`,isActive:true,createdAt:stamp,updatedAt:stamp,order:videos.indexOf(v),viewCount:0});
}
store.writeDb(db);store.close();console.log('Added two attributed YouTube demo videos.');
