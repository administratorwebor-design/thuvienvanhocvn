// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useMutation, apiClient, jsxRuntime, On, Link, Ti, vw, Ke } from './runtime.js';
function ForgotPasswordPage() {
  const [t, e] = React.useState(""),
    [n, i] = React.useState(!1),
    r = useMutation({
      mutationFn: async o => (await apiClient.post("/auth/forgot-password", {
        email: o
      })).data,
      onSuccess: () => {
        i(!0);
      }
    }),
    l = o => {
      o.preventDefault(), t.trim() && r.mutate(t);
    };
  return n ? jsxRuntime.jsx("div", {
    className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
    children: jsxRuntime.jsxs("div", {
      className: "bg-white rounded-lg shadow-md p-8 max-w-md w-full",
      children: [jsxRuntime.jsxs("div", {
        className: "text-center mb-6",
        children: [jsxRuntime.jsx(On, {
          className: "w-16 h-16 text-green-600 mx-auto mb-4"
        }), jsxRuntime.jsx("h2", {
          className: "text-2xl font-bold text-gray-900 mb-2",
          children: "Email đã được gửi!"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600",
          children: "Vui lòng kiểm tra email của bạn và làm theo hướng dẫn để đặt lại mật khẩu."
        }), jsxRuntime.jsx("p", {
          className: "text-sm text-gray-500 mt-4",
          children: "Link đặt lại mật khẩu có hiệu lực trong 1 giờ."
        })]
      }), jsxRuntime.jsx("div", {
        className: "space-y-3",
        children: jsxRuntime.jsxs(Link, {
          to: "/login",
          className: "flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
          children: [jsxRuntime.jsx(Ti, {
            className: "w-4 h-4"
          }), "Về trang đăng nhập"]
        })
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
          children: "Quên mật khẩu?"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600",
          children: "Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu."
        })]
      }), jsxRuntime.jsxs("form", {
        onSubmit: l,
        className: "space-y-4",
        children: [jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("label", {
            className: "block text-sm font-medium text-gray-700 mb-2",
            children: "Email"
          }), jsxRuntime.jsxs("div", {
            className: "relative",
            children: [jsxRuntime.jsx(vw, {
              className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            }), jsxRuntime.jsx("input", {
              type: "email",
              value: t,
              onChange: o => e(o.target.value),
              className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              placeholder: "example@email.com",
              required: !0
            })]
          })]
        }), r.isError && jsxRuntime.jsx("div", {
          className: "p-3 bg-red-50 border border-red-200 rounded-lg",
          children: jsxRuntime.jsx("p", {
            className: "text-sm text-red-600",
            children: r.error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
          })
        }), jsxRuntime.jsx("button", {
          type: "submit",
          disabled: r.isPending,
          className: "w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2",
          children: r.isPending ? jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [jsxRuntime.jsx(Ke, {
              className: "w-5 h-5 animate-spin"
            }), "Đang gửi..."]
          }) : "Gửi link đặt lại mật khẩu"
        })]
      }), jsxRuntime.jsx("div", {
        className: "mt-6 text-center",
        children: jsxRuntime.jsxs(Link, {
          to: "/login",
          className: "text-sm text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1",
          children: [jsxRuntime.jsx(Ti, {
            className: "w-4 h-4"
          }), "Về trang đăng nhập"]
        })
      })]
    })
  });
}
export { ForgotPasswordPage };
