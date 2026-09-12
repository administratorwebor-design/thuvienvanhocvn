import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
export async function startTestServer({ ai = false, seed = true } = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'literature-test-'));
  const probe = http.createServer(); probe.listen(0, '127.0.0.1'); await once(probe, 'listening');
  const port = probe.address().port; await new Promise(resolve => probe.close(resolve));
  const fakeAi = http.createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    const prompt = JSON.parse(body).contents[0].parts[0].text;
    const count = Number(prompt.match(/Tạo (\d+)/)?.[1] || 5);
    const text = prompt.includes('"cards"') ? JSON.stringify({ cards: Array.from({ length: count }, (_, i) => ({ front: `Câu hỏi ${i + 1}`, back: 'Câu trả lời ôn tập.' })) }) : prompt.includes('"questions"') ? JSON.stringify({ questions: Array.from({ length: count }, (_, i) => ({ question: `Nhân vật ${i + 1}?`, options: ['Tiều phu', 'Vua', 'Quan', 'Lính'], correctAnswer: 0, explanation: 'Theo văn bản đã cung cấp.' })) }) : 'Từ đơn là từ chỉ có một tiếng. Ví dụ: cây, nhà.';
    res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }));
  });
  fakeAi.listen(0, '127.0.0.1'); await once(fakeAi, 'listening');
  const env = { ...process.env, LOAD_ENV: 'false', NODE_ENV: 'test', PORT: String(port), DATA_DIR: path.join(directory, 'data'), UPLOAD_DIR: path.join(directory, 'uploads'), ADMIN_USERNAME: 'admin', ADMIN_PASSWORD: 'ReviewAdmin!2026', JWT_SECRET: 'isolated-test-secret-32-characters-long', GEMINI_API_KEY: ai ? 'test-only-key' : '', GEMINI_MODEL: 'test-model', GEMINI_FALLBACK_MODELS: '', AI_TEST_URL: `http://127.0.0.1:${fakeAi.address().port}`, PUBLIC_BASE_URL: '', MAIL_TRANSPORT: 'file', SMTP_HOST: '', APP_URL: `http://127.0.0.1:${port}` };
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
  return { base, directory, request, adminToken, fixtures, stop, env };
}
