// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useQueryClient, useQuery, apiClient, useMutation, jsxRuntime, eo, Ke, Jl, k3, Ss, Md, ta, Bn } from './runtime.js';
function AdminElearnings() {
  const [t, e] = React.useState(!1),
    [n, i] = React.useState(null),
    [r, l] = React.useState({
      category: "",
      title: "",
      description: "",
      file: null,
      thumbnail: null
    }),
    o = useQueryClient(),
    {
      data: d,
      isLoading: f
    } = useQuery({
      queryKey: ["elearnings"],
      queryFn: async () => (await apiClient.get("/elearnings?limit=100")).data.elearnings
    }),
    {
      data: p
    } = useQuery({
      queryKey: ["categories"],
      queryFn: async () => (await apiClient.get("/categories")).data.categories
    }),
    m = useMutation({
      mutationFn: async C => {
        const A = new FormData();
        return A.append("category", C.category), A.append("title", C.title), C.description && A.append("description", C.description), C.file && A.append("file", C.file), C.thumbnail && A.append("thumbnail", C.thumbnail), apiClient.post("/elearnings", A, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      },
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["elearnings"]
        }), k();
      }
    }),
    x = useMutation({
      mutationFn: async ({
        id: C,
        data: A
      }) => {
        const R = new FormData();
        return A.category && R.append("category", A.category), A.title && R.append("title", A.title), A.description && R.append("description", A.description), A.file && R.append("file", A.file), A.thumbnail && R.append("thumbnail", A.thumbnail), apiClient.patch(`/elearnings/${C}`, R, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      },
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["elearnings"]
        }), k();
      }
    }),
    w = useMutation({
      mutationFn: C => apiClient.delete(`/elearnings/${C}`),
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["elearnings"]
        });
      }
    }),
    _ = C => {
      C ? (i(C), l({
        category: typeof C.category == "object" ? C.category._id : C.category,
        title: C.title,
        description: C.description || "",
        file: null,
        thumbnail: null
      })) : (i(null), l({
        category: "",
        title: "",
        description: "",
        file: null,
        thumbnail: null
      })), e(!0);
    },
    k = () => {
      e(!1), i(null);
    },
    E = C => {
      C.preventDefault(), n ? x.mutate({
        id: n._id,
        data: r
      }) : m.mutate(r);
    };
  return jsxRuntime.jsxs("div", {
    className: "space-y-6",
    children: [jsxRuntime.jsxs("div", {
      className: "flex items-center justify-between",
      children: [jsxRuntime.jsx("h1", {
        className: "text-2xl font-bold text-gray-800",
        children: "Quản lý E-Learning"
      }), jsxRuntime.jsxs("button", {
        onClick: () => _(),
        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
        children: [jsxRuntime.jsx(eo, {
          className: "w-5 h-5"
        }), "Thêm mới"]
      })]
    }), jsxRuntime.jsx("div", {
      className: "bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700",
      children: jsxRuntime.jsxs("p", {
        children: [jsxRuntime.jsx("strong", {
          children: "Lưu ý:"
        }), " Upload file ZIP của bài giảng Articulate Storyline. Hệ thống sẽ tự động extract và lưu cache khi người dùng xem."]
      })
    }), jsxRuntime.jsx("div", {
      className: "bg-white rounded-xl shadow-sm overflow-hidden",
      children: f ? jsxRuntime.jsx("div", {
        className: "p-8 text-center",
        children: jsxRuntime.jsx(Ke, {
          className: "w-8 h-8 animate-spin mx-auto text-blue-600"
        })
      }) : d?.length === 0 ? jsxRuntime.jsx("div", {
        className: "p-8 text-center text-gray-500",
        children: "Chưa có bài giảng nào"
      }) : jsxRuntime.jsx("div", {
        className: "overflow-x-auto",
        children: jsxRuntime.jsxs("table", {
          className: "w-full",
          children: [jsxRuntime.jsx("thead", {
            className: "bg-gray-50 border-b border-gray-200",
            children: jsxRuntime.jsxs("tr", {
              children: [jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                children: "Tiêu đề"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                children: "Danh mục"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                children: "File ZIP"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                children: "Lượt xem"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase",
                children: "Thao tác"
              })]
            })
          }), jsxRuntime.jsx("tbody", {
            className: "divide-y divide-gray-200",
            children: d?.map(C => jsxRuntime.jsxs("tr", {
              className: "hover:bg-gray-50",
              children: [jsxRuntime.jsx("td", {
                className: "px-6 py-4",
                children: jsxRuntime.jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [C.thumbnail ? jsxRuntime.jsx("img", {
                    src: C.thumbnail,
                    alt: "",
                    className: "w-12 h-12 rounded-lg object-cover"
                  }) : jsxRuntime.jsx("div", {
                    className: "w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center",
                    children: jsxRuntime.jsx(Jl, {
                      className: "w-6 h-6 text-indigo-600"
                    })
                  }), jsxRuntime.jsxs("div", {
                    children: [jsxRuntime.jsx("p", {
                      className: "font-medium text-gray-900",
                      children: C.title
                    }), jsxRuntime.jsxs("p", {
                      className: "text-xs text-gray-500",
                      children: ["ID: ", C.extractedId]
                    })]
                  })]
                })
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 text-gray-600",
                children: typeof C.category == "object" ? C.category.name : "-"
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4",
                children: jsxRuntime.jsxs("a", {
                  href: C.zipFileUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-1 text-blue-600 hover:text-blue-800",
                  children: [jsxRuntime.jsx(k3, {
                    className: "w-4 h-4"
                  }), jsxRuntime.jsx("span", {
                    className: "text-sm",
                    children: "Download"
                  })]
                })
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4",
                children: jsxRuntime.jsxs("span", {
                  className: "flex items-center gap-1 text-gray-600",
                  children: [jsxRuntime.jsx(Ss, {
                    className: "w-4 h-4"
                  }), " ", C.viewCount]
                })
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 text-right",
                children: jsxRuntime.jsxs("div", {
                  className: "flex items-center justify-end gap-2",
                  children: [jsxRuntime.jsx("button", {
                    onClick: () => _(C),
                    className: "p-2 rounded-lg hover:bg-gray-100 text-gray-600",
                    children: jsxRuntime.jsx(Md, {
                      className: "w-4 h-4"
                    })
                  }), jsxRuntime.jsx("button", {
                    onClick: () => {
                      confirm("Bạn có chắc muốn xóa?") && w.mutate(C._id);
                    },
                    className: "p-2 rounded-lg hover:bg-red-100 text-red-600",
                    children: jsxRuntime.jsx(ta, {
                      className: "w-4 h-4"
                    })
                  })]
                })
              })]
            }, C._id))
          })]
        })
      })
    }), t && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-center justify-between p-4 border-b sticky top-0 bg-white",
          children: [jsxRuntime.jsx("h2", {
            className: "text-lg font-semibold",
            children: n ? "Sửa E-Learning" : "Thêm E-Learning mới"
          }), jsxRuntime.jsx("button", {
            onClick: k,
            className: "p-2 hover:bg-gray-100 rounded-lg",
            children: jsxRuntime.jsx(Bn, {
              className: "w-5 h-5"
            })
          })]
        }), jsxRuntime.jsxs("form", {
          onSubmit: E,
          className: "p-4 space-y-4",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Danh mục *"
            }), jsxRuntime.jsxs("select", {
              value: r.category,
              onChange: C => l({
                ...r,
                category: C.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
              required: !0,
              children: [jsxRuntime.jsx("option", {
                value: "",
                children: "Chọn danh mục"
              }), p?.map(C => jsxRuntime.jsx("option", {
                value: C._id,
                children: C.name
              }, C._id))]
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Tiêu đề *"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: r.title,
              onChange: C => l({
                ...r,
                title: C.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Mô tả"
            }), jsxRuntime.jsx("textarea", {
              value: r.description,
              onChange: C => l({
                ...r,
                description: C.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
              rows: 3
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: ["File ZIP (Articulate Storyline) ", !n && "*"]
            }), jsxRuntime.jsx("input", {
              type: "file",
              accept: ".zip",
              onChange: C => l({
                ...r,
                file: C.target.files?.[0] || null
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
              required: !n
            }), jsxRuntime.jsx("p", {
              className: "text-xs text-gray-500 mt-1",
              children: "Chỉ chấp nhận file .zip chứa story.html"
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Thumbnail"
            }), jsxRuntime.jsx("input", {
              type: "file",
              accept: "image/*",
              onChange: C => l({
                ...r,
                thumbnail: C.target.files?.[0] || null
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex justify-end gap-3 pt-4",
            children: [jsxRuntime.jsx("button", {
              type: "button",
              onClick: k,
              className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",
              children: "Hủy"
            }), jsxRuntime.jsxs("button", {
              type: "submit",
              disabled: m.isPending || x.isPending,
              className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50",
              children: [(m.isPending || x.isPending) && jsxRuntime.jsx(Ke, {
                className: "w-4 h-4 animate-spin"
              }), n ? "Cập nhật" : "Tạo mới"]
            })]
          })]
        })]
      })
    })]
  });
}
export { AdminElearnings };
