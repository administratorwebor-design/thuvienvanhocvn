// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useQueryClient, useQuery, apiClient, useMutation, jsxRuntime, Fs, On, Ke, Ss, Bn, Ya, Ka, _r, Id } from './runtime.js';
function AdminQuizResults() {
  const [t, e] = React.useState(null),
    [n, i] = React.useState({}),
    [r, l] = React.useState("all"),
    o = useQueryClient(),
    {
      data: d,
      isLoading: f
    } = useQuery({
      queryKey: ["quiz-results", r],
      queryFn: async () => {
        let B = "/quizzes/results/all?limit=100";
        return r === "graded" && (B += "&graded=true"), r === "ungraded" && (B += "&graded=false"), (await apiClient.get(B)).data.results;
      }
    }),
    {
      data: p,
      isLoading: m
    } = useQuery({
      queryKey: ["quiz-result-detail", t?._id],
      queryFn: async () => t ? (await apiClient.get(`/quizzes/results/${t._id}`)).data.result : null,
      enabled: !!t
    }),
    x = useMutation({
      mutationFn: async ({
        resultId: B,
        grades: z
      }) => apiClient.patch(`/quizzes/results/${B}/grade`, {
        essayGrades: z
      }),
      onSuccess: () => {
        o.invalidateQueries({
          queryKey: ["quiz-results"]
        }), o.invalidateQueries({
          queryKey: ["quiz-result-detail"]
        }), e(null), i({});
      }
    }),
    w = B => {
      e(B);
      const z = {};
      B.answers.forEach(q => {
        q.questionType === "essay" && (z[q.questionId] = {
          points: q.essayGrade || 0,
          feedback: q.essayFeedback || ""
        });
      }), i(z);
    },
    _ = () => {
      if (!t) return;
      const B = Object.entries(n).map(([z, q]) => ({
        questionId: z,
        points: q.points,
        feedback: q.feedback || void 0
      }));
      x.mutate({
        resultId: t._id,
        grades: B
      });
    },
    k = B => typeof B.quiz == "object" ? B.quiz : null,
    E = B => typeof B.user == "object" ? B.user : null,
    C = B => new Date(B).toLocaleString("vi-VN"),
    A = B => {
      if (!p) return B;
      const z = k(p);
      return !z || !z.questions ? B : z.questions.find(V => V.id === B)?.content || B;
    },
    R = B => {
      if (!p) return;
      const z = k(p);
      return !z || !z.questions ? void 0 : z.questions.find(V => V.id === B)?.hint;
    },
    L = B => {
      if (!p) return;
      const z = k(p);
      return !z || !z.questions ? void 0 : z.questions.find(V => V.id === B)?.explanation;
    };
  return jsxRuntime.jsxs("div", {
    className: "space-y-6",
    children: [jsxRuntime.jsxs("div", {
      className: "flex items-center justify-between",
      children: [jsxRuntime.jsx("h1", {
        className: "text-2xl font-bold text-gray-800",
        children: "Kết quả thi"
      }), jsxRuntime.jsxs("div", {
        className: "flex gap-2",
        children: [jsxRuntime.jsx("button", {
          onClick: () => l("all"),
          className: `px-4 py-2 rounded-lg transition ${r === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: "Tất cả"
        }), jsxRuntime.jsxs("button", {
          onClick: () => l("ungraded"),
          className: `px-4 py-2 rounded-lg transition flex items-center gap-2 ${r === "ungraded" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: [jsxRuntime.jsx(Fs, {
            className: "w-4 h-4"
          }), "Chờ chấm"]
        }), jsxRuntime.jsxs("button", {
          onClick: () => l("graded"),
          className: `px-4 py-2 rounded-lg transition flex items-center gap-2 ${r === "graded" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: [jsxRuntime.jsx(On, {
            className: "w-4 h-4"
          }), "Đã chấm"]
        })]
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
        children: "Chưa có kết quả thi nào"
      }) : jsxRuntime.jsxs("table", {
        className: "w-full",
        children: [jsxRuntime.jsx("thead", {
          className: "bg-gray-50",
          children: jsxRuntime.jsxs("tr", {
            children: [jsxRuntime.jsx("th", {
              className: "px-4 py-3 text-left text-sm font-medium text-gray-600",
              children: "Học sinh"
            }), jsxRuntime.jsx("th", {
              className: "px-4 py-3 text-left text-sm font-medium text-gray-600",
              children: "Bài kiểm tra"
            }), jsxRuntime.jsx("th", {
              className: "px-4 py-3 text-center text-sm font-medium text-gray-600",
              children: "Điểm MC"
            }), jsxRuntime.jsx("th", {
              className: "px-4 py-3 text-center text-sm font-medium text-gray-600",
              children: "Điểm TL"
            }), jsxRuntime.jsx("th", {
              className: "px-4 py-3 text-center text-sm font-medium text-gray-600",
              children: "Tổng"
            }), jsxRuntime.jsx("th", {
              className: "px-4 py-3 text-center text-sm font-medium text-gray-600",
              children: "Trạng thái"
            }), jsxRuntime.jsx("th", {
              className: "px-4 py-3 text-center text-sm font-medium text-gray-600",
              children: "Thời gian"
            }), jsxRuntime.jsx("th", {
              className: "px-4 py-3 text-right text-sm font-medium text-gray-600",
              children: "Thao tác"
            })]
          })
        }), jsxRuntime.jsx("tbody", {
          className: "divide-y divide-gray-100",
          children: d?.map(B => {
            const z = k(B),
              q = E(B),
              V = B.answers.some(J => J.questionType === "essay");
            return jsxRuntime.jsxs("tr", {
              className: "hover:bg-gray-50",
              children: [jsxRuntime.jsx("td", {
                className: "px-4 py-3",
                children: jsxRuntime.jsxs("div", {
                  children: [jsxRuntime.jsx("p", {
                    className: "font-medium text-gray-900",
                    children: q?.fullName || "N/A"
                  }), jsxRuntime.jsx("p", {
                    className: "text-sm text-gray-500",
                    children: q?.email
                  })]
                })
              }), jsxRuntime.jsx("td", {
                className: "px-4 py-3",
                children: jsxRuntime.jsx("p", {
                  className: "text-gray-900",
                  children: z?.title || "N/A"
                })
              }), jsxRuntime.jsx("td", {
                className: "px-4 py-3 text-center",
                children: jsxRuntime.jsx("span", {
                  className: "text-blue-600 font-medium",
                  children: B.mcScore
                })
              }), jsxRuntime.jsx("td", {
                className: "px-4 py-3 text-center",
                children: V ? jsxRuntime.jsx("span", {
                  className: `font-medium ${B.isGraded ? "text-purple-600" : "text-orange-500"}`,
                  children: B.isGraded ? B.essayScore : "?"
                }) : jsxRuntime.jsx("span", {
                  className: "text-gray-400",
                  children: "-"
                })
              }), jsxRuntime.jsxs("td", {
                className: "px-4 py-3 text-center",
                children: [jsxRuntime.jsxs("span", {
                  className: "font-bold text-gray-900",
                  children: [B.totalScore, "/", B.maxScore]
                }), jsxRuntime.jsxs("span", {
                  className: "text-sm text-gray-500 ml-1",
                  children: ["(", B.percentage, "%)"]
                })]
              }), jsxRuntime.jsx("td", {
                className: "px-4 py-3 text-center",
                children: B.isGraded ? jsxRuntime.jsxs("span", {
                  className: "inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs",
                  children: [jsxRuntime.jsx(On, {
                    className: "w-3 h-3"
                  }), " Đã chấm"]
                }) : jsxRuntime.jsxs("span", {
                  className: "inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs",
                  children: [jsxRuntime.jsx(Fs, {
                    className: "w-3 h-3"
                  }), " Chờ chấm"]
                })
              }), jsxRuntime.jsx("td", {
                className: "px-4 py-3 text-center text-sm text-gray-500",
                children: C(B.submittedAt)
              }), jsxRuntime.jsx("td", {
                className: "px-4 py-3 text-right",
                children: jsxRuntime.jsxs("button", {
                  onClick: () => w(B),
                  className: "inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm",
                  children: [jsxRuntime.jsx(Ss, {
                    className: "w-4 h-4"
                  }), !B.isGraded && V ? "Chấm điểm" : "Xem"]
                })
              })]
            }, B._id);
          })
        })]
      })
    }), t && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("h2", {
              className: "text-lg font-semibold",
              children: "Chi tiết bài làm"
            }), jsxRuntime.jsxs("p", {
              className: "text-sm text-gray-500",
              children: [E(t)?.fullName, " - ", k(t)?.title]
            })]
          }), jsxRuntime.jsx("button", {
            onClick: () => {
              e(null), i({});
            },
            className: "p-2 hover:bg-gray-100 rounded-lg",
            children: jsxRuntime.jsx(Bn, {
              className: "w-5 h-5"
            })
          })]
        }), m ? jsxRuntime.jsx("div", {
          className: "p-8 text-center",
          children: jsxRuntime.jsx(Ke, {
            className: "w-8 h-8 animate-spin mx-auto text-blue-600"
          })
        }) : p && jsxRuntime.jsxs("div", {
          className: "p-4 space-y-4",
          children: [jsxRuntime.jsxs("div", {
            className: "grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg",
            children: [jsxRuntime.jsxs("div", {
              className: "text-center",
              children: [jsxRuntime.jsx("p", {
                className: "text-sm text-gray-500",
                children: "Điểm MC"
              }), jsxRuntime.jsx("p", {
                className: "text-2xl font-bold text-blue-600",
                children: p.mcScore
              })]
            }), jsxRuntime.jsxs("div", {
              className: "text-center",
              children: [jsxRuntime.jsx("p", {
                className: "text-sm text-gray-500",
                children: "Điểm Tự luận"
              }), jsxRuntime.jsx("p", {
                className: "text-2xl font-bold text-purple-600",
                children: p.isGraded ? p.essayScore : "?"
              })]
            }), jsxRuntime.jsxs("div", {
              className: "text-center",
              children: [jsxRuntime.jsx("p", {
                className: "text-sm text-gray-500",
                children: "Tổng điểm"
              }), jsxRuntime.jsxs("p", {
                className: "text-2xl font-bold text-gray-900",
                children: [p.totalScore, "/", p.maxScore]
              })]
            }), jsxRuntime.jsxs("div", {
              className: "text-center",
              children: [jsxRuntime.jsx("p", {
                className: "text-sm text-gray-500",
                children: "Phần trăm"
              }), jsxRuntime.jsxs("p", {
                className: "text-2xl font-bold text-green-600",
                children: [p.percentage, "%"]
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "space-y-4",
            children: [jsxRuntime.jsx("h3", {
              className: "font-medium text-gray-800",
              children: "Câu trả lời"
            }), p.answers.map((B, z) => jsxRuntime.jsxs("div", {
              className: `border rounded-lg p-4 ${B.questionType === "multiple_choice" ? B.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200" : "bg-purple-50 border-purple-200"}`,
              children: [jsxRuntime.jsxs("div", {
                className: "flex items-start justify-between mb-2",
                children: [jsxRuntime.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [B.questionType === "multiple_choice" ? jsxRuntime.jsx(Ya, {
                    className: "w-4 h-4 text-blue-500"
                  }) : jsxRuntime.jsx(Ka, {
                    className: "w-4 h-4 text-purple-500"
                  }), jsxRuntime.jsxs("span", {
                    className: "font-medium",
                    children: ["Câu ", z + 1, ": ", B.questionContent || A(B.questionId)]
                  })]
                }), jsxRuntime.jsxs("span", {
                  className: "text-sm text-gray-500",
                  children: [B.points, "/", B.maxPoints, " điểm"]
                })]
              }), jsxRuntime.jsxs("div", {
                className: "bg-white rounded-lg p-3 mt-2",
                children: [jsxRuntime.jsx("p", {
                  className: "text-sm text-gray-600 mb-1",
                  children: "Câu trả lời:"
                }), jsxRuntime.jsx("p", {
                  className: "font-medium",
                  children: B.userAnswer || "(Không trả lời)"
                })]
              }), B.questionType === "multiple_choice" && jsxRuntime.jsx("div", {
                className: "mt-2 flex items-center gap-2",
                children: B.isCorrect ? jsxRuntime.jsxs("span", {
                  className: "inline-flex items-center gap-1 text-green-600 text-sm",
                  children: [jsxRuntime.jsx(On, {
                    className: "w-4 h-4"
                  }), " Đúng"]
                }) : jsxRuntime.jsxs("span", {
                  className: "inline-flex items-center gap-1 text-red-600 text-sm",
                  children: [jsxRuntime.jsx(_r, {
                    className: "w-4 h-4"
                  }), " Sai - Đáp án đúng: ", B.correctAnswer]
                })
              }), B.questionType === "essay" && jsxRuntime.jsxs("div", {
                className: "mt-3 space-y-3",
                children: [R(B.questionId) && jsxRuntime.jsxs("div", {
                  className: "bg-purple-100 border border-purple-200 p-3 rounded-lg",
                  children: [jsxRuntime.jsx("p", {
                    className: "text-sm font-medium text-purple-700 mb-1",
                    children: "💡 Gợi ý trả lời:"
                  }), jsxRuntime.jsx("p", {
                    className: "text-sm text-purple-600 whitespace-pre-wrap",
                    children: R(B.questionId)
                  })]
                }), L(B.questionId) && jsxRuntime.jsxs("div", {
                  className: "bg-yellow-100 border border-yellow-200 p-3 rounded-lg",
                  children: [jsxRuntime.jsx("p", {
                    className: "text-sm font-medium text-yellow-700 mb-1",
                    children: "📝 Hướng dẫn chấm:"
                  }), jsxRuntime.jsx("p", {
                    className: "text-sm text-yellow-600 whitespace-pre-wrap",
                    children: L(B.questionId)
                  })]
                }), jsxRuntime.jsxs("div", {
                  className: "flex items-center gap-4",
                  children: [jsxRuntime.jsx("label", {
                    className: "text-sm font-medium text-gray-700",
                    children: "Chấm điểm:"
                  }), jsxRuntime.jsx("input", {
                    type: "number",
                    min: "0",
                    max: B.maxPoints,
                    value: n[B.questionId]?.points || 0,
                    onChange: q => i({
                      ...n,
                      [B.questionId]: {
                        ...n[B.questionId],
                        points: Math.min(parseInt(q.target.value) || 0, B.maxPoints)
                      }
                    }),
                    className: "w-20 px-3 py-1 border rounded-lg",
                    disabled: p.isGraded
                  }), jsxRuntime.jsxs("span", {
                    className: "text-sm text-gray-500",
                    children: ["/ ", B.maxPoints]
                  })]
                }), jsxRuntime.jsxs("div", {
                  children: [jsxRuntime.jsx("label", {
                    className: "text-sm font-medium text-gray-700",
                    children: "Nhận xét:"
                  }), jsxRuntime.jsx("textarea", {
                    value: n[B.questionId]?.feedback || "",
                    onChange: q => i({
                      ...n,
                      [B.questionId]: {
                        ...n[B.questionId],
                        feedback: q.target.value
                      }
                    }),
                    className: "w-full px-3 py-2 border rounded-lg mt-1",
                    rows: 2,
                    placeholder: "Nhận xét cho câu trả lời...",
                    disabled: p.isGraded
                  })]
                }), p.isGraded && B.essayFeedback && jsxRuntime.jsxs("div", {
                  className: "bg-yellow-50 p-2 rounded-lg text-sm",
                  children: [jsxRuntime.jsx("span", {
                    className: "font-medium",
                    children: "Nhận xét đã lưu:"
                  }), " ", B.essayFeedback]
                })]
              })]
            }, B.questionId))]
          }), !p.isGraded && p.answers.some(B => B.questionType === "essay") && jsxRuntime.jsxs("div", {
            className: "flex justify-end gap-3 pt-4 border-t",
            children: [jsxRuntime.jsx("button", {
              onClick: () => {
                e(null), i({});
              },
              className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",
              children: "Hủy"
            }), jsxRuntime.jsxs("button", {
              onClick: _,
              disabled: x.isPending,
              className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50",
              children: [x.isPending ? jsxRuntime.jsx(Ke, {
                className: "w-4 h-4 animate-spin"
              }) : jsxRuntime.jsx(Id, {
                className: "w-4 h-4"
              }), "Lưu chấm điểm"]
            })]
          }), p.isGraded && jsxRuntime.jsxs("div", {
            className: "flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700",
            children: [jsxRuntime.jsx(On, {
              className: "w-5 h-5"
            }), jsxRuntime.jsxs("span", {
              children: ["Đã chấm điểm lúc ", C(p.gradedAt), typeof p.gradedBy == "object" && ` bởi ${p.gradedBy.fullName}`]
            })]
          })]
        })]
      })
    })]
  });
}
export { AdminQuizResults };
