// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, Vs, useQuery, apiClient, useMutation, jsxRuntime, nn, Bn, _3, qi, to, zl, sE, Ke, Id } from './runtime.js';
function LiteratureAssistant() {
  const [t, e] = React.useState(!1),
    [n, i] = React.useState(!1),
    [r, l] = React.useState(""),
    [o, d] = React.useState([]),
    f = React.useRef(null),
    p = React.useRef(null),
    x = Vs().pathname.match(/^\/storybooks\/[^/]+$/),
    {
      data: w
    } = useQuery({
      queryKey: ["sgk-chat-status"],
      queryFn: async () => (await apiClient.get("/sgk-chat/status")).data,
      retry: !1,
      staleTime: 300 * 1e3
    }),
    _ = useMutation({
      mutationFn: async A => (await apiClient.post("/sgk-chat/chat", {
        question: A,
        history: o
      })).data,
      onSuccess: A => {
        A.success ? d(R => [...R, {
          role: "model",
          content: A.response
        }]) : d(R => [...R, {
          role: "model",
          content: A.error || "Không thể trả lời. Vui lòng thử lại."
        }]);
      },
      onError: error => {
        d(A => [...A, {
          role: "model",
          content: error.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại sau."
        }]);
      }
    });
  React.useEffect(() => {
    f.current && f.current.scrollIntoView({
      behavior: "smooth"
    });
  }, [o]), React.useEffect(() => {
    t && !n && p.current && p.current.focus();
  }, [t, n]);
  const k = () => {
      if (!r.trim() || _.isPending) return;
      const A = r.trim();
      l(""), d(R => [...R, {
        role: "user",
        content: A
      }]), _.mutate(A);
    },
    E = A => {
      A.key === "Enter" && !A.shiftKey && (A.preventDefault(), k());
    },
    C = w?.status === "ready";
  return x ? null : t ? n ? jsxRuntime.jsxs("div", {
    onClick: () => i(!1),
    className: "fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all",
    children: [jsxRuntime.jsx(nn, {
      className: "w-5 h-5"
    }), jsxRuntime.jsx("span", {
      className: "font-medium",
      children: "SGK Chat"
    }), o.length > 0 && jsxRuntime.jsx("span", {
      className: "w-5 h-5 bg-white text-blue-600 rounded-full text-xs flex items-center justify-center font-bold",
      children: o.length
    }), jsxRuntime.jsx("button", {
      onClick: A => {
        A.stopPropagation(), e(!1), i(!1);
      },
      className: "ml-1 hover:bg-white/20 rounded-full p-1 transition",
      children: jsxRuntime.jsx(Bn, {
        className: "w-4 h-4"
      })
    })]
  }) : jsxRuntime.jsxs("div", {
    className: "fixed bottom-6 right-6 z-40 w-[400px] max-w-[calc(100vw-2rem)] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[600px]",
    children: [jsxRuntime.jsxs("div", {
      className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between",
      children: [jsxRuntime.jsxs("div", {
        className: "flex items-center gap-3",
        children: [jsxRuntime.jsx("div", {
          className: "w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center",
          children: jsxRuntime.jsx(nn, {
            className: "w-5 h-5"
          })
        }), jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("h3", {
            className: "font-bold",
            children: "Trợ lý Ngữ Văn 6"
          }), jsxRuntime.jsx("p", {
            className: "text-xs text-blue-100",
            children: C ? "📚 Hỗ trợ học Ngữ Văn 6" : "Chưa kết nối trợ lý AI"
          })]
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flex items-center gap-2",
        children: [jsxRuntime.jsx("button", {
          onClick: () => i(!0),
          className: "p-2 hover:bg-white/20 rounded-lg transition",
          title: "Thu nhỏ",
          children: jsxRuntime.jsx(_3, {
            className: "w-5 h-5"
          })
        }), jsxRuntime.jsx("button", {
          onClick: () => {
            e(!1), i(!1);
          },
          className: "p-2 hover:bg-white/20 rounded-lg transition",
          title: "Đóng",
          children: jsxRuntime.jsx(Bn, {
            className: "w-5 h-5"
          })
        })]
      })]
    }), jsxRuntime.jsxs("div", {
      className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px]",
      children: [o.length === 0 && jsxRuntime.jsxs("div", {
        className: "text-center py-8",
        children: [jsxRuntime.jsx("div", {
          className: "w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg",
          children: jsxRuntime.jsx(qi, {
            className: "w-8 h-8 text-white"
          })
        }), jsxRuntime.jsx("h4", {
          className: "font-bold text-gray-800 mb-2",
          children: "Xin chào! 👋"
        }), jsxRuntime.jsx("p", {
          className: "text-sm text-gray-600 max-w-[280px] mx-auto",
          children: "Mình có thể giúp em ôn tập Ngữ Văn 6. Khi hỏi về một đoạn trong sách, hãy gửi kèm đoạn văn để mình giải thích sát nội dung hơn nhé!"
        }), jsxRuntime.jsxs("div", {
          className: "mt-4 space-y-2",
          children: [jsxRuntime.jsx("p", {
            className: "text-xs text-gray-500",
            children: "Gợi ý câu hỏi:"
          }), jsxRuntime.jsx("div", {
            className: "flex flex-wrap justify-center gap-2",
            children: ["Tóm tắt bài Thánh Gióng", "Ý nghĩa truyện Thạch Sanh", "Thể loại văn học lớp 6"].map((A, R) => jsxRuntime.jsx("button", {
              onClick: () => {
                l(A), p.current?.focus();
              },
              className: "text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition",
              children: A
            }, R))
          })]
        })]
      }), o.map((A, R) => jsxRuntime.jsxs("div", {
        className: `flex gap-3 ${A.role === "user" ? "flex-row-reverse" : ""}`,
        children: [jsxRuntime.jsx("div", {
          className: `w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${A.role === "user" ? "bg-blue-600" : "bg-gradient-to-br from-purple-500 to-blue-500"}`,
          children: A.role === "user" ? jsxRuntime.jsx(to, {
            className: "w-4 h-4 text-white"
          }) : jsxRuntime.jsx(zl, {
            className: "w-4 h-4 text-white"
          })
        }), jsxRuntime.jsx("div", {
          className: `max-w-[80%] rounded-2xl px-4 py-2.5 ${A.role === "user" ? "bg-blue-600 text-white rounded-br-md" : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"}`,
          children: A.role === "model" ? jsxRuntime.jsx("div", {
            className: "prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5",
            children: jsxRuntime.jsx(sE, {
              children: A.content
            })
          }) : jsxRuntime.jsx("p", {
            className: "text-sm whitespace-pre-wrap",
            children: A.content
          })
        })]
      }, R)), _.isPending && jsxRuntime.jsxs("div", {
        className: "flex gap-3",
        children: [jsxRuntime.jsx("div", {
          className: "w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0",
          children: jsxRuntime.jsx(zl, {
            className: "w-4 h-4 text-white"
          })
        }), jsxRuntime.jsx("div", {
          className: "bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm",
          children: jsxRuntime.jsxs("div", {
            className: "flex items-center gap-2 text-gray-500",
            children: [jsxRuntime.jsx(Ke, {
              className: "w-4 h-4 animate-spin"
            }), jsxRuntime.jsx("span", {
              className: "text-sm",
              children: "Đang suy nghĩ..."
            })]
          })
        })]
      }), jsxRuntime.jsx("div", {
        ref: f
      })]
    }), jsxRuntime.jsx("div", {
      className: "p-4 bg-white border-t border-gray-200",
      children: jsxRuntime.jsxs("div", {
        className: "flex gap-2",
        children: [jsxRuntime.jsx("textarea", {
          ref: p,
          value: r,
          onChange: A => l(A.target.value),
          onKeyDown: E,
          placeholder: "Hỏi bất cứ điều gì về Ngữ Văn 6...",
          className: "flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm",
          rows: 1,
          disabled: _.isPending || !C
        }), jsxRuntime.jsx("button", {
          onClick: k,
          disabled: !r.trim() || _.isPending || !C,
          className: "px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed",
          children: _.isPending ? jsxRuntime.jsx(Ke, {
            className: "w-5 h-5 animate-spin"
          }) : jsxRuntime.jsx(Id, {
            className: "w-5 h-5"
          })
        })]
      })
    })]
  }) : jsxRuntime.jsx("button", {
    onClick: () => e(!0),
    className: "fixed bottom-6 right-6 z-40 group",
    children: jsxRuntime.jsxs("div", {
      className: "relative",
      children: [jsxRuntime.jsx("div", {
        className: "absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-25"
      }), jsxRuntime.jsxs("div", {
        className: "relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105",
        children: [jsxRuntime.jsx(nn, {
          className: "w-5 h-5"
        }), jsxRuntime.jsx("span", {
          className: "font-medium hidden sm:inline",
          children: "Hỏi kiến thức Ngữ Văn 6"
        }), jsxRuntime.jsx("span", {
          className: "font-medium sm:hidden",
          children: "Hỏi AI"
        }), jsxRuntime.jsx(qi, {
          className: "w-4 h-4 animate-pulse"
        })]
      })]
    })
  });
}
export { LiteratureAssistant };
