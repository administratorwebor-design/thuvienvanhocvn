import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {startTestServer} from '../tests/support.mjs';
const s=await startTestServer({ai:true,classrooms:true,seed:false,assessmentResponse:prompt=>{
  const {content}=JSON.parse(prompt.split('TƯ LIỆU: ')[1]);
  if(content==='INVALID')return 'invalid json';
  const questions=Array.from({length:Number(prompt.match(/Tạo (\d+)/)[1])},(_,i)=>({question:`Nhân vật ${i+1}?`,options:['Tiều phu','Vua','Quan','Lính'],correctAnswer:0,explanation:'Theo nội dung bài học.'}));
  if(content==='DUPLICATE')questions[0].options[1]=questions[0].options[0];
  return JSON.stringify({questions});
}});
let browser;
try{
  for(const username of ['ai-teacher','ai-other'])await s.request('POST','/teachers',{username,password:'TeacherTest!2026',fullName:username},s.adminToken);
  const token=(await s.request('POST','/auth/login',{username:'ai-teacher',password:'TeacherTest!2026'})).data.token;
  const other=(await s.request('POST','/auth/login',{username:'ai-other',password:'TeacherTest!2026'})).data.token;
  const c=(await s.request('POST','/classes',{name:'AI 6A'},token)).data.classroom,base=`/classes/${c._id}/teacher-assessments`,input={topic:'Tình bạn',content:'Nội dung bài học về tình bạn.',count:2};
  assert.equal((await s.request('POST',base+'/generate',input)).status,401);
  assert.equal((await s.request('POST',base+'/generate',input,other)).status,403);
  for(const body of [{...input,count:21},{...input,count:0},{...input,count:'2'},{...input,topic:''},{...input,content:''}])assert.equal((await s.request('POST',base+'/generate',body,token)).status,400);
  for(const content of ['INVALID','DUPLICATE'])assert.equal((await s.request('POST',base+'/generate',{...input,content},token)).status,502);
  const generated=await s.request('POST',base+'/generate',input,token);assert.equal(generated.status,200);assert.equal(generated.data.questions.length,2);
  assert.equal(generated.data.questions[0].options[0].isCorrect,true);
  assert.equal((await s.request('GET',base,undefined,token)).data.quizzes.length,0);
  browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(s.base+'/login');await p.getByPlaceholder('username').fill('ai-teacher');await p.locator('input[type=password]').fill('TeacherTest!2026');await p.locator('button[type=submit]').click();await p.waitForURL(s.base+'/');
  const open=async()=>{await p.goto(s.base+'/classes/'+c._id);await p.locator('.class-sidebar').getByRole('button',{name:'Kiểm tra đánh giá',exact:true}).click();await p.locator('.assessment-ai summary').click();};
  await open();await p.getByLabel('Chủ đề trắc nghiệm').fill(input.topic);await p.getByLabel('Nội dung cho AI').fill(input.content);await p.getByLabel('Số câu AI tạo').fill('2');
  await p.getByRole('button',{name:'Tạo câu hỏi bằng AI',exact:true}).click();await p.getByRole('region',{name:'Câu hỏi AI chờ duyệt'}).waitFor();
  assert.equal(await p.getByLabel('Nội dung câu 1',{exact:true}).inputValue(),'');
  await open();await p.getByRole('region',{name:'Câu hỏi AI chờ duyệt'}).waitFor();assert.equal(await p.getByLabel('Chủ đề trắc nghiệm').inputValue(),input.topic);
  fs.mkdirSync('artifacts/teacher-assessments',{recursive:true});await p.screenshot({path:'artifacts/teacher-assessments/ai-preview.png',fullPage:true});
  await p.setViewportSize({width:390,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.getByRole('button',{name:'Thêm câu hỏi vào đề',exact:true}).click();assert.equal(await p.getByLabel('Nội dung câu 1',{exact:true}).inputValue(),'Nhân vật 1?');assert.equal(await p.getByLabel('Nội dung câu 3',{exact:true}).count(),0);
  await p.getByLabel('Nội dung câu 1',{exact:true}).fill('Câu giáo viên đã sửa');
  await p.getByLabel('Nội dung cho AI').fill('INVALID');await p.getByRole('button',{name:'Tạo câu hỏi bằng AI',exact:true}).click();await p.locator('.assessment-ai [role=alert]').waitFor();assert.equal(await p.getByLabel('Nội dung câu 1',{exact:true}).inputValue(),'Câu giáo viên đã sửa');
  await p.getByLabel('Nội dung cho AI').fill(input.content);await p.getByRole('button',{name:'Tạo câu hỏi bằng AI',exact:true}).click();await p.getByRole('button',{name:'Thêm câu hỏi vào đề',exact:true}).click();assert.equal(await p.getByLabel('Nội dung câu 1',{exact:true}).inputValue(),'Câu giáo viên đã sửa');assert.equal(await p.getByLabel('Nội dung câu 4',{exact:true}).inputValue(),'Nhân vật 2?');
  await p.getByRole('button',{name:'Lưu đề',exact:true}).click();await p.getByText('Đã lưu đề kiểm tra.',{exact:true}).waitFor();
  const quizzes=(await s.request('GET',base,undefined,token)).data.quizzes;assert.equal(quizzes.length,1);assert.equal(quizzes[0].questions.length,4);assert.equal(quizzes[0].questions[0].content,'Câu giáo viên đã sửa');assert.deepEqual(errors,[]);
  console.log('PASS: AI permissions, input/output validation, preview without save, persisted preview, blank replacement, manual edits preserved, failed generation recovery, append, save, mobile layout.');
}finally{await browser?.close();await s.stop();}

