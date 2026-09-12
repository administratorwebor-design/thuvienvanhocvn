// Recovered from the surviving frontend bundle; local variable names are not original.
import { vp, React, useQuery, apiClient, jsxRuntime, Ld, Rd, Ke, nn, Link, Vl, Ss } from './runtime.js';
import { useCategories } from './useCategories.js';
function StorybooksPage() {
  const [t, e] = vp(),
    [n, i] = React.useState(t.get("search") || ""),
    [r, l] = React.useState(t.get("category") || ""),
    [o, d] = React.useState(n);
  React.useEffect(() => {
    const w = setTimeout(() => d(n), 500);
    return () => clearTimeout(w);
  }, [n]), React.useEffect(() => {
    const w = new URLSearchParams();
    r && w.set("category", r), o && w.set("search", o), e(w);
  }, [r, o, e]);
  const {
      data: f
    } = useCategories(),
    {
      data: p,
      isLoading: m
    } = useQuery({
      queryKey: ["storybooks", r, o],
      queryFn: async () => {
        let w = "/storybooks?limit=50";
        return r && (w += `&category=${r}`), o && (w += `&search=${encodeURIComponent(o)}`), (await apiClient.get(w)).data;
      }
    }),
    x = p?.storybooks;
  return jsxRuntime.jsxs("div", {
    className: "max-w-7xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs("div", {
      className: "mb-8",
      children: [jsxRuntime.jsx("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2",
        children: "Story Book"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-600",
        children: "Khám phá kho truyện và sách văn học phong phú"
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
            onChange: w => i(w.target.value),
            placeholder: "Tìm kiếm storybook...",
            className: "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Rd, {
            className: "w-5 h-5 text-gray-400"
          }), jsxRuntime.jsxs("select", {
            value: r,
            onChange: w => l(w.target.value),
            className: "px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            children: [jsxRuntime.jsx("option", {
              value: "",
              children: "Tất cả danh mục"
            }), f?.map(w => jsxRuntime.jsx("option", {
              value: w._id,
              children: w.name
            }, w._id))]
          })]
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flex flex-wrap gap-2 mt-4",
        children: [jsxRuntime.jsx("button", {
          onClick: () => l(""),
          className: `px-3 py-1.5 rounded-full text-sm transition ${r ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-blue-600 text-white"}`,
          children: "Tất cả"
        }), f?.map(w => jsxRuntime.jsx("button", {
          onClick: () => l(w._id),
          className: `px-3 py-1.5 rounded-full text-sm transition ${r === w._id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: w.name
        }, w._id))]
      })]
    }), m ? jsxRuntime.jsx("div", {
      className: "flex justify-center py-12",
      children: jsxRuntime.jsx(Ke, {
        className: "w-8 h-8 animate-spin text-blue-600"
      })
    }) : x?.length === 0 ? jsxRuntime.jsxs("div", {
      className: "text-center py-12",
      children: [jsxRuntime.jsx(nn, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500",
        children: "Không tìm thấy storybook nào"
      })]
    }) : jsxRuntime.jsx("div", {
      className: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      children: x?.map(w => jsxRuntime.jsxs(Link, {
        to: `/storybooks/${w._id}`,
        className: "bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group",
        children: [jsxRuntime.jsxs("div", {
          className: "aspect-[4/3] relative bg-gray-100",
          children: [w.thumbnail ? jsxRuntime.jsx("img", {
            src: w.thumbnail,
            alt: w.title,
            className: "w-full h-full object-cover"
          }) : jsxRuntime.jsx("div", {
            className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500",
            children: jsxRuntime.jsx(nn, {
              className: "w-16 h-16 text-white/80"
            })
          }), jsxRuntime.jsx("div", {
            className: "absolute top-2 right-2",
            children: jsxRuntime.jsx("span", {
              className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${w.type === "video" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`,
              children: w.type === "video" ? jsxRuntime.jsxs(jsxRuntime.Fragment, {
                children: [jsxRuntime.jsx(Vl, {
                  className: "w-3 h-3"
                }), " Video"]
              }) : jsxRuntime.jsxs(jsxRuntime.Fragment, {
                children: [jsxRuntime.jsx(nn, {
                  className: "w-3 h-3"
                }), " Flipbook"]
              })
            })
          }), jsxRuntime.jsx("div", {
            className: "absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100",
            children: jsxRuntime.jsx(Ss, {
              className: "w-8 h-8 text-white"
            })
          })]
        }), jsxRuntime.jsxs("div", {
          className: "p-4",
          children: [jsxRuntime.jsx("p", {
            className: "text-xs text-blue-600 font-medium mb-1",
            children: w.category?.name
          }), jsxRuntime.jsx("h3", {
            className: "font-semibold text-gray-900 line-clamp-2 mb-1",
            children: w.title
          }), w.author && jsxRuntime.jsxs("p", {
            className: "text-sm text-gray-500",
            children: ["Tác giả: ", w.author]
          }), w.description && jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500 line-clamp-2 mt-2",
            children: w.description
          })]
        })]
      }, w._id))
    })]
  });
}
export { StorybooksPage };
