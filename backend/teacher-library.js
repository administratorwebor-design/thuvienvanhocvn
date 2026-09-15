import {normalizeQuizQuestions} from './quizzes.js';
import {videoLink} from '../shared/video-links.js';
const kinds=['storybooks','videos','elearnings','quizzes'];
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
export function canManageMaterial(db,user,item){
  if(user?.role==='admin')return true;
  if(user?.role!=='teacher')return false;
  // A class handover also hands over its materials to the current teacher.
  if(item.classId)return db.classes.some(c=>c._id===item.classId&&c.teacherId===user._id);
  return item.createdBy===user._id;
}
export function registerTeacherLibrary(app,{auth,readDb,writeDb}){
  const base='/api/teacher-library/:kind';
  const access=(req,res,next)=>{if(!['admin','teacher'].includes(req.user.role))fail(403,'Chỉ giáo viên được quản lý học liệu.');if(!kinds.includes(req.params.kind))fail(404,'Không tìm thấy loại học liệu.');next();};
  const find=req=>{const db=readDb(),item=db[req.params.kind].find(x=>x._id===req.params.id&&x.isActive!==false);if(!item)fail(404,'Học liệu đã được xóa hoặc không tồn tại.');if(!canManageMaterial(db,req.user,item))fail(403,'Bạn chỉ được sửa hoặc xóa học liệu của mình và lớp mình phụ trách.');return {db,item};};
  app.get(base,auth(),access,(req,res)=>{const db=readDb();res.json({ids:db[req.params.kind].filter(x=>x.isActive!==false&&canManageMaterial(db,req.user,x)).map(x=>x._id)});});
  app.get(base+'/:id',auth(),access,(req,res)=>res.json({item:find(req).item}));
  app.patch(base+'/:id',auth(),access,(req,res)=>{
    const {db,item}=find(req),body=req.body,kind=req.params.kind;
    if(body.updatedAt!==(item.updatedAt||null))fail(409,'Học liệu vừa được thay đổi. Hãy đóng và mở lại để chỉnh sửa.');
    const patch={};
    for(const [key,max] of [['title',200],['description',30000],['author',200]])if(body[key]!==undefined){if(typeof body[key]!=='string'||body[key].length>max||(key==='title'&&!body[key].trim()))fail(400,'Tiêu đề, mô tả hoặc tác giả không hợp lệ.');patch[key]=body[key].trim();}
    if(body.category!==undefined){if(typeof body.category!=='string'||(body.category&&!db.categories.some(c=>c._id===body.category&&c.isActive!==false)))fail(400,'Danh mục không hợp lệ.');patch.category=body.category;}
    for(const key of ['url','thumbnail'])if(body[key]!==undefined&&body[key]!==item[key]){
      const value=body[key];if(typeof value!=='string'||value.length>2000)fail(400,'Đường dẫn không hợp lệ.');
      if(value&&!/^\/(?!\/)/.test(value)){let u;try{u=new URL(value);}catch{fail(400,'Nhập đường dẫn HTTP hoặc HTTPS hợp lệ.');}if(!['https:','http:'].includes(u.protocol))fail(400,'Đường dẫn phải dùng HTTP hoặc HTTPS.');}
      patch[key]=value;
    }
    if(kind==='videos'&&patch.url!==undefined){
      if(!patch.url)fail(400,'Video cần đường dẫn.');
      if(['youtube','drive'].includes(item.source)){let media;try{media=videoLink(patch.url,item.source);}catch(e){fail(400,e.message);}patch.url=media.url;if(media.thumbnail&&body.thumbnail===item.thumbnail)patch.thumbnail=media.thumbnail;}
      else if(item.source==='upload')patch.fileUrl=patch.url;
    }
    if(kind==='elearnings'&&patch.url!==undefined)patch.storyPath=patch.url;
    if(kind==='quizzes'){
      if(body.duration!==undefined){const n=Number(body.duration);if(!Number.isInteger(n)||n<1||n>180)fail(400,'Thời gian làm bài từ 1 đến 180 phút.');patch.duration=n;}
      if(body.questions!==undefined)patch.questions=normalizeQuizQuestions(body.questions);
      const contentChanged=['questions','duration','description'].some(k=>patch[k]!==undefined&&JSON.stringify(patch[k])!==JSON.stringify(item[k]));
      if(contentChanged&&[...db.quizAttempts,...db.quizResults].some(r=>(r.quiz?._id||r.quiz||r.quizId)===item._id))fail(409,'Đề đã có lượt làm ngoài lớp. Giữ nội dung hiện tại để bảo toàn bài làm; hãy tạo đề mới.');
      if(patch.questions)patch.totalPoints=patch.questions.reduce((n,q)=>n+q.points,0);
      patch.revision=(item.revision||1)+1;
    }
    Object.assign(item,patch,{updatedAt:new Date().toISOString()});writeDb(db);res.json({item});
  });
  app.delete(base+'/:id',auth(),access,(req,res)=>{
    const {db,item}=find(req);
    if(req.body.updatedAt!==(item.updatedAt||null))fail(409,'Học liệu vừa được thay đổi. Hãy tải lại trước khi xóa.');
    item.isActive=false;item.updatedAt=new Date().toISOString();item.deletedBy=req.user._id;
    // Keep attempts, results and grading records; withdraw active assignments.
    for(const a of db.assignments)if(a.kind===req.params.kind&&a.resourceId===item._id)a.isActive=false;
    writeDb(db);res.json({success:true});
  });
}
