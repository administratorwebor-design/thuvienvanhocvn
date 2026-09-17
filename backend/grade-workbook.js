import ExcelJS from 'exceljs';

const navy='244B68',blue='EAF2F8',muted='52677A';
const latest=(rows)=>[...rows].sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt))[0];
const round=n=>Math.round(n*100)/100;
export async function gradeWorkbook(db,c){
  const book=new ExcelJS.Workbook();book.creator='Thư Viện Số Văn Học';book.created=new Date();
  const members=db.memberships.filter(m=>m.classId===c._id&&m.status==='approved');
  const assignments=db.assignments.filter(a=>a.classId===c._id&&a.kind==='quizzes');
  const teacher=db.users.find(u=>u._id===c.teacherId);
  const results=db.classResults.filter(r=>r.classId===c._id);
  function sheet(name,title,headers,widths,note){
    const ws=book.addWorksheet(name,{views:[{state:'frozen',xSplit:3,ySplit:5,showGridLines:false}],pageSetup:{paperSize:9,orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0,printTitlesRow:'1:5',margins:{left:.25,right:.25,top:.4,bottom:.4,header:.15,footer:.15}}});
    ws.columns=widths.map(width=>({width}));
    for(let r=1;r<=3;r++)ws.mergeCells(r,1,r,headers.length);
    ws.getCell('A1').value=title;ws.getCell('A1').font={name:'Calibri',size:20,bold:true,color:{argb:navy}};ws.getRow(1).height=34;
    ws.getCell('A2').value=[`Lớp: ${c.name}`,c.school, c.schoolYear&&`Năm học: ${c.schoolYear}`,`Giáo viên: ${teacher?.fullName||'—'}`].filter(Boolean).join('   •   ');
    ws.getRow(2).height=28;ws.getCell('A2').font={name:'Calibri',size:11,color:{argb:muted}};
    ws.getCell('A3').value=note;ws.getCell('A3').font={name:'Calibri',size:10,italic:true,color:{argb:muted}};ws.getCell('A3').alignment={wrapText:true,vertical:'middle'};ws.getRow(3).height=32;
    ws.getRow(5).values=headers;ws.getRow(5).height=60;
    ws.getRow(5).eachCell(cell=>{cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:navy}};cell.font={name:'Calibri',size:11,bold:true,color:{argb:'FFFFFF'}};cell.alignment={vertical:'middle',horizontal:'center',wrapText:true};});
    ws.headerFooter.oddFooter='&LThư Viện Số Văn Học&RTrang &P / &N';return ws;
  }
  function add(ws,values){const row=ws.addRow(values);row.height=42;row.eachCell({includeEmpty:true},(cell,i)=>{cell.font={name:'Calibri',size:11,color:{argb:'243746'}};cell.alignment={vertical:'middle',horizontal:i<=3&&i!==1?'left':'center',wrapText:true};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:row.number%2===0?blue:'FFFFFF'}};cell.border={bottom:{style:'hair',color:{argb:'CAD8E2'}}};if(typeof cell.value==='number'&&i>3)cell.numFmt='0.##';});return row;}
  const main=sheet('Bảng điểm',`BẢNG ĐIỂM LỚP ${c.name}`,['STT','Họ và tên','Tên đăng nhập',...assignments.map(a=>a.title),'TB điểm đã chốt'],[7,29,21,...assignments.map(()=>25),19],'Mỗi bài lấy lượt nộp mới nhất. Điểm quy về thang 10; bài chưa chốt không tính vào trung bình.');
  const detail=sheet('Chi tiết lượt làm','CHI TIẾT KẾT QUẢ HỌC TẬP',['STT','Họ và tên','Tên đăng nhập','Bài kiểm tra','Lượt','Ngày nộp (giờ VN)','Trắc nghiệm','Tự luận','Tổng điểm','Thang điểm','Điểm / 10','Trạng thái'],[7,29,21,43,8,23,15,14,14,14,14,24],'Giữ đầy đủ các lượt nộp. Điểm tự luận và tổng điểm chỉ hiển thị khi giáo viên đã chốt.');
  let detailIndex=0;
  members.forEach((m,i)=>{
    const u=db.users.find(u=>u._id===m.studentId),scores=[];
    const cells=assignments.map(a=>{
      const attempts=results.filter(r=>r.assignmentId===a._id&&r.user===m.studentId).sort((a,b)=>new Date(a.submittedAt)-new Date(b.submittedAt));
      if(!attempts.length)add(detail,[++detailIndex,u?.fullName||'Học sinh',u?.username||'',a.title,null,null,null,null,null,a.totalPoints||null,null,'Chưa nộp']);
      attempts.forEach((r,index)=>add(detail,[++detailIndex,u?.fullName||'Học sinh',u?.username||'',a.title,index+1,r.submittedAt?new Date(r.submittedAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}):'',r.mcScore??null,r.publishedAt?r.essayScore:null,r.publishedAt?r.totalScore:null,r.maxScore,r.publishedAt&&r.maxScore>0?round(r.totalScore/r.maxScore*10):null,r.publishedAt?'Đã chốt':'Chờ chấm / chốt']));
      const r=latest(attempts);if(!r)return 'Chưa nộp';if(!r.publishedAt)return 'Chờ chấm';if(!(r.maxScore>0))return '—';const score=round(r.totalScore/r.maxScore*10);scores.push(score);return score;
    });
    const row=add(main,[i+1,u?.fullName||'Học sinh',u?.username||'',...cells,scores.length?round(scores.reduce((s,n)=>s+n,0)/scores.length):null]);
    for(let col=4;col<=row.cellCount;col++){const cell=row.getCell(col);if(typeof cell.value==='number')cell.font={name:'Calibri',size:11,bold:true,color:{argb:cell.value<5?'B42318':'176B52'}};else if(cell.value==='Chờ chấm')cell.font={name:'Calibri',size:10,color:{argb:'9A6700'}};}
  });
  for(const ws of [main,detail]){ws.autoFilter={from:{row:5,column:1},to:{row:Math.max(ws.rowCount,5),column:ws.columnCount}};ws.pageSetup.printArea=`A1:${ws.getColumn(ws.columnCount).letter}${Math.max(ws.rowCount,5)}`;}
  return book.xlsx.writeBuffer();
}
