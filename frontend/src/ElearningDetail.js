// Recovered from the surviving frontend bundle; local variable names are not original.
import { useParams, useNavigate, React, useQuery, apiClient, jsxRuntime, Ke, Link, Ti, gr } from './runtime.js';
import { useAuth } from './useAuth.js';
function ElearningDetail() {
  const {
      id: t
    } = useParams(),
    {
      user: e
    } = useAuth(),
    n = useNavigate(),
    [i, r] = React.useState(null);
  React.useEffect(() => {
    e || n("/login", {
      state: {
        from: `/elearning/${t}`
      }
    });
  }, [e, n, t]);
  const {
    data: l,
    isLoading: o,
    error: d
  } = useQuery({
    queryKey: ["elearning", t],
    queryFn: async () => (await apiClient.get(`/elearnings/${t}`)).data.elearning,
    enabled: !!e
  });
  return React.useEffect(() => {
    (l?.storyPath || l?.url) && r(l.storyPath || l.url);
  }, [l]), e ? o ? jsxRuntime.jsx("div", {
    className: "flex justify-center py-12",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-green-600"
    })
  }) : d || !l ? jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: [jsxRuntime.jsx("h2", {
      className: "text-xl font-semibold text-gray-900 mb-2",
      children: "Không tìm thấy bài giảng"
    }), jsxRuntime.jsxs(Link, {
      to: "/elearnings",
      className: "inline-flex items-center gap-2 text-blue-600 hover:underline",
      children: [jsxRuntime.jsx(Ti, {
        className: "w-4 h-4"
      }), " Quay lại danh sách"]
    })]
  }) : jsxRuntime.jsxs("div", {
    className: "min-h-screen bg-gray-100",
    children: [jsxRuntime.jsx("div", {
      className: "bg-white shadow-sm",
      children: jsxRuntime.jsx("div", {
        className: "max-w-7xl mx-auto px-4 py-4",
        children: jsxRuntime.jsxs("div", {
          className: "flex items-center gap-4",
          children: [jsxRuntime.jsx(Link, {
            to: "/elearnings",
            className: "p-2 hover:bg-gray-100 rounded-lg transition",
            children: jsxRuntime.jsx(Ti, {
              className: "w-5 h-5"
            })
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("p", {
              className: "text-sm text-green-600 font-medium",
              children: l.category?.name
            }), jsxRuntime.jsx("h1", {
              className: "text-xl font-bold text-gray-900",
              children: l.title
            })]
          })]
        })
      })
    }), jsxRuntime.jsx("div", {
      className: "p-4",
      children: i ? jsxRuntime.jsx("div", {
        className: "bg-white rounded-xl shadow-sm overflow-hidden",
        children: jsxRuntime.jsx("iframe", {
          src: i,
          sandbox: "allow-scripts allow-forms allow-popups",
          title: l.title,
          className: "w-full",
          style: {
            height: "calc(100vh - 180px)"
          },
          allowFullScreen: !0
        })
      }) : jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-sm p-8 text-center",
        children: [jsxRuntime.jsx(Ke, {
          className: "w-8 h-8 animate-spin text-green-600 mx-auto mb-4"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600",
          children: "Đang tải bài giảng..."
        })]
      })
    })]
  }) : jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: [jsxRuntime.jsx(gr, {
      className: "w-16 h-16 text-gray-300 mx-auto mb-4"
    }), jsxRuntime.jsx("h2", {
      className: "text-xl font-semibold text-gray-900 mb-2",
      children: "Yêu cầu đăng nhập"
    }), jsxRuntime.jsx("p", {
      className: "text-gray-600 mb-4",
      children: "Bạn cần đăng nhập để xem bài giảng này"
    }), jsxRuntime.jsx(Link, {
      to: "/login",
      className: "inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
      children: "Đăng nhập"
    })]
  });
}
export { ElearningDetail };
