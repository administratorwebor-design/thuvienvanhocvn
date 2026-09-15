# Backend

Quản lý ba vai trò và lớp học: [hướng dẫn sử dụng, phân quyền, dữ liệu](../docs/CLASSROOMS.md). Admin cấp giáo viên tại `/admin/teachers`; lớp tại `/classes`.

Deploy GitHub → Render: xem [hướng dẫn và biến môi trường](../docs/DEPLOY-RENDER.md). Đã có `render.yaml`; dùng `npm run start:render` để khởi tạo học liệu demo trên server mới.

Ngân hàng kiểm tra: 20 đề Ngữ văn 6, Kết nối tri thức với cuộc sống, tập một; mỗi đề 8 trắc nghiệm + 2 tự luận, 30 phút, 10 điểm. Chạy `npm run seed:assessments` từ thư mục gốc để bổ sung dữ liệu (chạy lại không ghi đè đề đã chỉnh sửa). Xem [ngữ liệu, đáp án và hướng dẫn chấm](../docs/ASSESSMENT-GUIDE.md). Trắc nghiệm chấm tự động; giáo viên chấm riêng từng câu tự luận. Chạy `node scripts/assessment-browser-test.mjs` sau khi build để kiểm tra giao diện.

See [the project README](../README.md) for startup, configuration, SQLite migration, tests and deployment. Node.js 24 or later is required.

The surviving frontend API contracts are implemented here. Recovered frontend source is in `../frontend/src`.
