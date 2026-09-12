// Recovered from the surviving frontend bundle; local variable names are not original.
import { useParams, useNavigate, React, useQuery, apiClient, useMutation, jsxRuntime, Ke, _r, Link, Ti, On, Ya, Ka, qi, Fs, Id } from './runtime.js';
import { useAuth } from './useAuth.js';
function QuizPage() {
  const {
      id: t
    } = useParams(),
    {
      user: e
    } = useAuth(),
    n = useNavigate(),
    [i, r] = React.useState(() => { try { return JSON.parse(localStorage.getItem(`quiz-draft:${e?._id}:${t}`) || '{}'); } catch { return {}; } }),
    [l, o] = React.useState(null),
    [d, f] = React.useState(!1),
    [p, m] = React.useState(null),
    [x, w] = React.useState(!1),
    [_, k] = React.useState(null);
  React.useEffect(() => {
    if (e && !p) localStorage.setItem(`quiz-draft:${e._id}:${t}`, JSON.stringify(i));
  }, [i, e, t, p]);
  React.useEffect(() => {
    e || n("/login", {
      state: {
        from: `/quiz/${t}`
      }
    });
  }, [e, n, t]);
  const {
      data: E,
      isLoading: C,
      error: A
    } = useQuery({
      queryKey: ["quiz", t],
      queryFn: async () => (await apiClient.get(`/quizzes/${t}`)).data,
      enabled: !!e
    }),
    R = E?.quiz;
  React.useEffect(() => {
    E?.hasSubmitted && (w(!0), k(E.existingResultId || null));
  }, [E]), React.useEffect(() => {
    if (!d || !R?.duration || l === null) return;
    if (l <= 0) {
      if (!L.isPending && !L.isSuccess && !L.isError) L.mutate();
      return;
    }
    const J = setInterval(() => {
      o(O => O !== null ? O - 1 : null);
    }, 1e3);
    return () => clearInterval(J);
  }, [d, l]);
  const L = useMutation({
      mutationFn: async () => (await apiClient.post(`/quizzes/${t}/submit`, {
        answers: i
      })).data,
      onSuccess: J => { localStorage.removeItem(`quiz-draft:${e._id}:${t}`); f(false); m(J); },
      onError: error => { alert(error.response?.data?.error || "Không nộp được bài. Vui lòng thử lại."); }
    }),
    B = async () => {
      try {
        const response = await apiClient.post(`/quizzes/${t}/start`);
        o(response.data.remainingSeconds); f(true);
      } catch (error) { alert(error.response?.data?.error || "Không bắt đầu được bài kiểm tra."); }
    },
    z = (J, O) => {
      r({
        ...i,
        [J]: O
      });
    },
    q = () => {
      confirm("Bạn có chắc muốn nộp bài?") && L.mutate();
    },
    V = J => {
      const O = Math.floor(J / 60),
        P = J % 60;
      return `${O}:${P.toString().padStart(2, "0")}`;
    };
  if (!e) return null;
  if (C) return jsxRuntime.jsx("div", {
    className: "flex justify-center py-12",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-purple-600"
    })
  });
  if (!R) {
    const J = A?.response?.data;
    return J?.previousQuiz ? jsxRuntime.jsxs("div", {
      className: "max-w-4xl mx-auto px-4 py-12 text-center",
      children: [jsxRuntime.jsx(_r, {
        className: "w-16 h-16 text-orange-500 mx-auto mb-4"
      }), jsxRuntime.jsx("h2", {
        className: "text-xl font-semibold text-gray-900 mb-2",
        children: "Bài kiểm tra bị khóa"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-600 mb-4",
        children: "Bạn cần hoàn thành bài kiểm tra trước đó"
      }), jsxRuntime.jsxs("p", {
        className: "text-gray-500 mb-6",
        children: ["Vui lòng hoàn thành: ", jsxRuntime.jsx("strong", {
          children: J.previousQuiz.title
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flex gap-3 justify-center",
        children: [jsxRuntime.jsx(Link, {
          to: `/quiz/${J.previousQuiz._id}`,
          className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700",
          children: "Làm bài trước"
        }), jsxRuntime.jsxs(Link, {
          to: "/quizzes",
          className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200",
          children: [jsxRuntime.jsx(Ti, {
            className: "w-4 h-4"
          }), " Quay lại danh sách"]
        })]
      })]
    }) : jsxRuntime.jsxs("div", {
      className: "max-w-4xl mx-auto px-4 py-12 text-center",
      children: [jsxRuntime.jsx("h2", {
        className: "text-xl font-semibold text-gray-900 mb-2",
        children: "Không tìm thấy bài kiểm tra"
      }), jsxRuntime.jsxs(Link, {
        to: "/quizzes",
        className: "inline-flex items-center gap-2 text-blue-600 hover:underline",
        children: [jsxRuntime.jsx(Ti, {
          className: "w-4 h-4"
        }), " Quay lại danh sách"]
      })]
    });
  }
  if (x && !p) return jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: [jsxRuntime.jsx(On, {
      className: "w-16 h-16 text-green-500 mx-auto mb-4"
    }), jsxRuntime.jsx("h2", {
      className: "text-xl font-semibold text-gray-900 mb-2",
      children: "Bạn đã làm bài kiểm tra này rồi"
    }), jsxRuntime.jsx("p", {
      className: "text-gray-600 mb-6",
      children: "Mỗi bài kiểm tra chỉ được làm 1 lần"
    }), jsxRuntime.jsxs("div", {
      className: "flex gap-3 justify-center",
      children: [_ && jsxRuntime.jsx(Link, {
        to: `/my-results/${_}`,
        className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700",
        children: "Xem kết quả"
      }), jsxRuntime.jsxs(Link, {
        to: "/quizzes",
        className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200",
        children: [jsxRuntime.jsx(Ti, {
          className: "w-4 h-4"
        }), " Quay lại danh sách"]
      })]
    })]
  });
  if (p) return jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm p-6 mb-6",
      children: [jsxRuntime.jsxs("div", {
        className: "text-center mb-6",
        children: [jsxRuntime.jsx(On, {
          className: "w-16 h-16 text-green-500 mx-auto mb-4"
        }), jsxRuntime.jsx("h2", {
          className: "text-2xl font-bold text-gray-900 mb-2",
          children: "Đã nộp bài!"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600",
          children: p.message
        })]
      }), jsxRuntime.jsxs("div", {
        className: "grid grid-cols-3 gap-4 mb-6",
        children: [jsxRuntime.jsxs("div", {
          className: "bg-gray-50 rounded-lg p-4 text-center",
          children: [jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500",
            children: "Điểm hiện tại"
          }), jsxRuntime.jsx("p", {
            className: "text-2xl font-bold text-purple-600",
            children: p.totalScore
          })]
        }), jsxRuntime.jsxs("div", {
          className: "bg-gray-50 rounded-lg p-4 text-center",
          children: [jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500",
            children: "Tổng điểm"
          }), jsxRuntime.jsx("p", {
            className: "text-2xl font-bold text-gray-900",
            children: p.maxScore
          })]
        }), jsxRuntime.jsxs("div", {
          className: "bg-gray-50 rounded-lg p-4 text-center",
          children: [jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500",
            children: "Phần trăm"
          }), jsxRuntime.jsxs("p", {
            className: "text-2xl font-bold text-blue-600",
            children: [p.percentage, "%"]
          })]
        })]
      }), !p.isGraded && jsxRuntime.jsxs("div", {
        className: "flex items-center gap-2 justify-center text-orange-600 mb-6 bg-orange-50 p-3 rounded-lg",
        children: [jsxRuntime.jsx(_r, {
          className: "w-5 h-5"
        }), jsxRuntime.jsx("span", {
          children: "Câu hỏi tự luận đang chờ giáo viên chấm điểm"
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flex gap-4 justify-center",
        children: [jsxRuntime.jsx(Link, {
          to: "/quizzes",
          className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",
          children: "Về danh sách"
        }), jsxRuntime.jsx(Link, {
          to: "/my-results",
          className: "px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700",
          children: "Xem kết quả của tôi"
        })]
      })]
    }), jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm p-6",
      children: [jsxRuntime.jsx("h3", {
        className: "text-lg font-bold text-gray-900 mb-4",
        children: "Chi tiết kết quả"
      }), jsxRuntime.jsx("div", {
        className: "space-y-4",
        children: p.results.map((J, O) => jsxRuntime.jsxs("div", {
          className: `border rounded-lg p-4 ${J.questionType === "multiple_choice" ? J.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200" : "bg-purple-50 border-purple-200"}`,
          children: [jsxRuntime.jsxs("div", {
            className: "flex items-start justify-between mb-3",
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center gap-2",
              children: [J.questionType === "multiple_choice" ? jsxRuntime.jsx(Ya, {
                className: "w-5 h-5 text-blue-500"
              }) : jsxRuntime.jsx(Ka, {
                className: "w-5 h-5 text-purple-500"
              }), jsxRuntime.jsxs("span", {
                className: "font-medium text-gray-900",
                children: ["Câu ", O + 1, ": ", J.questionContent]
              })]
            }), jsxRuntime.jsxs("span", {
              className: "text-sm font-medium",
              children: [J.points, "/", J.maxPoints, " điểm"]
            })]
          }), J.questionType === "multiple_choice" && jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [jsxRuntime.jsxs("div", {
              className: "bg-white rounded-lg p-3 mb-3",
              children: [jsxRuntime.jsx("p", {
                className: "text-sm text-gray-600 mb-2",
                children: "Các đáp án:"
              }), jsxRuntime.jsx("div", {
                className: "space-y-2",
                children: J.options && J.options.length > 0 ? J.options.map((P, se) => {
                  const ae = P.content === J.userAnswer,
                    ue = P.isCorrect;
                  let Q = "bg-gray-50",
                    X = "text-gray-700",
                    K = "border-gray-200";
                  return ue && (Q = "bg-green-50", X = "text-green-700 font-medium", K = "border-green-300"), ae && !ue && (Q = "bg-red-50", X = "text-red-700", K = "border-red-300"), jsxRuntime.jsx("div", {
                    className: `px-3 py-2 rounded-lg border ${Q} ${K}`,
                    children: jsxRuntime.jsxs("div", {
                      className: "flex items-center justify-between",
                      children: [jsxRuntime.jsxs("span", {
                        className: X,
                        children: [String.fromCharCode(65 + se), ". ", P.content]
                      }), jsxRuntime.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [ae && jsxRuntime.jsx("span", {
                          className: `text-xs px-2 py-0.5 rounded ${ue ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
                          children: "Bạn chọn"
                        }), ue && jsxRuntime.jsx(On, {
                          className: "w-4 h-4 text-green-600"
                        })]
                      })]
                    })
                  }, P.id || se);
                }) : jsxRuntime.jsxs(jsxRuntime.Fragment, {
                  children: [jsxRuntime.jsxs("p", {
                    className: `font-medium ${J.isCorrect ? "text-green-700" : "text-red-700"}`,
                    children: ["Bạn chọn: ", J.userAnswer || "(Không trả lời)"]
                  }), !J.isCorrect && jsxRuntime.jsxs("p", {
                    className: "text-green-700",
                    children: ["Đáp án đúng: ", J.correctAnswer]
                  })]
                })
              })]
            }), jsxRuntime.jsx("div", {
              className: "flex items-center gap-2 mb-2",
              children: J.isCorrect ? jsxRuntime.jsxs("span", {
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
            }), J.explanation && jsxRuntime.jsxs("div", {
              className: "mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg",
              children: [jsxRuntime.jsxs("div", {
                className: "flex items-center gap-1 text-xs text-amber-700 font-medium mb-1",
                children: [jsxRuntime.jsx(qi, {
                  className: "w-3 h-3"
                }), "Giải thích"]
              }), jsxRuntime.jsx("p", {
                className: "text-sm text-amber-800 whitespace-pre-wrap",
                children: J.explanation
              })]
            })]
          }), J.questionType === "essay" && jsxRuntime.jsxs("div", {
            className: "bg-white rounded-lg p-3",
            children: [jsxRuntime.jsx("p", {
              className: "text-sm text-gray-600 mb-1",
              children: "Câu trả lời của bạn:"
            }), jsxRuntime.jsx("p", {
              className: "whitespace-pre-wrap text-gray-800",
              children: J.userAnswer || "(Không trả lời)"
            }), jsxRuntime.jsx("p", {
              className: "text-sm text-orange-600 mt-2 italic",
              children: "* Câu hỏi tự luận sẽ được giáo viên chấm điểm"
            })]
          })]
        }, J.questionId))
      })]
    })]
  });
  if (!d) {
    const J = R.questions.filter(P => P.type === "multiple_choice").length,
      O = R.questions.filter(P => P.type === "essay").length;
    return jsxRuntime.jsxs("div", {
      className: "max-w-2xl mx-auto px-4 py-12",
      children: [jsxRuntime.jsxs(Link, {
        to: "/quizzes",
        className: "inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6",
        children: [jsxRuntime.jsx(Ti, {
          className: "w-4 h-4"
        }), " Quay lại"]
      }), jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-sm p-8",
        children: [jsxRuntime.jsx("p", {
          className: "text-sm text-purple-600 font-medium mb-2",
          children: R.category?.name
        }), jsxRuntime.jsx("h1", {
          className: "text-2xl font-bold text-gray-900 mb-4",
          children: R.title
        }), R.description && jsxRuntime.jsx("p", {
          className: "text-gray-600 mb-6",
          style: { whiteSpace: 'pre-wrap', lineHeight: 1.8, overflowWrap: 'anywhere' },
          children: R.description
        }), jsxRuntime.jsxs("div", {
          className: "grid grid-cols-2 gap-4 mb-6",
          children: [jsxRuntime.jsxs("div", {
            className: "bg-gray-50 rounded-lg p-4",
            children: [jsxRuntime.jsx("p", {
              className: "text-sm text-gray-500",
              children: "Số câu hỏi"
            }), jsxRuntime.jsx("p", {
              className: "text-xl font-bold text-gray-900",
              children: R.questions.length
            })]
          }), jsxRuntime.jsxs("div", {
            className: "bg-gray-50 rounded-lg p-4",
            children: [jsxRuntime.jsx("p", {
              className: "text-sm text-gray-500",
              children: "Tổng điểm"
            }), jsxRuntime.jsx("p", {
              className: "text-xl font-bold text-purple-600",
              children: R.totalPoints
            })]
          }), R.duration && jsxRuntime.jsxs("div", {
            className: "bg-gray-50 rounded-lg p-4",
            children: [jsxRuntime.jsx("p", {
              className: "text-sm text-gray-500",
              children: "Thời gian"
            }), jsxRuntime.jsxs("p", {
              className: "text-xl font-bold text-gray-900",
              children: [R.duration, " phút"]
            })]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex gap-2 mb-6",
          children: [J > 0 && jsxRuntime.jsxs("span", {
            className: "inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm",
            children: [jsxRuntime.jsx(Ya, {
              className: "w-4 h-4"
            }), " ", J, " câu trắc nghiệm"]
          }), O > 0 && jsxRuntime.jsxs("span", {
            className: "inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm",
            children: [jsxRuntime.jsx(Ka, {
              className: "w-4 h-4"
            }), " ", O, " câu tự luận"]
          })]
        }), jsxRuntime.jsx("button", {
          onClick: B,
          className: "w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold",
          children: "Bắt đầu làm bài"
        })]
      })]
    });
  }
  return jsxRuntime.jsxs("div", {
    className: "max-w-3xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs("div", {
      className: "sticky top-16 z-40 bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between",
      children: [jsxRuntime.jsxs("div", {
        children: [jsxRuntime.jsx("h1", {
          className: "font-bold text-gray-900",
          children: R.title
        }), jsxRuntime.jsxs("p", {
          className: "text-sm text-gray-500",
          children: ["Đã trả lời: ", Object.keys(i).length, "/", R.questions.length]
        })]
      }), l !== null && jsxRuntime.jsxs("div", {
        className: `flex items-center gap-2 px-4 py-2 rounded-lg ${l < 60 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`,
        children: [jsxRuntime.jsx(Fs, {
          className: "w-5 h-5"
        }), jsxRuntime.jsx("span", {
          className: "font-mono font-bold",
          children: V(l)
        })]
      })]
    }), R.description && jsxRuntime.jsxs("details", {
      open: true,
      className: "bg-white rounded-xl shadow-sm p-6 mb-6",
      children: [jsxRuntime.jsx("summary", {
        className: "font-semibold text-purple-700 cursor-pointer",
        children: "Ngữ liệu và yêu cầu của đề"
      }), jsxRuntime.jsx("p", {
        style: { whiteSpace: 'pre-wrap', lineHeight: 1.8, overflowWrap: 'anywhere', marginTop: 16 },
        children: R.description
      })]
    }), jsxRuntime.jsx("div", {
      className: "space-y-6",
      children: R.questions.map((J, O) => jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-sm p-6",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-start gap-3 mb-4",
          children: [jsxRuntime.jsx("span", {
            className: "flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold",
            children: O + 1
          }), jsxRuntime.jsxs("div", {
            className: "flex-1",
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center gap-2 mb-2",
              children: [J.type === "multiple_choice" ? jsxRuntime.jsx(Ya, {
                className: "w-4 h-4 text-blue-500"
              }) : jsxRuntime.jsx(Ka, {
                className: "w-4 h-4 text-purple-500"
              }), jsxRuntime.jsxs("span", {
                className: "text-xs text-gray-500",
                children: [J.type === "multiple_choice" ? "Trắc nghiệm" : "Tự luận", " • ", J.points, " điểm"]
              })]
            }), jsxRuntime.jsx("p", {
              className: "text-gray-900 font-medium",
              children: J.content
            })]
          })]
        }), J.type === "multiple_choice" && J.options && jsxRuntime.jsx("div", {
          className: "space-y-2 ml-11",
          children: J.options.map((P, se) => jsxRuntime.jsxs("label", {
            className: `flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${i[J.id] === P.id ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:bg-gray-50"}`,
            children: [jsxRuntime.jsx("input", {
              type: "radio",
              name: `question-${J.id}`,
              checked: i[J.id] === P.id,
              onChange: () => z(J.id, P.id),
              className: "text-purple-600"
            }), jsxRuntime.jsxs("span", {
              className: "font-medium text-gray-500",
              children: [String.fromCharCode(65 + se), "."]
            }), jsxRuntime.jsx("span", {
              className: "text-gray-900",
              children: P.content
            })]
          }, P.id))
        }), J.type === "essay" && jsxRuntime.jsxs("div", {
          className: "ml-11 space-y-3",
          children: [J.hint && jsxRuntime.jsx("div", {
            className: "bg-purple-50 border border-purple-200 rounded-lg p-3",
            children: jsxRuntime.jsxs("div", {
              className: "flex items-start gap-2",
              children: [jsxRuntime.jsx("span", {
                className: "text-purple-500 text-lg",
                children: "💡"
              }), jsxRuntime.jsxs("div", {
                children: [jsxRuntime.jsx("p", {
                  className: "text-sm font-medium text-purple-700 mb-1",
                  children: "Gợi ý:"
                }), jsxRuntime.jsx("p", {
                  className: "text-sm text-purple-600 whitespace-pre-wrap",
                  children: J.hint
                })]
              })]
            })
          }), jsxRuntime.jsx("textarea", {
            value: i[J.id] || "",
            onChange: P => z(J.id, P.target.value),
            placeholder: "Nhập câu trả lời của bạn...",
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
            rows: 5
          })]
        })]
      }, J.id))
    }), jsxRuntime.jsx("div", {
      className: "mt-8 flex justify-end",
      children: jsxRuntime.jsxs("button", {
        onClick: q,
        disabled: L.isPending,
        className: "flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50",
        children: [L.isPending ? jsxRuntime.jsx(Ke, {
          className: "w-5 h-5 animate-spin"
        }) : jsxRuntime.jsx(Id, {
          className: "w-5 h-5"
        }), "Nộp bài"]
      })
    })]
  });
}
export { QuizPage };
