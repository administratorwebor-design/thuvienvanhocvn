// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { FlashcardPaper } from './FlashcardPaper.jsx';
import { createPortal, useQueryClient } from './runtime.js';
import { React, useQuery, apiClient, useMutation, jsxRuntime, Xa, Bn, qi, Ke, gx, xx, _u, a5, pw, fy } from './runtime.js';
function FlashcardDialog({
  storybookId: t,
  storybookTitle: e,
  isOpen: n,
  onClose: i
}) {
  const loadedStory = React.useRef(null);
  const dialog = React.useRef(null);
  const savedTimer = React.useRef(null);
  const queryClient = useQueryClient();
  const {
      user: r
    } = useAuth(),
    [l, o] = React.useState([]),
    [d, f] = React.useState(0),
    [p, m] = React.useState(!1),
    [x, w] = React.useState(!1),
    {
      data: _,
      refetch: k
    } = useQuery({
      queryKey: ["flashcard", t],
      queryFn: async () => (await apiClient.get(`/flashcards/storybook/${t}`)).data,
      enabled: n && !!r
    }),
    E = useMutation({
      mutationFn: async () => (await apiClient.post("/flashcards/generate", {
        storybookId: t,
        numberOfCards: 10
      })).data,
      onSuccess: q => {
        loadedStory.current = t;
        q.cards && (o(q.cards), f(0), m(!1));
      }
    }),
    C = useMutation({
      mutationFn: async () => (await apiClient.post("/flashcards/save", {
        storybookId: t,
        title: `Flash Card - ${e}`,
        cards: l
      })).data,
      onSuccess: () => {
        w(true); k(); queryClient.invalidateQueries({ queryKey: ['my-flashcards'] });
        clearTimeout(savedTimer.current); savedTimer.current = setTimeout(() => w(false), 2000);
      }
    });
  React.useEffect(() => {
    n && loadedStory.current !== t && _?.flashcard?.cards?.length > 0 && (loadedStory.current = t, o(_.flashcard.cards), f(0), m(!1));
  }, [n, _]);
  React.useEffect(() => {
    if (!n) { loadedStory.current = null; o([]); f(0); m(false); w(false); E.reset(); C.reset(); clearTimeout(savedTimer.current); }
  }, [n, t]);
  React.useEffect(() => {
    if (!n) return;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; dialog.current?.querySelector('button')?.focus();
    const trap = event => {
      if (event.key !== 'Tab') return;
      const buttons = [...dialog.current.querySelectorAll('button:not([disabled]),a[href],input')].filter(el => el.getClientRects().length);
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', trap); previousFocus?.focus(); clearTimeout(savedTimer.current); };
  }, [n]);
  const A = () => {
      E.mutate();
    },
    R = () => {
      m(!1), f(q => q === 0 ? l.length - 1 : q - 1);
    },
    L = () => {
      m(!1), f(q => q === l.length - 1 ? 0 : q + 1);
    };
  if (React.useEffect(() => {
    if (!n) return;
    const q = V => {
      if (V.target.matches('input,textarea,[contenteditable=true]')) return;
      switch (V.key) {
        case "ArrowLeft":
          V.preventDefault(); if (l.length) R();
          break;
        case "ArrowRight":
          V.preventDefault(); if (l.length) L();
          break;
        case " ":
          if (V.target.closest('button')) return;
          V.preventDefault(); if (l.length) m(J => !J);
          break;
        case "Escape":
          i();
          break;
      }
    };
    return window.addEventListener("keydown", q), () => window.removeEventListener("keydown", q);
  }, [n, l.length]), !n) return null;
  const B = l[d],
    z = _?.flashcard?.cards?.length > 0;
  return createPortal(jsxRuntime.jsxs("div", {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
    children: [jsxRuntime.jsxs("div", {
      className: "flash-dialog-panel",
      ref: dialog, role: 'dialog', 'aria-modal': true, 'aria-label': 'Flash Card AI',
      children: [jsxRuntime.jsxs("div", {
        className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 flex items-center justify-between",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-center gap-3",
          children: [jsxRuntime.jsx("div", {
            className: "w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center",
            children: jsxRuntime.jsx(Xa, {
              className: "w-5 h-5"
            })
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("h2", {
              className: "font-bold text-lg",
              children: "Flash Card AI"
            }), jsxRuntime.jsx("p", {
              className: "text-amber-100 text-sm truncate max-w-xs",
              children: e
            })]
          })]
        }), jsxRuntime.jsx("button", {
          onClick: i,
          'aria-label': 'Đóng Flash Card',
          className: "p-2 hover:bg-white/20 rounded-lg transition",
          children: jsxRuntime.jsx(Bn, {
            className: "w-5 h-5"
          })
        })]
      }), jsxRuntime.jsxs("div", {
        className: "flash-dialog-content",
        children: [E.isPending && jsxRuntime.jsxs("div", {
          className: "flex flex-col items-center justify-center py-16",
          children: [jsxRuntime.jsx("div", {
            className: "w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 animate-pulse",
            children: jsxRuntime.jsx(qi, {
              className: "w-10 h-10 text-amber-500"
            })
          }), jsxRuntime.jsx("p", {
            className: "text-gray-600 font-medium",
            children: "AI đang tạo Flash Card..."
          }), jsxRuntime.jsx("p", {
            className: "text-gray-400 text-sm mt-1",
            children: "Vui lòng đợi trong giây lát"
          }), jsxRuntime.jsx(Ke, {
            className: "w-6 h-6 animate-spin text-amber-500 mt-4"
          })]
        }), E.isError && jsxRuntime.jsxs("div", {
          className: "text-center py-12",
          children: [jsxRuntime.jsx("div", {
            className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4",
            children: jsxRuntime.jsx(Bn, {
              className: "w-8 h-8 text-red-500"
            })
          }), jsxRuntime.jsx("p", {
            className: "text-red-600 font-medium",
            children: "Không thể tạo Flash Card"
          }), jsxRuntime.jsx("p", {
            className: "text-gray-500 text-sm mt-1",
            children: E.error?.response?.data?.error || "Có lỗi xảy ra"
          }), jsxRuntime.jsx("button", {
            onClick: A,
            className: "mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition",
            children: "Thử lại"
          })]
        }), !E.isPending && !E.isError && l.length === 0 && jsxRuntime.jsxs("div", {
          className: "text-center py-12",
          children: [jsxRuntime.jsx("div", {
            className: "w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4",
            children: jsxRuntime.jsx(Xa, {
              className: "w-10 h-10 text-amber-500"
            })
          }), jsxRuntime.jsx("h3", {
            className: "text-xl font-bold text-gray-800 mb-2",
            children: z ? "Tải Flash Card đã lưu?" : "Tạo Flash Card mới?"
          }), jsxRuntime.jsx("p", {
            className: "text-gray-500 mb-6",
            children: z ? "Bạn đã có bộ Flash Card cho bài này. Tải lại hoặc tạo mới?" : "AI sẽ tạo 10 thẻ học từ nội dung bài học"
          }), jsxRuntime.jsxs("div", {
            className: "flex gap-3 justify-center",
            children: [z && jsxRuntime.jsx("button", {
              onClick: () => o(_.flashcard.cards),
              className: "px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium",
              children: "Tải Flash Card đã lưu"
            }), jsxRuntime.jsxs("button", {
              onClick: A,
              className: "px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:opacity-90 transition font-medium flex items-center gap-2",
              children: [jsxRuntime.jsx(qi, {
                className: "w-5 h-5"
              }), z ? "Tạo mới với AI" : "Tạo Flash Card"]
            })]
          })]
        }), !E.isPending && l.length > 0 && jsxRuntime.jsxs(jsxRuntime.Fragment, {
          children: [jsxRuntime.jsx("div", {
            className: "text-center mb-4",
            children: jsxRuntime.jsxs("span", {
              className: "text-sm text-gray-500",
              children: ["Thẻ ", d + 1, " / ", l.length]
            })
          }), jsxRuntime.jsx(FlashcardPaper, {
            front: B?.front, back: B?.back, flipped: p, index: d, onFlip: () => m(value => !value)
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center justify-center gap-4 mb-6",
            children: [jsxRuntime.jsx("button", {
              onClick: R,
              className: "p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition",
              title: "Thẻ trước (←)",
              children: jsxRuntime.jsx(gx, {
                className: "w-6 h-6 text-gray-600"
              })
            }), jsxRuntime.jsx("button", {
              onClick: () => m(!p),
              className: "p-3 bg-amber-100 hover:bg-amber-200 rounded-xl transition",
              title: "Lật thẻ (Space)",
              children: jsxRuntime.jsx(xx, {
                className: "w-6 h-6 text-amber-600"
              })
            }), jsxRuntime.jsx("button", {
              onClick: L,
              className: "p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition",
              title: "Thẻ sau (→)",
              children: jsxRuntime.jsx(_u, {
                className: "w-6 h-6 text-gray-600"
              })
            })]
          }), jsxRuntime.jsx("div", {
            className: "flex justify-center gap-1.5 mb-6",
            children: l.map((q, V) => jsxRuntime.jsx("button", {
              'aria-label': `Đến thẻ ${V + 1}`,
              'aria-current': V === d ? 'step' : undefined,
              onClick: () => {
                f(V), m(!1);
              },
              className: `w-2.5 h-2.5 rounded-full transition ${V === d ? "bg-amber-500 scale-125" : "bg-gray-300 hover:bg-gray-400"}`
            }, V))
          }), r && jsxRuntime.jsxs("div", {
            className: "flex gap-3 justify-center border-t pt-4",
            children: [jsxRuntime.jsxs("button", {
              onClick: A,
              disabled: E.isPending,
              className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2",
              children: [jsxRuntime.jsx(a5, {
                className: "w-4 h-4"
              }), "Tạo lại"]
            }), jsxRuntime.jsxs("button", {
              onClick: () => C.mutate(),
              disabled: C.isPending,
              className: "px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50",
              children: [C.isPending ? jsxRuntime.jsx(Ke, {
                className: "w-4 h-4 animate-spin"
              }) : x ? jsxRuntime.jsx(pw, {
                className: "w-4 h-4"
              }) : jsxRuntime.jsx(fy, {
                className: "w-4 h-4"
              }), x ? "Đã lưu!" : "Lưu Flash Card"]
            })]
          }), C.isError && jsxRuntime.jsx('p', { role: 'alert', className: 'text-center text-red-600 mt-3', children: C.error?.response?.data?.error || 'Không lưu được thẻ. Vui lòng thử lại.' }), !r && jsxRuntime.jsxs("div", {
            className: "text-center text-sm text-gray-500 border-t pt-4",
            children: [jsxRuntime.jsx("a", {
              href: "/login",
              className: "text-amber-600 hover:underline",
              children: "Đăng nhập"
            }), " ", "để lưu Flash Card"]
          })]
        })]
      }), l.length > 0 && jsxRuntime.jsx("div", {
        className: "bg-gray-50 px-6 py-3 border-t",
        children: jsxRuntime.jsxs("div", {
          className: "flex justify-center gap-6 text-xs text-gray-500",
          children: [jsxRuntime.jsx("span", {
            children: "← → Di chuyển"
          }), jsxRuntime.jsx("span", {
            children: "Space Lật thẻ"
          }), jsxRuntime.jsx("span", {
            children: "Esc Đóng"
          })]
        })
      })]
    }), jsxRuntime.jsx("style", {
      children: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `
    })]
  }), document.body);
}
export { FlashcardDialog };
