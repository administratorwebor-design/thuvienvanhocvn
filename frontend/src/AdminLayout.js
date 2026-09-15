// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { jsxRuntime, Ke, rx, E5, wS } from './runtime.js';
function AdminLayout() {
  const {
    user: t,
    isLoading: e,
    isAdmin: n
  } = useAuth();
  return e ? jsxRuntime.jsx("div", {
    className: "min-h-screen flex items-center justify-center bg-gray-100",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-blue-600"
    })
  }) : !t || !n ? jsxRuntime.jsx(rx, {
    to: "/admin/login",
    replace: !0
  }) : jsxRuntime.jsxs("div", {
    className: "min-h-screen bg-gray-100",
    children: [jsxRuntime.jsx(E5, {}), jsxRuntime.jsx("div", {
      className: "lg:pl-64",
      children: jsxRuntime.jsxs("main", {
        className: "p-6",
        children: [jsxRuntime.jsxs("nav", { className: "class-banner", children: [jsxRuntime.jsx("a",{href:"/admin/classes",children:"Toàn bộ lớp học"}),jsxRuntime.jsx("a",{href:"/admin/teachers",children:"Tài khoản giáo viên"}),jsxRuntime.jsx("a",{href:"/admin/ai-settings",children:"Cài đặt trợ lý AI"})] }), jsxRuntime.jsx(wS, {})]
      })
    })]
  });
}
export { AdminLayout };
