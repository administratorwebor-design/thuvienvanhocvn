// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { useNavigate, Vs, React, jsxRuntime, Link, nn, bd, Ss, Ke } from './runtime.js';
function LoginPage() {
  const {
      login: t
    } = useAuth(),
    e = useNavigate(),
    n = Vs(),
    [i, r] = React.useState(!1),
    [l, o] = React.useState(""),
    [d, f] = React.useState(!1),
    [p, m] = React.useState({
      username: "",
      password: ""
    }),
    x = n.state?.from || "/",
    w = async _ => {
      _.preventDefault(), o(""), r(!0);
      try {
        await t(p.username, p.password), e(x, {
          replace: !0
        });
      } catch (k) {
        o(k.response?.data?.error || "Đăng nhập thất bại");
      } finally {
        r(!1);
      }
    };
  return jsxRuntime.jsx("div", {
    className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4",
    children: jsxRuntime.jsxs("div", {
      className: "sm:mx-auto sm:w-full sm:max-w-md",
      children: [jsxRuntime.jsxs(Link, {
        to: "/",
        className: "flex items-center justify-center gap-3 mb-8",
        children: [jsxRuntime.jsx("div", {
          className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg",
          children: jsxRuntime.jsx(nn, {
            className: "w-8 h-8 text-white"
          })
        }), jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("h1", {
            className: "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
            children: "Thư Viện Số Văn Học"
          }), jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500 font-medium",
            children: "Văn học trực tuyến"
          })]
        })]
      }), jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-sm p-8",
        children: [jsxRuntime.jsx("h2", {
          className: "text-2xl font-bold text-center text-gray-900 mb-6",
          children: "Đăng nhập"
        }), l && jsxRuntime.jsx("div", {
          className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm",
          children: l
        }), jsxRuntime.jsxs("form", {
          onSubmit: w,
          className: "space-y-4",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Tên đăng nhập"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: p.username,
              onChange: _ => m({
                ...p,
                username: _.target.value
              }),
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "username",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center justify-between mb-1",
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700",
                children: "Mật khẩu"
              }), jsxRuntime.jsx(Link, {
                to: "/forgot-password",
                className: "text-xs text-blue-600 hover:text-blue-700 hover:underline",
                children: "Quên mật khẩu?"
              })]
            }), jsxRuntime.jsxs("div", {
              className: "relative",
              children: [jsxRuntime.jsx("input", {
                type: d ? "text" : "password",
                value: p.password,
                onChange: _ => m({
                  ...p,
                  password: _.target.value
                }),
                className: "w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                placeholder: "••••••••",
                required: !0
              }), jsxRuntime.jsx("button", {
                type: "button",
                onClick: () => f(!d),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",
                children: d ? jsxRuntime.jsx(bd, {
                  className: "w-5 h-5"
                }) : jsxRuntime.jsx(Ss, {
                  className: "w-5 h-5"
                })
              })]
            })]
          }), jsxRuntime.jsxs("button", {
            type: "submit",
            disabled: i,
            className: "w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50",
            children: [i && jsxRuntime.jsx(Ke, {
              className: "w-4 h-4 animate-spin"
            }), "Đăng nhập"]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "mt-6 text-center text-sm text-gray-600",
          children: ["Chưa có tài khoản?", " ", jsxRuntime.jsx(Link, {
            to: "/register",
            className: "text-blue-600 hover:underline font-medium",
            children: "Đăng ký ngay"
          })]
        })]
      })]
    })
  });
}
export { LoginPage };
