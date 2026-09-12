// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, jsxRuntime, Xa, qi, ql, J3, Bn } from './runtime.js';
import { StoryChat } from './StoryChat.js';
import { StoryQuiz } from './StoryQuiz.js';
import { FlashcardDialog } from './FlashcardDialog.js';
import { createPortal } from './runtime.js';
import './reading.css';
function StoryAssistantMenu({
  storybookId: t,
  storybookTitle: e
}) {
  const [n, i] = React.useState(!1),
    [r, l] = React.useState(!1),
    [o, d] = React.useState(!1),
    [f, p] = React.useState(() => !window.matchMedia('(max-width: 640px)').matches),
    m = e.length > 20 ? e.substring(0, 20) + "..." : e;
  return createPortal(jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [jsxRuntime.jsxs("div", {
      className: "story-tools flex flex-col items-end gap-3",
      style: { display: o || r ? 'none' : undefined },
      children: [f && !n && jsxRuntime.jsxs("div", {
        className: "story-tools-list flex flex-col gap-3",
        children: [jsxRuntime.jsxs("button", {
          onClick: () => d(!0),
          className: "group relative flex items-center gap-3 bg-white border-2 border-amber-200 hover:border-amber-400 rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200",
          children: [jsxRuntime.jsx("div", {
            className: "absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity"
          }), jsxRuntime.jsxs("div", {
            className: "relative w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md",
            children: [jsxRuntime.jsx(Xa, {
              className: "w-5 h-5 text-white"
            }), jsxRuntime.jsx("div", {
              className: "absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center",
              children: jsxRuntime.jsx(qi, {
                className: "w-2.5 h-2.5 text-green-800"
              })
            })]
          }), jsxRuntime.jsxs("div", {
            className: "relative text-left",
            children: [jsxRuntime.jsx("span", {
              className: "text-xs text-amber-600 font-semibold",
              children: "Flash Card AI"
            }), jsxRuntime.jsxs("p", {
              className: "text-xs text-gray-500",
              children: ['Thẻ ghi nhớ "', m, '"']
            })]
          })]
        }), jsxRuntime.jsxs("button", {
          onClick: () => l(!0),
          className: "group relative flex items-center gap-3 bg-white border-2 border-purple-200 hover:border-purple-400 rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200",
          children: [jsxRuntime.jsx("div", {
            className: "absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity"
          }), jsxRuntime.jsxs("div", {
            className: "relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md",
            children: [jsxRuntime.jsx(ql, {
              className: "w-5 h-5 text-white"
            }), jsxRuntime.jsx("div", {
              className: "absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center",
              children: jsxRuntime.jsx(qi, {
                className: "w-2.5 h-2.5 text-yellow-800"
              })
            })]
          }), jsxRuntime.jsxs("div", {
            className: "relative text-left",
            children: [jsxRuntime.jsx("span", {
              className: "text-xs text-purple-600 font-semibold",
              children: "Trắc nghiệm AI"
            }), jsxRuntime.jsxs("p", {
              className: "text-xs text-gray-500",
              children: ['Làm bài về "', m, '"']
            })]
          })]
        }), jsxRuntime.jsxs("button", {
          onClick: () => i(!0),
          className: "group relative flex items-center gap-3 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-200",
          children: [jsxRuntime.jsx("div", {
            className: "absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity"
          }), jsxRuntime.jsxs("div", {
            className: "relative w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md",
            children: [jsxRuntime.jsx(J3, {
              className: "w-5 h-5 text-white"
            }), jsxRuntime.jsx("div", {
              className: "absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center animate-pulse",
              children: jsxRuntime.jsx("span", {
                className: "w-2 h-2 bg-white rounded-full"
              })
            })]
          }), jsxRuntime.jsxs("div", {
            className: "relative text-left",
            children: [jsxRuntime.jsx("span", {
              className: "text-xs text-blue-600 font-semibold",
              children: "Hỏi AI về bài này"
            }), jsxRuntime.jsxs("p", {
              className: "text-xs text-gray-500",
              children: ['"', m, '"']
            })]
          })]
        })]
      }), !n && jsxRuntime.jsxs("button", {
        onClick: () => p(!f),
        'aria-label': f ? 'Thu gọn công cụ AI' : 'Mở công cụ AI',
        'aria-expanded': f,
        className: "relative group",
        children: [jsxRuntime.jsx("div", {
          className: "absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow opacity-70 blur-sm"
        }), jsxRuntime.jsx("div", {
          className: `relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${f ? "rotate-0" : "rotate-180"}`,
          children: f ? jsxRuntime.jsx(Bn, {
            className: "w-6 h-6 text-white"
          }) : jsxRuntime.jsxs(jsxRuntime.Fragment, {
            children: [jsxRuntime.jsx(qi, {
              className: "w-6 h-6 text-white"
            }), jsxRuntime.jsx("span", {
              className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce",
              children: "AI"
            })]
          })
        }), !f && jsxRuntime.jsx("span", {
          className: "absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity",
          children: "Mở công cụ AI"
        })]
      })]
    }), n && jsxRuntime.jsx(StoryChat, {
      storybookId: t,
      storybookTitle: e,
      onClose: () => i(!1)
    }), jsxRuntime.jsx(StoryQuiz, {
      storybookId: t,
      storybookTitle: e,
      isOpen: r,
      onClose: () => l(!1)
    }), jsxRuntime.jsx(FlashcardDialog, {
      storybookId: t,
      storybookTitle: e,
      isOpen: o,
      onClose: () => d(!1)
    }), jsxRuntime.jsx("style", {
      children: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `
    })]
  }), document.body);
}
export { StoryAssistantMenu };
