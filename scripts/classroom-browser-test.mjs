import { chromium } from "playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
import { startTestServer } from "../tests/support.mjs";
const s = await startTestServer({ classrooms: true }),
  b = await chromium.launch({
    headless: true,
    executablePath:
      process.env.BROWSER_PATH ||
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
const errors = [];
fs.mkdirSync("artifacts/classrooms", { recursive: true });
const page = async () => {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.setDefaultTimeout(15000);
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("dialog", (d) => d.accept());
  return p;
};
const login = async (p, name, password) => {
  await p.goto(s.base + "/login");
  await p.getByPlaceholder("username").fill(name);
  await p.locator("input[type=password]").fill(password);
  await p.locator("button[type=submit]").click();
  await p.waitForURL(s.base + "/");
};
try {
  const admin = await page();
  await login(admin, "admin", "ReviewAdmin!2026");
  await admin.goto(s.base + "/admin/teachers");
  await admin.getByLabel("Họ và tên", { exact: true }).fill("Cô Lan");
  await admin.getByLabel("Tên đăng nhập", { exact: true }).fill("teacher-lan");
  await admin.getByLabel("Mật khẩu ban đầu").fill("TeacherTest!2026");
  await admin
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await admin.getByRole("heading", { name: "Cô Lan", exact: true }).waitFor();
  const teacher = await page();
  await login(teacher, "teacher-lan", "TeacherTest!2026");
  await teacher.waitForURL(s.base + "/classes");
  await teacher.getByLabel("Tên lớp", { exact: true }).fill("6A Văn học");
  await teacher.getByLabel("Trường", { exact: true }).fill("THCS Demo");
  await teacher.getByLabel("Năm học", { exact: true }).fill("2026–2027");
  await teacher.getByRole("button", { name: "Tạo lớp học" }).click();
  await teacher
    .getByRole("heading", { name: "6A Văn học", exact: true })
    .waitFor();
  const code = await teacher.locator(".class-code").innerText();
  await teacher.getByRole("link", { name: "Vào lớp →" }).click();
  const classUrl = teacher.url();
  await s.request("POST", "/auth/register", {
    username: "student-lan",
    password: "StudentTest!2026",
    fullName: "Học sinh An",
  });
  const student = await page();
  await login(student, "student-lan", "StudentTest!2026");
  await student.waitForURL(s.base + "/classes");
  await student.getByLabel("Mã tham gia lớp").fill(code);
  await student.getByRole("button", { name: "Gửi yêu cầu tham gia" }).click();
  await student.getByText("Chờ duyệt", { exact: true }).waitFor();
  assert.equal(
    await student.getByRole("link", { name: "Vào lớp →" }).count(),
    0,
  );
  await teacher.reload();
  await teacher.getByRole("button", { name: /Học sinh \(/ }).click();
  await teacher.getByRole("button", { name: "Duyệt", exact: true }).click();
  await teacher.getByText("Đã vào lớp", { exact: true }).waitFor();
  await teacher
    .getByRole("button", { name: "Bài được giao", exact: true })
    .click();
  await teacher
    .getByLabel("Học liệu / đề kiểm tra")
    .selectOption(s.fixtures.quiz._id);
  await teacher.getByRole("button", { name: "Giao bài", exact: true }).click();
  await teacher.getByRole("link", { name: "Xem bài →" }).waitFor();
  await student.reload();
  await student.getByRole("link", { name: "Vào lớp →" }).click();
  await student.getByRole("link", { name: "Mở bài học →" }).click();
  await student
    .getByRole("button", { name: "Bắt đầu / tiếp tục làm bài" })
    .click();
  await student.locator("input[type=radio]").first().check();
  await student
    .getByRole("textbox", { name: "Trả lời câu 2" })
    .fill("Em học được lòng trung thực.");
  await student.reload();
  await student
    .getByRole("button", { name: "Bắt đầu / tiếp tục làm bài" })
    .click();
  await student.getByRole("textbox", { name: "Trả lời câu 2" }).waitFor();
  assert.equal(
    await student.getByRole("textbox", { name: "Trả lời câu 2" }).inputValue(),
    "Em học được lòng trung thực.",
  );
  await student.getByRole("button", { name: "Nộp bài", exact: true }).click();
  await student
    .getByRole("heading", { name: /Trắc nghiệm: 1 điểm/ })
    .first()
    .waitFor();
  await teacher.goto(classUrl);
  await teacher.getByRole("button", { name: "Bảng điểm", exact: true }).click();
  await teacher.locator("details.class-panel > summary").last().click();
  await teacher.getByLabel("Điểm câu 2 (tối đa 2)").fill("2");
  await teacher.getByLabel("Nhận xét câu 2").fill("Đúng và rõ ý.");
  await teacher.getByRole("button", { name: "Lưu chấm nháp" }).click();
  await teacher.getByText(/Tổng hiện tại: 3\/3/).waitFor();
  await student.reload();
  await student.locator("details.class-panel > summary").last().click();
  assert.equal(
    await student.getByText("Điểm đã chốt: 3/3", { exact: true }).count(),
    0,
  );
  await teacher.getByRole("button", { name: "Chốt điểm và trả bài" }).click();
  await teacher.getByText(/Đã chốt và trả bài/).waitFor();
  await student.reload();
  await student.locator("details.class-panel > summary").last().click();
  await student.getByText("Điểm đã chốt: 3/3", { exact: true }).waitFor();
  await student.screenshot({
    path: "artifacts/classrooms/student-result.png",
    fullPage: true,
  });
  await teacher.screenshot({
    path: "artifacts/classrooms/teacher-grading.png",
    fullPage: true,
  });
  await teacher
    .getByRole("button", { name: "Bài được giao", exact: true })
    .click();
  await teacher.getByLabel("Loại học liệu").selectOption("storybooks");
  await teacher
    .getByLabel("Học liệu / đề kiểm tra")
    .selectOption(s.fixtures.story._id);
  await teacher.getByRole("button", { name: "Giao bài", exact: true }).click();
  await teacher.getByRole("link", { name: "Xem bài →" }).nth(1).waitFor();
  await student.goto(classUrl);
  await student.getByRole("link", { name: "Mở bài học →" }).nth(1).click();
  await student
    .getByRole("button", { name: "Tôi xác nhận đã học xong" })
    .click();
  await student
    .getByRole("status")
    .filter({ hasText: "Đã gửi xác nhận" })
    .waitFor();
  await teacher.goto(classUrl);
  await teacher.getByRole("button", { name: "Tiến độ", exact: true }).click();
  await teacher.getByText(/Tự xác nhận hoàn thành/).waitFor();
  for (const p of [student, teacher, admin]) {
    await p.setViewportSize({ width: 390, height: 844 });
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  await teacher.screenshot({
    path: "artifacts/classrooms/mobile-progress.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS admin creates teacher; teacher creates class; student joins; approval; assignment; answer recovery; draft/final grades; learning activity; mobile; no runtime errors.",
  );
} finally {
  await b.close();
  await s.stop();
}
