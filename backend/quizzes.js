import { randomUUID } from 'node:crypto';
export const badRequest = message => Object.assign(new Error(message), { status: 400 });
export function normalizeQuizQuestions(input) {
  let questions = input;
  if (typeof input === 'string') { try { questions = JSON.parse(input); } catch { throw badRequest('Danh sách câu hỏi không hợp lệ.'); } }
  if (!Array.isArray(questions) || !questions.length || questions.length > 100) throw badRequest('Đề cần từ 1 đến 100 câu hỏi.');
  const seen = new Set();
  return questions.map(question => {
    const type = question.type || question.questionType || 'multiple_choice';
    if (!['multiple_choice', 'essay'].includes(type)) throw badRequest('Loại câu hỏi không hợp lệ.');
    const content = String(question.content || question.question || '').trim();
    const points = Number(question.points ?? (type === 'essay' ? 2 : 1));
    if (!content || !Number.isFinite(points) || points <= 0 || points > 100) throw badRequest('Nội dung hoặc điểm câu hỏi không hợp lệ.');
    const id = question.id || question._id || randomUUID();
    if (seen.has(id)) throw badRequest('Mã câu hỏi bị trùng.');
    seen.add(id);
    const options = (Array.isArray(question.options) ? question.options : []).map(option => ({
      id: option.id || randomUUID(), content: typeof option === 'string' ? option : String(option.content || ''), isCorrect: option.isCorrect === true,
    }));
    if (type === 'multiple_choice') {
      if (options.length < 2 || options.length > 8 || options.some(o => !o.content.trim()) || new Set(options.map(o => o.id)).size !== options.length) throw badRequest('Cần 2–8 lựa chọn khác nhau, có nội dung.');
      if (!options.some(o => o.isCorrect) && Number.isInteger(Number(question.correctAnswer)) && options[Number(question.correctAnswer)]) options[Number(question.correctAnswer)].isCorrect = true;
      if (options.filter(o => o.isCorrect).length !== 1) throw badRequest('Mỗi câu trắc nghiệm cần đúng một đáp án đúng.');
    }
    return { id, type, content, question: content, points, options: type === 'essay' ? [] : options, correctAnswer: type === 'essay' ? '' : options.findIndex(o => o.isCorrect), explanation: String(question.explanation || ''), hint: String(question.hint || '') };
  });
}
export function learnerQuiz(quiz) {
  return { ...quiz, questions: (quiz.questions || []).map(({ correctAnswer, explanation, ...q }) => ({ ...q, options: (q.options || []).map(({ isCorrect, ...o }) => o) })) };
}
export function gradeQuiz(quiz, answers) {
  if (!answers || typeof answers !== 'object') throw badRequest('Câu trả lời không hợp lệ.');
  const results = quiz.questions.map((q, index) => {
    const raw = Array.isArray(answers) ? answers[index]?.answer ?? answers[index] : answers[q.id];
    const option = q.type === 'multiple_choice' ? (Array.isArray(answers) && Number.isInteger(raw) ? q.options[raw] : q.options.find(o => o.id === raw)) : null;
    const correct = q.options.find(o => o.isCorrect) || q.options[q.correctAnswer];
    const isCorrect = q.type === 'multiple_choice' && !!option && option.id === correct?.id;
    return { questionId: q.id, questionType: q.type, questionContent: q.content, options: q.options, userAnswer: q.type === 'essay' ? String(raw || '').slice(0, 20000) : option?.content || '', correctAnswer: correct?.content || '', isCorrect, points: isCorrect ? q.points : 0, maxPoints: q.points, explanation: q.explanation };
  });
  const mcScore = results.reduce((sum, r) => sum + r.points, 0);
  const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  return { answers: results, results, mcScore, essayScore: 0, totalScore: mcScore, maxScore, percentage: Math.round(mcScore / maxScore * 100), isGraded: !quiz.questions.some(q => q.type === 'essay') };
}
