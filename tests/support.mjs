import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
export async function startTestServer({ ai = false, seed = true, classrooms = false, studio = false, lessonGeneration = false, assessmentResponse } = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'literature-test-'));
  const probe = http.createServer(); probe.listen(0, '127.0.0.1'); await once(probe, 'listening');
  const port = probe.address().port; await new Promise(resolve => probe.close(resolve));
  const aiRequests = [];
  const fakeAi = http.createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    const requestBody=JSON.parse(body),prompt=requestBody.contents[0].parts[0].text;
    if(assessmentResponse && prompt.startsWith('TEACHER_ASSESSMENT_V1')) {
      const text=assessmentResponse(prompt);
      res.setHeader('Content-Type','application/json');res.end(JSON.stringify({candidates:[{content:{parts:[{text}]}}]}));return;
    }
    if(lessonGeneration)aiRequests.push(requestBody);
    if(lessonGeneration&&prompt.startsWith('LESSON_GENERATION_V1')){
      const input=JSON.parse(prompt.split('TƯ LIỆU: ')[1]);
      const plan=input.content.includes('TEST_INVALID_AI')?{slides:[],questions:[]}:{slides:Array.from({length:input.slideCount},(_,i)=>({title:`Phần ${i+1}: Yêu thương và sẻ chia`,body:`Kiến thức bài học ${i+1}. Quan sát hình ảnh và liên hệ với nội dung giáo viên cung cấp.`,imageIndex:i<input.images.length?i:-1})),questions:Array.from({length:input.questionCount},(_,i)=>({question:`Câu hỏi luyện tập ${i+1}: Em học được điều gì?`,options:['Biết quan tâm và chia sẻ','Thờ ơ với mọi người','Chỉ nghĩ đến bản thân','Bỏ qua khó khăn của bạn'],correctAnswer:0,explanation:'Câu chuyện nhắc chúng ta biết quan tâm đến người khác.',afterSlide:Math.ceil((i+1)*input.slideCount/input.questionCount)}))};
      res.setHeader('Content-Type','application/json');res.end(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(plan)}]}}]}));return;
    }
    if (studio && prompt.includes('"scenes"')) {
      const text = JSON.stringify({ scenes: Array.from({length:6}, (_,i)=>({title:`Cảnh ${i+1}`,prompt:`Tranh màu nước dọc 2:3, cô bé áo nâu, khăn đỏ trong đêm tuyết. Cảnh ${i+1}, không chữ, chừa khoảng trống phía dưới.`,narration:`Lời kể cảnh ${i+1}: Em bé thắp lên ánh sáng trong đêm đông.`})) });
      res.setHeader('Content-Type','application/json');res.end(JSON.stringify({candidates:[{content:{parts:[{text}]}}]}));return;
    }
    const count = Number(prompt.match(/Tạo (\d+)/)?.[1] || 5);
    const text = prompt.includes('"cards"') ? JSON.stringify({ cards: Array.from({ length: count }, (_, i) => ({ front: `Câu hỏi ${i + 1}`, back: 'Câu trả lời ôn tập.' })) }) : prompt.includes('"questions"') ? JSON.stringify({ questions: Array.from({ length: count }, (_, i) => ({ question: `Nhân vật ${i + 1}?`, options: ['Tiều phu', 'Vua', 'Quan', 'Lính'], correctAnswer: 0, explanation: 'Theo văn bản đã cung cấp.' })) }) : 'Từ đơn là từ chỉ có một tiếng. Ví dụ: cây, nhà.';
    res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }));
  });
  fakeAi.listen(0, '127.0.0.1'); await once(fakeAi, 'listening');
  const env = { ...process.env, LOAD_ENV: 'false', NODE_ENV: 'test', PORT: String(port), DATA_DIR: path.join(directory, 'data'), UPLOAD_DIR: path.join(directory, 'uploads'), ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'ReviewAdmin!2026', JWT_SECRET: 'isolated-test-secret-32-characters-long', GEMINI_API_KEY: ai ? 'test-only-key' : '', GEMINI_MODEL: 'test-model', GEMINI_FALLBACK_MODELS: '', AI_TEST_URL: `http://127.0.0.1:${fakeAi.address().port}`, PUBLIC_BASE_URL: '', MAIL_TRANSPORT: 'file', SMTP_HOST: '', APP_URL: `http://127.0.0.1:${port}` };
  env.CLASSROOMS_ENABLED = String(classrooms);
  const child = spawn(process.execPath, ['backend/server.js'], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = ''; child.stdout.on('data', b => { logs += b; }); child.stderr.on('data', b => { logs += b; });
  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 15000;
  let ready = false;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) break;
    try { if ((await fetch(`${base}/api/health`)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  async function stop() { if (child.exitCode === null) { child.kill(); await once(child, 'exit'); } await new Promise(resolve => fakeAi.close(resolve)); }
  if (!ready) { await stop(); throw new Error(logs); }
  async function request(method, route, body, token) {
    const response = await fetch(`${base}/api${route}`, { method, headers: { ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body) });
    return { status: response.status, data: await response.json(), headers: response.headers };
  }
  const login = await request('POST', '/auth/login', { username: 'admin', password: env.ADMIN_PASSWORD });
  if (login.status !== 200) { await stop(); throw new Error(JSON.stringify(login)); }
  const adminToken = login.data.token;
  let fixtures;
  if (seed) {
    const category = (await request('POST', '/categories', { name: 'Ngữ Văn 6' }, adminToken)).data.category;
    const form = new FormData(); form.set('title', 'Ba lưỡi rìu'); form.set('category', category._id); form.set('url', '/reference/ba-luoi-riu.html'); form.set('textFile', new Blob(['Một người tiều phu làm rơi rìu. Ông cụ giúp tìm rìu. Anh chỉ nhận chiếc rìu sắt của mình.']), 'story.txt');
    const story = (await request('POST', '/storybooks/heyzine', form, adminToken)).data.storybook;
    const quiz = (await request('POST', '/quizzes', { title: 'Ôn tập Ngữ Văn 6', category: category._id, order: 0, duration: 10, questions: [{ id: 'q-mc', content: 'Ai làm rơi rìu?', type: 'multiple_choice', points: 1, options: [{ id: 'a', content: 'Tiều phu', isCorrect: true }, { id: 'b', content: 'Nhà vua', isCorrect: false }], explanation: 'Người tiều phu làm rơi chiếc rìu.' }, { id: 'q-essay', content: 'Em học được điều gì?', type: 'essay', points: 2 }] }, adminToken)).data.quiz;
    if (!story || !quiz) { await stop(); throw new Error('Fixture creation failed: ' + logs); }
    fixtures = { category, story, quiz };
  }
  return { base, directory, request, adminToken, fixtures, stop, env, aiRequests };
}
