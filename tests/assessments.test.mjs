import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bank } from '../docs/assessment-bank.mjs';
import { seedAssessments } from '../scripts/seed-assessments.mjs';
import { createStore } from '../backend/store.js';
import { startTestServer } from './support.mjs';

test('Twenty textbook papers: structure, independent access, private keys and partial essay grading', async () => {
  assert.equal(bank.length,20);
  assert.equal(new Set(bank.map(t=>t.id)).size,20);
  for(const t of bank){
    assert.ok(t.passage.length>200); assert.equal(t.questions.length,10);
    assert.equal(t.questions.filter(q=>q.type==='essay').length,2);
    assert.equal(new Set(t.questions.map(q=>q.id)).size,10);
    const counts=[0,0,0,0];
    for(const q of t.questions){
      assert.equal(q.points,1); assert.ok(q.content&&q.explanation);
      if(q.type==='essay')assert.ok(q.hint);
      else {assert.equal(new Set(q.options).size,4);counts[q.correctAnswer]++;}
    }
    assert.deepEqual(counts,[2,2,2,2]);
  }
  const s=await startTestServer();
  try {
    const snapshot=()=>{const store=createStore(s.env.DATA_DIR);const db=store.readDb();store.close();return db;};
    const before=snapshot();
    seedAssessments(s.env.DATA_DIR);seedAssessments(s.env.DATA_DIR);
    const after=snapshot();
    for(const key of ['storybooks','videos','elearnings'])assert.deepEqual(after[key],before[key]);
    const papers=after.quizzes.filter(q=>q.assessmentBank);
    assert.equal(papers.length,20);
    const categories=await s.request('GET','/categories?for=quizzes');
    assert.equal(categories.data.categories.length,8); // seven bank genres plus existing fixture
    await s.request('POST','/auth/register',{username:'assessment-student',email:'assessment@example.test',password:'Student!2026'});
    const token=(await s.request('POST','/auth/login',{username:'assessment-student',password:'Student!2026'})).data.token;
    assert.ok(token);
    for(const paper of [...papers].reverse()){
      const route=`/quizzes/${paper._id}`;
      const detail=await s.request('GET',route,undefined,token);
      assert.equal(detail.status,200);assert.equal(detail.data.quiz.description,paper.description);
      assert.doesNotMatch(JSON.stringify(detail.data),/"(correctAnswer|isCorrect|explanation)"/);
      assert.equal((await s.request('POST',route+'/start',{},token)).status,200);
      const answers=Object.fromEntries(paper.questions.map(q=>[q.id,q.type==='essay'?'Câu trả lời tự luận để kiểm tra luồng chấm điểm.':q.options.find(o=>o.isCorrect).id]));
      const result=await s.request('POST',route+'/submit',{answers},token);
      assert.equal(result.status,200);assert.equal(result.data.totalScore,8);assert.equal(result.data.maxScore,10);assert.equal(result.data.isGraded,false);
      assert.ok(result.data.results[0].explanation);
      assert.equal((await s.request('POST',route+'/submit',{answers},token)).status,409);
      const essays=paper.questions.filter(q=>q.type==='essay');
      const grade=async(i,points)=>s.request('PATCH',`/quizzes/results/${result.data._id}/grade`,{essayGrades:[{questionId:essays[i].id,points}]},s.adminToken);
      assert.equal((await grade(0,2)).status,400);
      const partial=await grade(0,.5);assert.equal(partial.data.result.isGraded,false);assert.equal(partial.data.result.totalScore,8.5);
      const final=await grade(1,1);assert.equal(final.data.result.isGraded,true);assert.equal(final.data.result.totalScore,9.5);
      assert.equal((await grade(0,1)).data.result.totalScore,10);
    }
  } finally {await s.stop();}
});
