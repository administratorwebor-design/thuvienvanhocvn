import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||(process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
try{
const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.route('https://www.youtube.com/embed/**',r=>r.fulfill({contentType:'text/html',body:'<html lang="vi"><body style="background:#203b32;color:white">Video YouTube</body></html>'}));
await p.goto('http://127.0.0.1:4000/reference/gio-lanh-elearning/index.html');await p.locator('.hero img').evaluate(i=>i.decode());await p.screenshot({path:'artifacts/premium-lesson-desktop.png',fullPage:true});
await p.locator('nav button').nth(1).click();await p.locator('[data-reflect="0"]').click();assert.match(await p.locator('#reflection').innerText(),/tế nhị/);
await p.locator('nav button').nth(2).click();assert.match(await p.locator('iframe').getAttribute('src'),/tFFfeKO4zx4/);await p.locator('#video-note').fill('Em chú ý cách Sơn giúp Hiên.');
await p.locator('nav button').nth(3).click();for(const [i,n]of [4,1,3,2].entries())await p.locator(`[data-order="${i}"]`).selectOption(String(n));await p.locator('#order-check').click();assert.match(await p.locator('#order-feedback').innerText(),/Chính xác/);
await p.locator('nav button').nth(4).click();await p.locator('[data-reveal="0"]').click();assert.equal(await p.locator('[data-reveal="0"]').getAttribute('aria-expanded'),'true');
await p.locator('nav button').nth(6).click();await p.locator('#quiz button[type=submit]').click();assert.match(await p.locator('#quiz-score').innerText(),/0\/5/);for(const [i,n]of [1,0,2,1,0].entries())await p.locator(`input[name=q${i}][value="${n}"]`).check();await p.locator('#quiz button[type=submit]').click();assert.match(await p.locator('#quiz-score').innerText(),/5\/5/);
await p.locator('nav button').nth(7).click();await p.locator('#writing').fill('Em sẽ hỏi thăm bạn và trao đổi với mẹ để giúp bạn có áo ấm.');await p.locator('[data-criterion="0"]').check();const download=p.waitForEvent('download');await p.locator('#download').click();assert.match((await download).suggestedFilename(),/\.txt$/);
await p.reload();assert.match(await p.locator('#writing').inputValue(),/hỏi thăm/);assert.ok(await p.locator('[data-criterion="0"]').isChecked());
await p.locator('nav button').nth(6).click();assert.match(await p.locator('#quiz-score').innerText(),/5\/5/);await p.locator('nav button').nth(8).click();assert.match(await p.locator('.summary').innerText(),/Đã viết/);
await p.setViewportSize({width:390,height:844});for(let i=0;i<9;i++){await p.locator('nav button').nth(i).click();assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Mobile chapter ${i}`);}await p.locator('nav button').first().click();await p.screenshot({path:'artifacts/premium-lesson-mobile.png',fullPage:true});
await p.locator('#reset').click();await p.locator('#cancel-reset').click();await p.locator('nav button').nth(7).click();assert.match(await p.locator('#writing').inputValue(),/hỏi thăm/);
assert.deepEqual(errors,[]);console.log('PASS: 9 chapters, video embed mapping (playback mocked), reflection, ordering, reveal cards, quiz 0/5 and 5/5, persisted answers/writing/checklist, download, reset cancellation, all mobile layouts.');
}finally{await browser.close();}
