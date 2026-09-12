// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useMutation, apiClient, jsxRuntime, ql, Bn, qi, Ke, hy, _u, Cp, nn, yx, xx } from './runtime.js';
function StoryQuiz({
  storybookId: t,
  storybookTitle: e,
  isOpen: n,
  onClose: i
}) {
  const [r, l] = React.useState("setup"),
    [o, d] = React.useState(5),
    [f, p] = React.useState([]),
    [m, x] = React.useState([]),
    [w, _] = React.useState(0),
    [k, E] = React.useState([]),
    [C, A] = React.useState(null),
    [R, L] = React.useState(null),
    B = useMutation({
      mutationFn: async Q => (await apiClient.post(`/storybooks/${t}/generate-quiz`, {
        numberOfQuestions: Q
      })).data,
      onSuccess: Q => {
        p(Q.questions), x(Q._quizData), E(new Array(Q.questions.length).fill(-1)), _(0), l("taking");
      },
      onError: Q => {
        alert(Q.response?.data?.error || "Không thể tạo đề. Vui lòng thử lại."), l("setup");
      }
    }),
    z = useMutation({
      mutationFn: async () => (await apiClient.post(`/storybooks/${t}/submit-quiz`, {
        quizId: m,
        userAnswers: k
      })).data,
      onSuccess: Q => {
        A(Q), l("result");
      },
      onError: error => alert(error.response?.data?.error || "Không nộp được bài. Vui lòng thử lại.")
    }),
    q = () => {
      l("loading"), B.mutate(o);
    },
    V = Q => {
      const X = [...k];
      X[w] = Q, E(X);
    },
    J = () => {
      w < f.length - 1 && _(w + 1);
    },
    O = () => {
      w > 0 && _(w - 1);
    },
    P = () => {
      k.some(Q => Q === -1) && !confirm("Bạn chưa trả lời hết các câu hỏi. Bạn có muốn nộp bài không?") || z.mutate();
    },
    se = () => {
      l("setup"), p([]), x([]), E([]), A(null), _(0), L(null);
    },
    ae = () => {
      se(), i();
    };
  if (!n) return null;
  const ue = k.filter(Q => Q !== -1).length;
  return jsxRuntime.jsx("div", {
    className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
    children: jsxRuntime.jsxs("div", {
      className: "bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col",
      children: [jsxRuntime.jsxs("div", {
        className: "bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-center gap-3",
          children: [jsxRuntime.jsx("div", {
            className: "bg-white/20 p-2 rounded-lg",
            children: jsxRuntime.jsx(ql, {
              className: "w-6 h-6"
            })
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("h2", {
              className: "font-bold text-lg",
              children: "Trắc nghiệm AI"
            }), jsxRuntime.jsx("p", {
              className: "text-sm opacity-80 truncate max-w-[300px]",
              children: e
            })]
          })]
        }), jsxRuntime.jsx("button", {
          onClick: ae,
          className: "p-2 hover:bg-white/20 rounded-lg transition",
          children: jsxRuntime.jsx(Bn, {
            className: "w-5 h-5"
          })
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flex-1 overflow-y-auto p-6",
        children: [r === "setup" && jsxRuntime.jsxs("div", {
          className: "text-center py-8",
          children: [jsxRuntime.jsx("div", {
            className: "w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4",
            children: jsxRuntime.jsx(qi, {
              className: "w-10 h-10 text-purple-600"
            })
          }), jsxRuntime.jsx("h3", {
            className: "text-xl font-bold text-gray-900 mb-2",
            children: "Tạo đề trắc nghiệm bằng AI"
          }), jsxRuntime.jsx("p", {
            className: "text-gray-500 mb-6 max-w-md mx-auto",
            children: "AI sẽ tạo câu hỏi trắc nghiệm dựa trên nội dung tài liệu. Chọn số câu hỏi bạn muốn."
          }), jsxRuntime.jsxs("div", {
            className: "mb-6",
            children: [jsxRuntime.jsx("label", {
              className: "block text-sm font-medium text-gray-700 mb-2",
              children: "Số câu hỏi"
            }), jsxRuntime.jsx("div", {
              className: "flex items-center justify-center gap-3",
              children: [5, 10, 15, 20].map(Q => jsxRuntime.jsxs("button", {
                onClick: () => d(Q),
                className: `px-4 py-2 rounded-lg font-medium transition ${o === Q ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                children: [Q, " câu"]
              }, Q))
            })]
          }), jsxRuntime.jsxs("button", {
            onClick: q,
            className: "px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition flex items-center gap-2 mx-auto",
            children: [jsxRuntime.jsx(ql, {
              className: "w-5 h-5"
            }), "Bắt đầu"]
          })]
        }), r === "loading" && jsxRuntime.jsxs("div", {
          className: "text-center py-16",
          children: [jsxRuntime.jsx(Ke, {
            className: "w-12 h-12 animate-spin text-purple-600 mx-auto mb-4"
          }), jsxRuntime.jsx("h3", {
            className: "text-lg font-medium text-gray-900 mb-2",
            children: "Đang tạo đề..."
          }), jsxRuntime.jsx("p", {
            className: "text-gray-500",
            children: "AI đang phân tích nội dung và tạo câu hỏi"
          })]
        }), r === "taking" && f.length > 0 && jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsxs("div", {
            className: "mb-6",
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center justify-between text-sm text-gray-600 mb-2",
              children: [jsxRuntime.jsxs("span", {
                children: ["Câu ", w + 1, "/", f.length]
              }), jsxRuntime.jsxs("span", {
                children: ["Đã trả lời: ", ue, "/", f.length]
              })]
            }), jsxRuntime.jsx("div", {
              className: "w-full bg-gray-200 rounded-full h-2",
              children: jsxRuntime.jsx("div", {
                className: "bg-purple-600 h-2 rounded-full transition-all",
                style: {
                  width: `${(w + 1) / f.length * 100}%`
                }
              })
            })]
          }), jsxRuntime.jsxs("div", {
            className: "bg-gray-50 rounded-xl p-6 mb-6",
            children: [jsxRuntime.jsx("h3", {
              className: "text-lg font-medium text-gray-900 mb-4",
              children: f[w].question
            }), jsxRuntime.jsx("div", {
              className: "space-y-3",
              children: f[w].options.map((Q, X) => jsxRuntime.jsxs("button", {
                onClick: () => V(X),
                className: `w-full text-left p-4 rounded-lg border-2 transition ${k[w] === X ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300 bg-white"}`,
                children: [jsxRuntime.jsx("span", {
                  className: `inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-sm font-medium ${k[w] === X ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`,
                  children: String.fromCharCode(65 + X)
                }), Q]
              }, X))
            })]
          }), jsxRuntime.jsx("div", {
            className: "flex flex-wrap gap-2 justify-center mb-6",
            children: f.map((Q, X) => jsxRuntime.jsx("button", {
              onClick: () => _(X),
              className: `w-8 h-8 rounded-full text-sm font-medium transition ${X === w ? "bg-purple-600 text-white" : k[X] !== -1 ? "bg-green-100 text-green-700 border-2 border-green-300" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
              children: X + 1
            }, X))
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center justify-between",
            children: [jsxRuntime.jsx("button", {
              onClick: O,
              disabled: w === 0,
              className: "px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
              children: "← Trước"
            }), w === f.length - 1 ? jsxRuntime.jsxs("button", {
              onClick: P,
              disabled: z.isPending,
              className: "px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2",
              children: [z.isPending ? jsxRuntime.jsx(Ke, {
                className: "w-4 h-4 animate-spin"
              }) : jsxRuntime.jsx(hy, {
                className: "w-4 h-4"
              }), "Nộp bài"]
            }) : jsxRuntime.jsxs("button", {
              onClick: J,
              className: "px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1",
              children: ["Tiếp ", jsxRuntime.jsx(_u, {
                className: "w-4 h-4"
              })]
            })]
          })]
        }), r === "result" && C && jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsxs("div", {
            className: "text-center mb-8",
            children: [jsxRuntime.jsx("div", {
              className: `w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${C.score >= 80 ? "bg-green-100" : C.score >= 50 ? "bg-yellow-100" : "bg-red-100"}`,
              children: jsxRuntime.jsx(Cp, {
                className: `w-12 h-12 ${C.score >= 80 ? "text-green-600" : C.score >= 50 ? "text-yellow-600" : "text-red-600"}`
              })
            }), jsxRuntime.jsx("h3", {
              className: "text-2xl font-bold text-gray-900 mb-1",
              children: C.score >= 80 ? "Xuất sắc!" : C.score >= 50 ? "Khá tốt!" : "Cần cố gắng thêm!"
            }), jsxRuntime.jsxs("p", {
              className: "text-4xl font-bold text-purple-600 mb-2",
              children: [C.score, "%"]
            }), jsxRuntime.jsxs("p", {
              className: "text-gray-500",
              children: ["Đúng ", C.correctCount, "/", C.totalQuestions, " câu"]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "space-y-4",
            children: [jsxRuntime.jsxs("h4", {
              className: "font-semibold text-gray-900 flex items-center gap-2",
              children: [jsxRuntime.jsx(nn, {
                className: "w-5 h-5"
              }), "Xem lại đáp án"]
            }), C.questions.map((Q, X) => jsxRuntime.jsx("div", {
              className: `p-4 rounded-lg border-2 ${Q.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`,
              children: jsxRuntime.jsxs("div", {
                className: "flex items-start gap-3",
                children: [Q.isCorrect ? jsxRuntime.jsx(hy, {
                  className: "w-5 h-5 text-green-600 mt-0.5 shrink-0"
                }) : jsxRuntime.jsx(yx, {
                  className: "w-5 h-5 text-red-600 mt-0.5 shrink-0"
                }), jsxRuntime.jsxs("div", {
                  className: "flex-1",
                  children: [jsxRuntime.jsxs("p", {
                    className: "font-medium text-gray-900 mb-2",
                    children: ["Câu ", X + 1, ": ", Q.question]
                  }), jsxRuntime.jsxs("div", {
                    className: "text-sm space-y-1",
                    children: [jsxRuntime.jsxs("p", {
                      children: [jsxRuntime.jsx("span", {
                        className: "text-gray-500",
                        children: "Bạn chọn:"
                      }), " ", jsxRuntime.jsx("span", {
                        className: Q.isCorrect ? "text-green-700" : "text-red-700",
                        children: Q.userAnswer >= 0 ? `${String.fromCharCode(65 + Q.userAnswer)}. ${Q.options[Q.userAnswer]}` : "Chưa trả lời"
                      })]
                    }), !Q.isCorrect && jsxRuntime.jsxs("p", {
                      children: [jsxRuntime.jsx("span", {
                        className: "text-gray-500",
                        children: "Đáp án đúng:"
                      }), " ", jsxRuntime.jsxs("span", {
                        className: "text-green-700",
                        children: [String.fromCharCode(65 + Q.correctAnswer), ". ", Q.options[Q.correctAnswer]]
                      })]
                    })]
                  }), jsxRuntime.jsx("button", {
                    onClick: () => L(R === X ? null : X),
                    className: "text-sm text-purple-600 hover:underline mt-2",
                    children: R === X ? "Ẩn giải thích" : "Xem giải thích"
                  }), R === X && jsxRuntime.jsx("div", {
                    className: "mt-2 p-3 bg-white rounded-lg text-sm text-gray-600",
                    children: Q.explanation
                  })]
                })]
              })
            }, X))]
          }), jsxRuntime.jsxs("div", {
            className: "flex justify-center mt-6 gap-3",
            children: [jsxRuntime.jsxs("button", {
              onClick: se,
              className: "px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 flex items-center gap-2",
              children: [jsxRuntime.jsx(xx, {
                className: "w-4 h-4"
              }), "Làm lại"]
            }), jsxRuntime.jsx("button", {
              onClick: ae,
              className: "px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50",
              children: "Đóng"
            })]
          })]
        })]
      })]
    })
  });
}
export { StoryQuiz };
