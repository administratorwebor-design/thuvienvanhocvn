# Soạn bài giảng kéo thả

Trong lớp học, chọn **Bài giảng E-learning**. Giáo viên phụ trách hoặc quản trị viên có thể soạn bài.

## AI hỗ trợ soạn trọn bài

Bấm **AI hỗ trợ** trên thanh công cụ, nhập chủ đề và nội dung bài học. Có thể tải tối đa 6 ảnh (PNG/JPEG/WebP, 10 MB/ảnh), kèm mô tả nội dung của từng ảnh. Gemini nhận cả ảnh thực tế lẫn mô tả để đọc tư liệu và soạn bài. Ảnh được tối ưu kích thước trước khi gửi; nên dùng ảnh rõ chữ. Nếu chỉ dùng ảnh chụp tư liệu, có thể để trống phần nội dung chữ.

Chọn 4–12 trang nội dung, 1–5 câu trắc nghiệm và một tông màu. **Tạo bài giảng bằng AI** tạo bản nháp mới gồm nội dung đã bố trí chữ/ảnh và các trang câu hỏi xen sau phần kiến thức liên quan. Mỗi câu có 4 lựa chọn, đáp án đúng và giải thích. Số trang tổng cộng bằng số trang nội dung cộng số câu hỏi.

Bản đang soạn được lưu trước khi tạo; kết quả AI nằm trong bản nháp riêng, có thể mở lại và chỉnh bằng kéo thả. Chỉ khi giáo viên chọn lưu vào thư viện/giao cho lớp thì bài mới được đưa vào học liệu. Hãy kiểm tra nội dung đọc từ ảnh và đáp án trước khi giao. Khi AI trả cấu trúc lỗi, biểu mẫu giữ tư liệu để thử lại, không tạo bài giảng giả thay thế.

Kiểm tra luồng này: `npm run test:lesson-ai` (Gemini mô phỏng, có xác nhận gửi dữ liệu ảnh).

## Soạn và chỉnh bằng kéo thả

- Nhập tên, thêm trang và kéo ảnh PNG/JPEG/WebP từ máy vào vùng thiết kế, hoặc dùng **Thêm ảnh** (10 MB/ảnh).
- Bấm **Khung chữ**, chọn khung rồi sửa nội dung tại bảng bên phải. Kéo đối tượng để di chuyển, kéo góc phải dưới để đổi cỡ. Các ô vị trí và kích thước dùng phần trăm của trang 16:9.
- Chỉnh màu nền trang, màu chữ, nền khung, cỡ chữ, in đậm và căn lề. Dùng **Lên/Xuống một lớp** để đổi thứ tự chồng ảnh và chữ.
- Thêm/nhân đôi/xóa trang; kéo hình thu nhỏ để đổi thứ tự, hoặc dùng nút mũi tên. Có hoàn tác và làm lại. Chọn đối tượng và dùng phím mũi tên để dịch 1%; giữ Shift để dịch 5%; Delete để xóa.
- **Câu hỏi** thêm câu trắc nghiệm thủ công. **Tạo câu hỏi AI** dùng Gemini hiện có để tạo 1–5 câu từ nội dung chữ và tư liệu bổ sung, mỗi câu thành một trang. Chỉnh lại câu hỏi, 4 lựa chọn, đáp án đúng và giải thích trước khi lưu.
- **Lưu bản nháp** lưu thiết kế để mở lại. Bấm lưu trước khi rời mục E-learning hoặc tải lại trang. Tối đa 40 trang, 30 đối tượng mỗi trang.
- **Xem thử** mở trình chiếu và cho thử trả lời câu hỏi. **Lưu vào thư viện** xuất bài; **Lưu & giao cho lớp** thêm bài giao. Xuất lại cập nhật bài giảng hiện có, không tạo bài giao đang hoạt động trùng lặp.

Câu hỏi nhúng là **luyện tập**, có phản hồi ngay và được làm lại; không tính vào bảng điểm chính thức. Đáp án đi cùng bài luyện tập. Khi học từ bài được giao, số trang hiện tại gửi về Tiến độ; vị trí trang không chứng minh học sinh đã đọc hết.

Bản nháp lưu trong `lessonDrafts` ở SQLite, ảnh và các phiên bản bài xuất lưu trong uploads. Bản xuất độc lập với các thay đổi chưa xuất của bản nháp. Cần sao lưu cả database và uploads. Hai cửa sổ sửa cùng bản nháp sẽ nhận thông báo xung đột thay vì ghi đè âm thầm.

Kiểm tra: `npm run test:elearning-studio`. Dùng database riêng và Gemini mô phỏng; kiểm tra kéo/đổi cỡ, lưu/mở lại, câu hỏi tương tác, phân quyền, xuất/giao bài và tiến độ học sinh.
