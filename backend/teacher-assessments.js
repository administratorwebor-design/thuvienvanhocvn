import {randomUUID} from 'node:crypto';
import {normalizeQuizQuestions} from './quizzes.js';
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const string=(v,max,label,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))fail(400,`${label} ${required?'cần có nội dung và ':''}tối đa ${max} ký tự.`);return v.trim();};
function assessment(body){
  const title=string(body.title,200,'Tên đề',true),description=string(body.description||'',30000,'Ngữ liệu'),duration=Number(body.duration);
  if(!Number.isInteger(duration)||duration<1||duration>180)fail(400,'Thời gian làm bài từ 1 đến 180 phút.');
  if(!Array.isArray(body.questions)||!body.questions.length||body.questions.length>100)fail(400,'Đề cần từ 1 đến 100 câu hỏi.');
  const questions=normalizeQuizQuestions(body.questions.map(q=>{
    if(!q||!['multiple_choice','essay'].includes(q.type)||typeof q.id!=='string'||!/^[\w-]{1,80}$/.test(q.id))fail(400,'Câu hỏi không hợp lệ.');
    const result={id:q.id,type:q.type,content:string(q.content,8000,'Câu hỏi',true),points:q.points,explanation:string(q.explanation||'',8000,'Đáp án / hướng dẫn chấm'),hint:string(q.hint||'',2000,'Gợi ý')};
    if(q.type==='multiple_choice'){
      if(!Array.isArray(q.options)||q.options.length<2||q.options.length>8||!Number.isInteger(q.correctAnswer)||q.correctAnswer<0||q.correctAnswer>=q.options.length)fail(400,'Câu trắc nghiệm cần 2–8 lựa chọn và một đáp án đúng.');
      result.options=q.options.map((o,i)=>{if(!o||typeof o.id!=='string'||!/^[\w-]{1,80}$/.test(o.id))fail(400,'Lựa chọn không hợp lệ.');return {id:o.id,content:string(o.content,2000,'Lựa chọn',true),isCorrect:i===q.correctAnswer};});
    }
    return result;
  }));
  return {title,description,duration,questions,totalPoints:questions.reduce((s,q)=>s+q.points,0)};
}
export function registerTeacherAssessments(app,{auth,readDb,writeDb}){
  const base='/api/classes/:classId/teacher-assessments';
  const check=req=>{const db=readDb(),c=db.classes.find(c=>c._id===req.params.classId);if(!c)fail(404,'Không tìm thấy lớp.');if(req.user.role!=='admin'&&!(req.user.role==='teacher'&&c.teacherId===req.user._id))fail(403,'Chỉ giáo viên phụ trách lớp được quản lý đề.');return {db,c};};
  const access=(req,res,next)=>{check(req);next();};
  app.get(base,auth(),access,(req,res)=>res.json({quizzes:readDb().quizzes.filter(q=>q.classId===req.params.classId&&q.isActive!==false)}));
  const save=(req,res)=>{
    const {db,c}=check(req),data=assessment(req.body),now=new Date().toISOString();
    let quiz;
    if(req.params.quizId){quiz=db.quizzes.find(q=>q._id===req.params.quizId&&q.classId===c._id);if(!quiz)fail(404,'Không tìm thấy đề trong lớp.');if(req.body.revision!==(quiz.revision||1))fail(409,'Đề vừa được sửa ở cửa sổ khác. Hãy mở lại đề để chỉnh tiếp.');const changed=Object.keys(data).some(k=>JSON.stringify(quiz[k])!==JSON.stringify(data[k]));if(changed)quiz.revision=(quiz.revision||1)+1;Object.assign(quiz,data,{updatedAt:now});}
    else{quiz={_id:randomUUID(),...data,revision:1,classId:c._id,createdBy:req.user._id,author:req.user.fullName,category:db.categories.find(c=>c.isActive!==false)?._id||'',order:db.quizzes.length,isActive:true,createdAt:now,updatedAt:now};db.quizzes.push(quiz);}
    let assignment;
    if(req.body.assign===true){
      if(c.isActive===false||!db.users.some(u=>u._id===c.teacherId&&u.role==='teacher'&&!u.isLocked&&u.status!=='rejected'))fail(409,'Lớp đang tạm ngừng, chưa thể giao đề.');
      const maxAttempts=Number(req.body.maxAttempts??1),dueAt=req.body.dueAt?new Date(req.body.dueAt):null,instructions=string(req.body.instructions||'',2000,'Yêu cầu giao bài');
      if(!Number.isInteger(maxAttempts)||maxAttempts<1||maxAttempts>5)fail(400,'Số lượt làm từ 1 đến 5.');if(dueAt&&(!Number.isFinite(dueAt.getTime())||dueAt.getTime()<=Date.now()))fail(400,'Hạn nộp phải ở tương lai.');
      assignment=db.assignments.find(a=>a.classId===c._id&&a.kind==='quizzes'&&a.resourceId===quiz._id&&a.quizRevision===quiz.revision&&a.isActive!==false);
      if(!assignment){assignment={_id:randomUUID(),classId:c._id,kind:'quizzes',resourceId:quiz._id,quizRevision:quiz.revision,title:quiz.title,description:quiz.description,questions:structuredClone(quiz.questions),duration:quiz.duration,totalPoints:quiz.totalPoints,instructions,dueAt:dueAt?.toISOString()||null,maxAttempts,isActive:true,createdBy:req.user._id,createdAt:now};db.assignments.push(assignment);}
    }
    writeDb(db);res.status(req.params.quizId?200:201).json({quiz,assignment});
  };
  app.post(base,auth(),access,save);app.patch(base+'/:quizId',auth(),access,save);
}
