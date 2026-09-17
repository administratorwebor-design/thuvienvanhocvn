import { normalizeQuizQuestions, gradeQuiz, badRequest } from './quizzes.js';
import { documentText, parseQuestionDocument } from './documents.js';
export function registerQuizRoutes(app, { auth, admin, upload, readDb, writeDb, previousQuiz }) {
  app.post('/api/quizzes/parse-doc', auth(), admin, upload.single('file'), async (req, res) => {
    const questions = normalizeQuizQuestions(parseQuestionDocument(await documentText(req.file)));
    res.json({ success: true, quiz: { title: req.file.originalname.replace(/\.[^.]+$/, ''), description: '', questions } });
  });
  function allowed(req, db, res) {
    const quiz = db.quizzes.find(q => q._id === req.params.id && q.isActive !== false);
    if (!quiz) { res.status(404).json({ error: 'Không tìm thấy bài kiểm tra.' }); return null; }
    if (db.quizResults.some(r => r.user === req.user._id && (r.quiz?._id || r.quiz) === quiz._id)) { res.status(409).json({ error: 'Bạn đã nộp bài kiểm tra này.' }); return null; }
    if (previousQuiz(db, quiz, req.user)) { res.status(403).json({ error: 'Hãy hoàn thành bài kiểm tra trước.' }); return null; }
    return quiz;
  }
  app.post('/api/quizzes/:id/start', auth(), async (req, res) => {
    const db = (await readDb()); const quiz = allowed(req, db, res); if (!quiz) return;
    let attempt = db.quizAttempts.find(a => a.user === req.user._id && a.quiz === quiz._id);
    if (!attempt) {
      attempt = { _id: crypto.randomUUID(), user: req.user._id, quiz: quiz._id, startedAt: Date.now(), deadline: Date.now() + Number(quiz.duration || 30) * 60000, questions: structuredClone(quiz.questions) };
      db.quizAttempts.push(attempt); (await writeDb(db));
    }
    res.json({ success: true, remainingSeconds: Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 1000)), deadline: attempt.deadline });
  });
  app.post('/api/quizzes/:id/submit', auth(), async (req, res) => {
    const db = (await readDb()); const quiz = allowed(req, db, res); if (!quiz) return;
    const attempt = db.quizAttempts.find(a => a.user === req.user._id && a.quiz === quiz._id);
    if (!attempt) throw badRequest('Vui lòng bắt đầu bài kiểm tra trước khi nộp.');
    if (Date.now() > attempt.deadline + 30000) throw Object.assign(new Error('Đã quá thời gian nộp bài.'), { status: 409 });
    const graded = gradeQuiz({ ...quiz, questions: attempt.questions }, req.body.answers);
    const result = { _id: crypto.randomUUID(), user: req.user._id, quiz: { _id: quiz._id, title: quiz.title }, ...graded, submittedAt: new Date().toISOString(), createdAt: new Date().toISOString() };
    db.quizResults.push(result); (await writeDb(db));
    res.json({ success: true, ...result, result, message: result.isGraded ? 'Đã chấm bài kiểm tra.' : 'Đã chấm trắc nghiệm. Phần tự luận đang chờ giáo viên.' });
  });
}
