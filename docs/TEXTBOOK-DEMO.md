# Bộ học liệu trình diễn Ngữ văn 6

> **Cập nhật kiểm tra đánh giá:** Hai đề demo bên dưới đã được thay bằng ngân hàng 20 đề độc lập, mỗi đề 8 trắc nghiệm và 2 tự luận, 30 phút, 10 điểm. Dùng `npm run seed:assessments`; xem [danh mục và hướng dẫn chấm](ASSESSMENT-GUIDE.md). Các mô tả hai đề cũ bên dưới chỉ còn là lịch sử. Storybook và E-learning giữ nguyên.

> **Điều chỉnh theo phản hồi mới nhất:** Storybook đã khôi phục bản minh họa “Ba lưỡi rìu” tại `/storybooks/reference-ba-luoi-riu`. Hai Storybook dạng trang PDF, hai video slideshow và hai bộ thẻ mẫu gắn với chúng đã được gỡ. Giữ nguyên hai bài E-learning và hai đề luyện tập. Video minh họa sẽ làm sau, theo hướng video AI hoạt hình 2D chuyên nghiệp. Các mục mô tả video/PDF storybook bên dưới là lịch sử triển khai đã bị hủy, không phải nội dung đang phục vụ.

`seed:textbook` hiện chỉ bổ sung E-learning/đề, khôi phục truyện minh họa cũ và gỡ các bản bị từ chối; không tạo lại video hoặc Storybook PDF. Script dựng media chỉ tạo hình và lời đọc cho E-learning. `test:textbook` kiểm tra truyện cũ đã phục hồi, các bản bị từ chối đã gỡ và hai bài E-learning/đề vẫn hoạt động.

Nguồn: PDF `SGK - Văn 6 - Chương trình mới - Tập 1.pdf` do chủ dự án cung cấp, 138 trang quét; bìa xác nhận bộ **Kết nối tri thức với cuộc sống**. Số trang PDF lớn hơn số trang in một đơn vị.

| Chủ đề | Trang sách | Sách lật | Video | Bài giảng | Đề | Flashcard |
|---|---|---|---|---|---|---|
| Bài học đường đời đầu tiên – Tô Hoài | 12–19 | 8 trang từ PDF | khoảng 99 giây | 6 phần nghe/đọc + 6 câu luyện tập + vận dụng | 6 trắc nghiệm + 1 tự luận, 10 điểm | 10 thẻ |
| Cô bé bán diêm – An-đéc-xen | 61–66 | 6 trang từ PDF | khoảng 106 giây | 6 phần nghe/đọc + 6 câu luyện tập + vận dụng | 6 trắc nghiệm + 1 tự luận, 10 điểm | 10 thẻ |

Video là bản tóm tắt có chuyển động hình ảnh và giọng đọc tổng hợp `vi-VN-HoaiMyNeural`, dùng minh họa cắt từ PDF; không phải phim hoạt hình hay bản thu âm của nhà xuất bản. Bài giảng và đề được biên soạn lại theo văn bản. Thẻ được tạo bằng Gemini rồi rà soát, chỉnh câu hỏi cho rõ nghĩa. Nội dung chat/AI lấy từ tóm tắt riêng của đúng tác phẩm.

## Đường dẫn demo

- Sách: `/storybooks/demo-bai-hoc-duong-doi`, `/storybooks/demo-co-be-ban-diem`.
- Video: `/video/demo-video-bai-hoc-duong-doi`, `/video/demo-video-co-be-ban-diem`.
- Bài giảng: `/elearning/demo-lesson-bai-hoc-duong-doi`, `/elearning/demo-lesson-co-be-ban-diem`.
- Đề: `/quiz/demo-quiz-bai-hoc-duong-doi`, `/quiz/demo-quiz-co-be-ban-diem`.
- Hai bộ thẻ được lưu sẵn cho tài khoản quản trị hiện có, mở tại `/my-flashcards` hoặc nút Flash Card AI trong truyện. Người dùng khác có thể tạo/lưu thẻ bằng AI sau khi đăng nhập. Không tạo thêm tài khoản hoặc đổi mật khẩu.

## Vận hành

- `npm run build` đóng gói website và sao chép học liệu đã có sẵn.
- `npm run seed:textbook` thêm hai chủ đề vào SQLite. Chạy lại không tạo bản trùng, không ghi đè nội dung hoặc bộ thẻ người dùng đã sửa. Chỉ ẩn ba học liệu mẫu cũ có ID `reference-*` được chỉ định trong script, giữ dữ liệu và lịch sử cũ.
- `npm run test:textbook` kiểm tra trên Edge với database tạm: seed hai lần, trang sách, flashcard đã lưu, MP4 phát/tua, lời giảng, 12 câu luyện tập, hai đề, tuyến tạo thẻ với AI mô phỏng và bố cục mobile.
- `npm test` kiểm tra các hợp đồng API, phân quyền và chấm điểm.
- Dữ liệu biên soạn nằm trong `docs/textbook-demo.json`, các bộ thẻ trong `docs/*-cards.json`. Học liệu phục vụ website nằm trong `frontend/public/reference/textbook`.
- Script dựng lại media: `python scripts/build-textbook-media.py`. Cần PDF gốc, font Segoe UI trên Windows và các gói Python `pymupdf`, `Pillow`, `edge-tts`, `imageio-ffmpeg`; script hiện tìm gói trong thư mục tạm `codex-video-review-deps`. Tạo lời đọc lần đầu cần kết nối dịch vụ TTS. Website phát file đã tạo nên không cần TTS khi khách xem.

## Phạm vi

Đây là hai chủ đề mẫu, chưa phải toàn bộ sách. Điểm luyện tập trong bài giảng chỉ tồn tại trong lượt học, được ghi rõ trên màn hình kết quả; điểm ở mục Kiểm tra được lưu theo tài khoản, tự luận chờ giáo viên chấm. Hình ảnh giữ chất lượng và dấu có trong bản PDF được cung cấp.
