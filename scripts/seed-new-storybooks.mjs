import fs from 'node:fs';
import {createStore} from '../backend/store.js';
const books=[
{slug:'co-be-ban-diem-story',title:'CÔ BÉ BÁN DIÊM',author:'Han Cri-xti-an An-đéc-xen',files:['b6fmhr','danz4s','ad0x6k','iu0aie','bvk2jo','mn0k4f','b6fmhr','mn0k4f'],pages:[
['Cô bé bán diêm','Phỏng theo truyện của Andersen.\nGiữa đêm đông lạnh giá, một ánh lửa nhỏ thắp lên những ước mơ bình dị.'],
['Góc phố đêm giao thừa','Trong đêm giao thừa, cô bé đi chân trần trên phố tuyết, mong bán được diêm. Không ai mua. Em không dám về nhà vì chưa kiếm được tiền, đành ngồi nép vào góc tường, vừa đói vừa rét.'],
['Ước mong hơi ấm','Em quẹt một que diêm để sưởi tay. Trong ánh lửa, em tưởng thấy chiếc lò sưởi ấm áp. Khi que diêm tắt, lò sưởi cũng biến mất; trước mắt em lại là bức tường lạnh.'],
['Một bữa ăn trong mơ','Em quẹt que diêm tiếp theo. Bàn ăn với khăn trắng và ngỗng quay hiện lên trong tưởng tượng. Em khao khát được ăn no. Ánh diêm vụt tắt, bữa ăn tan biến.'],
['Cây thông và vì sao','Một que diêm khác đưa em đến trước cây thông Giáng sinh rực rỡ. Khi lửa tắt, những ánh nến như bay lên thành sao. Nhìn một ngôi sao đổi ngôi, em nhớ lời người bà hiền hậu đã mất.'],
['Vòng tay của bà','Trong ánh diêm, bà hiện lên dịu dàng. Sợ bà biến mất, em quẹt hết những que diêm còn lại để níu giữ bà. Em tưởng thấy bà ôm mình, đưa mình đến nơi không còn đói rét và đau buồn.'],
['Buổi sáng đầu năm','Sáng đầu năm, người qua đường thấy cô bé đã qua đời vì giá rét, bên những que diêm cháy hết. Không ai biết những điều đẹp đẽ em đã thấy trong đêm cuối cùng.\nTranh trang này gợi lại hình ảnh em khi còn sống; vòng tay bà ở trang trước là mộng tưởng, không phải một cuộc cứu sống.'],
['Một ánh lửa sẻ chia','Những mộng tưởng cho thấy em cần hơi ấm, thức ăn, niềm vui và tình yêu thương.\nĐiều gì khiến em xúc động nhất? Chúng ta có thể làm gì để quan tâm đến những người gặp khó khăn?\n\nLời kể tóm lược, không phải nguyên văn tác phẩm. Tranh Gemini do người dùng cung cấp.']
]},
{slug:'de-men',title:'BÀI HỌC ĐƯỜNG ĐỜI ĐẦU TIÊN',author:'Tô Hoài',files:['bmqrvx','o3l6gh','7pviq0','oto183','rz2k2w','zeedy4'],pages:[
['Bài học đường đời đầu tiên','Phỏng theo truyện của Tô Hoài.\nMột câu chuyện về sự kiêu căng, lòng ân hận và trách nhiệm với người khác.'],
['Dế Mèn kiêu căng','Dế Mèn có thân hình khỏe mạnh, đôi càng chắc khỏe. Tự hào về mình, Mèn trở nên kiêu căng, thích ra oai và coi thường những con vật xung quanh.'],
['Người hàng xóm nhỏ bé','Dế Choắt gầy yếu, sống trong chiếc hang nông. Choắt nhờ Mèn đào giúp một ngách thông sang hang của Mèn để phòng nguy hiểm. Mèn coi thường bạn và không giúp.'],
['Một trò nghịch dại','Thấy chị Cốc bên bờ nước, Mèn cất lời trêu chọc rồi chui tọt vào hang sâu. Mèn tưởng mình có thể tránh được mọi hậu quả.'],
['Nỗi ân hận','Chị Cốc hiểu lầm Dế Choắt và trút giận lên bạn. Khi Mèn ra khỏi hang, Choắt đã bị thương nặng. Trước khi chết, Choắt khuyên Mèn bỏ thói hung hăng và biết suy nghĩ trước khi làm.'],
['Bài học còn mãi','Mèn chôn Dế Choắt rồi đứng lặng trước mộ bạn. Lần đầu tiên, Mèn thấm thía hậu quả của sự ngông cuồng.\nEm nghĩ Mèn cần thay đổi điều gì? Khi gây lỗi với người khác, em sẽ làm gì?\n\nLời kể tóm lược từ tác phẩm; tranh Gemini do người dùng cung cấp.']
]},
{slug:'may-va-song-story',title:'MÂY VÀ SÓNG',author:'Ra-bin-đra-nát Ta-go',files:['mhnj05','ejv854','mhdxlc','1fe5ok','v7huqk','dxkcem'],pages:[
['Mây và sóng','Phỏng theo bài thơ của Ta-go.\nCó một thế giới diệu kỳ, nơi niềm vui bắt đầu từ vòng tay mẹ.'],
['Lời mời trên mây','Em bé kể với mẹ về những người trên mây. Họ vui chơi giữa bình minh vàng và vầng trăng bạc, rủ em cùng đến thế giới của họ. Lời mời khiến em thích thú.'],
['Mẹ đang đợi ở nhà','Em muốn đi chơi, nhưng nghĩ đến mẹ đang đợi ở nhà. Làm sao em có thể rời mẹ? Em chọn ở bên mẹ và nghĩ ra một trò chơi còn thú vị hơn.'],
['Con là mây, mẹ là trăng','Trong trò chơi tưởng tượng, em là mây, mẹ là trăng. Em ôm lấy mẹ; mái nhà hóa thành bầu trời xanh thẳm. Hình ảnh mẹ và vầng trăng trong tranh diễn tả trí tưởng tượng của em.'],
['Tiếng gọi từ sóng','Những người trong sóng lại cất lời mời. Họ ca hát, ngao du khắp nơi. Nhưng em biết mẹ luôn muốn em ở bên. Em nghĩ ra một trò chơi mới cùng mẹ.'],
['Mẹ là bến bờ','Em là sóng, mẹ là bến bờ kỳ lạ. Em cười vang, lăn vào lòng mẹ. Trong thế giới của hai mẹ con, tình yêu thương làm nên niềm vui vô tận.\nVì sao em bé chọn ở bên mẹ? Em muốn chơi trò gì cùng người thân?\n\nLời dẫn phỏng theo bài thơ, không phải nguyên văn; tranh Gemini do người dùng cung cấp.']
]}
];
const store=createStore(process.env.DATA_DIR||'backend/data');const db=store.readDb();
for(const b of books){const dir=`frontend/public/reference/${b.slug}`;fs.mkdirSync(dir,{recursive:true});
const pages=b.pages.map(([heading,text],i)=>{const source=fs.readdirSync('.').find(f=>f.startsWith('Gemini_Generated_Image_'+b.files[i]));if(!source)throw Error('Missing '+b.files[i]);fs.copyFileSync(source,`${dir}/${i+1}.png`);return {image:`${i+1}.png`,heading,title:heading,text};});
fs.writeFileSync(`${dir}/pages.js`,'window.READER_PAGES = '+JSON.stringify(pages,null,2)+';');
let html=fs.readFileSync('frontend/reader/index.html','utf8').replaceAll('Ba lưỡi rìu',b.title).replace('href="reader.css"','href="../reader.css"').replace('<script defer src="reader.js"></script>','<link rel="stylesheet" href="../gio-lanh-dau-mua/story.css"><script src="pages.js"></script><script defer src="../reader.js"></script>');fs.writeFileSync(`${dir}/index.html`,html);
const id='storybook-'+b.slug;if(!db.storybooks.some(s=>s._id===id)){const now=new Date().toISOString();db.storybooks.push({_id:id,title:b.title,description:'Sách tranh về '+(b.slug==='de-men'?'trách nhiệm và bài học trưởng thành.':'tình mẫu tử và trí tưởng tượng tuổi thơ.'),author:b.author+' · Bản kể tóm lược',category:'reference-literature-6',type:'heyzine',url:`/reference/${b.slug}/index.html`,thumbnail:`/reference/${b.slug}/1.png`,aiText:pages.map(p=>p.heading+': '+p.text).join('\n\n'),chatEnabled:true,isActive:true,order:1,viewCount:0,createdAt:now,updatedAt:now});}
console.log(b.title+': '+pages.length+' pages');}
store.writeDb(db);store.close();
