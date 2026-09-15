import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { gradeQuiz, learnerQuiz } from "./quizzes.js";
import { validatePassword } from "./accounts.js";

export const classroomsEnabled = () =>
  process.env.CLASSROOMS_ENABLED !== "false";
export const isStudent = (user) =>
  !!user && !["admin", "teacher"].includes(user.role);
const stamp = () => new Date().toISOString();
const fail = (status, message) => {
  throw Object.assign(new Error(message), { status });
};
const pickUser = (u) =>
  u && {
    _id: u._id,
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    isLocked: !!u.isLocked,
  };
const activeClass = (db, c) =>
  c &&
  c.isActive !== false &&
  db.users.some(
    (u) =>
      u._id === c.teacherId &&
      u.role === "teacher" &&
      !u.isLocked &&
      u.status !== "rejected",
  );
export const enrolledClasses = (db, user) =>
  db.classes.filter(
    (c) =>
      activeClass(db, c) &&
      db.memberships.some(
        (m) =>
          m.classId === c._id &&
          m.studentId === user?._id &&
          m.status === "approved",
      ),
  );
export function assignedResource(db, user, kind, resourceId) {
  if (!classroomsEnabled() || ["admin", "teacher"].includes(user?.role))
    return true;
  const ids = new Set(enrolledClasses(db, user).map((c) => c._id));
  return db.assignments.some(
    (a) =>
      ids.has(a.classId) &&
      a.isActive !== false &&
      a.kind === kind &&
      a.resourceId === resourceId,
  );
}
export function studentResult(result) {
  if (!result || result.publishedAt) return result;
  const answers = result.answers.map((a) =>
    a.questionType === "essay"
      ? {
          questionId: a.questionId,
          questionType: a.questionType,
          questionContent: a.questionContent,
          userAnswer: a.userAnswer,
          maxPoints: a.maxPoints,
          points: 0,
        }
      : a,
  );
  return {
    ...result,
    answers,
    results: answers,
    essayScore: 0,
    totalScore: result.mcScore,
    percentage: Math.round((result.mcScore / result.maxScore) * 100),
    isGraded: false,
    gradedAt: undefined,
  };
}
export function registerClassrooms(app, { auth, admin, readDb, writeDb }) {
  const staff = (req, res, next) =>
    ["admin", "teacher"].includes(req.user.role)
      ? next()
      : res
          .status(403)
          .json({ error: "Chỉ giáo viên hoặc quản trị viên được thực hiện." });
  const classroom = (db, id, user, manage = false) => {
    const c = db.classes.find((c) => c._id === id);
    if (!c) fail(404, "Không tìm thấy lớp.");
    if (
      user.role === "admin" ||
      (user.role === "teacher" && c.teacherId === user._id)
    )
      return c;
    if (
      manage ||
      !activeClass(db, c) ||
      !db.memberships.some(
        (m) =>
          m.classId === id &&
          m.studentId === user._id &&
          m.status === "approved",
      )
    )
      fail(403, "Bạn không có quyền truy cập lớp này.");
    return c;
  };
  const assignment = (db, id, user) => {
    const a = db.assignments.find((a) => a._id === id);
    if (!a) fail(404, "Không tìm thấy bài được giao.");
    const c = classroom(db, a.classId, user);
    if (isStudent(user) && a.isActive === false)
      fail(403, "Bài đã được thu hồi.");
    return { a, c };
  };
  const due = (a) => {
    if (a.dueAt && Date.now() > Date.parse(a.dueAt))
      fail(409, "Đã hết hạn nộp bài.");
  };
  const describeClass = (db, c) => ({
    ...c,
    teacher: pickUser(db.users.find((u) => u._id === c.teacherId)),
    studentCount: db.memberships.filter(
      (m) => m.classId === c._id && m.status === "approved",
    ).length,
    pendingCount: db.memberships.filter(
      (m) => m.classId === c._id && m.status === "pending",
    ).length,
    available: !!activeClass(db, c),
  });
  function log(db, a, user, type) {
    let event = db.classActivity.find(
      (e) => e.assignmentId === a._id && e.studentId === user._id,
    );
    if (!event) {
      event = {
        _id: randomUUID(),
        assignmentId: a._id,
        classId: a.classId,
        studentId: user._id,
        firstOpenedAt: stamp(),
        opens: 0,
      };
      db.classActivity.push(event);
    }
    event.lastSeenAt = stamp();
    if (type === "open") event.opens++;
    if (type === "complete") event.selfCompletedAt = stamp();
    return event;
  }
  app.get("/api/classroom-status", auth(), (req, res) => {
    const db = readDb();
    res.json({
      enabled: classroomsEnabled(),
      classes: enrolledClasses(db, req.user).map((c) => ({
        _id: c._id,
        name: c.name,
      })),
    });
  });
  app.get("/api/teachers", auth(), admin, (req, res) => {
    res.json({
      teachers: readDb()
        .users.filter((u) => u.role === "teacher")
        .map(pickUser),
    });
  });
  app.post("/api/teachers", auth(), admin, async (req, res) => {
    const username = String(req.body.username || "").trim(),
      fullName = String(req.body.fullName || "").trim();
    if (
      !/^[a-zA-Z0-9_.-]{3,40}$/.test(username) ||
      !fullName ||
      fullName.length > 120
    )
      fail(400, "Nhập họ tên và tên đăng nhập hợp lệ (3–40 ký tự).");
    validatePassword(req.body.password);
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const db = readDb();
    if (
      db.users.some((u) => u.username.toLowerCase() === username.toLowerCase())
    )
      fail(409, "Tên đăng nhập đã tồn tại.");
    const teacher = {
      _id: randomUUID(),
      username,
      fullName,
      passwordHash,
      role: "teacher",
      status: "approved",
      isApproved: true,
      isEmailVerified: false,
      isLocked: false,
      createdAt: stamp(),
      updatedAt: stamp(),
    };
    db.users.push(teacher);
    writeDb(db);
    res.status(201).json({ teacher: pickUser(teacher) });
  });
  app.patch("/api/teachers/:id", auth(), admin, async (req, res) => {
    let hash;
    if (req.body.password) {
      validatePassword(req.body.password);
      hash = await bcrypt.hash(req.body.password, 12);
    }
    const db = readDb(),
      t = db.users.find((u) => u._id === req.params.id && u.role === "teacher");
    if (!t) fail(404, "Không tìm thấy giáo viên.");
    if (req.body.isLocked !== undefined) {
      if (typeof req.body.isLocked !== "boolean")
        fail(400, "Trạng thái khóa không hợp lệ.");
      t.isLocked = req.body.isLocked;
      t.tokenVersion = (t.tokenVersion || 0) + 1;
    }
    if (hash) {
      t.passwordHash = hash;
      t.tokenVersion = (t.tokenVersion || 0) + 1;
    }
    t.updatedAt = stamp();
    writeDb(db);
    res.json({ teacher: pickUser(t) });
  });
  app.get("/api/classes", auth(), (req, res) => {
    const db = readDb();
    const list = db.classes.filter(
      (c) =>
        req.user.role === "admin" ||
        c.teacherId === req.user._id ||
        db.memberships.some(
          (m) => m.classId === c._id && m.studentId === req.user._id,
        ),
    );
    res.json({
      classes: list.map((c) => ({
        ...describeClass(db, c),
        joinCode: isStudent(req.user) ? undefined : c.joinCode,
        membership: db.memberships.find(
          (m) => m.classId === c._id && m.studentId === req.user._id,
        )?.status,
      })),
    });
  });
  app.post("/api/classes", auth(), staff, (req, res) => {
    const db = readDb(),
      teacherId =
        req.user.role === "teacher" ? req.user._id : req.body.teacherId;
    if (
      !db.users.some(
        (u) => u._id === teacherId && u.role === "teacher" && !u.isLocked,
      )
    )
      fail(400, "Chọn giáo viên đang hoạt động.");
    const name = String(req.body.name || "").trim();
    if (!name || name.length > 100) fail(400, "Tên lớp cần 1–100 ký tự.");
    let joinCode;
    do {
      joinCode = randomBytes(5).toString("hex").toUpperCase();
    } while (db.classes.some((c) => c.joinCode === joinCode));
    const c = {
      _id: randomUUID(),
      name,
      school: String(req.body.school || "").slice(0, 150),
      schoolYear: String(req.body.schoolYear || "").slice(0, 30),
      teacherId,
      joinCode,
      isActive: true,
      createdAt: stamp(),
    };
    db.classes.push(c);
    writeDb(db);
    res.status(201).json({ classroom: describeClass(db, c) });
  });
  app.patch("/api/classes/:id", auth(), staff, (req, res) => {
    const db = readDb(),
      c = classroom(db, req.params.id, req.user, true);
    if (req.body.teacherId !== undefined) {
      if (req.user.role !== "admin") fail(403, "Chỉ admin được bàn giao lớp.");
      if (
        !db.users.some(
          (u) =>
            u._id === req.body.teacherId && u.role === "teacher" && !u.isLocked,
        )
      )
        fail(400, "Giáo viên không hợp lệ.");
      c.teacherId = req.body.teacherId;
    }
    if (req.body.isActive !== undefined) {
      if (typeof req.body.isActive !== "boolean")
        fail(400, "Trạng thái không hợp lệ.");
      c.isActive = req.body.isActive;
    }
    if (req.body.name !== undefined) {
      if (!String(req.body.name).trim() || String(req.body.name).length > 100)
        fail(400, "Tên lớp không hợp lệ.");
      c.name = String(req.body.name).trim();
    }
    c.updatedAt = stamp();
    writeDb(db);
    res.json({ classroom: describeClass(db, c) });
  });
  app.post("/api/classes/join", auth(), (req, res) => {
    if (!isStudent(req.user)) fail(403, "Chỉ học sinh tham gia lớp bằng mã.");
    const db = readDb(),
      code = String(req.body.code || "")
        .trim()
        .toUpperCase(),
      c = db.classes.find((c) => c.joinCode === code && activeClass(db, c));
    if (!c) fail(404, "Mã lớp không đúng hoặc lớp tạm ngừng.");
    let m = db.memberships.find(
      (m) => m.classId === c._id && m.studentId === req.user._id,
    );
    if (m && ["approved", "pending"].includes(m.status))
      fail(409, "Bạn đã tham gia hoặc đang chờ duyệt lớp này.");
    if (!m) {
      m = { _id: randomUUID(), classId: c._id, studentId: req.user._id };
      db.memberships.push(m);
    }
    m.status = "pending";
    m.requestedAt = stamp();
    writeDb(db);
    res.status(201).json({ membership: m });
  });
  app.patch(
    "/api/classes/:id/members/:studentId",
    auth(),
    staff,
    (req, res) => {
      const db = readDb();
      classroom(db, req.params.id, req.user, true);
      const m = db.memberships.find(
        (m) =>
          m.classId === req.params.id && m.studentId === req.params.studentId,
      );
      if (!m) fail(404, "Không tìm thấy học sinh trong lớp.");
      if (!["approved", "rejected", "removed"].includes(req.body.status))
        fail(400, "Trạng thái không hợp lệ.");
      m.status = req.body.status;
      m.updatedAt = stamp();
      writeDb(db);
      res.json({ membership: m });
    },
  );
  app.get("/api/classes/:id", auth(), (req, res) => {
    const db = readDb(),
      c = classroom(db, req.params.id, req.user),
      manage = ["teacher", "admin"].includes(req.user.role);
    const assignments = db.assignments.filter(
      (a) => a.classId === c._id && (manage || a.isActive !== false),
    );
    res.json({
      classroom: {
        ...describeClass(db, c),
        joinCode: manage ? c.joinCode : undefined,
      },
      members: manage
        ? db.memberships
            .filter((m) => m.classId === c._id)
            .map((m) => ({
              ...m,
              student: pickUser(db.users.find((u) => u._id === m.studentId)),
            }))
        : [],
      assignments: assignments.map((a) => ({
        ...a,
        questions: undefined,
        description: undefined,
      })),
      results: db.classResults
        .filter(
          (r) => r.classId === c._id && (manage || r.user === req.user._id),
        )
        .map((r) => (manage ? r : studentResult(r))),
      activity: db.classActivity.filter(
        (e) => e.classId === c._id && (manage || e.studentId === req.user._id),
      ),
    });
  });
  app.get("/api/class-library", auth(), staff, (req, res) => {
    const db = readDb();
    res.json(
      Object.fromEntries(
        ["storybooks", "videos", "elearnings", "quizzes"].map((kind) => [
          kind,
          db[kind]
            .filter((x) => x.isActive !== false)
            .map((x) => ({ _id: x._id, title: x.title, duration: x.duration })),
        ]),
      ),
    );
  });
  app.post("/api/classes/:id/assignments", auth(), staff, (req, res) => {
    const db = readDb(),
      c = classroom(db, req.params.id, req.user, true);
    if (!activeClass(db, c)) fail(409, "Lớp đang tạm ngừng.");
    const { kind, resourceId } = req.body;
    if (!["storybooks", "videos", "elearnings", "quizzes"].includes(kind))
      fail(400, "Loại học liệu không hợp lệ.");
    const resource = db[kind].find(
      (r) => r._id === resourceId && r.isActive !== false,
    );
    if (!resource) fail(404, "Không tìm thấy học liệu.");
    const dueAt = req.body.dueAt ? new Date(req.body.dueAt) : null;
    if (
      dueAt &&
      (!Number.isFinite(dueAt.getTime()) || dueAt.getTime() <= Date.now())
    )
      fail(400, "Hạn nộp phải ở tương lai.");
    const maxAttempts = Number(req.body.maxAttempts ?? 1);
    if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 5)
      fail(400, "Số lượt làm từ 1 đến 5.");
    const a = {
      _id: randomUUID(),
      classId: c._id,
      kind,
      resourceId,
      title: resource.title,
      instructions: String(req.body.instructions || "").slice(0, 2000),
      dueAt: dueAt?.toISOString() || null,
      maxAttempts,
      isActive: true,
      createdAt: stamp(),
      createdBy: req.user._id,
    };
    if (kind === "quizzes")
      Object.assign(a, {
        questions: structuredClone(resource.questions),
        description: resource.description || "",
        duration: resource.duration || 30,
        totalPoints:
          resource.totalPoints ||
          resource.questions.reduce((s, q) => s + q.points, 0),
      });
    db.assignments.push(a);
    writeDb(db);
    res.status(201).json({ assignment: { ...a, questions: undefined } });
  });
  app.patch("/api/assignments/:id", auth(), staff, (req, res) => {
    const db = readDb(),
      { a } = assignment(db, req.params.id, req.user);
    classroom(db, a.classId, req.user, true);
    if (typeof req.body.isActive !== "boolean")
      fail(400, "Thiếu trạng thái bài giao.");
    a.isActive = req.body.isActive;
    writeDb(db);
    res.json({ success: true });
  });
  app.get("/api/assignments/:id", auth(), (req, res) => {
    const db = readDb(),
      { a, c } = assignment(db, req.params.id, req.user);
    const resource = db[a.kind].find(
      (r) => r._id === a.resourceId && r.isActive !== false,
    );
    if (!resource) fail(404, "Học liệu không còn hoạt động.");
    const manage = !isStudent(req.user);
    res.json({
      classroom: { _id: c._id, name: c.name },
      assignment: a.kind === "quizzes" && !manage ? learnerQuiz(a) : a,
      resource:
        a.kind === "quizzes"
          ? undefined
          : {
              _id: resource._id,
              title: resource.title,
              url: resource.url,
              storyPath: resource.storyPath,
              thumbnail: resource.thumbnail,
              type: resource.type,
            },
      results: db.classResults
        .filter(
          (r) =>
            r.assignmentId === a._id && (manage || r.user === req.user._id),
        )
        .map((r) => (manage ? r : studentResult(r))),
    });
  });
  app.post("/api/assignments/:id/activity", auth(), (req, res) => {
    const db = readDb(),
      { a } = assignment(db, req.params.id, req.user);
    if (!isStudent(req.user)) fail(403, "Chỉ ghi tiến độ học sinh.");
    if (
      !["open", "complete", "progress"].includes(req.body.type) ||
      a.kind === "quizzes"
    )
      fail(400, "Hoạt động không hợp lệ.");
    if (req.body.type === "progress") {
      const { position, total, unit } = req.body;
      if (
        !Number.isFinite(position) ||
        !Number.isFinite(total) ||
        position < 0 ||
        total <= 0 ||
        position > total ||
        total > 1000000 ||
        unit !== (a.kind === "videos" ? "seconds" : "pages")
      )
        fail(400, "Tiến độ không hợp lệ.");
    }
    const event = log(db, a, req.user, req.body.type);
    if (req.body.type === "progress")
      Object.assign(event, {
        position: Math.round(req.body.position),
        total: Math.round(req.body.total),
        unit: req.body.unit,
      });
    writeDb(db);
    res.json({ activity: event });
  });
  app.post("/api/assignments/:id/start", auth(), (req, res) => {
    const db = readDb(),
      { a } = assignment(db, req.params.id, req.user);
    if (!isStudent(req.user) || a.kind !== "quizzes")
      fail(403, "Chỉ học sinh làm bài kiểm tra được giao.");
    due(a);
    const results = db.classResults.filter(
      (r) => r.assignmentId === a._id && r.user === req.user._id,
    );
    if (results.length >= a.maxAttempts) fail(409, "Bạn đã hết lượt làm bài.");
    let attempt = db.classAttempts.find(
      (t) =>
        t.assignmentId === a._id &&
        t.user === req.user._id &&
        !t.submittedAt &&
        !t.expired,
    );
    if (attempt && Date.now() > attempt.deadline + 30000) {
      attempt.expired = true;
      writeDb(db);
      fail(
        409,
        "Lượt làm đã hết giờ. Bấm bắt đầu để dùng lượt tiếp theo nếu còn.",
      );
    }
    if (!attempt) {
      if (
        db.classAttempts.filter(
          (t) => t.assignmentId === a._id && t.user === req.user._id,
        ).length >= a.maxAttempts
      )
        fail(409, "Bạn đã hết lượt làm bài, kể cả lượt hết giờ.");
      attempt = {
        _id: randomUUID(),
        assignmentId: a._id,
        classId: a.classId,
        user: req.user._id,
        startedAt: Date.now(),
        deadline: Math.min(
          Date.now() + a.duration * 60000,
          a.dueAt ? Date.parse(a.dueAt) : Infinity,
        ),
      };
      db.classAttempts.push(attempt);
      writeDb(db);
    }
    res.json({ attemptId: attempt._id, deadline: attempt.deadline });
  });
  app.post("/api/assignments/:id/submit", auth(), (req, res) => {
    const db = readDb(),
      { a } = assignment(db, req.params.id, req.user);
    if (!isStudent(req.user) || a.kind !== "quizzes")
      fail(403, "Không được nộp bài này.");
    due(a);
    const attempt = db.classAttempts.find(
      (t) =>
        t._id === req.body.attemptId &&
        t.assignmentId === a._id &&
        t.user === req.user._id,
    );
    if (!attempt || attempt.submittedAt || attempt.expired)
      fail(409, "Lượt làm không hợp lệ hoặc đã nộp.");
    if (Date.now() > attempt.deadline + 30000)
      fail(409, "Lượt làm đã hết giờ.");
    const graded = gradeQuiz(a, req.body.answers);
    const r = {
      _id: randomUUID(),
      user: req.user._id,
      classId: a.classId,
      assignmentId: a._id,
      attemptId: attempt._id,
      quiz: { _id: a.resourceId, title: a.title },
      ...graded,
      submittedAt: stamp(),
      createdAt: stamp(),
      publishedAt: graded.isGraded ? stamp() : null,
    };
    attempt.submittedAt = r.submittedAt;
    db.classResults.push(r);
    log(db, a, req.user, "open");
    writeDb(db);
    res.status(201).json({ result: studentResult(r) });
  });
  app.patch("/api/class-results/:id/grade", auth(), staff, (req, res) => {
    const db = readDb(),
      r = db.classResults.find((r) => r._id === req.params.id);
    if (!r) fail(404, "Không tìm thấy bài làm.");
    classroom(db, r.classId, req.user, true);
    if (!Array.isArray(req.body.essayGrades))
      fail(400, "Nhập điểm từng câu tự luận.");
    for (const g of req.body.essayGrades) {
      const a = r.answers.find(
        (a) => a.questionId === g.questionId && a.questionType === "essay",
      );
      if (
        !a ||
        g.points === "" ||
        g.points === null ||
        !Number.isFinite(Number(g.points)) ||
        Number(g.points) < 0 ||
        Number(g.points) > a.maxPoints
      )
        fail(400, "Điểm tự luận phải nằm trong thang điểm của câu.");
      a.essayGrade = Number(g.points);
      a.points = a.essayGrade;
      a.essayFeedback = String(g.feedback || "").slice(0, 2000);
    }
    r.essayScore = r.answers
      .filter((a) => a.questionType === "essay")
      .reduce((s, a) => s + (a.essayGrade || 0), 0);
    r.totalScore = r.mcScore + r.essayScore;
    r.percentage = Math.round((r.totalScore / r.maxScore) * 100);
    r.isGraded = r.answers
      .filter((a) => a.questionType === "essay")
      .every((a) => Number.isFinite(a.essayGrade));
    if (req.body.publish && !r.isGraded)
      fail(400, "Chấm đủ câu tự luận trước khi chốt điểm.");
    r.publishedAt = req.body.publish ? stamp() : null;
    r.gradedBy = req.user._id;
    r.gradedAt = stamp();
    r.results = r.answers;
    writeDb(db);
    res.json({ result: r });
  });
  app.get("/api/classes/:id/grades.csv", auth(), staff, (req, res) => {
    const db = readDb(),
      c = classroom(db, req.params.id, req.user, true),
      cell = (v) =>
        '"' +
        String(v ?? "")
          .replace(/^[=+@-]/, "'$&")
          .replaceAll('"', '""') +
        '"';
    const rows = [
      [
        "Học sinh",
        "Tên đăng nhập",
        "Bài được giao",
        "Ngày nộp",
        "Điểm",
        "Thang điểm",
        "Trạng thái",
      ],
    ];
    for (const m of db.memberships.filter(
      (m) => m.classId === c._id && m.status === "approved",
    )) {
      const u = db.users.find((u) => u._id === m.studentId);
      for (const a of db.assignments.filter(
        (a) => a.classId === c._id && a.kind === "quizzes",
      )) {
        const results = db.classResults.filter(
          (r) => r.assignmentId === a._id && r.user === m.studentId,
        );
        if (!results.length)
          rows.push([
            u?.fullName,
            u?.username,
            a.title,
            "",
            "",
            "",
            "Chưa nộp",
          ]);
        for (const r of results)
          rows.push([
            u?.fullName,
            u?.username,
            a.title,
            r.submittedAt,
            r.publishedAt ? r.totalScore : "",
            r.maxScore,
            r.publishedAt ? "Đã chốt" : "Chờ chấm / chốt",
          ]);
      }
    }
    res.set("Content-Type", "text/csv; charset=utf-8");
    res.set("Content-Disposition", 'attachment; filename="bang-diem.csv"');
    res.send(
      "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n"),
    );
  });
  // Record AI activity only when explicitly opened from an assigned classroom task.
  if (classroomsEnabled())
    app.use("/api", auth(false), (req, res, next) => {
      if (["admin", "teacher"].includes(req.user?.role)) return next();
      let storyId = req.path.match(
        /^\/storybooks\/([^/]+)\/(chat|chat-status|generate-quiz|submit-quiz)$/,
      )?.[1];
      if (
        req.path === "/flashcards/generate" ||
        req.path === "/flashcards/save"
      )
        storyId = req.body?.storybookId;
      if (storyId && req.method === "POST" && req.user) {
        res.on("finish", () => {
          if (res.statusCode >= 400) return;
          try {
            const db = readDb();
            const wanted = req.headers["x-class-assignment"];
            const a = db.assignments.find(
              (a) =>
                a.kind === "storybooks" &&
                a.resourceId === storyId &&
                a.isActive !== false &&
                (wanted && a._id === wanted) &&
                enrolledClasses(db, req.user).some((c) => c._id === a.classId),
            );
            if (a) {
              const e = log(db, a, req.user, "open");
              e.aiInteractions = (e.aiInteractions || 0) + 1;
              writeDb(db);
            }
          } catch {
            /* A learning action should not fail because activity logging failed. */
          }
        });
      }
      next();
    });
}
