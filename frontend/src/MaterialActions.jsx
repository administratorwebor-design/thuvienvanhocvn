import {React,Link,apiClient,useQuery,useQueryClient} from './runtime.js';
import {useAuth} from './useAuth.js';
import {useCategories} from './useCategories.js';
import './material-actions.css';

export function MaterialCard({kind,item,to,children,className}){
  return <article className={className}><Link to={to} className="material-card-link">{children}</Link><MaterialActions kind={kind} item={item}/></article>;
}
export function MaterialActions({kind,item}){
  const {user}=useAuth(),cache=useQueryClient(),staff=['teacher','admin'].includes(user?.role);
  const {data}=useQuery({queryKey:['material-permissions',kind,user?._id],enabled:staff,queryFn:async()=>(await apiClient.get('/teacher-library/'+kind)).data});
  const [mode,setMode]=React.useState(null);
  if(!staff||!data?.ids?.includes(item._id))return null;
  return <div className="material-actions" onClick={e=>{e.preventDefault();e.stopPropagation();}}>
    <button type="button" onClick={()=>setMode('edit')} aria-label={'Chỉnh sửa '+item.title}>Chỉnh sửa</button>
    <button type="button" className="material-delete" onClick={()=>setMode('delete')} aria-label={'Xóa '+item.title}>Xóa</button>
    {mode&&<MaterialDialog kind={kind} id={item._id} title={item.title} mode={mode} close={()=>setMode(null)} saved={()=>{cache.invalidateQueries();setMode(null);}}/>}
  </div>;
}
function MaterialDialog({kind,id,title,mode,close,saved}){
  const ref=React.useRef(),[form,setForm]=React.useState(null),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false);
  const {data:categories}=useCategories(),base='/teacher-library/'+kind+'/'+id;
  React.useEffect(()=>{ref.current.showModal();let active=true;apiClient.get(base).then(r=>{if(active)setForm({...r.data.item,url:kind==='elearnings'?(r.data.item.storyPath||r.data.item.url||''):r.data.item.url,category:r.data.item.category?._id||r.data.item.category||'',updatedAt:r.data.item.updatedAt||null});}).catch(e=>{if(active)setError(e.response?.data?.error||'Không tải được học liệu.');});return()=>{active=false;};},[base,kind]);
  const field=(key,value)=>setForm(f=>({...f,[key]:value}));
  return <dialog ref={ref} className="material-dialog" aria-label={mode==='delete'?'Xóa học liệu':'Chỉnh sửa học liệu'} onCancel={e=>{e.preventDefault();if(!busy)close();}} onClick={e=>e.stopPropagation()}>
    <form onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{
      if(mode==='delete')await apiClient.delete(base,{data:{updatedAt:form.updatedAt}});
      else{const body={title:form.title,description:form.description||'',author:form.author||'',category:form.category,updatedAt:form.updatedAt};if(kind==='quizzes'){body.duration=form.duration;body.questions=form.questions;}else{body.url=form.url||'';body.thumbnail=form.thumbnail||'';}await apiClient.patch(base,body);}
      saved();
    }catch(e){setError(e.response?.data?.error||'Không lưu được thay đổi. Vui lòng thử lại.');}finally{setBusy(false);}}}>
      <header><h2>{mode==='delete'?'Xóa học liệu':'Chỉnh sửa học liệu'}</h2><button type="button" disabled={busy} onClick={close} aria-label="Đóng">×</button></header>
      {error&&<p role="alert" className="material-error">{error}</p>}
      {!form&&!error&&<p role="status">Đang tải…</p>}
      {form&&(mode==='delete'?<><p>Bạn muốn xóa <strong>{title}</strong>?</p><p>Học liệu sẽ được gỡ khỏi thư viện và bài giao tương ứng sẽ được thu hồi. Kết quả và điểm đã có vẫn được giữ lại.</p></>:<fieldset disabled={busy}>
        <label>Tiêu đề<input required maxLength={200} value={form.title} onChange={e=>field('title',e.target.value)}/></label>
        <label>{kind==='quizzes'?'Ngữ liệu / yêu cầu':'Mô tả'}<textarea rows={5} maxLength={30000} value={form.description||''} onChange={e=>field('description',e.target.value)}/></label>
        <label>Danh mục<select value={form.category} onChange={e=>field('category',e.target.value)}><option value="">Chưa phân loại</option>{categories?.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
        <label>Tác giả / giảng viên<input maxLength={200} value={form.author||''} onChange={e=>field('author',e.target.value)}/></label>
        {kind==='quizzes'?<><label>Thời gian làm bài (phút)<input type="number" min={1} max={180} required value={form.duration} onChange={e=>field('duration',Number(e.target.value))}/></label><QuizFields questions={form.questions} change={q=>field('questions',q)}/><p>Bài kiểm tra đã giao trong lớp giữ nguyên câu hỏi và đáp án lúc giao.</p></>:<>
          <label>Đường dẫn {kind==='videos'?'video':kind==='storybooks'?'sách':'bài giảng'}<input maxLength={2000} value={form.url||''} onChange={e=>field('url',e.target.value)}/></label>
          <label>Đường dẫn ảnh đại diện<input maxLength={2000} value={form.thumbnail||''} onChange={e=>field('thumbnail',e.target.value)}/></label>
        </>}
      </fieldset>)}
      <footer><button type="button" disabled={busy} onClick={close}>Hủy</button><button className={mode==='delete'?'material-danger':'material-save'} disabled={busy||!form}>{busy?'Đang lưu…':mode==='delete'?'Xác nhận xóa':'Lưu thay đổi'}</button></footer>
    </form>
  </dialog>;
}
function QuizFields({questions,change}){
  const update=(i,patch)=>change(questions.map((q,j)=>i===j?{...q,...patch}:q));
  const add=type=>change([...questions,{id:crypto.randomUUID(),type,content:'',points:1,explanation:'',hint:'',correctAnswer:0,options:type==='essay'?[]:Array.from({length:4},(_,i)=>({id:crypto.randomUUID(),content:'',isCorrect:i===0}))}]);
  return <section className="material-questions"><h3>Câu hỏi và đáp án</h3>{questions.map((q,i)=><fieldset key={q.id}><legend>Câu {i+1}</legend>
    <label>Nội dung câu {i+1}<textarea aria-label={`Nội dung câu ${i+1}`} required value={q.content} onChange={e=>update(i,{content:e.target.value})}/></label>
    <label>Điểm câu {i+1}<input type="number" required min={0.01} max={100} step="any" value={q.points} onChange={e=>update(i,{points:Number(e.target.value)})}/></label>
    {q.type==='multiple_choice'&&<>{q.options.map((o,j)=><label key={o.id}>Câu {i+1} lựa chọn {j+1}<input required value={o.content} onChange={e=>update(i,{options:q.options.map((v,k)=>k===j?{...v,content:e.target.value}:v)})}/></label>)}<label>Đáp án đúng câu {i+1}<select aria-label={`Đáp án đúng câu ${i+1}`} value={q.correctAnswer} onChange={e=>update(i,{correctAnswer:Number(e.target.value),options:q.options.map((o,j)=>({...o,isCorrect:j===Number(e.target.value)}))})}>{q.options.map((o,j)=><option key={o.id} value={j}>Lựa chọn {j+1}</option>)}</select></label></>}
    <label>Giải thích / hướng dẫn chấm câu {i+1}<textarea value={q.explanation||''} onChange={e=>update(i,{explanation:e.target.value})}/></label>
    <label>Gợi ý cho học sinh câu {i+1}<input value={q.hint||''} onChange={e=>update(i,{hint:e.target.value})}/></label>
    <button type="button" disabled={questions.length===1} onClick={()=>change(questions.filter((_,j)=>j!==i))}>Xóa câu {i+1}</button>
  </fieldset>)}<div className="material-actions"><button type="button" disabled={questions.length>=100} onClick={()=>add('multiple_choice')}>Thêm trắc nghiệm</button><button type="button" disabled={questions.length>=100} onClick={()=>add('essay')}>Thêm tự luận</button></div></section>;
}
