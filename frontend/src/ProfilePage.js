// Recovered from the surviving frontend bundle; local variable names are not original.
import { useQueryClient, React, useQuery, apiClient, useMutation, jsxRuntime, Ke, fy, to, vw, On, _r, Id, Od, nn, c5, yw } from './runtime.js';
function ProfilePage() {
  const t = useQueryClient(),
    [e, n] = React.useState(!1),
    [i, r] = React.useState(!1),
    {
      data: l,
      isLoading: o
    } = useQuery({
      queryKey: ["profile"],
      queryFn: async () => (await apiClient.get("/auth/me")).data.user
    }),
    [d, f] = React.useState({
      fullName: "",
      email: "",
      dateOfBirth: "",
      className: "",
      school: ""
    }),
    [p, m] = React.useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }),
    x = () => {
      l && (f({
        fullName: l.fullName || "",
        email: l.email || "",
        dateOfBirth: l.dateOfBirth ? new Date(l.dateOfBirth).toISOString().split("T")[0] : "",
        className: l.className || "",
        school: l.school || ""
      }), n(!0));
    },
    w = useMutation({
      mutationFn: A => apiClient.patch("/auth/profile", A),
      onSuccess: A => {
        t.invalidateQueries({
          queryKey: ["profile"]
        }), n(!1), alert(A.data.message);
      },
      onError: A => {
        alert(A.response?.data?.error || "Cập nhật thất bại");
      }
    }),
    _ = useMutation({
      mutationFn: A => apiClient.patch("/auth/change-password", A),
      onSuccess: A => {
        r(!1), m({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }), alert(A.data.message);
      },
      onError: A => {
        alert(A.response?.data?.error || "Đổi mật khẩu thất bại");
      }
    }),
    k = useMutation({
      mutationFn: () => apiClient.post("/auth/resend-verification"),
      onSuccess: A => {
        alert(A.data.message);
      },
      onError: A => {
        alert(A.response?.data?.error || "Gửi email thất bại");
      }
    }),
    E = A => {
      A.preventDefault(), w.mutate(d);
    },
    C = A => {
      if (A.preventDefault(), p.newPassword !== p.confirmPassword) {
        alert("Mật khẩu mới không khớp");
        return;
      }
      _.mutate({
        currentPassword: p.currentPassword,
        newPassword: p.newPassword
      });
    };
  return o ? jsxRuntime.jsx("div", {
    className: "flex justify-center items-center min-h-screen",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-purple-600"
    })
  }) : jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsx("h1", {
      className: "text-3xl font-bold text-gray-900 mb-6",
      children: "Thông tin cá nhân"
    }), jsxRuntime.jsx("div", {
      className: "bg-white rounded-xl shadow-sm p-6 mb-6",
      children: e ? jsxRuntime.jsxs("form", {
        onSubmit: E,
        className: "space-y-4",
        children: [jsxRuntime.jsxs("div", {
          className: "grid md:grid-cols-2 gap-4",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Họ và tên"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: d.fullName,
              onChange: A => f({
                ...d,
                fullName: A.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: ["Email ", jsxRuntime.jsx("span", {
                className: "text-xs text-gray-500",
                children: "(Không bắt buộc)"
              })]
            }), jsxRuntime.jsx("input", {
              type: "email",
              value: d.email,
              onChange: A => f({
                ...d,
                email: A.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            }), jsxRuntime.jsx("p", {
              className: "text-xs text-gray-500 mt-1",
              children: "Nếu đổi email, bạn cần xác thực lại"
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Ngày sinh"
            }), jsxRuntime.jsx("input", {
              type: "date",
              value: d.dateOfBirth,
              onChange: A => f({
                ...d,
                dateOfBirth: A.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Lớp"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: d.className,
              onChange: A => f({
                ...d,
                className: A.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500",
              required: !0
            })]
          }), jsxRuntime.jsxs("div", {
            className: "md:col-span-2",
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: "Trường"
            }), jsxRuntime.jsx("input", {
              type: "text",
              value: d.school,
              onChange: A => f({
                ...d,
                school: A.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500",
              required: !0
            })]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex gap-3 pt-4",
          children: [jsxRuntime.jsxs("button", {
            type: "submit",
            disabled: w.isPending,
            className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50",
            children: [w.isPending && jsxRuntime.jsx(Ke, {
              className: "w-4 h-4 animate-spin"
            }), jsxRuntime.jsx(fy, {
              className: "w-4 h-4"
            }), "Lưu thay đổi"]
          }), jsxRuntime.jsx("button", {
            type: "button",
            onClick: () => n(!1),
            className: "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition",
            children: "Hủy"
          })]
        })]
      }) : jsxRuntime.jsxs("div", {
        className: "space-y-4",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-center gap-3 pb-4 border-b",
          children: [jsxRuntime.jsx("div", {
            className: "w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center",
            children: jsxRuntime.jsx(to, {
              className: "w-8 h-8 text-purple-600"
            })
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("h2", {
              className: "text-xl font-semibold text-gray-900",
              children: l?.fullName
            }), jsxRuntime.jsxs("p", {
              className: "text-sm text-gray-500",
              children: ["@", l?.username]
            })]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "grid md:grid-cols-2 gap-4",
          children: [jsxRuntime.jsxs("div", {
            className: "flex items-center gap-3",
            children: [jsxRuntime.jsx(vw, {
              className: "w-5 h-5 text-gray-400"
            }), jsxRuntime.jsxs("div", {
              className: "flex-1",
              children: [jsxRuntime.jsx("p", {
                className: "text-xs text-gray-500",
                children: "Email"
              }), jsxRuntime.jsx("p", {
                className: "text-sm text-gray-900",
                children: l?.email || "Chưa cập nhật"
              }), l?.email && jsxRuntime.jsx("div", {
                className: "flex items-center gap-2 mt-1",
                children: l?.isEmailVerified ? jsxRuntime.jsxs("span", {
                  className: "flex items-center gap-1 text-xs text-green-600",
                  children: [jsxRuntime.jsx(On, {
                    className: "w-3 h-3"
                  }), "Đã xác thực"]
                }) : jsxRuntime.jsxs(jsxRuntime.Fragment, {
                  children: [jsxRuntime.jsxs("span", {
                    className: "flex items-center gap-1 text-xs text-orange-600",
                    children: [jsxRuntime.jsx(_r, {
                      className: "w-3 h-3"
                    }), "Chưa xác thực"]
                  }), jsxRuntime.jsxs("button", {
                    onClick: () => k.mutate(),
                    disabled: k.isPending,
                    className: "text-xs text-blue-600 hover:text-blue-700 underline disabled:opacity-50 flex items-center gap-1",
                    children: [k.isPending ? jsxRuntime.jsx(Ke, {
                      className: "w-3 h-3 animate-spin"
                    }) : jsxRuntime.jsx(Id, {
                      className: "w-3 h-3"
                    }), "Gửi lại"]
                  })]
                })
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center gap-3",
            children: [jsxRuntime.jsx(Od, {
              className: "w-5 h-5 text-gray-400"
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("p", {
                className: "text-xs text-gray-500",
                children: "Ngày sinh"
              }), jsxRuntime.jsx("p", {
                className: "text-sm text-gray-900",
                children: l?.dateOfBirth ? new Date(l.dateOfBirth).toLocaleDateString("vi-VN") : "Chưa cập nhật"
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center gap-3",
            children: [jsxRuntime.jsx(nn, {
              className: "w-5 h-5 text-gray-400"
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("p", {
                className: "text-xs text-gray-500",
                children: "Lớp"
              }), jsxRuntime.jsx("p", {
                className: "text-sm text-gray-900",
                children: l?.className || "Chưa cập nhật"
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center gap-3",
            children: [jsxRuntime.jsx(c5, {
              className: "w-5 h-5 text-gray-400"
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("p", {
                className: "text-xs text-gray-500",
                children: "Trường"
              }), jsxRuntime.jsx("p", {
                className: "text-sm text-gray-900",
                children: l?.school || "Chưa cập nhật"
              })]
            })]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex gap-3 pt-4",
          children: [jsxRuntime.jsxs("button", {
            onClick: x,
            className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition",
            children: [jsxRuntime.jsx(fy, {
              className: "w-4 h-4"
            }), "Chỉnh sửa"]
          }), jsxRuntime.jsxs("button", {
            onClick: () => r(!i),
            className: "flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition",
            children: [jsxRuntime.jsx(yw, {
              className: "w-4 h-4"
            }), "Đổi mật khẩu"]
          })]
        })]
      })
    }), i && jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm p-6",
      children: [jsxRuntime.jsx("h3", {
        className: "text-lg font-semibold text-gray-900 mb-4",
        children: "Đổi mật khẩu"
      }), jsxRuntime.jsxs("form", {
        onSubmit: C,
        className: "space-y-4",
        children: [jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Mật khẩu hiện tại"
          }), jsxRuntime.jsx("input", {
            type: "password",
            value: p.currentPassword,
            onChange: A => m({
              ...p,
              currentPassword: A.target.value
            }),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500",
            required: !0
          })]
        }), jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Mật khẩu mới"
          }), jsxRuntime.jsx("input", {
            type: "password",
            value: p.newPassword,
            onChange: A => m({
              ...p,
              newPassword: A.target.value
            }),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500",
            minLength: 8,
            required: !0
          })]
        }), jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Xác nhận mật khẩu mới"
          }), jsxRuntime.jsx("input", {
            type: "password",
            value: p.confirmPassword,
            onChange: A => m({
              ...p,
              confirmPassword: A.target.value
            }),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500",
            minLength: 8,
            required: !0
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex gap-3",
          children: [jsxRuntime.jsxs("button", {
            type: "submit",
            disabled: _.isPending,
            className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50",
            children: [_.isPending && jsxRuntime.jsx(Ke, {
              className: "w-4 h-4 animate-spin"
            }), "Đổi mật khẩu"]
          }), jsxRuntime.jsx("button", {
            type: "button",
            onClick: () => {
              r(!1), m({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
              });
            },
            className: "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition",
            children: "Hủy"
          })]
        })]
      })]
    }), l?.email && !l?.isEmailVerified && jsxRuntime.jsxs("div", {
      className: "bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3",
      children: [jsxRuntime.jsx(_r, {
        className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5"
      }), jsxRuntime.jsxs("div", {
        className: "flex-1",
        children: [jsxRuntime.jsx("p", {
          className: "text-sm text-amber-800 font-medium",
          children: "Email chưa được xác thực"
        }), jsxRuntime.jsx("p", {
          className: "text-sm text-amber-700 mt-1",
          children: "Vui lòng kiểm tra hộp thư của bạn và nhấp vào link xác thực. Nếu chưa nhận được email, bạn có thể yêu cầu gửi lại."
        })]
      })]
    }), l?.email && l?.isEmailVerified && jsxRuntime.jsxs("div", {
      className: "bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3",
      children: [jsxRuntime.jsx(On, {
        className: "w-5 h-5 text-green-600"
      }), jsxRuntime.jsx("p", {
        className: "text-sm text-green-800",
        children: "Email đã được xác thực thành công"
      })]
    })]
  });
}
export { ProfilePage };
