(() => {
const lesson=window.ILLUSTRATED_LESSON, $=s=>document.querySelector(s), total=lesson.images.length;
let current=0, draft='', checked=false;
const answers=new Map(), key=`illustrated-note-${lesson.id}`;
try{draft=localStorage.getItem(key)||'';}catch{}
document.documentElement.style.setProperty('--accent',lesson.color);
const labels=[...lesson.pages.map(p=>p.title),'Thử tài đọc hiểu','Góc viết của em'];
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
labels.forEach((label,i)=>{const b=el('button',`${String(i+1).padStart(2,'0')} · ${label}`);b.onclick=()=>show(i);$('nav').append(b);});
function show(index){
 current=index;const article=$('#page');article.replaceChildren();article.className=index%2?'reverse':'';
 const figure=el('figure'),img=el('img');img.src=lesson.images[index];img.alt=`${lesson.work} — minh họa trang ${labels[index]}`;figure.append(img,el('figcaption',`${String(index+1).padStart(2,'0')} / ${lesson.work}`));
 const body=el('div',null,'content');body.append(el('p',index<lesson.pages.length?'KHÁM PHÁ VĂN BẢN':index===total-2?'LUYỆN TẬP CÓ PHẢN HỒI':'KẾT NỐI CUỘC SỐNG','eyebrow'),el('h2',labels[index]));
 if(index<lesson.pages.length){const p=lesson.pages[index];body.append(el('p',p.body,'body'));const prompt=el('div',null,'prompt');prompt.append(el('strong','Dừng lại & suy nghĩ'),el('p',p.prompt));body.append(prompt);}
 else if(index===total-2){
 const form=el('form');lesson.questions.forEach((q,j)=>{const group=el('fieldset');group.append(el('legend',`${j+1}. ${q.text}`));q.options.forEach((option,k)=>{const label=el('label',null,'option'),input=el('input');input.type='radio';input.name=`q${j}`;input.value=k;input.checked=answers.get(j)===k;input.onchange=()=>{answers.set(j,k);checked=false;form.querySelectorAll('.feedback').forEach(n=>n.textContent='');$('#score').textContent='Đã thay đổi lựa chọn. Hãy kiểm tra lại.';};label.append(input,el('span',option));group.append(label);});const feedback=el('p',null,'feedback');feedback.id=`feedback-${j}`;group.append(feedback);form.append(group);});
 const button=el('button','Kiểm tra đáp án');button.type='submit';form.append(button);const score=el('p');score.id='score';score.setAttribute('role','status');form.append(score);body.append(form);
 const grade=()=>{let count=0;lesson.questions.forEach((q,j)=>{const selected=answers.get(j),ok=selected===q.answer;if(ok)count++;form.querySelector(`#feedback-${j}`).textContent=(ok?'Đúng! ':selected===undefined?'Chưa chọn. ':'Chưa đúng. ')+q.explanation;});score.textContent=`Kết quả: ${count}/${lesson.questions.length} câu đúng. Em có thể làm lại để ôn tập.`;};
 form.onsubmit=e=>{e.preventDefault();checked=true;grade();};if(checked)grade();
 }else{
 body.append(el('p',lesson.writing,'body'));const input=el('textarea');input.setAttribute('aria-label','Bài viết vận dụng');input.placeholder='Viết suy nghĩ của em tại đây…';input.value=draft;const status=el('small','Bài viết tự luyện, chưa gửi cho giáo viên.');status.setAttribute('role','status');input.oninput=()=>{draft=input.value;try{localStorage.setItem(key,draft);status.textContent='Đã lưu trên trình duyệt này · Bài viết tự luyện.';}catch{status.textContent='Không thể lưu lâu dài. Hãy tải bài viết trước khi đóng trang.';}};body.append(input,status);const rubric=el('div',null,'prompt');rubric.append(el('strong','Tự kiểm tra bài viết'),el('p',lesson.criteria));body.append(rubric);const download=el('button','Tải bài viết .txt');download.onclick=()=>{const url=URL.createObjectURL(new Blob([lesson.title+'\n\n'+draft],{type:'text/plain;charset=utf-8'})),a=el('a');a.href=url;a.download=lesson.id+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};body.append(download);
 }
 if(index===0&&lesson.video){const section=el('section',null,'topic-video');section.append(el('h3','Xem video cùng bài học'));const frame=el('iframe');frame.src=`https://www.youtube.com/embed/${lesson.video.id}`;frame.title=`Video ${lesson.video.title}`;frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';const link=el('a','Mở video trên YouTube ↗');link.href=`https://www.youtube.com/watch?v=${lesson.video.id}`;link.target='_blank';link.rel='noopener noreferrer';section.append(frame,link);body.append(section);}
 article.append(figure,body);$('#prev').disabled=index===0;$('#next').disabled=index===total-1;$('#counter').textContent=`${index+1} / ${total}`;$('progress').max=total;$('progress').value=index+1;
 [...$('nav').children].forEach((b,i)=>b.setAttribute('aria-current',i===index?'step':'false'));
 if(window.parent!==window)window.parent.postMessage({type:'literature-progress',position:index+1,total,unit:'pages'},'*');
}
$('#prev').onclick=()=>show(Math.max(0,current-1));$('#next').onclick=()=>show(Math.min(total-1,current+1));
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|BUTTON/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();show(Math.min(total-1,current+1));}if(e.key==='ArrowLeft'){e.preventDefault();show(Math.max(0,current-1));}});show(0);
})();
