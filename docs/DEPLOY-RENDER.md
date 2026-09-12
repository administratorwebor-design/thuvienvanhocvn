# Đưa bản demo lên GitHub và Render

## Cấu hình đã chuẩn bị

- Web Service Node.js 24, phục vụ cả frontend và API; Root Directory để trống.
- Build: `npm ci --include=dev && npm ci --prefix backend --omit=dev && npm run build`.
- Start: `npm run start:render`. Health check: `/api/health`.
- `render.yaml` hiện chọn gói miễn phí cho demo. `SEED_DEMO=true` tự tạo học liệu khi chưa có dấu khởi tạo: 1 truyện Ba lưỡi rìu, 2 video YouTube, 3 E-learning, 20 đề. Không chuyển tài khoản, kết quả làm bài hoặc khóa API từ máy local.
- Domain được lấy từ `RENDER_EXTERNAL_URL`; nếu dùng tên miền riêng, đặt `APP_URL` và `FRONTEND_ORIGIN` thành URL HTTPS của tên miền đó.

## GitHub

Nội dung deploy được chụp từ học liệu đang hoạt động ở local vào `docs/demo-library.json`. Chỉ gồm danh mục, banner, truyện, video, E-learning và đề; không có tài khoản, bài làm hoặc khóa AI. Khi đổi học liệu local trước lần deploy đầu, chạy `node scripts/export-demo-library.mjs` rồi kiểm tra và commit snapshot mới. Seed không ghi đè học liệu đã chỉnh trên server có ổ đĩa bền vững.

Tạo repository **Private**, không tạo README hoặc .gitignore trên GitHub vì dự án đã có. Trong thư mục dự án:

```sh
npm run check:deploy
git add .
git diff --cached --stat
git commit -m "Prepare literature library demo for Render"
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

Thay URL bằng repo thực tế. Đã khởi tạo nhánh `main`; chưa commit hoặc cấu hình remote. `.env`, database, uploads, bản backup, node_modules, dist, PDF và video tham chiếu không lên Git. Ảnh, âm thanh và mã học liệu trong `frontend/public` được đưa lên để build không cần PDF hoặc gọi AI.

## Render

1. Chọn **New → Blueprint**, kết nối GitHub và chọn repo trên, nhánh `main`. Render đọc `render.yaml`.
2. Điền `ADMIN_PASSWORD` mới (nên ít nhất 16 ký tự). Username mặc định `admin`. `JWT_SECRET` được Render sinh tự động.
3. Điền `GEMINI_API_KEY` nếu muốn demo chat/flashcard AI. Có thể để trống và nhập sau tại quản trị; trên gói miễn phí nên lưu key trong Environment của Render để không mất khi máy chủ được tạo lại.
4. Deploy, chờ health check thành công, mở URL Render. Đăng nhập `/admin/login` bằng tài khoản mới ở bước 2.
5. Kiểm tra Storybook lật trang, hai video, ba bài giảng và 20 đề; thử tạo một tài khoản học sinh và làm bài. AI chỉ hoạt động khi key hợp lệ và còn quota.

Nếu tạo **Web Service** thủ công, dùng đúng lệnh Build/Start phía trên, đặt `NODE_ENV=production`, `LOAD_ENV=false`, `SEED_DEMO=true`, `NODE_VERSION=24`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET` (ít nhất 32 ký tự) và key Gemini. Không cần tự đặt PORT.

## Giới hạn gói miễn phí và dữ liệu lâu dài

Gói miễn phí dùng filesystem tạm: tài khoản mới, điểm, upload và cấu hình lưu trong database có thể mất khi service khởi động lại hoặc deploy. Học liệu mẫu tự tạo lại; việc này không phục hồi dữ liệu người dùng. Service có thể ngủ khi không dùng và lần mở đầu cần chờ khởi động. Video YouTube cần mạng và phụ thuộc nền tảng nguồn.

Để giữ dữ liệu, chuyển Web Service sang gói hỗ trợ **Persistent Disk**, gắn disk tại `/var/data`, đặt `DATA_DIR=/var/data/library` và `UPLOAD_DIR=/var/data/uploads`. Chỉ chạy một instance cho SQLite. Khởi tạo ổ đĩa mới tạo dữ liệu mới; không tự chuyển dữ liệu đã phát sinh trên filesystem cũ. Sao lưu trước khi chuyển gói nếu cần giữ các dữ liệu đó.

Email quên mật khẩu/xác minh cần SMTP thật. Bản free có thể hạn chế cổng SMTP phổ biến; trước khi hứa chức năng gửi mail, kiểm tra điều kiện gói Render và nhà cung cấp mail. Đăng nhập và làm bài không cần SMTP. Không dùng `MAIL_TRANSPORT=file` trên production.

## Kiểm tra trước push

```sh
npm test
node scripts/render-smoke-test.mjs
npm run check:deploy
```

Smoke test dùng database tạm, kiểm tra production khởi động sạch, đủ học liệu, tài nguyên, đăng nhập admin, CORS và restart. Chưa phải xác nhận deploy thực tế trên Render. Không đưa dữ liệu riêng hoặc API key vào GitHub.
