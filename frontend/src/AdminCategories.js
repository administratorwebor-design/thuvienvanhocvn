// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useQueryClient, useQuery, apiClient, useMutation, jsxRuntime, eo, Md, ta, Bn, Ke } from './runtime.js';
function AdminCategories() {
  const [t, e] = React.useState(!1),
    [n, i] = React.useState(null),
    [r, l] = React.useState({
      name: "",
      description: ""
    }),
    o = useQueryClient(),
    {
      data: d,
      isLoading: f
    } = useQuery({
      queryKey: ["categories"],
      queryFn: async () => (await apiClient.get("/categories")).data.categories
    }),
    p = useMutation({
      mutationFn: E => apiClient.post("/categories", E),
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["categories"]
        }), _();
      }
    }),
    m = useMutation({
      mutationFn: ({
        id: E,
        data: C
      }) => apiClient.patch(`/categories/${E}`, C),
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["categories"]
        }), _();
      }
    }),
    x = useMutation({
      mutationFn: E => apiClient.delete(`/categories/${E}`),
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["categories"]
        });
      }
    }),
    w = E => {
      E ? (i(E), l({
        name: E.name,
        description: E.description || ""
      })) : (i(null), l({
        name: "",
        description: ""
      })), e(!0);
    },
    _ = () => {
      e(!1), i(null), l({
        name: "",
        description: ""
      });
    },
    k = E => {
      E.preventDefault(), n ? m.mutate({
        id: n._id,
        data: r
      }) : p.mutate(r);
    };
  return jsxRuntime.jsxs("div", {
    className: "space-y-6",
    children: [jsxRuntime.jsxs("div", {
      className: "flex items-center justify-between",
      children: [jsxRuntime.jsx("h1", {
        className: "text-2xl font-bold text-gray-800",
        children: "Quản lý danh mục"
      }), jsxRuntime.jsxs("button", {
        onClick: () => w(),
        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
        children: [jsxRuntime.jsx(eo, {
          className: "w-5 h-5"
        }), "Thêm danh mục"]
      })]
    }), jsxRuntime.jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      children: f ? [...Array(6)].map((E, C) => jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-sm p-6 animate-pulse",
        children: [jsxRuntime.jsx("div", {
          className: "h-6 bg-gray-200 rounded w-3/4 mb-2"
        }), jsxRuntime.jsx("div", {
          className: "h-4 bg-gray-200 rounded w-1/2"
        })]
      }, C)) : d?.length === 0 ? jsxRuntime.jsx("div", {
        className: "col-span-full text-center py-12 text-gray-500",
        children: "Chưa có danh mục nào"
      }) : d?.map(E => jsxRuntime.jsx("div", {
        className: "bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition",
        children: jsxRuntime.jsxs("div", {
          className: "flex items-start justify-between",
          children: [jsxRuntime.jsxs("div", {
            className: "flex-1",
            children: [jsxRuntime.jsx("h3", {
              className: "font-semibold text-gray-800",
              children: E.name
            }), jsxRuntime.jsx("p", {
              className: "text-sm text-gray-500 mt-1",
              children: E.description || "Không có mô tả"
            }), jsxRuntime.jsxs("p", {
              className: "text-xs text-gray-400 mt-2",
              children: ["Slug: ", E.slug]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center gap-1",
            children: [jsxRuntime.jsx("button", {
              onClick: () => w(E),
              className: "p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition",
              title: "Sửa",
              children: jsxRuntime.jsx(Md, {
                className: "w-4 h-4"
              })
            }), jsxRuntime.jsx("button", {
              onClick: () => {
                confirm("Bạn có chắc muốn xóa danh mục này?") && x.mutate(E._id);
              },
              className: "p-2 rounded-lg hover:bg-red-100 text-red-600 transition",
              title: "Xóa",
              children: jsxRuntime.jsx(ta, {
                className: "w-4 h-4"
              })
            })]
          })]
        })
      }, E._id))
    }), t && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-xl w-full max-w-md",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-center justify-between p-4 border-b",
          children: [jsxRuntime.jsx("h2", {
            className: "text-lg font-semibold",
            children: n ? "Sửa danh mục" : "Thêm danh mục mới"
          }), jsxRuntime.jsx("button", {
            onClick: _,
            className: "p-2 hover:bg-gray-100 rounded-lg",
            children: jsxRuntime.jsx(Bn, {
              className: "w-5 h-5"
            })
          })]
        }), jsxRuntime.jsxs("form", {
          onSubmit: k,
          className: "p-4 space-y-4",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Tên danh mục"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: r.name,
              onChange: E => l({
                ...r,
                name: E.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Nhập tên danh mục",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Mô tả"
            }), jsxRuntime.jsx("textarea", {
              value: r.description,
              onChange: E => l({
                ...r,
                description: E.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              placeholder: "Nhập mô tả (tùy chọn)",
              rows: 3
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex justify-end gap-3 pt-4",
            children: [jsxRuntime.jsx("button", {
              type: "button",
              onClick: _,
              className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition",
              children: "Hủy"
            }), jsxRuntime.jsxs("button", {
              type: "submit",
              disabled: p.isPending || m.isPending,
              className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50",
              children: [(p.isPending || m.isPending) && jsxRuntime.jsx(Ke, {
                className: "w-4 h-4 animate-spin"
              }), n ? "Cập nhật" : "Tạo mới"]
            })]
          })]
        })]
      })
    })]
  });
}
export { AdminCategories };
