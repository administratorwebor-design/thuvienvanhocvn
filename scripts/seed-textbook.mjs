import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from '../backend/store.js';
import { normalizeQuizQuestions } from '../backend/quizzes.js';
import { seedReference } from './seed-reference.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function seedTextbook(directory=process.env.DATA_DIR || path.join(root,'backend/data')) {
  const topics=JSON.parse(fs.readFileSync(path.join(root,'docs/textbook-demo.json'),'utf8'));
  seedReference(directory);
  const store=createStore(directory),db=store.readDb(),now=new Date().toISOString();
  // Only insert deterministic demo IDs; reruns preserve edits and learning history.
  const add=(collection,item)=>{if(!db[collection].some(r=>r._id===item._id))db[collection].push({createdAt:now,updatedAt:now,isActive:true,...item});};
  const category='demo-kntt-6';
  add('categories',{_id:category,name:'Ngữ văn 6 · Kết nối tri thức',description:'Hai bài học mẫu từ sách giáo khoa tập một.',order:-10,color:'#16645c',icon:'BookOpen'});
  for(const [order,topic] of topics.entries()) {
    const url=`/reference/textbook/${topic.id}`;
    const common={category,title:topic.title,thumbnail:`${url}/poster.jpg`,order:order-10,viewCount:0,source:topic.source};
    // Withdraw the rejected PDF storybooks and slideshow videos, including seeded cards.
    db.storybooks=db.storybooks.filter(row=>row._id!==`demo-${topic.id}`);
    db.videos=db.videos.filter(row=>row._id!==`demo-video-${topic.id}`);
    db.flashcards=db.flashcards.filter(row=>!row._id.startsWith(`demo-cards-${topic.id}-`));
    add('elearnings',{...common,_id:`demo-lesson-${topic.id}`,url:`${url}/lesson.html`,storyPath:`${url}/lesson.html`,fileUrl:'',description:`6 phần khám phá có lời đọc, 6 câu luyện tập và hoạt động vận dụng. ${topic.source}.`});
    const questions=normalizeQuizQuestions(topic.questions);
    add('quizzes',{...common,_id:`demo-quiz-${topic.id}`,title:`Ôn tập: ${topic.title}`,duration:15,description:`6 câu trắc nghiệm có giải thích và 1 câu tự luận do giáo viên chấm. ${topic.source}.`,questions,totalPoints:questions.reduce((sum,q)=>sum+q.points,0)});
  }
  // Hide only the previous generic starter materials from public demo lists.
  for(const [collection,id] of [['quizzes','reference-quiz-trung-thuc'],['elearnings','reference-lesson-truyen-dan-gian']]) {
    const row=db[collection].find(r=>r._id===id);if(row){row.isActive=false;row.updatedAt=now;}
  }
  const original=db.storybooks.find(row=>row._id==='reference-ba-luoi-riu');
  original.isActive=true;
  original.url='/reference/ba-luoi-riu.html';
  original.thumbnail='/reference/ba-luoi-riu.jpg';
  original.aiText=original.aiText.replace('rìu vàng, rìu bạc rồi rìu sắt','rìu bạc, rìu vàng rồi rìu sắt');
  original.updatedAt=now;
  store.writeDb(db);store.close();
  console.log('Original illustrated story restored. Textbook lessons and quizzes retained; rejected stories and videos removed.');
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))seedTextbook();
