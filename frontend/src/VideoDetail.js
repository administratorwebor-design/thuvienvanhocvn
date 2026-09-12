// Recovered from the surviving frontend bundle; local variable names are not original.
import { useParams, useQuery, apiClient, jsxRuntime, Ke, as, Link, Ti, Fs, to, Ss, Od } from './runtime.js';
import { VideoPlayer } from './VideoPlayer.js';
function VideoDetail() {
  const {
      id: t
    } = useParams(),
    {
      data: e,
      isLoading: n,
      error: i
    } = useQuery({
      queryKey: ["video", t],
      queryFn: async () => (await apiClient.get(`/videos/${t}`)).data.video,
      enabled: !!t
    });
  if (n) return jsxRuntime.jsx("div", {
    className: "min-h-[60vh] flex items-center justify-center",
    children: jsxRuntime.jsx(Ke, {
      className: "w-8 h-8 animate-spin text-red-600"
    })
  });
  if (i || !e) return jsxRuntime.jsxs("div", {
    className: "min-h-[60vh] flex flex-col items-center justify-center",
    children: [jsxRuntime.jsx(as, {
      className: "w-16 h-16 text-gray-300 mb-4"
    }), jsxRuntime.jsx("p", {
      className: "text-gray-500 mb-4",
      children: "Không tìm thấy video"
    }), jsxRuntime.jsxs(Link, {
      to: "/videos",
      className: "flex items-center gap-2 text-red-600 hover:text-red-700",
      children: [jsxRuntime.jsx(Ti, {
        className: "w-4 h-4"
      }), "Quay lại danh sách"]
    })]
  });
  const r = l => {
    if (!l) return null;
    const o = Math.floor(l / 60),
      d = l % 60;
    return `${o}:${d.toString().padStart(2, "0")}`;
  };
  return jsxRuntime.jsxs("div", {
    className: "max-w-6xl mx-auto px-4 py-6",
    children: [jsxRuntime.jsx("div", {
      className: "mb-4",
      children: jsxRuntime.jsxs(Link, {
        to: "/videos",
        className: "inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition",
        children: [jsxRuntime.jsx(Ti, {
          className: "w-4 h-4"
        }), jsxRuntime.jsx("span", {
          children: "Quay lại Video Minh Họa"
        })]
      })
    }), jsxRuntime.jsx("div", {
      className: "bg-white rounded-2xl shadow-sm overflow-hidden mb-6",
      children: jsxRuntime.jsx(VideoPlayer, {
        url: e.url,
        title: e.title,
        thumbnail: e.thumbnail
      })
    }), jsxRuntime.jsxs("div", {
      className: "bg-white rounded-2xl shadow-sm p-6",
      children: [jsxRuntime.jsxs("div", {
        className: "flex flex-wrap items-start gap-3 mb-4",
        children: [jsxRuntime.jsx(Link, {
          to: `/videos?category=${e.category?._id}`,
          className: "px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition",
          children: e.category?.name
        }), e.duration && jsxRuntime.jsxs("span", {
          className: "px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1",
          children: [jsxRuntime.jsx(Fs, {
            className: "w-4 h-4"
          }), r(e.duration)]
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
            children: ["Tác giả / Kênh: ", jsxRuntime.jsx("span", {
              className: "font-medium text-gray-900",
              children: e.author
            })]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Ss, {
            className: "w-4 h-4 text-gray-400"
          }), jsxRuntime.jsxs("span", {
            children: [e.viewCount?.toLocaleString() || 0, " lượt xem"]
          })]
        }), jsxRuntime.jsxs("div", {
          className: "flex items-center gap-2",
          children: [jsxRuntime.jsx(Od, {
            className: "w-4 h-4 text-gray-400"
          }), jsxRuntime.jsx("span", {
            children: new Date(e.createdAt).toLocaleDateString("vi-VN")
          })]
        })]
      }), e.sourceUrl && jsxRuntime.jsx("a", {
        href: e.sourceUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-block text-blue-600 underline mb-4",
        children: "Xem video gốc trên YouTube"
      }), e.description && jsxRuntime.jsxs("div", {
        children: [jsxRuntime.jsx("h3", {
          className: "font-semibold text-gray-900 mb-2",
          children: "Mô tả"
        }), jsxRuntime.jsx("p", {
          className: "text-gray-600 leading-relaxed whitespace-pre-line",
          children: e.description
        })]
      })]
    })]
  });
}
export { VideoDetail };
