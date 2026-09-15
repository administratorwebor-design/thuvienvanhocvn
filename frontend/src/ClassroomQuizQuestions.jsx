import {React} from './runtime.js';
export function ClassroomQuizQuestions({questions,answers,onAnswer,namePrefix=''}){
  return questions.map((q,i)=><fieldset className="class-panel" key={q.id}><legend>Câu {i+1} · {q.points} điểm</legend><p><b>{q.content}</b></p>{q.type==='essay'?<><textarea aria-label={`Trả lời câu ${i+1}`} value={answers[q.id]||''} onChange={e=>onAnswer(q.id,e.target.value)}/>{q.hint&&<p>Gợi ý: {q.hint}</p>}</>:q.options.map((o,j)=><label className="class-option" key={o.id}><input type="radio" name={namePrefix+q.id} checked={answers[q.id]===o.id} onChange={()=>onAnswer(q.id,o.id)}/>{String.fromCharCode(65+j)}. {o.content}</label>)}</fieldset>);
}
