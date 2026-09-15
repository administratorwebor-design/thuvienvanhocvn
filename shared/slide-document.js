export const slideId = () => globalThis.crypto.randomUUID();
export const blankSlide = () => ({id:slideId(),background:'#fffaf0',items:[]});
const bad=message=>{throw Object.assign(new Error(message),{status:400});};
const color=v=>{if(!/^#[\da-f]{6}$/i.test(v||''))bad('Màu phải có định dạng #RRGGBB.');return v;};
const content=(v,max,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))bad(`Nội dung cần ${required?'từ 1 đến':'tối đa'} ${max} ký tự.`);return v;};
const number=(v,min,max)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)bad('Vị trí hoặc kích thước ngoài giới hạn.');return v;};
export function validateSlideDocument(input,images=[]){
  if(!input||!Array.isArray(input.slides)||input.slides.length<1||input.slides.length>40)bad('Bài giảng cần từ 1 đến 40 trang.');
  const ids=new Set();
  const id=v=>{if(typeof v!=='string'||!/^[\w-]{1,80}$/.test(v)||ids.has(v))bad('Mã trang hoặc đối tượng không hợp lệ / trùng lặp.');ids.add(v);return v;};
  return {title:content(input.title,200,true),description:content(input.description||'',10000),slides:input.slides.map(s=>{
    if(!Array.isArray(s.items)||s.items.length>30)bad('Mỗi trang tối đa 30 đối tượng.');
    return {id:id(s.id),background:color(s.background),items:s.items.map(o=>{
      const item={id:id(o.id),type:o.type,x:number(o.x,0,100),y:number(o.y,0,100),w:number(o.w,5,100),h:number(o.h,5,100)};
      if(item.x+item.w>100.01||item.y+item.h>100.01)bad('Đối tượng phải nằm trong trang.');
      if(o.type==='text')return {...item,text:content(o.text,4000),color:color(o.color),background:color(o.background),transparent:!!o.transparent,fontSize:number(o.fontSize,12,80),bold:!!o.bold,align:['left','center','right'].includes(o.align)?o.align:'left'};
      if(o.type==='image'){if(!images.includes(o.src))bad('Ảnh cần được tải lên trong bài giảng này.');return {...item,src:o.src,alt:content(o.alt||'',200),fit:o.fit==='cover'?'cover':'contain'};}
      if(o.type==='quiz'){
        if(!Array.isArray(o.options)||o.options.length!==4||!Number.isInteger(o.correct)||o.correct<0||o.correct>3)bad('Câu hỏi cần 4 lựa chọn và 1 đáp án đúng.');
        return {...item,question:content(o.question,1000,true),options:o.options.map(v=>content(v,400,true)),correct:o.correct,explanation:content(o.explanation||'',2000)};
      }
      bad('Loại đối tượng không được hỗ trợ.');
    })};
  })};
}
export function lessonHtml(document){
  const data=JSON.stringify(document).replace(/</g,'\\u003c');
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bài giảng tương tác</title><link rel="stylesheet" href="/reference/slide-player.css"></head><body><header><h1 id="title"></h1><p id="description"></p></header><main><div id="slide" aria-label="Trang bài giảng"></div></main><nav aria-label="Điều hướng bài giảng"><button id="previous">← Trang trước</button><output id="counter" aria-live="polite"></output><button id="next">Trang sau →</button></nav><p id="quiz-note">Câu hỏi trong bài là luyện tập, có thể làm lại và không ghi điểm vào bảng điểm lớp.</p><script>window.LESSON_DOCUMENT=${data};</script><script src="/reference/slide-player.js"></script></body></html>`;
}
