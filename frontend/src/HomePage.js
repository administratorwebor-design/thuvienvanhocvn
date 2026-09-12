// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, useQuery, apiClient, jsxRuntime, Ke, Link, i0, gx, _u, nn, lM, qi, aM, Tw, fw } from './runtime.js';
import { useCategories } from './useCategories.js';
function HomePage() {
  const { data: counts } = useQuery({ queryKey: ['public-stats'], queryFn: async () => (await apiClient.get('/stats')).data });
  const statistics = lM.map((item, index) => ({ ...item, value: counts ? [counts.storybooks, counts.students, counts.videos, counts.quizzes][index].toLocaleString('vi-VN') : '—', label: ['Story Book', 'Học viên', 'Video', 'Bài kiểm tra'][index] }));
  const [t, e] = React.useState(0),
    {
      data: n,
      isLoading: i
    } = useQuery({
      queryKey: ["banners"],
      queryFn: async () => (await apiClient.get("/banners")).data.banners
    }),
    {
      data: r
    } = useCategories();
  React.useEffect(() => {
    if (!n || n.length <= 1) return;
    const d = setInterval(() => {
      e(f => (f + 1) % n.length);
    }, 5e3);
    return () => clearInterval(d);
  }, [n]);
  const l = () => {
      n && e(d => (d + 1) % n.length);
    },
    o = () => {
      n && e(d => (d - 1 + n.length) % n.length);
    };
  return jsxRuntime.jsxs("div", {
    children: [jsxRuntime.jsx("section", {
      className: "relative",
      children: i ? jsxRuntime.jsx("div", {
        className: "h-[400px] bg-gray-200 flex items-center justify-center",
        children: jsxRuntime.jsx(Ke, {
          className: "w-8 h-8 animate-spin text-blue-600"
        })
      }) : n && n.length > 0 ? jsxRuntime.jsxs("div", {
        className: "relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden",
        children: [n.map((d, f) => jsxRuntime.jsxs("div", {
          className: `absolute inset-0 transition-opacity duration-500 ${f === t ? "opacity-100" : "opacity-0"}`,
          children: [jsxRuntime.jsx("img", {
            src: d.imageUrl,
            alt: d.title,
            className: "w-full h-full object-cover"
          }), !d.recoveredFrame && jsxRuntime.jsx("div", {
            className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          }), !d.recoveredFrame && jsxRuntime.jsx("div", {
            className: "absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white",
            children: jsxRuntime.jsxs("div", {
              className: "max-w-7xl mx-auto",
              children: [jsxRuntime.jsx("h2", {
                className: "text-2xl md:text-4xl font-bold mb-2",
                children: d.title
              }), d.description && jsxRuntime.jsx("p", {
                className: "text-sm md:text-lg text-gray-200 max-w-2xl",
                children: d.description
              }), d.linkUrl && jsxRuntime.jsxs(Link, {
                to: d.linkUrl,
                className: "inline-flex items-center gap-2 mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition",
                children: ["Xem thêm ", jsxRuntime.jsx(i0, {
                  className: "w-4 h-4"
                })]
              })]
            })
          })]
        }, d._id)), n.length > 1 && jsxRuntime.jsxs(jsxRuntime.Fragment, {
          children: [jsxRuntime.jsx("button", {
            onClick: o,
            className: "absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition",
            children: jsxRuntime.jsx(gx, {
              className: "w-6 h-6 text-white"
            })
          }), jsxRuntime.jsx("button", {
            onClick: l,
            className: "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition",
            children: jsxRuntime.jsx(_u, {
              className: "w-6 h-6 text-white"
            })
          })]
        }), n.length > 1 && jsxRuntime.jsx("div", {
          className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2",
          children: n.map((d, f) => jsxRuntime.jsx("button", {
            onClick: () => e(f),
            className: `w-2 h-2 rounded-full transition ${f === t ? "bg-white w-6" : "bg-white/50"}`
          }, f))
        })]
      }) : jsxRuntime.jsxs("div", {
        className: "h-[400px] md:h-[500px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center relative overflow-hidden",
        children: [jsxRuntime.jsxs("div", {
          className: "absolute inset-0",
          children: [jsxRuntime.jsx("div", {
            className: "absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          }), jsxRuntime.jsx("div", {
            className: "absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"
          }), jsxRuntime.jsx("div", {
            className: "absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full"
          })]
        }), jsxRuntime.jsxs("div", {
          className: "text-center text-white relative px-4",
          children: [jsxRuntime.jsx("div", {
            className: "w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6",
            children: jsxRuntime.jsx(nn, {
              className: "w-10 h-10 text-white"
            })
          }), jsxRuntime.jsx("h2", {
            className: "text-4xl md:text-6xl font-bold mb-4 tracking-tight",
            children: "Thư Viện Số Văn Học"
          }), jsxRuntime.jsx("p", {
            className: "text-xl md:text-2xl text-blue-100 mb-8",
            children: "Nền tảng học văn học trực tuyến"
          }), jsxRuntime.jsxs(Link, {
            to: "/storybooks",
            className: "inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition shadow-xl",
            children: ["Bắt đầu học ngay", jsxRuntime.jsx(i0, {
              className: "w-5 h-5"
            })]
          })]
        })]
      })
    }), jsxRuntime.jsx("section", {
      className: "py-12 px-4 bg-white",
      children: jsxRuntime.jsx("div", {
        className: "max-w-7xl mx-auto",
        children: jsxRuntime.jsx("div", {
          className: "grid grid-cols-2 lg:grid-cols-4 gap-6",
          children: statistics.map((d, f) => jsxRuntime.jsxs("div", {
            className: "text-center p-6",
            children: [jsxRuntime.jsx(d.icon, {
              className: `w-8 h-8 ${d.color} mx-auto mb-3`
            }), jsxRuntime.jsx("div", {
              className: "text-3xl font-bold text-gray-900",
              children: d.value
            }), jsxRuntime.jsx("div", {
              className: "text-sm text-gray-500",
              children: d.label
            })]
          }, f))
        })
      })
    }), jsxRuntime.jsx("section", {
      className: "py-16 px-4 bg-gray-50",
      children: jsxRuntime.jsxs("div", {
        className: "max-w-7xl mx-auto",
        children: [jsxRuntime.jsxs("div", {
          className: "text-center mb-12",
          children: [jsxRuntime.jsxs("span", {
            className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4",
            children: [jsxRuntime.jsx(qi, {
              className: "w-4 h-4"
            }), "Tính năng nổi bật"]
          }), jsxRuntime.jsx("h2", {
            className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4",
            children: "Khám phá nội dung học tập"
          }), jsxRuntime.jsx("p", {
            className: "text-gray-600 max-w-2xl mx-auto",
            children: "Hệ thống học tập trực tuyến với đa dạng nội dung từ truyện, video đến bài giảng tương tác"
          })]
        }), jsxRuntime.jsx("div", {
          className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6",
          children: aM.map(d => jsxRuntime.jsxs(Link, {
            to: d.link,
            className: "bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-6 group border border-gray-100 hover:border-transparent",
            children: [jsxRuntime.jsx("div", {
              className: `w-14 h-14 bg-gradient-to-br ${d.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`,
              children: jsxRuntime.jsx(d.icon, {
                className: "w-7 h-7 text-white"
              })
            }), jsxRuntime.jsx("h3", {
              className: "text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition",
              children: d.title
            }), jsxRuntime.jsx("p", {
              className: "text-sm text-gray-500 leading-relaxed",
              children: d.description
            }), jsxRuntime.jsxs("div", {
              className: `mt-4 inline-flex items-center gap-1 text-sm font-medium ${d.textColor}`,
              children: ["Xem thêm", jsxRuntime.jsx(i0, {
                className: "w-4 h-4 group-hover:translate-x-1 transition-transform"
              })]
            })]
          }, d.link))
        })]
      })
    }), r && r.length > 0 && jsxRuntime.jsx("section", {
      className: "py-16 px-4 bg-white",
      children: jsxRuntime.jsxs("div", {
        className: "max-w-7xl mx-auto",
        children: [jsxRuntime.jsxs("div", {
          className: "text-center mb-12",
          children: [jsxRuntime.jsxs("span", {
            className: "inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4",
            children: [jsxRuntime.jsx(Tw, {
              className: "w-4 h-4"
            }), "Phân loại theo chủ đề"]
          }), jsxRuntime.jsx("h2", {
            className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4",
            children: "Danh mục nội dung"
          }), jsxRuntime.jsx("p", {
            className: "text-gray-600",
            children: "Lựa chọn nội dung theo chủ đề bạn quan tâm"
          })]
        }), jsxRuntime.jsx("div", {
          className: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5",
          children: r.map((d, f) => {
            const p = [{
                bg: "bg-blue-50",
                icon: "bg-blue-500",
                text: "text-blue-600"
              }, {
                bg: "bg-emerald-50",
                icon: "bg-emerald-500",
                text: "text-emerald-600"
              }, {
                bg: "bg-purple-50",
                icon: "bg-purple-500",
                text: "text-purple-600"
              }, {
                bg: "bg-amber-50",
                icon: "bg-amber-500",
                text: "text-amber-600"
              }, {
                bg: "bg-rose-50",
                icon: "bg-rose-500",
                text: "text-rose-600"
              }, {
                bg: "bg-indigo-50",
                icon: "bg-indigo-500",
                text: "text-indigo-600"
              }],
              m = p[f % p.length];
            return jsxRuntime.jsxs(Link, {
              to: `/storybooks?category=${d._id}`,
              className: `${m.bg} rounded-xl p-5 hover:shadow-lg transition-all group border border-transparent hover:border-gray-200`,
              children: [jsxRuntime.jsx("div", {
                className: `w-12 h-12 ${m.icon} rounded-xl flex items-center justify-center mb-4 shadow-md`,
                children: jsxRuntime.jsx(nn, {
                  className: "w-6 h-6 text-white"
                })
              }), jsxRuntime.jsx("h4", {
                className: `font-bold text-gray-900 mb-1 group-hover:${m.text}`,
                children: d.name
              }), d.description && jsxRuntime.jsx("p", {
                className: "text-sm text-gray-600 line-clamp-2",
                children: d.description
              })]
            }, d._id);
          })
        })]
      })
    }), jsxRuntime.jsxs("section", {
      className: "py-20 px-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden",
      children: [jsxRuntime.jsxs("div", {
        className: "absolute inset-0 overflow-hidden",
        children: [jsxRuntime.jsx("div", {
          className: "absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        }), jsxRuntime.jsx("div", {
          className: "absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        })]
      }), jsxRuntime.jsxs("div", {
        className: "max-w-4xl mx-auto text-center text-white relative",
        children: [jsxRuntime.jsxs("span", {
          className: "inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-6",
          children: [jsxRuntime.jsx(fw, {
            className: "w-4 h-4"
          }), "Miễn phí hoàn toàn"]
        }), jsxRuntime.jsxs("h2", {
          className: "text-3xl md:text-5xl font-bold mb-6 leading-tight",
          children: ["Bắt đầu hành trình học tập", jsxRuntime.jsx("br", {}), "ngay hôm nay!"]
        }), jsxRuntime.jsx("p", {
          className: "text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto",
          children: "Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng học tập với hàng trăm bài giảng chất lượng"
        }), jsxRuntime.jsxs("div", {
          className: "flex flex-col sm:flex-row gap-4 justify-center",
          children: [jsxRuntime.jsx(Link, {
            to: "/register",
            className: "px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1",
            children: "Đăng ký ngay miễn phí"
          }), jsxRuntime.jsx(Link, {
            to: "/storybooks",
            className: "px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/50 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition",
            children: "Khám phá nội dung"
          })]
        })]
      })]
    })]
  });
}
export { HomePage };
