// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { React, pe, jsxRuntime } from './runtime.js';
function VideoPlayer({
  url: t,
  title: e,
  thumbnail: n,
  className: i = ""
}) {
  const {
      user: r
    } = useAuth(),
    l = React.useRef(null),
    o = React.useRef(null),
    d = r?.role === "admin",
    f = _ => _.includes("youtube.com") || _.includes("youtu.be") ? "youtube" : _.includes("vimeo.com") ? "vimeo" : _.includes("drive.google.com") ? "drive" : _.match(/\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i) || _.includes("minio") || _.includes(".derapi.") || _.includes("api-minio") || _.includes(":9000") || _.includes("/videos/") ? "direct" : "embed",
    p = _ => {
      const k = _.match(/\/d\/([a-zA-Z0-9_-]+)/);
      return k ? `https://drive.google.com/file/d/${k[1]}/preview` : _.includes("youtube.com/watch") ? `https://www.youtube.com/embed/${_.split("v=")[1]?.split("&")[0]}` : _.includes("youtu.be/") ? `https://www.youtube.com/embed/${_.split("youtu.be/")[1]?.split("?")[0]}` : _.includes("vimeo.com/") ? `https://player.vimeo.com/video/${_.split("vimeo.com/")[1]?.split("?")[0]}` : _;
    },
    m = f(t);
  React.useEffect(() => {
    if (m !== "direct" || !l.current) return;
    const _ = document.createElement("video-js");
    _.classList.add("vjs-big-play-centered", "vjs-fluid"), l.current.appendChild(_);
    const k = pe(_, {
      controls: !0,
      autoplay: !1,
      preload: "auto",
      fluid: !0,
      responsive: !0,
      aspectRatio: "16:9",
      poster: n,
      sources: [{
        src: t,
        type: "video/mp4"
      }],
      controlBar: {
        children: ["playToggle", "volumePanel", "currentTimeDisplay", "timeDivider", "durationDisplay", "progressControl", "remainingTimeDisplay", "playbackRateMenuButton", "fullscreenToggle"]
      },
      playbackRates: d ? [.5, 1, 1.25, 1.5, 2] : [1]
    });
    return d || k.on("contextmenu", E => {
      E.preventDefault();
    }), o.current = k, () => {
      o.current && (o.current.dispose(), o.current = null);
    };
  }, [t, n, d, m]);
  const x = () => {
    if (!d) return;
    const _ = document.createElement("a");
    _.href = t, _.download = e || "video.mp4", _.target = "_blank", document.body.appendChild(_), _.click(), document.body.removeChild(_);
  };
  if (m === "direct") return jsxRuntime.jsxs("div", {
    className: `relative w-full ${i}`,
    children: [jsxRuntime.jsx("div", {
      ref: l,
      "data-vjs-player": !0,
      onContextMenu: d ? void 0 : _ => _.preventDefault()
    }), d && jsxRuntime.jsxs("button", {
      onClick: x,
      className: "absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition",
      title: "Tải video xuống",
      children: [jsxRuntime.jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [jsxRuntime.jsx("path", {
          d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        }), jsxRuntime.jsx("polyline", {
          points: "7 10 12 15 17 10"
        }), jsxRuntime.jsx("line", {
          x1: "12",
          y1: "15",
          x2: "12",
          y2: "3"
        })]
      }), jsxRuntime.jsx("span", {
        className: "text-sm font-medium",
        children: "Tải xuống"
      })]
    }), jsxRuntime.jsx("style", {
      children: `
          .video-js {
            width: 100%;
            background-color: #000;
          }
          .video-js .vjs-tech {
            object-fit: contain;
          }
          .video-js .vjs-big-play-button {
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -40px;
            margin-top: -40px;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            line-height: 80px;
            border: none;
            background-color: rgba(37, 99, 235, 0.9);
          }
          .video-js:hover .vjs-big-play-button {
            background-color: rgba(37, 99, 235, 1);
          }
          .video-js .vjs-big-play-button .vjs-icon-placeholder:before {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .video-js .vjs-control-bar {
            background: linear-gradient(transparent, rgba(0,0,0,0.7));
          }
          ${d ? "" : `
            .video-js .vjs-tech {
              pointer-events: none;
            }
            .video-js video::-webkit-media-controls-enclosure {
              display: none !important;
            }
          `}
        `
    })]
  });
  const w = p(t);
  return jsxRuntime.jsx("div", {
    className: `relative w-full ${i}`,
    style: {
      paddingTop: "56.25%"
    },
    children: jsxRuntime.jsx("iframe", {
      src: w,
      referrerPolicy: "strict-origin-when-cross-origin",
      title: e,
      className: "absolute inset-0 w-full h-full border-0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",
      allowFullScreen: !0
    })
  });
}
export { VideoPlayer };
