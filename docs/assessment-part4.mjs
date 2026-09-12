export function part4(add) {
add(16,`Bài thơ ngắn tự biên soạn để luyện vần, nhịp lục bát:

Chiều về gió nhẹ qua sân
Tiếng chim gọi nắng bước chân mẹ về
Con đường ôm lấy triền đê
Hương đồng theo gió tràn về ngõ quen

Khi trả lời, hãy đếm tiếng từng dòng và xác định vị trí gieo vần; không đếm số chữ cái. Đề xét cấu trúc lục bát thông thường, không xét các biến thể.`,[
['Dòng “Chiều về gió nhẹ qua sân” có mấy tiếng?',['Sáu tiếng','Năm tiếng','Bảy tiếng','Tám tiếng'],'Đếm: Chiều / về / gió / nhẹ / qua / sân, được sáu tiếng.'],
['Dòng “Tiếng chim gọi nắng bước chân mẹ về” có mấy tiếng?',['Tám tiếng','Sáu tiếng','Bảy tiếng','Chín tiếng'],'Đếm từng tiếng được tám, tạo dòng bát sau dòng lục.'],
['Tiếng “sân” gieo vần với tiếng nào ở dòng thứ hai?',['chân','chim','nắng','mẹ'],'Tiếng cuối dòng lục vần với tiếng thứ sáu dòng bát: sân – chân.'],
['Tiếng cuối dòng hai gieo vần với tiếng nào cuối dòng ba?',['đê','đường','lấy','triền'],'“Về” và “đê” cùng vần ê, nối dòng bát với dòng lục tiếp theo.'],
['Cách ngắt nào chia dòng đầu theo nhịp 2/2/2?',['Chiều về / gió nhẹ / qua sân','Chiều / về gió nhẹ / qua sân','Chiều về gió / nhẹ qua sân','Chiều về gió nhẹ / qua sân'],'Mỗi nhóm trong phương án đúng có hai tiếng, tổng ba nhịp đều nhau.'],
['“Con đường ôm lấy triền đê” có biện pháp nào nổi bật?',['Nhân hóa','Nêu số liệu','Dẫn lời trực tiếp','So sánh bằng từ như'],'Hành động “ôm lấy” của người được gán cho con đường, gợi dáng đường gần gũi.'],
['Muốn kiểm tra một cặp lục bát cơ bản, cần chú ý điều gì?',['Số tiếng, vần, thanh và nhịp','Chỉ số chữ cái của nhan đề','Chỉ độ dài của mỗi từ','Chỉ tên tác giả'],'Thể lục bát có quy tắc về số tiếng, vị trí vần, thanh điệu và nhịp; không chỉ nhìn hình thức dòng dài ngắn.'],
['Nếu thay tiếng “chân” bằng “bước”, điều gì bị ảnh hưởng rõ nhất?',['Vần nối với tiếng sân','Số dòng của bài thơ','Số tiếng của dòng đầu','Nhan đề bài thơ'],'Sân – chân cùng vần ân; “bước” không hiệp vần với “sân” và mang thanh trắc ở vị trí cần thanh bằng.']
],[['Chỉ ra hai cặp tiếng hiệp vần trong bài và nêu vị trí của một cặp.','Có thể xét vần giữa dòng sáu với dòng tám hoặc dòng tám với dòng sáu tiếp.','Chỉ đúng hai cặp như sân–chân, về–đê, đê–về (0,5 điểm); xác định đúng vị trí của một cặp (0,5 điểm).'],['Tự viết một cặp lục bát về gia đình hoặc quê hương.','Kiểm tra dòng sáu, dòng tám và vần giữa hai dòng.','Đúng sáu/tám tiếng và gieo vần cơ bản phù hợp (0,5 điểm); hình ảnh, ý thơ có nghĩa, gắn đề tài (0,5 điểm).']], 'original-example');

add(17,`Ngữ liệu biên soạn theo đoạn trích “Cô Tô” của Nguyễn Tuân:
Sau những ngày bão, đảo Cô Tô hiện lên trong trẻo, sáng sủa. Cây trên núi thêm xanh mượt, nước biển lại lam biếc đậm đà, cát giòn vàng. Tác giả ngắm cảnh đảo và cảm thấy yêu mến mảnh đất ấy.
Để đón mặt trời, tác giả dậy từ canh tư, ra tận đầu mũi đảo, ngồi trên đá. Sau bão, chân trời và ngấn bể sạch như tấm kính được lau hết mây bụi. Mặt trời tròn trĩnh, phúc hậu như lòng đỏ một quả trứng thiên nhiên đầy đặn. Cảnh bình minh đem lại cảm giác tươi mới, giàu sức sống.
Khi mặt trời lên, người dân quanh giếng nước ngọt chuẩn bị cho chuyến ra khơi. Họ gánh nước, lấy nước cho thuyền. Hình ảnh chị Châu Hòa Mãn địu con gợi một cuộc sống yên bình. Vẻ đẹp của Cô Tô được cảm nhận cả trong thiên nhiên lẫn sinh hoạt con người.`,[
['Cảnh trong đoạn đầu được quan sát vào lúc nào?',['Sau bão','Giữa đêm không trăng','Khi bão vừa bắt đầu','Trong ngày tuyết rơi'],'Ngữ liệu mở bằng cảnh đảo trong sáng trở lại sau bão.'],
['Tác giả đi đâu để đón bình minh?',['Ra đầu mũi đảo, ngồi trên đá','Vào chợ mua thức ăn','Lên xe rời khỏi đảo','Đứng trong căn phòng kín'],'Vị trí đầu mũi đảo giúp người viết quan sát trực tiếp mặt trời mọc trên biển.'],
['Mặt trời được so sánh với hình ảnh nào?',['Lòng đỏ một quả trứng thiên nhiên','Một chiếc lá xanh','Một giọt mực đen','Một cành cây khô'],'So sánh làm nổi bật dáng tròn, màu sắc và sức sống của mặt trời lúc mọc.'],
['Các màu xanh mượt, lam biếc, vàng gợi vẻ đẹp nào?',['Tươi sáng, trong trẻo','U tối, cằn cỗi','Lạnh lẽo, hoang tàn','Nhạt nhòa, thiếu sức sống'],'Bảng màu của cây, biển và cát cho thấy sự tươi mới của đảo sau bão.'],
['Tại sao giếng nước ngọt là hình ảnh quan trọng?',['Gắn với sinh hoạt và việc chuẩn bị ra khơi','Là nơi mọi người tổ chức thi hát','Chỉ để trang trí cho phong cảnh','Là nơi giấu đồ sau trận bão'],'Nước ngọt đáp ứng nhu cầu hằng ngày và các chuyến đi biển, gắn thiên nhiên với đời sống.'],
['Hình ảnh người mẹ địu con gợi cảm giác gì?',['Yên bình, gần gũi','Đe dọa, bất an','Xa hoa, phô trương','Vội vã trong một cuộc chạy trốn'],'Người mẹ và em bé khép lại cảnh sinh hoạt bằng cảm giác ấm áp, bình yên.'],
['Cách viết nào thể hiện quan sát trực tiếp và cảm xúc của tác giả?',['Nêu màu sắc, vị trí ngắm và lòng yêu mến đảo','Chỉ ghi một danh sách giá vé','Chỉ nêu những con số không có cảnh','Kể một cuộc phiêu lưu không có địa điểm'],'Chi tiết quan sát cụ thể kết hợp cảm xúc tạo nên sức hấp dẫn của trang kí.'],
['Để viết về một cảnh đẹp đã đến, em nên làm gì?',['Quan sát cụ thể rồi chọn chi tiết và cảm xúc thật','Chép hoàn toàn cảm xúc của người khác','Bịa thêm cảnh để nơi đó nổi tiếng','Chỉ ghi tên địa danh là đủ'],'Cách viết của tác giả gợi việc chú ý trải nghiệm thực và những nét riêng của cảnh vật.']
],[['Nêu tác dụng của phép so sánh mặt trời với lòng đỏ trứng.','Chú ý hình dáng, màu sắc và cảm giác cảnh vật đem lại.','Chỉ ra nét tương đồng về hình dáng hoặc màu sắc (0,5 điểm); nêu hiệu quả gợi bình minh đầy đặn, tươi mới, giàu sức sống (0,5 điểm).'],['Viết 4–6 câu tả một cảnh đẹp em đã thấy, dùng ít nhất một so sánh hợp lí.','Chọn một thời điểm hoặc góc nhìn cụ thể.','Có chi tiết cảnh vật và phép so sánh phù hợp (0,5 điểm); đoạn mạch lạc, thể hiện cảm nhận của người viết (0,5 điểm).']]);

add(18,`Ngữ liệu biên soạn theo “Hang Én” của Hà My:
Đường tới hang Én đi qua rừng nguyên sinh, những dốc cao ngoằn ngoèo và nhiều quãng suối, sông. Người tham quan phải đi bộ, vừa vượt địa hình vừa quan sát cây cổ thụ, dây leo, hoa, bướm và dòng nước trong. Hành trình vất vả cũng là cơ hội đến gần vẻ đẹp hoang sơ.
Trong hang có những đàn én sống tự nhiên. Én không sợ con người nhưng người viết không muốn làm xáo trộn cuộc sống của chúng. Các khối đá, nhũ đá và sự bồi đắp lâu dài cho thấy thiên nhiên được hình thành qua thời gian rất lớn. Con người chỉ là vị khách trong không gian ấy.
Ở lại trong hang, du khách nghe tiếng chim, tiếng nước. Buổi sáng, ánh nắng qua cửa hang soi xuống, hơi nước tạo vẻ mờ ảo. Bước chân trần xuống dòng nước mát làm người viết thấy khoan khoái. Cuộc khám phá gợi sự trân trọng, biết ơn và ý thức giữ gìn thiên nhiên.`,[
['Cách di chuyển chính để tới hang Én trong ngữ liệu là gì?',['Đi bộ','Đi tàu điện ngầm','Bay bằng trực thăng','Đi trên băng trượt'],'Địa hình rừng, dốc và suối khiến hành trình được thực hiện bằng đi bộ.'],
['Đặc điểm nào làm đường tới hang vừa khó vừa hấp dẫn?',['Dốc, suối cùng cảnh rừng nguyên sinh','Đường nhựa thẳng có mái che','Các cửa hàng nối tiếp nhau','Toàn bộ đường nằm trong tòa nhà'],'Địa hình tạo thử thách, còn hệ sinh thái hoang sơ đem đến trải nghiệm phong phú.'],
['Loài chim nào nổi bật trong hang?',['Én','Chào mào','Gà','Đà điểu'],'Tên hang và ngữ liệu đều nhấn mạnh đàn én sống tự nhiên tại đây.'],
['Chi tiết nào gợi lịch sử lâu dài của thiên nhiên?',['Nhũ đá được bồi đắp qua thời gian rất lớn','Đèn điện vừa được bật','Một tấm vé mới in','Một bữa ăn vừa chuẩn bị'],'Sự hình thành nhũ đá qua thời gian giúp người đọc thấy thiên nhiên không thể tạo lại trong chốc lát.'],
['Cách gọi con người là “vị khách” hàm ý gì?',['Cần tôn trọng nơi sống của tự nhiên','Có quyền lấy mọi thứ trong hang','Phải xây nhà ở lại vĩnh viễn','Chỉ được nhìn qua màn hình'],'Vị khách nên ứng xử khiêm nhường, không làm xáo trộn môi trường mình tới thăm.'],
['Người viết cảm nhận hang qua những giác quan nào được nêu rõ?',['Thị giác, thính giác và xúc giác','Chỉ vị giác','Chỉ khứu giác','Không dùng giác quan nào'],'Ngắm ánh sáng, nghe tiếng chim nước và cảm nhận nước mát bằng chân là ba cách cảm nhận cụ thể.'],
['Trình tự kể khái quát của ngữ liệu là gì?',['Đường đến hang, trong hang, trải nghiệm ở lại','Trở về nhà, mua vé, đi chợ','Trong lớp học, trên sân, ở nhà','Từ kết quả thi đến bài học đầu tiên'],'Ngữ liệu đi theo các chặng của cuộc khám phá, giúp người đọc theo dõi hành trình.'],
['Hành động nào phù hợp khi tham quan hang?',['Không phá nhũ đá, không quấy rầy chim','Bẻ một mảnh đá làm kỉ niệm','Gõ mạnh để tạo tiếng vang','Mang chim về nuôi thử'],'Giữ gìn nhũ đá và sinh vật thể hiện sự tôn trọng đối với cảnh quan hình thành lâu dài.']
],[['Vì sao không nên mang nhũ đá hoặc chim trong hang về làm kỉ niệm?','Liên hệ thời gian hình thành cảnh quan và môi trường sống của sinh vật.','Nêu nguy cơ làm hỏng cảnh quan hoặc ảnh hưởng sinh vật (0,5 điểm); giải thích trách nhiệm gìn giữ thiên nhiên chung (0,5 điểm).'],['Viết 4–6 câu hướng dẫn một nhóm bạn ứng xử khi tham quan khu thiên nhiên.','Nêu ít nhất hai hành động cụ thể cùng lí do.','Có hai hành động phù hợp, khả thi (0,5 điểm); lí do hợp lí và diễn đạt rõ như lời hướng dẫn (0,5 điểm).']]);

add(19,`Đọc đoạn thơ “Cửu Long Giang ta ơi” của Nguyên Hồng:

Ngày xưa ta đi học
Mười tuổi thơ nghe gió thổi mùa thu
Mắt ngẩng lên trông bản đồ rực rỡ
Như đồng hoa bỗng gặp một đêm mơ.

Bản đồ mới tường vôi cũng mới
Thầy giáo lớn sao, thước bảng cũng lớn sao
Gậy thần tiên và cánh tay đạo sĩ
Đưa ta đi sông núi tuyệt vời.

Tim đập mạnh hồn ngây không sao hiểu
Mê Kông sông dài hơn hai ngàn cây số mông mênh

(Trích phần đầu trong SGK trang 119. “Gậy thần tiên”, “cánh tay đạo sĩ” là hình ảnh liên tưởng của cậu học trò về thước chỉ bản đồ và cánh tay thầy. Đề đọc hiểu theo lời thơ, không dùng số liệu trong thơ để thay số liệu địa lí hiện hành.)`,[
['Kí ức ở đầu đoạn gắn với thời điểm nào?',['Khi nhân vật trữ tình còn đi học, khoảng mười tuổi','Khi nhân vật đã nghỉ hưu','Khi nhân vật làm nghề đánh cá','Khi nhân vật lần đầu lái tàu'],'Hai dòng đầu xác định kí ức thời đi học và tuổi thơ mười tuổi.'],
['Vật nào mở ra thế giới sông núi trước mắt học trò?',['Tấm bản đồ','Chiếc gương','Quả bóng','Chiếc lồng chim'],'Nhân vật ngẩng nhìn bản đồ và hình dung vẻ đẹp đất nước qua lời thầy.'],
['“Gậy thần tiên” trong liên tưởng của học trò gắn với vật gì?',['Thước chỉ bản đồ','Cành cây trong rừng','Mái chèo trên sông','Chiếc bút của nhà thơ'],'Chú thích giải thích đây là hình ảnh về thước chỉ bản đồ của thầy trong trí tưởng tượng trẻ thơ.'],
['Tấm bản đồ được so sánh với hình ảnh nào?',['Đồng hoa trong một đêm mơ','Một con đường đầy bụi','Một căn phòng tối','Một đám mây xám'],'Hai dòng thơ nối bản đồ rực rỡ với đồng hoa, gợi thế giới hấp dẫn, đầy màu sắc.'],
['“Tim đập mạnh” gợi tâm trạng nào trong ngữ cảnh?',['Xúc động, háo hức trước thế giới rộng lớn','Chán nản vì bài học','Tức giận với người thầy','Bình thản không quan tâm'],'Các hình ảnh rực rỡ, thần tiên cùng nhịp tim cho thấy sự say mê và xúc động.'],
['Nhận xét nào đúng về số tiếng các dòng trong đoạn?',['Không đều nhau, phù hợp thơ tự do','Mọi dòng đều đúng năm tiếng','Luôn luân phiên sáu và tám tiếng','Mọi dòng đều đúng bảy tiếng'],'Đếm các dòng thấy độ dài khác nhau rõ rệt, không theo chuỗi lục bát hay thể cố định số tiếng.'],
['Người thầy có vai trò nào qua cách hình dung của học trò?',['Mở mang hiểu biết, khơi tình yêu sông núi','Chỉ yêu cầu học trò nhớ điểm số','Ngăn học trò tìm hiểu thế giới','Dẫn học trò rời lớp bằng phép thuật thật'],'Hình ảnh thần tiên là liên tưởng thể hiện tác động kì diệu của việc học, không phải sự kiện phép thuật có thật.'],
['Cách học nào tiếp nối tinh thần của đoạn thơ?',['Tìm hiểu địa lí, văn hóa với sự tò mò và trân trọng','Chỉ nhớ tên mà không tìm hiểu','Bịa thêm số liệu cho hấp dẫn','Bỏ qua lời giải thích của thầy'],'Đoạn thơ gợi tình yêu khám phá đất nước từ bài học và sự hướng dẫn của người thầy.']
],[['Nêu tác dụng của hình ảnh “gậy thần tiên” và “cánh tay đạo sĩ”.','Chú ý góc nhìn, trí tưởng tượng của học trò.','Chỉ ra sự liên tưởng từ thước và tay thầy (0,5 điểm); lí giải sự ngưỡng mộ, niềm say mê khi tri thức mở ra thế giới (0,5 điểm).'],['Viết 4–6 câu kể một bài học khiến em muốn tìm hiểu thêm về quê hương, đất nước.','Nêu bài học hoặc thông tin cụ thể, cảm xúc và điều em muốn khám phá tiếp.','Có nội dung học tập cụ thể, phù hợp (0,5 điểm); diễn đạt mạch lạc, thể hiện mong muốn tìm hiểu và tình cảm (0,5 điểm).']], 'quotation');

add(20,`Ngữ liệu tự biên soạn để luyện kể lại trải nghiệm:
Sáng thứ bảy, lớp tôi cùng dọn khu vườn sau trường. Tôi được giao tưới những luống cây mới. Vì muốn xong nhanh để chơi, tôi xách xô nước đổ ào vào một luống rau. Mấy cây non nghiêng rạp xuống. Tôi đứng sững, lo cô giáo sẽ trách.
Thấy vậy, Mai đến bên tôi. Bạn không cười chê mà hướng dẫn tôi dùng ca nhỏ, tưới nhẹ quanh gốc. Hai đứa cùng dựng lại những cây bị đổ. Tôi xin lỗi cô và nhận phần chăm sóc luống rau trong tuần tiếp theo. Cô gật đầu, nhắc tôi kiên nhẫn với những việc tưởng đơn giản.
Cuối buổi, nhìn khu vườn sạch và những cây nhỏ đã đứng lại, tôi thấy nhẹ lòng. Tôi hiểu rằng làm cho nhanh chưa chắc là làm tốt; nhận lỗi và sửa bằng việc cụ thể mới giúp mình tiến bộ.`,[
['Người kể sử dụng ngôi kể nào?',['Ngôi thứ nhất','Ngôi thứ ba giấu mình','Ngôi thứ hai xuyên suốt','Không có người kể'],'Người kể xưng “tôi”, trực tiếp tham gia và kể trải nghiệm của bản thân.'],
['Sự việc diễn ra ở đâu, khi nào?',['Khu vườn sau trường, sáng thứ bảy','Bãi biển, tối chủ nhật','Sân ga, trưa thứ hai','Thư viện, chiều thứ sáu'],'Câu mở đầu cung cấp rõ bối cảnh thời gian và không gian.'],
['Nguyên nhân trực tiếp khiến cây bị nghiêng rạp là gì?',['Tôi đổ nước ào vào luống rau','Mai nhổ hết cây','Cô giáo chuyển luống','Gió bão kéo dài cả tuần'],'Người kể muốn nhanh nên tưới bằng cách đổ mạnh, khiến cây non bị đổ.'],
['Mai đã ứng xử như thế nào?',['Hướng dẫn và cùng giúp sửa lỗi','Chế giễu rồi bỏ đi','Đổ lỗi cho cô giáo','Giấu xô nước để bạn không làm'],'Mai hỗ trợ bằng lời hướng dẫn và hành động, giúp người kể biết cách tưới phù hợp.'],
['Chi tiết nào thể hiện người kể chịu trách nhiệm?',['Xin lỗi và nhận chăm luống rau tuần sau','Bỏ về trước khi xong','Nói rằng cây tự đổ','Chỉ đứng chờ bạn sửa'],'Nhận lỗi đi cùng việc chăm sóc cụ thể cho thấy trách nhiệm, không chỉ là lời nói.'],
['Các sự việc được sắp xếp theo trình tự chủ yếu nào?',['Thời gian và diễn biến trải nghiệm','Theo bảng chữ cái','Theo chiều cao các nhân vật','Theo số lượng đồ dùng'],'Từ đầu buổi, sự cố, khắc phục đến cuối buổi tạo mạch kể rõ ràng.'],
['Câu kết đảm nhiệm vai trò nào?',['Nêu suy nghĩ và bài học từ trải nghiệm','Giới thiệu nhân vật mới','Mở một cuộc tranh luận không liên quan','Liệt kê dụng cụ làm vườn'],'Câu kết khái quát điều người kể hiểu ra sau sự việc mình đã trải qua.'],
['Khi chỉnh sửa bài kể trải nghiệm, việc nào cần ưu tiên?',['Kiểm tra ngôi kể, trình tự, chi tiết và cảm xúc','Thay mọi từ đơn bằng từ khó','Thêm nhiều sự việc không liên quan','Bỏ hết cảm xúc của người kể'],'Những yếu tố này giúp bài kể thống nhất, rõ ràng, có ý nghĩa và thể hiện trải nghiệm riêng.']
],[['Vì sao lời kể có cả hành động lẫn cảm xúc lại giúp trải nghiệm rõ hơn?','Dẫn một chi tiết hành động và một chi tiết tâm trạng trong ngữ liệu.','Chỉ ra hai chi tiết phù hợp (0,5 điểm); giải thích hành động cho biết diễn biến, cảm xúc cho thấy tác động đối với người kể (0,5 điểm).'],['Viết 5–7 câu kể một lần em nhận lỗi hoặc giúp người khác sửa lỗi.','Nêu bối cảnh, việc xảy ra, cách xử lí và điều em hiểu ra.','Có sự việc cụ thể, ngôi kể và trình tự rõ (0,5 điểm); có cách xử lí, cảm xúc hoặc bài học hợp lí (0,5 điểm).']], 'original-example');
}
