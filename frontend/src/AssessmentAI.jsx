import {React,apiClient} from './runtime.js';
import {useTeacherDraft} from './useTeacherDraft.js';

export function AssessmentAI({base,initialContent,onApply,disabled,remaining}){
 const [input,setInput]=useTeacherDraft(base,'ai-input',{topic:'',content:'',count:5});
 const [result,setResult]=useTeacherDraft(base,'ai-result',null);
 const [busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
 const controller=React.useRef(null);
 React.useEffect(()=>()=>controller.current?.abort(),[]);
 const generate=async e=>{e.preventDefault();if(controller.current)return;setError('');setBusy(true);const request=new AbortController();controller.current=request;
  try{const r=await apiClient.post(base+'/generate',input,{signal:request.signal,timeout:120000});if(!request.signal.aborted)setResult(r.data);}
  catch(e){if(!request.signal.aborted)setError(e.response?.data?.error||'Chưa tạo được câu hỏi. Hãy thử lại; nội dung đã nhập vẫn được giữ.');}
  finally{if(!request.signal.aborted){controller.current=null;setBusy(false);}}
 };
 return <details className="assessment-ai"><summary>✦ Tạo trắc nghiệm bằng AI</summary><p>Nhập chủ đề và tư liệu bài học. AI tạo câu hỏi, 4 lựa chọn, đáp án và giải thích để thầy cô duyệt trước khi dùng.</p>
 <form onSubmit={generate}><fieldset disabled={busy||disabled}>
 <label className="class-field">Chủ đề trắc nghiệm<input required maxLength={200} value={input.topic} onChange={e=>setInput({...input,topic:e.target.value})} placeholder="Ví dụ: Tình bạn trong Bài học đường đời đầu tiên"/></label>
 <label className="class-field">Nội dung cho AI<textarea required rows={7} maxLength={30000} value={input.content} onChange={e=>setInput({...input,content:e.target.value})} placeholder="Dán văn bản, kiến thức trọng tâm hoặc nội dung bài học làm căn cứ tạo câu hỏi…"/></label>
 <div className="assessment-ai-tools"><button type="button" className="secondary" disabled={!initialContent} onClick={()=>setInput({...input,content:initialContent})}>Dùng ngữ liệu đang soạn</button><label className="class-field">Số câu AI tạo<input type="number" min={1} max={20} required value={input.count} onChange={e=>setInput({...input,count:e.target.value===''?'':Number(e.target.value)})}/></label><button type="submit">{busy?'AI đang tạo câu hỏi…':'Tạo câu hỏi bằng AI'}</button></div>
 </fieldset></form>
 {busy&&<p role="status">Đang tạo bản xem trước. Đề đang soạn vẫn được giữ nguyên.</p>}{error&&<p className="class-error" role="alert">{error}</p>}
 {result&&<section aria-label="Câu hỏi AI chờ duyệt" className="assessment-ai-result"><h3>{result.questions.length} câu hỏi AI chờ duyệt</h3><p><strong>{result.title}</strong> · Mỗi câu mặc định 1 điểm. Kiểm tra nội dung và đáp án; sau khi thêm có thể sửa từng câu và điểm trong đề.</p>
 {result.questions.map((q,i)=><article key={q.id}><h4>{i+1}. {q.content}</h4><ol type="A">{q.options.map((o,j)=><li key={o.id} className={j===q.correctAnswer?'assessment-ai-answer':''}>{o.content}{j===q.correctAnswer?' ✓ Đáp án đúng':''}</li>)}</ol><p><strong>Giải thích:</strong> {q.explanation}</p></article>)}
 {result.questions.length>remaining&&<p role="alert">Đề còn chỗ cho {remaining} câu. Hãy giảm số câu hoặc xóa bớt câu trong đề trước khi thêm.</p>}
 <div className="assessment-ai-tools"><button type="button" disabled={busy||disabled||result.questions.length>remaining} onClick={()=>{if(onApply(result)!==false){setResult(null);setError('');}}}>Thêm câu hỏi vào đề</button><button type="button" className="secondary" disabled={busy||disabled} onClick={()=>setResult(null)}>Bỏ bản AI</button></div><p className="assessment-hint">Chưa lưu vào thư viện hoặc giao lớp. Dùng “Lưu đề” hoặc “Lưu & giao cho lớp” sau khi chỉnh sửa xong.</p>
 </section>}
 </details>;
}
