// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useQuery, apiClient, useMutation, jsxRuntime, zl, Bn, _r, qi, sE, to, Ke, Id } from './runtime.js';
function StoryChat({
  storybookId: t,
  storybookTitle: e,
  onClose: n
}) {
  const [i, r] = React.useState(""),
    [l, o] = React.useState([]),
    d = React.useRef(null),
    f = React.useRef(null),
    p = !!localStorage.getItem("token"),
    {
      data: m
    } = useQuery({
      queryKey: ["storybook-chat-status", t],
      queryFn: async () => (await apiClient.get(`/storybooks/${t}/chat-status`)).data,
      enabled: !!t && p,
      retry: !1
    }),
    x = useMutation({
      mutationFn: async C => (await apiClient.post(`/storybooks/${t}/chat`, {
        message: C,
        history: l
      })).data,
      onSuccess: C => {
        o(A => [...A, {
          role: "model",
          content: C.response
        }]);
      },
      onError: error => o(messages => [...messages, { role: "model", content: error.response?.data?.error || "Chưa nhận được phản hồi. Vui lòng thử lại." }])
    });
  React.useEffect(() => {
    d.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [l]), React.useEffect(() => {
    f.current?.focus();
  }, []);
  const w = () => {
      if (!i.trim() || x.isPending) return;
      const C = i.trim();
      r(""), o(A => [...A, {
        role: "user",
        content: C
      }]), x.mutate(C);
    },
    _ = C => {
      C.key === "Enter" && !C.shiftKey && (C.preventDefault(), w());
    },
    k = m?.chatEnabled,
    E = e.length > 25 ? e.substring(0, 25) + "..." : e;
  return jsxRuntime.jsxs("div", {
    className: "fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[600px] animate-in slide-in-from-bottom-3 duration-200",
    children: [jsxRuntime.jsxs("div", {
      className: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 flex items-center justify-between",
      children: [jsxRuntime.jsxs("div", {
        className: "flex items-center gap-3",
        children: [jsxRuntime.jsx("div", {
          className: "w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center",
          children: jsxRuntime.jsx(zl, {
            className: "w-5 h-5"
          })
        }), jsxRuntime.jsxs("div", {
          children: [jsxRuntime.jsx("h3", {
            className: "font-bold text-sm",
            children: "AI Trợ lý"
          }), jsxRuntime.jsxs("p", {
            className: "text-xs text-blue-100 truncate max-w-[200px]",
            children: ["📖 ", E]
          })]
        })]
      }), jsxRuntime.jsx("button", {
        onClick: n,
        className: "p-2 hover:bg-white/20 rounded-lg transition",
        children: jsxRuntime.jsx(Bn, {
          className: "w-5 h-5"
        })
      })]
    }), jsxRuntime.jsxs("div", {
      className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px] max-h-[400px]",
      children: [!k && p && jsxRuntime.jsxs("div", {
        className: "text-center py-6",
        children: [jsxRuntime.jsx("div", {
          className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3",
          children: jsxRuntime.jsx(_r, {
            className: "w-8 h-8 text-gray-400"
          })
        }), jsxRuntime.jsx("h4", {
          className: "font-medium text-gray-900 mb-1",
          children: "Chưa có nội dung AI"
        }), jsxRuntime.jsx("p", {
          className: "text-sm text-gray-500",
          children: "Nội dung này chưa được kích hoạt AI chat."
        })]
      }), l.length === 0 && k && jsxRuntime.jsxs("div", {
        className: "text-center py-6",
        children: [jsxRuntime.jsx("div", {
          className: "w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow",
          children: jsxRuntime.jsx(qi, {
            className: "w-8 h-8 text-blue-600"
          })
        }), jsxRuntime.jsx("h4", {
          className: "font-bold text-gray-800 mb-2",
          children: "Xin chào! 👋"
        }), jsxRuntime.jsx("p", {
          className: "text-sm text-gray-600 mb-4",
          children: "Hỏi tôi bất cứ điều gì về:"
        }), jsxRuntime.jsxs("p", {
          className: "text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-block",
          children: ['"', E, '"']
        }), jsxRuntime.jsx("div", {
          className: "mt-4 flex flex-wrap justify-center gap-2",
          children: ["Tóm tắt nội dung", "Ý nghĩa chính", "Nhân vật chính"].map(C => jsxRuntime.jsx("button", {
            onClick: () => {
              r(C), f.current?.focus();
            },
            className: "text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition",
            children: C
          }, C))
        })]
      }), l.map((C, A) => jsxRuntime.jsxs("div", {
        className: `flex gap-2 ${C.role === "user" ? "justify-end" : "justify-start"}`,
        children: [C.role === "model" && jsxRuntime.jsx("div", {
          className: "w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0",
          children: jsxRuntime.jsx(zl, {
            className: "w-4 h-4 text-white"
          })
        }), jsxRuntime.jsx("div", {
          className: `max-w-[80%] px-3 py-2 rounded-2xl text-sm ${C.role === "user" ? "bg-blue-600 text-white rounded-br-md" : "bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm"}`,
          children: C.role === "user" ? jsxRuntime.jsx("p", {
            className: "whitespace-pre-wrap",
            children: C.content
          }) : jsxRuntime.jsx("div", {
            className: "prose prose-sm max-w-none",
            children: jsxRuntime.jsx(sE, {
              children: C.content
            })
          })
        }), C.role === "user" && jsxRuntime.jsx("div", {
          className: "w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0",
          children: jsxRuntime.jsx(to, {
            className: "w-4 h-4 text-gray-600"
          })
        })]
      }, A)), x.isPending && jsxRuntime.jsxs("div", {
        className: "flex gap-2",
        children: [jsxRuntime.jsx("div", {
          className: "w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0",
          children: jsxRuntime.jsx(zl, {
            className: "w-4 h-4 text-white"
          })
        }), jsxRuntime.jsx("div", {
          className: "bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm",
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
        ref: d
      })]
    }), p ? k ? jsxRuntime.jsx("div", {
      className: "p-3 border-t bg-white",
      children: jsxRuntime.jsxs("div", {
        className: "flex items-center gap-2",
        children: [jsxRuntime.jsx("input", {
          ref: f,
          type: "text",
          value: i,
          onChange: C => r(C.target.value),
          onKeyPress: _,
          placeholder: "Nhập câu hỏi...",
          disabled: x.isPending,
          className: "flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        }), jsxRuntime.jsx("button", {
          onClick: w,
          disabled: !i.trim() || x.isPending,
          className: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-2.5 rounded-full hover:opacity-90 disabled:opacity-50 transition",
          children: jsxRuntime.jsx(Id, {
            className: "w-4 h-4"
          })
        })]
      })
    }) : jsxRuntime.jsx("div", {
      className: "p-4 border-t bg-gray-50",
      children: jsxRuntime.jsx("p", {
        className: "text-sm text-gray-400 text-center",
        children: "AI chat chưa được kích hoạt"
      })
    }) : jsxRuntime.jsx("div", {
      className: "p-4 border-t bg-gray-50",
      children: jsxRuntime.jsxs("p", {
        className: "text-sm text-gray-500 text-center",
        children: [jsxRuntime.jsx("a", {
          href: "/login",
          className: "text-blue-600 hover:underline",
          children: "Đăng nhập"
        }), " để chat với AI"]
      })
    })]
  });
}
export { StoryChat };
