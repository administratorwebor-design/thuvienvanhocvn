const doc=window.LESSON_DOCUMENT;
document.title=doc.title;document.getElementById('title').textContent=doc.title;document.getElementById('description').textContent=doc.description;
const stage=document.getElementById('slide'),answers=new Map();let current=0;
function render(){const slide=doc.slides[current];stage.replaceChildren();stage.style.background=slide.background;
  for(const item of slide.items){const node=document.createElement('div');node.className='slide-item '+item.type;Object.assign(node.style,{left:item.x+'%',top:item.y+'%',width:item.w+'%',height:item.h+'%'});
    if(item.type==='text'){node.textContent=item.text;Object.assign(node.style,{fontSize:(item.fontSize/9.6)+'cqw',fontWeight:item.bold?'700':'400',color:item.color,background:item.transparent?'transparent':item.background,textAlign:item.align});}
    if(item.type==='image'){const img=document.createElement('img');img.src=item.src;img.alt=item.alt;img.style.objectFit=item.fit;node.append(img);}
    if(item.type==='quiz'){
      const heading=document.createElement('h2');heading.textContent=item.question;node.append(heading);const feedback=document.createElement('p');feedback.setAttribute('role','status');
      item.options.forEach((option,i)=>{const b=document.createElement('button');b.textContent=String.fromCharCode(65+i)+'. '+option;b.onclick=()=>{answers.set(item.id,i);render();};b.setAttribute('aria-pressed',String(answers.get(item.id)===i));node.append(b);});
      if(answers.has(item.id)){const correct=answers.get(item.id)===item.correct;feedback.textContent=(correct?'Chính xác! ':'Chưa đúng. Đáp án: '+String.fromCharCode(65+item.correct)+'. '+item.options[item.correct]+'. ')+item.explanation;feedback.className=correct?'correct':'incorrect';}node.append(feedback);
    }stage.append(node);
  }
  document.getElementById('counter').textContent=`${current+1} / ${doc.slides.length}`;document.getElementById('previous').disabled=current===0;document.getElementById('next').disabled=current===doc.slides.length-1;
  if(window.parent!==window)window.parent.postMessage({type:'literature-progress',position:current+1,total:doc.slides.length,unit:'pages'},'*');
}
document.getElementById('previous').onclick=()=>{if(current>0){current--;render();}};document.getElementById('next').onclick=()=>{if(current<doc.slides.length-1){current++;render();}};
document.addEventListener('keydown',e=>{if(e.target.closest('button'))return;if(e.key==='ArrowRight')document.getElementById('next').click();if(e.key==='ArrowLeft')document.getElementById('previous').click();});render();
