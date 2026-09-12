import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { startTestServer } from '../tests/support.mjs';
import { seedTextbook } from './seed-textbook.mjs';
const topics=JSON.parse(fs.readFileSync('docs/textbook-demo.json','utf8'));
const server=await startTestServer({ai:true});
let browser;
try {
  seedTextbook(path.join(server.directory,'data'));
  seedTextbook(path.join(server.directory,'data'));
  for(const collection of ['elearnings','quizzes']) {
    const response=await server.request('GET',`/${collection}?limit=100`,undefined,server.adminToken);
    assert.equal(response.status,200);
    const list=response.data[collection];
    assert.equal(list.filter(r=>r._id.startsWith('demo-')).length,2,`${collection}: idempotent seed`);
  }
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await page.goto(server.base+'/login');await page.locator('input').first().fill('admin');await page.locator('input[type=password]').fill('ReviewAdmin!2026');await page.locator('button[type=submit]').click();await page.waitForURL(server.base+'/');
  fs.mkdirSync('artifacts/textbook/checks',{recursive:true});
  const oldStory=await server.request('GET','/storybooks/reference-ba-luoi-riu');
  assert.equal(oldStory.status,200);
  for(const topic of topics) {
    assert.equal((await server.request('GET',`/storybooks/demo-${topic.id}`)).status,404);
    assert.equal((await server.request('GET',`/videos/demo-video-${topic.id}`,undefined,server.adminToken)).status,404);
    assert.ok(!fs.existsSync(`dist/reference/textbook/${topic.id}/video.mp4`));
  }
  await page.goto(`${server.base}/storybooks/reference-ba-luoi-riu`);
  const reader=page.frameLocator('iframe');
  await reader.getByText('1 / 6',{exact:true}).waitFor();
  await reader.getByRole('button',{name:'Trang sau',exact:true}).click();
  await reader.getByText('2 / 6',{exact:true}).waitFor();
  await reader.getByText(/Ngày xưa có một anh tiều phu/).waitFor();
  assert.ok(await reader.locator('.story-image[src="story-intro.jpg"]').evaluate(img=>img.complete&&img.naturalWidth>0));
  await page.screenshot({path:'artifacts/textbook/checks/restored-story.png',fullPage:true});
  console.log('PASS original illustrated story restored; rejected PDF stories and videos removed');
  for(const topic of topics) {
    await page.goto(`${server.base}/elearning/demo-lesson-${topic.id}`);
    const lesson=page.frameLocator('iframe');
    await lesson.locator('#title').getByText(topic.title,{exact:true}).waitFor();
    await lesson.locator('#audio').evaluate(async a=>{a.muted=true;await a.play();});
    await page.waitForTimeout(300);
    assert.ok(await lesson.locator('#audio').evaluate(a=>a.currentTime>0&&!a.error));
    await page.screenshot({path:`artifacts/textbook/checks/${topic.id}-lesson.png`,fullPage:true});
    const questions=topic.questions.filter(q=>q.type!=='essay');
    for(const [i,q] of questions.entries()) {
      await lesson.locator('#menu button').nth(6+i).click();
      await lesson.locator('input[type=radio]').nth(q.correctAnswer).check();
      await lesson.getByRole('button',{name:'Kiểm tra',exact:true}).click();
      await lesson.locator('#feedback').filter({hasText:'Đúng!'}).waitFor();
    }
    await lesson.locator('#menu button').last().click();await lesson.locator('#result strong').getByText('6 / 6',{exact:true}).waitFor();
    await lesson.getByRole('button',{name:'Luyện tập lại'}).click();
    assert.equal(await lesson.locator('input:checked').count(),0);
    await page.goto(`${server.base}/quiz/demo-quiz-${topic.id}`);
    await page.getByRole('button',{name:/Bắt đầu/}).click();
    for(const [i,q] of questions.entries()) await page.locator('input[type=radio]').nth(i*4+q.correctAnswer).check();
    await page.locator('textarea').fill('Em sẽ quan tâm và giúp đỡ bạn bằng những việc làm cụ thể, không trêu chọc bạn.');
    await page.getByRole('button',{name:/Nộp bài/}).click();await page.getByText('Đã nộp bài!',{exact:true}).waitFor();
    console.log('PASS',topic.id,': lesson narration, 6 interactive questions and final quiz');
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(server.base+'/reference/textbook/co-be-ban-diem/lesson.html');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('button',{name:'Mục lục',exact:true}).click();
  await page.locator('#menu button').nth(6).click();
  await page.screenshot({path:'artifacts/textbook/checks/mobile-lesson.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS mobile layout; zero browser runtime errors');
} finally {await browser?.close();await server.stop();}
