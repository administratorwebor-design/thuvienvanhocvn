import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bank } from '../docs/assessment-bank.mjs';
import { normalizeQuizQuestions } from '../backend/quizzes.js';
import { createStore } from '../backend/store.js';
const root=fileURLToPath(new URL('../',import.meta.url));
export function seedAssessments(directory=process.env.DATA_DIR||path.join(root,'backend/data')) {
  const store=createStore(directory),db=store.readDb(),now=new Date().toISOString();
  const categories=[...new Set(bank.map(t=>t.category))];
  const add=(collection,item)=>{if(!db[collection].some(row=>row._id===item._id))db[collection].push({createdAt:now,updatedAt:now,isActive:true,...item});};
  for(const [i,name] of categories.entries())add('categories',{_id:`assessment-category-${i+1}`,name,description:'Kiểm tra Ngữ văn 6 – Kết nối tri thức, tập một',order:i,color:'#9333ea',icon:'BookOpen'});
  for(const topic of bank) {
    if(topic.questions.length!==10||topic.questions.filter(q=>q.type==='multiple_choice').length!==8||topic.questions.filter(q=>q.type==='essay').length!==2)throw Error('Invalid paper '+topic.id);
    const questions=normalizeQuizQuestions(topic.questions.map(q=>({...q,options:q.options?.map((content,i)=>({id:`${q.id}-o${i}`,content,isCorrect:i===q.correctAnswer}))})));
    if(questions.reduce((sum,q)=>sum+q.points,0)!==10)throw Error('Invalid score '+topic.id);
    add('quizzes',{_id:`assessment-${topic.id}`,category:`assessment-category-${categories.indexOf(topic.category)+1}`,title:`Đề ${String(topic.number).padStart(2,'0')} · ${topic.title}`,description:`Đọc ngữ liệu và trả lời câu hỏi bên dưới.\n\n${topic.passage}\n\nNguồn kiến thức: ${topic.sourceNote}`,duration:30,order:topic.number-1,totalPoints:10,questions,independent:true,assessmentBank:'kntt6-volume1-v1',source:topic.sourceNote});
  }
  for(const id of ['demo-quiz-bai-hoc-duong-doi','demo-quiz-co-be-ban-diem','reference-quiz-trung-thuc']) {
    const old=db.quizzes.find(row=>row._id===id);if(old){old.isActive=false;old.updatedAt=now;}
  }
  store.writeDb(db);store.close();
  return {papers:bank.length,questions:bank.reduce((sum,t)=>sum+t.questions.length,0),categories:categories.length};
}
export function writeTeacherGuide() {
  const lines=['# Ngân hàng 20 đề – Ngữ văn 6, Kết nối tri thức, tập một','','Mỗi đề: 30 phút; 8 trắc nghiệm + 2 tự luận; mỗi câu 1 điểm, tổng 10 điểm. Ngữ liệu tóm tắt/tự biên soạn được ghi rõ; trích thơ đối chiếu với PDF được cung cấp. Đây là bộ đề biên soạn cho dự án, không phải đề chính thức của nhà xuất bản.','','Các chủ đề độc lập: học sinh được chọn đề bất kỳ, mỗi đề nộp một lần. Trắc nghiệm chấm tự động; tự luận do giáo viên chấm. Chấm một trong hai câu tự luận chưa được coi là hoàn tất.','','## Danh mục','', '| Đề | Chủ đề | Nhóm | Trang sách |','|---|---|---|---|'];
  for(const t of bank)lines.push(`| ${t.number} | ${t.title} | ${t.category} | ${t.pages.join(', ')} |`);
  for(const t of bank){lines.push('',`## Đề ${t.number}: ${t.title}`,'',t.sourceNote,'',t.passage,'');for(const [i,q] of t.questions.entries()){lines.push(`### Câu ${i+1}`,'',q.content,'');if(q.options){q.options.forEach((o,j)=>lines.push(`${String.fromCharCode(65+j)}. ${o}`));lines.push('',`**Đáp án: ${String.fromCharCode(65+q.correctAnswer)}.** ${q.explanation}`);}else lines.push(`Gợi ý cho học sinh: ${q.hint}`,'',q.explanation);}}
  fs.writeFileSync(path.join(root,'docs/ASSESSMENT-GUIDE.md'),lines.join('\n')+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){writeTeacherGuide();console.log(seedAssessments());}
