# Nhật ký phục dựng — 12/09/2026

## Căn cứ

- Phản hồi mới nhất: đã hoàn tác hai Storybook dạng trang PDF và gỡ hai video slideshow. Khôi phục Storybook minh họa “Ba lưỡi rìu”, giữ E-learning và đề theo sách; video AI hoạt hình 2D để làm sau.

- Đã bổ sung hai chủ đề theo PDF sách Ngữ văn 6 tập một do chủ dự án cung cấp. Chi tiết nội dung hiện tại, nguồn, đường dẫn và cách dựng lại nằm trong [TEXTBOOK-DEMO.md](docs/TEXTBOOK-DEMO.md). Các ghi chú về kho mẫu “Ba lưỡi rìu” bên dưới mô tả giai đoạn phục dựng trước; mẫu này hiện được ẩn khỏi danh sách.

- Bundle `assets/index-DsMfHsI5.js` và CSS còn lại.
- Video tham chiếu dài 4:59. Đã đối chiếu các khung hình mỗi 15 giây và phóng lớn các cảnh chính; chưa chuyển lời thuyết minh thành văn bản.
- Website gốc còn phục vụ bundle nhưng API `testlms.derapi.io.vn` trả 502 khi kiểm tra. Chủ dự án xác nhận đã mất toàn bộ mã nguồn và kho học liệu gốc.

## Đã phục hồi và dựng lại

- Tách bundle thành 44 module JS, gồm các trang học sinh, quản trị, trình đọc, phát video, chat và flashcard. Thêm trang JSX cài đặt AI. Đây là mã phục hồi từ bundle: các biến cục bộ và thư viện trong `runtime.js` vẫn mang tên rút gọn, không phải source TypeScript/JSX nguyên bản.
- Giữ nguyên CSS và phần lớn thiết kế, có quy trình build bằng esbuild.
- Sửa API cùng origin, trạng thái đăng nhập khi tải lại trang, chấm bài theo questionId/optionId, kết quả đúng cấu trúc UI, tiến độ bài kiểm tra, bài giảng ZIP, banner imageUrl và URL video upload.
- Đổi JSON sang SQLite, giao dịch và phát hiện xung đột; giữ file JSON gốc.
- Chặn lộ file nội bộ/đáp án, truy cập kết quả của người khác, giả mạo đáp án AI, nộp lại bài; bổ sung thời hạn reset token, thu hồi phiên sau đổi mật khẩu, xác minh email thật qua SMTP và giới hạn yêu cầu.
- Tích hợp Gemini generateContent, timeout, fallback và kiểm tra kết quả. Đã gọi thử thành công bằng key đang có trong `.env`, bao gồm kiểm tra JSON trả về với 2 câu hỏi và 2 flashcard hợp lệ; các bài test tự động dùng máy chủ mô phỏng cục bộ.
- Nhập đề TXT/DOCX có cấu trúc; không còn endpoint trả câu hỏi mẫu giả là kết quả import.
- Có kiểm thử API, browser và lệnh sao lưu mã nguồn + dữ liệu.

## Tài sản hình ảnh và nội dung

- Năm banner trong `frontend/public/reference` được cắt từ video, có chữ và lớp tối đã nằm trong ảnh. Chất lượng bị giới hạn bởi bản quay; không phải ảnh gốc độ phân giải cao. Giao diện bỏ lớp chữ/gradient bổ sung với loại banner này để tránh chồng chữ.
- Minh họa người tiều phu và ông cụ được cắt từ cảnh khoảng 01:45.
- Truyện “Ba lưỡi rìu”, đề ôn tập và bài giảng “Đọc hiểu truyện dân gian” được biên soạn mới làm nội dung khởi đầu. Trình đọc có đổi trang, phóng chữ, toàn màn hình, đọc bằng giọng trình duyệt nếu máy hỗ trợ tiếng Việt. Không phải file Heyzine gốc hoặc giọng đọc gốc.
- Chưa phục hồi toàn bộ kho truyện, video minh họa, bài giảng, câu hỏi và dữ liệu người dùng từ hệ thống trong video. Các số mẫu 500+/10K+/200+/50+ trên trang chủ đã được thay bằng số liệu của cơ sở dữ liệu hiện tại.
- Chưa tái dựng các cảnh/âm thanh đã mất từ video minh họa gốc. Chức năng upload và phát video đã có để bổ sung học liệu mới.
- Học liệu biên soạn và kết quả AI cần được giáo viên rà soát trước khi dùng chính thức.

## Giới hạn còn lại

- Chưa có danh mục học liệu gốc để đối chiếu toàn bộ. Không thể cam kết khôi phục 100% nội dung từ một video trình diễn.
- Chưa kiểm tra tải lớn hoặc mô hình nhiều máy chủ. SQLite phù hợp bản chạy một máy; hệ thống vẫn đọc các collection vào bộ nhớ khi xử lý API.
- Chưa có tích hợp SCORM tracking đầy đủ, kho SGK truy xuất có trích dẫn, kiểm tra chất lượng giáo dục tự động, giám sát hạ tầng hay triển khai lên hosting thật.
- Tài khoản và nội dung thử nghiệm có sẵn từ bản dựng cũ được giữ lại. Khi chạy seed, các mục mang tên test rõ ràng hoặc trỏ tới example.com được đặt `isActive=false` để không xuất hiện như học liệu thật; vẫn còn trong SQLite và danh sách quản trị. File JSON gốc không thay đổi.

## Kết quả kiểm tra

- `npm test`: 11 nhóm kiểm thử qua, bao gồm hợp đồng API, phân quyền, chấm điểm, reset mật khẩu, upload/giải nén bài giảng, đăng ký đồng thời và xung đột dữ liệu.
- `npm run test:browser`: 19 trang hiển thị đúng đường dẫn; các luồng đăng nhập sai, nộp bài, tạo/lưu flashcard, lật trang truyện, quiz AI, bài giảng tương tác, chat và bố cục mobile đều qua; không có lỗi JavaScript trong những luồng đã kiểm tra.
- Gọi Gemini thật thành công cho phản hồi ngắn và JSON chứa 2 câu hỏi + 2 flashcard; chưa đánh giá toàn diện chất lượng câu trả lời hoặc hạn ngạch dài hạn.
- `npm audit --omit=dev` tại thư mục gốc và backend không báo lỗ hổng dependency đã biết. Các thư viện có sẵn trong bundle phục hồi không nằm đầy đủ trong phạm vi kiểm tra dependency này.
- Ảnh chụp kiểm tra nằm trong `artifacts/browser`. Lệnh `npm run backup` đã tạo bản sao mã nguồn, SQLite và uploads trong `artifacts/backups`.

## Điểm đối chiếu video

### Đợt chỉnh sửa trình đọc và flashcard (12/09/2026)

- Trình đọc dùng PageFlip để lật trang có bóng và góc giấy, bố cục một trang đứng với hình trên/chữ dưới; hỗ trợ chọn trang, thu phóng, toàn màn hình và đọc văn bản bằng giọng của thiết bị.
- Bìa và bốn cảnh minh họa được cắt từ video tham chiếu tại khoảng giây 90–104. Một số lời truyện được chép lại từ khung hình; phần kết vẫn biên soạn lại, dùng lại cảnh gặp ông cụ. Đây không phải toàn bộ sách hoặc âm thanh gốc.
- Flashcard AI và bộ thẻ đã lưu dùng hiệu ứng mở tờ giấy từ cạnh, câu hỏi vàng nhạt và đáp án xanh nhạt. Hộp AI hỗ trợ bàn phím, chuyển thẻ, tạo lại và lưu; lưu không làm mất vị trí đang học.
- Nhóm công cụ AI nằm trong khung nhìn; hộp flashcard cuộn được khi màn hình thấp. Giữ nguyên mã nguồn và luồng trắc nghiệm AI.
- Mã nguồn trình đọc tại `frontend/reader`; `npm run build` đóng gói script thường để hoạt động trong iframe sandbox. Hình minh họa tại `frontend/public/reference`.

| Video | Mã nguồn tương ứng |
|---|---|
| Trang chủ và banner | HomePage.js, SiteLayout.js |
| Đọc truyện và công cụ AI | StorybookDetail.js, StoryAssistantMenu.js, StoryChat.js |
| Flashcard | FlashcardDialog.js, MyFlashcardsPage.js |
| Video và E-learning | VideoPlayer.js, VideoDetail.js, ElearningDetail.js |
| Trợ lý Ngữ Văn 6 | LiteratureAssistant.js |
| Làm bài, chấm điểm và xem lại | QuizPage.js, ResultDetail.js, AdminQuizResults.js |
