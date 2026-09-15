import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {startTestServer} from '../tests/support.mjs';
import {createStore} from '../backend/store.js';
const s=await startTestServer({classrooms:true}),store=createStore(s.env.DATA_DIR);
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
 await s.request('POST','/teachers',{username:'material-owner',fullName:'Giáo viên chủ nhiệm',password:'TeacherTest!2026'},s.adminToken);
 const owner=(await s.request('POST','/auth/login',{username:'material-owner',password:'TeacherTest!2026'})).data;
 const c=(await s.request('POST','/classes',{name:'6A'},owner.token)).data.classroom;
 await s.request('POST','/auth/register',{username:'material-student',fullName:'Student',password:'StudentTest!2026'});
 const db=store.readDb(),kinds=['storybooks','videos','elearnings','quizzes'];
 for(const kind of kinds){const template=kind==='quizzes'?db.quizzes[0]:kind==='storybooks'?db.storybooks[0]:{url:'/reference/ba-luoi-riu.html'};db[kind].push({...structuredClone(template),_id:'ui-'+kind,title:'My '+kind,category:s.fixtures.category._id,classId:c._id,createdBy:owner.user._id,isActive:true,updatedAt:'2026-01-01T00:00:00.000Z'});}
 store.writeDb(db);
 const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(15000);
 await p.goto(s.base+'/login');await p.getByPlaceholder('username').fill('material-owner');await p.locator('input[type=password]').fill('TeacherTest!2026');await p.locator('button[type=submit]').click();await p.waitForURL(u=>u.pathname!=='/login',{waitUntil:'domcontentloaded'});
 fs.mkdirSync('artifacts/teacher-library',{recursive:true});
 for(const kind of kinds){
  await p.goto(s.base+'/'+kind);await p.getByRole('button',{name:'Chỉnh sửa My '+kind,exact:true}).click();const dialog=p.getByRole('dialog',{name:'Chỉnh sửa học liệu'});await dialog.getByLabel('Tiêu đề',{exact:true}).fill('Edited '+kind);
  if(kind==='quizzes'){await dialog.getByLabel('Nội dung câu 1',{exact:true}).fill('Câu hỏi đã được giáo viên sửa');await dialog.getByLabel('Đáp án đúng câu 1',{exact:true}).selectOption('1');}
  await dialog.getByRole('button',{name:'Lưu thay đổi',exact:true}).click();await dialog.waitFor({state:'hidden'});await p.getByRole('button',{name:'Chỉnh sửa Edited '+kind,exact:true}).waitFor();
  assert.equal(store.readDb()[kind].find(v=>v._id==='ui-'+kind).title,'Edited '+kind);
  assert.equal(p.url().includes('/'+kind),true,'Edit should not open learner page');
  if(kind==='quizzes')assert.equal(store.readDb().quizzes.find(v=>v._id==='ui-quizzes').questions[0].correctAnswer,1);
  await p.setViewportSize({width:390,height:844});await p.getByRole('button',{name:'Chỉnh sửa Edited '+kind,exact:true}).click();await p.getByRole('dialog').getByLabel('Tiêu đề',{exact:true}).waitFor();assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'artifacts/teacher-library/'+kind+'-mobile.png',fullPage:true});await p.getByRole('dialog').getByRole('button',{name:'Hủy',exact:true}).click();
  await p.getByRole('button',{name:'Xóa Edited '+kind,exact:true}).click();await p.getByRole('dialog',{name:'Xóa học liệu'}).getByRole('button',{name:'Hủy',exact:true}).click();assert.equal(store.readDb()[kind].find(v=>v._id==='ui-'+kind).isActive,true);
  await p.getByRole('button',{name:'Xóa Edited '+kind,exact:true}).click();await p.getByRole('dialog',{name:'Xóa học liệu'}).getByRole('button',{name:'Xác nhận xóa',exact:true}).click();await p.getByRole('dialog').waitFor({state:'hidden'});await p.getByRole('button',{name:'Xóa Edited '+kind,exact:true}).waitFor({state:'detached'});assert.equal(store.readDb()[kind].find(v=>v._id==='ui-'+kind).isActive,false);
  await p.setViewportSize({width:1440,height:1000});
 }
 const restore=store.readDb();for(const kind of kinds)restore[kind].find(v=>v._id==='ui-'+kind).isActive=true;store.writeDb(restore);
 const student=await browser.newPage();await student.goto(s.base+'/login');await student.getByPlaceholder('username').fill('material-student');await student.locator('input[type=password]').fill('StudentTest!2026');await student.locator('button[type=submit]').click();await student.waitForURL(u=>u.pathname!=='/login',{waitUntil:'domcontentloaded'});
 for(const kind of kinds){await student.goto(s.base+'/'+kind);await student.getByRole('heading',{name:'Edited '+kind,exact:true}).waitFor();assert.equal(await student.locator('.material-actions').count(),0);}
 assert.deepEqual(errors,[]);console.log('PASS: edit/delete/cancel all four menus, quiz answers, mobile dialogs, learner navigation and student visibility.');
}catch(error){for(const page of browser.contexts().flatMap(c=>c.pages())){console.log((await page.locator('body').innerText()).slice(-5000));await page.screenshot({path:'artifacts/teacher-library/failure.png',fullPage:true});}throw error;}finally{await browser.close();store.close();await s.stop();}
