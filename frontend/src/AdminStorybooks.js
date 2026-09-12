// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useQueryClient, useQuery, apiClient, useMutation, jsxRuntime, as, t_, eo, Ke, zl, Ss, Md, ta, Bn } from './runtime.js';
function AdminStorybooks() {
  const [t, e] = React.useState(!1),
    [n, i] = React.useState(null),
    [r, l] = React.useState({
      category: "",
      title: "",
      description: "",
      author: "",
      duration: "",
      type: "video",
      url: "",
      file: null,
      thumbnail: null,
      textFile: null
    }),
    o = useQueryClient(),
    {
      data: d,
      isLoading: f
    } = useQuery({
      queryKey: ["storybooks"],
      queryFn: async () => (await apiClient.get("/storybooks?limit=100")).data.storybooks
    }),
    {
      data: p
    } = useQuery({
      queryKey: ["categories"],
      queryFn: async () => (await apiClient.get("/categories")).data.categories
    }),
    m = useMutation({
      mutationFn: async A => {
        const R = new FormData();
        return R.append("category", A.category), R.append("title", A.title), A.description && R.append("description", A.description), A.author && R.append("author", A.author), A.duration && R.append("duration", A.duration), A.textFile && R.append("textFile", A.textFile), A.type === "video" ? (A.file && R.append("file", A.file), apiClient.post("/storybooks/video", R, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })) : (R.append("url", A.url), A.thumbnail && R.append("thumbnail", A.thumbnail), apiClient.post("/storybooks/heyzine", R, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }));
      },
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["storybooks"]
        }), k();
      }
    }),
    x = useMutation({
      mutationFn: async ({
        id: A,
        data: R
      }) => {
        const L = new FormData();
        return R.category && L.append("category", R.category), R.title && L.append("title", R.title), R.description && L.append("description", R.description), R.author && L.append("author", R.author), R.duration && L.append("duration", R.duration), R.file && L.append("file", R.file), R.thumbnail && L.append("thumbnail", R.thumbnail), R.url && L.append("url", R.url), R.textFile && L.append("textFile", R.textFile), apiClient.patch(`/storybooks/${A}`, L, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      },
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["storybooks"]
        }), k();
      }
    }),
    w = useMutation({
      mutationFn: A => apiClient.delete(`/storybooks/${A}`),
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["storybooks"]
        });
      }
    }),
    _ = A => {
      A ? (i(A), l({
        category: typeof A.category == "object" ? A.category._id : A.category,
        title: A.title,
        description: A.description || "",
        author: A.author || "",
        duration: A.duration?.toString() || "",
        type: A.type,
        url: A.type === "heyzine" ? A.url : "",
        file: null,
        thumbnail: null,
        textFile: null
      })) : (i(null), l({
        category: "",
        title: "",
        description: "",
        author: "",
        duration: "",
        type: "video",
        url: "",
        file: null,
        thumbnail: null,
        textFile: null
      })), e(!0);
    },
    k = () => {
      e(!1), i(null);
    },
    E = A => {
      A.preventDefault(), n ? x.mutate({
        id: n._id,
        data: r
      }) : m.mutate(r);
    },
    C = A => A === "video" ? jsxRuntime.jsxs("span", {
      className: "px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 flex items-center gap-1",
      children: [jsxRuntime.jsx(as, {
        className: "w-3 h-3"
      }), " Video"]
    }) : jsxRuntime.jsxs("span", {
      className: "px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1",
      children: [jsxRuntime.jsx(t_, {
        className: "w-3 h-3"
      }), " Heyzine"]
    });
  return jsxRuntime.jsxs("div", {
    className: "space-y-6",
    children: [jsxRuntime.jsxs("div", {
      className: "flex items-center justify-between",
      children: [jsxRuntime.jsx("h1", {
        className: "text-2xl font-bold text-gray-800",
        children: "Quản lý Storybooks"
      }), jsxRuntime.jsxs("button", {
        onClick: () => _(),
        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
        children: [jsxRuntime.jsx(eo, {
          className: "w-5 h-5"
        }), "Thêm mới"]
      })]
    }), jsxRuntime.jsx("div", {
      className: "bg-white rounded-xl shadow-sm overflow-hidden",
      children: f ? jsxRuntime.jsx("div", {
        className: "p-8 text-center",
        children: jsxRuntime.jsx(Ke, {
          className: "w-8 h-8 animate-spin mx-auto text-blue-600"
        })
      }) : d?.length === 0 ? jsxRuntime.jsx("div", {
        className: "p-8 text-center text-gray-500",
        children: "Chưa có storybook nào"
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
                children: "Loại"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase",
                children: "AI Chat"
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
            children: d?.map(A => jsxRuntime.jsxs("tr", {
              className: "hover:bg-gray-50",
              children: [jsxRuntime.jsx("td", {
                className: "px-6 py-4",
                children: jsxRuntime.jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [A.thumbnail ? jsxRuntime.jsx("img", {
                    src: A.thumbnail,
                    alt: "",
                    className: "w-12 h-12 rounded-lg object-cover"
                  }) : jsxRuntime.jsx("div", {
                    className: "w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center",
                    children: jsxRuntime.jsx(as, {
                      className: "w-6 h-6 text-gray-400"
                    })
                  }), jsxRuntime.jsxs("div", {
                    children: [jsxRuntime.jsx("p", {
                      className: "font-medium text-gray-900",
                      children: A.title
                    }), A.author && jsxRuntime.jsx("p", {
                      className: "text-sm text-gray-500",
                      children: A.author
                    })]
                  })]
                })
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 text-gray-600",
                children: typeof A.category == "object" ? A.category.name : "-"
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4",
                children: C(A.type)
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4",
                children: A.textData ? jsxRuntime.jsxs("span", {
                  className: "px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit",
                  children: [jsxRuntime.jsx(zl, {
                    className: "w-3 h-3"
                  }), " Có"]
                }) : jsxRuntime.jsx("span", {
                  className: "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500 w-fit",
                  children: "Chưa có"
                })
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4",
                children: jsxRuntime.jsxs("span", {
                  className: "flex items-center gap-1 text-gray-600",
                  children: [jsxRuntime.jsx(Ss, {
                    className: "w-4 h-4"
                  }), " ", A.viewCount]
                })
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 text-right",
                children: jsxRuntime.jsxs("div", {
                  className: "flex items-center justify-end gap-2",
                  children: [jsxRuntime.jsx("button", {
                    onClick: () => _(A),
                    className: "p-2 rounded-lg hover:bg-gray-100 text-gray-600",
                    title: "Sửa",
                    children: jsxRuntime.jsx(Md, {
                      className: "w-4 h-4"
                    })
                  }), jsxRuntime.jsx("button", {
                    onClick: () => {
                      confirm("Bạn có chắc muốn xóa?") && w.mutate(A._id);
                    },
                    className: "p-2 rounded-lg hover:bg-red-100 text-red-600",
                    title: "Xóa",
                    children: jsxRuntime.jsx(ta, {
                      className: "w-4 h-4"
                    })
                  })]
                })
              })]
            }, A._id))
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
            children: n ? "Sửa Storybook" : "Thêm Storybook mới"
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
          children: [!n && jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Loại"
            }), jsxRuntime.jsxs("div", {
              className: "flex gap-4",
              children: [jsxRuntime.jsxs("label", {
                className: "flex items-center gap-2",
                children: [jsxRuntime.jsx("input", {
                  type: "radio",
                  name: "type",
                  value: "video",
                  checked: r.type === "video",
                  onChange: A => l({
                    ...r,
                    type: A.target.value
                  }),
                  className: "text-blue-600"
                }), jsxRuntime.jsx(as, {
                  className: "w-4 h-4"
                }), " Video"]
              }), jsxRuntime.jsxs("label", {
                className: "flex items-center gap-2",
                children: [jsxRuntime.jsx("input", {
                  type: "radio",
                  name: "type",
                  value: "heyzine",
                  checked: r.type === "heyzine",
                  onChange: A => l({
                    ...r,
                    type: A.target.value
                  }),
                  className: "text-blue-600"
                }), jsxRuntime.jsx(t_, {
                  className: "w-4 h-4"
                }), " Heyzine"]
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Danh mục *"
            }), jsxRuntime.jsxs("select", {
              value: r.category,
              onChange: A => l({
                ...r,
                category: A.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
              required: !0,
              children: [jsxRuntime.jsx("option", {
                value: "",
                children: "Chọn danh mục"
              }), p?.map(A => jsxRuntime.jsx("option", {
                value: A._id,
                children: A.name
              }, A._id))]
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Tiêu đề *"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: r.title,
              onChange: A => l({
                ...r,
                title: A.target.value
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
              onChange: A => l({
                ...r,
                description: A.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
              rows: 3
            })]
          }), jsxRuntime.jsxs("div", {
            className: "grid grid-cols-2 gap-4",
            children: [jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Tác giả"
              }), jsxRuntime.jsx("input", {
                type: "text",
                value: r.author,
                onChange: A => l({
                  ...r,
                  author: A.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Thời lượng (phút)"
              }), jsxRuntime.jsx("input", {
                type: "number",
                value: r.duration,
                onChange: A => l({
                  ...r,
                  duration: A.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              })]
            })]
          }), r.type === "video" ? jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: ["File Video ", !n && "*"]
            }), jsxRuntime.jsx("input", {
              type: "file",
              accept: "video/*",
              onChange: A => l({
                ...r,
                file: A.target.files?.[0] || null
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
              required: !n
            })]
          }) : jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: ["URL Heyzine ", !n && "*"]
            }), jsxRuntime.jsx("input", {
              type: "url",
              value: r.url,
              onChange: A => l({
                ...r,
                url: A.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
              placeholder: "https://heyzine.com/...",
              required: !n
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Thumbnail"
            }), jsxRuntime.jsx("input", {
              type: "file",
              accept: "image/*",
              onChange: A => l({
                ...r,
                thumbnail: A.target.files?.[0] || null
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            })]
          }), jsxRuntime.jsxs("div", {
            className: "border-t pt-4 mt-4",
            children: [jsxRuntime.jsxs("label", {
              className: "text-sm font-medium text-gray-700 mb-1 flex items-center gap-2",
              children: [jsxRuntime.jsx(zl, {
                className: "w-4 h-4 text-purple-600"
              }), "File nội dung cho AI Chat (DOCX)"]
            }), jsxRuntime.jsx("input", {
              type: "file",
              accept: ".txt,.md,.docx",
              onChange: A => l({
                ...r,
                textFile: A.target.files?.[0] || null
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            }), jsxRuntime.jsx("p", {
              className: "text-xs text-gray-500 mt-1",
              children: "Upload file .docx chứa nội dung để AI có thể trả lời câu hỏi của người dùng"
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
export { AdminStorybooks };
