// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { useNavigate, React, jsxRuntime, Link, nn, y0, Vf, to, Hl, ql, Xa, bw, xw, Bn, _w, wS } from './runtime.js';
import { LiteratureAssistant } from './LiteratureAssistant.js';
import { ClassroomGate } from './ClassroomGate.jsx';
function SiteLayout() {
  const {
      user: t,
      logout: e
    } = useAuth(),
    n = useNavigate(),
    [i, r] = React.useState(!1),
    [l, o] = React.useState(!1),
    d = () => {
      e(), n("/");
    };
  return jsxRuntime.jsxs("div", {
    className: "min-h-screen bg-gray-50",
    children: [jsxRuntime.jsxs("header", {
      className: "bg-white shadow-sm sticky top-0 z-50",
      children: [jsxRuntime.jsx("div", {
        className: "max-w-7xl mx-auto px-4",
        children: jsxRuntime.jsxs("div", {
          className: "flex items-center justify-between h-16",
          children: [jsxRuntime.jsxs(Link, {
            to: "/",
            className: "flex items-center gap-2.5",
            children: [jsxRuntime.jsx("div", {
              className: "w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md",
              children: jsxRuntime.jsx(nn, {
                className: "w-5 h-5 text-white"
              })
            }), jsxRuntime.jsxs("div", {
              className: "hidden sm:block",
              children: [jsxRuntime.jsx("h1", {
                className: "text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
                children: "Thư Viện Số Văn Học"
              }), jsxRuntime.jsx("p", {
                className: "text-[11px] text-gray-500 font-medium -mt-0.5",
                children: "Văn học trực tuyến"
              })]
            })]
          }), jsxRuntime.jsx("nav", {
            className: "hidden lg:flex items-center gap-1",
            children: (t ? [...y0, {path:'/classes',label:t.role === 'teacher' ? 'Lớp giảng dạy' : 'Lớp của tôi',icon:nn}] : y0).map(f => jsxRuntime.jsxs(Vf, {
              to: f.path,
              className: ({
                isActive: p
              }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${p ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`,
              children: [jsxRuntime.jsx(f.icon, {
                className: "w-4 h-4"
              }), jsxRuntime.jsx("span", {
                className: "text-sm font-medium",
                children: f.label
              })]
            }, f.path))
          }), jsxRuntime.jsxs("div", {
            className: "flex items-center gap-3",
            children: [t ? jsxRuntime.jsxs("div", {
              className: "relative",
              children: [jsxRuntime.jsxs("button", {
                onClick: () => o(!l),
                className: "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition",
                children: [jsxRuntime.jsx("div", {
                  className: "w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold",
                  children: t.fullName?.charAt(0) || "U"
                }), jsxRuntime.jsx("span", {
                  className: "hidden sm:block text-sm font-medium text-gray-700",
                  children: t.fullName
                })]
              }), l && jsxRuntime.jsxs(jsxRuntime.Fragment, {
                children: [jsxRuntime.jsx("div", {
                  className: "fixed inset-0 z-10",
                  onClick: () => o(!1)
                }), jsxRuntime.jsxs("div", {
                  className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20",
                  children: [jsxRuntime.jsxs("div", {
                    className: "p-3 border-b",
                    children: [jsxRuntime.jsx("p", {
                      className: "text-sm font-medium text-gray-900",
                      children: t.fullName
                    }), jsxRuntime.jsx("p", {
                      className: "text-xs text-gray-500",
                      children: t.email
                    })]
                  }), t.role === "admin" && jsxRuntime.jsxs(Link, {
                    to: "/admin",
                    className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                    onClick: () => o(!1),
                    children: [jsxRuntime.jsx(to, {
                      className: "w-4 h-4"
                    }), "Trang Admin"]
                  }), jsxRuntime.jsxs(Link, {
                    to: "/profile",
                    className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                    onClick: () => o(!1),
                    children: [jsxRuntime.jsx(to, {
                      className: "w-4 h-4"
                    }), "Hồ sơ cá nhân"]
                  }), jsxRuntime.jsxs(Link, {
                    to: "/my-results",
                    className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                    onClick: () => o(!1),
                    children: [jsxRuntime.jsx(Hl, {
                      className: "w-4 h-4"
                    }), "Kết quả học tập"]
                  }), jsxRuntime.jsxs(Link, {
                    to: "/my-quiz-history",
                    className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                    onClick: () => o(!1),
                    children: [jsxRuntime.jsx(ql, {
                      className: "w-4 h-4"
                    }), "Lịch sử trắc nghiệm AI"]
                  }), jsxRuntime.jsxs(Link, {
                    to: "/my-flashcards",
                    className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50",
                    onClick: () => o(!1),
                    children: [jsxRuntime.jsx(Xa, {
                      className: "w-4 h-4"
                    }), "Flash Card của tôi"]
                  }), jsxRuntime.jsxs("button", {
                    onClick: d,
                    className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50",
                    children: [jsxRuntime.jsx(bw, {
                      className: "w-4 h-4"
                    }), "Đăng xuất"]
                  })]
                })]
              })]
            }) : jsxRuntime.jsxs(Link, {
              to: "/login",
              className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
              children: [jsxRuntime.jsx(xw, {
                className: "w-4 h-4"
              }), jsxRuntime.jsx("span", {
                className: "text-sm font-medium",
                children: "Đăng nhập"
              })]
            }), jsxRuntime.jsx("button", {
              onClick: () => r(!i),
              className: "lg:hidden p-2 rounded-lg hover:bg-gray-100",
              children: i ? jsxRuntime.jsx(Bn, {
                className: "w-6 h-6"
              }) : jsxRuntime.jsx(_w, {
                className: "w-6 h-6"
              })
            })]
          })]
        })
      }), i && jsxRuntime.jsx("div", {
        className: "lg:hidden border-t bg-white",
        children: jsxRuntime.jsx("nav", {
          className: "p-4 space-y-1",
          children: (t ? [...y0, {path:'/classes',label:t.role === 'teacher' ? 'Lớp giảng dạy' : 'Lớp của tôi',icon:nn}] : y0).map(f => jsxRuntime.jsxs(Vf, {
            to: f.path,
            onClick: () => r(!1),
            className: ({
              isActive: p
            }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${p ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`,
            children: [jsxRuntime.jsx(f.icon, {
              className: "w-5 h-5"
            }), jsxRuntime.jsx("span", {
              className: "font-medium",
              children: f.label
            })]
          }, f.path))
        })
      })]
    }), jsxRuntime.jsx("main", {
      children: jsxRuntime.jsx(ClassroomGate, { children: jsxRuntime.jsx(wS, {}) })
    }), jsxRuntime.jsx("footer", {
      className: "bg-gray-900 text-white mt-16",
      children: jsxRuntime.jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-12",
        children: [jsxRuntime.jsxs("div", {
          className: "grid md:grid-cols-3 gap-8",
          children: [jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center gap-2.5 mb-4",
              children: [jsxRuntime.jsx("div", {
                className: "w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center",
                children: jsxRuntime.jsx(nn, {
                  className: "w-5 h-5 text-white"
                })
              }), jsxRuntime.jsxs("div", {
                children: [jsxRuntime.jsx("h3", {
                  className: "font-bold text-base",
                  children: "Thư Viện Số Văn Học"
                }), jsxRuntime.jsx("p", {
                  className: "text-xs text-gray-400",
                  children: "Văn học trực tuyến"
                })]
              })]
            }), jsxRuntime.jsx("p", {
              className: "text-sm text-gray-400 leading-relaxed",
              children: "Nền tảng học tập trực tuyến văn học với các bài giảng, video minh họa và bài kiểm tra đa dạng."
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("h4", {
              className: "font-semibold mb-4 text-white",
              children: "Khám phá"
            }), jsxRuntime.jsx("ul", {
              className: "space-y-3 text-sm",
              children: y0.map(f => jsxRuntime.jsx("li", {
                children: jsxRuntime.jsxs(Link, {
                  to: f.path,
                  className: "text-gray-400 hover:text-white transition flex items-center gap-2",
                  children: [jsxRuntime.jsx(f.icon, {
                    className: "w-4 h-4"
                  }), f.label]
                })
              }, f.path))
            })]
          }), jsxRuntime.jsxs("div", {
            children: [jsxRuntime.jsx("h4", {
              className: "font-semibold mb-4 text-white",
              children: "Liên hệ"
            }), jsxRuntime.jsxs("ul", {
              className: "space-y-3 text-sm text-gray-400",
              children: [jsxRuntime.jsxs("li", {
                className: "flex items-center gap-2",
                children: [jsxRuntime.jsx("span", {
                  className: "text-blue-400",
                  children: "📧"
                }), " tranhamh2907@gmail.com"]
              }), jsxRuntime.jsxs("li", {
                className: "flex items-center gap-2",
                children: [jsxRuntime.jsx("span", {
                  className: "text-green-400",
                  children: "📞"
                }), " 0981332695"]
              }), jsxRuntime.jsxs("li", {
                className: "flex items-start gap-2",
                children: [jsxRuntime.jsx("span", {
                  className: "text-red-400",
                  children: "📍"
                }), jsxRuntime.jsx("span", {
                  children: "Trường PTDTBT TH&THCS Na Ư"
                })]
              })]
            })]
          })]
        }), jsxRuntime.jsx("div", {
          className: "border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500",
          children: "© 2024 Thư Viện Số Văn Học - Trường PTDTBT TH&THCS Na Ư. All rights reserved."
        })]
      })
    }), jsxRuntime.jsx(LiteratureAssistant, {})]
  });
}
export { SiteLayout };
