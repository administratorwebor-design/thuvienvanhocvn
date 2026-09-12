import fs from 'node:fs';
import path from 'node:path';
import { badRequest } from './quizzes.js';
export function loadAiSettings(directory) {
  const file = path.join(directory, 'ai-settings.json');
  if (!fs.existsSync(file)) return;
  const settings = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (typeof settings.apiKey === 'string') process.env.GEMINI_API_KEY = settings.apiKey;
  if (settings.model) process.env.GEMINI_MODEL = settings.model;
}
export function registerAiSettings(app, { auth, admin, directory }) {
  const status = () => ({ configured: Boolean(process.env.GEMINI_API_KEY), model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
  app.get('/api/admin/ai-settings', auth(), admin, (_req, res) => res.json(status()));
  app.patch('/api/admin/ai-settings', auth(), admin, (req, res) => {
    const model = String(req.body.model || 'gemini-2.5-flash');
    if (!/^[a-zA-Z0-9.-]{3,80}$/.test(model)) throw badRequest('Tên mô hình không hợp lệ.');
    const apiKey = req.body.apiKey === undefined || req.body.apiKey === '' ? process.env.GEMINI_API_KEY || '' : req.body.apiKey;
    if (typeof apiKey !== 'string' || (apiKey && !/^[a-zA-Z0-9_-]{20,200}$/.test(apiKey))) throw badRequest('API key không hợp lệ.');
    fs.mkdirSync(directory, { recursive: true });
    const file = path.join(directory, 'ai-settings.json');
    fs.writeFileSync(file + '.tmp', JSON.stringify({ apiKey, model }), { mode: 0o600 }); fs.renameSync(file + '.tmp', file);
    process.env.GEMINI_API_KEY = apiKey; process.env.GEMINI_MODEL = model;
    res.json({ success: true, ...status() });
  });
}
