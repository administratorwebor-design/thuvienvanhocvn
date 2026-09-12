// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, apiClient, jsxRuntime, On, Link, nn, bd, Ss, Ke } from './runtime.js';
function RegisterPage() {
  const [t, e] = React.useState(!1),
    [n, i] = React.useState(""),
    [r, l] = React.useState(!1),
    [o, d] = React.useState(!1),
    [f, p] = React.useState({
      username: "",
      password: "",
      fullName: "",
      email: "",
      dateOfBirth: "",
      className: "",
      school: ""
    }),
    m = async x => {
      x.preventDefault(), i(""), e(!0);
      try {
        await apiClient.post("/auth/register", f), l(!0);
      } catch (w) {
        i(w.response?.data?.error || "Đăng ký thất bại");
      } finally {
        e(!1);
      }
    };
  return r ? jsxRuntime.jsx("div", {
    className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4",
    children: jsxRuntime.jsx("div", {
      className: "sm:mx-auto sm:w-full sm:max-w-md",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-sm p-8 text-center",
        children: [jsxRuntime.jsx(On, {
          className: "w-16 h-16 text-green-500 mx-auto mb-4"
        }), jsxRuntime.jsx("h2", {
          className: "text-2xl font-bold text-gray-900 mb-2",
          children: "Đăng ký thành công!"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600 mb-6",
          children: "Tài khoản của bạn đã được tạo. Bạn có thể đăng nhập ngay."
        }), jsxRuntime.jsx(Link, {
          to: "/login",
          className: "inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium",
          children: "Về trang đăng nhập"
        })]
      })
    })
  }) : jsxRuntime.jsx("div", {
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
          children: "Đăng ký tài khoản"
        }), n && jsxRuntime.jsx("div", {
          className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm",
          children: n
        }), jsxRuntime.jsxs("form", {
          onSubmit: m,
          className: "space-y-4",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Họ và tên"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: f.fullName,
              onChange: x => p({
                ...f,
                fullName: x.target.value
              }),
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "Nguyễn Văn A",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: ["Email ", jsxRuntime.jsx("span", {
                className: "text-gray-400 text-xs",
                children: "(Tùy chọn)"
              })]
            }), jsxRuntime.jsx("input", {
              type: "email",
              value: f.email,
              onChange: x => p({
                ...f,
                email: x.target.value
              }),
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "example@email.com"
            }), jsxRuntime.jsx("p", {
              className: "text-xs text-gray-500 mt-1",
              children: "Email dùng để khôi phục mật khẩu và nhận thông báo"
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Ngày sinh"
            }), jsxRuntime.jsx("input", {
              type: "date",
              value: f.dateOfBirth,
              onChange: x => p({
                ...f,
                dateOfBirth: x.target.value
              }),
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            className: "grid grid-cols-2 gap-4",
            children: [jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Lớp"
              }), jsxRuntime.jsx("input", {
                type: "text",
                value: f.className,
                onChange: x => p({
                  ...f,
                  className: x.target.value
                }),
                className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                placeholder: "6A1",
                required: !0
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Trường"
              }), jsxRuntime.jsx("input", {
                type: "text",
                value: f.school,
                onChange: x => p({
                  ...f,
                  school: x.target.value
                }),
                className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                placeholder: "THCS ABC",
                required: !0
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Tên đăng nhập"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: f.username,
              onChange: x => p({
                ...f,
                username: x.target.value
              }),
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              placeholder: "username",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Mật khẩu"
            }), jsxRuntime.jsxs("div", {
              className: "relative",
              children: [jsxRuntime.jsx("input", {
                type: o ? "text" : "password",
                value: f.password,
                onChange: x => p({
                  ...f,
                  password: x.target.value
                }),
                className: "w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                placeholder: "••••••••",
                minLength: 8,
                required: !0
              }), jsxRuntime.jsx("button", {
                type: "button",
                onClick: () => d(!o),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",
                children: o ? jsxRuntime.jsx(bd, {
                  className: "w-5 h-5"
                }) : jsxRuntime.jsx(Ss, {
                  className: "w-5 h-5"
                })
              })]
            })]
          }), jsxRuntime.jsxs("button", {
            type: "submit",
            disabled: t,
            className: "w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50",
            children: [t && jsxRuntime.jsx(Ke, {
              className: "w-4 h-4 animate-spin"
            }), "Đăng ký"]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "mt-6 text-center text-sm text-gray-600",
          children: ["Đã có tài khoản?", " ", jsxRuntime.jsx(Link, {
            to: "/login",
            className: "text-blue-600 hover:underline font-medium",
            children: "Đăng nhập"
          })]
        })]
      })]
    })
  });
}
export { RegisterPage };
