// Recovered from the surviving frontend bundle; local variable names are not original.
import { useParams, useNavigate, React, useMutation, apiClient, jsxRuntime, On, Link, gr, bd, Ss, Ke } from './runtime.js';
function ResetPasswordPage() {
  const {
      token: t
    } = useParams(),
    e = useNavigate(),
    [n, i] = React.useState(!1),
    [r, l] = React.useState(!1),
    [o, d] = React.useState(""),
    [f, p] = React.useState(""),
    [m, x] = React.useState(!1),
    w = useMutation({
      mutationFn: async k => (await apiClient.post("/auth/reset-password", k)).data,
      onSuccess: () => {
        x(!0), setTimeout(() => {
          e("/login");
        }, 3e3);
      }
    }),
    _ = k => {
      k.preventDefault(), o === f && (o.length < 8 || t && w.mutate({
        token: t,
        newPassword: o
      }));
    };
  return m ? jsxRuntime.jsx("div", {
    className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
    children: jsxRuntime.jsxs("div", {
      className: "bg-white rounded-lg shadow-md p-8 max-w-md w-full",
      children: [jsxRuntime.jsxs("div", {
        className: "text-center mb-6",
        children: [jsxRuntime.jsx(On, {
          className: "w-16 h-16 text-green-600 mx-auto mb-4"
        }), jsxRuntime.jsx("h2", {
          className: "text-2xl font-bold text-gray-900 mb-2",
          children: "Đặt lại mật khẩu thành công!"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600",
          children: "Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển đến trang đăng nhập trong giây lát..."
        })]
      }), jsxRuntime.jsx(Link, {
        to: "/login",
        className: "block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
        children: "Đăng nhập ngay"
      })]
    })
  }) : jsxRuntime.jsx("div", {
    className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
    children: jsxRuntime.jsxs("div", {
      className: "bg-white rounded-lg shadow-md p-8 max-w-md w-full",
      children: [jsxRuntime.jsxs("div", {
        className: "mb-6",
        children: [jsxRuntime.jsx("h2", {
          className: "text-2xl font-bold text-gray-900 mb-2",
          children: "Đặt lại mật khẩu"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600",
          children: "Nhập mật khẩu mới của bạn."
        })]
      }), jsxRuntime.jsxs("form", {
        onSubmit: _,
        className: "space-y-4",
        children: [jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("label", {
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Mật khẩu mới"
          }), jsxRuntime.jsxs("div", {
            className: "relative",
            children: [jsxRuntime.jsx(gr, {
              className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            }), jsxRuntime.jsx("input", {
              type: n ? "text" : "password",
              value: o,
              onChange: k => d(k.target.value),
              className: "w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              placeholder: "••••••••",
              required: !0,
              minLength: 8
            }), jsxRuntime.jsx("button", {
              type: "button",
              onClick: () => i(!n),
              className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
              children: n ? jsxRuntime.jsx(bd, {
                className: "w-5 h-5"
              }) : jsxRuntime.jsx(Ss, {
                className: "w-5 h-5"
              })
            })]
          }), jsxRuntime.jsx("p", {
            className: "text-xs text-gray-500 mt-1",
            children: "Ít nhất 8 ký tự"
          })]
        }), jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("label", {
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Xác nhận mật khẩu mới"
          }), jsxRuntime.jsxs("div", {
            className: "relative",
            children: [jsxRuntime.jsx(gr, {
              className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            }), jsxRuntime.jsx("input", {
              type: r ? "text" : "password",
              value: f,
              onChange: k => p(k.target.value),
              className: "w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              placeholder: "••••••••",
              required: !0,
              minLength: 8
            }), jsxRuntime.jsx("button", {
              type: "button",
              onClick: () => l(!r),
              className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
              children: r ? jsxRuntime.jsx(bd, {
                className: "w-5 h-5"
              }) : jsxRuntime.jsx(Ss, {
                className: "w-5 h-5"
              })
            })]
          })]
        }), o && f && o !== f && jsxRuntime.jsx("div", {
          className: "p-3 bg-yellow-50 border border-yellow-200 rounded-lg",
          children: jsxRuntime.jsx("p", {
            className: "text-sm text-yellow-600",
            children: "Mật khẩu xác nhận không khớp"
          })
        }), w.isError && jsxRuntime.jsx("div", {
          className: "p-3 bg-red-50 border border-red-200 rounded-lg",
          children: jsxRuntime.jsx("p", {
            className: "text-sm text-red-600",
            children: w.error?.response?.data?.message || "Link đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu link mới."
          })
        }), jsxRuntime.jsx("button", {
          type: "submit",
          disabled: w.isPending || o !== f || o.length < 8,
          className: "w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2",
          children: w.isPending ? jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [jsxRuntime.jsx(Ke, {
              className: "w-5 h-5 animate-spin"
            }), "Đang đặt lại..."]
          }) : "Đặt lại mật khẩu"
        })]
      }), jsxRuntime.jsxs("div", {
        className: "mt-6 text-center space-y-2",
        children: [jsxRuntime.jsx(Link, {
          to: "/login",
          className: "block text-sm text-indigo-600 hover:text-indigo-700",
          children: "Về trang đăng nhập"
        }), jsxRuntime.jsx(Link, {
          to: "/forgot-password",
          className: "block text-sm text-gray-600 hover:text-gray-700",
          children: "Yêu cầu link mới"
        })]
      })]
    })
  });
}
export { ResetPasswordPage };
