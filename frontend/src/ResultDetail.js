// Recovered from the surviving frontend bundle; local variable names are not original.
import { useParams, useQuery, apiClient, jsxRuntime, Ke, Link, Ti, Cp, On, _r, Ya, Ka, qi } from './runtime.js';
import { useAuth } from './useAuth.js';
function ResultDetail() {
  const {
      id: t
    } = useParams(),
    {
      user: e
    } = useAuth(),
    {
      data: n,
      isLoading: i
    } = useQuery({
      queryKey: ["my-result-detail", t],
      queryFn: async () => (await apiClient.get(`/quizzes/my-results/${t}`)).data.result,
      enabled: !!e && !!t
    }),
    r = l => new Date(l).toLocaleString("vi-VN");
  return e ? i ? jsxRuntime.jsx("div", {
    className: "flex justify-center py-12",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-purple-600"
    })
  }) : n ? jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs(Link, {
      to: "/my-results",
      className: "inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6",
      children: [jsxRuntime.jsx(Ti, {
        className: "w-4 h-4"
      }), " Quay lại danh sách"]
    }), jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm p-6 mb-6",
      children: [jsxRuntime.jsxs("div", {
        className: "flex items-start justify-between mb-4",
        children: [jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("h1", {
            className: "text-2xl font-bold text-gray-900 mb-2",
            children: n.quiz?.title
          }), jsxRuntime.jsxs("p", {
            className: "text-sm text-gray-500",
            children: ["Nộp bài: ", r(n.submittedAt)]
          }), n.gradedAt && jsxRuntime.jsxs("p", {
            className: "text-sm text-gray-500",
            children: ["Chấm điểm: ", r(n.gradedAt)]
          })]
        }), jsxRuntime.jsx("div", {
          className: "text-right",
          children: jsxRuntime.jsxs("div", {
            className: "flex items-center gap-2",
            children: [jsxRuntime.jsx(Cp, {
              className: `w-6 h-6 ${n.percentage >= 80 ? "text-yellow-500" : n.percentage >= 50 ? "text-blue-500" : "text-gray-400"}`
            }), jsxRuntime.jsxs("span", {
              className: "text-3xl font-bold text-gray-900",
              children: [n.percentage, "%"]
            })]
          })
        })]
      }), jsxRuntime.jsxs("div", {
        className: "grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg",
        children: [jsxRuntime.jsxs("div", {
          className: "text-center",
          children: [jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500",
            children: "Điểm trắc nghiệm"
          }), jsxRuntime.jsx("p", {
            className: "text-2xl font-bold text-blue-600",
            children: n.mcScore
          })]
        }), jsxRuntime.jsxs("div", {
          className: "text-center",
          children: [jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500",
            children: "Điểm tự luận"
          }), jsxRuntime.jsx("p", {
            className: "text-2xl font-bold text-purple-600",
            children: n.isGraded ? n.essayScore : "?"
          })]
        }), jsxRuntime.jsxs("div", {
          className: "text-center",
          children: [jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500",
            children: "Tổng điểm"
          }), jsxRuntime.jsxs("p", {
            className: "text-2xl font-bold text-gray-900",
            children: [n.totalScore, "/", n.maxScore]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "text-center",
          children: [jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500",
            children: "Trạng thái"
          }), n.isGraded ? jsxRuntime.jsxs("span", {
            className: "inline-flex items-center gap-1 text-green-600 font-medium",
            children: [jsxRuntime.jsx(On, {
              className: "w-4 h-4"
            }), " Đã chấm"]
          }) : jsxRuntime.jsxs("span", {
            className: "inline-flex items-center gap-1 text-orange-600 font-medium",
            children: [jsxRuntime.jsx(_r, {
              className: "w-4 h-4"
            }), " Chờ chấm"]
          })]
        })]
      })]
    }), jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm p-6",
      children: [jsxRuntime.jsx("h3", {
        className: "text-lg font-bold text-gray-900 mb-4",
        children: "Chi tiết kết quả"
      }), jsxRuntime.jsx("div", {
        className: "space-y-4",
        children: n.answers.map((l, o) => jsxRuntime.jsxs("div", {
          className: `border rounded-lg p-4 ${l.questionType === "multiple_choice" ? l.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200" : "bg-purple-50 border-purple-200"}`,
          children: [jsxRuntime.jsxs("div", {
            className: "flex items-start justify-between mb-3",
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center gap-2",
              children: [l.questionType === "multiple_choice" ? jsxRuntime.jsx(Ya, {
                className: "w-5 h-5 text-blue-500"
              }) : jsxRuntime.jsx(Ka, {
                className: "w-5 h-5 text-purple-500"
              }), jsxRuntime.jsxs("span", {
                className: "font-medium text-gray-900",
                children: ["Câu ", o + 1, ": ", l.questionContent]
              })]
            }), jsxRuntime.jsxs("span", {
              className: "text-sm font-medium",
              children: [l.points, "/", l.maxPoints, " điểm"]
            })]
          }), l.questionType === "multiple_choice" && jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [jsxRuntime.jsxs("div", {
              className: "bg-white rounded-lg p-3 mb-3",
              children: [jsxRuntime.jsx("p", {
                className: "text-sm text-gray-600 mb-2",
                children: "Các đáp án:"
              }), jsxRuntime.jsx("div", {
                className: "space-y-2",
                children: l.options && l.options.length > 0 ? l.options.map((d, f) => {
                  const p = d.content === l.userAnswer,
                    m = d.isCorrect;
                  let x = "bg-gray-50",
                    w = "text-gray-700",
                    _ = "border-gray-200";
                  return m && (x = "bg-green-50", w = "text-green-700 font-medium", _ = "border-green-300"), p && !m && (x = "bg-red-50", w = "text-red-700", _ = "border-red-300"), jsxRuntime.jsx("div", {
                    className: `px-3 py-2 rounded-lg border ${x} ${_}`,
                    children: jsxRuntime.jsxs("div", {
                      className: "flex items-center justify-between",
                      children: [jsxRuntime.jsxs("span", {
                        className: w,
                        children: [String.fromCharCode(65 + f), ". ", d.content]
                      }), jsxRuntime.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [p && jsxRuntime.jsx("span", {
                          className: `text-xs px-2 py-0.5 rounded ${m ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
                          children: "Bạn chọn"
                        }), m && jsxRuntime.jsx(On, {
                          className: "w-4 h-4 text-green-600"
                        })]
                      })]
                    })
                  }, d.id || f);
                }) : jsxRuntime.jsxs(jsxRuntime.Fragment, {
                  children: [jsxRuntime.jsxs("p", {
                    className: `font-medium ${l.isCorrect ? "text-green-700" : "text-red-700"}`,
                    children: ["Bạn chọn: ", l.userAnswer || "(Không trả lời)"]
                  }), !l.isCorrect && jsxRuntime.jsxs("p", {
                    className: "text-green-700",
                    children: ["Đáp án đúng: ", l.correctAnswer]
                  })]
                })
              })]
            }), jsxRuntime.jsx("div", {
              className: "flex items-center gap-2 mb-2",
              children: l.isCorrect ? jsxRuntime.jsxs("span", {
                className: "inline-flex items-center gap-1 text-green-600 text-sm font-medium",
                children: [jsxRuntime.jsx(On, {
                  className: "w-4 h-4"
                }), " Đúng"]
              }) : jsxRuntime.jsxs("span", {
                className: "inline-flex items-center gap-1 text-red-600 text-sm font-medium",
                children: [jsxRuntime.jsx(_r, {
                  className: "w-4 h-4"
                }), " Sai"]
              })
            }), l.explanation && jsxRuntime.jsxs("div", {
              className: "mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg",
              children: [jsxRuntime.jsxs("div", {
                className: "flex items-center gap-1 text-xs text-amber-700 font-medium mb-1",
                children: [jsxRuntime.jsx(qi, {
                  className: "w-3 h-3"
                }), "Giải thích"]
              }), jsxRuntime.jsx("p", {
                className: "text-sm text-amber-800 whitespace-pre-wrap",
                children: l.explanation
              })]
            })]
          }), l.questionType === "essay" && jsxRuntime.jsxs("div", {
            className: "bg-white rounded-lg p-3",
            children: [jsxRuntime.jsx("p", {
              className: "text-sm text-gray-600 mb-1",
              children: "Câu trả lời của bạn:"
            }), jsxRuntime.jsx("p", {
              className: "whitespace-pre-wrap text-gray-800 mb-3",
              children: l.userAnswer || "(Không trả lời)"
            }), l.essayGrade !== void 0 && l.essayGrade !== null ? jsxRuntime.jsxs("div", {
              className: "border-t pt-3 mt-3",
              children: [jsxRuntime.jsxs("p", {
                className: "text-sm text-green-600 font-medium mb-1",
                children: ["Đã chấm: ", l.essayGrade, "/", l.maxPoints, " điểm"]
              }), l.essayFeedback && jsxRuntime.jsxs("p", {
                className: "text-sm text-gray-600",
                children: [jsxRuntime.jsx("span", {
                  className: "font-medium",
                  children: "Nhận xét:"
                }), " ", l.essayFeedback]
              })]
            }) : jsxRuntime.jsx("p", {
              className: "text-sm text-orange-600 italic",
              children: "* Câu hỏi tự luận đang chờ giáo viên chấm điểm"
            })]
          })]
        }, l.questionId))
      })]
    }), jsxRuntime.jsx("div", {
      className: "mt-6 flex justify-center",
      children: jsxRuntime.jsx(Link, {
        to: "/my-results",
        className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",
        children: "Về danh sách kết quả"
      })
    })]
  }) : jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: [jsxRuntime.jsx("h2", {
      className: "text-xl font-semibold text-gray-900 mb-2",
      children: "Không tìm thấy kết quả"
    }), jsxRuntime.jsxs(Link, {
      to: "/my-results",
      className: "inline-flex items-center gap-2 text-blue-600 hover:underline",
      children: [jsxRuntime.jsx(Ti, {
        className: "w-4 h-4"
      }), " Quay lại danh sách"]
    })]
  }) : jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: [jsxRuntime.jsx("h2", {
      className: "text-xl font-semibold text-gray-900 mb-4",
      children: "Vui lòng đăng nhập"
    }), jsxRuntime.jsx(Link, {
      to: "/login",
      state: {
        from: `/my-results/${t}`
      },
      className: "text-purple-600 hover:underline",
      children: "Đăng nhập ngay"
    })]
  });
}
export { ResultDetail };
