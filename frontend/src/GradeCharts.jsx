import { React } from './runtime.js';
export function GradeCharts({members, assignments, results}) {
  const [selected,setSelected]=React.useState('all');
  const quizzes=assignments.filter(a=>a.kind==='quizzes');
  const tasks=quizzes.filter(a=>selected==='all'||a._id===selected);
  const students=members.filter(m=>m.status==='approved');
  const latest=students.flatMap(m=>tasks.map(a=>results.filter(r=>r.user===m.studentId&&r.assignmentId===a._id).sort((a,b)=>Date.parse(b.submittedAt)-Date.parse(a.submittedAt))[0]));
  const graded=latest.filter(r=>r?.publishedAt&&r.maxScore>0);
  const scores=graded.map(r=>r.totalScore/r.maxScore*10);
  const bars=[['Dưới 5',scores.filter(n=>n<5).length],['5 đến dưới 6,5',scores.filter(n=>n>=5&&n<6.5).length],['6,5 đến dưới 8',scores.filter(n=>n>=6.5&&n<8).length],['8 đến 10',scores.filter(n=>n>=8).length]];
  return <section className="class-panel" aria-label="Biểu đồ bảng điểm">
    <h3>Tổng quan kết quả học tập</h3>
    <label>Bài kiểm tra <select value={selected} onChange={e=>setSelected(e.target.value)}><option value="all">Tất cả bài kiểm tra</option>{quizzes.map(a=><option key={a._id} value={a._id}>{a.title}</option>)}</select></label>
    <p>{students.length} học sinh · {latest.filter(Boolean).length}/{latest.length} bài đã nộp · {latest.filter(r=>r&&!r.publishedAt).length} bài chờ chốt · {latest.filter(r=>!r).length} bài chưa nộp</p>
    <p><strong>Điểm trung bình: {scores.length?(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1)+'/10':'Chưa có điểm'}</strong></p>
    <h4>Phân bố điểm đã chốt</h4>
    {bars.map(([label,count])=><div key={label} style={{display:'grid',gridTemplateColumns:'120px minmax(0,1fr) 50px',gap:12,alignItems:'center',margin:'12px 0'}}><span>{label}</span><div style={{background:'#e2e8f0',borderRadius:6,height:22}}><div style={{width:`${scores.length?count/scores.length*100:0}%`,background:'#2563eb',height:'100%',borderRadius:6}} /></div><strong>{count} bài</strong></div>)}
    <small>Tính theo lượt nộp mới nhất của mỗi học sinh cho mỗi bài. Điểm quy đổi về thang 10; bài chưa chốt không tính vào trung bình và biểu đồ.</small>
  </section>;
}
