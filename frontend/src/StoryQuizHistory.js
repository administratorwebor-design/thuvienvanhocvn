// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useQuery, apiClient, jsxRuntime, Ke, ql, Link, nn, Od, _u, Cp, hy, yx } from './runtime.js';
function StoryQuizHistory() {
  const [t, e] = React.useState(null),
    {
      data: n,
      isLoading: i,
      error: r
    } = useQuery({
      queryKey: ["my-quiz-results"],
      queryFn: async () => (await apiClient.get("/storybooks/my-quiz-results?limit=50")).data
    });
  if (i) return jsxRuntime.jsx("div", {
    className: "min-h-[60vh] flex items-center justify-center",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-purple-600"
    })
  });
  if (r) return jsxRuntime.jsxs("div", {
    className: "min-h-[60vh] flex flex-col items-center justify-center",
    children: [jsxRuntime.jsx(ql, {
      className: "w-16 h-16 text-gray-300 mb-4"
    }), jsxRuntime.jsx("p", {
      className: "text-gray-500 mb-4",
      children: "Không thể tải lịch sử. Vui lòng đăng nhập."
    }), jsxRuntime.jsx(Link, {
      to: "/login",
      className: "text-purple-600 hover:text-purple-700",
      children: "Đăng nhập"
    })]
  });
  const l = n?.results || [];
  return jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-6",
    children: [jsxRuntime.jsxs("div", {
      className: "mb-6",
      children: [jsxRuntime.jsxs("h1", {
        className: "text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3",
        children: [jsxRuntime.jsx(ql, {
          className: "w-8 h-8 text-purple-600"
        }), "Lịch sử làm bài AI"]
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500 mt-1",
        children: "Xem lại các bài trắc nghiệm AI đã làm"
      })]
    }), l.length === 0 ? jsxRuntime.jsxs("div", {
      className: "text-center py-16 bg-white rounded-2xl shadow-sm",
      children: [jsxRuntime.jsx("div", {
        className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",
        children: jsxRuntime.jsx(ql, {
          className: "w-10 h-10 text-gray-400"
        })
      }), jsxRuntime.jsx("h3", {
        className: "text-lg font-medium text-gray-900 mb-2",
        children: "Chưa có bài làm nào"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500 mb-4",
        children: "Hãy làm bài trắc nghiệm AI đầu tiên!"
      }), jsxRuntime.jsxs(Link, {
        to: "/storybooks",
        className: "inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700",
        children: [jsxRuntime.jsx(nn, {
          className: "w-4 h-4"
        }), "Xem Storybooks"]
      })]
    }) : jsxRuntime.jsx("div", {
      className: "space-y-4",
      children: l.map(o => jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-sm overflow-hidden",
        children: [jsxRuntime.jsxs("div", {
          className: "p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition",
          onClick: () => e(t === o._id ? null : o._id),
          children: [jsxRuntime.jsx("div", {
            className: "w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0",
            children: o.storybook?.thumbnail ? jsxRuntime.jsx("img", {
              src: o.storybook.thumbnail,
              alt: "",
              className: "w-full h-full object-cover"
            }) : jsxRuntime.jsx("div", {
              className: "w-full h-full flex items-center justify-center",
              children: jsxRuntime.jsx(nn, {
                className: "w-6 h-6 text-gray-400"
              })
            })
          }), jsxRuntime.jsxs("div", {
            className: "flex-1 min-w-0",
            children: [jsxRuntime.jsx("h3", {
              className: "font-medium text-gray-900 truncate",
              children: o.storybook?.title || "Storybook"
            }), jsxRuntime.jsxs("div", {
              className: "flex items-center gap-4 text-sm text-gray-500 mt-1",
              children: [jsxRuntime.jsxs("span", {
                className: "flex items-center gap-1",
                children: [jsxRuntime.jsx(Od, {
                  className: "w-4 h-4"
                }), new Date(o.completedAt).toLocaleDateString("vi-VN")]
              }), jsxRuntime.jsxs("span", {
                children: [o.correctCount, "/", o.totalQuestions, " câu đúng"]
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: `px-3 py-1.5 rounded-full font-bold ${o.score >= 80 ? "bg-green-100 text-green-700" : o.score >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`,
            children: [o.score, "%"]
          }), jsxRuntime.jsx(_u, {
            className: `w-5 h-5 text-gray-400 transition ${t === o._id ? "rotate-90" : ""}`
          })]
        }), t === o._id && jsxRuntime.jsxs("div", {
          className: "border-t px-4 py-4 bg-gray-50",
          children: [jsxRuntime.jsxs("h4", {
            className: "font-medium text-gray-900 mb-3 flex items-center gap-2",
            children: [jsxRuntime.jsx(Cp, {
              className: "w-4 h-4 text-purple-600"
            }), "Chi tiết bài làm"]
          }), jsxRuntime.jsx("div", {
            className: "space-y-3",
            children: o.questions.map((d, f) => jsxRuntime.jsx("div", {
              className: `p-3 rounded-lg ${d.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`,
              children: jsxRuntime.jsxs("div", {
                className: "flex items-start gap-2",
                children: [d.isCorrect ? jsxRuntime.jsx(hy, {
                  className: "w-5 h-5 text-green-600 shrink-0 mt-0.5"
                }) : jsxRuntime.jsx(yx, {
                  className: "w-5 h-5 text-red-600 shrink-0 mt-0.5"
                }), jsxRuntime.jsxs("div", {
                  className: "flex-1",
                  children: [jsxRuntime.jsxs("p", {
                    className: "font-medium text-gray-900 text-sm",
                    children: ["Câu ", f + 1, ": ", d.question]
                  }), jsxRuntime.jsxs("div", {
                    className: "text-xs mt-1 space-y-0.5",
                    children: [jsxRuntime.jsxs("p", {
                      children: [jsxRuntime.jsx("span", {
                        className: "text-gray-500",
                        children: "Bạn chọn:"
                      }), " ", jsxRuntime.jsx("span", {
                        className: d.isCorrect ? "text-green-700" : "text-red-700",
                        children: d.userAnswer >= 0 ? `${String.fromCharCode(65 + d.userAnswer)}. ${d.options[d.userAnswer]}` : "Chưa trả lời"
                      })]
                    }), !d.isCorrect && jsxRuntime.jsxs("p", {
                      children: [jsxRuntime.jsx("span", {
                        className: "text-gray-500",
                        children: "Đáp án đúng:"
                      }), " ", jsxRuntime.jsxs("span", {
                        className: "text-green-700",
                        children: [String.fromCharCode(65 + d.correctAnswer), ". ", d.options[d.correctAnswer]]
                      })]
                    }), jsxRuntime.jsx("p", {
                      className: "text-gray-600 mt-1 italic",
                      children: d.explanation
                    })]
                  })]
                })]
              })
            }, f))
          }), jsxRuntime.jsx("div", {
            className: "mt-4 pt-3 border-t",
            children: jsxRuntime.jsxs(Link, {
              to: `/storybooks/${o.storybook?._id}`,
              className: "text-sm text-purple-600 hover:underline flex items-center gap-1",
              children: ["Xem lại tài liệu ", jsxRuntime.jsx(_u, {
                className: "w-4 h-4"
              })]
            })
          })]
        })]
      }, o._id))
    })]
  });
}
export { StoryQuizHistory };
