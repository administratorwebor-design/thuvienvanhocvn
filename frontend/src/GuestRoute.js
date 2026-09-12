// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { jsxRuntime, Ke, rx } from './runtime.js';
function GuestRoute({
  children: t,
  redirectTo: e = "/"
}) {
  const {
    user: n,
    isLoading: i
  } = useAuth();
  return i ? jsxRuntime.jsx("div", {
    className: "min-h-screen flex items-center justify-center",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-blue-600"
    })
  }) : n ? jsxRuntime.jsx(rx, {
    to: e,
    replace: !0
  }) : jsxRuntime.jsx(jsxRuntime.Fragment, {
    children: t
  });
}
export { GuestRoute };
