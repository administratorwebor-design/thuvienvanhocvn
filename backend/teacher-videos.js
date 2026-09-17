import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import multer from 'multer';
import {videoLink} from '../shared/video-links.js';
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
export function registerTeacherVideos(app,{auth,readDb,writeDb,uploadDir,maxUploadMB=300}) {
  const base='/api/classes/:classId/teacher-videos';
  const check=async req=>{
    const db=(await readDb()),c=db.classes.find(c=>c._id===req.params.classId);
    if(!c)fail(404,'Không tìm thấy lớp.');
    if(req.user.role!=='admin'&&!(req.user.role==='teacher'&&c.teacherId===req.user._id))fail(403,'Chỉ giáo viên phụ trách lớp được quản lý video.');
    return {db,c};
  };
  const access=async (req,res,next)=>{(await check(req));next();};
  const upload=multer({storage:multer.diskStorage({destination:uploadDir,filename:(_req,file,cb)=>cb(null,`teacher-video-${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)}),limits:{fileSize:maxUploadMB*1024*1024,files:1,fields:6,fieldSize:20000},fileFilter:(_req,file,cb)=>{const ok=['.mp4','.webm'].includes(path.extname(file.originalname).toLowerCase());cb(ok?null:Object.assign(Error('Chỉ nhận video MP4 hoặc WebM.'),{status:400}),ok);}}).single('file');
  app.get(base,auth(),access,async (req,res)=>res.json({videos:(await readDb()).videos.filter(v=>v.classId===req.params.classId&&v.isActive!==false)}));
  app.post(base,auth(),access,(req,res,next)=>upload(req,res,error=>error?res.status(400).json({error:error.code==='LIMIT_FILE_SIZE'?`Video vượt quá ${maxUploadMB} MB. Hãy dùng link Drive hoặc YouTube.`:error.message}):next()),async (req,res)=>{
    try {
      const {db,c}=(await check(req)),{title,description='',source}=req.body;
      if(typeof title!=='string'||!title.trim()||title.length>200)fail(400,'Nhập tiêu đề video, tối đa 200 ký tự.');
      if(typeof description!=='string'||description.length>10000)fail(400,'Mô tả tối đa 10.000 ký tự.');
      let media;
      if(source==='upload'){
        if(!req.file)fail(400,'Hãy chọn video từ máy.');
        const header=Buffer.alloc(64),fd=fs.openSync(req.file.path,'r');let length;try{length=fs.readSync(fd,header,0,64,0);}finally{fs.closeSync(fd);}
        const ext=path.extname(req.file.filename);
        if(!(length>=12&&(ext==='.mp4'&&header.toString('ascii',4,8)==='ftyp'||ext==='.webm'&&header.subarray(0,4).equals(Buffer.from([26,69,223,163]))&&header.includes(Buffer.from('webm')))))fail(400,'Tệp không phải video MP4/WebM hợp lệ.');
        media={url:'/uploads/'+req.file.filename};
      }else{
        if(req.file)fail(400,'Chọn tải tệp hoặc dán link, không dùng đồng thời.');
        try{media=videoLink(req.body.url||'',source);}catch(e){fail(400,e.message);}
      }
      const assign=req.body.assign===true||req.body.assign==='true';
      if(assign&&(c.isActive===false||!db.users.some(u=>u._id===c.teacherId&&u.role==='teacher'&&!u.isLocked&&u.status!=='rejected')))fail(409,'Lớp đang tạm ngừng, chưa thể giao bài.');
      const date=new Date().toISOString(),video={_id:randomUUID(),title:title.trim(),description:description.trim(),source,url:media.url,thumbnail:media.thumbnail||'',fileUrl:source==='upload'?media.url:'',author:req.user.fullName,category:db.categories.find(c=>c.isActive!==false)?._id||'',classId:c._id,createdBy:req.user._id,isActive:true,viewCount:0,order:0,createdAt:date,updatedAt:date};
      db.videos.push(video);
      let assignment;
      if(assign){assignment={_id:randomUUID(),classId:c._id,kind:'videos',resourceId:video._id,title:video.title,instructions:video.description,dueAt:null,maxAttempts:1,isActive:true,createdBy:req.user._id,createdAt:date};db.assignments.push(assignment);}
      (await writeDb(db));res.status(201).json({video,assignment});
    }catch(error){if(req.file?.path)fs.rmSync(req.file.path,{force:true});throw error;}
  });
}
