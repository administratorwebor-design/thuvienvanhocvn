// Recovered from the surviving frontend bundle; local variable names are not original.
import { useAuth } from './useAuth.js';
import { useQuery, apiClient, jsxRuntime, Link, Ti, Ke, Hl, Fs, On, Cp } from './runtime.js';
function MyResultsPage() {
  const {
      user: t
    } = useAuth(),
    {
      data: e,
      isLoading: n
    } = useQuery({
      queryKey: ["my-results"],
      queryFn: async () => (await apiClient.get("/quizzes/my-results?limit=50")).data.results,
      enabled: !!t
    }),
    i = r => new Date(r).toLocaleString("vi-VN");
  return t ? jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-8",
    children: [jsxRuntime.jsxs(Link, {
      to: "/",
      className: "inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6",
      children: [jsxRuntime.jsx(Ti, {
        className: "w-4 h-4"
      }), " Về trang chủ"]
    }), jsxRuntime.jsx("h1", {
      className: "text-3xl font-bold text-gray-900 mb-2",
      children: "Kết quả học tập"
    }), jsxRuntime.jsx("p", {
      className: "text-gray-600 mb-8",
      children: "Xem lại lịch sử các bài kiểm tra bạn đã làm"
    }), n ? jsxRuntime.jsx("div", {
      className: "flex justify-center py-12",
      children: jsxRuntime.jsx(Ke, {
        className: "w-8 h-8 animate-spin text-purple-600"
      })
    }) : !e || e.length === 0 ? jsxRuntime.jsxs("div", {
      className: "bg-white rounded-xl shadow-sm p-12 text-center",
      children: [jsxRuntime.jsx(Hl, {
        className: "w-16 h-16 text-gray-300 mx-auto mb-4"
      }), jsxRuntime.jsx("h2", {
        className: "text-xl font-semibold text-gray-900 mb-2",
        children: "Chưa có kết quả nào"
      }), jsxRuntime.jsx("p", {
        className: "text-gray-500 mb-6",
        children: "Bạn chưa làm bài kiểm tra nào"
      }), jsxRuntime.jsx(Link, {
        to: "/quizzes",
        className: "inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700",
        children: "Làm bài kiểm tra ngay"
      })]
    }) : jsxRuntime.jsx("div", {
      className: "space-y-4",
      children: e.map(r => jsxRuntime.jsxs(Link, {
        to: `/my-results/${r._id}`,
        className: "block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer",
        children: [jsxRuntime.jsxs("div", {
          className: "flex items-start justify-between",
          children: [jsxRuntime.jsxs("div", {
            className: "flex-1",
            children: [jsxRuntime.jsx("h3", {
              className: "font-semibold text-gray-900 mb-2",
              children: r.quiz?.title
            }), jsxRuntime.jsxs("div", {
              className: "flex items-center gap-4 text-sm text-gray-500",
              children: [jsxRuntime.jsxs("span", {
                className: "flex items-center gap-1",
                children: [jsxRuntime.jsx(Fs, {
                  className: "w-4 h-4"
                }), i(r.submittedAt)]
              }), r.isGraded ? jsxRuntime.jsxs("span", {
                className: "flex items-center gap-1 text-green-600",
                children: [jsxRuntime.jsx(On, {
                  className: "w-4 h-4"
                }), "Đã chấm xong"]
              }) : jsxRuntime.jsxs("span", {
                className: "flex items-center gap-1 text-orange-600",
                children: [jsxRuntime.jsx(Fs, {
                  className: "w-4 h-4"
                }), "Đang chờ chấm"]
              })]
            })]
          }), jsxRuntime.jsxs("div", {
            className: "text-right",
            children: [jsxRuntime.jsxs("div", {
              className: "flex items-center gap-2",
              children: [jsxRuntime.jsx(Cp, {
                className: `w-5 h-5 ${r.percentage >= 80 ? "text-yellow-500" : r.percentage >= 50 ? "text-blue-500" : "text-gray-400"}`
              }), jsxRuntime.jsxs("span", {
                className: "text-2xl font-bold text-gray-900",
                children: [r.percentage, "%"]
              })]
            }), jsxRuntime.jsxs("p", {
              className: "text-sm text-gray-500",
              children: [r.totalScore, "/", r.maxScore, " điểm"]
            })]
          })]
        }), jsxRuntime.jsx("div", {
          className: "mt-4 h-2 bg-gray-200 rounded-full overflow-hidden",
          children: jsxRuntime.jsx("div", {
            className: `h-full rounded-full ${r.percentage >= 80 ? "bg-green-500" : r.percentage >= 50 ? "bg-blue-500" : "bg-red-500"}`,
            style: {
              width: `${r.percentage}%`
            }
          })
        })]
      }, r._id))
    })]
  }) : jsxRuntime.jsxs("div", {
    className: "max-w-4xl mx-auto px-4 py-12 text-center",
    children: [jsxRuntime.jsx("h2", {
      className: "text-xl font-semibold text-gray-900 mb-4",
      children: "Vui lòng đăng nhập"
    }), jsxRuntime.jsx(Link, {
      to: "/login",
      state: {
        from: "/my-results"
      },
      className: "text-purple-600 hover:underline",
      children: "Đăng nhập ngay"
    })]
  });
}
export { MyResultsPage };
