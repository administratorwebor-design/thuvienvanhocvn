import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { startTestServer } from './support.mjs';
import { createStore } from '../backend/store.js';
import AdmZip from '../backend/node_modules/adm-zip/adm-zip.js';
let server, token, otherToken;
before(async () => {
  server = await startTestServer({ ai: true });
  for (const username of ['student1', 'student2']) assert.equal((await server.request('POST', '/auth/register', { username, email: `${username}@example.test`, password: 'Student!2026' })).status, 201);
  token = (await server.request('POST', '/auth/login', { username: 'student1', password: 'Student!2026' })).data.token;
  otherToken = (await server.request('POST', '/auth/login', { username: 'student2', password: 'Student!2026' })).data.token;
});
after(async () => { await server?.stop(); });
test('Private files are never served and untrusted CORS origins are rejected', async () => {
  for (const route of ['/.env', '/backend/data/db.json', '/backend/data/library.sqlite', '/backend/server.js', '/frontend/src/runtime.js']) assert.equal((await fetch(server.base + route)).status, 404, route);
  assert.equal((await fetch(server.base + '/login')).status, 200);
  const cors = await fetch(server.base + '/api/health', { headers: { Origin: 'https://untrusted.example' } }); assert.equal(cors.headers.get('access-control-allow-origin'), null);
});
test('Students cannot create content, access users, or obtain correct answers', async () => {
  assert.equal((await server.request('GET', '/admin/users', undefined, token)).status, 403);
  assert.equal((await server.request('POST', '/categories', { name: 'Forbidden' }, token)).status, 403);
  for (const route of ['/quizzes', `/quizzes/${server.fixtures.quiz._id}`]) {
    const response = await server.request('GET', route, undefined, token);
    assert.equal(response.status, 200); assert.ok(!JSON.stringify(response.data).includes('correctAnswer')); assert.ok(!JSON.stringify(response.data).includes('isCorrect'));
  }
  assert.equal((await server.request('GET', '/quizzes/my-status', undefined, token)).status, 200);
});
test('UI answer map is graded, essay waits, ownership and grade bounds are enforced', async () => {
  const id = server.fixtures.quiz._id;
  assert.equal((await server.request('POST', `/quizzes/${id}/start`, {}, token)).status, 200);
  const response = await server.request('POST', `/quizzes/${id}/submit`, { answers: { 'q-mc': 'a', 'q-essay': 'Cần sống thật thà.' } }, token);
  assert.equal(response.status, 200); assert.equal(response.data.totalScore, 1); assert.equal(response.data.maxScore, 3); assert.equal(response.data.isGraded, false);
  assert.equal(response.data.results[0].userAnswer, 'Tiều phu'); assert.equal(response.data.results[1].points, 0);
  const resultId = response.data._id;
  assert.equal((await server.request('GET', `/quizzes/my-results/${resultId}`, undefined, otherToken)).status, 404);
  assert.equal((await server.request('POST', `/quizzes/${id}/submit`, { answers: {} }, token)).status, 409);
  assert.equal((await server.request('PATCH', `/quizzes/results/${resultId}/grade`, { essayGrades: [{ questionId: 'q-essay', points: 10 }] }, server.adminToken)).status, 400);
  const grade = await server.request('PATCH', `/quizzes/results/${resultId}/grade`, { essayGrades: [{ questionId: 'q-essay', points: 2, feedback: 'Đúng.' }] }, server.adminToken); assert.equal(grade.data.result.percentage, 100);
});
test('AI quiz hides answers, checks owner and rejects forged questions and replay', async () => {
  const id = server.fixtures.story._id;
  assert.equal((await server.request('POST', `/storybooks/${id}/generate-quiz`, { numberOfQuestions: 1000000 }, token)).status, 400);
  const generated = await server.request('POST', `/storybooks/${id}/generate-quiz`, { numberOfQuestions: 5 }, token);
  assert.equal(generated.status, 200); assert.ok(generated.data.quizId); assert.ok(!JSON.stringify(generated.data.questions).includes('correctAnswer'));
  const body = { quizId: generated.data.quizId, userAnswers: [0, 0, 0, 0, 0] };
  assert.equal((await server.request('POST', `/storybooks/${id}/submit-quiz`, body, otherToken)).status, 400);
  assert.equal((await server.request('POST', `/storybooks/${id}/submit-quiz`, { questions: [{ correctAnswer: 0 }], userAnswers: [0] }, token)).status, 400);
  const result = await server.request('POST', `/storybooks/${id}/submit-quiz`, body, token);
  assert.equal(result.status, 200); assert.equal(result.data.score, 100); assert.equal(result.data.questions.length, 5);
  assert.equal((await server.request('POST', `/storybooks/${id}/submit-quiz`, body, token)).status, 400);
});
test('Flashcards and chat accept UI contracts with an isolated AI provider fixture', async () => {
  const generated = await server.request('POST', '/flashcards/generate', { storybookId: server.fixtures.story._id, numberOfCards: 10 }, token);
  assert.equal(generated.data.cards.length, 10);
  assert.equal((await server.request('POST', '/flashcards/save', { storybookId: server.fixtures.story._id, title: 'Ôn tập', cards: generated.data.cards }, token)).status, 200);
  assert.equal((await server.request('GET', '/flashcards/my-cards', undefined, otherToken)).data.flashcards.length, 0);
  assert.equal((await server.request('POST', '/sgk-chat/chat', { question: 'Từ đơn là gì?' }, token)).data.provider, 'gemini');
  assert.equal((await server.request('POST', '/sgk-chat/chat', { question: 'Từ đơn?' })).status, 401);
});
test('Document import parses actual text and banner upload supplies imageUrl', async () => {
  const form = new FormData(); form.set('file', new Blob(['Câu 1: Ai làm rơi rìu?\nA. Tiều phu\nB. Vua\nĐáp án: A\nCâu 2: Nêu bài học.']), 'questions.txt');
  const parsed = await server.request('POST', '/quizzes/parse-doc', form, server.adminToken);
  assert.equal(parsed.status, 200); assert.equal(parsed.data.quiz.questions.length, 2); assert.equal(parsed.data.quiz.questions[0].content, 'Ai làm rơi rìu?');
  const banner = new FormData(); banner.set('title', 'Story Book'); banner.set('image', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFZkAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), 'banner.png');
  const created = await server.request('POST', '/banners', banner, server.adminToken); assert.equal(created.status, 201); assert.ok(created.data.banner.imageUrl.startsWith('/uploads/'));
});
test('Password reset requires emailed link, never exposes token and revokes old JWT', async () => {
  const forgot = await server.request('POST', '/auth/forgot-password', { email: 'student2@example.test' }); assert.equal(forgot.status, 200); assert.equal(forgot.data.token, undefined);
  const dir = path.join(server.directory, 'data/mail-outbox'); const mail = JSON.parse(fs.readFileSync(path.join(dir, fs.readdirSync(dir)[0]), 'utf8')); const resetToken = mail.url.split('/').pop();
  assert.equal((await server.request('POST', '/auth/reset-password', { token: resetToken, newPassword: 'Changed!2026' })).status, 200);
  assert.equal((await server.request('GET', '/auth/me', undefined, otherToken)).status, 401);
  assert.equal((await server.request('POST', '/auth/reset-password', { token: resetToken, newPassword: 'Changed!2026' })).status, 400);
});
test('SQLite preserves independent concurrent writes and rejects stale updates', () => {
  const store = createStore(path.join(server.directory, 'concurrency'));
  const a = store.readDb(), b = store.readDb(); a.categories.push({ _id: 'a', name: 'A' }); b.categories.push({ _id: 'b', name: 'B' }); store.writeDb(a); store.writeDb(b); assert.equal(store.readDb().categories.length, 2);
  const c = store.readDb(), d = store.readDb(); c.categories[0].name = 'C'; d.categories[0].name = 'D'; store.writeDb(c); assert.throws(() => store.writeDb(d), /Dữ liệu/); store.close();
});
test('E-learning ZIP is extracted into an isolated playable course', async () => {
  const zip = new AdmZip(); zip.addFile('lesson/story.html', Buffer.from('<!doctype html><html lang="vi"><h1>Learning</h1></html>'));
  const form = new FormData(); form.set('title', 'Bài giảng ZIP'); form.set('file', new Blob([zip.toBuffer()]), 'lesson.zip');
  const result = await server.request('POST', '/elearnings', form, server.adminToken);
  assert.equal(result.status, 201); assert.ok(result.data.elearning.storyPath.endsWith('/lesson/story.html'));
  const html = await fetch(server.base + result.data.elearning.storyPath);
  assert.equal(html.status, 200); assert.ok(html.headers.get('content-security-policy').includes('sandbox')); assert.ok((await html.text()).includes('Learning'));
});
test('Concurrent registration cannot create duplicate identities', async () => {
  const responses = await Promise.all([1, 2].map(() => server.request('POST', '/auth/register', { username: 'race-user', email: 'race@example.test', password: 'Secure!2026' })));
  assert.deepEqual(responses.map(r => r.status).sort(), [201, 409]);
});
test('AI settings are admin-only and never disclose credentials', async () => {
  assert.equal((await server.request('GET', '/admin/ai-settings', undefined, token)).status, 403);
  const result = await server.request('GET', '/admin/ai-settings', undefined, server.adminToken);
  assert.equal(result.status, 200); assert.equal(result.data.configured, true); assert.equal(result.data.apiKey, undefined);
  assert.equal((await fetch(server.base + '/backend/data/ai-settings.json')).status, 404);
});
