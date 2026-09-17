# Giáo viên nhập đề kiểm tra

Vào lớp → **Kiểm tra đánh giá**. Nhập tên đề, ngữ liệu/yêu cầu, thời gian làm bài (1–180 phút). Thêm câu trắc nghiệm hoặc tự luận, nhập nội dung và số điểm từng câu. Tổng điểm được cộng từ các câu, không bắt buộc là 10.

Trắc nghiệm: nhập các lựa chọn và chọn một đáp án đúng. Tự luận: nhập hướng dẫn chấm dành riêng cho giáo viên; ô gợi ý là nội dung học sinh nhìn thấy. Dùng nút mũi tên để đổi thứ tự hoặc xóa câu. Tối đa 100 câu.

**Xem mẫu học sinh** dùng chung thành phần câu hỏi với trang làm bài hiện tại, có lựa chọn trắc nghiệm và ô trả lời tự luận nhưng không hiện đáp án/hướng dẫn chấm. Xem thử không tạo lượt làm.

**Lưu đề** lưu vào thư viện đề. **Lưu & giao cho lớp** tạo bài được giao với hạn nộp (tùy chọn), số lượt làm 1–5 và yêu cầu giáo viên. Học sinh bắt đầu bài theo luồng hiện tại: tính giờ, nộp bài, tự chấm trắc nghiệm; tự luận được chấm và trả điểm trong lớp.

Có thể mở đề đã lưu để sửa. Bài đã giao giữ một bản nội dung riêng, nên sửa đề gốc không thay đổi câu hỏi hoặc điểm của lượt đang làm. Giao lại phiên bản đã sửa tạo bài giao mới. Lưu/giao lặp lại cùng phiên bản không tạo thêm bài giao đang hoạt động.

Chỉ giáo viên phụ trách lớp và quản trị viên có quyền soạn, xem đáp án hoặc sửa đề trong mục này.

## Tạo trắc nghiệm bằng AI

Trong **Kiểm tra đánh giá**, mở **Tạo trắc nghiệm bằng AI**, nhập chủ đề, dán nội dung bài học và chọn 1–20 câu. Có thể lấy ngữ liệu đang soạn bằng nút tương ứng. Bấm **Tạo câu hỏi bằng AI** để xem trước câu hỏi, bốn lựa chọn, đáp án đúng và giải thích.

Bấm **Thêm câu hỏi vào đề** sau khi duyệt. Câu AI được nối vào đề, giữ nguyên câu giáo viên đã nhập; câu trắc nghiệm mặc định còn trống được thay thế. Mỗi câu mặc định 1 điểm, có thể sửa nội dung, đáp án và điểm như câu nhập tay. Tổng số câu trong đề tối đa 100. AI không tự lưu hoặc giao bài: giáo viên dùng **Lưu đề** hoặc **Lưu & giao cho lớp** sau khi kiểm tra.

Chủ đề, nội dung và kết quả chờ duyệt được giữ trong phiên trình duyệt theo tài khoản và lớp. Nếu AI lỗi, đề đang soạn vẫn còn nguyên. Giáo viên cần kiểm tra độ chính xác trước khi sử dụng.

Máy chủ dùng tích hợp Gemini sẵn có và cần `GEMINI_API_KEY` hợp lệ; khóa không được gửi xuống trình duyệt. Endpoint `POST /api/classes/:classId/teacher-assessments/generate` kiểm tra quyền phụ trách lớp, giới hạn tần suất và xác thực cấu trúc câu AI trả về. Kiểm thử riêng: `npm run test:teacher-assessments-ai` (AI giả lập, dữ liệu tách biệt).

Kiểm tra: `npm run test:teacher-assessments`, sử dụng dữ liệu riêng để kiểm tra từ nhập đề đến học sinh nộp bài và giáo viên trả điểm.
