import { React } from './runtime.js';

const states = [
  { label: 'Chưa mở', color: '#cbd5e1' },
  { label: 'Đã mở / đang học', color: '#4389c7' },
  { label: 'Tự xác nhận', color: '#e5aa46' },
  { label: 'Đã nộp', color: '#259b87' },
];
export function ProgressDashboard({ members, assignments, activity, results }) {
  const [selected, setSelected] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const tasks = assignments.filter(a => selected === 'all' || a._id === selected);
  const students = members.filter(m => m.status === 'approved');
  const rows = students.map(m => ({ ...m, tasks: tasks.map(a => {
    const event = activity.find(e => e.studentId === m.studentId && e.assignmentId === a._id);
    const submitted = results.filter(r => r.user === m.studentId && r.assignmentId === a._id).sort((a,b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))[0];
    return { ...a, event, state: submitted ? 3 : event?.selfCompletedAt ? 2 : event ? 1 : 0, date: [event?.lastSeenAt, submitted?.submittedAt].filter(Boolean).sort((a,b) => Date.parse(b)-Date.parse(a))[0] };
  }) }));
  const all = rows.flatMap(r => r.tasks);
  const counts = states.map((_, i) => all.filter(t => t.state === i).length);
  let angle = 0;
  const gradient = states.map((s,i) => { const start = angle; angle += all.length ? counts[i]/all.length*100 : 0; return `${s.color} ${start}% ${angle}%`; }).join(',');
  const shown = rows.filter(r => (r.student?.fullName || '').toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')));
  return <section aria-label="Tiến độ học tập">
    <div className="progress-heading"><div><h2>Tiến độ học tập</h2><p>Theo dõi từng học sinh và mức độ tham gia của cả lớp.</p></div><label className="class-field">Bài học<select aria-label="Bài học" value={selected} onChange={e=>setSelected(e.target.value)}><option value="all">Tất cả bài được giao</option>{assignments.map(a=><option key={a._id} value={a._id}>{a.title}{a.isActive === false ? ' (đã thu hồi)' : ''}</option>)}</select></label></div>
    <div className="progress-layout">
      <section className="progress-students">
        <div className="progress-list-heading"><h3>Danh sách học sinh <span>{students.length}</span></h3><input aria-label="Tìm học sinh" placeholder="Tìm tên học sinh…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <div className="class-table"><table><thead><tr><th>Học sinh</th><th>Đã mở / tổng bài</th><th>Đã nộp</th><th>Gần nhất</th></tr></thead><tbody>{shown.map(m=>{
          const opened=m.tasks.filter(t=>t.state>0).length;
          const last=m.tasks.map(t=>t.date).filter(Boolean).sort((a,b)=>Date.parse(b)-Date.parse(a))[0];
          return <tr key={m.studentId}><td><details><summary>{m.student?.fullName || 'Học sinh'}</summary><div className="progress-task-details">{m.tasks.map(t=><div key={t._id}><strong>{t.title}</strong><span style={{color: t.state === 0 ? '#64748b' : states[t.state].color}}>{states[t.state].label}</span>{t.event?.position !== undefined && <small>Vị trí {t.event.position}/{t.event.total} {t.event.unit === 'seconds' ? 'giây' : 'trang'}</small>}{!!t.event?.aiInteractions && <small>{t.event.aiInteractions} thao tác AI</small>}</div>)}{!m.tasks.length && <p>Chưa có bài được giao.</p>}</div></details></td><td><b>{opened}/{m.tasks.length}</b><div className="progress-meter"><i style={{width:`${m.tasks.length ? opened/m.tasks.length*100 : 0}%`}} /></div></td><td>{m.tasks.filter(t=>t.state===3).length}</td><td>{last ? new Date(last).toLocaleString('vi-VN') : '—'}</td></tr>;
        })}</tbody></table>{!shown.length && <p className="progress-empty">{students.length ? 'Không tìm thấy học sinh phù hợp.' : 'Chưa có học sinh được duyệt vào lớp.'}</p>}</div>
        <p className="progress-note">Bấm tên học sinh để xem từng bài. “Đã mở” chỉ ghi nhận truy cập; “Tự xác nhận” do học sinh đánh dấu. Vị trí video/trang không chứng minh đã học hết.</p>
      </section>
      <aside className="progress-charts" aria-label="Biểu đồ tiến độ">
        <section className="progress-chart"><h3>Trạng thái bài học</h3><p>Mỗi lượt là một học sinh × một bài.</p><div className="progress-donut" role="img" aria-label={states.map((s,i)=>`${s.label}: ${counts[i]}`).join(', ')} style={{background:all.length ? `conic-gradient(${gradient})` : '#e8eef2'}}><div><strong>{all.length}</strong><span>lượt học</span></div></div><ul className="progress-legend">{states.map((s,i)=><li key={s.label}><i style={{background:s.color}}/><span>{s.label}</span><b>{counts[i]}</b></li>)}</ul>{!all.length && <p>Chưa có dữ liệu tiến độ.</p>}</section>
        <section className="progress-chart"><h3>Tham gia theo bài</h3><p>Số học sinh đã mở, tự xác nhận hoặc nộp bài.</p><div className="progress-columns">{tasks.map((t,i)=>{const n=rows.filter(r=>r.tasks.some(a=>a._id===t._id&&a.state>0)).length; return <div className="progress-column" key={t._id} title={`${t.title}: ${n}/${students.length} học sinh`}><b>{n}</b><div className="progress-column-track"><i style={{height:`${students.length ? n/students.length*100 : 0}%`}} /></div><span>Bài {i+1}</span></div>;})}</div><ol className="progress-task-key">{tasks.map(t=><li key={t._id}>{t.title}</li>)}</ol>{!tasks.length && <p>Chưa có bài được giao.</p>}<small>Toàn lớp: {students.length} học sinh. Biểu đồ theo bộ lọc bài học, không theo ô tìm tên.</small></section>
      </aside>
    </div>
  </section>;
}
