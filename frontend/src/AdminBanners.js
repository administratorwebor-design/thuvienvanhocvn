// Recovered from the surviving frontend bundle; local variable names are not original.
import { useQueryClient, React, useQuery, apiClient, useMutation, jsxRuntime, eo, gw, Ss, bd, t5, ta } from './runtime.js';
function AdminBanners() {
  const t = useQueryClient(),
    [e, n] = React.useState(!1),
    [i, r] = React.useState(null),
    [l, o] = React.useState({
      title: "",
      description: "",
      linkUrl: "",
      order: 0,
      isActive: !0
    }),
    [d, f] = React.useState(null),
    {
      data: p = [],
      isLoading: m
    } = useQuery({
      queryKey: ["banners-admin"],
      queryFn: async () => (await apiClient.get("/banners/admin/all")).data.banners
    }),
    x = useMutation({
      mutationFn: async B => apiClient.post("/banners", B, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }),
      onSuccess: () => {
        t.invalidateQueries({
          queryKey: ["banners-admin"]
        }), C();
      }
    }),
    w = useMutation({
      mutationFn: async ({
        id: B,
        data: z
      }) => apiClient.patch(`/banners/${B}`, z, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }),
      onSuccess: () => {
        t.invalidateQueries({
          queryKey: ["banners-admin"]
        }), C();
      }
    }),
    _ = useMutation({
      mutationFn: B => apiClient.delete(`/banners/${B}`),
      onSuccess: () => {
        t.invalidateQueries({
          queryKey: ["banners-admin"]
        });
      }
    }),
    k = useMutation({
      mutationFn: async ({
        id: B,
        isActive: z
      }) => {
        const q = new FormData();
        return q.append("isActive", String(z)), apiClient.patch(`/banners/${B}`, q, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      },
      onSuccess: () => {
        t.invalidateQueries({
          queryKey: ["banners-admin"]
        });
      }
    }),
    E = B => {
      B ? (r(B), o({
        title: B.title,
        description: B.description || "",
        linkUrl: B.linkUrl || "",
        order: B.order,
        isActive: B.isActive
      }), f(B.imageUrl)) : (r(null), o({
        title: "",
        description: "",
        linkUrl: "",
        order: p.length,
        isActive: !0
      }), f(null)), n(!0);
    },
    C = () => {
      n(!1), r(null), o({
        title: "",
        description: "",
        linkUrl: "",
        order: 0,
        isActive: !0
      }), f(null);
    },
    A = B => {
      const z = B.target.files?.[0];
      z && (o({
        ...l,
        imageFile: z
      }), f(URL.createObjectURL(z)));
    },
    R = B => {
      B.preventDefault();
      const z = new FormData();
      if (z.append("title", l.title), z.append("description", l.description), z.append("linkUrl", l.linkUrl), z.append("order", String(l.order)), z.append("isActive", String(l.isActive)), l.imageFile && z.append("image", l.imageFile), i) w.mutate({
        id: i._id,
        data: z
      });else {
        if (!l.imageFile) {
          alert("Vui lòng chọn hình ảnh banner");
          return;
        }
        x.mutate(z);
      }
    },
    L = B => {
      confirm("Bạn có chắc muốn xóa banner này?") && _.mutate(B);
    };
  return m ? jsxRuntime.jsx("div", {
    className: "flex items-center justify-center h-64",
    children: jsxRuntime.jsx("div", {
      className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
    })
  }) : jsxRuntime.jsxs("div", {
    children: [jsxRuntime.jsxs("div", {
      className: "flex justify-between items-center mb-6",
      children: [jsxRuntime.jsx("h1", {
        className: "text-2xl font-bold text-gray-800",
        children: "Quản lý Banner"
      }), jsxRuntime.jsxs("button", {
        onClick: () => E(),
        className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition",
        children: [jsxRuntime.jsx(eo, {
          size: 20
        }), "Thêm Banner"]
      })]
    }), jsxRuntime.jsx("div", {
      className: "grid gap-6",
      children: p.length === 0 ? jsxRuntime.jsxs("div", {
        className: "bg-white rounded-lg shadow p-8 text-center text-gray-500",
        children: [jsxRuntime.jsx(gw, {
          size: 48,
          className: "mx-auto mb-4 opacity-50"
        }), jsxRuntime.jsx("p", {
          children: "Chưa có banner nào"
        })]
      }) : p.sort((B, z) => B.order - z.order).map(B => jsxRuntime.jsx("div", {
        className: `bg-white rounded-lg shadow overflow-hidden ${B.isActive ? "" : "opacity-60"}`,
        children: jsxRuntime.jsxs("div", {
          className: "flex",
          children: [jsxRuntime.jsx("div", {
            className: "w-64 h-40 shrink-0",
            children: jsxRuntime.jsx("img", {
              src: B.imageUrl,
              alt: B.title,
              className: "w-full h-full object-cover"
            })
          }), jsxRuntime.jsx("div", {
            className: "flex-1 p-4",
            children: jsxRuntime.jsxs("div", {
              className: "flex items-start justify-between",
              children: [jsxRuntime.jsxs("div", {
                children: [jsxRuntime.jsx("h3", {
                  className: "text-lg font-semibold text-gray-800",
                  children: B.title
                }), B.description && jsxRuntime.jsx("p", {
                  className: "text-gray-600 text-sm mt-1",
                  children: B.description
                }), B.linkUrl && jsxRuntime.jsx("a", {
                  href: B.linkUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-blue-600 text-sm hover:underline mt-1 inline-block",
                  children: B.linkUrl
                }), jsxRuntime.jsxs("div", {
                  className: "flex items-center gap-4 mt-2 text-sm text-gray-500",
                  children: [jsxRuntime.jsxs("span", {
                    children: ["Thứ tự: ", B.order]
                  }), jsxRuntime.jsx("span", {
                    className: `px-2 py-0.5 rounded ${B.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`,
                    children: B.isActive ? "Đang hiển thị" : "Đã ẩn"
                  })]
                })]
              }), jsxRuntime.jsxs("div", {
                className: "flex items-center gap-2",
                children: [jsxRuntime.jsx("button", {
                  onClick: () => k.mutate({
                    id: B._id,
                    isActive: !B.isActive
                  }),
                  className: `p-2 rounded-lg transition ${B.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`,
                  title: B.isActive ? "Ẩn banner" : "Hiện banner",
                  children: B.isActive ? jsxRuntime.jsx(Ss, {
                    size: 18
                  }) : jsxRuntime.jsx(bd, {
                    size: 18
                  })
                }), jsxRuntime.jsx("button", {
                  onClick: () => E(B),
                  className: "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition",
                  children: jsxRuntime.jsx(t5, {
                    size: 18
                  })
                }), jsxRuntime.jsx("button", {
                  onClick: () => L(B._id),
                  className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition",
                  children: jsxRuntime.jsx(ta, {
                    size: 18
                  })
                })]
              })]
            })
          })]
        })
      }, B._id))
    }), e && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto",
        children: [jsxRuntime.jsx("div", {
          className: "p-6 border-b",
          children: jsxRuntime.jsx("h2", {
            className: "text-xl font-semibold",
            children: i ? "Chỉnh sửa Banner" : "Thêm Banner mới"
          })
        }), jsxRuntime.jsxs("form", {
          onSubmit: R,
          className: "p-6 space-y-4",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Tiêu đề *"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: l.title,
              onChange: B => o({
                ...l,
                title: B.target.value
              }),
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Mô tả"
            }), jsxRuntime.jsx("textarea", {
              value: l.description,
              onChange: B => o({
                ...l,
                description: B.target.value
              }),
              rows: 3,
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: ["Hình ảnh ", !i && "*"]
            }), jsxRuntime.jsx("input", {
              type: "file",
              accept: "image/*",
              onChange: A,
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }), d && jsxRuntime.jsx("div", {
              className: "mt-2",
              children: jsxRuntime.jsx("img", {
                src: d,
                alt: "Preview",
                className: "h-32 object-cover rounded-lg"
              })
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Link URL"
            }), jsxRuntime.jsx("input", {
              type: "url",
              value: l.linkUrl,
              onChange: B => o({
                ...l,
                linkUrl: B.target.value
              }),
              placeholder: "https://...",
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex gap-4",
            children: [jsxRuntime.jsxs("div", {
              className: "flex-1",
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Thứ tự"
              }), jsxRuntime.jsx("input", {
                type: "number",
                value: l.order,
                onChange: B => o({
                  ...l,
                  order: parseInt(B.target.value) || 0
                }),
                min: 0,
                className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              })]
            }), jsxRuntime.jsxs("div", {
              className: "flex-1",
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Trạng thái"
              }), jsxRuntime.jsxs("select", {
                value: l.isActive ? "true" : "false",
                onChange: B => o({
                  ...l,
                  isActive: B.target.value === "true"
                }),
                className: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                children: [jsxRuntime.jsx("option", {
                  value: "true",
                  children: "Hiển thị"
                }), jsxRuntime.jsx("option", {
                  value: "false",
                  children: "Ẩn"
                })]
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex gap-3 pt-4",
            children: [jsxRuntime.jsx("button", {
              type: "button",
              onClick: C,
              className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition",
              children: "Hủy"
            }), jsxRuntime.jsx("button", {
              type: "submit",
              disabled: x.isPending || w.isPending,
              className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50",
              children: x.isPending || w.isPending ? "Đang lưu..." : i ? "Cập nhật" : "Thêm mới"
            })]
          })]
        })]
      })
    })]
  });
}
export { AdminBanners };
