// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { useNavigate, vp, React, useQuery, apiClient, jsxRuntime, Ld, Rd, Ke, Hl, Fs, On, gr, Vl, Bn, Ya, Ka, _r } from './runtime.js';
function QuizzesPage() {
  const {
      user: t
    } = useAuth(),
    e = useNavigate(),
    [n, i] = vp(),
    [r, l] = React.useState(n.get("search") || ""),
    [o, d] = React.useState(n.get("category") || ""),
    [f, p] = React.useState(r),
    [m, x] = React.useState(null),
    [w, _] = React.useState(!1);
  React.useEffect(() => {
    const z = setTimeout(() => p(r), 500);
    return () => clearTimeout(z);
  }, [r]), React.useEffect(() => {
    const z = new URLSearchParams();
    o && z.set("category", o), f && z.set("search", f), i(z);
  }, [o, f, i]);
  const {
      data: k
    } = useQuery({
      queryKey: ['quiz-categories'],
      queryFn: async () => (await apiClient.get('/categories?for=quizzes&limit=100')).data.categories
    }),
    {
      data: E,
      isLoading: C
    } = useQuery({
      queryKey: ["quizzes", o, f, t?._id],
      queryFn: async () => {
        if (t) {
          let V = "/quizzes/my-status?";
          return o && (V += `category=${o}`), f && (V += `&search=${encodeURIComponent(f)}`), (await apiClient.get(V)).data;
        }
        let z = "/quizzes?limit=50";
        return o && (z += `&category=${o}`), f && (z += `&search=${encodeURIComponent(f)}`), (await apiClient.get(z)).data;
      }
    }),
    A = E?.quizzes,
    R = z => {
      if (!t) {
        e("/login", {
          state: {
            from: `/quiz/${z._id}`
          }
        });
        return;
      }
      if (z.isCompleted) {
        e("/my-results");
        return;
      }
      z.lockedBy || (x(z), _(!0));
    },
    L = () => {
      m && e(`/quiz/${m._id}`);
    },
    B = () => {
      _(!1), x(null);
    };
  return jsxRuntime.jsxs("div", {
    className: "max-w-7xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs("div", {
      className: "mb-8",
      children: [jsxRuntime.jsx("h1", {
        className: "text-3xl font-bold text-gray-900 mb-2",
        children: "Kiểm Tra Đánh Giá"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-600",
        children: "Đánh giá năng lực với bài kiểm tra đa dạng"
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
            onChange: z => l(z.target.value),
            placeholder: "Tìm kiếm bài kiểm tra...",
            className: "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Rd, {
            className: "w-5 h-5 text-gray-400"
          }), jsxRuntime.jsxs("select", {
            value: o,
            onChange: z => d(z.target.value),
            className: "px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            children: [jsxRuntime.jsx("option", {
              value: "",
              children: "Tất cả danh mục"
            }), k?.map(z => jsxRuntime.jsx("option", {
              value: z._id,
              children: z.name
            }, z._id))]
          })]
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flex flex-wrap gap-2 mt-4",
        children: [jsxRuntime.jsx("button", {
          onClick: () => d(""),
          className: `px-3 py-1.5 rounded-full text-sm transition ${o ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-purple-600 text-white"}`,
          children: "Tất cả"
        }), k?.map(z => jsxRuntime.jsx("button", {
          onClick: () => d(z._id),
          className: `px-3 py-1.5 rounded-full text-sm transition ${o === z._id ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: z.name
        }, z._id))]
      })]
    }), C ? jsxRuntime.jsx("div", {
      className: "flex justify-center py-12",
      children: jsxRuntime.jsx(Ke, {
        className: "w-8 h-8 animate-spin text-purple-600"
      })
    }) : A?.length === 0 ? jsxRuntime.jsxs("div", {
      className: "text-center py-12",
      children: [jsxRuntime.jsx(Hl, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500",
        children: "Không tìm thấy bài kiểm tra nào"
      })]
    }) : jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm overflow-hidden",
      children: [jsxRuntime.jsxs("div", {
        className: "hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase tracking-wider",
        children: [jsxRuntime.jsx("div", {
          className: "col-span-5",
          children: "Bài kiểm tra"
        }), jsxRuntime.jsx("div", {
          className: "col-span-2 text-center",
          children: "Câu hỏi"
        }), jsxRuntime.jsx("div", {
          className: "col-span-2 text-center",
          children: "Thời gian"
        }), jsxRuntime.jsx("div", {
          className: "col-span-1 text-center",
          children: "Điểm"
        }), jsxRuntime.jsx("div", {
          className: "col-span-2 text-center",
          children: "Trạng thái"
        })]
      }), jsxRuntime.jsx("div", {
        className: "divide-y divide-gray-100",
        children: A?.map(z => {
          const q = z.questions.filter(P => P.type === "multiple_choice").length,
            V = z.questions.filter(P => P.type === "essay").length,
            J = !!z.lockedBy,
            O = z.isCompleted;
          return jsxRuntime.jsxs("div", {
            onClick: () => R(z),
            className: `md:grid md:grid-cols-12 gap-4 px-4 py-4 items-center transition ${J ? "opacity-50 cursor-not-allowed bg-gray-50/50" : "hover:bg-purple-50/50 cursor-pointer"}`,
            children: [jsxRuntime.jsxs("div", {
              className: "col-span-5 mb-2 md:mb-0",
              children: [jsxRuntime.jsxs("div", {
                className: "flex items-center gap-2 md:hidden mb-1",
                children: [jsxRuntime.jsx("span", {
                  className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${O ? "bg-green-100 text-green-700" : J ? "bg-gray-100 text-gray-400" : "bg-purple-100 text-purple-700"}`,
                  children: z.order + 1
                }), jsxRuntime.jsx("span", {
                  className: "text-xs text-purple-600 font-medium",
                  children: z.category?.name
                })]
              }), jsxRuntime.jsx("h3", {
                className: "font-medium text-gray-900 line-clamp-1",
                children: z.title
              }), jsxRuntime.jsx("span", {
                className: "hidden md:inline-block text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded mt-1",
                children: z.category?.name
              })]
            }), jsxRuntime.jsxs("div", {
              className: "hidden md:flex col-span-2 justify-start items-center gap-2",
              children: [q > 0 && jsxRuntime.jsxs("span", {
                className: "px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm",
                children: [q, " trắc nghiệm"]
              }), V > 0 && jsxRuntime.jsxs("span", {
                className: "px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-sm",
                children: [V, " tự luận"]
              })]
            }), jsxRuntime.jsxs("div", {
              className: "hidden md:flex col-span-2 justify-center items-center gap-1.5 text-gray-600",
              children: [jsxRuntime.jsx(Fs, {
                className: "w-4 h-4"
              }), jsxRuntime.jsxs("span", {
                children: [z.duration || "--", " phút"]
              })]
            }), jsxRuntime.jsx("div", {
              className: "hidden md:flex col-span-1 justify-center",
              children: jsxRuntime.jsx("span", {
                className: "text-purple-600 font-semibold",
                children: z.totalPoints
              })
            }), jsxRuntime.jsx("div", {
              className: "hidden md:flex col-span-2 justify-center",
              children: t ? O ? jsxRuntime.jsxs("span", {
                className: "inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium",
                children: [jsxRuntime.jsx(On, {
                  className: "w-4 h-4"
                }), "Hoàn thành"]
              }) : J ? jsxRuntime.jsxs("span", {
                className: "inline-flex items-center gap-1.5 text-gray-400 text-sm",
                children: [jsxRuntime.jsx(gr, {
                  className: "w-4 h-4"
                }), "Chưa mở khóa"]
              }) : jsxRuntime.jsxs("button", {
                className: "inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium",
                children: [jsxRuntime.jsx(Vl, {
                  className: "w-4 h-4"
                }), "Làm bài"]
              }) : jsxRuntime.jsxs("span", {
                className: "inline-flex items-center gap-1.5 text-orange-600 text-sm",
                children: [jsxRuntime.jsx(gr, {
                  className: "w-4 h-4"
                }), "Đăng nhập"]
              })
            }), jsxRuntime.jsxs("div", {
              className: "flex md:hidden items-center justify-between mt-2",
              children: [jsxRuntime.jsxs("div", {
                className: "flex items-center gap-3 text-xs text-gray-500",
                children: [jsxRuntime.jsxs("span", {
                  className: "flex items-center gap-1",
                  children: [jsxRuntime.jsx(Hl, {
                    className: "w-3.5 h-3.5"
                  }), z.questions.length, " câu"]
                }), jsxRuntime.jsxs("span", {
                  className: "flex items-center gap-1",
                  children: [jsxRuntime.jsx(Fs, {
                    className: "w-3.5 h-3.5"
                  }), z.duration || "--", "'"]
                }), q > 0 && jsxRuntime.jsxs("span", {
                  className: "text-blue-600",
                  children: [q, " TN"]
                }), V > 0 && jsxRuntime.jsxs("span", {
                  className: "text-orange-600",
                  children: [V, " TL"]
                })]
              }), t ? O ? jsxRuntime.jsx(On, {
                className: "w-5 h-5 text-green-500"
              }) : J ? jsxRuntime.jsx(gr, {
                className: "w-4 h-4 text-gray-400"
              }) : jsxRuntime.jsxs("span", {
                className: "text-xs font-medium text-purple-600 flex items-center gap-1",
                children: [jsxRuntime.jsx(Vl, {
                  className: "w-3.5 h-3.5"
                }), " Làm bài"]
              }) : jsxRuntime.jsx(gr, {
                className: "w-4 h-4 text-orange-500"
              })]
            })]
          }, z._id);
        })
      })]
    }), w && m && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
      onClick: B,
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200",
        onClick: z => z.stopPropagation(),
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-center justify-between p-4 border-b",
          children: [jsxRuntime.jsx("h3", {
            className: "text-lg font-semibold text-gray-900",
            children: "Xác nhận làm bài"
          }), jsxRuntime.jsx("button", {
            onClick: B,
            className: "p-1 hover:bg-gray-100 rounded-lg transition",
            children: jsxRuntime.jsx(Bn, {
              className: "w-5 h-5 text-gray-500"
            })
          })]
        }), jsxRuntime.jsxs("div", {
          className: "p-4",
          children: [jsxRuntime.jsxs("div", {
            className: "bg-purple-50 rounded-lg p-4 mb-4",
            children: [jsxRuntime.jsx("p", {
              className: "text-xs text-purple-600 font-medium mb-1",
              children: m.category?.name
            }), jsxRuntime.jsx("h4", {
              className: "font-semibold text-gray-900",
              children: m.title
            })]
          }), jsxRuntime.jsxs("div", {
            className: "grid grid-cols-2 gap-3 mb-4",
            children: [jsxRuntime.jsxs("div", {
              className: "bg-gray-50 rounded-lg p-3 text-center",
              children: [jsxRuntime.jsxs("div", {
                className: "flex items-center justify-center gap-1.5 text-gray-600 mb-1",
                children: [jsxRuntime.jsx(Hl, {
                  className: "w-4 h-4"
                }), jsxRuntime.jsx("span", {
                  className: "text-sm",
                  children: "Số câu hỏi"
                })]
              }), jsxRuntime.jsx("p", {
                className: "text-xl font-bold text-gray-900",
                children: m.questions.length
              })]
            }), jsxRuntime.jsxs("div", {
              className: "bg-gray-50 rounded-lg p-3 text-center",
              children: [jsxRuntime.jsxs("div", {
                className: "flex items-center justify-center gap-1.5 text-gray-600 mb-1",
                children: [jsxRuntime.jsx(Fs, {
                  className: "w-4 h-4"
                }), jsxRuntime.jsx("span", {
                  className: "text-sm",
                  children: "Thời gian"
                })]
              }), jsxRuntime.jsxs("p", {
                className: "text-xl font-bold text-gray-900",
                children: [m.duration || "--", " phút"]
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex gap-2 mb-4",
            children: [m.questions.filter(z => z.type === "multiple_choice").length > 0 && jsxRuntime.jsxs("span", {
              className: "inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs",
              children: [jsxRuntime.jsx(Ya, {
                className: "w-3 h-3"
              }), m.questions.filter(z => z.type === "multiple_choice").length, " Trắc nghiệm"]
            }), m.questions.filter(z => z.type === "essay").length > 0 && jsxRuntime.jsxs("span", {
              className: "inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs",
              children: [jsxRuntime.jsx(Ka, {
                className: "w-3 h-3"
              }), m.questions.filter(z => z.type === "essay").length, " Tự luận"]
            })]
          }), jsxRuntime.jsx("div", {
            className: "bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4",
            children: jsxRuntime.jsxs("div", {
              className: "flex gap-2",
              children: [jsxRuntime.jsx(_r, {
                className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5"
              }), jsxRuntime.jsxs("div", {
                className: "text-sm text-amber-800",
                children: [jsxRuntime.jsx("p", {
                  className: "font-medium mb-1",
                  children: "Lưu ý quan trọng:"
                }), jsxRuntime.jsxs("ul", {
                  className: "list-disc list-inside space-y-0.5 text-xs",
                  children: [jsxRuntime.jsxs("li", {
                    children: ["Mỗi bài kiểm tra chỉ được làm ", jsxRuntime.jsx("strong", {
                      children: "1 lần"
                    })]
                  }), jsxRuntime.jsx("li", {
                    children: "Thời gian bắt đầu tính khi vào làm bài"
                  }), jsxRuntime.jsx("li", {
                    children: "Không thoát giữa chừng để tránh mất dữ liệu"
                  })]
                })]
              })]
            })
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex gap-3 p-4 border-t bg-gray-50 rounded-b-xl",
          children: [jsxRuntime.jsx("button", {
            onClick: B,
            className: "flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium",
            children: "Hủy"
          }), jsxRuntime.jsxs("button", {
            onClick: L,
            className: "flex-1 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2",
            children: [jsxRuntime.jsx(Vl, {
              className: "w-4 h-4"
            }), "Bắt đầu làm bài"]
          })]
        })]
      })
    })]
  });
}
export { QuizzesPage };
