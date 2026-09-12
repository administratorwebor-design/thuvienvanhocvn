// Recovered from the surviving frontend bundle; local variable names are not original.
import { useParams, useNavigate, useQuery, apiClient, React, jsxRuntime, Ke, yx, Link, On } from './runtime.js';
function VerifyEmailPage() {
  const {
      token: t
    } = useParams(),
    e = useNavigate(),
    {
      data: n,
      isLoading: i,
      isError: r,
      error: l
    } = useQuery({
      queryKey: ["verify-email", t],
      queryFn: async () => (await apiClient.get(`/auth/verify-email/${t}`)).data,
      retry: !1
    });
  return React.useEffect(() => {
    if (n?.success) {
      const o = setTimeout(() => {
        e("/profile");
      }, 3e3);
      return () => clearTimeout(o);
    }
  }, [n, e]), i ? jsxRuntime.jsx("div", {
    className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
    children: jsxRuntime.jsxs("div", {
      className: "bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center",
      children: [jsxRuntime.jsx(Ke, {
        className: "w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4"
      }), jsxRuntime.jsx("h2", {
        className: "text-2xl font-bold text-gray-900 mb-2",
        children: "Đang xác thực email..."
      }), jsxRuntime.jsx("p", {
        className: "text-gray-600",
        children: "Vui lòng đợi trong giây lát"
      })]
    })
  }) : r ? jsxRuntime.jsx("div", {
    className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
    children: jsxRuntime.jsxs("div", {
      className: "bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center",
      children: [jsxRuntime.jsx(yx, {
        className: "w-16 h-16 text-red-600 mx-auto mb-4"
      }), jsxRuntime.jsx("h2", {
        className: "text-2xl font-bold text-gray-900 mb-2",
        children: "Xác thực thất bại"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-600 mb-6",
        children: l?.response?.data?.message || "Link xác thực không hợp lệ hoặc đã hết hạn"
      }), jsxRuntime.jsxs("div", {
        className: "space-y-3",
        children: [jsxRuntime.jsx(Link, {
          to: "/profile",
          className: "block w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
          children: "Về trang cá nhân"
        }), jsxRuntime.jsx(Link, {
          to: "/",
          className: "block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors",
          children: "Về trang chủ"
        })]
      })]
    })
  }) : n?.success ? jsxRuntime.jsx("div", {
    className: "min-h-screen bg-gray-50 flex items-center justify-center p-4",
    children: jsxRuntime.jsxs("div", {
      className: "bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center",
      children: [jsxRuntime.jsx(On, {
        className: "w-16 h-16 text-green-600 mx-auto mb-4"
      }), jsxRuntime.jsx("h2", {
        className: "text-2xl font-bold text-gray-900 mb-2",
        children: "Xác thực thành công!"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-600 mb-6",
        children: "Email của bạn đã được xác thực. Bạn sẽ được chuyển đến trang cá nhân trong giây lát..."
      }), jsxRuntime.jsx(Link, {
        to: "/profile",
        className: "inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
        children: "Đi ngay"
      })]
    })
  }) : null;
}
export { VerifyEmailPage };
