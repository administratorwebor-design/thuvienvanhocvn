# Deploy với dữ liệu local đã chuyển sang Supabase

Backend dùng PostgreSQL qua Session pooler, SSL xác minh bằng chứng chỉ CA trong `backend/certs/prod-ca-2021.crt`. Tài khoản, mật khẩu đã băm, lớp, thành viên, học liệu, đề và kết quả được giữ nguyên. Không dùng Supabase Auth: luồng đăng nhập và phân quyền của ứng dụng vẫn ở backend.

## Trên Render

Deploy Blueprint từ nhánh `main`, file `render.yaml`. Điền **SUPABASE_DATABASE_URL** bằng đúng giá trị trong `.env` local (mật khẩu trong URI đã được mã hóa). Không dán cả tên biến hoặc dấu ngoặc kép. Không commit giá trị này vào Git. Giữ **GEMINI_API_KEY** để dùng AI.

Blueprint đã đặt:

```env
DATABASE_DRIVER=supabase
SUPABASE_CA_CERT_PATH=backend/certs/prod-ca-2021.crt
REQUIRE_EXISTING_DATA=true
SEED_DEMO=false
```

Nếu service đã tạo từ Blueprint cũ, kiểm tra các biến trên trong Environment, thêm SUPABASE_DATABASE_URL rồi deploy commit mới. JWT_SECRET được Blueprint sinh tự động. ADMIN_PASSWORD chỉ dùng khi tạo database mới, không đổi mật khẩu admin đã chuyển sang Supabase. Đăng nhập bằng tài khoản local hiện có.

`GET /api/health` phải trả `storage: "supabase"`. Máy chủ sẽ từ chối khởi động khi không kết nối được Supabase hoặc database rỗng; không tự chuyển về SQLite. Không chạy script seed demo khi dùng database đã chuyển.

## Dữ liệu và file

Schema riêng `literature_app`, bảng `records` chứa dữ liệu nghiệp vụ và bảng `assets` chứa file uploads kèm SHA-256. Schema không cấp quyền cho `anon`/`authenticated`; hai bảng bật RLS. Chỉ backend dùng chuỗi kết nối database. Có thể chọn schema này trong công cụ quản trị Supabase để xem dữ liệu.

Các file tải lên hiện tại chỉ 8.700 byte, nên được lưu trực tiếp vào PostgreSQL cùng dữ liệu thay vì cần thêm khóa Supabase Storage. File mới được lưu trước khi xác nhận ghi dữ liệu. Khi Render khởi động với thư mục trống, ứng dụng khôi phục uploads từ database, kiểm tra mã băm, rồi phục vụ lại cùng URL. File mới từ một máy khác được tải về khi URL chưa có trong cache local. Học liệu tĩnh `/reference` đi cùng mã nguồn Git.

Giới hạn lưu file trên PostgreSQL là 50 MB/tệp; video lớn nên dùng YouTube/Drive. Cách này phù hợp dung lượng hiện tại, không thay thế một hệ thống lưu video lớn. Khi số lượng file tăng, chuyển bảng assets sang Supabase Storage và theo dõi hạn mức database của gói Supabase.

## Sao lưu và chuyển lần đầu

`npm run backup` tạo bản sao SQLite, uploads và mã nguồn trong `artifacts/backups` (không lên Git). `npm run migrate:supabase` sao lưu database local + uploads trước, chỉ nhập vào schema trống, từ chối ghi đè nếu đích có dữ liệu khác. Ghi dữ liệu trong transaction, sau đó đối chiếu từng bản ghi và hash của uploads. Báo cáo xác minh nằm trong thư mục backup của lần chuyển.

Sau khi chuyển, Supabase là nguồn dữ liệu chính; SQLite cũ là bản lưu trước chuyển. Không chạy lại migration sau khi web đã có thay đổi mới. Nên xuất gói sao lưu định kỳ qua chức năng quản trị; `npm run backup` vẫn sao lưu SQLite local cũ, không phải bản Supabase mới nhất.

## Kiểm thử

- `npm test`: hồi quy nghiệp vụ trên SQLite độc lập.
- `npm run test:supabase`: tạo schema tạm trên Supabase để thử transaction, chống ghi đè, tài khoản trùng, API lớp/đề và file; xóa đúng schema thử nghiệm sau khi chạy.
- `npm run verify:supabase-deploy`: khởi động cấu hình production từ thư mục trống, kiểm tra health, học liệu, file khôi phục và xác nhận không tạo SQLite. Lệnh đọc dữ liệu Supabase thật; không đổi mật khẩu hoặc tạo tài khoản thử trong dữ liệu thật.
