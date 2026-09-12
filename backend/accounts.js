import { randomBytes, createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { badRequest } from './quizzes.js';
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72) throw badRequest('Mật khẩu cần ít nhất 8 ký tự và tối đa 72 byte.');
}
export function normalizeEmail(email) {
  const value = String(email || '').trim().toLowerCase();
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw badRequest('Email không hợp lệ.');
  return value;
}
export function accountRoutes(app, { readDb, writeDb, auth, dataDir }) {
  const hash = token => createHash('sha256').update(token).digest('hex');
  const publicOrigin = process.env.APP_URL || `http://127.0.0.1:${process.env.PORT || 4000}`;
  const fileMail = process.env.MAIL_TRANSPORT === 'file' && process.env.NODE_ENV !== 'production';
  const mailer = process.env.SMTP_HOST ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_PORT === '465', auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined }) : null;
  function requireMail() { if (!mailer && !fileMail) throw Object.assign(new Error('Chức năng email chưa được cấu hình. Vui lòng liên hệ quản trị viên.'), { status: 503 }); }
  async function send(to, subject, url) {
    if (fileMail) {
      const dir = path.join(dataDir, 'mail-outbox'); fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${crypto.randomUUID()}.json`), JSON.stringify({ to, subject, url }, null, 2));
    } else await mailer.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text: `${subject}\n\n${url}\n\nLiên kết có hiệu lực trong 30 phút. Nếu bạn không yêu cầu, hãy bỏ qua thư này.` });
  }
  async function issue(collection, user, route, subject) {
    const token = randomBytes(32).toString('hex');
    const db = readDb();
    db[collection] = db[collection].filter(t => t.user !== user._id && t.expiresAt > Date.now());
    const entry = { _id: hash(token), user: user._id, email: user.email, expiresAt: Date.now() + 30 * 60 * 1000 };
    db[collection].push(entry); writeDb(db);
    try { await send(user.email, subject, `${publicOrigin}/${route}/${token}`); }
    catch { const current = readDb(); current[collection] = current[collection].filter(t => t._id !== entry._id); writeDb(current); throw Object.assign(new Error('Không gửi được email. Vui lòng thử lại sau.'), { status: 503 }); }
  }
  app.post('/api/auth/forgot-password', async (req, res) => {
    requireMail();
    const email = normalizeEmail(req.body.email);
    const user = readDb().users.find(u => u.email?.toLowerCase() === email && email);
    if (user) await issue('resetTokens', user, 'reset-password', 'Đặt lại mật khẩu Thư Viện Số Văn Học');
    res.json({ success: true, message: 'Nếu email đã đăng ký, hướng dẫn đặt lại mật khẩu sẽ được gửi đến bạn.' });
  });
  app.post('/api/auth/reset-password', async (req, res) => {
    validatePassword(req.body.newPassword);
    const db = readDb();
    const token = db.resetTokens.find(t => t._id === hash(String(req.body.token)) && t.expiresAt > Date.now());
    if (!token) throw badRequest('Link đã hết hạn hoặc không hợp lệ.');
    const user = db.users.find(u => u._id === token.user && u.email === token.email);
    if (!user) throw badRequest('Link đã hết hạn hoặc không hợp lệ.');
    user.passwordHash = await bcrypt.hash(req.body.newPassword, 12);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    db.resetTokens = db.resetTokens.filter(t => t.user !== user._id);
    writeDb(db); res.json({ success: true });
  });
  app.post('/api/auth/resend-verification', auth(), async (req, res) => {
    requireMail();
    if (!req.user.email) throw badRequest('Hãy cập nhật email trong hồ sơ trước.');
    await issue('verificationTokens', req.user, 'verify-email', 'Xác minh email Thư Viện Số Văn Học');
    res.json({ success: true, message: 'Đã gửi email xác minh.' });
  });
  app.get('/api/auth/verify-email/:token', (req, res) => {
    const db = readDb();
    const token = db.verificationTokens.find(t => t._id === hash(req.params.token) && t.expiresAt > Date.now());
    const user = token && db.users.find(u => u._id === token.user && u.email === token.email);
    if (!user) throw badRequest('Link đã hết hạn hoặc không hợp lệ.');
    user.isEmailVerified = true;
    db.verificationTokens = db.verificationTokens.filter(t => t._id !== token._id);
    writeDb(db); res.json({ success: true, message: 'Đã xác minh email.' });
  });
}
