# Thư Viện Số Văn Học

**Deploy demo lên Render:** xem [hướng dẫn GitHub → Render](docs/DEPLOY-RENDER.md). Đã có Blueprint `render.yaml`, Node 24 và snapshot học liệu hiện tại; không cần đưa database local lên GitHub.

**Quản lý lớp học:** xem [hướng dẫn admin, giáo viên, học sinh](docs/CLASSROOMS.md). Admin tạo giáo viên tại `/admin/teachers`; học sinh vào `/classes` để nhập mã và chờ duyệt. Bài kiểm tra mới được giao/chấm trong lớp.

Bản phục dựng từ frontend còn lại và video “THUYẾT MÌNH SẢN PHẨM AI.mp4”. Giao diện giữ thiết kế đã trình diễn; backend được dựng lại. Chi tiết nguồn gốc và giới hạn nằm trong [RESTORATION.md](RESTORATION.md).

## Chạy trên máy

Cần Node.js 24 trở lên (sử dụng SQLite tích hợp trong Node).

```powershell
npm ci
npm ci --prefix backend
# Chỉ khi chưa có .env: copy .env.example .env
# Đặt ADMIN_PASSWORD (ít nhất 8 ký tự), JWT_SECRET và APP_URL trong .env.
npm run seed:reference
npm run dev
```

Mở **http://127.0.0.1:4000**. Trang quản trị: **/admin/login**. Tài khoản quản trị hiện có được giữ nguyên; ADMIN_PASSWORD chỉ tạo tài khoản khi chưa có admin, không đổi mật khẩu tài khoản đã tồn tại.

`npm run dev` build frontend và chạy backend ở chế độ theo dõi. Khi sửa frontend, chạy lại `npm run build` rồi tải lại trình duyệt. `npm start` dùng bản build sẵn. Backend phục vụ frontend và API trên cùng địa chỉ, không cần sửa domain trong bundle.

## AI và email

- Đăng nhập quản trị → **Cài đặt trợ lý AI** để nhập Gemini API key và chọn mô hình. Có thể cấu hình bằng `.env` thay thế. Cài đặt lưu từ giao diện được ưu tiên và nằm trong `backend/data/ai-settings.json`, không được phục vụ qua web.
- Truyện cần văn bản TXT/MD/DOCX để AI có ngữ cảnh. AI tạo đề và flashcard chỉ trả thành công khi kết quả đạt cấu trúc yêu cầu. Không trả câu hỏi mẫu thay cho kết quả lỗi.
- Khi chưa có key, hệ thống báo AI chưa cấu hình. Việc lưu key chưa chứng minh key còn hạn ngạch; thử chat để kiểm tra kết nối.
- Chat Ngữ Văn 6 là trợ lý kiến thức chung, chưa có đầy đủ sách giáo khoa đã được cấp quyền sử dụng. Không coi câu trả lời là trích dẫn SGK.
- SMTP cần thiết để gửi email xác minh và đặt lại mật khẩu. Khi chạy local, `MAIL_TRANSPORT=file` ghi thư vào `backend/data/mail-outbox` để kiểm tra; token không trả về API. Không dùng chế độ này cho production.

## Học liệu

- Story Book: URL Heyzine/flipbook hoặc video và văn bản đi kèm.
- Video: upload MP4/WebM, ảnh đại diện.
- E-learning: upload ZIP có `story.html` hoặc `index.html`; file được giải nén sau kiểm tra đường dẫn và kích thước. Bài giảng chạy trong iframe cách ly; gói cần truy cập cùng origin hoặc SCORM LMS đầy đủ có thể cần tích hợp thêm.
- Đề kiểm tra: tạo thủ công hoặc nhập TXT/DOCX theo mẫu [docs/quiz-import-example.txt](docs/quiz-import-example.txt). File DOC cũ cần chuyển thành DOCX.
- Mỗi bài kiểm tra chính thức có một lượt nộp; thời gian bắt đầu được lưu phía server. Câu tự luận do quản trị viên chấm trong “Kết quả Quiz”. Trắc nghiệm AI theo truyện là hoạt động luyện tập riêng.

## Dữ liệu và sao lưu

Lần đầu chạy, `backend/data/db.json` được nhập vào `library.sqlite`; file JSON gốc không bị ghi đè. Sau đó ứng dụng chỉ ghi SQLite. Không sửa db.json để cập nhật dữ liệu đang chạy.

```powershell
npm run backup
```

Lệnh tạo ZIP mã nguồn, bản SQLite nhất quán và bản sao uploads trong `artifacts/backups/<thời điểm>`. Secrets không nằm trong ZIP. Sao chép bản sao lưu sang ổ đĩa hoặc dịch vụ khác để tránh mất cùng máy. Thư mục sao lưu chứa dữ liệu người dùng, cần giữ riêng tư.

## Kiểm tra

```powershell
npm test
npm run test:browser
```

Test dùng thư mục tạm và cổng riêng, không ghi dữ liệu kiểm thử vào thư viện thật. Test AI dùng máy chủ mô phỏng cục bộ, không tiêu tốn hạn ngạch Gemini. Browser test dùng Edge/Chrome có sẵn trên Windows; máy khác dùng `npx playwright install chromium` hoặc đặt `BROWSER_PATH`.

## Triển khai

Build bằng `npm run build`, đặt `NODE_ENV=production`, cấu hình JWT_SECRET mạnh và URL HTTPS thực tế, chạy `npm start` phía sau reverse proxy. Chỉ công khai backend đang phục vụ `dist/`; không phục vụ toàn bộ thư mục dự án. Cần sao lưu dữ liệu và kiểm duyệt học liệu trước khi sử dụng chính thức.
