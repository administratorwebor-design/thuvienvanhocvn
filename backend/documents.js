import fs from 'node:fs';
import path from 'node:path';
import mammoth from 'mammoth';
import AdmZip from 'adm-zip';
import { badRequest } from './quizzes.js';

export async function documentText(file) {
  if (!file) return '';
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.docx') return (await mammoth.extractRawText({ path: file.path })).value.slice(0, 120000);
  if (['.txt', '.md'].includes(ext)) return fs.readFileSync(file.path, 'utf8').replace(/^\uFEFF/, '').slice(0, 120000);
  throw badRequest('Vui lòng dùng tài liệu TXT hoặc DOCX. File DOC cũ cần lưu lại thành DOCX.');
}
export function parseQuestionDocument(text) {
  const blocks = text.split(/(?=^\s*(?:Câu\s*\d+\s*[:.)]|\d+\s*[.)]))/gim).filter(s => /^\s*(?:Câu\s*\d+|\d+\s*[.)])/i.test(s));
  const questions = blocks.map(block => {
    const lines = block.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const answerLine = lines.find(s => /^(Đáp án|Dap an|Answer)\s*:/i.test(s));
    const answer = answerLine?.split(':').slice(1).join(':').trim().toUpperCase();
    const options = lines.filter(s => /^[A-H][.)]\s*/.test(s)).map(s => ({ content: s.replace(/^[A-H][.)]\s*/, ''), isCorrect: s[0] === answer?.[0] }));
    const content = lines.filter(s => !/^[A-H][.)]\s*/.test(s) && !/^(Đáp án|Dap an|Answer|Giải thích)\s*:/i.test(s)).join('\n').replace(/^(?:Câu\s*\d+|\d+)\s*[:.)]\s*/i, '');
    if (options.length && !options.some(o => o.isCorrect)) throw badRequest('Mỗi câu trắc nghiệm cần dòng “Đáp án: A” (hoặc B, C, D).');
    return { type: options.length ? 'multiple_choice' : 'essay', content, options, points: options.length ? 1 : 2, explanation: lines.find(s => /^Giải thích:/i.test(s))?.replace(/^Giải thích:\s*/i, '') || '' };
  });
  if (!questions.length) throw badRequest('Không tìm thấy câu hỏi. Bắt đầu mỗi câu bằng “Câu 1:”, các lựa chọn A., B., C., D. và dòng “Đáp án: A”.');
  return questions;
}
export function extractCourse(file, uploadDir) {
  if (path.extname(file.originalname).toLowerCase() !== '.zip') throw badRequest('Bài giảng cần gói ZIP xuất từ công cụ E-learning.');
  let zip;
  try { zip = new AdmZip(file.path); } catch { throw badRequest('Tệp ZIP bị hỏng hoặc không hợp lệ.'); }
  const entries = zip.getEntries();
  if(process.env.DATABASE_DRIVER==='supabase'&&entries.some(e=>e.header.size>50*1024*1024))throw badRequest('Mỗi tệp trong bài giảng tối đa 50 MB. Video lớn hãy dùng YouTube hoặc Drive.');
  if (entries.length > 5000 || entries.reduce((n, e) => n + e.header.size, 0) > 500 * 1024 * 1024) throw badRequest('Gói bài giảng quá lớn sau giải nén.');
  const folder = `course-${crypto.randomUUID()}`;
  const root = path.resolve(uploadDir, folder);
  for (const entry of entries) {
    const target = path.resolve(root, entry.entryName.replaceAll('\\', '/'));
    if (!target.startsWith(root + path.sep) || entry.entryName.includes(':') || ((entry.attr >>> 16) & 0xf000) === 0xa000) throw badRequest('Đường dẫn trong ZIP không hợp lệ.');
  }
  const html = entries.filter(e => /(^|\/)(story|index)\.html?$/i.test(e.entryName)).sort((a, b) => a.entryName.split('/').length - b.entryName.split('/').length);
  if (!html.length) throw badRequest('ZIP cần chứa story.html hoặc index.html.');
  fs.mkdirSync(root, { recursive: true });
  zip.extractAllTo(root, false);
  return `/uploads/${folder}/${html[0].entryName}`;
}
