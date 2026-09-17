import {
  React,
  useQuery,
  useMutation,
  useQueryClient,
  apiClient,
  Link,
  useParams,
  rx as Navigate,
} from "./runtime.js";
import { useAuth } from "./useAuth.js";
import { ClassroomVideo } from "./ClassroomVideo.jsx";
import { ProgressDashboard } from "./ProgressDashboard.jsx";
import { StorybookStudio } from "./StorybookStudio.jsx";
import { ClassroomQuizQuestions } from "./ClassroomQuizQuestions.jsx";
import { TeacherAssessments } from "./TeacherAssessments.jsx";
import { TeacherVideos } from "./TeacherVideos.jsx";
import { ElearningStudio } from "./ElearningStudio.jsx";
import { GradeCharts } from "./GradeCharts.jsx";
import { StoryAssistantMenu } from "./StoryAssistantMenu.js";
import "./classrooms.css";
const labels = {
  storybooks: "Storybook",
  videos: "Video",
  elearnings: "E-learning",
  quizzes: "Kiểm tra",
};
const statuses = {
  approved: "Đã vào lớp",
  pending: "Chờ duyệt",
  removed: "Đã rời lớp",
  rejected: "Không được duyệt",
};
const fmt = (v) => (v ? new Date(v).toLocaleString("vi-VN") : "Không giới hạn");
const useData = (url) =>
  useQuery({
    queryKey: ["classroom", url],
    queryFn: async () => (await apiClient.get(url)).data,
    enabled: !!url,
    retry: false,
    refetchInterval: url && /^\/(classes|assignments)\//.test(url) ? 10000 : false,
  });
function useAction() {
  const cache = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, method = "post", data }) =>
      (await apiClient[method](url, data)).data,
    onSuccess: () => cache.invalidateQueries({ queryKey: ["classroom"] }),
  });
}
function Notice({ query, action }) {
  const error = query?.error || action?.error;
  return error ? (
    <p className="class-error" role="alert">
      {error.response?.data?.error || "Không thể thực hiện. Vui lòng thử lại."}
    </p>
  ) : null;
}
function Loading({ q }) {
  return q.isLoading ? <p role="status">Đang tải…</p> : <Notice query={q} />;
}
function Field({ label, ...props }) {
  return (
    <label className="class-field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
function Frame({ title, children, wide = false }) {
  return (
    <section className={wide ? "classroom classroom-wide" : "classroom"}>
      <h1>{title}</h1>
      {children}
    </section>
  );
}

export function TeacherAccounts() {
  const q = useData("/teachers"),
    a = useAction(),
    [form, setForm] = React.useState({
      fullName: "",
      username: "",
      password: "",
    }),
    [reset, setReset] = React.useState(null),
    [password, setPassword] = React.useState("");
  return (
    <Frame title="Tài khoản giáo viên">
      <p>
        Admin cấp quyền, khóa truy cập và bàn giao lớp. Khóa giáo viên giữ
        nguyên lớp, bài làm và điểm.
      </p>
      <Notice query={q} action={a} />
      <form
        className="class-panel class-form"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await a.mutateAsync({ url: "/teachers", data: form });
            setForm({ fullName: "", username: "", password: "" });
          } catch {}
        }}
      >
        <h2>Cấp tài khoản giáo viên</h2>
        {[
          ["fullName", "Họ và tên"],
          ["username", "Tên đăng nhập"],
          ["password", "Mật khẩu ban đầu"],
        ].map(([key, label]) => (
          <Field
            key={key}
            label={label}
            required
            type={key === "password" ? "password" : "text"}
            minLength={key === "password" ? 8 : undefined}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        <button disabled={a.isPending}>Tạo tài khoản</button>
      </form>
      <div className="class-grid">
        {q.data?.teachers.map((t) => (
          <article className="class-panel" key={t._id}>
            <h2>{t.fullName}</h2>
            <p>
              {t.username} · {t.isLocked ? "Đã khóa" : "Đang hoạt động"}
            </p>
            <div className="class-actions">
              <button
                disabled={a.isPending}
                onClick={() => {
                  if (
                    confirm(
                      t.isLocked
                        ? "Mở lại tài khoản?"
                        : "Khóa quyền truy cập? Các lớp cần được bàn giao để tiếp tục hoạt động.",
                    )
                  )
                    a.mutate({
                      url: "/teachers/" + t._id,
                      method: "patch",
                      data: { isLocked: !t.isLocked },
                    });
                }}
              >
                {t.isLocked ? "Mở khóa" : "Khóa / thu hồi truy cập"}
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setReset(t);
                  setPassword("");
                }}
              >
                Đặt lại mật khẩu
              </button>
            </div>
          </article>
        ))}
      </div>
      {reset && (
        <form
          className="class-panel"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await a.mutateAsync({
                url: "/teachers/" + reset._id,
                method: "patch",
                data: { password },
              });
              setReset(null);
            } catch {}
          }}
        >
          <h2>Mật khẩu mới cho {reset.fullName}</h2>
          <Field
            label="Mật khẩu mới"
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button disabled={a.isPending}>Lưu mật khẩu</button>
          <button
            type="button"
            className="secondary"
            onClick={() => setReset(null)}
          >
            Hủy
          </button>
        </form>
      )}
    </Frame>
  );
}
export function Classrooms() {
  const { user } = useAuth(),
    staff = ["admin", "teacher"].includes(user?.role),
    q = useData(user ? "/classes" : null),
    teachers = useData(user?.role === "admin" ? "/teachers" : null),
    a = useAction();
  const [code, setCode] = React.useState(""),
    [form, setForm] = React.useState({
      name: "",
      school: "",
      schoolYear: "",
      teacherId: "",
    });
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Frame
      title={
        user.role === "admin"
          ? "Toàn bộ lớp học"
          : staff
            ? "Lớp giảng dạy"
            : "Lớp của tôi"
      }
    >
      <p>
        {staff
          ? "Quản lý học sinh, giao học liệu và chấm bài theo từng lớp."
          : "Có mã lớp? Nhập mã giáo viên cung cấp và chờ duyệt để tham gia lớp. Bạn vẫn có thể sử dụng thư viện và tự học bình thường khi chưa tham gia lớp."}
      </p>
      <Notice query={q} action={a} />
      {staff ? (
        <form
          className="class-panel class-form"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await a.mutateAsync({ url: "/classes", data: form });
              setForm({ ...form, name: "" });
            } catch {}
          }}
        >
          <h2>Tạo lớp</h2>
          <Field
            label="Tên lớp"
            value={form.name}
            required
            maxLength={100}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Field
            label="Trường"
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
          />
          <Field
            label="Năm học"
            placeholder="2026–2027"
            value={form.schoolYear}
            onChange={(e) => setForm({ ...form, schoolYear: e.target.value })}
          />
          {user.role === "admin" && (
            <label className="class-field">
              Giáo viên phụ trách
              <select
                required
                value={form.teacherId}
                onChange={(e) =>
                  setForm({ ...form, teacherId: e.target.value })
                }
              >
                <option value="">Chọn giáo viên</option>
                {teachers.data?.teachers
                  .filter((t) => !t.isLocked)
                  .map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.fullName} ({t.username})
                    </option>
                  ))}
              </select>
            </label>
          )}
          <button disabled={a.isPending}>Tạo lớp học</button>
        </form>
      ) : (
        <form
          className="class-panel class-form"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await a.mutateAsync({ url: "/classes/join", data: { code } });
              setCode("");
            } catch {}
          }}
        >
          <Field
            label="Mã tham gia lớp"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button disabled={a.isPending}>Gửi yêu cầu tham gia</button>
        </form>
      )}
      {staff && q.data && (
        <p>
          <b>{q.data.classes.length}</b> lớp ·{" "}
          <b>{q.data.classes.reduce((sum, c) => sum + c.studentCount, 0)}</b>{" "}
          lượt học sinh trong các lớp ·{" "}
          <b>{q.data.classes.reduce((sum, c) => sum + c.pendingCount, 0)}</b>{" "}
          yêu cầu chờ duyệt
        </p>
      )}
      {q.isLoading && <Loading q={q} />}
      <div className="class-grid">
        {q.data?.classes.map((c) => (
          <article className="class-panel" key={c._id}>
            <h2>{c.name}</h2>
            <p>
              {c.school} · {c.schoolYear}
            </p>
            <p>
              Giáo viên: <b>{c.teacher?.fullName || "Chưa phân công"}</b>
            </p>
            <p>
              {c.studentCount} học sinh
              {staff ? ` · ${c.pendingCount} chờ duyệt` : ""}
            </p>
            <p>
              {c.available
                ? "Đang hoạt động"
                : "Tạm ngừng / cần bàn giao giáo viên"}
            </p>
            {staff ? (
              <p>
                Mã tham gia:{" "}
                <strong className="class-code">{c.joinCode}</strong>
              </p>
            ) : (
              <p>{statuses[c.membership]}</p>
            )}
            {(staff || (c.membership === "approved" && c.available)) && (
              <Link className="class-link" to={"/classes/" + c._id}>
                Vào lớp →
              </Link>
            )}
          </article>
        ))}
      </div>
      {q.data?.classes.length === 0 && <p>Chưa có lớp học nào.</p>}
    </Frame>
  );
}

function AssignForm({ id, action }) {
  const library = useData("/class-library"),
    [kind, setKind] = React.useState("quizzes"),
    [resourceId, setResource] = React.useState(""),
    [dueAt, setDue] = React.useState(""),
    [maxAttempts, setAttempts] = React.useState(1),
    [instructions, setInstructions] = React.useState("");
  return (
    <form
      className="class-panel class-form"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await action.mutateAsync({
            url: `/classes/${id}/assignments`,
            data: {
              kind,
              resourceId,
              dueAt: dueAt ? new Date(dueAt).toISOString() : null,
              maxAttempts: Number(maxAttempts),
              instructions,
            },
          });
          setResource("");
        } catch {}
      }}
    >
      <h2>Giao bài cho lớp</h2>
      <Notice query={library} />
      <label className="class-field">
        Loại học liệu
        <select
          value={kind}
          onChange={(e) => {
            setKind(e.target.value);
            setResource("");
          }}
        >
          {Object.entries(labels).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="class-field">
        Học liệu / đề kiểm tra
        <select
          value={resourceId}
          required
          onChange={(e) => setResource(e.target.value)}
        >
          <option value="">Chọn nội dung</option>
          {library.data?.[kind]?.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>
      </label>
      <Field
        label="Hạn nộp (không bắt buộc)"
        type="datetime-local"
        value={dueAt}
        onChange={(e) => setDue(e.target.value)}
      />
      {kind === "quizzes" && (
        <Field
          label="Số lượt làm tối đa (kể cả lượt hết giờ)"
          type="number"
          min={1}
          max={5}
          required
          value={maxAttempts}
          onChange={(e) => setAttempts(e.target.value)}
        />
      )}
      <Field
        label="Yêu cầu của giáo viên"
        value={instructions}
        maxLength={2000}
        onChange={(e) => setInstructions(e.target.value)}
      />
      <button disabled={action.isPending}>Giao bài</button>
    </form>
  );
}
function GradingTable({ results, studentName, action }) {
  const [selected, setSelected] = React.useState(null);
  const rows = results.filter(r => r.answers.some(a => a.questionType === 'essay')).sort((a,b) => Number(!!a.publishedAt)-Number(!!b.publishedAt));
  const active = rows.find(r => r._id === selected);
  const editorRef=React.useRef(null);
  React.useEffect(()=>{if(selected){editorRef.current?.scrollIntoView({block:'start',behavior:'instant'});editorRef.current?.focus({preventScroll:true});}},[selected]);
  return <section>
    <h2>Chấm tự luận</h2>
    <p>Chọn bài để xem câu trả lời, cho điểm tự luận và trả kết quả cho học sinh.</p>
    {active && <section ref={editorRef} tabIndex={-1} style={{scrollMarginTop:90}} className="class-panel" aria-label="Bài làm cần chấm"><button className="secondary" onClick={()=>setSelected(null)}>Đóng bài làm</button><h3>{studentName(active.user)} · {active.quiz.title}</h3><GradeEditor key={active._id+String(active.gradedAt)} result={active} action={action} /></section>}
    <div className="class-table"><table><thead><tr><th>Học sinh / Bài kiểm tra</th><th>Trắc nghiệm</th><th>Tự luận</th><th>Tổng điểm</th><th>Thao tác</th></tr></thead>
    <tbody>{rows.map(r => <tr key={r._id}><td><strong>{studentName(r.user)}</strong><br />{r.quiz.title}<br /><small>{fmt(r.submittedAt)}</small></td><td>{r.mcScore}/{r.answers.filter(a=>a.questionType!=='essay').reduce((s,a)=>s+a.maxPoints,0)}</td><td>{r.publishedAt ? `Đã chấm · ${r.essayScore}/${r.answers.filter(a=>a.questionType==='essay').reduce((s,a)=>s+a.maxPoints,0)}` : 'Chưa chấm'}</td><td>{r.publishedAt ? `${r.totalScore}/${r.maxScore}` : 'Chờ chấm tự luận'}</td><td><button onClick={()=>setSelected(r._id)}>{r.publishedAt?'Xem bài':'Chấm bài'}</button></td></tr>)}</tbody></table></div>
    {!rows.length && <p>Chưa có bài tự luận được nộp.</p>}
  </section>;
}
function GradeEditor({ result, action }) {
  const [grades, setGrades] = React.useState(() =>
    Object.fromEntries(
      result.answers
        .filter((a) => a.questionType === "essay")
        .map((a) => [
          a.questionId,
          { points: a.essayGrade ?? "", feedback: a.essayFeedback || "" },
        ]),
    ),
  );
  const submit = (publish) =>
    action.mutate({
      url: `/class-results/${result._id}/grade`,
      method: "patch",
      data: {
        essayGrades: Object.entries(grades)
          .filter(([, g]) => g.points !== "")
          .map(([questionId, g]) => ({
            questionId,
            points: Number(g.points),
            feedback: g.feedback,
          })),
        publish,
      },
    });
  return (
    <div className="class-grade">
      <p>
        Trắc nghiệm: {result.mcScore} điểm · Tổng hiện tại: {result.totalScore}/
        {result.maxScore} ·{" "}
        {result.publishedAt ? "Đã chốt và trả bài" : "Chưa trả điểm cuối"}
      </p>
      {result.answers.map((a, i) => a.questionType === 'essay' && (
        <div className="class-answer" key={a.questionId}>
          <b>
            Câu {i + 1}: {a.questionContent}
          </b>
          <p className="preserve">Bài làm: {a.userAnswer || "(Bỏ trống)"}</p>
          {a.questionType === "essay" ? (
            <>
              <details>
                <summary>Hướng dẫn chấm</summary>
                <p>{a.explanation}</p>
              </details>
              <Field
                label={`Điểm câu ${i + 1} (tối đa ${a.maxPoints})`}
                type="number"
                min={0}
                max={a.maxPoints}
                step="0.25"
                value={grades[a.questionId].points}
                onChange={(e) =>
                  setGrades({
                    ...grades,
                    [a.questionId]: {
                      ...grades[a.questionId],
                      points: e.target.value,
                    },
                  })
                }
              />
              <Field
                label={`Nhận xét câu ${i + 1}`}
                value={grades[a.questionId].feedback}
                onChange={(e) =>
                  setGrades({
                    ...grades,
                    [a.questionId]: {
                      ...grades[a.questionId],
                      feedback: e.target.value,
                    },
                  })
                }
              />
            </>
          ) : (
            <p>
              {a.isCorrect ? "Đúng" : "Chưa đúng"} · Đáp án: {a.correctAnswer} ·{" "}
              {a.points}/{a.maxPoints}
            </p>
          )}
        </div>
      ))}
      <div className="class-actions">
        <button disabled={action.isPending} onClick={() => submit(false)}>
          Lưu chấm nháp
        </button>
        <button
          disabled={action.isPending}
          onClick={() => {
            if (confirm("Chốt điểm và trả kết quả cho học sinh?")) submit(true);
          }}
        >
          Chốt điểm và trả bài
        </button>
      </div>
    </div>
  );
}
export function ClassroomDetail() {
  const { id } = useParams(),
    { user } = useAuth(),
    q = useData(user ? "/classes/" + id : null),
    a = useAction(),
    staff = ["admin", "teacher"].includes(user?.role),
    teachers = useData(user?.role === "admin" ? "/teachers" : null),
    [tab, setTab] = React.useState("assignments"),
    [owner, setOwner] = React.useState("");
  if (!user) return <Navigate to="/login" replace />;
  if (!q.data)
    return (
      <Frame title="Lớp học">
        <Loading q={q} />
        <Link to="/classes">Về lớp của tôi</Link>
      </Frame>
    );
  const { classroom: c, members, assignments, results, activity } = q.data,
    studentName = (id) =>
      members.find((m) => m.studentId === id)?.student?.fullName || "Học sinh";
  const download = async () => {
    try {
      const r = await apiClient.get(`/classes/${id}/grades.xlsx`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(r.data),
        link = document.createElement("a");
      link.href = url;
      link.download = "bang-diem.xlsx";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      alert(e.response?.data?.error || "Không tải được bảng điểm.");
    }
  };
  return (
    <Frame title={c.name} wide>
      <Link to="/classes">← Danh sách lớp</Link>
      <p>
        {c.school} · {c.schoolYear} · Giáo viên: <b>{c.teacher?.fullName}</b>
      </p>
      {staff && (
        <p>
          Mã tham gia: <strong className="class-code">{c.joinCode}</strong> ·{" "}
          {c.studentCount} học sinh
        </p>
      )}
      <Notice query={q} action={a} />
      {staff && (
        <details className="class-panel">
          <summary>Cài đặt lớp và bàn giao</summary>
          <p>{c.available ? "Lớp đang hoạt động" : "Lớp đang tạm ngừng"}</p>
          <button
            disabled={a.isPending}
            onClick={() => {
              if (
                confirm(c.isActive ? "Tạm ngừng truy cập lớp?" : "Mở lại lớp?")
              )
                a.mutate({
                  url: "/classes/" + id,
                  method: "patch",
                  data: { isActive: !c.isActive },
                });
            }}
          >
            {c.isActive ? "Tạm ngừng lớp" : "Mở lại lớp"}
          </button>
          {user.role === "admin" && (
            <div className="class-actions">
              <label>
                Giáo viên thay thế
                <select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                >
                  <option value="">Chọn giáo viên</option>
                  {teachers.data?.teachers
                    .filter((t) => !t.isLocked && t._id !== c.teacherId)
                    .map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.fullName}
                      </option>
                    ))}
                </select>
              </label>
              <button
                disabled={!owner || a.isPending}
                onClick={() => {
                  if (confirm("Bàn giao lớp, giữ nguyên học sinh và bài làm?"))
                    a.mutate({
                      url: "/classes/" + id,
                      method: "patch",
                      data: { teacherId: owner },
                    });
                }}
              >
                Bàn giao lớp
              </button>
            </div>
          )}
        </details>
      )}
      <div className="class-workspace">
      <nav className="class-tabs class-sidebar" aria-label="Menu lớp học">
        {[
          ["assignments", "Bài được giao"],
          ...(staff
            ? [
                ["members", `Học sinh (${c.studentCount})`],
                ["activity", "Tiến độ"],
                ["grading", `Chấm tự luận (${results.filter(r => !r.publishedAt && r.answers.some(answer => answer.questionType === 'essay')).length})`],
              ]
            : []),
          ["grades", "Bảng điểm"],
          ["storybooks", "Story Book"],
          ["videos", "Video minh họa"],
          ["elearnings", "Bài giảng E-learning"],
          ["quizzes", "Kiểm tra đánh giá"],
        ].map(([key, name]) => (
          <button
            key={key}
            aria-current={tab === key ? "page" : undefined}
            className={tab === key ? "selected" : "secondary"}
            onClick={() => setTab(key)}
          >
            {name}
          </button>
        ))}
      </nav>
      <div className="class-content">
      {tab === "storybooks" && staff && <StorybookStudio classId={id} />}
      {tab === "videos" && staff && <TeacherVideos classId={id} />}
      {tab === "quizzes" && staff && <TeacherAssessments key={id} classId={id} />}
      {tab === "elearnings" && staff && <ElearningStudio key={id} classId={id} />}
      {tab === "members" && (
        <div className="class-table">
          <table>
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Tài khoản</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id}>
                  <td>{m.student?.fullName}</td>
                  <td>{m.student?.username}</td>
                  <td>{statuses[m.status]}</td>
                  <td>
                    {m.status === "pending" ? (
                      <>
                        <button
                          disabled={a.isPending}
                          onClick={() =>
                            a.mutate({
                              url: `/classes/${id}/members/${m.studentId}`,
                              method: "patch",
                              data: { status: "approved" },
                            })
                          }
                        >
                          Duyệt
                        </button>
                        <button
                          className="secondary"
                          disabled={a.isPending}
                          onClick={() =>
                            a.mutate({
                              url: `/classes/${id}/members/${m.studentId}`,
                              method: "patch",
                              data: { status: "rejected" },
                            })
                          }
                        >
                          Từ chối
                        </button>
                      </>
                    ) : (
                      m.status === "approved" && (
                        <button
                          className="secondary"
                          disabled={a.isPending}
                          onClick={() => {
                            if (
                              confirm(
                                "Đưa học sinh ra khỏi lớp? Bài làm được giữ lại.",
                              )
                            )
                              a.mutate({
                                url: `/classes/${id}/members/${m.studentId}`,
                                method: "patch",
                                data: { status: "removed" },
                              });
                          }}
                        >
                          Đưa ra khỏi lớp
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && <p>Chưa có yêu cầu tham gia.</p>}
        </div>
      )}
      {tab === "assignments" && (
        <>
          {staff && <AssignForm id={id} action={a} />}
          <div className="class-grid">
            {assignments.map((item) => (
              <article className="class-panel" key={item._id}>
                <span className="class-tag">{labels[item.kind]}</span>
                <h2>{item.title}</h2>
                <p>{item.instructions}</p>
                <p>Hạn nộp: {fmt(item.dueAt)}</p>
                {item.kind === "quizzes" && (
                  <p>Tối đa {item.maxAttempts} lượt làm</p>
                )}
                <p>{item.isActive ? "Đang giao" : "Đã thu hồi"}</p>
                {item.isActive && (
                  <Link className="class-link" to={"/assignments/" + item._id}>
                    {staff ? "Xem bài" : "Mở bài học"} →
                  </Link>
                )}
                {staff && (
                  <button
                    className="secondary"
                    disabled={a.isPending}
                    onClick={() =>
                      a.mutate({
                        url: "/assignments/" + item._id,
                        method: "patch",
                        data: { isActive: !item.isActive },
                      })
                    }
                  >
                    {item.isActive ? "Thu hồi bài" : "Giao lại"}
                  </button>
                )}
              </article>
            ))}
          </div>
          {!assignments.length && <p>Giáo viên chưa giao bài.</p>}
        </>
      )}
      {tab === "activity" && <ProgressDashboard members={members} assignments={assignments} activity={activity} results={results} />}
      {staff && tab === "grading" && <GradingTable results={results} studentName={studentName} action={a} />}
      {tab === "grades" && (
        <>
          {staff && <GradeCharts members={members} assignments={assignments} results={results} />}
          {staff && (
            <button onClick={download}>
              Tải bảng điểm Excel (.xlsx)
            </button>
          )}
          {staff && (
            <div className="class-table">
              <table>
                <thead>
                  <tr>
                    <th>Học sinh</th>
                    <th>Bài kiểm tra</th>
                    <th>Trạng thái</th>
                    <th>Điểm đã chốt</th>
                  </tr>
                </thead>
                <tbody>
                  {members
                    .filter((m) => m.status === "approved")
                    .flatMap((m) =>
                      assignments
                        .filter((item) => item.kind === "quizzes")
                        .map((item) => {
                          const submitted = results.filter(
                              (r) =>
                                r.user === m.studentId &&
                                r.assignmentId === item._id,
                            ),
                            published = submitted.filter((r) => r.publishedAt);
                          return (
                            <tr key={m._id + item._id}>
                              <td>{m.student?.fullName}</td>
                              <td>{item.title}</td>
                              <td>
                                {!submitted.length
                                  ? "Chưa nộp"
                                  : published.length === submitted.length
                                    ? "Đã chốt"
                                    : `Đã nộp ${submitted.length} lượt · Còn bài chờ chấm / chốt`}
                              </td>
                              <td>
                                {published.length
                                  ? published
                                      .map(
                                        (r) => `${r.totalScore}/${r.maxScore}`,
                                      )
                                      .join(" · ")
                                  : "—"}
                              </td>
                            </tr>
                          );
                        }),
                    )}
                </tbody>
              </table>
            </div>
          )}
          {!results.length && <p>Chưa có bài nộp.</p>}
          {results.map((r) => (
            <details className="class-panel" key={r._id}>
              <summary>
                {staff ? studentName(r.user) + " · " : ""}
                {r.quiz.title} —{" "}
                {r.publishedAt
                  ? `${r.totalScore}/${r.maxScore}`
                  : "Chờ chấm / chốt điểm"}{" "}
                · {fmt(r.submittedAt)}
              </summary>
              {staff ? (
                <GradeEditor
                  key={r._id + String(r.gradedAt)}
                  result={r}
                  action={a}
                />
              ) : (
                <ResultView result={r} />
              )}
            </details>
          ))}
        </>
      )}
      </div>
      </div>
    </Frame>
  );
}

function ResultView({ result: r }) {
  return (
    <div className="class-grade">
      <h2>
        {r.publishedAt
          ? `Đã chấm · Trắc nghiệm: ${r.mcScore} + Tự luận: ${r.essayScore} = ${r.totalScore}/${r.maxScore}`
          : `Trắc nghiệm: ${r.mcScore} điểm · Đang chờ chấm tự luận`}
      </h2>
      {r.answers.map((a, i) => (
        <div className="class-answer" key={a.questionId}>
          <b>
            Câu {i + 1}: {a.questionContent}
          </b>
          <p className="preserve">
            Bạn trả lời: {a.userAnswer || "(Bỏ trống)"}
          </p>
          {a.questionType === "multiple_choice" ? (
            <>
              <p>
                {a.isCorrect ? "Đúng" : "Chưa đúng"} · Đáp án: {a.correctAnswer}
              </p>
              <p>{a.explanation}</p>
            </>
          ) : r.publishedAt ? (
            <>
              <p>
                Điểm: {a.essayGrade}/{a.maxPoints}
              </p>
              <p>Nhận xét: {a.essayFeedback || "—"}</p>
            </>
          ) : (
            <p>Chờ giáo viên chấm và trả bài.</p>
          )}
        </div>
      ))}
    </div>
  );
}
export function ClassroomAssignment() {
  const mediaRef = React.useRef(null),
    lastProgress = React.useRef(0),
    [progressError, setProgressError] = React.useState("");
  const { id } = useParams(),
    { user } = useAuth(),
    q = useData(user ? "/assignments/" + id : null),
    action = useAction(),
    student = user && !["admin", "teacher"].includes(user.role),
    [attempt, setAttempt] = React.useState(null),
    [answers, setAnswers] = React.useState({}),
    [time, setTime] = React.useState(Date.now()),
    [result, setResult] = React.useState(null),
    [opened, setOpened] = React.useState(false);
  const assignment = q.data?.assignment;
  const progress = React.useCallback(
    (data) => {
      if (!student) return;
      if (data.unit === "seconds" && Date.now() - lastProgress.current < 9000)
        return;
      lastProgress.current = Date.now();
      apiClient
        .post(`/assignments/${id}/activity`, { type: "progress", ...data })
        .then(() => setProgressError(""))
        .catch(() =>
          setProgressError("Chưa lưu được vị trí học. Kiểm tra kết nối mạng."),
        );
    },
    [student, id],
  );
  React.useEffect(() => {
    const listener = (e) => {
      if (
        e.source === mediaRef.current?.contentWindow &&
        e.data?.type === "literature-progress"
      ) {
        const { position, total, unit } = e.data;
        progress({ position, total, unit });
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [progress]);
  React.useEffect(() => {
    setAttempt(null);
    setResult(null);
    setOpened(false);
    try {
      setAnswers(
        JSON.parse(
          localStorage.getItem(`class-draft:${user?._id}:${id}`) || "{}",
        ),
      );
    } catch {
      setAnswers({});
    }
  }, [id, user?._id]);
  React.useEffect(() => {
    const timer = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  React.useEffect(() => {
    if (!assignment || !student) return;
    apiClient.defaults.headers.common["X-Class-Assignment"] = id;
    return () => {
      delete apiClient.defaults.headers.common["X-Class-Assignment"];
    };
  }, [id, assignment, student]);
  React.useEffect(() => {
    if (assignment && student && assignment.kind !== "quizzes" && !opened) {
      setOpened(true);
      action.mutate({
        url: `/assignments/${id}/activity`,
        data: { type: "open" },
      });
    }
  }, [assignment, opened, student, id]);
  const choose = (key, value) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    try {
      localStorage.setItem(
        `class-draft:${user._id}:${id}`,
        JSON.stringify(next),
      );
    } catch {}
  };
  const submit = async () => {
    try {
      const d = await action.mutateAsync({
        url: `/assignments/${id}/submit`,
        data: { attemptId: attempt.attemptId, answers },
      });
      setResult(d.result);
      setAttempt(null);
      try {
        localStorage.removeItem(`class-draft:${user._id}:${id}`);
      } catch {}
    } catch {}
  };
  const autoSubmit = React.useRef(false);
  React.useEffect(() => {
    if (attempt && time >= attempt.deadline && !autoSubmit.current) {
      autoSubmit.current = true;
      submit();
    }
  }, [attempt, time]);
  if (!user) return <Navigate to="/login" replace />;
  if (!q.data)
    return (
      <Frame title="Bài được giao">
        <Loading q={q} />
        <Link to="/classes">Về lớp của tôi</Link>
      </Frame>
    );
  const { resource, classroom, results } = q.data;
  return (
    <Frame title={assignment.title}>
      <Link to={"/classes/" + classroom._id}>← {classroom.name}</Link>
      <p>{assignment.instructions}</p>
      <p>Hạn nộp: {fmt(assignment.dueAt)}</p>
      <Notice query={q} action={action} />
      {progressError && <p role="alert">{progressError}</p>}
      {assignment.kind !== "quizzes" ? (
        <>
          <div className="class-media">
            {assignment.kind === "videos" ? (
              <ClassroomVideo
                url={resource.url}
                title={resource.title}
                thumbnail={resource.thumbnail}
                onProgress={progress}
              />
            ) : (
              <iframe
                ref={mediaRef}
                key={id}
                title={resource.title}
                src={resource.storyPath || resource.url}
                sandbox="allow-scripts allow-forms allow-popups allow-presentation"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            )}
          </div>
          {assignment.kind === "storybooks" && (
            <StoryAssistantMenu
              storybookId={resource._id}
              storybookTitle={resource.title}
            />
          )}{" "}
          {student && (
            <button
              disabled={action.isPending}
              onClick={() =>
                action.mutate({
                  url: `/assignments/${id}/activity`,
                  data: { type: "complete" },
                })
              }
            >
              Tôi xác nhận đã học xong
            </button>
          )}
          {action.data?.activity?.selfCompletedAt && (
            <p role="status">Đã gửi xác nhận hoàn thành cho giáo viên.</p>
          )}
        </>
      ) : (
        <>
          <details className="class-panel" open>
            <summary>Ngữ liệu và yêu cầu</summary>
            <p className="preserve">{assignment.description}</p>
          </details>
          {result ? (
            <ResultView result={results.find(r => r._id === result._id) || result} />
          ) : attempt ? (
            <>
              <div className="class-timer" role="timer">
                Còn lại:{" "}
                {Math.max(0, Math.ceil((attempt.deadline - time) / 1000))} giây
              </div>
              <ClassroomQuizQuestions questions={assignment.questions} answers={answers} onAnswer={choose} />
              <button
                disabled={action.isPending}
                onClick={() => {
                  if (confirm("Nộp bài cho giáo viên?")) submit();
                }}
              >
                Nộp bài
              </button>
            </>
          ) : student ? (
            <div className="class-panel">
              <p>
                {assignment.duration} phút · {assignment.questions.length} câu ·{" "}
                {assignment.totalPoints} điểm · Tối đa {assignment.maxAttempts}{" "}
                lượt
              </p>
              <p>
                Đã nộp {results.length} lượt. Khi tải lại trang, bấm tiếp tục để
                trở lại lượt đang làm; đồng hồ không được đặt lại.
              </p>
              <button
                disabled={
                  action.isPending ||
                  results.length >= assignment.maxAttempts ||
                  (assignment.dueAt &&
                    Date.parse(assignment.dueAt) < Date.now())
                }
                onClick={async () => {
                  try {
                    const d = await action.mutateAsync({
                      url: `/assignments/${id}/start`,
                      data: {},
                    });
                    autoSubmit.current = false;
                    setAttempt(d);
                  } catch {}
                }}
              >
                Bắt đầu / tiếp tục làm bài
              </button>
            </div>
          ) : (
            <div className="class-panel">
              <p>Bản xem trước dành cho giáo viên</p>
              {assignment.questions.map((q, i) => (
                <p key={q.id}>
                  {i + 1}. {q.content}
                </p>
              ))}
            </div>
          )}
          {results.map((r) => (
            <details className="class-panel" key={r._id}>
              <summary>Bài đã nộp · {fmt(r.submittedAt)}</summary>
              <ResultView result={r} />
            </details>
          ))}
        </>
      )}
    </Frame>
  );
}
