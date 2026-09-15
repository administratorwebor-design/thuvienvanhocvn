import { React } from "./runtime.js";
import { videoLink } from '../../shared/video-links.js';
let youtubeReady;
function loadYoutube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return (youtubeReady ||= new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => {
      youtubeReady = null;
      reject(Error("Không tải được YouTube."));
    };
    document.head.append(script);
  }));
}
export function ClassroomVideo({ url, title, thumbnail, onProgress }) {
  const container = React.useRef(null),
    callback = React.useRef(onProgress),
    [error, setError] = React.useState("");
  callback.current = onProgress;
  let id, drive;
  try { id = videoLink(url, 'youtube').id; } catch {}
  try { drive = videoLink(url, 'drive').embed; } catch {}
  React.useEffect(() => {
    if (!id) return;
    let disposed = false,
      player,
      timer;
    setError("");
    loadYoutube()
      .then((YT) => {
        if (disposed) return;
        const target = document.createElement("div");
        container.current.append(target);
        player = new YT.Player(target, {
          videoId: id,
          width: "100%",
          height: "100%",
          playerVars: { origin: location.origin, rel: 0 },
          events: {
            onReady: () => {
              timer = setInterval(() => {
                const position = player.getCurrentTime?.(),
                  total = player.getDuration?.();
                if (position > 0 && total > 0)
                  callback.current?.({ position, total, unit: "seconds" });
              }, 10000);
            },
            onError: () =>
              setError(
                "YouTube chưa phát được video. Bạn có thể mở bản gốc bên dưới.",
              ),
          },
        });
      })
      .catch((e) => !disposed && setError(e.message));
    return () => {
      disposed = true;
      clearInterval(timer);
      player?.destroy();
    };
  }, [id]);
  return (
    <>
      <div
        className="class-video"
        style={{ aspectRatio: "16 / 9", width: "100%", background: "#101923" }}
      >
        {id ? (
          <div ref={container} style={{ height: "100%", width: "100%" }} />
        ) : drive ? (
          <iframe title={title} src={drive} allow="autoplay; fullscreen" allowFullScreen style={{width:'100%',height:'100%',border:0}} />
        ) : (
          <video
            title={title}
            controls
            poster={thumbnail}
            src={url}
            style={{ width: "100%", height: "100%" }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration > 0 && Number.isFinite(v.duration))
                callback.current?.({
                  position: v.currentTime,
                  total: v.duration,
                  unit: "seconds",
                });
            }}
          />
        )}
      </div>
      {error && <p role="alert">{error}</p>}
      {drive && <p>Video Drive cần được chia sẻ quyền xem cho học sinh. Nếu chưa phát được, hãy mở video gốc. Drive không cung cấp vị trí xem cho bảng tiến độ.</p>}
      <a
        className="class-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Mở video gốc
      </a>
    </>
  );
}
