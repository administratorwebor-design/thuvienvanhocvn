// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useNavigate, jsxRuntime, Ke, xw } from './runtime.js';
import { useAuth } from './useAuth.js';
function AdminLogin() {
  const [t, e] = React.useState(""),
    [n, i] = React.useState(""),
    [r, l] = React.useState(""),
    [o, d] = React.useState(!1),
    {
      loginAdmin: f
    } = useAuth(),
    p = useNavigate(),
    m = async x => {
      x.preventDefault(), l(""), d(!0);
      try {
        await f(t, n), p("/admin");
      } catch (w) {
        w instanceof Error ? l(w.message) : typeof w == "object" && w !== null && "response" in w ? l(w.response?.data?.error || "Đăng nhập thất bại") : l("Đăng nhập thất bại");
      } finally {
        d(!1);
      }
    };
  return jsxRuntime.jsx("div", {
    className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4",
    children: jsxRuntime.jsx("div", {
      className: "w-full max-w-md",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-2xl shadow-xl p-8",
        children: [jsxRuntime.jsxs("div", {
          className: "text-center mb-8",
          children: [jsxRuntime.jsx("h1", {
            className: "text-2xl font-bold text-gray-800",
            children: "LMS Admin Panel"
          }), jsxRuntime.jsx("p", {
            className: "text-gray-500 mt-2",
            children: "Ngữ Văn Lớp 6"
          })]
        }), jsxRuntime.jsxs("form", {
          onSubmit: m,
          className: "space-y-6",
          children: [r && jsxRuntime.jsx("div", {
            className: "p-3 rounded-lg bg-red-50 text-red-600 text-sm",
            children: r
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-2",
              children: "Tên đăng nhập"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: t,
              onChange: x => e(x.target.value),
              className: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
              placeholder: "Nhập tên đăng nhập",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-2",
              children: "Mật khẩu"
            }), jsxRuntime.jsx("input", {
              type: "password",
              value: n,
              onChange: x => i(x.target.value),
              className: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition",
              placeholder: "Nhập mật khẩu",
              required: !0
            })]
          }), jsxRuntime.jsxs("button", {
            type: "submit",
            disabled: o,
            className: "w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [o ? jsxRuntime.jsx(Ke, {
              className: "w-5 h-5 animate-spin"
            }) : jsxRuntime.jsx(xw, {
              className: "w-5 h-5"
            }), jsxRuntime.jsx("span", {
              children: "Đăng nhập"
            })]
          })]
        }), jsxRuntime.jsx("p", {
          className: "text-center text-sm text-gray-500 mt-6",
          children: "Mặc định: admin / admin123"
        })]
      })
    })
  });
}
export { AdminLogin };
