import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { startTestServer } from '../tests/support.mjs';
const s=await startTestServer({classrooms:true,seed:false});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(s.base+'/login'); await page.getByPlaceholder('username').fill('admin');await page.locator('input[type=password]').fill('ReviewAdmin!2026');await page.locator('button[type=submit]').click();await page.waitForURL(s.base+'/');
 const names=['Nguyễn Minh An','Trần Bảo Ngọc','Lê Hoàng Nam','Phạm Minh Anh'];
 const members=names.map((fullName,i)=>({_id:'m'+i,studentId:'s'+i,status:'approved',student:{fullName}}));
 const assignments=['Bài học đường đời đầu tiên','Nếu cậu muốn có một người bạn','Bắt nạt'].map((title,i)=>({_id:'a'+i,title,kind:'quizzes',isActive:true}));
 const data={classroom:{name:'Lớp 6A · Ngữ văn',school:'THCS Demo',schoolYear:'2026–2027',studentCount:4,teacher:{fullName:'Cô Lan'},joinCode:'DEMO',available:true},members,assignments,activity:[{studentId:'s1',assignmentId:'a0',lastSeenAt:new Date().toISOString()},{studentId:'s2',assignmentId:'a0',selfCompletedAt:new Date().toISOString()}],results:[{user:'s0',assignmentId:'a0',submittedAt:new Date().toISOString(),publishedAt:'yes',quiz:{title:'B?i h?c ???ng ??i ??u ti?n'},maxScore:10,totalScore:8,answers:[]}]};
 await page.route('**/api/classes/layout-preview',r=>r.fulfill({json:data}));
 await page.goto(s.base+'/classes/layout-preview');await page.getByRole('button',{name:'Tiến độ',exact:true}).click();
 await page.getByRole('heading',{name:'Trạng thái bài học'}).waitFor();
 assert.deepEqual(await page.locator('.progress-legend b').allTextContents(),['9','1','1','1']);
 const sidebar=await page.locator('.class-sidebar').boundingBox(),list=await page.locator('.progress-students').boundingBox(),charts=await page.locator('.progress-charts').boundingBox(); assert(sidebar.x+sidebar.width<=list.x);assert(list.x+list.width<=charts.x);
 await page.getByText('Nguyễn Minh An',{exact:true}).click();await page.locator('.progress-task-details').first().waitFor({state:'visible'});
 await page.getByLabel('Tìm học sinh').fill('Bảo');assert.equal(await page.locator('.progress-students tbody tr').count(),1);await page.getByLabel('Tìm học sinh').fill('');
 await page.getByLabel('Bài học',{exact:true}).selectOption('a0');assert.deepEqual(await page.locator('.progress-legend b').allTextContents(),['1','1','1','1']);
 await page.getByLabel('Bài học',{exact:true}).selectOption('all');
 fs.mkdirSync('artifacts/classrooms',{recursive:true}); await page.screenshot({path:'artifacts/classrooms/progress-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844}); assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'artifacts/classrooms/progress-mobile.png',fullPage:true});
 for(const label of ['Bài được giao','Học sinh (4)','Chấm tự luận (0)','Bảng điểm','Tiến độ'])await page.getByRole('button',{name:label,exact:true}).click();
 data.members=[];data.assignments=[];data.activity=[];data.results=[];await page.reload();await page.getByRole('button',{name:'Tiến độ',exact:true}).click();await page.getByText('Chưa có dữ liệu tiến độ.',{exact:true}).waitFor();
 assert.equal(errors.length,0,errors.join('\n'));console.log('PASS desktop columns, counts, filters, student details, mobile overflow, all menu sections, empty state, no browser errors');
} finally {await browser.close();await s.stop();}
