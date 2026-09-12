// Recovered from the surviving frontend bundle; local variable names are not original.
import { useParams, useQuery, apiClient, jsxRuntime, Ke, nn, Link, Ti, Vl, to, Ss, Od } from './runtime.js';
import { VideoPlayer } from './VideoPlayer.js';
import { StoryAssistantMenu } from './StoryAssistantMenu.js';
function StorybookDetail() {
  const {
      id: t
    } = useParams(),
    {
      data: e,
      isLoading: n,
      error: i
    } = useQuery({
      queryKey: ["storybook", t],
      queryFn: async () => (await apiClient.get(`/storybooks/${t}`)).data.storybook,
      enabled: !!t
    });
  if (n) return jsxRuntime.jsx("div", {
    className: "min-h-[60vh] flex items-center justify-center",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-blue-600"
    })
  });
  if (i || !e) return jsxRuntime.jsxs("div", {
    className: "min-h-[60vh] flex flex-col items-center justify-center",
    children: [jsxRuntime.jsx(nn, {
      className: "w-16 h-16 text-gray-300 mb-4"
    }), jsxRuntime.jsx("p", {
      className: "text-gray-500 mb-4",
      children: "Không tìm thấy nội dung"
    }), jsxRuntime.jsxs(Link, {
      to: "/storybooks",
      className: "flex items-center gap-2 text-blue-600 hover:text-blue-700",
      children: [jsxRuntime.jsx(Ti, {
        className: "w-4 h-4"
      }), "Quay lại danh sách"]
    })]
  });
  const r = f => f.match(/\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i) || f.includes("minio") || f.includes(".derapi.") || f.includes("api-minio") || f.includes(":9000"),
    l = (f, p) => {
      if (p === "video") {
        if (f.includes("youtube.com/watch")) return `https://www.youtube.com/embed/${f.split("v=")[1]?.split("&")[0]}`;
        if (f.includes("youtu.be/")) return `https://www.youtube.com/embed/${f.split("youtu.be/")[1]?.split("?")[0]}`;
        if (f.includes("vimeo.com/")) return `https://player.vimeo.com/video/${f.split("vimeo.com/")[1]?.split("?")[0]}`;
      }
      return f;
    },
    o = e.type === "video" && r(e.url),
    d = o ? "" : l(e.url, e.type);
  return jsxRuntime.jsxs("div", {
    className: "max-w-6xl mx-auto px-4 py-6",
    children: [jsxRuntime.jsx("div", {
      className: "mb-4",
      children: jsxRuntime.jsxs(Link, {
        to: "/storybooks",
        className: "inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition",
        children: [jsxRuntime.jsx(Ti, {
          className: "w-4 h-4"
        }), jsxRuntime.jsx("span", {
          children: "Quay lại Story Book"
        })]
      })
    }), jsxRuntime.jsx("div", {
      className: "bg-white rounded-2xl shadow-sm overflow-hidden mb-6",
      children: o ? jsxRuntime.jsx(VideoPlayer, {
        url: e.url,
        title: e.title,
        thumbnail: e.thumbnail
      }) : jsxRuntime.jsx("div", {
        className: "relative w-full",
        style: {
          ...(d.startsWith('/reference/') ? { height: 'min(820px, 84svh)', minHeight: '540px' } : { paddingTop: "56.25%" })
        },
        children: jsxRuntime.jsx("iframe", {
          src: d,
          sandbox: "allow-scripts allow-forms allow-popups allow-presentation",
          title: e.title,
          className: "absolute inset-0 w-full h-full border-0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",
          allowFullScreen: !0
        })
      })
    }), jsxRuntime.jsxs("div", {
      className: "bg-white rounded-2xl shadow-sm p-6",
      children: [jsxRuntime.jsxs("div", {
        className: "flex flex-wrap items-start gap-3 mb-4",
        children: [jsxRuntime.jsx("span", {
          className: `px-3 py-1.5 rounded-full text-sm font-medium ${e.type === "video" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`,
          children: e.type === "video" ? jsxRuntime.jsxs("span", {
            className: "flex items-center gap-1",
            children: [jsxRuntime.jsx(Vl, {
              className: "w-4 h-4"
            }), " Video"]
          }) : jsxRuntime.jsxs("span", {
            className: "flex items-center gap-1",
            children: [jsxRuntime.jsx(nn, {
              className: "w-4 h-4"
            }), " Flipbook"]
          })
        }), jsxRuntime.jsx(Link, {
          to: `/storybooks?category=${e.category?._id}`,
          className: "px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition",
          children: e.category?.name
        })]
      }), jsxRuntime.jsx("h1", {
        className: "text-2xl md:text-3xl font-bold text-gray-900 mb-4",
        children: e.title
      }), jsxRuntime.jsxs("div", {
        className: "flex flex-wrap gap-6 text-sm text-gray-600 border-b pb-4 mb-4",
        children: [e.author && jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(to, {
            className: "w-4 h-4 text-gray-400"
          }), jsxRuntime.jsxs("span", {
            children: ["Tác giả: ", jsxRuntime.jsx("span", {
              className: "font-medium text-gray-900",
              children: e.author
            })]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Ss, {
            className: "w-4 h-4 text-gray-400"
          }), jsxRuntime.jsxs("span", {
            children: [e.viewCount.toLocaleString(), " lượt xem"]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Od, {
            className: "w-4 h-4 text-gray-400"
          }), jsxRuntime.jsx("span", {
            children: new Date(e.createdAt).toLocaleDateString("vi-VN")
          })]
        })]
      }), e.description && jsxRuntime.jsxs("div", {
        children: [jsxRuntime.jsx("h3", {
          className: "font-semibold text-gray-900 mb-2",
          children: "Mô tả"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600 leading-relaxed whitespace-pre-line",
          children: e.description
        })]
      })]
    }), localStorage.getItem("token") && jsxRuntime.jsx(StoryAssistantMenu, {
      storybookId: e._id,
      storybookTitle: e.title
    })]
  });
}
export { StorybookDetail };
