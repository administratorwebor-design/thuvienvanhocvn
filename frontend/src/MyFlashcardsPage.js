import { FlashcardPaper } from './FlashcardPaper.jsx';
// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { useQueryClient, React, useQuery, apiClient, useMutation, jsxRuntime, Xa, Link, Ke, nn, Od, ta, Bn, gx, xx, _u } from './runtime.js';
function MyFlashcardsPage() {
  const {
      user: t
    } = useAuth(),
    e = useQueryClient(),
    [n, i] = React.useState(null),
    [r, l] = React.useState(0),
    [o, d] = React.useState(!1),
    {
      data: f,
      isLoading: p,
      error: m
    } = useQuery({
      queryKey: ["my-flashcards"],
      queryFn: async () => (await apiClient.get("/flashcards/my-cards")).data,
      enabled: !!t
    }),
    x = useMutation({
      mutationFn: async C => (await apiClient.delete(`/flashcards/${C}`)).data,
      onSuccess: () => {
        e.invalidateQueries({
          queryKey: ["my-flashcards"]
        }), i(null);
      }
    }),
    w = () => {
      n && (d(!1), l(C => C === 0 ? n.cards.length - 1 : C - 1));
    },
    _ = () => {
      n && (d(!1), l(C => C === n.cards.length - 1 ? 0 : C + 1));
    };
  React.useEffect(() => {
    if (!n) return;
    const C = A => {
      switch (A.key) {
        case "ArrowLeft":
          w();
          break;
        case "ArrowRight":
          _();
          break;
        case " ":
          A.preventDefault(), d(R => !R);
          break;
        case "Escape":
          i(null);
          break;
      }
    };
    return window.addEventListener("keydown", C), () => window.removeEventListener("keydown", C);
  }, [n, r]);
  const k = C => new Date(C).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  if (!t) return jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: [jsxRuntime.jsx("div", {
      className: "w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4",
      children: jsxRuntime.jsx(Xa, {
        className: "w-10 h-10 text-amber-500"
      })
    }), jsxRuntime.jsx("h2", {
      className: "text-2xl font-bold text-gray-800 mb-2",
      children: "Đăng nhập để xem Flash Card"
    }), jsxRuntime.jsx("p", {
      className: "text-gray-500 mb-6",
      children: "Bạn cần đăng nhập để xem các bộ Flash Card đã lưu"
    }), jsxRuntime.jsx(Link, {
      to: "/login",
      className: "inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition",
      children: "Đăng nhập"
    })]
  });
  if (p) return jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: [jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-amber-500 mx-auto mb-4"
    }), jsxRuntime.jsx("p", {
      className: "text-gray-500",
      children: "Đang tải Flash Card..."
    })]
  });
  if (m) return jsxRuntime.jsx("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: jsxRuntime.jsx("p", {
      className: "text-red-500",
      children: "Không thể tải Flash Card. Vui lòng thử lại."
    })
  });
  const E = f?.flashcards || [];
  return jsxRuntime.jsxs("div", {
    className: "max-w-6xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs("div", {
      className: "mb-8",
      children: [jsxRuntime.jsxs("h1", {
        className: "text-3xl font-bold text-gray-800 flex items-center gap-3",
        children: [jsxRuntime.jsx("div", {
          className: "w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center",
          children: jsxRuntime.jsx(Xa, {
            className: "w-6 h-6 text-white"
          })
        }), "Flash Card của tôi"]
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500 mt-2",
        children: "Ôn tập kiến thức với các bộ Flash Card đã lưu"
      })]
    }), E.length === 0 && jsxRuntime.jsxs("div", {
      className: "text-center py-16 bg-gray-50 rounded-2xl",
      children: [jsxRuntime.jsx("div", {
        className: "w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4",
        children: jsxRuntime.jsx(Xa, {
          className: "w-10 h-10 text-amber-400"
        })
      }), jsxRuntime.jsx("h3", {
        className: "text-xl font-semibold text-gray-800 mb-2",
        children: "Chưa có Flash Card nào"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500 mb-6",
        children: "Hãy tạo Flash Card từ các bài học bạn đã đọc"
      }), jsxRuntime.jsxs(Link, {
        to: "/storybooks",
        className: "inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition",
        children: [jsxRuntime.jsx(nn, {
          className: "w-5 h-5"
        }), "Xem danh sách bài học"]
      })]
    }), E.length > 0 && jsxRuntime.jsx("div", {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      children: E.map(C => jsxRuntime.jsxs("div", {
        className: "bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group",
        onClick: () => {
          i(C), l(0), d(!1);
        },
        children: [jsxRuntime.jsxs("div", {
          className: "h-32 bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden",
          children: [C.storybook?.thumbnail ? jsxRuntime.jsx("img", {
            src: C.storybook.thumbnail,
            alt: C.title,
            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          }) : jsxRuntime.jsx("div", {
            className: "w-full h-full flex items-center justify-center",
            children: jsxRuntime.jsx(Xa, {
              className: "w-12 h-12 text-amber-400"
            })
          }), jsxRuntime.jsxs("div", {
            className: "absolute top-2 right-2 bg-white/90 text-amber-600 text-xs font-semibold px-2 py-1 rounded-full",
            children: [C.cards.length, " thẻ"]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "p-4",
          children: [jsxRuntime.jsx("h3", {
            className: "font-semibold text-gray-800 mb-1 line-clamp-2",
            children: C.title
          }), jsxRuntime.jsx("p", {
            className: "text-sm text-gray-500 mb-3 line-clamp-1",
            children: C.storybook?.title || "Bài học"
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center justify-between",
            children: [jsxRuntime.jsxs("span", {
              className: "text-xs text-gray-400 flex items-center gap-1",
              children: [jsxRuntime.jsx(Od, {
                className: "w-3 h-3"
              }), k(C.updatedAt)]
            }), jsxRuntime.jsx("button", {
              onClick: A => {
                A.stopPropagation(), confirm("Bạn có chắc muốn xóa bộ Flash Card này?") && x.mutate(C._id);
              },
              className: "p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition",
              children: jsxRuntime.jsx(ta, {
                className: "w-4 h-4"
              })
            })]
          })]
        })]
      }, C._id))
    }), n && jsxRuntime.jsxs("div", {
      className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
      children: [jsxRuntime.jsxs("div", {
        className: "bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl",
        children: [jsxRuntime.jsxs("div", {
          className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 flex items-center justify-between",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("h2", {
              className: "font-bold text-lg",
              children: n.title
            }), jsxRuntime.jsx("p", {
              className: "text-amber-100 text-sm",
              children: n.storybook?.title
            })]
          }), jsxRuntime.jsx("button", {
            onClick: () => i(null),
            className: "p-2 hover:bg-white/20 rounded-lg transition",
            children: jsxRuntime.jsx(Bn, {
              className: "w-5 h-5"
            })
          })]
        }), jsxRuntime.jsxs("div", {
          className: "p-6",
          children: [jsxRuntime.jsx("div", {
            className: "text-center mb-4",
            children: jsxRuntime.jsxs("span", {
              className: "text-sm text-gray-500",
              children: ["Thẻ ", r + 1, " / ", n.cards.length]
            })
          }), jsxRuntime.jsx(FlashcardPaper, {
            front: n.cards[r]?.front, back: n.cards[r]?.back, flipped: o, index: r, onFlip: () => d(value => !value)
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center justify-center gap-4 mb-6",
            children: [jsxRuntime.jsx("button", {
              onClick: w,
              className: "p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition",
              children: jsxRuntime.jsx(gx, {
                className: "w-6 h-6 text-gray-600"
              })
            }), jsxRuntime.jsx("button", {
              onClick: () => d(!o),
              className: "p-3 bg-amber-100 hover:bg-amber-200 rounded-xl transition",
              children: jsxRuntime.jsx(xx, {
                className: "w-6 h-6 text-amber-600"
              })
            }), jsxRuntime.jsx("button", {
              onClick: _,
              className: "p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition",
              children: jsxRuntime.jsx(_u, {
                className: "w-6 h-6 text-gray-600"
              })
            })]
          }), jsxRuntime.jsx("div", {
            className: "flex justify-center gap-1.5 flex-wrap",
            children: n.cards.map((C, A) => jsxRuntime.jsx("button", {
              onClick: () => {
                l(A), d(!1);
              },
              className: `w-2.5 h-2.5 rounded-full transition ${A === r ? "bg-amber-500 scale-125" : "bg-gray-300 hover:bg-gray-400"}`
            }, A))
          })]
        }), jsxRuntime.jsx("div", {
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
    })]
  });
}
export { MyFlashcardsPage };
