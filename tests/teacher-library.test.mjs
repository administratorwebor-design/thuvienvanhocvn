import test from 'node:test';
import assert from 'node:assert/strict';
import {startTestServer} from './support.mjs';
import {createStore} from '../backend/store.js';

test('Teacher library: ownership, handover, editing, archive and result preservation',async()=>{
  const s=await startTestServer({classrooms:true});
  const store=createStore(s.env.DATA_DIR);
  try{
    const teachers=[];
    for(const username of ['library-teacher','library-other']){
      await s.request('POST','/teachers',{username,fullName:username,password:'TeacherTest!2026'},s.adminToken);
      teachers.push((await s.request('POST','/auth/login',{username,password:'TeacherTest!2026'})).data);
    }
    const [owner,other]=teachers,c=(await s.request('POST','/classes',{name:'6A'},owner.token)).data.classroom;
    await s.request('POST','/auth/register',{username:'library-student',fullName:'Student',password:'StudentTest!2026'});
    const student=(await s.request('POST','/auth/login',{username:'library-student',password:'StudentTest!2026'})).data;
    const db=store.readDb(),kinds=['storybooks','videos','elearnings','quizzes'];
    for(const kind of kinds){const template=kind==='quizzes'?db.quizzes[0]:kind==='storybooks'?db.storybooks[0]:{title:kind,url:'https://www.youtube.com/watch?v=6aybCaXkfpU',source:'youtube'};db[kind].push({...structuredClone(template),_id:'owned-'+kind,title:'Owned '+kind,classId:c._id,createdBy:owner.user._id,author:owner.user.fullName,isActive:true,updatedAt:'2026-01-01T00:00:00.000Z'});}
    store.writeDb(db);
    for(const kind of kinds){
      const base='/teacher-library/'+kind,uri=base+'/owned-'+kind;
      assert.equal((await s.request('GET',base,undefined,student.token)).status,403);
      assert.equal((await s.request('GET',uri,undefined,other.token)).status,403);
      assert.equal((await s.request('PATCH',uri,{title:'Attack'},other.token)).status,403);
      assert.equal((await s.request('DELETE',uri,{},other.token)).status,403);
      assert.equal((await s.request('GET',base,undefined,owner.token)).data.ids.includes('owned-'+kind),true);
      const original=(await s.request('GET',uri,undefined,owner.token)).data.item;
      const revised=await s.request('PATCH',uri,{title:'Edited '+kind,description:'Teacher description',updatedAt:original.updatedAt,createdBy:other.user._id,classId:'fake'},owner.token);
      assert.equal(revised.status,200);assert.equal(revised.data.item.title,'Edited '+kind);assert.equal(revised.data.item.createdBy,owner.user._id);assert.equal(revised.data.item.classId,c._id);
      assert.equal((await s.request('PATCH',uri,{title:'Stale',updatedAt:original.updatedAt},owner.token)).status,409);
      assert.equal((await s.request('PATCH',uri,{url:'javascript:alert(1)',updatedAt:revised.data.item.updatedAt},owner.token)).status,400);
    }
    const uri='/teacher-library/quizzes/owned-quizzes';
    const assignment=(await s.request('POST',`/classes/${c._id}/assignments`,{kind:'quizzes',resourceId:'owned-quizzes'},owner.token)).data.assignment;
    const before=store.readDb().assignments.find(a=>a._id===assignment._id).questions;
    const quiz=(await s.request('GET',uri,undefined,owner.token)).data.item;
    const questions=structuredClone(quiz.questions);questions[0].content='Updated question';
    assert.equal((await s.request('PATCH',uri,{questions,updatedAt:quiz.updatedAt},owner.token)).status,200);
    assert.deepEqual(store.readDb().assignments.find(a=>a._id===assignment._id).questions,before);
    const publicQuiz=await s.request('GET','/quizzes/owned-quizzes',undefined,student.token);
    assert.equal(publicQuiz.data.quiz.questions[0].correctAnswer,undefined);
    assert.equal(publicQuiz.data.quiz.questions[0].options[0].isCorrect,undefined);
    const snapshot=store.readDb();snapshot.classResults.push({_id:'preserved-result',classId:c._id,assignmentId:assignment._id,user:student.user._id,totalScore:7});store.writeDb(snapshot);
    for(const kind of kinds){const uri='/teacher-library/'+kind+'/owned-'+kind,current=(await s.request('GET',uri,undefined,owner.token)).data.item;
      assert.equal((await s.request('DELETE',uri,{updatedAt:current.updatedAt},student.token)).status,403);
      assert.equal((await s.request('DELETE',uri,{updatedAt:current.updatedAt},owner.token)).status,200);
      assert.equal((await s.request('GET','/'+kind,undefined,student.token)).data[kind].some(v=>v._id==='owned-'+kind),false);
      assert.equal(store.readDb()[kind].find(v=>v._id==='owned-'+kind).isActive,false);
    }
    assert.equal(store.readDb().classResults.find(r=>r._id==='preserved-result').totalScore,7);
    assert.equal(store.readDb().assignments.find(a=>a._id===assignment._id).isActive,false);
    const handover=store.readDb();handover.videos.find(v=>v._id==='owned-videos').isActive=true;store.writeDb(handover);
    await s.request('PATCH',`/classes/${c._id}`,{teacherId:other.user._id},s.adminToken);
    assert.equal((await s.request('GET','/teacher-library/videos/owned-videos',undefined,owner.token)).status,403);
    assert.equal((await s.request('GET','/teacher-library/videos/owned-videos',undefined,other.token)).status,200);
  }finally{store.close();await s.stop();}
});
