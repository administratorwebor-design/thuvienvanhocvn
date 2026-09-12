// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, apiClient, jsxRuntime, dw } from './runtime.js';
function AuthProvider({
  children: t
}) {
  const [e, n] = React.useState(null),
    [i, r] = React.useState(localStorage.getItem("token")),
    [l, o] = React.useState(!0);
  React.useEffect(() => {
    (async () => {
      const w = localStorage.getItem("token"),
        _ = localStorage.getItem("user");
      if (w && _) {
        try {
          r(w), n(JSON.parse(_));
          const k = await apiClient.get("/auth/me");
          n(k.data.user), localStorage.setItem("user", JSON.stringify(k.data.user));
        } catch {
          p();
        }
      }
      o(!1);
    })();
  }, []);
  const d = async (x, w) => {
      const _ = await apiClient.post("/auth/login", {
          username: x,
          password: w
        }),
        {
          token: k,
          user: E
        } = _.data;
      r(k), n(E), localStorage.setItem("token", k), localStorage.setItem("user", JSON.stringify(E));
    },
    f = async (x, w) => {
      const _ = await apiClient.post("/auth/login", {
          username: x,
          password: w
        }),
        {
          token: k,
          user: E
        } = _.data;
      if (E.role !== "admin") throw new Error("Chỉ admin mới có thể đăng nhập vào trang quản trị");
      r(k), n(E), localStorage.setItem("token", k), localStorage.setItem("user", JSON.stringify(E));
    },
    p = () => {
      r(null), n(null), localStorage.removeItem("token"), localStorage.removeItem("user");
    },
    m = e?.role === "admin";
  return jsxRuntime.jsx(dw.Provider, {
    value: {
      user: e,
      token: i,
      login: d,
      loginAdmin: f,
      logout: p,
      isLoading: l,
      isAdmin: m
    },
    children: l ? jsxRuntime.jsx("div", { role: "status", className: "min-h-screen flex items-center justify-center text-blue-600", children: "Đang tải thư viện…" }) : t
  });
}
export { AuthProvider };
