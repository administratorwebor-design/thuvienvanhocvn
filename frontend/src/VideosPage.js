// Recovered from the surviving frontend bundle; local variable names are not original.
import { vp, React, useQuery, apiClient, jsxRuntime, Ld, Rd, Ke, as, Link, Vl } from './runtime.js';
import { useCategories } from './useCategories.js';
function VideosPage() {
  const [t, e] = vp(),
    [n, i] = React.useState(t.get("search") || ""),
    [r, l] = React.useState(t.get("category") || ""),
    [o, d] = React.useState(n);
  React.useEffect(() => {
    const _ = setTimeout(() => d(n), 500);
    return () => clearTimeout(_);
  }, [n]), React.useEffect(() => {
    const _ = new URLSearchParams();
    r && _.set("category", r), o && _.set("search", o), e(_);
  }, [r, o, e]);
  const {
      data: f
    } = useCategories(),
    {
      data: p,
      isLoading: m
    } = useQuery({
      queryKey: ["videos", r, o],
      queryFn: async () => {
        let _ = "/videos?limit=50";
        return r && (_ += `&category=${r}`), o && (_ += `&search=${encodeURIComponent(o)}`), (await apiClient.get(_)).data;
      }
    }),
    x = p?.videos,
    w = _ => {
      if (!_) return "";
      const k = Math.floor(_ / 60),
        E = _ % 60;
      return `${k}:${E.toString().padStart(2, "0")}`;
    };
  return jsxRuntime.jsxs("div", {
    className: "max-w-7xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs("div", {
      className: "mb-8",
      children: [jsxRuntime.jsx("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2",
        children: "Video Minh Họa"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-600",
        children: "Video bài giảng sinh động, dễ hiểu"
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
            value: n,
            onChange: _ => i(_.target.value),
            placeholder: "Tìm kiếm video...",
            className: "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Rd, {
            className: "w-5 h-5 text-gray-400"
          }), jsxRuntime.jsxs("select", {
            value: r,
            onChange: _ => l(_.target.value),
            className: "px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            children: [jsxRuntime.jsx("option", {
              value: "",
              children: "Tất cả danh mục"
            }), f?.map(_ => jsxRuntime.jsx("option", {
              value: _._id,
              children: _.name
            }, _._id))]
          })]
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flex flex-wrap gap-2 mt-4",
        children: [jsxRuntime.jsx("button", {
          onClick: () => l(""),
          className: `px-3 py-1.5 rounded-full text-sm transition ${r ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-red-600 text-white"}`,
          children: "Tất cả"
        }), f?.map(_ => jsxRuntime.jsx("button", {
          onClick: () => l(_._id),
          className: `px-3 py-1.5 rounded-full text-sm transition ${r === _._id ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: _.name
        }, _._id))]
      })]
    }), m ? jsxRuntime.jsx("div", {
      className: "flex justify-center py-12",
      children: jsxRuntime.jsx(Ke, {
        className: "w-8 h-8 animate-spin text-red-600"
      })
    }) : x?.length === 0 ? jsxRuntime.jsxs("div", {
      className: "text-center py-12",
      children: [jsxRuntime.jsx(as, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500",
        children: "Không tìm thấy video nào"
      })]
    }) : jsxRuntime.jsx("div", {
      className: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      children: x?.map(_ => jsxRuntime.jsxs(Link, {
        to: `/video/${_._id}`,
        className: "bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group",
        children: [jsxRuntime.jsxs("div", {
          className: "aspect-video relative bg-gray-100",
          children: [_.thumbnail ? jsxRuntime.jsx("img", {
            src: _.thumbnail,
            alt: _.title,
            className: "w-full h-full object-cover"
          }) : jsxRuntime.jsx("div", {
            className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500",
            children: jsxRuntime.jsx(as, {
              className: "w-16 h-16 text-white/80"
            })
          }), jsxRuntime.jsx("div", {
            className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center",
            children: jsxRuntime.jsx("div", {
              className: "w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition",
              children: jsxRuntime.jsx(Vl, {
                className: "w-6 h-6 text-red-600 ml-1"
              })
            })
          }), _.duration && jsxRuntime.jsx("span", {
            className: "absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded",
            children: w(_.duration)
          })]
        }), jsxRuntime.jsxs("div", {
          className: "p-4",
          children: [jsxRuntime.jsx("p", {
            className: "text-xs text-red-600 font-medium mb-1",
            children: _.category?.name
          }), jsxRuntime.jsx("h3", {
            className: "font-semibold text-gray-900 line-clamp-2 mb-1",
            children: _.title
          }), _.author && jsxRuntime.jsxs("p", {
            className: "text-sm text-gray-500",
            children: ["Giảng viên: ", _.author]
          })]
        })]
      }, _._id))
    })]
  });
}
export { VideosPage };
