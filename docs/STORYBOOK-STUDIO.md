# Tạo Story Book trong lớp học

Giáo viên phụ trách lớp (hoặc quản trị viên) vào **Lớp học → Story Book**.

1. Nhập tên sách, nội dung gốc/tóm tắt và phong cách tranh, rồi lưu ý tưởng.
2. Bấm **Tạo 6 prompt bằng Gemini**. Có thể sửa tên cảnh và prompt; sao chép từng prompt sang Gemini để tạo ảnh. Dùng cùng cuộc trò chuyện và ảnh nhân vật làm tham chiếu cho các cảnh tiếp theo.
3. Tải ảnh vào đủ 6 cảnh. Nhận PNG, JPEG, WebP, tối đa 10 MB mỗi ảnh.
4. Bấm **Gemini viết lời & dựng sách**. Gemini viết lời dựa trên nội dung và mô tả cảnh; ứng dụng ghép lời lên ảnh bằng HTML và dựng trình lật trang. Gemini không chỉnh sửa pixel hoặc phân tích ảnh tải lên trong luồng này. Giáo viên kiểm tra tranh và lời, sửa lời nếu cần, rồi bấm **Dựng từ lời kể hiện tại** để cập nhật bản xem thử.
5. Chọn **Lưu vào thư viện** hoặc **Lưu & giao cho lớp**. Giao bài nhiều lần không tạo bài giao trùng đang hoạt động.

Bản nháp lưu trong SQLite theo lớp, có thể mở lại bằng mục **Tiếp tục sách đã lưu**. Bấm nút tiếp tục/chuyển bước để lưu các sửa đổi prompt và lời kể. Sách đã hoàn tất được khóa chỉnh sửa trong xưởng; chọn **Sách mới** để tạo sách khác. Ảnh và trang sách lưu trong thư mục uploads, cần được sao lưu cùng database.

Dùng cấu hình Gemini hiện có trong **Quản trị → Cài đặt trợ lý AI** hoặc `.env`. API key chỉ được dùng phía máy chủ. Khi Gemini không phản hồi hoặc trả cấu trúc không hợp lệ, giao diện báo lỗi và giữ bản nháp để thử lại.

Kiểm tra: `npm run test:storybook-studio`. Luồng trình duyệt dùng máy chủ, database và Gemini mô phỏng riêng; không thêm sách thử vào dữ liệu thật hoặc tiêu tốn hạn ngạch Gemini.
