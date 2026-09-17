import assert from 'node:assert/strict';
import dotenv from '../backend/node_modules/dotenv/lib/main.js';
import {startTestServer} from '../tests/support.mjs';
dotenv.config({quiet:true});
const s=await startTestServer({supabase:true,classrooms:true,ai:true});
try{
 assert.equal((await s.request('GET','/health')).data.storage,'supabase');
 assert.equal((await s.request('POST','/teachers',{username:'cloud-teacher',password:'CloudTest!2026',fullName:'Giáo viên thử nghiệm'},s.adminToken)).status,201);
 const teacher=(await s.request('POST','/auth/login',{username:'cloud-teacher',password:'CloudTest!2026'})).data.token;
 const c=(await s.request('POST','/classes',{name:'Lớp thử Supabase'},teacher)).data.classroom;
 const base=`/classes/${c._id}/teacher-assessments`;
 const generated=await s.request('POST',base+'/generate',{topic:'Tình bạn',content:'Nội dung tiếng Việt',count:2},teacher);assert.equal(generated.status,200);
 const saved=await s.request('POST',base,{...generated.data,duration:30,assign:true},teacher);assert.equal(saved.status,201);
 const loaded=(await s.request('GET',base,undefined,teacher)).data.quizzes;assert.equal(loaded.length,1);assert.equal(loaded[0].title,'Tình bạn');
 const form=new FormData();form.set('title','Upload persists');form.set('image',new Blob([Buffer.from('89504e470d0a1a0a','hex')],{type:'image/png'}),'test.png');
 const banner=await s.request('POST','/banners',form,s.adminToken);assert.equal(banner.status,201);
 const url=banner.data.banner.imageUrl;assert.equal((await fetch(s.base+url)).status,200);
 console.log('PASS Supabase API: login, teacher, class, AI generation, save and assign, Unicode, persisted upload.');
}finally{await s.stop();}
