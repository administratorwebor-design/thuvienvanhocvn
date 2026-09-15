import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./support.mjs";
import { createStore } from "../backend/store.js";
test("Teacher ownership, enrollment, assigned learning, grading, handover and revocation", async () => {
  const s = await startTestServer({ classrooms: true });
  try {
    const request = s.request,
      admin = s.adminToken;
    const makeTeacher = async (username) => {
      const r = await request(
        "POST",
        "/teachers",
        { username, fullName: username, password: "TeacherTest!2026" },
        admin,
      );
      assert.equal(r.status, 201);
      return {
        ...r.data.teacher,
        token: (
          await request("POST", "/auth/login", {
            username,
            password: "TeacherTest!2026",
          })
        ).data.token,
      };
    };
    const a = await makeTeacher("teacher-a"),
      b = await makeTeacher("teacher-b");
    await request("POST", "/auth/register", {
      username: "class-student",
      password: "StudentTest!2026",
      fullName: "Student",
    });
    const login = await request("POST", "/auth/login", {
        username: "class-student",
        password: "StudentTest!2026",
      }),
      student = login.data.token,
      studentId = login.data.user._id;
    assert.equal(
      (
        await request(
          "POST",
          "/teachers",
          { username: "forged", password: "TeacherTest!2026" },
          student,
        )
      ).status,
      403,
    );
    assert.equal(
      (await request("GET", "/quizzes", undefined, student)).data.quizzes
        .length,
      1,
    );
    assert.equal(
      (
        await request(
          "POST",
          `/quizzes/${s.fixtures.quiz._id}/start`,
          {},
          student,
        )
      ).status,
      200,
    );
    const c = (
      await request(
        "POST",
        "/classes",
        { name: "6A", schoolYear: "2026–2027" },
        a.token,
      )
    ).data.classroom;
    assert.equal(
      (await request("GET", "/classes/" + c._id, undefined, b.token)).status,
      403,
    );
    assert.equal(
      (await request("POST", "/classes/join", { code: c.joinCode }, student))
        .status,
      201,
    );
    assert.equal(
      (await request("POST", "/classes/join", { code: c.joinCode }, student))
        .status,
      409,
    );
    assert.equal(
      (await request("GET", "/classes/" + c._id, undefined, student)).status,
      403,
    );
    assert.equal(
      (
        await request(
          "PATCH",
          `/classes/${c._id}/members/${studentId}`,
          { status: "approved" },
          b.token,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await request(
          "PATCH",
          `/classes/${c._id}/members/${studentId}`,
          { status: "approved" },
          a.token,
        )
      ).status,
      200,
    );
    const assign = async (kind) => {
      const r = await request(
        "POST",
        `/classes/${c._id}/assignments`,
        {
          kind,
          resourceId:
            kind === "quizzes" ? s.fixtures.quiz._id : s.fixtures.story._id,
          maxAttempts: 2,
        },
        a.token,
      );
      assert.equal(r.status, 201);
      return r.data.assignment;
    };
    const story = await assign("storybooks"),
      quiz = await assign("quizzes");
    assert.equal(
      (
        await request(
          "GET",
          `/storybooks/${s.fixtures.story._id}`,
          undefined,
          student,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await request(
          "POST",
          `/assignments/${story._id}/activity`,
          { type: "open" },
          student,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await request(
          "POST",
          `/assignments/${story._id}/activity`,
          { type: "complete" },
          student,
        )
      ).status,
      200,
    );
    const detail = await request(
      "GET",
      "/assignments/" + quiz._id,
      undefined,
      student,
    );
    assert.doesNotMatch(
      JSON.stringify(detail.data),
      /"(isCorrect|correctAnswer|explanation)"/,
    );
    const start = await request(
      "POST",
      `/assignments/${quiz._id}/start`,
      {},
      student,
    );
    assert.equal(start.status, 200);
    const again = await request(
      "POST",
      `/assignments/${quiz._id}/start`,
      {},
      student,
    );
    assert.equal(again.data.deadline, start.data.deadline);
    // Editing the source after assignment must not change this paper's marking key.
    const store = createStore(s.env.DATA_DIR),
      db = store.readDb();
    db.quizzes
      .find((q) => q._id === s.fixtures.quiz._id)
      .questions[0].options.reverse();
    store.writeDb(db);
    store.close();
    const body = {
      attemptId: start.data.attemptId,
      answers: { "q-mc": "a", "q-essay": "Em cần trung thực." },
    };
    const submit = await request(
      "POST",
      `/assignments/${quiz._id}/submit`,
      body,
      student,
    );
    assert.equal(submit.status, 201);
    const r = submit.data.result;
    assert.equal(r.mcScore, 1);
    assert.equal(r.publishedAt, null);
    assert.equal(
      (await request("POST", `/assignments/${quiz._id}/submit`, body, student))
        .status,
      409,
    );
    assert.equal(
      (
        await request(
          "PATCH",
          `/class-results/${r._id}/grade`,
          { essayGrades: [] },
          b.token,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await request(
          "PATCH",
          `/class-results/${r._id}/grade`,
          {
            essayGrades: [{ questionId: "q-essay", points: 3 }],
            publish: true,
          },
          a.token,
        )
      ).status,
      400,
    );
    const grade = {
      essayGrades: [
        { questionId: "q-essay", points: 2, feedback: "Đúng, có liên hệ." },
      ],
      publish: false,
    };
    assert.equal(
      (await request("PATCH", `/class-results/${r._id}/grade`, grade, a.token))
        .status,
      200,
    );
    const pending = (
      await request("GET", "/assignments/" + quiz._id, undefined, student)
    ).data.results[0];
    assert.equal(pending.totalScore, 1);
    assert.equal(pending.answers[1].essayGrade, undefined);
    assert.equal(pending.answers[1].explanation, undefined);
    const globalPending = await request('GET', `/quizzes/my-results/${r._id}`, undefined, student);
    assert.equal(globalPending.data.result.totalScore, 1);
    assert.equal(globalPending.data.result.answers[1].essayGrade, undefined);
    assert.equal(
      (
        await request(
          "PATCH",
          `/class-results/${r._id}/grade`,
          { ...grade, publish: true },
          a.token,
        )
      ).data.result.totalScore,
      3,
    );
    const final = (
      await request("GET", "/assignments/" + quiz._id, undefined, student)
    ).data.results[0];
    assert.equal(final.totalScore, 3);
    assert.ok(final.publishedAt);
    assert.equal((await request('GET', `/quizzes/my-results/${r._id}`, undefined, student)).data.result.totalScore, 3);
    const csv = await fetch(s.base + `/api/classes/${c._id}/grades.csv`, {
      headers: { Authorization: "Bearer " + a.token },
    });
    assert.equal(csv.status, 200);
    assert.match(await csv.text(), /class-student/);
    const next = (
      await request("POST", `/assignments/${quiz._id}/start`, {}, student)
    ).data;
    assert.notEqual(next.attemptId, start.data.attemptId);
    assert.equal(
      (
        await request(
          "PATCH",
          "/classes/" + c._id,
          { teacherId: b._id },
          a.token,
        )
      ).status,
      403,
    );
    assert.equal(
      (await request("PATCH", "/classes/" + c._id, { teacherId: b._id }, admin))
        .status,
      200,
    );
    assert.equal(
      (await request("GET", "/classes/" + c._id, undefined, a.token)).status,
      403,
    );
    assert.equal(
      (await request("GET", "/classes/" + c._id, undefined, b.token)).data
        .results.length,
      1,
    );
    assert.equal(
      (await request("DELETE", "/admin/users/" + b._id, undefined, admin))
        .status,
      400,
    );
    assert.equal(
      (await request("PATCH", "/teachers/" + b._id, { isLocked: true }, admin))
        .status,
      200,
    );
    assert.equal(
      (await request("GET", "/classes", undefined, b.token)).status,
      401,
    );
    assert.equal(
      (await request("GET", "/assignments/" + quiz._id, undefined, student))
        .status,
      403,
    );
    await request("PATCH", "/teachers/" + b._id, { isLocked: false }, admin);
    assert.equal(
      (await request("GET", "/classes", undefined, b.token)).status,
      401,
    );
    await request("PATCH", "/classes/" + c._id, { teacherId: a._id }, admin);
    assert.equal(
      (
        await request(
          "PATCH",
          `/classes/${c._id}/members/${studentId}`,
          { status: "removed" },
          a.token,
        )
      ).status,
      200,
    );
    assert.equal(
      (await request("GET", "/assignments/" + quiz._id, undefined, student))
        .status,
      403,
    );
    assert.equal(
      (await request("GET", "/classes/" + c._id, undefined, a.token)).data
        .results.length,
      1,
    );
    assert.equal(
      (
        await request(
          "GET",
          `/storybooks/${s.fixtures.story._id}`,
          undefined,
          student,
        )
      ).status,
      200,
    );
    // Rejoining does not erase previous work; a peer must not receive this student's results.
    await request("POST", "/auth/register", {
      username: "peer-student",
      password: "PeerTest!2026",
    });
    const peerLogin = (
      await request("POST", "/auth/login", {
        username: "peer-student",
        password: "PeerTest!2026",
      })
    ).data;
    await request(
      "POST",
      "/classes/join",
      { code: c.joinCode },
      peerLogin.token,
    );
    await request(
      "PATCH",
      `/classes/${c._id}/members/${peerLogin.user._id}`,
      { status: "approved" },
      a.token,
    );
    assert.equal(
      (
        await request(
          "GET",
          "/assignments/" + quiz._id,
          undefined,
          peerLogin.token,
        )
      ).data.results.length,
      0,
    );
    assert.equal(
      (
        await request(
          "POST",
          `/assignments/${quiz._id}/submit`,
          body,
          peerLogin.token,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await request(
          "POST",
          `/assignments/${story._id}/activity`,
          { type: "progress", position: 2, total: 6, unit: "pages" },
          peerLogin.token,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await request(
          "POST",
          `/assignments/${story._id}/activity`,
          { type: "progress", position: 99, total: 6, unit: "pages" },
          peerLogin.token,
        )
      ).status,
      400,
    );
    const deadlineStore = createStore(s.env.DATA_DIR),
      timed = deadlineStore.readDb();
    timed.assignments.find((x) => x._id === quiz._id).dueAt = new Date(
      Date.now() - 1000,
    ).toISOString();
    deadlineStore.writeDb(timed);
    deadlineStore.close();
    assert.equal(
      (
        await request(
          "POST",
          `/assignments/${quiz._id}/start`,
          {},
          peerLogin.token,
        )
      ).status,
      409,
    );
  } finally {
    await s.stop();
  }
});
test("Expired attempts count toward limits and publishing requires every essay", async () => {
  const s = await startTestServer({ classrooms: true });
  try {
    const req = s.request,
      admin = s.adminToken;
    const t = (
      await req(
        "POST",
        "/teachers",
        {
          username: "timer-teacher",
          fullName: "Teacher",
          password: "TeacherTest!2026",
        },
        admin,
      )
    ).data.teacher;
    const token = (
      await req("POST", "/auth/login", {
        username: t.username,
        password: "TeacherTest!2026",
      })
    ).data.token;
    const c = (await req("POST", "/classes", { name: "6B" }, token)).data
      .classroom;
    await req("POST", "/auth/register", {
      username: "timer-student",
      password: "StudentTest!2026",
    });
    const student = (
      await req("POST", "/auth/login", {
        username: "timer-student",
        password: "StudentTest!2026",
      })
    ).data;
    await req("POST", "/classes/join", { code: c.joinCode }, student.token);
    await req(
      "PATCH",
      `/classes/${c._id}/members/${student.user._id}`,
      { status: "approved" },
      token,
    );
    const resource = (
      await req(
        "POST",
        "/quizzes",
        {
          title: "Two essays",
          questions: [
            { id: "essay1", type: "essay", content: "Question one", points: 1 },
            { id: "essay2", type: "essay", content: "Question two", points: 1 },
          ],
        },
        admin,
      )
    ).data.quiz;
    const assign = async () =>
      (
        await req(
          "POST",
          `/classes/${c._id}/assignments`,
          { kind: "quizzes", resourceId: resource._id, maxAttempts: 1 },
          token,
        )
      ).data.assignment;
    const a = await assign(),
      started = (
        await req("POST", `/assignments/${a._id}/start`, {}, student.token)
      ).data;
    const r = (
      await req(
        "POST",
        `/assignments/${a._id}/submit`,
        {
          attemptId: started.attemptId,
          answers: { essay1: "One", essay2: "Two" },
        },
        student.token,
      )
    ).data.result;
    assert.equal(
      (
        await req(
          "PATCH",
          `/class-results/${r._id}/grade`,
          {
            essayGrades: [{ questionId: "essay1", points: 0.5 }],
            publish: true,
          },
          token,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await req(
          "PATCH",
          `/class-results/${r._id}/grade`,
          {
            essayGrades: [{ questionId: "essay1", points: 0.5 }],
            publish: false,
          },
          token,
        )
      ).data.result.isGraded,
      false,
    );
    assert.equal(
      (
        await req(
          "PATCH",
          `/class-results/${r._id}/grade`,
          { essayGrades: [{ questionId: "essay2", points: 1 }], publish: true },
          token,
        )
      ).data.result.totalScore,
      1.5,
    );
    assert.equal(
      (await req("POST", `/assignments/${a._id}/start`, {}, student.token))
        .status,
      409,
    );
    const expired = await assign(),
      attempt = (
        await req(
          "POST",
          `/assignments/${expired._id}/start`,
          {},
          student.token,
        )
      ).data;
    const store = createStore(s.env.DATA_DIR),
      db = store.readDb();
    db.classAttempts.find((x) => x._id === attempt.attemptId).deadline =
      Date.now() - 40000;
    store.writeDb(db);
    store.close();
    assert.equal(
      (
        await req(
          "POST",
          `/assignments/${expired._id}/submit`,
          { attemptId: attempt.attemptId, answers: {} },
          student.token,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await req(
          "POST",
          `/assignments/${expired._id}/start`,
          {},
          student.token,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await req(
          "POST",
          `/assignments/${expired._id}/start`,
          {},
          student.token,
        )
      ).status,
      409,
    );
  } finally {
    await s.stop();
  }
});
