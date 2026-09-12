// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useQueryClient, useQuery, apiClient, useMutation, jsxRuntime, Ld, Rd, Ke, g5, yw, gr, G3, pw, Bn, ta } from './runtime.js';
function AdminUsers() {
  const [t, e] = React.useState("all"),
    [n, i] = React.useState(""),
    [r, l] = React.useState(!1),
    [o, d] = React.useState(!1),
    [f, p] = React.useState(null),
    [m, x] = React.useState(""),
    [w, _] = React.useState({
      fullName: "",
      email: "",
      className: "",
      school: "",
      role: "member",
      status: "approved"
    }),
    k = useQueryClient(),
    {
      data: E,
      isLoading: C
    } = useQuery({
      queryKey: ["users", t],
      queryFn: async () => {
        const Q = t === "pending" ? "/admin/users/pending" : "/admin/users";
        return (await apiClient.get(Q)).data.users;
      }
    }),
    A = useMutation({
      mutationFn: Q => apiClient.patch(`/admin/users/${Q}/approve`),
      onSuccess: () => {
        k.invalidateQueries({
          queryKey: ["users"]
        });
      }
    }),
    R = useMutation({
      mutationFn: Q => apiClient.patch(`/admin/users/${Q}/reject`),
      onSuccess: () => {
        k.invalidateQueries({
          queryKey: ["users"]
        });
      }
    }),
    L = useMutation({
      mutationFn: Q => apiClient.delete(`/admin/users/${Q}`),
      onSuccess: () => {
        k.invalidateQueries({
          queryKey: ["users"]
        });
      }
    }),
    B = useMutation({
      mutationFn: ({
        id: Q,
        password: X
      }) => apiClient.patch(`/admin/users/${Q}/change-password`, {
        newPassword: X
      }),
      onSuccess: () => {
        k.invalidateQueries({
          queryKey: ["users"]
        }), l(!1), x(""), p(null), alert("Đổi mật khẩu thành công");
      },
      onError: Q => {
        alert(Q.response?.data?.error || "Đổi mật khẩu thất bại");
      }
    }),
    z = useMutation({
      mutationFn: Q => apiClient.patch(`/admin/users/${Q}/toggle-lock`),
      onSuccess: () => {
        k.invalidateQueries({
          queryKey: ["users"]
        });
      },
      onError: Q => {
        alert(Q.response?.data?.error || "Thao tác thất bại");
      }
    }),
    q = useMutation({
      mutationFn: ({
        id: Q,
        data: X
      }) => apiClient.patch(`/admin/users/${Q}`, X),
      onSuccess: () => {
        k.invalidateQueries({
          queryKey: ["users"]
        }), d(!1), p(null), alert("Cập nhật thành công");
      },
      onError: Q => {
        alert(Q.response?.data?.error || "Cập nhật thất bại");
      }
    }),
    V = Q => {
      p(Q), l(!0);
    },
    J = Q => {
      p(Q), _({
        fullName: Q.fullName,
        email: Q.email || "",
        className: Q.className || "",
        school: Q.school || "",
        role: Q.role,
        status: Q.status
      }), d(!0);
    },
    O = Q => {
      Q.preventDefault(), f && m && B.mutate({
        id: f._id,
        password: m
      });
    },
    P = Q => {
      Q.preventDefault(), f && q.mutate({
        id: f._id,
        data: w
      });
    },
    se = E?.filter(Q => {
      if (n) {
        const X = n.toLowerCase();
        return Q.fullName.toLowerCase().includes(X) || Q.username.toLowerCase().includes(X) || Q.email?.toLowerCase().includes(X);
      }
      return !0;
    }),
    ae = Q => {
      switch (Q) {
        case "approved":
          return jsxRuntime.jsx("span", {
            className: "px-2 py-1 text-xs rounded-full bg-green-100 text-green-700",
            children: "Đã duyệt"
          });
        case "pending":
          return jsxRuntime.jsx("span", {
            className: "px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700",
            children: "Chờ duyệt"
          });
        case "rejected":
          return jsxRuntime.jsx("span", {
            className: "px-2 py-1 text-xs rounded-full bg-red-100 text-red-700",
            children: "Từ chối"
          });
        default:
          return jsxRuntime.jsx("span", {
            className: "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700",
            children: Q
          });
      }
    },
    ue = Q => Q === "admin" ? jsxRuntime.jsx("span", {
      className: "px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700",
      children: "Admin"
    }) : jsxRuntime.jsx("span", {
      className: "px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700",
      children: "Member"
    });
  return jsxRuntime.jsxs("div", {
    className: "space-y-6",
    children: [jsxRuntime.jsx("div", {
      className: "flex items-center justify-between",
      children: jsxRuntime.jsx("h1", {
        className: "text-2xl font-bold text-gray-800",
        children: "Quản lý người dùng"
      })
    }), jsxRuntime.jsx("div", {
      className: "bg-white rounded-xl shadow-sm p-4",
      children: jsxRuntime.jsxs("div", {
        className: "flex flex-col md:flex-row gap-4",
        children: [jsxRuntime.jsxs("div", {
          className: "flex-1 relative",
          children: [jsxRuntime.jsx(Ld, {
            className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          }), jsxRuntime.jsx("input", {
            type: "text",
            placeholder: "Tìm kiếm theo tên, username, email...",
            value: n,
            onChange: Q => i(Q.target.value),
            className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Rd, {
            className: "w-5 h-5 text-gray-400"
          }), jsxRuntime.jsxs("select", {
            value: t,
            onChange: Q => e(Q.target.value),
            className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            children: [jsxRuntime.jsx("option", {
              value: "all",
              children: "Tất cả"
            }), jsxRuntime.jsx("option", {
              value: "pending",
              children: "Chờ duyệt"
            })]
          })]
        })]
      })
    }), jsxRuntime.jsx("div", {
      className: "bg-white rounded-xl shadow-sm overflow-hidden",
      children: C ? jsxRuntime.jsx("div", {
        className: "p-8 text-center",
        children: jsxRuntime.jsx(Ke, {
          className: "w-8 h-8 animate-spin mx-auto text-blue-600"
        })
      }) : se?.length === 0 ? jsxRuntime.jsx("div", {
        className: "p-8 text-center text-gray-500",
        children: "Không có người dùng nào"
      }) : jsxRuntime.jsx("div", {
        className: "overflow-x-auto",
        children: jsxRuntime.jsxs("table", {
          className: "w-full",
          children: [jsxRuntime.jsx("thead", {
            className: "bg-gray-50 border-b border-gray-200",
            children: jsxRuntime.jsxs("tr", {
              children: [jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                children: "Người dùng"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                children: "Email"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                children: "Vai trò"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                children: "Trạng thái"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                children: "Ngày tạo"
              }), jsxRuntime.jsx("th", {
                className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                children: "Thao tác"
              })]
            })
          }), jsxRuntime.jsx("tbody", {
            className: "divide-y divide-gray-200",
            children: se?.map(Q => jsxRuntime.jsxs("tr", {
              className: "hover:bg-gray-50",
              children: [jsxRuntime.jsx("td", {
                className: "px-6 py-4 whitespace-nowrap",
                children: jsxRuntime.jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [jsxRuntime.jsx("div", {
                    className: "w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold",
                    children: Q.fullName.charAt(0)
                  }), jsxRuntime.jsxs("div", {
                    children: [jsxRuntime.jsx("p", {
                      className: "font-medium text-gray-900",
                      children: Q.fullName
                    }), jsxRuntime.jsxs("p", {
                      className: "text-sm text-gray-500",
                      children: ["@", Q.username]
                    })]
                  })]
                })
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 whitespace-nowrap text-gray-600",
                children: Q.email
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 whitespace-nowrap",
                children: ue(Q.role)
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 whitespace-nowrap",
                children: ae(Q.status)
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 whitespace-nowrap text-gray-500 text-sm",
                children: new Date(Q.createdAt).toLocaleDateString("vi-VN")
              }), jsxRuntime.jsx("td", {
                className: "px-6 py-4 whitespace-nowrap text-right",
                children: jsxRuntime.jsxs("div", {
                  className: "flex items-center justify-end gap-2",
                  children: [jsxRuntime.jsx("button", {
                    onClick: () => J(Q),
                    className: "p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition",
                    title: "Sửa thông tin",
                    children: jsxRuntime.jsx(g5, {
                      className: "w-4 h-4"
                    })
                  }), jsxRuntime.jsx("button", {
                    onClick: () => V(Q),
                    className: "p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition",
                    title: "Đổi mật khẩu",
                    children: jsxRuntime.jsx(yw, {
                      className: "w-4 h-4"
                    })
                  }), jsxRuntime.jsx("button", {
                    onClick: () => z.mutate(Q._id),
                    disabled: z.isPending,
                    className: `p-2 rounded-lg transition ${Q.status === "approved" ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`,
                    title: Q.status === "approved" ? "Khóa tài khoản" : "Mở khóa tài khoản",
                    children: Q.status === "approved" ? jsxRuntime.jsx(gr, {
                      className: "w-4 h-4"
                    }) : jsxRuntime.jsx(G3, {
                      className: "w-4 h-4"
                    })
                  }), Q.status === "pending" && jsxRuntime.jsxs(jsxRuntime.Fragment, {
                    children: [jsxRuntime.jsx("button", {
                      onClick: () => A.mutate(Q._id),
                      disabled: A.isPending,
                      className: "p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition",
                      title: "Duyệt",
                      children: jsxRuntime.jsx(pw, {
                        className: "w-4 h-4"
                      })
                    }), jsxRuntime.jsx("button", {
                      onClick: () => R.mutate(Q._id),
                      disabled: R.isPending,
                      className: "p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition",
                      title: "Từ chối",
                      children: jsxRuntime.jsx(Bn, {
                        className: "w-4 h-4"
                      })
                    })]
                  }), Q.role !== "admin" && jsxRuntime.jsx("button", {
                    onClick: () => {
                      confirm("Bạn có chắc muốn xóa người dùng này?") && L.mutate(Q._id);
                    },
                    disabled: L.isPending,
                    className: "p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition",
                    title: "Xóa",
                    children: jsxRuntime.jsx(ta, {
                      className: "w-4 h-4"
                    })
                  })]
                })
              })]
            }, Q._id))
          })]
        })
      })
    }), r && f && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-xl max-w-md w-full p-6",
        children: [jsxRuntime.jsxs("h3", {
          className: "text-xl font-bold text-gray-900 mb-4",
          children: ["Đổi mật khẩu cho ", f.fullName]
        }), jsxRuntime.jsxs("form", {
          onSubmit: O,
          children: [jsxRuntime.jsxs("div", {
            className: "mb-4",
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-2",
              children: "Mật khẩu mới"
            }), jsxRuntime.jsx("input", {
              type: "password",
              value: m,
              onChange: Q => x(Q.target.value),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500",
              placeholder: "Nhập mật khẩu mới",
              minLength: 8,
              required: !0
            }), jsxRuntime.jsx("p", {
              className: "text-xs text-gray-500 mt-1",
              children: "Tối thiểu 8 ký tự"
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex gap-3",
            children: [jsxRuntime.jsxs("button", {
              type: "submit",
              disabled: B.isPending,
              className: "flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2",
              children: [B.isPending && jsxRuntime.jsx(Ke, {
                className: "w-4 h-4 animate-spin"
              }), "Đổi mật khẩu"]
            }), jsxRuntime.jsx("button", {
              type: "button",
              onClick: () => {
                l(!1), x(""), p(null);
              },
              className: "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50",
              children: "Hủy"
            })]
          })]
        })]
      })
    }), o && f && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto",
        children: [jsxRuntime.jsxs("h3", {
          className: "text-xl font-bold text-gray-900 mb-4",
          children: ["Chỉnh sửa thông tin: ", f.fullName]
        }), jsxRuntime.jsxs("form", {
          onSubmit: P,
          className: "space-y-4",
          children: [jsxRuntime.jsxs("div", {
            className: "grid md:grid-cols-2 gap-4",
            children: [jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Họ và tên"
              }), jsxRuntime.jsx("input", {
                type: "text",
                value: w.fullName,
                onChange: Q => _({
                  ...w,
                  fullName: Q.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                required: !0
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Email"
              }), jsxRuntime.jsx("input", {
                type: "email",
                value: w.email,
                onChange: Q => _({
                  ...w,
                  email: Q.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Lớp"
              }), jsxRuntime.jsx("input", {
                type: "text",
                value: w.className,
                onChange: Q => _({
                  ...w,
                  className: Q.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Trường"
              }), jsxRuntime.jsx("input", {
                type: "text",
                value: w.school,
                onChange: Q => _({
                  ...w,
                  school: Q.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Vai trò"
              }), jsxRuntime.jsxs("select", {
                value: w.role,
                onChange: Q => _({
                  ...w,
                  role: Q.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                children: [jsxRuntime.jsx("option", {
                  value: "member",
                  children: "Member"
                }), jsxRuntime.jsx("option", {
                  value: "admin",
                  children: "Admin"
                })]
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Trạng thái"
              }), jsxRuntime.jsxs("select", {
                value: w.status,
                onChange: Q => _({
                  ...w,
                  status: Q.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                children: [jsxRuntime.jsx("option", {
                  value: "approved",
                  children: "Đã duyệt"
                }), jsxRuntime.jsx("option", {
                  value: "pending",
                  children: "Chờ duyệt"
                }), jsxRuntime.jsx("option", {
                  value: "rejected",
                  children: "Từ chối"
                })]
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex gap-3 pt-4",
            children: [jsxRuntime.jsxs("button", {
              type: "submit",
              disabled: q.isPending,
              className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2",
              children: [q.isPending && jsxRuntime.jsx(Ke, {
                className: "w-4 h-4 animate-spin"
              }), "Cập nhật"]
            }), jsxRuntime.jsx("button", {
              type: "button",
              onClick: () => {
                d(!1), p(null);
              },
              className: "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50",
              children: "Hủy"
            })]
          })]
        })]
      })
    })]
  });
}
export { AdminUsers };
