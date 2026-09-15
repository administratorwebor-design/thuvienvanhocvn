(() => {
  const topic = window.LESSON;
  const $ = id => document.getElementById(id);
  const questions = topic.questions.filter(q => q.type !== 'essay');
  const count = topic.slides.length + questions.length + 1;
  const answers = new Map();
  let index = 0;
  const audio = $('audio');
  document.title = topic.title;
  $('title').textContent = topic.title;
  $('source').textContent = topic.source + ' · Bài giảng tóm tắt và câu hỏi được biên soạn để ôn tập.';
  $('unit').textContent = topic.unit;
  const node = (tag, text, className) => { const e = document.createElement(tag); if (text) e.textContent = text; if (className) e.className = className; return e; };
  const labels = [...topic.slides.map(s => s.title), ...questions.map((_,i) => `Luyện tập ${i+1}`), 'Kết quả & vận dụng'];
  labels.forEach((label,i) => {
    const b = node('button');
    if (i < topic.slides.length) { const img = node('img'); img.src = `slide-${i}.jpg`; img.alt = ''; b.append(img); }
    b.append(node('span',`${i+1}. ${label}`)); b.onclick = () => { index=i; render(); }; $('menu').append(b);
  });
  function render() {
    if (window.parent !== window) window.parent.postMessage({type:'literature-progress',position:index+1,total:count,unit:'pages'},'*');
    audio.pause(); $('status').textContent='';
    $('previous').disabled = index === 0; $('next').disabled = index === count-1;
    $('counter').textContent = `${index+1} / ${count}`; $('progress').value=index+1; $('progress').max=count;
    [...$('menu').children].forEach((b,i) => b.setAttribute('aria-current',String(i===index)));
    $('content').replaceChildren();
    audio.classList.toggle('hidden',index>=topic.slides.length);
    if(index<topic.slides.length) {
      const slide=topic.slides[index]; audio.src=`audio-${index}.mp3`;
      const hero=node('div',null,'hero'), img=node('img'), body=node('div');
      img.src='illustration.jpg'; img.alt=`Minh họa ${topic.title} trong sách giáo khoa`;
      body.append(node('p','Khám phá văn bản','eyebrow'),node('h2',slide.title),node('p',slide.body)); hero.append(img,body);$('content').append(hero);
    } else if(index<count-1) {
      const qi=index-topic.slides.length,q=questions[qi];
      $('content').append(node('p',`Luyện tập ${qi+1} / ${questions.length}`,'eyebrow'),node('h2',q.content));
      const form=node('form');
      q.options.forEach((option,i) => { const label=node('label',null,'option'),input=node('input'); input.type='radio';input.name='answer';input.value=i;input.required=true;input.checked=answers.get(qi)?.selected===i;label.append(input,node('span',option));form.append(label); });
      const check=node('button','Kiểm tra');check.id='check';check.type='submit';form.append(check);
      const feedback=node('div');feedback.id='feedback';feedback.setAttribute('role','status');
      function showAnswer(result) { feedback.textContent=(result.correct?'Đúng! ':'Chưa đúng. ')+q.explanation; }
      if(answers.has(qi)) showAnswer(answers.get(qi));
      form.onsubmit=event=>{event.preventDefault();const selected=Number(new FormData(form).get('answer'));const result={selected,correct:selected===q.correctAnswer};answers.set(qi,result);showAnswer(result);};
      $('content').append(form,feedback);
    } else {
      const result=node('div');result.id='result';
      const score=[...answers.values()].filter(a=>a.correct).length;
      result.append(node('h2',answers.size===questions.length?'Hoàn thành bài học':'Cùng hoàn thành phần luyện tập'),node('strong',`${score} / ${questions.length}`),node('p',`Đã trả lời ${answers.size}/${questions.length} câu. Kết quả luyện tập này chỉ tính trong lượt học hiện tại.`));
      const essay=topic.questions.find(q=>q.type==='essay');result.append(node('h3','Vận dụng'),node('p',essay.content),node('p',essay.hint));
      const restart=node('button','Luyện tập lại');restart.id='restart';restart.onclick=()=>{answers.clear();index=topic.slides.length;render();};result.append(restart);$('content').append(result);
    }
  }
  $('previous').onclick=()=>{if(index>0){index--;render();}};
  $('next').onclick=()=>{if(index<count-1){index++;render();}};
  $('menu-toggle').onclick=()=>{const open=$('sidebar').classList.toggle('open');$('menu-toggle').setAttribute('aria-expanded',String(open));};
  $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('status').textContent='Trình duyệt chưa cho phép toàn màn hình.';}};
  audio.onerror=()=>{$('status').textContent='Chưa tải được lời đọc. Bạn vẫn có thể đọc và chuyển phần.';};
  document.addEventListener('keydown',event=>{if(event.target.matches('input,button,audio'))return;if(event.key==='ArrowRight'){$('next').click();event.preventDefault();}if(event.key==='ArrowLeft'){$('previous').click();event.preventDefault();}});
  render();
})();
