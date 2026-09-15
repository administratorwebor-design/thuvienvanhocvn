# Video minh họa trong thư viện

Cập nhật 15/09/2026: giữ Dế Mèn, bổ sung 4 video tư liệu phù hợp Ngữ văn 6 Kết nối tri thức, tập 1.

| Video | Bài học liên hệ | Nguồn |
|---|---|---|
| Dế Mèn – Bài học đường đời đầu tiên | Trách nhiệm với người khác | https://www.youtube.com/watch?v=WBqijL_58-w |
| Cô Tô – Cảnh biển và cuộc sống trên đảo (2:24) | Cô Tô | https://www.youtube.com/watch?v=X8xUQHVaA98 |
| Hang Én – Thiên nhiên trong mùa mưa (1:23) | Hang Én | https://www.youtube.com/watch?v=sbKLTBvOBvc |
| Rừng tre Fansipan (1:12) | Cây tre Việt Nam | https://www.youtube.com/watch?v=DSHtJUMscUw |
| Miền sông nước Cửu Long (4:35) | Cửu Long Giang ta ơi | https://www.youtube.com/watch?v=GJfCFEnL3SM |

Đã kiểm tra metadata, phát nhúng trên Edge và lấy mẫu đầu/giữa/cuối. Không thấy watermark chèn vào hình trong các mẫu của 4 video mới. Vẫn giữ giao diện YouTube, tên kênh, credit tác giả và thẻ gợi ý; không cắt, che hoặc xóa logo khỏi nguồn. Kiểm tra lấy mẫu không bảo đảm mọi khung hình đều không có chữ/logo. Bằng chứng: artifacts/clean-videos/.

Đã ngừng hiển thị 8 video cũ: Cô bé bán diêm có quảng cáo dịch vụ ở cuối; 7 clip khởi động có watermark Veo/tên website hoặc quảng bá bản đầy đủ. Giữ bản ghi để đối chiếu. Danh sách nằm trong docs/curated-videos.json; script nạp dữ liệu không đưa lại các video đã gỡ.

Chạy node scripts/seed-demo-videos.mjs để cập nhật, không tạo trùng. docs/demo-library.json cũng đã cập nhật cho bản triển khai. Mỗi video có tên kênh, mô tả liên hệ bài học và câu hỏi gợi mở. Cảnh quay du lịch không thay thế văn bản sách.

Dùng nhúng YouTube chính thức, không lưu MP4. Khả năng phát, quảng cáo và thẻ gợi ý phụ thuộc YouTube/chủ kênh.

Giới hạn kiểm tra 15/09/2026: các nguồn phát và tua lấy mẫu được trong iframe có autoplay/mute. Khi bấm phát trên trang chi tiết bằng Edge headless, video có lượt đứng tại 0:00 dù readyState=4. Chưa xác định nguyên nhân từ YouTube hay môi trường kiểm thử; không coi đây là kiểm chứng đầy đủ luồng bấm phát. Trang chi tiết có liên kết mở video gốc trên YouTube.
