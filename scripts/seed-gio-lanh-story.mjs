import fs from 'node:fs';
import {createStore} from '../backend/store.js';
const dir='frontend/public/reference/gio-lanh-dau-mua';
fs.mkdirSync(dir,{recursive:true});
const scenes=[
 ['apqam8apqam8apqa.png','Gió lạnh đầu mùa','Phỏng theo truyện của Thạch Lam\nMột câu chuyện về tình yêu thương và sự sẻ chia.'],
 ['a5739ia5739ia573.jpg','Cơn gió đầu mùa','Gió lạnh bất chợt về. Trong căn nhà ấm áp, Sơn được mẹ mặc thêm áo bông. Ngoài cửa, những chiếc lá khô lay động theo từng cơn gió.'],
 ['tt4eprtt4eprtt4e.png','Người bạn ngoài chợ','Sơn cùng chị Lan ra chợ chơi với các bạn. Hiên đứng nép bên đường trong chiếc áo mỏng. Nhìn bạn chịu rét, Sơn thấy thương.'],
 ['c51b7yc51b7yc51b.png','Chiếc áo sẻ chia','Sơn nghĩ đến chiếc áo bông cũ của em Duyên. Lan chạy về lấy áo cho Hiên. Giữa ngày lạnh, sự quan tâm của hai chị em đem đến cho bạn một niềm vui ấm áp.'],
 ['6tfcdj6tfcdj6tfc.png','Nỗi lo của hai chị em','Sau đó, sợ mẹ trách vì tự ý đem áo cho bạn, Sơn và Lan vội đi tìm Hiên. Hai chị em tìm mãi, trong lòng đầy lo lắng.'],
 ['rhbffnrhbffnrhbf.png','Tấm lòng của mẹ','Khi hai chị em về nhà, mẹ Hiên đã mang áo đến trả. Hiểu hoàn cảnh của gia đình Hiên, mẹ Sơn cho mẹ Hiên vay tiền may áo cho con. Sự cảm thông khiến ngày lạnh trở nên ấm áp.'],
 ['apqam8apqam8apqa.png','Điều còn ấm mãi','Sơn và Lan biết thương bạn; những người mẹ cũng ứng xử bằng sự thấu hiểu. Lòng tốt bắt đầu từ việc nhìn thấy và quan tâm đến khó khăn của người khác.'],
 ['c51b7yc51b7yc51b.png','Cùng em suy ngẫm','Điều gì khiến Sơn muốn giúp Hiên?\nEm cảm nhận thế nào về cách ứng xử của mẹ Sơn?\nNếu muốn tặng bạn một món đồ của gia đình, em sẽ trao đổi với người lớn ra sao?\n\nLời kể tóm lược, biên soạn lại từ tác phẩm; tranh Gemini do người dùng cung cấp.']
];
const pages=scenes.map(([file,title,text],i)=>({image:`${String(i+1).padStart(2,'0')}.${file.split('.').at(-1)}`,title,heading:title,text}));
scenes.forEach(([file],i)=>fs.copyFileSync('Gemini_Generated_Image_'+file,dir+'/'+pages[i].image));
fs.writeFileSync(dir+'/pages.js','window.READER_PAGES = '+JSON.stringify(pages,null,2)+';');
let html=fs.readFileSync('frontend/reader/index.html','utf8').replaceAll('Ba lưỡi rìu','Gió lạnh đầu mùa').replace('href="reader.css"','href="../reader.css"').replace('<script defer src="reader.js"></script>','<link rel="stylesheet" href="story.css"><script src="pages.js"></script><script defer src="../reader.js"></script>');
fs.writeFileSync(dir+'/index.html',html);
const store=createStore(process.env.DATA_DIR||'backend/data');const db=store.readDb();
const id='storybook-gio-lanh-dau-mua';
if(!db.storybooks.some(s=>s._id===id)){const now=new Date().toISOString();db.storybooks.push({_id:id,title:'GIÓ LẠNH ĐẦU MÙA',description:'Một chiếc áo nhỏ, một tấm lòng ấm. Storybook minh họa theo truyện của Thạch Lam.',author:'Thạch Lam · Bản kể tóm lược',category:'reference-literature-6',type:'heyzine',url:'/reference/gio-lanh-dau-mua/index.html',thumbnail:'/reference/gio-lanh-dau-mua/'+pages[0].image,aiText:scenes.map(s=>s[1]+': '+s[2]).join('\n\n'),chatEnabled:true,isActive:true,order:0,viewCount:0,createdAt:now,updatedAt:now});store.writeDb(db);}
store.close();console.log('Storybook ready: '+pages.length+' pages.');
