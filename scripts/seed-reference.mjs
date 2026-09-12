import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createStore } from '../backend/store.js';
import { normalizeQuizQuestions } from '../backend/quizzes.js';
const root = fileURLToPath(new URL('../', import.meta.url));
export function seedReference(directory = process.env.DATA_DIR || path.join(root, 'backend/data')) {
  const store = createStore(directory); const db = store.readDb();
  const stamp = new Date().toISOString();
  // Keep the old rebuild's explicit test fixtures in the database, but do not
  // offer example.com links as real learning materials to students.
  for (const collection of ['storybooks', 'videos', 'elearnings', 'quizzes', 'categories']) {
    for (const item of db[collection]) {
      const label = item.title || item.name || '';
      if (/^https?:\/\/example\.com(?:\/|$)/i.test(item.url || '') || /^(?:Cat Test|Test \d|Quiz smoke test|Quiz Contract Test|Quiz \d)/i.test(label)) {
        item.isActive = false; item.restorationArchived = true;
      }
    }
  }
  for (const category of db.categories) {
    if (category.description === 'Danh mục mặc định' && !['storybooks', 'videos', 'elearnings', 'quizzes'].some(key => db[key].some(item => item.category === category._id && item.isActive !== false))) { category.isActive = false; category.restorationArchived = true; }
  }
  const add = (collection, item) => { if (!db[collection].some(row => row._id === item._id)) db[collection].push({ isActive: true, createdAt: stamp, updatedAt: stamp, ...item }); };
  add('categories', { _id: 'reference-literature-6', name: 'Ngữ Văn 6', description: 'Truyện dân gian và kiến thức Ngữ Văn lớp 6', order: -1, color: '#2563eb', icon: 'BookOpen' });
  const banners = [['library', 'Thư viện số Văn Học', '/storybooks'], ['storybook', 'STORYBOOK', '/storybooks'], ['video', 'VIDEO MINH HỌA', '/videos'], ['elearning', 'BÀI GIẢNG E-LEARNING', '/elearnings'], ['quiz', 'KIỂM TRA – ĐÁNH GIÁ', '/quizzes']];
  banners.forEach(([key, title, linkUrl], order) => add('banners', { _id: `reference-banner-${key}`, title, imageUrl: `/reference/banner-${key}.jpg`, linkUrl, order, recoveredFrame: true }));
  const text = 'Một người tiều phu nghèo làm rơi chiếc rìu sắt xuống sông. Ông cụ giúp anh tìm lại rìu, lần lượt đưa lên rìu vàng, rìu bạc rồi rìu sắt. Anh không nhận rìu vàng và bạc vì không phải của mình. Khi thấy chiếc rìu sắt, anh nhận ra ngay. Ông cụ khen lòng trung thực và tặng anh cả ba chiếc rìu. Câu chuyện ca ngợi lòng trung thực và khuyên con người không tham lam.';
  add('storybooks', { _id: 'reference-ba-luoi-riu', category: 'reference-literature-6', title: 'BA LƯỠI RÌU', description: 'Câu chuyện dân gian về lòng trung thực.', author: 'Truyện dân gian', type: 'heyzine', url: '/reference/ba-luoi-riu.html', thumbnail: '/reference/ba-luoi-riu.jpg', fileUrl: '', viewCount: 0, chatEnabled: true, aiText: text, order: -1, restorationNote: 'Nội dung được biên soạn lại; hình minh họa được trích từ video tham chiếu. Không phải file Heyzine gốc.' });
  add('quizzes', { _id: 'reference-quiz-trung-thuc', category: 'reference-literature-6', title: 'Ôn tập: Ba lưỡi rìu', description: 'Đọc truyện và suy nghĩ về lòng trung thực.', duration: 15, order: 0, questions: normalizeQuizQuestions([
    { content: 'Nhân vật nào làm rơi chiếc rìu xuống sông?', options: ['Người tiều phu', 'Nhà vua', 'Người lính', 'Thương nhân'], correctAnswer: 0, explanation: 'Người tiều phu đánh rơi dụng cụ kiếm sống của mình.' },
    { content: 'Vì sao người tiều phu không nhận rìu vàng và rìu bạc?', options: ['Vì chúng quá nặng', 'Vì chúng không phải của anh', 'Vì anh không biết dùng rìu', 'Vì anh sợ dòng sông'], correctAnswer: 1, explanation: 'Anh trung thực, chỉ nhận chiếc rìu sắt thuộc về mình.' },
    { type: 'essay', content: 'Em học được điều gì từ câu chuyện? Nêu một việc làm thể hiện điều đó.', points: 2, hint: 'Suy nghĩ về lòng trung thực trong học tập và cuộc sống.' },
  ]) });
  add('elearnings', { _id: 'reference-lesson-truyen-dan-gian', category: 'reference-literature-6', title: 'Đọc hiểu truyện dân gian', description: 'Nhân vật, sự việc, phương thức biểu đạt và luyện tập.', storyPath: '/reference/lesson.html', url: '/reference/lesson.html', thumbnail: '/reference/ba-luoi-riu.jpg', viewCount: 0, fileUrl: '', order: -1, restorationNote: 'Bài giảng được biên soạn mới theo luồng trình diễn E-learning trong video.' });
  store.writeDb(db); store.close();
  console.log('Reference banners, reconstructed story and practice quiz are ready. Existing records were preserved.');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) seedReference();
