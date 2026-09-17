# Quản lý giáo viên, lớp học và bài được giao

Tài khoản mới được tự học và dùng mọi chức năng thư viện mà không cần tham gia lớp. “Lớp của tôi” trên thanh điều hướng là tùy chọn: nhập mã giáo viên, chờ duyệt rồi mở bài được giao. Hoạt động tự học không tự gắn vào lớp hoặc gửi cho giáo viên.

## Sử dụng

1. Admin đăng nhập `/admin/login`, mở **Tài khoản giáo viên** tại `/admin/teachers` để tạo tài khoản. Mật khẩu do admin cấp; giáo viên có thể đổi trong hồ sơ sau khi đăng nhập.
2. Admin hoặc giáo viên tạo lớp. Admin chọn giáo viên phụ trách; giáo viên chỉ tạo lớp cho chính mình. Admin xem toàn bộ lớp tại `/admin/classes`; giáo viên đăng nhập bình thường tại `/login` rồi vào `/classes`.
3. Giáo viên gửi mã tham gia lớp cho học sinh. Học sinh đăng ký, đăng nhập, nhập mã tại `/classes` và chờ duyệt. Ô “Lớp” trong hồ sơ không tự cấp quyền vào lớp.
4. Giáo viên mở tab **Học sinh**, duyệt hoặc từ chối yêu cầu. Đưa ra khỏi lớp không xóa tài khoản và bài làm.
5. Tab **Bài được giao**: chọn Storybook, video, E-learning hoặc đề từ kho có sẵn. Có thể đặt hạn nộp và tối đa 1–5 lượt kiểm tra. Thu hồi bài ngăn truy cập mới nhưng giữ lịch sử.
6. Học sinh mở bài trong lớp. Đề có thời gian do server lưu; tải lại trang không đặt lại đồng hồ. Câu trả lời nháp được lưu trên trình duyệt của tài khoản đó. Lượt hết giờ cũng tính vào số lượt được giao.
7. Giáo viên xem **Bảng điểm**, mở từng bài, chấm tự luận và nhận xét. **Lưu chấm nháp** chưa trả điểm tự luận. **Chốt điểm và trả bài** yêu cầu chấm đủ câu tự luận. Học sinh xem điểm cuối và nhận xét ở bảng điểm lớp hoặc ngay trong bài được giao.
8. Bảng điểm có học sinh chưa nộp, trạng thái từng bài và chi tiết từng lượt. Nút tải xuất Excel `.xlsx` có hai trang: **Bảng điểm** (mỗi học sinh một dòng, mỗi đề một cột, điểm quy về thang 10 của lượt nộp mới nhất) và **Chi tiết lượt làm** (giữ mọi lượt nộp). Có tiêu đề lớp/giáo viên, màu bảng, lọc, cố định hàng tiêu đề và bố cục in ngang. Điểm chưa chốt không tính vào trung bình; bài chưa nộp không bị coi là điểm 0. Endpoint CSV cũ vẫn được giữ để tương thích.
9. Trong **Chấm tự luận**, bấm **Chấm bài** sẽ mở bài làm ngay đầu danh sách và chuyển màn hình tới phần chấm. Giáo viên nhập điểm, nhận xét rồi lưu nháp hoặc chốt trả bài.

## Chỉnh sửa và xóa học liệu trên menu thư viện

Ở Story Book, Video Minh Họa, Bài Giảng E-learning và Kiểm Tra Đánh Giá, giáo viên có nút **Chỉnh sửa / Xóa** trên học liệu của mình hoặc lớp mình đang phụ trách. Học liệu thuộc lớp được bàn giao theo giáo viên phụ trách hiện tại; giáo viên cũ không còn quyền quản lý. Học liệu chung không có người sở hữu vẫn do quản trị viên quản lý. Học sinh không thấy các nút này và API từ chối yêu cầu sửa/xóa của học sinh.

Biểu mẫu cho sửa tiêu đề, mô tả, danh mục, tác giả, đường dẫn học liệu và ảnh đại diện. Đề kiểm tra có thêm chỉnh câu hỏi, lựa chọn, đáp án, điểm và thời gian. Nội dung đề đã giao trong lớp giữ bản chụp lúc giao; đề có lượt làm ngoài lớp không được thay đổi câu hỏi, ngữ liệu hoặc thời gian để bảo toàn bài làm.

Xóa cần xác nhận, gỡ học liệu khỏi thư viện và thu hồi các bài giao tương ứng. Bản ghi học liệu, kết quả, điểm và lịch sử được giữ lại. Hai cửa sổ sửa cùng học liệu sẽ nhận thông báo xung đột, không ghi đè âm thầm.

Kiểm tra: `npm test` và `npm run test:teacher-library`, dùng dữ liệu tạm riêng.

## Theo dõi học tập

- Ghi lần mở bài, lần truy cập gần nhất và xác nhận hoàn thành của học sinh.
- Truyện Ba lưỡi rìu và ba bài E-learning hiện có báo trang/slide đang xem bằng postMessage; chỉ nhận thông báo từ iframe đang mở của đúng bài.
- Video YouTube dùng IFrame API để báo vị trí phát khoảng 10 giây/lần. Video trực tiếp cũng báo vị trí. Không tự chốt hoàn thành khi tua đến cuối.
- Thao tác chat, tạo bài AI, nộp bài AI và lưu flashcard theo truyện được ghi số lần trong bài giao tương ứng. Kết quả trắc nghiệm AI và bộ thẻ cá nhân vẫn ở trang lịch sử/flashcard riêng; đây không phải điểm bài kiểm tra chính thức.
- Vị trí và xác nhận của trình duyệt không chứng minh học sinh tập trung hoặc xem đủ nội dung. Video mở ngoài website không báo tiến độ. Học liệu ngoài không tích hợp postMessage chỉ ghi mở bài và tự xác nhận.
- Chat kiến thức chung dùng độc lập với lớp; không lưu nội dung hội thoại chung vào hồ sơ lớp.

## Phân quyền và giữ lịch sử

Admin quản lý mọi lớp, cấp tài khoản giáo viên, khóa/mở, đặt lại mật khẩu và bàn giao lớp. Khóa giáo viên thu hồi token cũ; các lớp chưa bàn giao tạm dừng truy cập học sinh. Sau bàn giao, giáo viên mới xem được học sinh, bài giao và bài làm cũ; giáo viên cũ mất quyền vào lớp đó.

Giáo viên chỉ xem danh sách thành viên, tiến độ, bài làm và chấm bài của lớp mình. Học sinh chỉ xem lớp đã được duyệt và kết quả của chính mình. API kiểm tra quyền độc lập với giao diện. Không xóa cứng tài khoản đã gắn với lớp; dùng khóa tài khoản/đưa khỏi lớp để giữ lịch sử.

Đề giao vào lớp chụp lại câu hỏi, đáp án, thời gian và ngữ liệu lúc giao. Sửa đề trong kho sau đó không đổi bài đã giao. Mỗi lớp/lần giao có lượt làm và kết quả riêng, không bị giới hạn bởi lần làm đề cũ ngoài lớp.

## Dữ liệu và triển khai

SQLite bổ sung các collection `classes`, `memberships`, `assignments`, `classAttempts`, `classResults`, `classActivity`; không xóa bảng hay dữ liệu cũ. Bài đã làm trước khi có lớp vẫn ở lịch sử cũ/admin, không tự gắn vào một giáo viên bất kỳ.

Chức năng lớp mặc định bật, `render.yaml` đặt `CLASSROOMS_ENABLED=true`; tham gia lớp luôn là tùy chọn. `CLASSROOMS_ENABLED=false` tắt chức năng lớp. Các bài kiểm thử phân quyền lớp chạy với chế độ bật.

Khi deploy bản mới, admin cần tạo giáo viên và lớp; không sinh tài khoản giáo viên dùng chung hoặc tự đưa học sinh cũ vào lớp. Không có thay đổi cách lưu trữ: Render free vẫn có thể mất dữ liệu lớp, tài khoản và điểm khi filesystem tạm được tạo lại. Dùng Persistent Disk hoặc dịch vụ database bền vững trước khi lưu dữ liệu thật.

## Kiểm thử

```sh
npm test
node scripts/classroom-browser-test.mjs
node scripts/render-smoke-test.mjs
```

Test browser dùng database tạm, tạo đủ ba vai trò, kiểm tra duyệt lớp/giao bài/khôi phục nháp/chấm nháp/chốt điểm/tiến độ và giao diện mobile. Ảnh tại `artifacts/classrooms/`. Kiểm thử API bao gồm truy cập chéo lớp, dữ liệu học sinh khác, khóa/bàn giao, giới hạn điểm, hạn nộp và số lượt.
