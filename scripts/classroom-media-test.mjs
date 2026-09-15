import { chromium } from "playwright";
import assert from "node:assert/strict";
import { startTestServer } from "../tests/support.mjs";
const s = await startTestServer({ classrooms: true }),
  b = await chromium.launch({
    headless: true,
    executablePath:
      process.env.BROWSER_PATH ||
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  });
try {
  const req = s.request,
    admin = s.adminToken;
  await req(
    "POST",
    "/teachers",
    {
      username: "media-teacher",
      fullName: "Teacher Media",
      password: "TeacherTest!2026",
    },
    admin,
  );
  const teacher = (
    await req("POST", "/auth/login", {
      username: "media-teacher",
      password: "TeacherTest!2026",
    })
  ).data.token;
  const c = (await req("POST", "/classes", { name: "Media class" }, teacher))
    .data.classroom;
  await req("POST", "/auth/register", {
    username: "media-student",
    password: "StudentTest!2026",
  });
  const student = (
    await req("POST", "/auth/login", {
      username: "media-student",
      password: "StudentTest!2026",
    })
  ).data;
  await req("POST", "/classes/join", { code: c.joinCode }, student.token);
  await req(
    "PATCH",
    `/classes/${c._id}/members/${student.user._id}`,
    { status: "approved" },
    teacher,
  );
  const video = (
    await req(
      "POST",
      "/videos",
      { title: "Video AI", url: "https://www.youtube.com/watch?v=WBqijL_58-w" },
      admin,
    )
  ).data.video;
  const lesson = (
    await req(
      "POST",
      "/elearnings",
      { title: "Mây và sóng", url: "/reference/may-va-song/lesson.html" },
      admin,
    )
  ).data.elearning;
  const assignments = [];
  for (const [kind, resource] of [
    ["videos", video],
    ["elearnings", lesson],
  ]) {
    const r = await req(
      "POST",
      `/classes/${c._id}/assignments`,
      { kind, resourceId: resource._id },
      teacher,
    );
    assert.equal(r.status, 201);
    assignments.push(r.data.assignment);
  }
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(s.base + "/login");
  await p.getByPlaceholder("username").fill("media-student");
  await p.locator("input[type=password]").fill("StudentTest!2026");
  await p.locator("button[type=submit]").click();
  await p.waitForURL(s.base + "/");
  await p.goto(s.base + "/assignments/" + assignments[1]._id);
  await p
    .frameLocator("iframe")
    .getByRole("button", { name: "Tiếp →", exact: true })
    .click();
  await p.waitForTimeout(500);
  let activity = (await req("GET", "/classes/" + c._id, undefined, teacher))
    .data.activity;
  assert.equal(
    activity.find((a) => a.assignmentId === assignments[1]._id).position,
    2,
  );
  console.log("PASS sandboxed lesson reports slide 2");
  await p.goto(s.base + "/assignments/" + assignments[0]._id);
  await p
    .frameLocator("iframe")
    .getByRole("button", { name: /Phát|Play/ })
    .first()
    .click({ timeout: 35000 });
  await p.waitForTimeout(12000);
  activity = (await req("GET", "/classes/" + c._id, undefined, teacher)).data
    .activity;
  const progress = activity.find((a) => a.assignmentId === assignments[0]._id);
  assert.ok(
    progress.position > 0 && progress.total > 0,
    JSON.stringify(progress),
  );
  console.log(
    "PASS live YouTube playback position recorded for assigned student",
  );
  await p.screenshot({ path: "artifacts/classrooms/video-progress.png" });
} finally {
  await b.close();
  await s.stop();
}
