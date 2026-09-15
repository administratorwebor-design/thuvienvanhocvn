# Năm bài giảng minh họa

Mở `/reference/illustrated-lessons/index.html` để xem trọn bộ. Các bài cũng xuất hiện trong danh mục E-learning sau khi chạy seed.

- Dế Mèn · Học cách chịu trách nhiệm
- Cô bé bán diêm · Thắp sáng sự sẻ chia
- Mây và sóng · Thế giới của yêu thương
- Gió lạnh đầu mùa · Chiếc áo của lòng nhân ái
- Ba lưỡi rìu · Giá trị của lòng trung thực

Tổng cộng 29 trang; mỗi trang trong cùng một bài dùng một ảnh khác nhau từ kho minh họa hiện có. Mỗi bài có mục tiêu, hoạt động đọc hiểu, hai câu trắc nghiệm kèm giải thích, bài viết vận dụng và tiêu chí tự đánh giá. Bài viết lưu trên trình duyệt hoặc tải thành TXT; không tự gửi giáo viên. Bộ bài này không có âm thanh thu sẵn.

```powershell
node scripts/build-illustrated-lessons.mjs
node scripts/seed-illustrated-lessons.mjs
npm run build
node scripts/illustrated-lessons-test.mjs
```

Seed chỉ thêm các ID mới, giữ nguyên học liệu và lịch sử có sẵn. Snapshot `docs/demo-library.json` cũng chứa năm bài để khởi tạo môi trường triển khai mới. Với môi trường đã khởi tạo, chạy riêng seed trên môi trường đó để bổ sung bài.
