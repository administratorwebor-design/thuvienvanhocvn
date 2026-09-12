// Authored and checked against the supplied textbook scans. Draft AI output is not used.
import fs from 'node:fs';
const topics=JSON.parse(fs.readFileSync(new URL('./assessment-topics.json',import.meta.url),'utf8'));
export const bank=[];
function add(index, passage, mc, essays, kind='adapted') {
  const topic=topics[index-1];
  const questions=mc.map(([content,options,explanation],i)=>{
    // Input places the verified answer first; distribute it across A–D in the delivered paper.
    const correctAnswer=(i+index-1)%4;
    const shuffled=[...options.slice(1)];shuffled.splice(correctAnswer,0,options[0]);
    return {id:`kntt-${topic.id}-q${i+1}`,type:'multiple_choice',content,options:shuffled,correctAnswer,points:1,explanation};
  });
  for(const [i,[content,hint,criteria]] of essays.entries())questions.push({id:`kntt-${topic.id}-q${9+i}`,type:'essay',content,points:1,hint,explanation:`Hướng dẫn chấm (1 điểm): ${criteria} Chấp nhận cách diễn đạt và lập luận hợp lí tương đương.`});
  bank.push({...topic,number:index,passage,passageKind:kind,questions,duration:30,totalPoints:10,sourceNote:`Ngữ văn 6, tập một – Kết nối tri thức với cuộc sống, trang ${topic.pages.join(', ')}.`});
}

add(1,`Ngữ liệu tóm tắt, biên soạn theo “Bài học đường đời đầu tiên” của Tô Hoài:
Dế Mèn là một chàng dế khỏe mạnh nhưng kiêu căng. Mèn coi thường Dế Choắt, người hàng xóm gầy yếu, có cái hang nông. Choắt đề nghị đào một ngách thông sang hang Mèn để có đường chạy khi gặp nguy hiểm. Mèn từ chối và tỏ thái độ khinh khỉnh.
Một buổi chiều, thấy chị Cốc ở gần, Mèn cất tiếng trêu chọc rồi chui vào hang của mình. Chị Cốc không thấy Mèn, tưởng Choắt trêu mình nên mổ Choắt trọng thương. Mèn nằm im trong hang, chờ chị Cốc đi mới ra. Lúc ấy, Choắt đã không thể sống được nữa.
Trước khi chết, Choắt khuyên Mèn không nên hung hăng bậy bạ, làm việc phải suy nghĩ. Mèn chôn Choắt, đứng trước mộ bạn và ân hận. Sự việc trở thành bài học đường đời đầu tiên của Mèn. Trong tác phẩm gốc, Dế Mèn xưng “tôi” để kể lại trải nghiệm ấy.`,[
['Ai kể câu chuyện trong tác phẩm gốc?',['Dế Mèn','Dế Choắt','Chị Cốc','Một người đi đường'],'Dế Mèn xưng “tôi”, kể lại trải nghiệm của chính mình ở ngôi thứ nhất.'],
['Choắt muốn đào ngách thông hang để làm gì?',['Có lối thoát khi nguy hiểm','Lấy thức ăn của Mèn','Nuôi thêm côn trùng','Đón chị Cốc vào chơi'],'Hang Choắt nông, vì vậy bạn đề nghị có đường chạy sang hang Mèn khi gặp nguy hiểm.'],
['Sau khi trêu chị Cốc, Mèn trốn ở đâu?',['Trong hang của mình','Trong hang Dế Choắt','Trên một cành cây','Dưới cánh chị Cốc'],'Mèn chui vào hang của mình; Mèn không đào ngách và không trốn trong hang Choắt.'],
['Vì sao chị Cốc tấn công Dế Choắt?',['Hiểu lầm Choắt là người trêu mình','Choắt lấy trộm thức ăn','Choắt chủ động đánh chị','Mèn nhờ chị bảo vệ Choắt'],'Chị Cốc không nhìn thấy Mèn và nhầm Choắt là kẻ trêu chọc.'],
['Thái độ từ chối giúp Choắt cho thấy điều gì ở Mèn?',['Kiêu căng và thiếu cảm thông','Thận trọng và chu đáo','Nhút nhát nhưng khiêm tốn','Chân thành và vị tha'],'Mèn coi thường bạn yếu hơn và không quan tâm đến nỗi lo của bạn.'],
['Sự thay đổi nào nổi bật ở Mèn cuối truyện?',['Từ tự phụ đến ân hận','Từ sợ hãi đến khoe khoang','Từ buồn bã đến thờ ơ','Từ khiêm tốn đến kiêu căng'],'Cái chết của Choắt khiến Mèn nhận ra hậu quả và ân hận về hành động của mình.'],
['Cho loài vật biết nói, khuyên nhủ và ân hận là cách sử dụng biện pháp nào?',['Nhân hóa','So sánh','Điệp vần','Liệt kê số liệu'],'Những hành động, tâm trạng của con người được gán cho Dế Mèn và Dế Choắt.'],
['Cách ứng xử nào phù hợp với bài học của Mèn?',['Cân nhắc hậu quả trước khi đùa','Đổ lỗi khi làm bạn buồn','Chỉ chơi với bạn mạnh hơn','Trêu người khác rồi bỏ đi'],'Suy nghĩ trước khi hành động giúp tránh làm tổn thương người khác và thể hiện trách nhiệm.']
],[['Vì sao lời khuyên cuối cùng của Choắt khiến Mèn phải suy nghĩ?','Liên hệ lời khuyên với hậu quả của trò trêu chọc.','Nêu hậu quả nghiêm trọng do hành động thiếu suy nghĩ (0,5 điểm); giải thích lời khuyên giúp Mèn nhận lỗi và thay đổi (0,5 điểm).'],['Viết 4–6 câu nêu cách em sẽ làm khi một trò đùa của mình khiến bạn buồn.','Nêu hành động cụ thể và lí do, không chỉ nói “em sẽ sửa sai”.','Có cách nhận lỗi, xin lỗi hoặc khắc phục cụ thể (0,5 điểm); diễn đạt thành đoạn mạch lạc và thể hiện sự tôn trọng bạn (0,5 điểm).']]);

add(2,`Ngữ liệu biên soạn theo “Nếu cậu muốn có một người bạn” (trích “Hoàng tử bé”) của Ăng-toan đơ Xanh-tơ Ê-xu-pe-ri:
Khi gặp cáo, hoàng tử bé muốn chơi cùng nó. Cáo nói mình chưa được “cảm hóa”. Nó giải thích rằng “cảm hóa” là tạo nên những mối ràng buộc. Khi chưa gắn bó, cậu bé và cáo chưa khác biệt với vô số cậu bé và con cáo khác. Nếu trở thành bạn, họ sẽ trở nên duy nhất đối với nhau.
Cáo mong hoàng tử bé kiên nhẫn: lúc đầu ngồi cách xa một chút, mỗi ngày có thể ngồi gần hơn. Khi đã gắn bó, tiếng bước chân của cậu sẽ khác mọi tiếng chân khác. Màu vàng của lúa mì sẽ nhắc cáo nhớ mái tóc vàng của người bạn, dù lúa mì vốn không phải thức ăn của cáo.
Đến lúc chia tay, cáo buồn nhưng vẫn nhận được ý nghĩa từ màu lúa mì. Hoàng tử bé hiểu rằng thời gian mình dành cho bông hồng làm bông hồng ấy trở nên quan trọng. Tình bạn cần sự kiên nhẫn, quan tâm và trách nhiệm.`,[
['“Cảm hóa” trong ngữ liệu được hiểu là gì?',['Tạo nên mối gắn bó','Buộc người khác phục tùng','Huấn luyện để biểu diễn','Làm người khác sợ mình'],'Cáo dùng từ này để nói về những mối ràng buộc khiến hai người trở nên đặc biệt với nhau.'],
['Cáo đề nghị hoàng tử bé ngồi như thế nào?',['Ban đầu xa, dần dần gần hơn','Ban đầu gần, sau đó xa dần','Lúc nào cũng sát bên cáo','Không bao giờ ngồi gần cáo'],'Sự gần gũi được xây dựng từng chút, qua thời gian và sự kiên nhẫn.'],
['Màu lúa mì sẽ gợi cho cáo nhớ điều gì?',['Mái tóc vàng của hoàng tử bé','Bộ lông của một con sói','Màu cánh cửa ngôi nhà','Món ăn thường ngày của cáo'],'Màu vàng của lúa mì gắn với mái tóc vàng của người bạn.'],
['Vì sao tiếng chân của cậu trở nên đặc biệt?',['Vì gắn với người bạn thân thiết','Vì cậu đi đôi giày mới','Vì cậu luôn chạy rất nhanh','Vì mọi người khác đều im lặng'],'Giá trị của tiếng chân đến từ tình cảm, không phải độ lớn hay tốc độ của âm thanh.'],
['Điều gì làm bông hồng của hoàng tử bé trở nên quan trọng?',['Thời gian cậu chăm sóc nó','Giá tiền mua bông hồng','Kích thước lớn nhất của hoa','Số người muốn sở hữu hoa'],'Cậu nhận ra sự chăm sóc và thời gian dành cho hoa tạo nên mối gắn bó riêng.'],
['Nỗi buồn khi chia tay có phủ nhận giá trị tình bạn không?',['Không, kỉ niệm vẫn làm cuộc sống có ý nghĩa','Có, tình bạn chỉ có ích khi luôn vui','Có, xa nhau là mất hết kỉ niệm','Không, vì cáo chưa từng quý cậu'],'Dù buồn, cáo vẫn có màu lúa mì để nhớ bạn; gắn bó đem lại giá trị bền lâu.'],
['Một bạn mới còn rụt rè, em nên làm gì?',['Kiên nhẫn trò chuyện, tôn trọng khoảng cách','Ép bạn kể mọi bí mật ngay','Giận vì bạn chưa thân với mình','Chỉ quan tâm khi bạn có quà'],'Lời cáo gợi cách xây dựng tin cậy từ từ, không ép buộc sự thân thiết.'],
['Nhan đề nhấn mạnh mong muốn nào của con người?',['Có sự gắn bó và tình bạn','Sở hữu nhiều món đồ quý','Chiến thắng mọi cuộc tranh luận','Đi đến mọi nơi trong ngày'],'Toàn bộ cuộc đối thoại xoay quanh việc tạo lập và gìn giữ tình bạn.']
],[['Giải thích vì sao lúa mì từ chỗ không có ích lại có ý nghĩa với cáo.','So sánh giá trị vật chất với giá trị kỉ niệm.','Nêu lúa mì không phải thức ăn của cáo (0,5 điểm); giải thích màu lúa gợi nhớ người bạn, tạo giá trị tinh thần (0,5 điểm).'],['Viết 4–6 câu kể một việc em có thể làm để duy trì tình bạn.','Chọn một hành động, nêu cách thực hiện và ý nghĩa.','Hành động cụ thể thể hiện quan tâm, tôn trọng hoặc trách nhiệm (0,5 điểm); đoạn văn có lí giải hợp lí, rõ ý (0,5 điểm).']]);

add(3,`Đọc đoạn thơ “Bắt nạt” của Nguyễn Thế Hoàng Linh:

Bắt nạt là xấu lắm
Đừng bắt nạt, bạn ơi
Bất cứ ai trên đời
Đều không cần bắt nạt

Tại sao không học hát
Nhảy hip-hop cho hay?
Thời gian trong một ngày
Đâu để dành bắt nạt

(SGK trang 27; lược bỏ kí hiệu chú thích sau từ hip-hop.)`,[
['Mỗi dòng trong đoạn thơ có bao nhiêu tiếng?',['Năm tiếng','Bốn tiếng','Sáu tiếng','Bảy tiếng'],'Ví dụ “Bắt / nạt / là / xấu / lắm” gồm năm tiếng; các dòng còn lại cũng như vậy.'],
['Cụm “xấu lắm” thể hiện thái độ nào?',['Không đồng tình với bắt nạt','Ngưỡng mộ người bắt nạt','Không quan tâm hành vi ấy','Coi bắt nạt là trò vui'],'Tính từ “xấu” được nhấn mạnh bởi “lắm”, bộc lộ sự phê phán.'],
['Hoạt động nào được nhắc đến như một lựa chọn tích cực?',['Học hát, nhảy hip-hop','Trêu chọc bạn mới','Thi xem ai lớn tiếng hơn','Tách một bạn khỏi nhóm'],'Khổ hai gợi việc học hát, nhảy thay cho việc dùng thời gian để bắt nạt.'],
['Cách gọi “bạn ơi” tạo sắc thái nào?',['Gần gũi, như lời nhắc giữa bạn bè','Lạnh lùng, như bản báo cáo','Xa cách, như lời kết tội','Khoe khoang về sức mạnh'],'Lời gọi thân mật làm thông điệp dễ tiếp nhận, không biến thành lời đe dọa.'],
['“Đâu để dành bắt nạt” có thể hiểu thế nào?',['Không nên dùng thời gian để bắt nạt','Hỏi địa điểm dành riêng để bắt nạt','Khuyên chọn giờ bắt nạt thích hợp','Chỉ cho phép bắt nạt buổi sáng'],'“Đâu” mang sắc thái phủ định trong câu hỏi, nhấn mạnh không nên dành thời gian cho hành vi xấu.'],
['Phạm vi của lời nhắc “Bất cứ ai trên đời” là gì?',['Mọi người, không giới hạn một nhóm','Chỉ những bạn cùng lớp','Chỉ những người nhỏ tuổi','Chỉ người có thành tích tốt'],'“Bất cứ ai” mở rộng thông điệp tới tất cả, không phân biệt một đối tượng riêng.'],
['Khi thấy bạn bị cô lập, lựa chọn nào phù hợp với đoạn thơ?',['Hỗ trợ bạn và báo người lớn khi cần','Cùng nhóm chế giễu bạn','Quay clip để gây chú ý','Bỏ mặc vì không liên quan'],'Hỗ trợ người bị bắt nạt và tìm sự giúp đỡ an toàn thể hiện tinh thần chống bắt nạt.'],
['Vì sao tác giả gợi hoạt động vui thay vì chỉ phê phán?',['Đưa ra cách sử dụng thời gian tích cực','Chứng minh ai cũng phải giỏi múa','Chuyển hẳn sang hướng dẫn biểu diễn','Cho rằng chỉ ca sĩ mới không bắt nạt'],'Lời gợi ý giúp người đọc có lựa chọn thay thế lành mạnh, làm thông điệp thiết thực hơn.']
],[['Nêu tác dụng của cách gọi “bạn ơi” trong lời nhắc về bắt nạt.','Chú ý sắc thái lời nói và người tiếp nhận.','Nhận ra giọng thân mật, gần gũi (0,5 điểm); giải thích giúp lời khuyên dễ được lắng nghe hơn (0,5 điểm).'],['Viết 4–6 câu đề xuất một việc lớp em có thể làm để hạn chế bắt nạt.','Nêu việc làm có thể thực hiện, người tham gia và lợi ích.','Đề xuất cụ thể, phù hợp và an toàn (0,5 điểm); giải thích được tác dụng với môi trường lớp học (0,5 điểm).']], 'quotation');

add(4,`Ngữ liệu và ví dụ biên soạn để luyện kiến thức từ đơn, từ phức trong SGK:
Buổi sáng, Lan cùng bạn bè đến trường. Trên lối đi, lá cây rung rinh trong gió. Lan nhặt một chiếc bút, mang đến bàn giáo viên để tìm người đánh rơi. Cô giáo mỉm cười, khen việc làm của em.

Các từ được xét trong đề: “bút”, “gió”, “bạn bè”, “lá cây”, “rung rinh”, “học sinh”, “xanh xanh”, “quần áo”. Hãy xét cấu tạo từ theo nghĩa và quan hệ âm giữa các tiếng; không đồng nhất số tiếng với số chữ cái.`,[
['Từ nào dưới đây là từ đơn?',['bút','học sinh','quần áo','rung rinh'],'“Bút” có một tiếng, trong khi ba từ còn lại có hai tiếng.'],
['Từ nào là từ láy?',['rung rinh','lá cây','học sinh','quần áo'],'“Rung rinh” có quan hệ láy âm đầu r; các từ còn lại kết hợp các tiếng có quan hệ về nghĩa.'],
['“Học sinh” được xếp vào loại nào?',['Từ ghép','Từ đơn','Từ láy toàn bộ','Từ láy vần'],'Hai tiếng “học” và “sinh” kết hợp trên cơ sở nghĩa để gọi người học.'],
['Vì sao “quần áo” là từ ghép?',['Các tiếng có nghĩa, cùng chỉ đồ mặc','Hai tiếng giống hệt nhau về âm','Từ chỉ có một tiếng duy nhất','Hai tiếng chỉ ngẫu nhiên đứng cạnh'],'“Quần” và “áo” đều có nghĩa; chúng kết hợp thành từ gọi chung đồ mặc.'],
['Trong “xanh xanh”, kiểu lặp âm nào nổi bật?',['Lặp lại toàn bộ tiếng','Chỉ lặp phụ âm đầu','Chỉ lặp phần vần','Không có tiếng nào lặp'],'Hai tiếng “xanh” giống nhau hoàn toàn, tạo từ láy toàn bộ.'],
['Phát biểu nào đúng về từ phức?',['Gồm hai tiếng trở lên','Luôn gồm đúng hai chữ cái','Chỉ dùng để gọi đồ vật','Không thể có quan hệ láy âm'],'Từ phức gồm từ hai tiếng trở lên; từ ghép và từ láy là hai kiểu từ phức được học.'],
['Điền từ nào để tả rõ lá chuyển động nhẹ liên tiếp: “Lá ... trong gió”?',['rung rinh','quần áo','học sinh','bạn bè'],'“Rung rinh” gợi chuyển động nhẹ, liên tiếp, phù hợp đối tượng lá và ngữ cảnh gió.'],
['Bạn nói “Hễ hai tiếng cùng âm đầu đều là từ láy”. Em phản hồi thế nào?',['Cần xét cả quan hệ nghĩa giữa các tiếng','Chỉ cần đếm số chữ cái','Mọi từ hai tiếng đều là từ láy','Không cần xem từ trong ngữ cảnh'],'Không thể chỉ dựa vào trùng âm đầu: cần phân biệt kết hợp về nghĩa với quan hệ láy âm.']
],[['Phân biệt “lá cây” và “rung rinh” theo cấu tạo từ.','Nêu loại từ và căn cứ cho từng trường hợp.','Xác định “lá cây” là từ ghép dựa vào quan hệ nghĩa (0,5 điểm); “rung rinh” là từ láy âm đầu dựa vào quan hệ âm (0,5 điểm).'],['Viết 3–4 câu tả sân trường, sử dụng một từ đơn và một từ láy rồi chỉ rõ hai từ đó.','Chọn từ phù hợp cảnh vật, không chỉ liệt kê từ.','Sử dụng và chỉ đúng từ đơn, từ láy (0,5 điểm); các câu có liên kết, tả cảnh hợp lí (0,5 điểm).']], 'original-example');

add(5,`Đọc đoạn thơ “Chuyện cổ tích về loài người” của Xuân Quỳnh:

Trời sinh ra trước nhất
Chỉ toàn là trẻ con
Trên trái đất trụi trần
Không dáng cây ngọn cỏ
Mặt trời cũng chưa có
Chỉ toàn là bóng đêm
Không khí chỉ màu đen
Chưa có màu sắc khác

Mắt trẻ con sáng lắm
Nhưng chưa thấy gì đâu!
Mặt trời mới nhô cao
Cho trẻ con nhìn rõ
Màu xanh bắt đầu cỏ
Màu xanh bắt đầu cây
Cây cao bằng gang tay
Lá cỏ bằng sợi tóc

(SGK trang 40; trích hai phần đầu, lược kí hiệu phân cách khổ.)`,[
['Theo tưởng tượng trong đoạn thơ, ai có trước nhất?',['Trẻ con','Người thầy','Người bà','Người bố'],'Hai dòng đầu khẳng định thế giới ban đầu “chỉ toàn là trẻ con”.'],
['Mỗi dòng thơ trong đoạn có bao nhiêu tiếng?',['Năm tiếng','Sáu tiếng','Bảy tiếng','Tám tiếng'],'“Trời / sinh / ra / trước / nhất” gồm năm tiếng; đó là cấu trúc các dòng trong đoạn.'],
['Trái đất ban đầu được hình dung ra sao?',['Tối tăm, chưa có cây cỏ','Tràn ngập tiếng chim','Đã có thành phố đông đúc','Rực rỡ muôn màu hoa'],'Khổ đầu nói chưa có cây cỏ, mặt trời, màu sắc, chỉ có bóng đêm.'],
['Mặt trời nhô cao nhằm đáp ứng nhu cầu nào?',['Giúp trẻ con nhìn rõ','Giúp tàu chạy nhanh hơn','Giúp người lớn đếm tuổi','Giúp cây biến thành nhà'],'Hai dòng “Mặt trời mới nhô cao / Cho trẻ con nhìn rõ” nêu trực tiếp mối liên hệ ấy.'],
['“Cây cao bằng gang tay” sử dụng biện pháp nào?',['So sánh','Nhân hóa','Nói trực tiếp lời nhân vật','Liệt kê số liệu'],'Từ “bằng” nối cây với gang tay để gợi hình dung kích thước.'],
['Việc đặt trẻ con ở trung tâm gợi điều gì?',['Sự yêu thương, trân trọng trẻ thơ','Thái độ xem nhẹ tuổi thơ','Mong muốn trẻ luôn cô độc','Khẳng định trẻ không cần chăm sóc'],'Thế giới trong tưởng tượng được hình thành để đáp ứng nhu cầu của trẻ, thể hiện tình yêu trẻ.'],
['Nên đọc cách giải thích nguồn gốc thế giới này theo hướng nào?',['Một tưởng tượng nghệ thuật giàu tình cảm','Một kết luận khoa học cần học thuộc','Một bảng thống kê lịch sử','Một hướng dẫn thí nghiệm'],'Bài thơ sáng tạo một thế giới vì trẻ em, không trình bày kiến thức khoa học về nguồn gốc loài người.'],
['Cách chăm sóc nào gần với tinh thần đoạn thơ?',['Tạo môi trường an toàn để trẻ khám phá','Để trẻ tự xoay xở mọi việc','Cấm trẻ đặt câu hỏi','Chỉ quan tâm thành tích thi đua'],'Đáp ứng nhu cầu phát triển và khám phá thể hiện tình yêu thương, lấy trẻ làm trung tâm.']
],[['Giải thích tác dụng của hình ảnh “Cây cao bằng gang tay / Lá cỏ bằng sợi tóc”.','Chú ý những vật dùng để so sánh và cách trẻ em hình dung thế giới.','Chỉ ra hình ảnh so sánh cụ thể, gần gũi (0,5 điểm); nêu tác dụng làm thế giới nhỏ xinh, dễ hình dung theo góc nhìn trẻ thơ (0,5 điểm).'],['Viết 4–6 câu về một việc người lớn đã làm giúp em học tập hoặc khám phá thế giới.','Kể việc làm và nêu cảm xúc, tránh chỉ nói lời cảm ơn chung.','Có việc làm cụ thể gắn với sự chăm sóc, hỗ trợ (0,5 điểm); diễn đạt mạch lạc, thể hiện tình cảm chân thành (0,5 điểm).']], 'quotation');

import { part2 } from "./assessment-part2.mjs";
import { part3 } from "./assessment-part3.mjs";
import { part4 } from "./assessment-part4.mjs";
part2(add); part3(add); part4(add);
