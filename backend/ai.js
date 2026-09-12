export async function generateText(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw Object.assign(new Error('Trợ lý AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.'), { status: 503 });
  const models = [...new Set([process.env.GEMINI_MODEL || 'gemini-2.5-flash', ...(process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash-lite').split(',')])].map(s => s.trim()).filter(Boolean);
  for (const model of models) {
    try {
      const endpoint = process.env.NODE_ENV === 'test' && process.env.AI_TEST_URL ? process.env.AI_TEST_URL : `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, signal: AbortSignal.timeout(30000), body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 12000 } }) });
      if (!response.ok) { if (response.status === 401 || response.status === 403) break; continue; }
      const payload = await response.json();
      const text = payload.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n').trim();
      if (text) return text;
    } catch { /* A failed model can fall back to the next configured model. */ }
  }
  throw Object.assign(new Error('Trợ lý AI chưa phản hồi được. Vui lòng thử lại sau.'), { status: 502 });
}
export function boundedCount(value, fallback, max = 20) {
  const count = Number(value ?? fallback);
  if (!Number.isInteger(count) || count < 1 || count > max) throw Object.assign(new Error(`Số lượng cần từ 1 đến ${max}.`), { status: 400 });
  return count;
}
export function generatedQuestions(input, count) {
  if (!Array.isArray(input) || input.length !== count || input.some(q => typeof q.question !== 'string' || !q.question.trim() || !Array.isArray(q.options) || q.options.length !== 4 || q.options.some(o => typeof o !== 'string' || !o.trim()) || !Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3)) throw Object.assign(new Error('AI trả về đề chưa hợp lệ. Vui lòng tạo lại.'), { status: 502 });
  return input.map(q => ({ question: q.question, options: q.options, correctAnswer: q.correctAnswer, explanation: String(q.explanation || '') }));
}
export function generatedCards(input, count) {
  if (!Array.isArray(input) || input.length !== count || input.some(c => typeof c.front !== 'string' || !c.front.trim() || typeof c.back !== 'string' || !c.back.trim())) throw Object.assign(new Error('AI trả về flashcard chưa hợp lệ. Vui lòng tạo lại.'), { status: 502 });
  return input.map(c => ({ front: c.front, back: c.back }));
}
