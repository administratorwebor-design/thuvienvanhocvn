import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from '../backend/node_modules/exceljs/excel.js';
import {gradeWorkbook} from '../backend/grade-workbook.js';
test('Excel gradebook: formatted student matrix, numeric scores, latest attempt, unpublished grades hidden and all attempts retained',async()=>{
 const c={_id:'c',name:'6A',teacherId:'t'},db={users:[{_id:'t',fullName:'Giáo viên'},{_id:'s',fullName:'=HYPERLINK("bad")',username:'hocsinh'},{_id:'n',fullName:'Chưa nộp'}],memberships:[{classId:'c',studentId:'s',status:'approved'},{classId:'c',studentId:'n',status:'approved'}],assignments:[{_id:'a',classId:'c',kind:'quizzes',title:'Đề 01'},{_id:'b',classId:'c',kind:'quizzes',title:'Đề 02'}],classResults:[
 {_id:'r1',classId:'c',assignmentId:'a',user:'s',submittedAt:'2026-01-01T00:00:00Z',publishedAt:'yes',totalScore:4,maxScore:5,mcScore:3,essayScore:1},
 {_id:'r2',classId:'c',assignmentId:'a',user:'s',submittedAt:'2026-01-02T00:00:00Z',publishedAt:null,totalScore:5,maxScore:5,mcScore:3,essayScore:2},
 {_id:'r3',classId:'c',assignmentId:'b',user:'s',submittedAt:'2026-01-02T00:00:00Z',publishedAt:'yes',totalScore:0,maxScore:5,mcScore:0,essayScore:0}]};
 const book=new ExcelJS.Workbook();await book.xlsx.load(await gradeWorkbook(db,c));
 const ws=book.getWorksheet('Bảng điểm'),details=book.getWorksheet('Chi tiết lượt làm');
 assert.equal(ws.getCell('D6').value,'Chờ chấm');assert.equal(ws.getCell('E6').value,0);assert.equal(ws.getCell('F6').value,0);assert.equal(ws.getCell('F7').value,null);assert.equal(ws.getCell('B6').value,db.users[1].fullName);assert.equal(ws.getCell('B6').type,ExcelJS.ValueType.String);
 assert.equal(ws.views[0].ySplit,5);assert.equal(ws.getCell('A5').fill.fgColor.argb,'244B68');assert(ws.autoFilter);assert.equal(ws.rowCount,7);assert.equal(details.rowCount,10);assert.equal(details.getCell('I7').value,null);assert.equal(details.getCell('L7').value,'Chờ chấm / chốt');
});
