// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { useNavigate, vp, React, useQuery, apiClient, jsxRuntime, Ld, Rd, Ke, Jl, Vl, gr } from './runtime.js';
import { useCategories } from './useCategories.js';
function ElearningsPage() {
  const {
      user: t
    } = useAuth(),
    e = useNavigate(),
    [n, i] = vp(),
    [r, l] = React.useState(n.get("search") || ""),
    [o, d] = React.useState(n.get("category") || ""),
    [f, p] = React.useState(r);
  React.useEffect(() => {
    const E = setTimeout(() => p(r), 500);
    return () => clearTimeout(E);
  }, [r]), React.useEffect(() => {
    const E = new URLSearchParams();
    o && E.set("category", o), f && E.set("search", f), i(E);
  }, [o, f, i]);
  const {
      data: m
    } = useCategories(),
    {
      data: x,
      isLoading: w
    } = useQuery({
      queryKey: ["elearnings", o, f],
      queryFn: async () => {
        let E = "/elearnings?limit=50";
        return o && (E += `&category=${o}`), f && (E += `&search=${encodeURIComponent(f)}`), (await apiClient.get(E)).data;
      }
    }),
    _ = x?.elearnings,
    k = E => {
      if (!t) {
        e("/login", {
          state: {
            from: `/elearning/${E._id}`
          }
        });
        return;
      }
      e(`/elearning/${E._id}`);
    };
  return jsxRuntime.jsxs("div", {
    className: "max-w-7xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs("div", {
      className: "mb-8",
      children: [jsxRuntime.jsx("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2",
        children: "Bài Giảng E-Learning"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-600",
        children: "Bài giảng tương tác, học mọi lúc mọi nơi"
      })]
    }), jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm p-4 mb-6",
      children: [jsxRuntime.jsxs("div", {
        className: "flex flex-col md:flex-row gap-4",
        children: [jsxRuntime.jsxs("div", {
          className: "flex-1 relative",
          children: [jsxRuntime.jsx(Ld, {
            className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          }), jsxRuntime.jsx("input", {
            type: "text",
            value: r,
            onChange: E => l(E.target.value),
            placeholder: "Tìm kiếm bài giảng...",
            className: "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Rd, {
            className: "w-5 h-5 text-gray-400"
          }), jsxRuntime.jsxs("select", {
            value: o,
            onChange: E => d(E.target.value),
            className: "px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            children: [jsxRuntime.jsx("option", {
              value: "",
              children: "Tất cả danh mục"
            }), m?.map(E => jsxRuntime.jsx("option", {
              value: E._id,
              children: E.name
            }, E._id))]
          })]
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flex flex-wrap gap-2 mt-4",
        children: [jsxRuntime.jsx("button", {
          onClick: () => d(""),
          className: `px-3 py-1.5 rounded-full text-sm transition ${o ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-600 text-white"}`,
          children: "Tất cả"
        }), m?.map(E => jsxRuntime.jsx("button", {
          onClick: () => d(E._id),
          className: `px-3 py-1.5 rounded-full text-sm transition ${o === E._id ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: E.name
        }, E._id))]
      })]
    }), w ? jsxRuntime.jsx("div", {
      className: "flex justify-center py-12",
      children: jsxRuntime.jsx(Ke, {
        className: "w-8 h-8 animate-spin text-green-600"
      })
    }) : _?.length === 0 ? jsxRuntime.jsxs("div", {
      className: "text-center py-12",
      children: [jsxRuntime.jsx(Jl, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500",
        children: "Không tìm thấy bài giảng nào"
      })]
    }) : jsxRuntime.jsx("div", {
      className: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      children: _?.map(E => jsxRuntime.jsxs("div", {
        onClick: () => k(E),
        className: "bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition cursor-pointer group",
        children: [jsxRuntime.jsxs("div", {
          className: "aspect-video relative bg-gray-100",
          children: [E.thumbnail ? jsxRuntime.jsx("img", {
            src: E.thumbnail,
            alt: E.title,
            className: "w-full h-full object-cover"
          }) : jsxRuntime.jsx("div", {
            className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-500",
            children: jsxRuntime.jsx(Jl, {
              className: "w-16 h-16 text-white/80"
            })
          }), jsxRuntime.jsx("div", {
            className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center",
            children: jsxRuntime.jsx("div", {
              className: "w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition",
              children: t ? jsxRuntime.jsx(Vl, {
                className: "w-6 h-6 text-green-600 ml-1"
              }) : jsxRuntime.jsx(gr, {
                className: "w-6 h-6 text-gray-600"
              })
            })
          })]
        }), jsxRuntime.jsxs("div", {
          className: "p-4",
          children: [jsxRuntime.jsx("p", {
            className: "text-xs text-green-600 font-medium mb-1",
            children: E.category?.name
          }), jsxRuntime.jsx("h3", {
            className: "font-semibold text-gray-900 line-clamp-2 mb-1",
            children: E.title
          }), E.description && jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500 line-clamp-2",
            children: E.description
          }), !t && jsxRuntime.jsxs("p", {
            className: "text-xs text-orange-600 mt-2 flex items-center gap-1",
            children: [jsxRuntime.jsx(gr, {
              className: "w-3 h-3"
            }), " Đăng nhập để xem"]
          })]
        })]
      }, E._id))
    })]
  });
}
export { ElearningsPage };
