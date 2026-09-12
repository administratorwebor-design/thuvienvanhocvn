// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, Ef, useQueryClient, useQuery, apiClient, useMutation, Wf, jsxRuntime, M3, eo, qi, Ke, Qf, Md, ta, g3, h3, Ya, Ka, Bn } from './runtime.js';
function AdminQuizzes() {
  const [t, e] = React.useState(!1),
    [n, i] = React.useState(!1),
    [r, l] = React.useState(null),
    [o, d] = React.useState(null),
    [f, p] = React.useState(!1),
    m = React.useRef(null),
    [x, w] = React.useState({
      category: "",
      title: "",
      description: "",
      duration: "30",
      order: "0",
      questions: [Ef()]
    }),
    _ = useQueryClient(),
    {
      data: k,
      isLoading: E
    } = useQuery({
      queryKey: ["quizzes"],
      queryFn: async () => (await apiClient.get("/quizzes?limit=100")).data.quizzes
    }),
    {
      data: C
    } = useQuery({
      queryKey: ["categories"],
      queryFn: async () => (await apiClient.get("/categories")).data.categories
    }),
    A = useMutation({
      mutationFn: X => {
        const K = X.questions.map((ce, I) => ({
            type: ce.type,
            content: ce.content,
            options: ce.type === "multiple_choice" ? ce.options : void 0,
            correctAnswer: ce.type === "multiple_choice" ? ce.correctAnswer : void 0,
            explanation: ce.explanation || void 0,
            hint: ce.type === "essay" && ce.hint || void 0,
            points: ce.points,
            order: I
          })),
          Z = K.reduce((ce, I) => ce + (I.points || 1), 0),
          ie = {
            category: X.category,
            title: X.title,
            description: X.description || void 0,
            duration: parseInt(X.duration) || 30,
            order: parseInt(X.order) || 0,
            totalPoints: Z,
            questions: K
          };
        return apiClient.post("/quizzes", ie);
      },
      onSuccess: () => {
        _.invalidateQueries({
          queryKey: ["quizzes"]
        }), z();
      }
    }),
    R = useMutation({
      mutationFn: ({
        id: X,
        data: K
      }) => {
        const Z = K.questions.map((I, U) => ({
            type: I.type,
            content: I.content,
            options: I.type === "multiple_choice" ? I.options : void 0,
            correctAnswer: I.type === "multiple_choice" ? I.correctAnswer : void 0,
            explanation: I.explanation || void 0,
            hint: I.type === "essay" && I.hint || void 0,
            points: I.points,
            order: U
          })),
          ie = Z.reduce((I, U) => I + (U.points || 1), 0),
          ce = {
            category: K.category,
            title: K.title,
            description: K.description || void 0,
            duration: parseInt(K.duration) || 30,
            order: parseInt(K.order) || 0,
            totalPoints: ie,
            questions: Z
          };
        return apiClient.patch(`/quizzes/${X}`, ce);
      },
      onSuccess: () => {
        _.invalidateQueries({
          queryKey: ["quizzes"]
        }), z();
      }
    }),
    L = useMutation({
      mutationFn: X => apiClient.delete(`/quizzes/${X}`),
      onSuccess: () => {
        _.invalidateQueries({
          queryKey: ["quizzes"]
        });
      }
    }),
    B = async X => {
      if (X) try {
        const Z = (await apiClient.get(`/quizzes/${X._id}/full`)).data.quiz;
        l(Z), w({
          category: typeof Z.category == "object" ? Z.category._id : Z.category,
          title: Z.title,
          description: Z.description || "",
          duration: Z.duration?.toString() || "30",
          order: Z.order?.toString() || "0",
          questions: Z.questions.length > 0 ? Z.questions.map(ie => ({
            type: ie.type,
            content: ie.content,
            options: ie.options ? ie.options.map(ce => ({
              ...ce
            })) : [],
            correctAnswer: ie.correctAnswer || "",
            explanation: ie.explanation || "",
            hint: ie.hint || "",
            points: ie.points ?? (ie.type === "essay" ? 5 : 1)
          })) : [Ef()]
        });
      } catch (K) {
        console.error("Error fetching quiz details:", K), l(X), w({
          category: typeof X.category == "object" ? X.category._id : X.category,
          title: X.title,
          description: X.description || "",
          duration: X.duration?.toString() || "30",
          order: X.order?.toString() || "0",
          questions: X.questions.length > 0 ? X.questions.map(Z => ({
            type: Z.type,
            content: Z.content,
            options: Z.options ? Z.options.map(ie => ({
              ...ie
            })) : [],
            correctAnswer: Z.correctAnswer || "",
            explanation: Z.explanation || "",
            hint: Z.hint || "",
            points: Z.points ?? (Z.type === "essay" ? 5 : 1)
          })) : [Ef()]
        });
      } else l(null), w({
        category: "",
        title: "",
        description: "",
        duration: "30",
        order: "0",
        questions: [Ef()]
      });
      e(!0);
    },
    z = () => {
      e(!1), l(null);
    },
    q = X => {
      X.preventDefault(), r ? R.mutate({
        id: r._id,
        data: x
      }) : A.mutate(x);
    },
    V = X => {
      const K = X === "multiple_choice" ? {
        type: "multiple_choice",
        content: "",
        options: [{
          content: ""
        }, {
          content: ""
        }],
        correctAnswer: "",
        points: 1
      } : {
        type: "essay",
        content: "",
        options: [],
        correctAnswer: "",
        hint: "",
        points: 5
      };
      w({
        ...x,
        questions: [...x.questions, K]
      });
    },
    J = X => {
      w({
        ...x,
        questions: x.questions.filter((K, Z) => Z !== X)
      });
    },
    O = (X, K, Z) => {
      const ie = x.questions.map((ce, I) => {
        if (I !== X) return ce;
        const U = {
          ...ce,
          [K]: Z
        };
        return K === "type" && (Z === "essay" ? (U.options = [], U.correctAnswer = "", U.points = 5) : (U.options = [{
          content: ""
        }, {
          content: ""
        }], U.correctAnswer = "", U.points = 1)), U;
      });
      w({
        ...x,
        questions: ie
      });
    },
    P = (X, K, Z) => {
      const ie = x.questions.map((ce, I) => I !== X ? ce : {
        ...ce,
        options: ce.options.map((U, he) => he === K ? {
          ...U,
          content: Z
        } : {
          ...U
        })
      });
      w({
        ...x,
        questions: ie
      });
    },
    se = X => {
      const K = x.questions.map((Z, ie) => ie !== X ? Z : {
        ...Z,
        options: [...Z.options.map(ce => ({
          ...ce
        })), {
          id: Wf(),
          content: ""
        }]
      });
      w({
        ...x,
        questions: K
      });
    },
    ae = (X, K) => {
      const Z = x.questions.map((ie, ce) => {
        if (ce !== X) return ie;
        const I = ie.options[K];
        return {
          ...ie,
          options: ie.options.filter((U, he) => he !== K).map(U => ({
            ...U
          })),
          correctAnswer: ie.correctAnswer === I?.id ? "" : ie.correctAnswer
        };
      });
      w({
        ...x,
        questions: Z
      });
    },
    ue = (X, K) => {
      const Z = x.questions.map((ie, ce) => {
        if (ce !== X) return ie;
        const I = ie.options[K];
        return {
          ...ie,
          correctAnswer: I.id
        };
      });
      w({
        ...x,
        questions: Z
      });
    },
    Q = async X => {
      const K = X.target.files?.[0];
      if (!K) return;
      const Z = K.name.toLowerCase();
      if (!Z.endsWith(".doc") && !Z.endsWith(".docx")) {
        alert("Chỉ hỗ trợ file DOC hoặc DOCX");
        return;
      }
      p(!0), i(!0);
      try {
        const ie = new window.FormData();
        ie.append("file", K);
        const ce = await apiClient.post("/quizzes/parse-doc", ie, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        if (ce.data.success && ce.data.quiz) {
          const I = ce.data.quiz;
          w({
            category: "",
            title: I.title || "Đề thi mới",
            description: I.description || "",
            duration: "30",
            order: "0",
            questions: I.questions.map(U => ({
              type: U.type,
              content: U.content,
              options: U.options?.map(he => ({
                id: he.id || Wf(),
                content: he.content
              })) || [],
              correctAnswer: U.correctAnswer || "",
              explanation: U.explanation || "",
              hint: U.hint || "",
              points: U.points || (U.type === "essay" ? 2 : 1)
            }))
          }), i(!1), e(!0), l(null);
        } else alert(ce.data.error || "Không thể phân tích file");
      } catch (ie) {
        console.error("Import error:", ie), alert(ie.response?.data?.error || "Lỗi khi phân tích file");
      } finally {
        p(!1), m.current && (m.current.value = "");
      }
    };
  return jsxRuntime.jsxs("div", {
    className: "space-y-6",
    children: [jsxRuntime.jsxs("div", {
      className: "flex items-center justify-between",
      children: [jsxRuntime.jsx("h1", {
        className: "text-2xl font-bold text-gray-800",
        children: "Quản lý Quizzes"
      }), jsxRuntime.jsxs("div", {
        className: "flex items-center gap-2",
        children: [jsxRuntime.jsxs("label", {
          className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer",
          children: [jsxRuntime.jsx(M3, {
            className: "w-5 h-5"
          }), "Import từ DOC", jsxRuntime.jsx("input", {
            ref: m,
            type: "file",
            accept: ".txt,.docx",
            onChange: Q,
            className: "hidden"
          })]
        }), jsxRuntime.jsxs("button", {
          onClick: () => B(),
          className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
          children: [jsxRuntime.jsx(eo, {
            className: "w-5 h-5"
          }), "Thêm mới"]
        })]
      })]
    }), n && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
      children: jsxRuntime.jsx("div", {
        className: "bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4",
        children: jsxRuntime.jsxs("div", {
          className: "text-center",
          children: [jsxRuntime.jsx("div", {
            className: "w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4",
            children: jsxRuntime.jsx(qi, {
              className: "w-8 h-8 text-purple-600 animate-pulse"
            })
          }), jsxRuntime.jsx("h3", {
            className: "text-lg font-bold text-gray-900 mb-2",
            children: f ? "Đang phân tích đề thi..." : "Hoàn tất!"
          }), jsxRuntime.jsx("p", {
            className: "text-gray-500 text-sm mb-4",
            children: f ? "AI đang đọc và phân tích nội dung file DOC của bạn" : "Đề thi đã được phân tích thành công"
          }), f && jsxRuntime.jsx(Ke, {
            className: "w-6 h-6 animate-spin text-purple-600 mx-auto"
          }), !f && jsxRuntime.jsx("button", {
            onClick: () => i(!1),
            className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition",
            children: "Đóng"
          })]
        })
      })
    }), jsxRuntime.jsx("div", {
      className: "space-y-4",
      children: E ? jsxRuntime.jsx("div", {
        className: "bg-white rounded-xl shadow-sm p-8 text-center",
        children: jsxRuntime.jsx(Ke, {
          className: "w-8 h-8 animate-spin mx-auto text-blue-600"
        })
      }) : k?.length === 0 ? jsxRuntime.jsx("div", {
        className: "bg-white rounded-xl shadow-sm p-8 text-center text-gray-500",
        children: "Chưa có quiz nào"
      }) : k?.map(X => {
        const K = X.questions.filter(ie => ie.type === "multiple_choice").length,
          Z = X.questions.filter(ie => ie.type === "essay").length;
        return jsxRuntime.jsxs("div", {
          className: "bg-white rounded-xl shadow-sm overflow-hidden",
          children: [jsxRuntime.jsxs("div", {
            className: "p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50",
            onClick: () => d(o === X._id ? null : X._id),
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center gap-3",
              children: [jsxRuntime.jsx("div", {
                className: "w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center",
                children: jsxRuntime.jsx(Qf, {
                  className: "w-5 h-5 text-orange-600"
                })
              }), jsxRuntime.jsxs("div", {
                children: [jsxRuntime.jsx("p", {
                  className: "font-medium text-gray-900",
                  children: X.title
                }), jsxRuntime.jsxs("div", {
                  className: "flex items-center gap-3 text-sm text-gray-500",
                  children: [jsxRuntime.jsxs("span", {
                    className: "text-orange-600 font-medium",
                    children: ["Bài ", X.order]
                  }), jsxRuntime.jsx("span", {
                    children: "•"
                  }), jsxRuntime.jsxs("span", {
                    children: [X.questions.length, " câu hỏi"]
                  }), K > 0 && jsxRuntime.jsxs("span", {
                    className: "text-blue-600",
                    children: ["(", K, " MC)"]
                  }), Z > 0 && jsxRuntime.jsxs("span", {
                    className: "text-purple-600",
                    children: ["(", Z, " Tự luận)"]
                  }), jsxRuntime.jsx("span", {
                    children: "•"
                  }), jsxRuntime.jsxs("span", {
                    children: [X.duration || 30, " phút"]
                  }), jsxRuntime.jsx("span", {
                    children: "•"
                  }), jsxRuntime.jsxs("span", {
                    children: [X.totalPoints, " điểm"]
                  })]
                })]
              })]
            }), jsxRuntime.jsxs("div", {
              className: "flex items-center gap-2",
              children: [jsxRuntime.jsx("button", {
                onClick: ie => {
                  ie.stopPropagation(), B(X);
                },
                className: "p-2 rounded-lg hover:bg-gray-100 text-gray-600",
                children: jsxRuntime.jsx(Md, {
                  className: "w-4 h-4"
                })
              }), jsxRuntime.jsx("button", {
                onClick: ie => {
                  ie.stopPropagation(), confirm("Bạn có chắc muốn xóa?") && L.mutate(X._id);
                },
                className: "p-2 rounded-lg hover:bg-red-100 text-red-600",
                children: jsxRuntime.jsx(ta, {
                  className: "w-4 h-4"
                })
              }), o === X._id ? jsxRuntime.jsx(g3, {
                className: "w-5 h-5 text-gray-400"
              }) : jsxRuntime.jsx(h3, {
                className: "w-5 h-5 text-gray-400"
              })]
            })]
          }), o === X._id && jsxRuntime.jsxs("div", {
            className: "border-t px-4 py-3 bg-gray-50",
            children: [jsxRuntime.jsx("p", {
              className: "text-sm text-gray-600 mb-3 whitespace-pre-wrap",
              children: X.description || "Không có mô tả"
            }), jsxRuntime.jsx("div", {
              className: "space-y-2",
              children: X.questions.map((ie, ce) => jsxRuntime.jsxs("div", {
                className: "bg-white rounded-lg p-3 text-sm",
                children: [jsxRuntime.jsxs("div", {
                  className: "flex items-start gap-2 mb-2",
                  children: [ie.type === "multiple_choice" ? jsxRuntime.jsx(Ya, {
                    className: "w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                  }) : jsxRuntime.jsx(Ka, {
                    className: "w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0"
                  }), jsxRuntime.jsxs("div", {
                    className: "flex-1",
                    children: [jsxRuntime.jsxs("span", {
                      className: "font-medium whitespace-pre-wrap",
                      children: ["Câu ", ce + 1, ": ", ie.content]
                    }), jsxRuntime.jsxs("span", {
                      className: "text-xs text-gray-400 ml-2",
                      children: ["(", ie.points, " điểm)"]
                    })]
                  })]
                }), ie.type === "multiple_choice" && ie.options && jsxRuntime.jsx("div", {
                  className: "mt-2 grid grid-cols-2 gap-2",
                  children: ie.options.map((I, U) => {
                    const he = I.id === ie.correctAnswer || ie.correctAnswer?.startsWith("opt_") && parseInt(ie.correctAnswer.replace("opt_", "")) === U;
                    return jsxRuntime.jsxs("div", {
                      className: `px-2 py-1 rounded ${he ? "bg-green-100 text-green-700 font-medium" : "bg-gray-100 text-gray-600"}`,
                      children: [String.fromCharCode(65 + U), ". ", I.content]
                    }, I.id || U);
                  })
                }), ie.type === "multiple_choice" && ie.explanation && jsxRuntime.jsxs("div", {
                  className: "mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg",
                  children: [jsxRuntime.jsxs("div", {
                    className: "flex items-center gap-1 text-xs text-amber-700 font-medium mb-1",
                    children: [jsxRuntime.jsx(qi, {
                      className: "w-3 h-3"
                    }), "Giải thích (AI)"]
                  }), jsxRuntime.jsx("p", {
                    className: "text-sm text-amber-800 whitespace-pre-wrap",
                    children: ie.explanation
                  })]
                }), ie.type === "essay" && jsxRuntime.jsx("p", {
                  className: "text-xs text-purple-600 italic",
                  children: "Câu hỏi tự luận - Admin sẽ chấm điểm sau khi học sinh nộp bài"
                })]
              }, ce))
            })]
          })]
        }, X._id);
      })
    }), t && jsxRuntime.jsx("div", {
      className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
      children: jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10",
          children: [jsxRuntime.jsx("h2", {
            className: "text-lg font-semibold",
            children: r ? "Sửa Quiz" : "Thêm Quiz mới"
          }), jsxRuntime.jsx("button", {
            onClick: z,
            className: "p-2 hover:bg-gray-100 rounded-lg",
            children: jsxRuntime.jsx(Bn, {
              className: "w-5 h-5"
            })
          })]
        }), jsxRuntime.jsxs("form", {
          onSubmit: q,
          className: "p-4 space-y-4",
          children: [jsxRuntime.jsxs("div", {
            className: "grid grid-cols-2 gap-4",
            children: [jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Danh mục *"
              }), jsxRuntime.jsxs("select", {
                value: x.category,
                onChange: X => w({
                  ...x,
                  category: X.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
                required: !0,
                children: [jsxRuntime.jsx("option", {
                  value: "",
                  children: "Chọn danh mục"
                }), C?.map(X => jsxRuntime.jsx("option", {
                  value: X._id,
                  children: X.name
                }, X._id))]
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Tiêu đề *"
              }), jsxRuntime.jsx("input", {
                type: "text",
                value: x.title,
                onChange: X => w({
                  ...x,
                  title: X.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
                required: !0
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("label", {
              className: "block text-sm font-medium text-gray-700 mb-1",
              children: ["Mô tả / Nội dung văn bản đọc hiểu", jsxRuntime.jsx("span", {
                className: "text-xs text-gray-500 ml-1",
                children: "(AI sẽ dùng để tạo giải thích đáp án)"
              })]
            }), jsxRuntime.jsx("textarea", {
              value: x.description,
              onChange: X => w({
                ...x,
                description: X.target.value
              }),
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm whitespace-pre-wrap",
              rows: 8,
              placeholder: "Dán nội dung văn bản đọc hiểu vào đây..."
            })]
          }), jsxRuntime.jsxs("div", {
            className: "grid grid-cols-2 gap-4",
            children: [jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Thời gian (phút)"
              }), jsxRuntime.jsx("input", {
                type: "number",
                value: x.duration,
                onChange: X => w({
                  ...x,
                  duration: X.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg"
              })]
            }), jsxRuntime.jsxs("div", {
              children: [jsxRuntime.jsxs("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: ["Thứ tự (trong danh mục)", jsxRuntime.jsx("span", {
                  className: "text-xs text-gray-500 ml-1",
                  children: "Bài 0 → 1 → 2..."
                })]
              }), jsxRuntime.jsx("input", {
                type: "number",
                min: "0",
                value: x.order,
                onChange: X => w({
                  ...x,
                  order: X.target.value
                }),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
                placeholder: "0"
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "border-t pt-4",
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center justify-between mb-3",
              children: [jsxRuntime.jsxs("h3", {
                className: "font-medium text-gray-800",
                children: ["Câu hỏi (", x.questions.length, ")"]
              }), jsxRuntime.jsxs("div", {
                className: "flex gap-2",
                children: [jsxRuntime.jsxs("button", {
                  type: "button",
                  onClick: () => V("multiple_choice"),
                  className: "text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 border border-blue-300 rounded-lg",
                  children: [jsxRuntime.jsx(Ya, {
                    className: "w-4 h-4"
                  }), " Trắc nghiệm"]
                }), jsxRuntime.jsxs("button", {
                  type: "button",
                  onClick: () => V("essay"),
                  className: "text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 px-2 py-1 border border-purple-300 rounded-lg",
                  children: [jsxRuntime.jsx(Ka, {
                    className: "w-4 h-4"
                  }), " Tự luận"]
                })]
              })]
            }), jsxRuntime.jsx("div", {
              className: "space-y-4",
              children: x.questions.map((X, K) => jsxRuntime.jsxs("div", {
                className: `border rounded-lg p-4 ${X.type === "multiple_choice" ? "bg-blue-50 border-blue-200" : "bg-purple-50 border-purple-200"}`,
                children: [jsxRuntime.jsxs("div", {
                  className: "flex items-start justify-between mb-3",
                  children: [jsxRuntime.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [jsxRuntime.jsxs("span", {
                      className: "text-sm font-medium text-gray-600",
                      children: ["Câu ", K + 1]
                    }), jsxRuntime.jsxs("select", {
                      value: X.type,
                      onChange: Z => O(K, "type", Z.target.value),
                      className: "text-xs px-2 py-1 border rounded-lg",
                      children: [jsxRuntime.jsx("option", {
                        value: "multiple_choice",
                        children: "Trắc nghiệm"
                      }), jsxRuntime.jsx("option", {
                        value: "essay",
                        children: "Tự luận"
                      })]
                    }), jsxRuntime.jsx("input", {
                      type: "number",
                      value: X.points,
                      onChange: Z => O(K, "points", parseInt(Z.target.value) || 1),
                      className: "w-16 text-xs px-2 py-1 border rounded-lg",
                      min: "1",
                      placeholder: "Điểm"
                    }), jsxRuntime.jsx("span", {
                      className: "text-xs text-gray-500",
                      children: "điểm"
                    })]
                  }), x.questions.length > 1 && jsxRuntime.jsx("button", {
                    type: "button",
                    onClick: () => J(K),
                    className: "text-red-500 hover:text-red-700",
                    children: jsxRuntime.jsx(ta, {
                      className: "w-4 h-4"
                    })
                  })]
                }), jsxRuntime.jsx("textarea", {
                  value: X.content,
                  onChange: Z => O(K, "content", Z.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg mb-3",
                  placeholder: "Nội dung câu hỏi",
                  rows: 2,
                  required: !0
                }), X.type === "multiple_choice" && jsxRuntime.jsxs(jsxRuntime.Fragment, {
                  children: [jsxRuntime.jsx("div", {
                    className: "space-y-2 mb-3",
                    children: X.options.map((Z, ie) => {
                      const ce = X.correctAnswer === Z.id || X.correctAnswer?.startsWith("opt_") && parseInt(X.correctAnswer.replace("opt_", "")) === ie;
                      return jsxRuntime.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [jsxRuntime.jsx("input", {
                          type: "radio",
                          name: `correct-${K}`,
                          checked: ce,
                          onChange: () => ue(K, ie),
                          className: "text-green-600",
                          title: "Chọn làm đáp án đúng"
                        }), jsxRuntime.jsx("input", {
                          type: "text",
                          value: Z.content,
                          onChange: I => P(K, ie, I.target.value),
                          className: "flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm",
                          placeholder: `Đáp án ${String.fromCharCode(65 + ie)}`,
                          required: !0
                        }), X.options.length > 2 && jsxRuntime.jsx("button", {
                          type: "button",
                          onClick: () => ae(K, ie),
                          className: "text-red-500 hover:text-red-700",
                          title: "Xóa đáp án",
                          children: jsxRuntime.jsx(Bn, {
                            className: "w-4 h-4"
                          })
                        })]
                      }, Z.id || ie);
                    })
                  }), jsxRuntime.jsxs("button", {
                    type: "button",
                    onClick: () => se(K),
                    className: "text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1",
                    children: [jsxRuntime.jsx(eo, {
                      className: "w-3 h-3"
                    }), " Thêm đáp án"]
                  })]
                }), X.type === "essay" && jsxRuntime.jsxs("div", {
                  className: "space-y-2",
                  children: [jsxRuntime.jsx("p", {
                    className: "text-xs text-purple-600 italic",
                    children: "💡 Câu hỏi tự luận - Học sinh sẽ nhập câu trả lời dạng văn bản. Admin chấm điểm sau."
                  }), jsxRuntime.jsxs("div", {
                    children: [jsxRuntime.jsx("label", {
                      className: "block text-sm font-medium text-gray-700 mb-1",
                      children: "Gợi ý cho học sinh (hiển thị khi làm bài)"
                    }), jsxRuntime.jsx("textarea", {
                      value: X.hint || "",
                      onChange: Z => O(K, "hint", Z.target.value),
                      placeholder: "VD: Các ý chính cần nêu: ý nghĩa, cảm xúc, biện pháp tu từ...",
                      className: "w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50",
                      rows: 2
                    })]
                  }), jsxRuntime.jsxs("div", {
                    children: [jsxRuntime.jsx("label", {
                      className: "block text-sm font-medium text-gray-700 mb-1",
                      children: "Hướng dẫn chấm (chỉ admin thấy)"
                    }), jsxRuntime.jsx("textarea", {
                      value: X.explanation || "",
                      onChange: Z => O(K, "explanation", Z.target.value),
                      placeholder: "Hướng dẫn chấm chi tiết cho giáo viên...",
                      className: "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      rows: 2
                    })]
                  })]
                })]
              }, K))
            })]
          }), jsxRuntime.jsxs("div", {
            className: "flex justify-end gap-3 pt-4 border-t",
            children: [jsxRuntime.jsx("button", {
              type: "button",
              onClick: z,
              className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",
              children: "Hủy"
            }), jsxRuntime.jsxs("button", {
              type: "submit",
              disabled: A.isPending || R.isPending,
              className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50",
              children: [(A.isPending || R.isPending) && jsxRuntime.jsx(Ke, {
                className: "w-4 h-4 animate-spin"
              }), r ? "Cập nhật" : "Tạo mới"]
            })]
          })]
        })]
      })
    })]
  });
}
export { AdminQuizzes };
